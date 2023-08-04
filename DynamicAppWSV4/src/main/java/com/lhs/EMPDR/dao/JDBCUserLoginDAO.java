
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.MessageJSON;
import com.lhs.EMPDR.Model.LoginModel;

import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.InputStream;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Random;

//import oracle.jdbc.pool.OraclePooledConnection;
/**
 *
 * @author premkumar.agrawal
 */
public class JDBCUserLoginDAO {

    public Connection connection = null;
    public Util utl = new Util();

    public JDBCUserLoginDAO(Connection connection) {
        this.connection = connection;
        U u = new U(this.connection);
    }

    public LoginModel authenticateUser(String userID, String password, String deviceId, String deviceName, String notificationToken, String appKey, String appkeyValidationFlag, String OTPFlag, String type, String buildVersion) {
        LoginModel model = new LoginModel();
//        OTPFlag = "O";
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String encryptFlag = "";
        StringBuilder stringBuffer = new StringBuilder();
        String mobileNo = "";
        U.log("notificationToken : " + notificationToken);
//        System.out.println("OTGFlag : " + OTPFlag);
        try {
            String encryptCheckSQL = "select t.encrypted_password from view_default_user_links t";
            preparedStatement = connection.prepareStatement(encryptCheckSQL);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                encryptFlag = resultSet.getString(1);
            }
        } catch (Exception e) {
        }

