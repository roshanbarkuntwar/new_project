/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.NewEntryModel;
import com.lhs.EMPDR.utility.U;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCNewEntryDAO {

    Connection connection;

    public JDBCNewEntryDAO(Connection connection) {
        this.connection = connection;
    }

    public String updateEntryDetail(int seqId, int fileId, String userCode, String projectCode, String date, String activityCode, String WBSName, String contractorCode, String remark, InputStream is, String fileName, String sysFileName, String desc, String lat, String longitude, String add) {
        NewEntryModel model = new NewEntryModel();
        String result = "";
        PreparedStatement ps = null;
        ResultSet resultSet = null;
        StringBuffer stringBuffer = new StringBuffer();
        try {
            updateDocument(fileId, fileName, userCode, desc, sysFileName, is);
            stringBuffer.append("update  lhssys_portal_app_tran\n"
                    + "set COL2=?,COL3=?,COL4=?,COL5=?,COL6=?,COL7=?,COL8=?,COL9=? \n"
                    + ",col10=?,col11=?,col12=? where seq_id=" + seqId);
            ps = connection.prepareStatement(stringBuffer.toString());
            ps.setString(1, userCode);
            ps.setString(2, projectCode);
            ps.setString(3, date);
            ps.setString(4, activityCode);
            ps.setString(5, WBSName);
            ps.setString(6, contractorCode);
            ps.setString(7, remark);
            ps.setString(8, (seqId * (-1) + ""));
            ps.setString(9, lat);
            ps.setString(10, longitude);
            ps.setString(11, add);

            int n = ps.executeUpdate();
            result = n + " Records updated  sucessfully";
        } catch (Exception e) {
            model.setMessage("Records not updated  sucessfully");
            result = "Records not updated  sucessfully ";
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return result;
    }

    public String addNewEntry(int seqNo, String userCode, String projectCode,
            String date, String activityCode, String WBSName, String contractorCode,
            String remark, InputStream is, String fileName, String sysFileName,
            String desc, String lat, String longitude, String add) {
        NewEntryModel model = new NewEntryModel();
        String result = "";
        PreparedStatement ps = null;
        ResultSet resultSet = null;
        StringBuffer stringBuffer = new StringBuffer();
        try {
            if (WBSName == null) {
                WBSName = " ";
            }
            if (lat == null) {
                lat = " ";
            }
            if (longitude == null) {
                longitude = " ";
            }
            if (add == null) {
                add = " ";
            }
            if (remark == null) {
                remark = "  ";
            }
            insertDocument(fileName, userCode, desc, sysFileName, is);
            int seqId = getDocumentListCount();
            seqId = (seqId + 1);
            stringBuffer.append("Insert into lhssys_portal_app_tran\n"
                    + "(Col1,COL2,COL3,COL4,COL5,COL6,COL7,COL8,COL9,\n"
                    + "col10,col11,col12,Seq_id,user_code) \n"
                    + "values(" + seqNo + ",'" + userCode + "','" + projectCode + "\n"
                    + "','" + date.toString() + "','" + activityCode + "','" + WBSName + "','\n"
                    + contractorCode + "',?,'" + (seqId * (-1) + "") + "','" + lat + "','" + longitude
                    + "\n','" + add + "'," + seqId + ",'" + userCode + "')");
            ps = connection.prepareStatement(stringBuffer.toString());
            ps.setString(1, remark);
            ps.execute();
            result = "new entries value are inserted sucessfully";
        } catch (Exception e) {
            model.setMessage("Not insert new entry");
            result = "new entries value are not inserted ";
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return result;
    }

    public int updateDocument(int fileId, String fileName, String userCode,
            String discribtion, String systemFileName, InputStream fin) throws Exception {
        int status = 0;
        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            sqlDocumentInsert = "update LHSSYS_portal_upload_file set FILE_ID=?,FILE_NAME=?,\n"
                    + "UPLOADATE_DATE=sysdate,LAST_UPDATED=sysdate,DESCRIBTION=?,\n"
                    + "USER_CODE=?,FLAG='h',SYSTEM_FILE_NAME=?,\n"
                    + "STORE_FILE=? where file_id=" + fileId;
            System.out.println("UPDATE IMG?DOC SQL : " + sqlDocumentInsert);
            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setInt(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());
            status = pst.executeUpdate();
        } catch (IOException e) {
        } catch (SQLException e) {
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

    public int insertDocument(String fileName, String userCode, String discribtion,
            String systemFileName, InputStream fin) throws Exception {
        int status = 0;
        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            int fileId = getDocumentListCount();
            fileId = (fileId + 1) * (-1);
            sqlDocumentInsert = "insert into LHSSYS_portal_upload_file (FILE_ID,FILE_NAME,\n"
                    + "UPLOADATE_DATE,LAST_UPDATED,DESCRIBTION,USER_CODE,FLAG,\n"
                    + "SYSTEM_FILE_NAME,STORE_FILE) values (?,?,sysdate,sysdate,?,?,'h',?,?)";

            System.out.println("compile qry == " + sqlDocumentInsert);

            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setInt(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());

            status = pst.executeUpdate();
            System.out.println("result------" + status);
        } catch (Exception e) {
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

    public int getDocumentListCount() throws Exception {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int listCount = 0;
        try {
            String selectQry = "select max(seq_id) from lhssys_portal_app_tran  ";
            pst = connection.prepareStatement(selectQry);
            rs = pst.executeQuery();
            while (rs.next()) {
                listCount = rs.getInt(1);
            }
        } catch (SQLException ex) {
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException e) {
                }
            }
        }
        return listCount;
    }
}
