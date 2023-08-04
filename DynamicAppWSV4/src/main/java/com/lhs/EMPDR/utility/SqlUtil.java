/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.utility;

import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import javax.imageio.ImageIO;

/**
 *
 * @author premkumar.agrawal
 */
public class SqlUtil {

    static PreparedStatement psmt = null;
    static ResultSet resultset = null;

    public static String getCityCode(Connection con, String city) throws SQLException {
        String s = city;
        String capitol = Character.toString(s.charAt(0)).toUpperCase();
        city = capitol + s.substring(1);
        String code = "";
        String sql = "select nvl(geo_code,' ')geo_org_code from geo_mast where geo_name=?";
        psmt = con.prepareStatement(sql);
        psmt.setString(1, city);
        resultset = psmt.executeQuery();
        if (resultset.next()) {
            code = resultset.getString(1);
        }
        return code;
    }

    public static String getCity(Connection con, String citycode) {
        try {
            String code = "";
            String sql = "select nvl(geo_name,' ')geo_org_code from geo_mast where geo_code=?";
            psmt = con.prepareStatement(sql);
            psmt.setString(1, citycode.toUpperCase());
            resultset = psmt.executeQuery();
            if (resultset.next()) {
                code = resultset.getString(1);
            }
            return code;
        } catch (SQLException e) {
        }
        return "";
    }

    public static String getValue(Connection con, String code, String sqltext, String userCode) throws SQLException {
        String value = "";
        if (code != null) {
            code = code.replace("%20", "");
        }
        try {
            if (userCode != null) {
                sqltext = sqltext.replace("USER_CODE", userCode);
            }
            String sql = "select " + sqltext + " from dual ";
            psmt = con.prepareStatement(sql);
            resultset = psmt.executeQuery();
            if (resultset.next()) {
                value = resultset.getString(1);
                value = U.matchString(value, code + "~(.*?)#", 1).replaceAll("\\s+", " ").trim();
                if (value.trim().length() < 1) {
                    value = code;
                }
            }
            return value;
        } catch (SQLException e) {
            U.log(e);
        }
        return "";
    }

    public static void appendVRNO(Connection c, String vrno, String entity_code, 
            String div_code, String acc_year, String t_code) throws SQLException {
        PreparedStatement ps;
        ResultSet rs;
        String executeProc = "{call LHS_CRM.append_vrno(?,?,?,?,?)}";
        ps = c.prepareCall(executeProc);
        ps.setString(1, vrno);//vrno
        ps.setString(2, entity_code);//entity_code
        ps.setString(3, div_code);//div_code
        ps.setString(4, acc_year);//acc_year
        ps.setString(5, t_code);//t_code-----E
        ps.execute();
    }

    public static String findLovValue(String sql, String code, Connection connection) {
        String value = "";
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                value = rs.getString(1);
            }
        } catch (Exception e) {
        }
        if (value != null) {
            return value;
        } else {
            return code;
        }
    }

    //saved image
    public static String saveVideoInDB(Connection con, String imgFile, String sql, int parameterIndex) {

        String base64Image = imgFile;
        byte[] imageBytes;
        InputStream is;
        imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
        is = new ByteArrayInputStream(imageBytes);
        String status = "";
        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            sqlDocumentInsert = sql;
            pst = con.prepareStatement(sqlDocumentInsert);
            pst.setBinaryStream(parameterIndex, is, is.available());
            pst.execute();
            status = "add entry";
        } catch (IOException e) {
            U.log("FILE UPDATE ERROR===" + e);
        } catch (SQLException e) {
            U.log("FILE UPDATE ERROR===" + e);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException ex) {
                }
            }
        }
        return status;
    }

    public static InputStream getVideoFromtable(String imgDataType, Connection con, String imgColumnName, String sql) {
        InputStream imgStream = null;
        ResultSet rs = null;
        try {
            PreparedStatement ps = con.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                if (imgDataType.contains("LONG")) {
                    if (rs.getBinaryStream(imgColumnName) != null) {
                        imgStream = rs.getBinaryStream(imgColumnName);
                    } else {
                        imgStream = null;// getClass().getResourceAsStream("/defualtDp.png");
                    }
                } else if (rs.getBlob("store_file") != null) {
                    Blob b = rs.getBlob("store_file");
                    imgStream = b.getBinaryStream();
                } else {
                    imgStream = null;//getClass().getResourceAsStream("/defualtDp.png");
                }
            }
        } catch (SQLException e) {
            U.log(e);
        }
        return imgStream;
    }

    //saved image
    public static String saveImageInDB(Connection con, String imgFile, String sql, int parameterIndex) {
        String base64Image = imgFile;
        byte[] imageBytes;
        InputStream is;
        imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
        is = new ByteArrayInputStream(imageBytes);
        String status = "";
        if (is == null) {
            U.log("*******\nimage is null\n**********");
        }
        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            sqlDocumentInsert = sql;
            pst = con.prepareStatement(sqlDocumentInsert);
            pst.setBinaryStream(parameterIndex, is, is.available());
            pst.execute();
            status = "add entry";
            System.out.println("result------" + status);
        } catch (IOException e) {
            U.log("FILE UPDATE ERROR===" + e);
        } catch (SQLException e) {
            U.log("FILE UPDATE ERROR===" + e);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException ex) {
                }
            }
        }
        return status;
    }

    public static InputStream getImageFromtable(String imgDataType, Connection con, String imgColumnName, String sql) {
        InputStream imgStream = null;
        ResultSet rs = null;
        try {
            PreparedStatement ps = con.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                if (imgDataType.contains("LONG")) {
                    if (rs.getBinaryStream(imgColumnName) != null) {
                        U.log(rs.getBinaryStream(imgColumnName));
                        imgStream = rs.getBinaryStream(imgColumnName);
                    } else {
                        imgStream = null;// getClass().getResourceAsStream("/defualtDp.png");
                    }
                } else if (rs.getBlob("store_file") != null) {
                    Blob b = rs.getBlob("store_file");
                    imgStream = b.getBinaryStream();
                } else {
                    imgStream = null;//getClass().getResourceAsStream("/defualtDp.png");
                }
            }
        } catch (SQLException e) {
            U.log(e);
        }
        return imgStream;
    }

    public InputStream writeInfoOnImage(String image, String InfoToWriteOnImage) {
        U.log("ready to write on image");
        InputStream iss = null;
        try {
            Date date = Calendar.getInstance().getTime();
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
            String dateStr = formatter.format(date);
            System.out.println("datetime on image ==  "+ dateStr);
            String base64Image = image;//.split(",")[1];
            byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
            iss = new ByteArrayInputStream(imageBytes);
            BufferedImage bi = ImageIO.read(iss);
            Graphics2D graphics = bi.createGraphics();
            Font font = new Font("ARIAL", Font.PLAIN, 20);
            graphics.setFont(font);
            graphics.drawString(formatter.format(date), 25, 25);
            bi.flush();
            byte[] imageInByte;
            // convert BufferedImage to byte array
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bi, "jpg", baos);
            baos.flush();
            imageInByte = baos.toByteArray();
            baos.close();
            iss = new ByteArrayInputStream(imageInByte);
        } catch (IOException e) {
            U.log(e);
        }
        return iss;
    }
}