        try {
            if (encryptFlag.equals("T")) {
                stringBuffer.append("select u.emp_code,u.user_code,initcap(u.user_name) userName,u.ENTITY, u.DIVISION, u.ACC_YEAR, u.DEPT_CODE,v.module,v.bill_entry_catg_preference, T.DASHBOARD_LINK  from user_mast u,LHSSYS_USER_APP_KEY_VALIDATION v, LHSSYS_PORTAL_TAB_MAST T where u.user_code=v.user_code and (u.user_code= '").append(userID.toUpperCase()).append("'  or u.email='").append(userID).append("' or 'u.mobile'='").append(userID).append("' )  and u.password = lhs_utility.get_encrypt('").append(password).append("')  and v.default_app_selection='T' and v.device_name='").append(deviceName).append("'   and V.Module = T.TAB_ID and v.device_id='").append(deviceId).append("'");
            } else {
                stringBuffer.append("select u.emp_code,u.user_code,initcap(u.user_name) userName,u.ENTITY, u.DIVISION, u.ACC_YEAR, u.DEPT_CODE,v.module,v.bill_entry_catg_preference, T.DASHBOARD_LINK  from user_mast u,LHSSYS_USER_APP_KEY_VALIDATION v, LHSSYS_PORTAL_TAB_MAST T where u.user_code=v.user_code and (u.user_code= '").append(userID.toUpperCase()).append("'  or u.email='").append(userID).append("' or 'u.mobile'='").append(userID).append("' )  and u.password = '").append(password).append("'  and v.default_app_selection='T' and v.device_name='").append(deviceName).append("'   and V.Module = T.TAB_ID and v.device_id='").append(deviceId).append("'");
            }

            if (type != null && !type.isEmpty()) {
                U.log("typr--> " + type);
                if (type == "crm" || type.equalsIgnoreCase("crm")) {
                    stringBuffer = new StringBuilder();

                    stringBuffer.append("select u.emp_code,u.user_code, "
                            + "         u.login_id acc_code,"
                            + "         u.mobile, "
                            + "u.v_mobile,"
                            + "         lhs_utility.get_name('ACC_CODE', u.login_id) acc_name,"
                            + "       initcap(u.Client_name) userName, "
                            + "       u.Entity_code entity, "
                            + "       u.Div_code DIVISION, "
                            + "       u.geo_org_code, "
                            + " (select M.GEO_ORG_NAME  from view_geo_org_mast m where m.GEO_ORG_CODE=u.geo_ORG_CODE and rownum=1) geo_org_name, "
                            + "       '' ACC_YEAR, "
                            + "       '' DEPT_CODE, "
                            + "       v.module, v.bill_entry_catg_preference, "
                            + "       u.user_level, "
                            + "       T.DASHBOARD_LINK, "
                            + "       u.LOGIN_USER_FLAG, "
                            + "       u.LOCATION_TRACK_INTERVAL, "
                            + "       u.LOCATION_TRACK_FLAG "
                            + "  from view_client_login_mast   u, "
                            + "       LHSSYS_USER_APP_KEY_VALIDATION v, "
                            + "       LHSSYS_PORTAL_TAB_MAST         T "
                            + " where u.login_id = v.user_code and "
                            + "    u.login_id = '" + userID.toUpperCase() + "' "
                            + "   and u.password = '" + password + "' "
                            + "   and v.appkey = '" + appKey.toUpperCase() + "'"
                            + "   and v.default_app_selection = 'T' "
                            //                            + " and NVL(u.v_mobile, '#') = NVL(v.mobile, '#')"
                            //                            + " and v.appkey ='" + appKey + "'"
                            + "   and V.Module = T.TAB_ID ");
//                            + "   and v.device_name = '" + deviceName + "' "
//                            + "   and v.device_id = '" + deviceId + "'");
                }
            }
            U.log("login sql--> " + stringBuffer.toString());
            preparedStatement = connection.prepareStatement(stringBuffer.toString());
            resultSet = preparedStatement.executeQuery();
            U.log("RESULT SET  : " + resultSet);
//            U.log("USER LOGIN SQL : " + stringBuffer.toString());
            if (resultSet != null && resultSet.next()) {
                updateLoginLog(userID);
                U.log("RESULT SET  : " + resultSet.getString("user_code"));
                model.setUser_code(resultSet.getString("user_code"));
                model.setUserName(resultSet.getString("userName"));
                model.setMessage("User is authenticated");
                model.setModule(resultSet.getString("module"));
                model.setBill_entry_catg_preference(resultSet.getString("bill_entry_catg_preference"));
                model.setAcc_year(resultSet.getString("Acc_year"));
                model.setDept_code(resultSet.getString("Dept_code"));
                model.setDivision(resultSet.getString("Division"));
                model.setEntity_code(resultSet.getString("entity"));
                model.setDashboardLink(resultSet.getString("DASHBOARD_LINK"));
                U.log("EMP CODE:==" + resultSet.getString("emp_code"));
                model.setEmp_code(resultSet.getString("emp_code"));
                model.setAcc_code(resultSet.getString("acc_code"));
                model.setAcc_name(resultSet.getString("acc_name"));
                model.setLogin_user_flag(resultSet.getString("login_user_flag"));
                model.setGeo_org_code(resultSet.getString("geo_org_code"));
                model.setGeo_org_name(resultSet.getString("geo_org_name"));
                model.setUser_level(resultSet.getString("user_level"));
                model.setMobileNo(resultSet.getString("v_mobile"));
                model.setLocation_track_interval(resultSet.getString("LOCATION_TRACK_INTERVAL"));
                model.setLocation_track_flag(resultSet.getString("LOCATION_TRACK_FLAG"));
                mobileNo = resultSet.getString("v_mobile");
                String topic = "";
                try {
                    preparedStatement = connection.prepareStatement("select PUSH_ALERT_TOPIC from LHSSYS_USER_APP_KEY_VALIDATION where user_code= '" + userID.toUpperCase() + "'");
                    ResultSet rs = preparedStatement.executeQuery();
                    if (rs != null && rs.next()) {
                        topic = rs.getString("PUSH_ALERT_TOPIC");
                    }
                } catch (SQLException e) {
                    U.errorLog("PUSH_ALERT_TOPIC ERROR--> " + e.getMessage());
                }

                String latestBuildVersion = null;
                try {
                    preparedStatement = connection.prepareStatement("select access_control from lhssys_portal_tab_mast m where m.user_type_flag is not null and m.dashboard_link = 'V' and m.user_type_flag='" + model.getLogin_user_flag() + "'");
                    ResultSet rs = preparedStatement.executeQuery();
                    if (rs != null && rs.next()) {
                        latestBuildVersion = (rs.getString(1) != null ? rs.getString(1) : "");
                    }
                } catch (SQLException e) {
                    U.errorLog("access_control ERROR--> " + e.getMessage());
                }

                try {
                    U.log(latestBuildVersion + "--" + buildVersion);
                    if ((latestBuildVersion != null && latestBuildVersion != "") && latestBuildVersion.equalsIgnoreCase(buildVersion)) {
                        // update geooreg code to module 
                        try {
                            String updateQuery = "update LHSSYS_USER_APP_KEY_VALIDATION l set l.module = l.geo_org_code where l.user_code='" + userID.toUpperCase() + "'";
                            PreparedStatement prepS = null;
                            prepS = connection.prepareStatement(updateQuery);
                            int count = prepS.executeUpdate();
                            if (count > 0) {
                                U.log("==Module Updated==");
                                try {
                                    preparedStatement = connection.prepareStatement("select v.module from LHSSYS_USER_APP_KEY_VALIDATION v where v.user_code='" + userID.toUpperCase() + "'");
                                    ResultSet rs = preparedStatement.executeQuery();
                                    if (rs != null && rs.next()) {
                                        String module = rs.getString(1);
                                        model.setModule(module);
                                    }
                                } catch (SQLException e) {
                                    U.errorLog("module ERROR--> " + e.getMessage());
                                }
                            } else {
                                U.log("==Module Not Updated==");
                            }
                        } catch (SQLException se) {
                            se.printStackTrace();
                        }

                    }
//                    else{
//                         String updateQuery = "update LHSSYS_USER_APP_KEY_VALIDATION l set l.module = '"+ model.getModule() +"' where l.user_code='" + model.getUser_code() + "'";
//                            PreparedStatement prepS = null;
//                            prepS = connection.prepareStatement(updateQuery);
//                            int count = prepS.executeUpdate();
//                        
//                    }
                        model = validateDeviceId(userID, deviceId, deviceName, notificationToken, appKey, appkeyValidationFlag, model, mobileNo, buildVersion);

//                    if (validate) {
//
//                        U.log("validate successfully");
//                    } else {
//                        U.log("validate unsuccessfull");
//                        model.setMessage("Invalid credentials or device ID");
//                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
                model.setNotif_topic(topic);
            } else if (1 == 1) {

                U.log("login sql 2--> " + stringBuffer.toString().replace("'" + appKey.toUpperCase() + "'", "'.'"));
                preparedStatement = connection.prepareStatement(stringBuffer.toString().replace("'" + appKey.toUpperCase() + "'", "'.'"));
                resultSet = preparedStatement.executeQuery();
                if (resultSet != null && resultSet.next()) {
                    updateLoginLog(userID);
                    U.log("RESULT SET  : " + resultSet.getString("user_code"));
                    model.setUser_code(resultSet.getString("user_code"));
                    model.setUserName(resultSet.getString("userName"));
                    model.setMessage("User is authenticated");
                    model.setModule(resultSet.getString("module"));
                    model.setBill_entry_catg_preference(resultSet.getString("bill_entry_catg_preference"));
                    model.setAcc_year(resultSet.getString("Acc_year"));
                    model.setDept_code(resultSet.getString("Dept_code"));
                    model.setDivision(resultSet.getString("Division"));
                    model.setEntity_code(resultSet.getString("entity"));
                    model.setDashboardLink(resultSet.getString("DASHBOARD_LINK"));
                    U.log("EMP CODE:==" + resultSet.getString("emp_code"));
                    model.setEmp_code(resultSet.getString("emp_code"));
                    model.setAcc_code(resultSet.getString("acc_code"));
                    model.setAcc_name(resultSet.getString("acc_name"));
//                    model.setAccess_control(resultSet.getString("access_control"));
                    model.setLogin_user_flag(resultSet.getString("login_user_flag"));
                    model.setGeo_org_code(resultSet.getString("geo_org_code"));
                    model.setGeo_org_name(resultSet.getString("geo_org_name"));
                    model.setUser_level(resultSet.getString("user_level"));
                    model.setMobileNo(resultSet.getString("v_mobile"));
                    mobileNo = resultSet.getString("v_mobile");
                    model.setLocation_track_interval(resultSet.getString("LOCATION_TRACK_INTERVAL"));
                    model.setLocation_track_flag(resultSet.getString("LOCATION_TRACK_FLAG"));
                    String topic = "";
                    try {
                        preparedStatement = connection.prepareStatement("select PUSH_ALERT_TOPIC from LHSSYS_USER_APP_KEY_VALIDATION where user_code= '" + userID.toUpperCase() + "'");
                        ResultSet rs = preparedStatement.executeQuery();
                        if (rs != null && rs.next()) {
                            topic = rs.getString("PUSH_ALERT_TOPIC");
                        }
                    } catch (SQLException e) {
                        U.errorLog("PUSH_ALERT_TOPIC ERROR--> " + e.getMessage());
                    }
                    String latestBuildVersion = null;
                    try {
                        preparedStatement = connection.prepareStatement("select access_control from lhssys_portal_tab_mast m where m.user_type_flag is not null and m.dashboard_link = 'V' and m.user_type_flag='" + model.getLogin_user_flag() + "'");
                        ResultSet rs = preparedStatement.executeQuery();
                        if (rs != null && rs.next()) {
                            latestBuildVersion = (rs.getString(1) != null ? rs.getString(1) : "");
                        }
                    } catch (SQLException e) {
                        U.errorLog("access_control ERROR--> " + e.getMessage());
                    }

                    try {
                        U.log(latestBuildVersion + "--" + buildVersion);
                        if ((latestBuildVersion != null && latestBuildVersion != "") && latestBuildVersion.equalsIgnoreCase(buildVersion)) {
                            // update geooreg code to module 
                            String updateQuery = "update LHSSYS_USER_APP_KEY_VALIDATION l set l.module = l.geo_org_code where l.user_code='" + userID.toUpperCase() + "'";
                            PreparedStatement prepS = null;
                            prepS = connection.prepareStatement(updateQuery);
                            int count = prepS.executeUpdate();
                            if (count > 0) {
                                U.log("==Module Update==");
                                try {
                                    preparedStatement = connection.prepareStatement("select v.module from LHSSYS_USER_APP_KEY_VALIDATION v where v.user_code='" + userID.toUpperCase() + "'");
                                    ResultSet rs = preparedStatement.executeQuery();
                                    if (rs != null && rs.next()) {
                                        String module = rs.getString(1);
                                        model.setModule(module);
                                    }
                                } catch (SQLException e) {
                                    U.errorLog("module ERROR--> " + e.getMessage());
                                }
                            } else {
                                U.log("==Module Not Update==");
                            }
                        }
                            model = validateDeviceId(userID, deviceId, deviceName, notificationToken, appKey, appkeyValidationFlag, model, mobileNo, buildVersion);
//                    if (validate) {
//
//                        U.log("validate successfully");
//                    } else {
//                        U.log("validate unsuccessfull");
//                        model.setMessage("Invalid credentials or device ID");
//                    }
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                    model.setNotif_topic(topic);
                } else {
                    model.setMessage("Invalid credentials or device ID");
                }
//                model.setMessage(userID + " UserId is not registered,Please contact with your system administrator.");
            } else {
                model.setMessage("Invalid credentials or device ID");
            }
            try {
                String accCodeQuery = "select acc_code from acc_mast where emp_code='" + model.getEmp_code() + "' and ROWNUM <= 1 order by acc_name";

                U.log("accCodeQuery : " + accCodeQuery);
                preparedStatement = connection.prepareStatement(accCodeQuery);
                resultSet = preparedStatement.executeQuery();
                if (model.getEmp_code() != null && model.getEmp_code() != "") {
                    if (resultSet != null && resultSet.next()) {
                        String acc_code = resultSet.getString(1);
                        model.setAcc_code(acc_code);
                    }
                }

            } catch (Exception e) {
            }
            try {
                if (model.getLogin_user_flag().equalsIgnoreCase("B") || model.getLogin_user_flag().equalsIgnoreCase("P")) {
                    String userCodeSql = "SELECT PARAMETER_VALUE FROM LHSSYS_PARAMETERS WHERE PARAMETER_NAME ='APP_ENTRY_USER_CODE'";
                    preparedStatement = connection.prepareStatement(userCodeSql);
                    resultSet = preparedStatement.executeQuery();
                    if (resultSet != null && resultSet.next()) {
                        model.setUser_code(resultSet.getString(1));
                    }
                }
            } catch (Exception e) {

            }

        } catch (SQLException e) {
            U.errorLog(e);
            model.setMessage("Something went wrong please try again later!");

        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                    connection.close();
                } catch (SQLException e) {
                }
            }
        }

