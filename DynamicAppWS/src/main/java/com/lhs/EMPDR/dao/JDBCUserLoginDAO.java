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
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

//import oracle.jdbc.pool.OraclePooledConnection;
/**
 *
 * @author premkumar.agrawal
 */
public class JDBCUserLoginDAO {

    public Connection connection = null;

    public JDBCUserLoginDAO(Connection connection) {
        this.connection = connection;
    }

    public LoginModel authenticateUser(String userID, String password, String deviceId, String deviceName, String notificationToken, String appKey, String appkeyValidationFlag, String loginFlag, String buildVersion, String locationTrackingFlag) {
        LoginModel model = new LoginModel();
        String appVersion = buildVersion != null && !buildVersion.isEmpty() ? buildVersion : "";
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String encryptFlag = "";
        StringBuilder stringBuffer = new StringBuilder();
        int appKeyCount = 0;
        System.out.println("notificationToken : " + notificationToken);

        String device_id = "", device_name = "";
        try {
            String checkDevice = "select * from LHSSYS_USER_APP_KEY_VALIDATION "
                    + "WHERE UPPER(USER_CODE) = '" + userID.toUpperCase() + "'";
            System.out.println("CHECK DEVICE : " + checkDevice);
            preparedStatement = connection.prepareStatement(checkDevice);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                device_name = resultSet.getString("device_name");
                device_id = resultSet.getString("device_id");
            } else {
                model.setMessage("App key not mapped against user, please contact Admin");
                return model;
            }
        } catch (Exception e) {
            System.out.println("Erorr in checkDevice--> " + e.getMessage());
        }

        System.out.println("appkeyValidationFlag : " + appkeyValidationFlag);
        if (appkeyValidationFlag != null && !appkeyValidationFlag.isEmpty()) {
            if (appkeyValidationFlag.equalsIgnoreCase("Y")) {
                try {
                    String checkCount = "SELECT COUNT(*) FROM LHSSYS_USER_APP_KEY_VALIDATION L WHERE upper(L.APPKEY )=  upper('" + appKey + "') and user_code != upper('" + userID + "') ";

                    System.out.println("APPKEY count sql--> " + checkCount);
                    preparedStatement = connection.prepareStatement(checkCount);
                    resultSet = preparedStatement.executeQuery();
                    if (resultSet != null && resultSet.next()) {
                        appKeyCount = resultSet.getInt(1);
                        System.out.println("appKeyCount--> " + appKeyCount);
                    }
                } catch (Exception e) {
                    System.out.println("Erorr in appKeyCount --> " + e.getMessage());
                }
            }
        }

        if (notificationToken != null && !notificationToken.isEmpty()) {
        } else {
            notificationToken = "";
            System.out.println("notificationToken is Empty ");
        }
        if (appKey != null && !appKey.isEmpty()) {
        } else {
            appKey = userID;
            System.out.println("appKey is Empty ");
        }
        System.out.println("notificationToken : " + notificationToken);

