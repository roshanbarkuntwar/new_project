///*
// * To change this license header, choose License Headers in Project Properties.
// * To change this template file, choose Tools | Templates
// * and open the template in the editor.
// */
//package com.lhs.EMPDR.dao;
//
//import com.lhs.quizapp.userregistermodel.CourceJsonMapper;
//import com.lhs.EMPDR.utility.U;
//import java.sql.Connection;
//import java.sql.PreparedStatement;
//import java.sql.ResultSet;
//import java.text.DateFormat;
//import java.text.SimpleDateFormat;
//import java.util.ArrayList;
//import java.util.Date;
//import org.codehaus.jackson.map.ObjectMapper;
//
///**
// *
// * @author trainee
// */
//public class JDBCRegistrationDAO {
//
//    String status;
//
//    public String getStatus() {
//        return status;
//    }
//
//    public void setStatus(String status) {
//        this.status = status;
//    }
//
//    public Connection getConnection() {
//        return connection;
//    }
//
//    public void setConnection(Connection connection) {
//        this.connection = connection;
//    }
//
//    public Connection connection = null;
//
//    public JDBCRegistrationDAO(Connection connection) {
//        this.connection = connection;
//    }
//
//    public String setRegistrationDetail(String firstName, String lastName, String city, String mobile, String gender, String course, String password, String loginId, String DOB) throws Exception {
//        //CREATEDDATE,USER_REG_NO,FIRST_NAME,LAST_NAME,GEO_CODE,MOBILE,GENDER,PROG_CODE_STR,LOGIN_ID,PASSWORD
//
//        PreparedStatement psmt = null;
//        ResultSet resultset = null;
//        try {
//            //system date
//            DateFormat dateFormat = new SimpleDateFormat("d/M/yyyy HH:mm:ss a");
//            Date date = new Date();
//            System.out.println(dateFormat.format(date));
//            java.sql.Date sqlDate = new java.sql.Date(date.getTime());
//            System.out.println("ssqldate==" + sqlDate);
//            String userNo = "";
//
//            //for DOB date
//             DateFormat dobDateFormat = new SimpleDateFormat("d/M/yyyy");
//             U.log("enter dOB="+DOB);
//             Date dobdate=(Date)dobDateFormat.parse(DOB);
//             java.sql.Date sqlDOBDate = new java.sql.Date(dobdate.getTime());
//            System.out.println("ssqldate==" + sqlDOBDate);
//             
//             
//            //for course id from json
//            ObjectMapper mapper = new ObjectMapper();
//            CourceJsonMapper[] map = mapper.readValue(course, CourceJsonMapper[].class);
//
//            U.log("size=" + map.length);
//            String courseNameString = "";
//            for (int i = 0; i < map.length; i++) {
//
//                if (map[i].getChecked().contains("true")) {
//                    if (courseNameString.length() > 2) {
//                        courseNameString += " | ";
//                    }
//                    courseNameString += map[i].getCourse();
//                }
//
//            }
//
//            System.out.println("courseNameString==" + courseNameString);
//            String sql = "select count(*) from USER_REG_MAST";
//            psmt = connection.prepareStatement(sql);
//            resultset = psmt.executeQuery();
//            resultset.next();
//            userNo = "QREG" + (resultset.getInt(1) + 1);
//            System.out.println("resultset=" + resultset.getInt(1) + 1);
//
//            sql = "INSERT INTO USER_REG_MAST(FIRST_NAME, LAST_NAME,GEO_CODE,MOBILE,GENDER,PROG_CODE_STR,LOGIN_ID,PASSWORD,CREATEDDATE,USER_REG_NO,EMAIL,DOB) VALUES (?, ?,?,?,?,?,?,?,?,?,?,?)";
//            psmt = connection.prepareStatement(sql);
//
//            psmt.setString(1, firstName);
//            psmt.setString(2, lastName);
//            psmt.setString(3, city);
//            psmt.setString(4, mobile);
//            psmt.setString(5, gender);
//            psmt.setString(6, courseNameString);
//            psmt.setString(7, loginId);
//            psmt.setString(8, password);
//            psmt.setDate(9, sqlDate);
//            psmt.setString(10, userNo);
//            psmt.setString(11, loginId);
//            psmt.setDate(12, sqlDOBDate);
//            psmt.executeQuery();
//            System.out.println("All value are set properly");
//            status = "values are inserted Succesfully ";
//        } catch (Exception e) {
//            System.out.println(e);
//            status = "values are not Saved in DB ";
//        }
//
//        return status;
//    }
//
//}
