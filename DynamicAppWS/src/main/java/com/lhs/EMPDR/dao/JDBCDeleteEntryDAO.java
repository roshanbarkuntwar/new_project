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
import java.sql.Statement;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCDeleteEntryDAO {

    Connection c;

    public JDBCDeleteEntryDAO(Connection c) {
        this.c = c;
    }

    public String deleteEntry(String sq_id, String seq_no) throws SQLException {
        String tableName = "";
        String columnName = "";
        String columnType = "";
        String update_key = "";
        StringBuilder updateKeySql = new StringBuilder();
        updateKeySql.append("select t.update_key from lhssys_portal_table_dsc_update t where ");
        updateKeySql.append(" t.seq_no = " + seq_no);

        Statement st1 = c.createStatement();
        System.out.println("DELETE ENTRY GET UPDATE_KEY SQL : " + updateKeySql.toString());
        ResultSet rs1 = st1.executeQuery(updateKeySql.toString());
        if (rs1 != null && rs1.next()) {
            update_key = rs1.getString("update_key");
        }

        String sqlString = "select table_name,column_name,column_type\n"
                + "          from LHSSYS_PORTAL_DATA_DSC_UPDATE\n"
                + "         where seq_no = " + seq_no + " and column_desc = '" + update_key + "'";

        Statement st = c.createStatement();
        System.out.println("DELETE ENTRY GET TABLE_NAME SQL : " + sqlString);
        ResultSet rs = st.executeQuery(sqlString);
        if (rs != null && rs.next()) {
            tableName = rs.getString(1);
            columnName = rs.getString(2);
            columnType = rs.getString(3);
        }
        String sql = "";
        if (!columnType.equals("VARCHAR2")) {
            sql = "delete from " + tableName + " t where " + columnName + " = " + sq_id;
            U.log("delete sql :  " + sql);
        } else {
            sql = "delete from " + tableName + " t where " + columnName + " = '" + sq_id + "'";
            U.log("delete sql :  " + sql);
        }
        int n;
        PreparedStatement ps = null;
        try {
            ps = c.prepareStatement(sql);
            n = ps.executeUpdate();
        } catch (SQLException e) {
            U.log(e);
            return "Something went wrong, please try again...";
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
        return n + " records are deleted";
    }
}