        try {
            String encryptCheckSQL = "select t.encrypted_password from view_default_user_links t";
            preparedStatement = connection.prepareStatement(encryptCheckSQL);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                encryptFlag = resultSet.getString(1);
            }
        } catch (Exception e) {
            System.out.println("encryptCheckSQL ERORR--> " + e.getMessage());
        }

        try {
            if (appKeyCount > 0) {
                model.setMessage(" This (" + appKey + ") app key is used by another user");
                model.setMessage("App key(" + appKey.toUpperCase() + ") is already assigned to some other user, please contact Admin");
            } else {
                if (loginFlag != null && !loginFlag.isEmpty() && loginFlag.equalsIgnoreCase("V")) {
                    System.out.println("VIEW MODE");
                    stringBuffer.append("select SUBSTR(u.portal_User_code, 2) user_code, initcap(u.portal_user_name) userName, u.Entity_code ENTITY, '' DIVISION, '' ACC_YEAR, '' DEPT_CODE, v.module, v.geo_org_code_scheme, T.DASHBOARD_LINK, v.device_name, v.device_id from LHSSYS_PORTAL_USER_MAST u, LHSSYS_USER_APP_KEY_VALIDATION v, LHSSYS_PORTAL_TAB_MAST T where u.portal_User_code = v.user_code and(u.portal_User_code = '").append(userID.toUpperCase()).append("' or u.Portal_user_email = '").append(userID).append("' or u.Portal_user_mobile = '").append(userID).append("' ) and u.password = '").append(password).append("' and v.default_app_selection = 'T' and V.Module = T.TAB_ID ");
//                    stringBuffer.append("select u.login_id user_code, initcap(u.Client_name) userName, u.Entity_code ENTITY, '' DIVISION, '' ACC_YEAR, '' DEPT_CODE, v.module, v.geo_org_code_scheme, T.DASHBOARD_LINK, v.device_name, v.device_id from VIEW_CLIENT_LOGIN_MAST u, LHSSYS_USER_APP_KEY_VALIDATION v, LHSSYS_PORTAL_TAB_MAST T where u.user_code = v.user_code and(u.user_code = '").append(userID.toUpperCase()).append("'  or u.email='").append(userID).append("' or 'u.mobile'='").append(userID).append("' or u.login_id='").append(userID).append("' )  and u.password = '").append(password).append("'   and v.default_app_selection = 'T' and V.Module = T.TAB_ID ");
                } else {
                    System.out.println("USER_MAST MODE");
//                if (device_id != null && !device_name.isEmpty() && device_name != null && !device_id.isEmpty()) {
//                    if (encryptFlag.equals("T")) {
////                        stringBuffer.append("select u.user_code,initcap(u.user_name) userName,u.ENTITY, u.DIVISION, u.ACC_YEAR, u.DEPT_CODE,v.module, T.DASHBOARD_LINK  from user_mast u,LHSSYS_USER_APP_KEY_VALIDATION v, LHSSYS_PORTAL_TAB_MAST T where u.user_code=v.user_code and (u.user_code= '").append(userID.toUpperCase()).append("'  or u.email='").append(userID).append("' or 'u.mobile'='").append(userID).append("' )  and u.password = lhs_utility.get_encrypt('").append(password).append("')  and v.default_app_selection='T' and v.device_name='").append(deviceName).append("'   and V.Module = T.TAB_ID and v.device_id='").append(deviceId).append("'");
//                        stringBuffer.append("select u.user_code,initcap(u.user_name) userName,u.ENTITY, u.DIVISION, u.ACC_YEAR, u.DEPT_CODE,v.module, T.DASHBOARD_LINK , v.device_name,v.device_id from user_mast u,LHSSYS_USER_APP_KEY_VALIDATION v, LHSSYS_PORTAL_TAB_MAST T where u.user_code=v.user_code and (u.user_code= '").append(userID.toUpperCase()).append("'  or u.email='").append(userID).append("' or 'u.mobile'='").append(userID).append("' )  and u.password = lhs_utility.get_encrypt('").append(password).append("')  and v.default_app_selection='T' and V.Module = T.TAB_ID");
//                    } else {
////                        stringBuffer.append("select u.user_code,initcap(u.user_name) userName,u.ENTITY, u.DIVISION, u.ACC_YEAR, u.DEPT_CODE,v.module, T.DASHBOARD_LINK  from user_mast u,LHSSYS_USER_APP_KEY_VALIDATION v, LHSSYS_PORTAL_TAB_MAST T where u.user_code=v.user_code and (u.user_code= '").append(userID.toUpperCase()).append("'  or u.email='").append(userID).append("' or 'u.mobile'='").append(userID).append("' )  and u.password = '").append(password).append("'  and v.default_app_selection='T' and v.device_name='").append(deviceName).append("' and V.Module = T.TAB_ID and v.device_id='").append(deviceId).append("'");
//                        stringBuffer.append("select u.user_code,initcap(u.user_name) userName,u.ENTITY, u.DIVISION, u.ACC_YEAR, u.DEPT_CODE,v.module, T.DASHBOARD_LINK,v.device_name,v.device_id  from user_mast u,LHSSYS_USER_APP_KEY_VALIDATION v, LHSSYS_PORTAL_TAB_MAST T where u.user_code=v.user_code and (u.user_code= '").append(userID.toUpperCase()).append("'  or u.email='").append(userID).append("' or 'u.mobile'='").append(userID).append("' )  and u.password = '").append(password).append("'  and v.default_app_selection='T' and V.Module = T.TAB_ID ");
//                    }
//                } else {
                    if (encryptFlag.equals("T")) {
                        stringBuffer.append("select u.user_code,initcap(u.user_name) userName,u.ENTITY, u.DIVISION, u.ACC_YEAR, u.DEPT_CODE,v.module, v.geo_org_code_scheme, T.DASHBOARD_LINK ,v.device_name,v.device_id from user_mast u,LHSSYS_USER_APP_KEY_VALIDATION v, LHSSYS_PORTAL_TAB_MAST T where u.user_code=v.user_code and (u.user_code= '").append(userID.toUpperCase()).append("'  or u.email='").append(userID).append("' or 'u.mobile'='").append(userID).append("' )  and u.password = lhs_utility.get_encrypt('").append(password).append("')  and v.default_app_selection='T' and V.Module = T.TAB_ID  ");
                    } else {
                        stringBuffer.append("select u.user_code,initcap(u.user_name) userName,u.ENTITY, u.DIVISION, u.ACC_YEAR, u.DEPT_CODE,v.module, v.geo_org_code_scheme, T.DASHBOARD_LINK ,v.device_name,v.device_id from user_mast u,LHSSYS_USER_APP_KEY_VALIDATION v, LHSSYS_PORTAL_TAB_MAST T where u.user_code=v.user_code and (u.user_code= '").append(userID.toUpperCase()).append("'  or u.email='").append(userID).append("' or 'u.mobile'='").append(userID).append("' )  and u.password = '").append(password).append("'  and v.default_app_selection='T' and V.Module = T.TAB_ID ");
                    }
                }

                U.log("USER LOGIN SQL : " + stringBuffer.toString());
                preparedStatement = connection.prepareStatement(stringBuffer.toString());
                resultSet = preparedStatement.executeQuery();
                if (resultSet != null && resultSet.next()) {
                    System.out.println("************************************");
                    try {
                        updateLoginLog(userID, locationTrackingFlag);
                    } catch (Exception e) {
                    }
                    
                    if (device_id != null && !device_name.isEmpty() && device_name != null && !device_id.isEmpty()) {
                        if (appkeyValidationFlag != null && !appkeyValidationFlag.isEmpty()) {
                            if (appkeyValidationFlag.equalsIgnoreCase("Y")) {
//                                if ((deviceName == null ? device_name != null : !deviceName.equals(device_name)) && (device_name == null ? deviceId != null : !di.equals(deviceId))) {
                                System.out.println("table device_name --> " + device_name + " device_id-->" + device_id);
                                System.out.println("mobile device_name --> " + deviceName + " device_id-->" + deviceId);
                                if (!deviceName.equals(device_name) && !deviceId.equals(device_id)) {
                                    model.setMessage("Registered Device mismatch, Please contact Admin");
                                    return model;
                                }
                            }
                        }
                    }
                    System.out.println("&&&&&&&&&&&&&&&&&&&&&&&&&&");
                    System.out.println(resultSet.getString("user_code"));
                    model.setUser_code(resultSet.getString("user_code"));
                    model.setUserName(resultSet.getString("userName"));
                    model.setMessage("User is authenticated");
                    model.setModule(resultSet.getString("module"));
                    model.setAcc_year(resultSet.getString("Acc_year"));
                    model.setDept_code(resultSet.getString("Dept_code"));
                    model.setDivision(resultSet.getString("Division"));
                    model.setEntity_code(resultSet.getString("entity"));
                    model.setDashboardLink(resultSet.getString("DASHBOARD_LINK"));
                    model.setTracking_interval(resultSet.getString("geo_org_code_scheme"));
//                model.setAcc_code(resultSet.getString("acc_code"));
                    String topic = "";
                    try {
                        preparedStatement = connection.prepareStatement("select PUSH_ALERT_TOPIC from LHSSYS_USER_APP_KEY_VALIDATION where user_code= '" + userID.toUpperCase() + "'");
                        ResultSet rs = preparedStatement.executeQuery();
                        if (rs != null && rs.next()) {
                            topic = rs.getString("PUSH_ALERT_TOPIC");
                        }
                    } catch (SQLException e) {
                        System.out.println("PUSH_ALERT_TOPIC ERROR--> " + e.getMessage());
                    }
                    model.setNotif_topic(topic);
                    try {
                        String appkeyupdateSql = "";
//                        if (device_id != null && !device_name.isEmpty() && device_name != null && !device_id.isEmpty()) {
//                            appkeyupdateSql = "UPDATE LHSSYS_USER_APP_KEY_VALIDATION  SET appkey=upper('" + appKey + "'),"
//                                    + " PUSH_ALERT_TOKEN_NO = '" + notificationToken + "' WHERE USER_CODE = '" + userID.toUpperCase() + "'";
//                        } else {
                        appkeyupdateSql = "UPDATE LHSSYS_USER_APP_KEY_VALIDATION  SET appkey=upper('" + appKey + "'),"
                                + " device_id='" + deviceId + "',device_name='" + deviceName + "',"
                                + "PUSH_ALERT_TOPIC = '" + appVersion + "',"
                                + " PUSH_ALERT_TOKEN_NO = '" + notificationToken + "' WHERE USER_CODE = '" + userID.toUpperCase() + "' and appkey =upper('"+ appKey  +"')"; 
//                        }
                            System.out.println("appkey update sql==> "+appkeyupdateSql);
                        preparedStatement = connection.prepareStatement(appkeyupdateSql);
                        int result = preparedStatement.executeUpdate();
//                        if (result > 0) {
//                            System.out.println("LHSSYS_USER_APP_KEY_VALIDATION updated ");
//                        } else {
//                            System.out.println("LHSSYS_USER_APP_KEY_VALIDATION not updated ");
//                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        System.out.println("Error --> " + e.getMessage());
                    }
                } else {
                    model.setMessage("Invalid credentials or device ID");
//                model.setMessage(userID + " UserId is not registered,Please contact with your system administrator.");
                }
            }
        } catch (SQLException e) {
            U.log(e);
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

        return model;
    }

    public MessageJSON changePassword(String userID, String oldPassword, String newPassword) {
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String changePasswordSQL = "";
        String changePasswordResult = "";
        String obtainedPassword = "";
        String obtainPasswordSQL = "";
        MessageJSON obj = new MessageJSON();
        try {
            obtainPasswordSQL = "select u.password from user_mast u where u.user_code = '" + userID + "'";
            U.log("OBTAIN PASSWORD SQL : " + obtainPasswordSQL);
            preparedStatement = connection.prepareStatement(obtainPasswordSQL);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                obtainedPassword = resultSet.getString(1);
                System.out.println("obtainedPassword : " + obtainedPassword);
                if (oldPassword.equals(obtainedPassword)) {
                    changePasswordSQL = "update user_mast u set password = '" + newPassword + "' where user_code = '" + userID + "'";
                    U.log("CHANGE PASSWORD SQL : " + changePasswordSQL);
                    preparedStatement = connection.prepareStatement(changePasswordSQL);
                    int n = preparedStatement.executeUpdate();
                    if (n == 1) {
                        changePasswordResult = "Password updated successfully..";
                        obj.setResult(changePasswordResult);
                        obj.setStatus("success");
                        System.out.println(changePasswordResult);
                    } else {
                        changePasswordResult = "Given details doesn't match";
                        obj.setResult(changePasswordResult);
                        obj.setStatus("error");
                        System.out.println(changePasswordResult);
                    }
                } else {
                    changePasswordResult = "Given details doesn't match";
                    obj.setResult(changePasswordResult);
                    obj.setStatus("error");
                    System.out.println(changePasswordResult);
                }
            } else {
                changePasswordResult = "Given details doesn't match";
                obj.setResult(changePasswordResult);
                obj.setStatus("error");
                System.out.println(changePasswordResult);
            }
        } catch (SQLException e) {
            U.log(e);
            changePasswordResult = "Given details doesn't match";
            obj.setResult(changePasswordResult);
            obj.setStatus("error");
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                    connection.close();
                } catch (SQLException e) {
                    U.log(e);
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
            System.out.println("result==>" + result);

            String user_info = "select r.retailer_code,initcap(r.retailer_name) userName,T.tab_name "
                    + " from retailer_mast r,LHSSYS_PORTAL_TAB_MAST T "
                    + " where r.retailer_name='" + username + "' and t.tab_name= 'Guest'";

            ps = connection.prepareStatement(user_info);
            resultSet = ps.executeQuery();
            U.log(" Guest USER LOGIN SQL : " + user_info);
            if (resultSet != null && resultSet.next()) {
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
            U.log(e);
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
                System.out.println("appLogSql--> " + appLogSql);
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
                                    hashMap.put("dbSid", rs.getString("db_sid"));
                                    hashMap.put("entity_code_str", rs.getString("entity_code_str"));
                                    hashMap.put("app_valid_upto_date", rs.getString("app_valid_upto_date"));
                                    hashMap.put("app_valid_upto_message", rs.getString("app_valid_upto_message"));
                                    hashMap.put("validupto_message_prompt_days", rs.getString("validupto_message_prompt_days"));
                                    hashMap.put("device_validation", device_validation);
                                    hashMap.put("loginFlag", loginFlag);
                                    hashMap.put("locationTrackingFlag", rs.getString("location_tracking_flag"));
                                    hashMap.put("appUpdateFlag", rs.getString("app_update_flag"));
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
                                hashMap.put("dbSid", rs.getString("db_sid"));
                                hashMap.put("device_validation", device_validation);
                                hashMap.put("loginFlag", loginFlag);
                                hashMap.put("locationTrackingFlag", rs.getString("location_tracking_flag"));
                                hashMap.put("appUpdateFlag", rs.getString("app_update_flag"));
                                hashMap.put("entity_code_str", rs.getString("entity_code_str"));
                                hashMap.put("app_valid_upto_date", rs.getString("app_valid_upto_date"));
                                hashMap.put("app_valid_upto_message", rs.getString("app_valid_upto_message"));
                                hashMap.put("validupto_message_prompt_days", rs.getString("validupto_message_prompt_days"));
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
                            hashMap.put("dbSid", rs.getString("db_sid"));
                            hashMap.put("device_validation", device_validation);
                            hashMap.put("loginFlag", loginFlag);
                            hashMap.put("locationTrackingFlag", rs.getString("location_tracking_flag"));
                            hashMap.put("appUpdateFlag", rs.getString("app_update_flag"));
                            hashMap.put("entity_code_str", rs.getString("entity_code_str"));
                            hashMap.put("app_valid_upto_date", rs.getString("app_valid_upto_date"));
                            hashMap.put("app_valid_upto_message", rs.getString("app_valid_upto_message"));
                            hashMap.put("validupto_message_prompt_days", rs.getString("validupto_message_prompt_days"));

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

    public String updateLoginLog(String userID, String locationTrackingFlag) {
        String logStatus = "";
        String loginHistoryTable = "";
        if (locationTrackingFlag.equalsIgnoreCase("T")) {
            loginHistoryTable = "LHSSYS_PORTAL_APP_LOC_TRAN";
        } else {
            loginHistoryTable = "LHSSYS_PORTAL_APP_TRAN";
        }
        String loginLogQuery = "INSERT INTO " + loginHistoryTable + " (SEQ_ID,DYNAMIC_TABLE_SEQ_ID,COL1, COL2,COL3, LASTUPDATE, USER_CODE)"
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

    public String logOutEntry(String userID, String locationTrackingFlag) {
        String logStatus = "";
        PreparedStatement ps = null;
        String logOutHistoryTable = "";
        if (locationTrackingFlag.equalsIgnoreCase("T")) {
            logOutHistoryTable = "LHSSYS_PORTAL_APP_LOC_TRAN";
        } else {
            logOutHistoryTable = "LHSSYS_PORTAL_APP_TRAN";
        }
        String logOutQuery = "INSERT INTO " + logOutHistoryTable + " (SEQ_ID,DYNAMIC_TABLE_SEQ_ID,COL1, COL2,COL3, LASTUPDATE, USER_CODE)"
                + " VALUES ('-2','-2','-2','" + userID + "',lhs_utility.get_name('user_code','" + userID + "'),sysdate, '" + userID + "')";
        System.out.println("LOG Out QRY : " + logOutQuery);
        try {
            ps = connection.prepareStatement(logOutQuery);
            int loginLogCount = ps.executeUpdate();
            if (loginLogCount > 0) {
                logStatus = "success";
            } else {
                logStatus = "error";
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }
        return logStatus;
    }
}
