/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCNotificationCountDAO {

    Connection c;

    public JDBCNotificationCountDAO(Connection c) {
        this.c = c;
    }

    public int getNotificationCount(String userCode, String seqNo) {
        PreparedStatement ps = null;
        String sql = "SELECT COUNT(*) FROM (SELECT L.COL5, L.COL6, L.COl9,L.DYNAMIC_TABLE_SEQ_ID,"
                + "L.LASTUPDATE,L.USER_CODE"
                + " FROM LHSSYS_PORTAL_APP_TRAN L"
                + " union"
                + " SELECT N.NEWS,"
                + "  to_char(N.FROM_DATE),"
                + "  N.CREATEDBY,"
                + "  55 DYNAMIC_TABLE_SEQ_ID,"
                + " N.LASTUPDATE,"
                + " N.USER_CODE"
                + " FROM LHSSYS_PORTAL_NEWS N)"
                + " WHERE DYNAMIC_TABLE_SEQ_ID =" + seqNo
                + " AND USER_CODE = '" + userCode + "'"
                //    + " AND LASTUPDATE LIKE to_char(to_date(sysdate, 'dd-mm-yyyy HH24:MI:SS'))"
                + " ORDER BY LASTUPDATE DESC";
        int count = 0;
        try {
            ps = c.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                count = rs.getInt(1);
            }
        } catch (Exception e) {
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return count;
    }
}
