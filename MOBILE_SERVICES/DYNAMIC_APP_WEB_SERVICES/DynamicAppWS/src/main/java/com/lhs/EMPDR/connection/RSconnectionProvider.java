/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.connection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 *
 * @author premkumar.agrawal
 */
public class RSconnectionProvider {

    public static String domain_name = "192.168.100.10:1521";//"172.1.0.2:1521";// 
    public static String db_user_name = "CPGTEST";//CPGERP";//"CPGTEST";
    public static String db_password = "CPGTEST";//CPGERP"; //"CPGTEST";

    public static void main(String args[]) throws SQLException {
    }
    // initialize DB connection

    public static Connection getConnection(String entity, String domainName, String PortNo, String dbName, String pass) {
        String DomainUrl;
//        for JSPLERP client 
//        TimeZone timeZone = TimeZone.getTimeZone("Asia/Kolkata");
//        TimeZone.setDefault(timeZone);
//          for ROHAS client
//        TimeZone timeZone = TimeZone.getTimeZone("Asia/Kuala_Lumpur");
//        TimeZone.setDefault(timeZone);

        if (!domainName.equals("NA")) {
            DomainUrl = domainName + ":" + PortNo;
        } else {
            DomainUrl = domain_name;
        }
        if (dbName.equals("NA")) {
            dbName = db_user_name;
            pass = db_password;
        } else {
//            System.out.println("DATABASE username : " + dbName + " DATABASE password : " + pass);
        }
        Connection connection = null;
        try {
//            String url = "jdbc:oracle:thin:@" + DomainUrl + ":ORA11G"; // ROHASERP -- SSELERP --MPPLERP  --SMBHVERP 
            String url = "jdbc:oracle:thin:@" + DomainUrl + ":ORA10G"; // MANERP 
//            String url = "jdbc:oracle:thin:@" + DomainUrl + ":ORA12C"; // LPIMERP 
//            String url = "jdbc:oracle:thin:@" + DomainUrl + ":ORCL"; // SSLERP -- RPSILERP
//            String url = "jdbc:oracle:thin:@" + DomainUrl + ":ora9i"; // FOR SONIVERP
//            System.out.println("DATABASE username : " + dbName + " DATABASE password : " + pass + "\n");
//            String url = "jdbc:oracle:thin:@" + DomainUrl + ":ora12c"; // SSLERP -- RPSILERP sartherp
            if (DomainUrl.contains("192.168.100.233")) {
                url = "jdbc:oracle:thin:@" + DomainUrl + ":ORCL";
            }

            if (DomainUrl.contains("192.168.100.235")) {
                url = "jdbc:oracle:thin:@" + DomainUrl + ":ORCL";
            }

            System.out.print("connection --> " + url + "," + dbName + ":" + pass);
            String username = dbName;
            String password = pass;
            Class.forName("oracle.jdbc.driver.OracleDriver");
            connection = DriverManager.getConnection(url, username, password);

//            Class.forName("org.postgresql.Driver");
//            connection = DriverManager.getConnection("jdbc:postgresql://192.168.100.231:5432/NETVISION", "postgres", "lhs@12345");
        } catch (ClassNotFoundException e) {
            System.out.println(e);
        } catch (SQLException e) {
            System.out.println(e);
        }
        System.out.println(" Connection : " + connection);
        return connection;
    }

// close DB connection
    public static void closeConnection(Connection connection) {
        try {
            if (connection != null) {
                connection.close();
//                System.out.println("\n connection closed : " + connection + "\n");
            }
        } catch (SQLException e) {
        }
    }
}
