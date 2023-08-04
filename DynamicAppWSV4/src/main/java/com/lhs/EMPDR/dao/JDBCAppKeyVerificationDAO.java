/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.AppKeyAuthenticationModel;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCAppKeyVerificationDAO {

    Connection connection;

    public JDBCAppKeyVerificationDAO(Connection c) {
        this.connection = c;
        U u = new U(this.connection);
    }

    public AppKeyAuthenticationModel AppkeyAunthetication(String appkey) {
        AppKeyAuthenticationModel appkeyAuth = new AppKeyAuthenticationModel();
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        StringBuilder stringBuffer = new StringBuilder();
        try {
            stringBuffer.append("select user_code,module from user_key_android_validation where appkey = '" + appkey.toUpperCase() + "'");
            preparedStatement = connection.prepareStatement(stringBuffer.toString());
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                appkeyAuth.setUserCode(resultSet.getString(1));
                appkeyAuth.setMessage("Appkey validated");
                appkeyAuth.setAppType(resultSet.getString("module"));
            }
        } catch (SQLException e) {
            appkeyAuth.setMessage("Appkey not validated");
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                }
            }
        }
        return appkeyAuth;
    }
}
