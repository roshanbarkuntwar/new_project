/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.AppKeyAuthenticationModel;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCAppKeyVerificationDAO {

    Connection connection;

    public JDBCAppKeyVerificationDAO(Connection c) {
        this.connection = c;
    }

    public AppKeyAuthenticationModel AppkeyAunthetication(String appkey) {
        AppKeyAuthenticationModel appkeyAuth = new AppKeyAuthenticationModel();
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        StringBuilder stringBuffer = new StringBuilder();
        try {
            stringBuffer.append("select user_code,module from user_key_android_validation where appkey = '").append(appkey.toUpperCase()).append("'");
            preparedStatement = connection.prepareStatement(stringBuffer.toString());
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                appkeyAuth.setUserCode(resultSet.getString(1));
                appkeyAuth.setMessage("Appkey validated");
                appkeyAuth.setAppType(resultSet.getString("module"));
            }
        } catch (SQLException e) {
            appkeyAuth.setMessage("Appkey not validated");
            System.out.println("exception ---> " + e.getMessage());
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }
        return appkeyAuth;
    }

    public ArrayList<HashMap<String, String>> getAppUsers() {

        ArrayList<HashMap<String, String>> userList = new ArrayList<HashMap<String, String>>();

        String sql = "select v.*,u.user_name from lhssys_user_app_key_validation v,user_mast u where u.user_code=v.user_code order by u.user_name";
        try {

            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    HashMap<String, String> user = new HashMap<String, String>();
                    user.put("appkey", resultSet.getString("appkey"));
                    user.put("user_code", resultSet.getString("user_code"));
                    user.put("user_name", resultSet.getString("user_name"));
                    user.put("device_id", resultSet.getString("device_id"));
                    user.put("device_name", resultSet.getString("device_name"));
                    user.put("module", resultSet.getString("module"));
                    user.put("default_app_selection", resultSet.getString("default_app_selection"));
                    user.put("push_alert_token_no", resultSet.getString("push_alert_token_no"));
                    try {
                        user.put("push_alert_topic", resultSet.getString("push_alert_topic"));
                    } catch (Exception e) {
                        user.put("push_alert_topic", "");
                    }

                    userList.add(user);
                } while (resultSet.next());
            }
        } catch (SQLException e) {
            System.out.println("exception ---> " + e.getMessage());
        }
        return userList;
    }

    public ArrayList<HashMap<String, String>> getAppCofigrationDetail() {

        ArrayList<HashMap<String, String>> userList = new ArrayList<HashMap<String, String>>();

//        String sql = "select * from lhssys_app_cofigration_log order by seq_no ";
        String sql1 = "SELECT   l.*,j.total_user, NVL(j.used,'0') used   from  Lhssys_App_Cofigration_Log  l,\n"
                + " (select u.seq_no,\n"
                + "       count(u.seq_no) as total_user,\n"
                + "       (select NVL(COUNT(u1.seq_no),'0') \n"
                + "          from lhssys_appkey_log u1\n"
                + "         where u1.device_id is not null\n"
                + "           and u1.seq_no = u.seq_no\n"
                + "         group by u1.seq_no) used\n"
                + "  from lhssys_appkey_log u\n"
                + " group by u.seq_no\n"
                + " ORDER BY SEQ_NO ) j where j.seq_no = l.seq_no order by L.SEQ_NO";
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql1);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    HashMap<String, String> user = new HashMap<String, String>();
                    user.put("seq_no", resultSet.getString("seq_no"));
                    user.put("server_url1", resultSet.getString("server_url1"));
                    user.put("server_url2", resultSet.getString("server_url2"));
                    user.put("server_url3", resultSet.getString("server_url3"));
                    user.put("server_url4", resultSet.getString("server_url4"));
                    user.put("war_name", resultSet.getString("war_name"));
                    user.put("dbUrl", resultSet.getString("database_ip"));
                    user.put("portNo", resultSet.getString("database_port"));
                    user.put("dbName", resultSet.getString("database_name"));
                    user.put("dbPassword", resultSet.getString("database_password"));
                    user.put("entity_code", resultSet.getString("entity_code"));
                    user.put("entity_code_str", resultSet.getString("entity_code_str"));
                    user.put("device_validation", resultSet.getString("device_validation"));
                    user.put("user_count", resultSet.getString("user_count"));
                    user.put("total_user", resultSet.getString("total_user"));
                    user.put("used", resultSet.getString("used"));
                    userList.add(user);
                } while (resultSet.next());
            }
        } catch (SQLException e) {
            System.out.println("exception ---> " + e.getMessage());
        }
        return userList;
    }

    public HashMap<String, String> resetLhsCareAppKey(String appKey, String userCode) {

//        ArrayList<HashMap<String, String>> resetUserList = new ArrayList<HashMap<String, String>>();
        HashMap<String, String> resetUser = new HashMap<String, String>();
//        String sql = "select * from lhssys_app_cofigration_log order by seq_no ";
        String sql1 = "update LHSSYS_APPKEY_LOG a set a.device_id = '', a.device_name = '' where a.appkey='" + appKey + "'";
        System.out.println("LHSCARE SQL: " + sql1);
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql1);
            int resetCount = preparedStatement.executeUpdate();

            if (resetCount > 0) {
                resetUser.put("status", "success");
                resetUser.put("message", "AppKey Reset Successfully inside LHSCARE");
//                resetUserList.add(resetUser);
            } else {
                resetUser.put("status", "error");
                resetUser.put("message", "Key Not Available inside LHSCARE");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("exception ---> " + e.getMessage());
        }
        return resetUser;
    }

    public HashMap<String, String> resetUserAppKeyValidation(String appKey, String userCode) {

        HashMap<String, String> resetUser = new HashMap<String, String>();
        String sql1 = "update LHSSYS_USER_APP_KEY_VALIDATION l\n"
                + "   set l.appkey = '.', l.device_id = '', l.device_name = ''\n"
                + " where l.appkey = '" + appKey + "'\n"
                + "   and l.user_code = '" + userCode + "'";
//        System.out.println("APPKEY Validation SQL: " + sql1);
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql1);
            int resetCount = preparedStatement.executeUpdate();

            if (resetCount > 0) {
                resetUser.put("status", "success");
                resetUser.put("message", "AppKey Reset Successfully");
//                resetUserList.add(resetUser);
            } else {
                resetUser.put("status", "error");
                resetUser.put("message", "App Key Not in USE");
            }
        } catch (SQLException e) {
//            e.printStackTrace();
            System.out.println("exception ---> " + e.getMessage());
        }
        return resetUser;
    }

    public ArrayList<HashMap<String, String>> getAppKeyUsers(String seqNo, String status) {
        ArrayList<HashMap<String, String>> userList = new ArrayList<HashMap<String, String>>();
        String sql = "";
        if (status.equalsIgnoreCase("Active")) {
            sql = "select * from lhssys_appkey_log where seq_no=" + seqNo + " and device_id is not null order by seq_no ";
        } else if (status.equalsIgnoreCase("In-active")) {
            sql = "select * from lhssys_appkey_log where seq_no=" + seqNo + " and device_id is null order by seq_no ";
        }
//        System.out.println("getAppKeyUsers SQL: " + sql);

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    HashMap<String, String> user = new HashMap<String, String>();
                    user.put("appkey", resultSet.getString("appkey"));
                    user.put("user_code", resultSet.getString("user_code"));
                    user.put("device_id", resultSet.getString("device_id"));
                    user.put("device_name", resultSet.getString("device_name"));

                    userList.add(user);
                } while (resultSet.next());
            }
        } catch (SQLException e) {
            System.out.println("exception ---> " + e.getMessage());
        }
        return userList;
    }
}
