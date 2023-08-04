/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.MessageJSON;
import com.lhs.EMPDR.JSONResult.UpdatedLocationJSON;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCLocationTrackingDAO {

    Connection c;

    public JDBCLocationTrackingDAO(Connection c) {
        this.c = c;
    }

    public MessageJSON saveSourceDestLocation(String userCode, String seqNo, String sourceLat, String sourceLong, String destLat, String destLong) {

        MessageJSON json = new MessageJSON();
        PreparedStatement ps = null;
        ResultSet rs = null;
        String seq_id = "";
        int count = 0;
        try {
            ps = c.prepareStatement("SELECT TO_CHAR(MAX(SEQ_ID) + 1) SEQ_ID FROM LHSSYS_PORTAL_APP_TRAN");
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                seq_id = rs.getString(1);
            }
        } catch (Exception e) {
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                    rs.close();
                } catch (SQLException e) {
                }
            }
        }

        String saveSourceDestLocationSQL = "INSERT INTO LHSSYS_PORTAL_APP_TRAN A (COL1, COL2, COL3, COL4, COL5, COL6, SEQ_ID, LASTUPDATE, USER_CODE, DYNAMIC_TABLE_SEQ_ID)"
                + "values ('" + seqNo + "','" + userCode + "','" + sourceLat + "','" + sourceLong
                + "','" + destLat + "','" + destLong + "','" + seq_id + "',sysdate" + ",'" + userCode + "','" + seqNo + "') ";
//        System.out.println("saveSourceDestLocationSQL : " + saveSourceDestLocationSQL);
        try {
            ps = c.prepareStatement(saveSourceDestLocationSQL);
            count = ps.executeUpdate();
            if (count > 0) {
                json.setResult(seq_id);
                json.setStatus("success");
            } else {
                json.setResult("LOCATION NOT SAVED");
                json.setStatus("error");
            }
        } catch (Exception e) {
            json.setResult("LOCATION NOT SAVED");
            json.setStatus("error");
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return json;
    }

    public ArrayList<UpdatedLocationJSON> getUpdatedLocation(String userCode, String seqNo, String seqId) {

        ArrayList<UpdatedLocationJSON> jsonList = new ArrayList<UpdatedLocationJSON>();
        PreparedStatement ps = null;
        ResultSet rs = null;

        System.out.println("userCode--> " + userCode);

        String userArr[] = userCode.split(",");
        userCode = "";
        for (int i = 0; i < userArr.length; i++) {

            if (i == 0) {
                userCode = "'" + userArr[i] + "'";
            } else {
                userCode = userCode + ",'" + userArr[i] + "'";
            }

        }

//        try {
//            String getMaxSeqID = "SELECT TO_CHAR(MAX(SEQ_ID)) SEQ_ID FROM LHSSYS_PORTAL_APP_TRAN L WHERE L.USER_CODE = '" + userCode + "' AND "
//                    + "L.DYNAMIC_TABLE_SEQ_ID = '" + seqNo + "'";
////            System.out.println("getMaxSeqID : " + getMaxSeqID);
//            ps = c.prepareStatement(getMaxSeqID);
//            rs = ps.executeQuery();
//            if (rs != null && rs.next()) {
//                seq_id = rs.getString(1);
//            }
//        } catch (Exception e) {
//        } finally {
//            if (ps != null) {
//                try {
//                    ps.close();
//                    rs.close();
//                } catch (SQLException e) {
//                }
//            }
//        }
//        String getUpdatedLocationSQL = "SELECT L.LATITUDE, L.LONGITUDE FROM LHSSYS_PORTAL_APP_TRAN L WHERE L.USER_CODE = '" + userCode + "' AND "
//                + "L.DYNAMIC_TABLE_SEQ_ID = '" + seqNo + "' AND  L.SEQ_ID = '" + seq_id + "'";
        String getUpdatedLocationSQL = "SELECT L.USER_CODE,\n"
                + "       (SELECT U.USER_NAME FROM USER_MAST U WHERE U.USER_CODE = L.USER_CODE) USER_NAME,\n"
                + "       L.LATITUDE,\n"
                + "       L.LONGITUDE\n"
                + "  FROM LHSSYS_PORTAL_APP_TRAN L\n"
                + " WHERE L.DYNAMIC_TABLE_SEQ_ID = '" + seqNo + "'\n"
                //                + "   AND L.USER_CODE IN ('SHASHANK', 'RP')\n"
                + "   AND L.USER_CODE IN (" + userCode + ")\n"
                + "   AND L.LASTUPDATE = (SELECT MAX(L1.LASTUPDATE) FROM LHSSYS_PORTAL_APP_TRAN L1\n"
                + "                       WHERE L.DYNAMIC_TABLE_SEQ_ID = L1.DYNAMIC_TABLE_SEQ_ID\n"
                + "                       And L.USER_CODE = L1.USER_CODE)";

        System.out.println("getUpdatedLocationSQL : " + getUpdatedLocationSQL);
        try {
            ps = c.prepareStatement(getUpdatedLocationSQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {

                do {
                    UpdatedLocationJSON json = new UpdatedLocationJSON();
                    json.setUser_code(rs.getString(1));
                    json.setUser_name(rs.getString(2));
                    json.setLat(rs.getString(3));
                    json.setLongi(rs.getString(4));
                    json.setMessage("updated location");
                    json.setStatus("success");

                    jsonList.add(json);
                } while (rs.next());
            }
//            else {
//                json.setMessage("Didn't got updated location");
//                json.setStatus("error");
//            }
        } catch (Exception e) {
//            json.setMessage("Didn't got updated location");
//            json.setStatus("error");
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                    rs.close();
                } catch (SQLException e) {
                }
            }
        }
        return jsonList;
    }

}
