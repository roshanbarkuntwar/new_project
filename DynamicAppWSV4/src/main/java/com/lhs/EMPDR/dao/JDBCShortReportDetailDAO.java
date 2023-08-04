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
public class JDBCShortReportDetailDAO {

    Connection c;

    public JDBCShortReportDetailDAO(Connection c) {
        this.c = c;
        U u = new U(this.c);
    }

    public String getDetail(String seqNo, String slno) throws SQLException {
        PreparedStatement ps = null;
        ResultSet rs = null;
        String detailSql = null;
        String sql = "SELECT P.SQL_TEXT FROM LHSSYS_ALERT_DIRECT_EMAIL_PARA P \n"
                + "WHERE P.SEQ_ID = '" + seqNo + "' AND P.SLNO = '" + slno + "'";
        try {
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    detailSql = rs.getString(1);
                } while (rs.next());
            }
        } catch (SQLException e) {
        } finally {
            rs.close();
            ps.close();
        }
        String value = null;
        if (detailSql != null) {
            try {
                ps = c.prepareStatement(detailSql);
                rs = ps.executeQuery();
                if (rs != null & rs.next()) {
                    value = rs.getString(1);
                }
            } catch (SQLException e) {
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                    }
                }
            }
        }
        return value;
    }
}
