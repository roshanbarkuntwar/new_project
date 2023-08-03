/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.connection;

import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 *
 * @author premkumar.agrawal
 */
public class PIXERPConnectionProvider {

    public static String domain_name = "192.168.100.10:1521";
    public static String db_user_name = "PIXERP";
    public static String db_password = "PIXERP";

    public static void main(String args[]) throws SQLException {
    }
    // initialize DB connection

    public static Connection getConnection() {
        Connection connection = null;
        try {
            String url = "jdbc:oracle:thin:@" + domain_name + ":ORA10G";
            String username = db_user_name;
            String password = db_password;
            Class.forName("oracle.jdbc.driver.OracleDriver");
            System.out.println("class found");
            connection = DriverManager.getConnection(url, username, password);
        } catch (ClassNotFoundException e) {
            System.out.println(e);
        } catch (SQLException e) {
            System.out.println(e);
        }
        System.out.println("\n connection ====" + connection + "\n");
        return connection;
    }

    // close DB connection
    public static void closeConnection(Connection connection) {
        try {
            if (connection != null) {
                connection.close();
                System.out.println("\n connection closed ====" + connection + "\n");
            }
        } catch (SQLException e) {
        }
    }
}
