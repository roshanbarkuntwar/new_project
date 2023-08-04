/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.io.FileUtils;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author anjali.bhendarkar
 */
public class JDBCOTGDeviceVerificationDAO {

    Connection connection;

    public JDBCOTGDeviceVerificationDAO(Connection conn) {
        this.connection = conn;
    }

    public HashMap<String, String> getDeviceVerificationDetails(String deviceId) {

        String sql = "select a.email,a.add4 from acc_mast a where a.spostr ='" + deviceId + "'";
        HashMap<String, String> details = new HashMap<String, String>();
        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ResultSet resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                details.put("msg", "Details found");
                details.put("email", resultSet.getString("email"));
                details.put("location", resultSet.getString("add4"));
            } else {
                details.put("msg", "Device Id  Not found");
            }
        } catch (SQLException ex) {
            System.out.println("Error--> " + ex.getMessage() + "\n" + ex.getCause());
            ex.printStackTrace();
            details.put("msg", "Error occured due to some internal reason, Please try again later");
        }
        return details;
    }

    public HashMap<String, String> uploadFile(byte[] file, String fileName[], MultipartFile mfile[],String filePath) {
        HashMap<String, String> result = new HashMap<String, String>();
        String path = "C://"+filePath;
        
        
        for(int i=0;i<fileName.length;i++){
            String filepath = path + fileName[i];

        File destFile = new File(filepath);
        if (!destFile.exists()) {
            destFile.getParentFile().mkdirs();
        }
        try {
//            String path1 = "D:\\OTGFile\\multipart\\";
            String filepath1 = path + fileName[i];

            File destFile1 = new File(filepath1);
            if (!destFile1.exists()) {
                destFile1.getParentFile().mkdirs();
            }
            FileOutputStream fos = new FileOutputStream(filepath1);
//            FileOutputStream fos = new FileOutputStream(convFile);
            fos.write(mfile[i].getBytes());
            fos.close();
            result.put("msg", "File uplaoded sucessfully!");
        } catch (Exception e) {
            result.put("msg", "Erorr while uplaoding file!");
            e.printStackTrace();
        }

        }
        
//        try {
//            File destFile = new File(filepath);
//            if (!destFile.exists()) {
//                destFile.getParentFile().mkdirs();
//            }
//            FileUtils.writeByteArrayToFile(destFile, file);
//            result.put("msg", "File moved sucessfully");
//        } catch (IOException ex) {
//            ex.printStackTrace();
//            result.put("msg", "Erorr while uplaoding file");
//        }
//
//        try {
//            FileOutputStream fos = new FileOutputStream(filepath);
//            fos.write(file);
//            fos.close();
//            // There is no more need for this line since you had created the instance of "fos" inside the try. And this will automatically close the OutputStream
//        } catch (Exception ex) {
//            ex.printStackTrace();
//        }
        return result;
    }

}