        if (model.getMessage().equalsIgnoreCase("User is authenticated")) {
            System.out.println("OTP FLAG: " + OTPFlag);
            if (OTPFlag.equalsIgnoreCase("O")) {
                System.out.println("MOBILE No : " + mobileNo);
                HashMap<String, String> otp = genarateOtp(mobileNo);
                model.setOTP(otp);
            }
        }
        return model;
    }

//    public LoginModel authenticateUser(String userID, String password, String deviceId, String deviceName, String notificationToken, String type) {
//        LoginModel model = new LoginModel();
//        PreparedStatement preparedStatement = null;
//        ResultSet resultSet = null;
//        String encryptFlag = "";
//        StringBuilder stringBuffer = new StringBuilder();
//
//        U.log("notificationToken : " + notificationToken);
//
////        try {
//////            if (notificationToken.equals("null") || notificationToken.equals(null) || notificationToken.isEmpty() || notificationToken == null || notificationToken.equals("")) {
////            if (notificationToken != null && !notificationToken.isEmpty()) {
////                String notifTokenUpdateSQL = "UPDATE LHSSYS_USER_APP_KEY_VALIDATION  SET PUSH_ALERT_TOKEN_NO = '" + notificationToken + "'  "
////                        + "WHERE USER_CODE = '" + userID.toUpperCase() + "'";
////                U.log("notifTokenUpdateSQL : " + notifTokenUpdateSQL);
////                preparedStatement = connection.prepareStatement(notifTokenUpdateSQL);
////                int result = preparedStatement.executeUpdate();
////                if (result > 0) {
////                    U.log("notificationToken updated ");
////                } else {
////                    U.log("notificationToken not updated ");
////                }
////            } else {
////                U.log("notificationToken is Empty ");
////            }
////        } catch (Exception e) {
////        } finally {
////            if (preparedStatement != null) {
////                try {
////                    preparedStatement.close();
////                } catch (SQLException e) {
////                }
////            }
////        }
//        try {
//            String encryptCheckSQL = "select t.encrypted_password from view_default_user_links t";
//            preparedStatement = connection.prepareStatement(encryptCheckSQL);
//            resultSet = preparedStatement.executeQuery();
//            if (resultSet != null && resultSet.next()) {
//                encryptFlag = resultSet.getString(1);
//            }
//        } catch (Exception e) {
//        }
//
//        try {
//            if (encryptFlag.equals("T")) {
//                stringBuffer.append("select u.emp_code,u.user_code,initcap(u.user_name) userName,u.ENTITY, u.DIVISION, u.ACC_YEAR, u.DEPT_CODE,v.module,v.bill_entry_catg_preference, T.DASHBOARD_LINK  from user_mast u,LHSSYS_USER_APP_KEY_VALIDATION v, LHSSYS_PORTAL_TAB_MAST T where u.user_code=v.user_code and (u.user_code= '").append(userID.toUpperCase()).append("'  or u.email='").append(userID).append("' or 'u.mobile'='").append(userID).append("' )  and u.password = lhs_utility.get_encrypt('").append(password).append("')  and v.default_app_selection='T' and v.device_name='").append(deviceName).append("'   and V.Module = T.TAB_ID and v.device_id='").append(deviceId).append("'");
//            } else {
//                stringBuffer.append("select u.emp_code,u.user_code,initcap(u.user_name) userName,u.ENTITY, u.DIVISION, u.ACC_YEAR, u.DEPT_CODE,v.module,v.bill_entry_catg_preference, T.DASHBOARD_LINK  from user_mast u,LHSSYS_USER_APP_KEY_VALIDATION v, LHSSYS_PORTAL_TAB_MAST T where u.user_code=v.user_code and (u.user_code= '").append(userID.toUpperCase()).append("'  or u.email='").append(userID).append("' or 'u.mobile'='").append(userID).append("' )  and u.password = '").append(password).append("'  and v.default_app_selection='T' and v.device_name='").append(deviceName).append("'   and V.Module = T.TAB_ID and v.device_id='").append(deviceId).append("'");
//            }
//
//            if (type != null && !type.isEmpty()) {
//                U.log("typr--> " + type);
//                if (type == "crm" || type.equalsIgnoreCase("crm")) {
//                    stringBuffer = new StringBuilder();
//
////                    stringBuffer.append("select u.emp_code,u.login_id user_code, "
////                            + "         u.login_id acc_code, "
////                            + "       initcap(u.Client_name) userName, "
////                            + "       u.Entity_code entity, "
////                            + "       u.Div_code DIVISION, "
////                            + "       '' ACC_YEAR, "
////                            + "       '' DEPT_CODE, "
////                            + "       v.module, "
////                            + "       T.DASHBOARD_LINK "
////                            + "  from view_client_login_mast   u, "
////                            + "       LHSSYS_USER_APP_KEY_VALIDATION v, "
////                            + "       LHSSYS_PORTAL_TAB_MAST         T "
////                            + " where u.login_id = v.user_code "
////                            + "   and u.login_id = '" + userID + "' "
////                            + "   and u.password = '" + password + "' "
////                            + "   and v.default_app_selection = 'T' "
////                            + "   and v.device_name = '" + deviceName + "' "
////                            + "   and V.Module = T.TAB_ID "
////                            + "   and v.device_id = '" + deviceId + "'");
//                    stringBuffer.append("select u.emp_code,u.user_code, "
//                            + "         u.login_id acc_code, "
//                            + "         lhs_utility.get_name('ACC_CODE', u.login_id) acc_name,"
//                            + "       initcap(u.Client_name) userName, "
//                            + "       u.Entity_code entity, "
//                            + "       u.Div_code DIVISION, "
//                            + "       u.geo_org_code, "
//                            + " (select lhs_utility.get_name('GEO_ORG_CODE', GEO_ORG_CODE)  from view_geo_org_mast m where m.GEO_ORG_CODE=u.geo_ORG_CODE) geo_org_name, "
//                            + "       '' ACC_YEAR, "
//                            + "       '' DEPT_CODE, "
//                            + "       v.module, v.bill_entry_catg_preference, "
//                            + "       T.DASHBOARD_LINK, "
//                            + "        u.LOGIN_USER_FLAG "
//                            + "  from view_client_login_mast   u, "
//                            + "       LHSSYS_USER_APP_KEY_VALIDATION v, "
//                            + "       LHSSYS_PORTAL_TAB_MAST         T "
//                            + " where u.login_id = v.user_code and "
//                            + "    u.login_id = '" + userID.toUpperCase() + "' "
//                            + "   and u.password = '" + password + "' "
//                            + "   and v.default_app_selection = 'T' "
//                            + "   and V.Module = T.TAB_ID ");
////                            + "   and v.device_name = '" + deviceName + "' "
////                            + "   and v.device_id = '" + deviceId + "'");
//                }
//            }
//            U.log("login sql--> " + stringBuffer.toString());
//            preparedStatement = connection.prepareStatement(stringBuffer.toString());
//            resultSet = preparedStatement.executeQuery();
//            U.log("RESULT SET  : " + resultSet);
////            U.log("USER LOGIN SQL : " + stringBuffer.toString());
//            if (resultSet != null && resultSet.next()) {
//                U.log("RESULT SET  : " + resultSet.getString("user_code"));
//                model.setUser_code(resultSet.getString("user_code"));
//                model.setUserName(resultSet.getString("userName"));
//                model.setMessage("User is authenticated");
//                model.setModule(resultSet.getString("module"));
//                model.setBill_entry_catg_preference(resultSet.getString("bill_entry_catg_preference"));
//                model.setAcc_year(resultSet.getString("Acc_year"));
//                model.setDept_code(resultSet.getString("Dept_code"));
//                model.setDivision(resultSet.getString("Division"));
//                model.setEntity_code(resultSet.getString("entity"));
//                model.setDashboardLink(resultSet.getString("DASHBOARD_LINK"));
//                U.log("EMP CODE:==" + resultSet.getString("emp_code"));
//                model.setEmp_code(resultSet.getString("emp_code"));
//                model.setAcc_code(resultSet.getString("acc_code"));
//                model.setAcc_name(resultSet.getString("acc_name"));
//                model.setLogin_user_flag(resultSet.getString("login_user_flag"));
//                model.setGeo_org_code(resultSet.getString("geo_org_code"));
//                model.setGeo_org_name(resultSet.getString("geo_org_name"));
//
//                String topic = "";
//                try {
//                    preparedStatement = connection.prepareStatement("select PUSH_ALERT_TOPIC from LHSSYS_USER_APP_KEY_VALIDATION where user_code= '" + userID.toUpperCase() + "'");
//                    ResultSet rs = preparedStatement.executeQuery();
//                    if (rs != null && rs.next()) {
//                        topic = rs.getString("PUSH_ALERT_TOPIC");
//                    }
//                } catch (SQLException e) {
//                    U.errorLog("PUSH_ALERT_TOPIC ERROR--> " + e.getMessage());
//                }
//
//                try {
//                    boolean validate = validateDeviceId(userID, deviceId, notificationToken);
//                    if (validate) {
//
//                        U.log("validate successfully");
//                    } else {
//                        U.log("validate unsuccessfull");
//                        model.setMessage("Invalid credentials or device ID");
//                    }
//                } catch (Exception ex) {
//                    ex.printStackTrace();
//                }
//                model.setNotif_topic(topic);
//            } else {
//                model.setMessage("Invalid credentials or device ID");
////                model.setMessage(userID + " UserId is not registered,Please contact with your system administrator.");
//            }
//            try {
//                String accCodeQuery = "select acc_code from acc_mast where emp_code='" + model.getEmp_code() + "' and ROWNUM <= 1 order by acc_name";
//
//                U.log("accCodeQuery : " + accCodeQuery);
//                preparedStatement = connection.prepareStatement(accCodeQuery);
//                resultSet = preparedStatement.executeQuery();
//                if (model.getEmp_code() != null && model.getEmp_code() != "") {
//                    if (resultSet != null && resultSet.next()) {
//                        String acc_code = resultSet.getString(1);
//                        model.setAcc_code(acc_code);
//                    }
//                }
//
//            } catch (Exception e) {
//            }
//            try {
//                if (model.getLogin_user_flag().equalsIgnoreCase("B") || model.getLogin_user_flag().equalsIgnoreCase("P")) {
//                    String userCodeSql = "SELECT PARAMETER_VALUE FROM LHSSYS_PARAMETERS WHERE PARAMETER_NAME ='APP_ENTRY_USER_CODE'";
//                    preparedStatement = connection.prepareStatement(userCodeSql);
//                    resultSet = preparedStatement.executeQuery();
//                    if (resultSet != null && resultSet.next()) {
//                        model.setUser_code(resultSet.getString(1));
//                    }
//                }
//            } catch (Exception e) {
//
//            }
//
//        } catch (SQLException e) {
//            U.errorLog(e);
//            model.setMessage("Something went wrong please try again later!");
//
//        } finally {
//            if (preparedStatement != null) {
//                try {
//                    preparedStatement.close();
//                    connection.close();
//                } catch (SQLException e) {
//                }
//            }
//        }
//
//        return model;
//    }
    public LoginModel validateDeviceId(String userId, String deviceId, String deviceName, String notificationToken, String appKey, String appkeyValidationFlag, LoginModel model, String mobileNo, String buildVersion) {
        U.log("validateDeviceId");
        PreparedStatement ps = null;
        ResultSet rs = null;
        int appKeyCount = 0;
        String query = "select D.DEVICE_ID,d.device_name from LHSSYS_USER_APP_KEY_VALIDATION D WHERE D.USER_CODE='" + userId.toUpperCase() + "'";
        U.log("validate query----->" + query);
        try {
            String id = null;
            ps = connection.prepareStatement(query);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                U.log("device id query ==> " + query);
                String dId = null;
                String dName = null;
                dId = (rs.getString(1) == null ? "" : rs.getString(1));
                dName = (rs.getString(2) == null ? "" : rs.getString(2));

                if (appkeyValidationFlag != null && !appkeyValidationFlag.isEmpty()) {
                    if (appkeyValidationFlag.equalsIgnoreCase("Y")) {
                        try {
                            String checkCount = "SELECT COUNT(*) FROM LHSSYS_USER_APP_KEY_VALIDATION L WHERE upper(L.APPKEY )=  upper('" + appKey + "') and user_code != upper('" + userId + "') ";

                            System.out.println("APPKEY count sql--> " + checkCount);
                            PreparedStatement preparedStatement = connection.prepareStatement(checkCount);
                            ResultSet resultSet = preparedStatement.executeQuery();
                            if (resultSet != null && resultSet.next()) {
                                appKeyCount = resultSet.getInt(1);
                                System.out.println("appKeyCount--> " + appKeyCount);
                            }

                            if (appKeyCount > 0) {
                                model.setMessage("App key(" + appKey.toUpperCase() + ") is already assigned to some other user, please contact Admin");
                                return model;
                            } else {

                                if (dId != null && !dName.isEmpty() && dName != null && !dId.isEmpty()) {
                                    if (!deviceName.equals(dName) && !deviceId.equals(dId)) {
                                        model.setMessage("Registered Device mismatch, Please contact Admin");
                                        return model;
                                    }
                                }
                            }

                        } catch (Exception e) {
                            System.out.println("Erorr in appKeyCount --> " + e.getMessage());
                        }
                    }
                }

                if (appKey != null && !appKey.isEmpty()) {
                } else {
                    appKey = userId;
                    System.out.println("appKey is Empty ");
                }

//                U.log(dId + "-devices-" + deviceId);
//                if (dId.equals(deviceId)) {
//                    return true;
//                } else if (dId.isEmpty()) {
                String appkeyupdateSql = "UPDATE LHSSYS_USER_APP_KEY_VALIDATION  SET appkey=upper('" + appKey + "'),"
                        + " device_id='" + deviceId + "',device_name='" + deviceName + "',push_alert_topic='" + buildVersion + "',"
                        + " PUSH_ALERT_TOKEN_NO = '" + notificationToken + "' WHERE USER_CODE = '" + userId.toUpperCase() + "' "
                        + " and appkey='"+ appKey.toUpperCase() +"'";
                U.log("device update query==>" + appkeyupdateSql);
                PreparedStatement prepS = null;
                prepS = connection.prepareStatement(appkeyupdateSql);
                int idUpdate = prepS.executeUpdate();
                if (idUpdate > 0) {
                    U.log("device id updated");
//                    return true;
                } else {
                    U.log("device id not updated");
//                    return false;/
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                    connection.close();
                } catch (SQLException e) {
                }
            }
        }
        return model;
    }

    public MessageJSON changePassword(String userID, String oldPassword, String newPassword, String json, String acccode, String loginflag, String loginId) {
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String changePasswordSQL = "";
        String changePasswordResult = "";
        String obtainedPassword = "";
        String obtainPasswordSQL = "";
        String passUpdateColumn = "";
        String passUpdateTable = "";
        String updateClauseColumn = "";
        String loginUserFlag = "";
        MessageJSON obj = new MessageJSON();
        try {
            if (acccode != null && !acccode.isEmpty() && acccode == "" && acccode != "null") {
                System.out.println("NOT NULL");
            } else {
                System.out.println("NULL");
                acccode = loginId.toUpperCase();
            }
            obtainPasswordSQL = "select u.password,u.PASSWORD_UPDATE_COLUMN,U.PASSWORD_UPDATE_TABLE,u.update_clause_column,u.login_user_flag from view_client_login_mast u where u.login_id =upper( '" + userID + "')";
            if (!loginflag.equalsIgnoreCase("E")) {
                obtainPasswordSQL = "select u.password,u.PASSWORD_UPDATE_COLUMN,U.PASSWORD_UPDATE_TABLE,u.update_clause_column,u.login_user_flag from view_client_login_mast u where u.login_id =upper( '" + acccode + "')";
            }

            U.log("user_id===" + userID + "loginFlag===" + loginflag + "==OBTAIN PASSWORD SQL : " + obtainPasswordSQL);

            preparedStatement = connection.prepareStatement(obtainPasswordSQL);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                obtainedPassword = resultSet.getString(1);
                passUpdateColumn = resultSet.getString(2);
                passUpdateTable = resultSet.getString(3);
                updateClauseColumn = resultSet.getString(4);
                loginUserFlag = resultSet.getString(5);
                U.log("obtainedPassword : " + obtainedPassword);
                if (oldPassword.equals(obtainedPassword)) {
                    changePasswordSQL = "update " + passUpdateTable + " u set " + passUpdateColumn + " = '" + newPassword + "' where " + updateClauseColumn + " = '" + userID + "'";

                    System.out.println("flag==>>" + loginUserFlag);

                    if (!loginflag.equalsIgnoreCase("E")) {
                        changePasswordSQL = "update " + passUpdateTable + " u set " + passUpdateColumn + " = '" + newPassword + "' where " + updateClauseColumn + " = '" + acccode + "'";
                    }

                    U.log("CHANGE PASSWORD SQL : " + changePasswordSQL);
                    preparedStatement = connection.prepareStatement(changePasswordSQL);
                    int n = preparedStatement.executeUpdate();
                    if (n == 1) {
                        changePasswordResult = "Password updated successfully..";
                        obj.setResult(changePasswordResult);
                        obj.setStatus("success");
                        U.log(changePasswordResult);
                    } else {
                        changePasswordResult = "Given details doesn't match";
                        obj.setResult(changePasswordResult);
                        obj.setStatus("error");
                        U.log(changePasswordResult);
                    }
                } else {
                    changePasswordResult = "Given details doesn't match";
                    obj.setResult(changePasswordResult);
                    obj.setStatus("error");
                    U.log(changePasswordResult);
                }
            } else {
                changePasswordResult = "Given details doesn't match";
                obj.setResult(changePasswordResult);
                obj.setStatus("error");
                U.log(changePasswordResult);
            }
        } catch (SQLException e) {
            U.errorLog(e);
            changePasswordResult = "Given details doesn't match";
            obj.setResult(changePasswordResult);
            obj.setStatus("error");
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                    connection.close();
                } catch (SQLException e) {
                    U.errorLog(e);
                    changePasswordResult = "Given details doesn't match";
                    obj.setResult(changePasswordResult);
                    obj.setStatus("error");
                }
            }
        }
        return obj;
    }

    public LoginModel guestLogin(String username, String email, String mobileno, String deviceId, String deviceName, String notificationToken) {
        LoginModel model = new LoginModel();
        PreparedStatement ps = null;
        ResultSet resultSet = null;

        String sql = "insert into retailer_mast(retailer_name,mobile,email,retailer_catg) values('" + username + "','" + mobileno + "','" + email + "','G')";

        try {
            ps = connection.prepareStatement(sql);

            ps.execute();
            String result = "insert data";
            model.setMessage(result);
            U.log("result==>" + result);

            String user_info = "select r.retailer_code,initcap(r.retailer_name) userName,T.tab_name "
                    + " from retailer_mast r,LHSSYS_PORTAL_TAB_MAST T "
                    + " where r.retailer_name='" + username + "' and t.tab_name= 'Guest'";

            ps = connection.prepareStatement(user_info);
            resultSet = ps.executeQuery();
            U.log("RESULT SET  : " + resultSet);
            U.log(" Guest USER LOGIN SQL : " + user_info);
            if (resultSet != null && resultSet.next()) {
                U.log("RESULT SET  : " + resultSet.getString("retailer_code"));
                model.setUser_code(resultSet.getString("retailer_code"));
                model.setUserName(resultSet.getString("userName"));
                model.setMessage("User is authenticated");
                model.setModule(resultSet.getString("tab_name"));
//                model.setAcc_year(resultSet.getString("Acc_year"));
//                model.setDept_code(resultSet.getString("Dept_code"));
//                model.setDivision(resultSet.getString("Division"));
//                model.setEntity_code(resultSet.getString("entity"));
//                model.setDashboardLink(resultSet.getString("DASHBOARD_LINK"));
            }

        } catch (Exception e) {
            model.setMessage("User is not authenticated ,Invalid credentials or device ID");
            U.errorLog(e);
        }
        return model;
    }

    public HashMap<String, String> genarateOtp(String mobileNo) {
        String resulString = "";
        String resulStatus = "";
        String otp = OTP(6);
        if (mobileNo != null && !mobileNo.isEmpty()) {
            try {
                String url = "http://sms.smsmob.in/api/mt/SendSMS?user=Lighthouse&password=lighthouse@india1&senderid=LHSERP&channel=Trans&DCS=0&flashsms=0"
                        + "&number=" + mobileNo
                        + "&text=" + URLEncoder.encode(otp + " is your one time password to proceed on CRM APP. It is valid for 10 mints. Do not share your OTP with anyone. ", "UTF-8");
                System.out.println("url--> " + url);
                boolean result = SendSMSDAO.sendSMS(url);
                if (result) {
                    resulStatus = "sucess";
                    resulString = "We have sent you an OTP(one time password), please check and enter otp)";
                } else {
                    resulStatus = "error";
                    resulString = "Somethimg went wrong please try again later!";
                }
            } catch (Exception e) {
                e.printStackTrace();
                resulStatus = "error";
                resulString = "Somethimg went wrong please try again later!";
            }
        } else {
            resulStatus = "error";
            resulString = "Mobile no not found";
        }
        HashMap<String, String> result = new HashMap<String, String>();
        result.put("resulStatus", resulStatus);
        result.put("resulString", resulString);
        result.put("otp", otp);
        return result;
    }

    public HashMap<String, String> genarateOtpOld(String userId, String device_id, String device_name) {

        String resulString = "";
        String resulStatus = "";
        String otp = OTP(6);
        String sql = "select * from view_client_login_mast v where v.login_id='" + userId + "'";
        PreparedStatement ps = null;
        ResultSet resultSet = null;
        String mobileNo = "";
        String password = "";
        try {
            System.out.println("sql---> " + sql);
            ps = connection.prepareStatement(sql);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                mobileNo = resultSet.getString("mobile");
                password = resultSet.getString("password");
                System.out.println("mobileNo--> " + mobileNo);
            } else {
                resulStatus = "error";
                resulString = "Invalid User Id";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (mobileNo != null && !mobileNo.isEmpty()) {
            try {
                String url = "http://sms.smsmob.in/api/mt/SendSMS?user=Lighthouse&password=lighthouse@india1&senderid=LHSERP&channel=Trans&DCS=0&flashsms=0"
                        + "&number=" + mobileNo
                        + "&text=" + URLEncoder.encode(otp + " is your one time password to proceed on CRM APP. It is valid for 10 mints. Do not share your OTP with anyone. ", "UTF-8");
                System.out.println("url--> " + url);
                boolean result = SendSMSDAO.sendSMS(url);
                System.out.println("SendSMSDAO result --> " + result);
                if (result) {
                    resulStatus = "sucess";
                    resulString = "We have sent you an OTP(one time password), please check and enter otp)";
                } else {
                    resulStatus = "error";
                    resulString = "Somethimg went wrong please try again later!";
                }
            } catch (Exception e) {
                e.printStackTrace();
                resulStatus = "error";
                resulString = "Somethimg went wrong please try again later!";
            }
        } else {
            resulStatus = "error";
            resulString = "Mobile no not found";
        }

        HashMap<String, String> result = new HashMap<String, String>();
        result.put("resulStatus", resulStatus);
        result.put("resulString", resulString);
        result.put("password", password);
        result.put("otp", otp);
        return result;
    }

//    public static void main(String[] args) {
//        // Length of your password as I have choose 
//        // here to be 8 
//        int length = 6;
//        System.out.println(OTP(length));
//        
//    }
//    }
    static String OTP(int len) {
        // Using numeric values 
        String numbers = "0123456789";
//        String Capital_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//        String Small_chars = "abcdefghijklmnopqrstuvwxyz";
//        String symbols = "!@#$%^&*_=+-/.?<>)";
//        String values = Capital_chars + Small_chars
//                + numbers + symbols;
        // Using random method 
        Random rndm_method = new Random();
        char[] otp = new char[len];
        for (int i = 0; i < len; i++) {
            otp[i] = numbers.charAt(rndm_method.nextInt(numbers.length()));
        }
        System.out.println("otp-->" + otp);
        return new String(otp);
    }

    public HashMap<String, Object> getAuthServerDetails(String appKey, String device_id, String device_name) {
//        String appKeySql = "select * from view_ios_app_validation t where t.APP_KEY='" + appKey + "'";
        HashMap<String, Object> hashMap = new HashMap<String, Object>();

        String appKeySql = "select * from LHSSYS_APPKEY_LOG where appkey=upper('" + appKey + "')";
        System.out.println("appKeySql--> " + appKeySql);
        try {

            PreparedStatement ps = connection.prepareStatement(appKeySql);
            ResultSet resultSet = ps.executeQuery();

            if (resultSet != null && resultSet.next()) {
                System.out.println("RESULT SET ROWS  : " + resultSet.getRow());
                String device_validation = "";

                String seq_no = resultSet.getString("seq_no");
                String device_id_A = resultSet.getString("device_id");
                String device_name_A = resultSet.getString("device_name");
                String loginFlag = resultSet.getString("flag");

                String appLogSql = "select * from LHSSYS_APP_COFIGRATION_LOG where seq_no='" + seq_no + "'";
                ps = connection.prepareStatement(appLogSql);
                ResultSet rs = ps.executeQuery();

                if (rs != null && rs.next()) {
                    device_validation = rs.getString("device_validation");

                    if (device_validation != null && !device_validation.isEmpty()) {
                        System.out.println("device_validation--> " + device_validation);
                        if (device_validation == "Y" || device_validation.equalsIgnoreCase("Y")) {
                            if (device_id_A != null && device_name_A != null && !device_id_A.isEmpty() && !device_id_A.isEmpty()) {

                                System.out.println("device_id_A--> " + device_id_A);
                                System.out.println("device_name_A--> " + device_name_A);
                                System.out.println("device_id--> " + device_id);
                                System.out.println("device_name--> " + device_name);

                                if (device_id_A.equals(device_id) && device_name_A.equals(device_name_A)) {
                                    hashMap.put("status", "true");
                                    hashMap.put("msg", "Server Details Found");
                                    hashMap.put("app_name", rs.getString("app_name"));
                                    hashMap.put("entity", rs.getString("entity_code"));
                                    hashMap.put("dbName", rs.getString("database_name"));
                                    hashMap.put("dbPassword", rs.getString("database_password"));
                                    hashMap.put("serverUrl", rs.getString("server_url1"));
                                    hashMap.put("server_url2", rs.getString("server_url2"));
                                    hashMap.put("server_url3", rs.getString("server_url3"));
                                    hashMap.put("server_url4", rs.getString("server_url4"));
                                    hashMap.put("war_name", rs.getString("war_name"));
                                    hashMap.put("dbUrl", rs.getString("database_ip"));
                                    hashMap.put("portNo", rs.getString("database_port"));
                                    hashMap.put("dbUrl", rs.getString("database_ip"));
                                    hashMap.put("dbSID", rs.getString("db_sid"));
                                    hashMap.put("entity_code_str", rs.getString("entity_code_str"));
                                    hashMap.put("app_valid_upto_date", rs.getString("app_valid_upto_date"));
                                    hashMap.put("app_valid_upto_message", rs.getString("app_valid_upto_message"));
                                    hashMap.put("validupto_message_prompt_days", rs.getString("validupto_message_prompt_days"));
                                    hashMap.put("device_validation", device_validation);
                                    hashMap.put("loginFlag", loginFlag);
                                    hashMap.put("location_tracking_duration", rs.getString("location_tracking_duration"));
                                    InputStream imgstream = null;
                                    if (rs.getBlob("app_image") != null) {
                                        imgstream = rs.getBlob("app_image").getBinaryStream();
                                        hashMap.put("icon_img", Util.getImgstreamToBytes(imgstream));
                                    } else {
                                        imgstream = getClass().getResourceAsStream("/defualtDp.png");
                                        hashMap.put("icon_img", "");
                                    }
                                } else {
                                    hashMap.put("status", "false");
                                    hashMap.put("msg", "Not a valid Device");
                                }
                            } else {
                                UpdateLog(appKey, device_id, device_name);
                                hashMap.put("status", "true");
                                hashMap.put("msg", "Server Details Found");
                                hashMap.put("app_name", rs.getString("app_name"));
                                hashMap.put("entity", rs.getString("entity_code"));
                                hashMap.put("dbName", rs.getString("database_name"));
                                hashMap.put("dbPassword", rs.getString("database_password"));
                                hashMap.put("serverUrl", rs.getString("server_url1"));
                                hashMap.put("server_url2", rs.getString("server_url2"));
                                hashMap.put("server_url3", rs.getString("server_url3"));
                                hashMap.put("server_url4", rs.getString("server_url4"));
                                hashMap.put("war_name", rs.getString("war_name"));
                                hashMap.put("dbUrl", rs.getString("database_ip"));
                                hashMap.put("portNo", rs.getString("database_port"));
                                hashMap.put("dbUrl", rs.getString("database_ip"));
                                hashMap.put("dbSID", rs.getString("db_sid"));
                                hashMap.put("device_validation", device_validation);
                                hashMap.put("loginFlag", loginFlag);
                                hashMap.put("entity_code_str", rs.getString("entity_code_str"));
                                hashMap.put("app_valid_upto_date", rs.getString("app_valid_upto_date"));
                                hashMap.put("app_valid_upto_message", rs.getString("app_valid_upto_message"));
                                hashMap.put("validupto_message_prompt_days", rs.getString("validupto_message_prompt_days"));
                                hashMap.put("location_tracking_duration", rs.getString("location_tracking_duration"));
                                InputStream imgstream = null;
                                if (rs.getBlob("app_image") != null) {
                                    imgstream = rs.getBlob("app_image").getBinaryStream();
                                    hashMap.put("icon_img", Util.getImgstreamToBytes(imgstream));
                                } else {
                                    imgstream = getClass().getResourceAsStream("/defualtDp.png");
                                    hashMap.put("icon_img", "");
                                }
                            }

                        } else {
                            hashMap.put("status", "true");
                            hashMap.put("msg", "Server Details Found");
                            hashMap.put("app_name", rs.getString("app_name"));
                            hashMap.put("entity", rs.getString("entity_code"));
                            hashMap.put("dbName", rs.getString("database_name"));
                            hashMap.put("dbPassword", rs.getString("database_password"));
                            hashMap.put("serverUrl", rs.getString("server_url1"));
                            hashMap.put("server_url2", rs.getString("server_url2"));
                            hashMap.put("server_url3", rs.getString("server_url3"));
                            hashMap.put("server_url4", rs.getString("server_url4"));
                            hashMap.put("war_name", rs.getString("war_name"));
                            hashMap.put("dbUrl", rs.getString("database_ip"));
                            hashMap.put("portNo", rs.getString("database_port"));
                            hashMap.put("dbUrl", rs.getString("database_ip"));
                            hashMap.put("dbSID", rs.getString("db_sid"));
                            hashMap.put("device_validation", device_validation);
                            hashMap.put("loginFlag", loginFlag);
                            hashMap.put("entity_code_str", rs.getString("entity_code_str"));
                            hashMap.put("app_valid_upto_date", rs.getString("app_valid_upto_date"));
                            hashMap.put("app_valid_upto_message", rs.getString("app_valid_upto_message"));
                            hashMap.put("validupto_message_prompt_days", rs.getString("validupto_message_prompt_days"));
                            hashMap.put("location_tracking_duration", rs.getString("location_tracking_duration"));
                            InputStream imgstream = null;
                            if (rs.getBlob("app_image") != null) {
                                imgstream = rs.getBlob("app_image").getBinaryStream();
                                hashMap.put("icon_img", Util.getImgstreamToBytes(imgstream));
                            } else {
                                imgstream = getClass().getResourceAsStream("/defualtDp.png");
                                hashMap.put("icon_img", "");
                            }
                        }
                    } else {
                        hashMap.put("status", "false");
                        hashMap.put("msg", "Not a valid Device");
                    }
                } else {
                    hashMap.put("status", "false");
                    hashMap.put("msg", "Server Details  Not Found");
                }
            } else {
                hashMap.put("status", "false");
                hashMap.put("msg", "Please Enter valid App Key");
            }

        } catch (Exception e) {
            hashMap.put("status", "false");
            hashMap.put("msg", "Server Details  Not Found");
            U.log(e);
        }
        return hashMap;
    }

    public void UpdateLog(String appkey, String device_id, String device_name) {
        String appKeySql = "update LHSSYS_APPKEY_LOG l set"
                + " l.device_id='" + device_id + "' ,"
                + " l.device_name='" + device_name + "' ,"
                + " l.lastupdate=sysdate "
                + " where l.appkey=upper('" + appkey + "') ";
        try {
            System.out.println("update LHSSYS_APPKEY_VALIDATION_LOG SQL --> " + appKeySql);
            PreparedStatement ps = connection.prepareStatement(appKeySql);
            ps.execute();
        } catch (Exception e) {
            System.out.println("Error--> " + e.getMessage());
        }
    }

    public String updateLoginLog(String userID) {
        String logStatus = "";
        String loginLogQuery = "INSERT INTO LHSSYS_PORTAL_APP_TRAN (SEQ_ID,DYNAMIC_TABLE_SEQ_ID,COL1, COL2,COL3, LASTUPDATE, USER_CODE)"
                + " VALUES ('-1','-1','-1','" + userID + "',lhs_utility.get_name('user_code','" + userID + "'),sysdate, '" + userID + "')";
        System.out.println("LOG In QRY : " + loginLogQuery);
        try {
            PreparedStatement ps = connection.prepareStatement(loginLogQuery);

            int loginLogCount = ps.executeUpdate();
            if (loginLogCount > 0) {
                logStatus = "success";
            } else {
                logStatus = "error";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return logStatus;
    }

    public String logOutEntry(String userID) {
        String logStatus = "";
        String logOutQuery = "INSERT INTO LHSSYS_PORTAL_APP_TRAN (SEQ_ID,DYNAMIC_TABLE_SEQ_ID,COL1, COL2,COL3, LASTUPDATE, USER_CODE)"
                + " VALUES ('-2','-2','-2','" + userID + "',lhs_utility.get_name('user_code','" + userID + "'),sysdate, '" + userID + "')";
        System.out.println("LOG Out QRY : " + logOutQuery);
        try {
            PreparedStatement ps = connection.prepareStatement(logOutQuery);
            int loginLogCount = ps.executeUpdate();
            if (loginLogCount > 0) {
                logStatus = "success";
            } else {
                logStatus = "error";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return logStatus;
    }

}
