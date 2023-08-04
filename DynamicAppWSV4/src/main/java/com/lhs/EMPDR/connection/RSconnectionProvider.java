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
import java.util.TimeZone;

/**
 *
 * @author premkumar.agrawal
 */
public class RSconnectionProvider {

    public static String domain_name = "192.168.100.10:1521";//"172.1.0.2:1521";// 
    public static String db_user_name = "CPGTEST";//CPGERP";//"CPGTEST";
    public static String db_password = "CPGTEST";//CPGERP"; //"CPGTEST";
    // initialize DB connection

    public static Connection getConnection(String entity, String domainName, String PortNo, String dbName, String pass, String dbVersion) {
        String DomainUrl;
        //        for JSPLERP client 
        TimeZone timeZone = TimeZone.getTimeZone("Asia/Kolkata");
        TimeZone.setDefault(timeZone);
        if (!domainName.equals("NA")) {
            DomainUrl = domainName + ":" + PortNo;
        } else {
            DomainUrl = domain_name;
        }
//        System.out.println("domain_name : " + DomainUrl);
        if (dbName.equals("NA")) {
            dbName = db_user_name;
            pass = db_password;
        } else {
//            System.out.println("DATABASE username : " + dbName + " DATABASE password : " + pass);
        }
        Connection connection = null;
        try {
//            String url = "jdbc:oracle:thin:@" + DomainUrl + ":ORA11G"  ; // ROHASERP 
//            String url = "jdbc:oracle:thin:@" + DomainUrl + ":ORA10G"  ; // MANERP 
//            String url = "jdbc:oracle:thin:@" + DomainUrl + ":ORCL"; // SSLERP
//            String url = "jdbc:oracle:thin:@" + DomainUrl + ":ora9i"; // FOR SONIVERP
            if (dbVersion == null) {
                if (DomainUrl.contains("192.168.100.173")) {
                    dbVersion = "ORA10G";
                } else {
                    dbVersion = "ORCL";
                }
            }
            String url = "jdbc:oracle:thin:@" + DomainUrl + ":" + dbVersion; // MANERP 

//            System.out.println("url--> " + url);
//            System.out.println("DATABASE username : " + dbName + " DATABASE password : " + pass + "\n");
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
        System.out.print("Connection : " + connection);
        return connection;
    }

    // close DB connection
    public static void closeConnection(Connection connection) {
        try {
            if (connection != null) {
                connection.close();
                System.out.println("\n connection closed : " + connection + "\n");
            }
        } catch (SQLException e) {
        }
    }

    public static void main(String args[]) {

//        Integer a = 12;
//        Integer b = 12;
//
//        System.out.println(a == b); // 

//        System.out.println("1" + 2 + 3); //15
//        System.out.println(1 + 2 + "3"); //33

        Integer aa = 128;
        Integer bb = 128;

        System.out.println(aa == bb);

    }
}
