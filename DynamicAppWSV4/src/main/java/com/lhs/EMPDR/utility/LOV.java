/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.utility;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author premkumar.agrawal
 */
public class LOV {

    String REF_LOV_TABLE_COL;

    public String getREF_LOV_TABLE_COL() {
        return REF_LOV_TABLE_COL;
    }

    public void setREF_LOV_TABLE_COL(String REF_LOV_TABLE_COL) {
        this.REF_LOV_TABLE_COL = REF_LOV_TABLE_COL;
    }

    public String createLOVsql(Connection c) throws SQLException {
        String subStringOfSql = "";
        StringBuffer sql = new StringBuffer();
        if(REF_LOV_TABLE_COL.contains("#") || REF_LOV_TABLE_COL.contains("~")){
            REF_LOV_TABLE_COL = REF_LOV_TABLE_COL.replaceAll("'", "''");
        }else{
            REF_LOV_TABLE_COL =REF_LOV_TABLE_COL;
        }
        sql.append("SELECT select_list_val, 'SELECT  ' || COLUMN_NAME   || ','|| DISPLAY_VALUE  || ' FROM ' ||  TABLE_NAME  ||\n"
                + "' WHERE 1=1 ' \n");
        sql.append("  FROM VIEW_PORTAL_UPLOAD_TBL_LOV_GEN\n");
        sql.append(" WHERE UPPER(TRIM( TABLE_NAME  || '.' ||  COLUMN_NAME )) = UPPER('" + REF_LOV_TABLE_COL + "')");
        U.log("SQL TO FETCH LOV VALUES :  " + sql);
        PreparedStatement ps;
        ResultSet rs;
        try {
            ps = c.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                subStringOfSql =rs.getString(1)+"~~"+ rs.getString(2);
//                subStringOfSql =rs.getString(2);
            }
        } catch (SQLException e) {
        }
        return subStringOfSql;
    }
    
    public String createLOVsqlForReport(Connection c) throws SQLException {
        String subStringOfSql = "";
        StringBuffer sql = new StringBuffer();
        sql.append("SELECT select_list_val, 'SELECT  ' || COLUMN_NAME   || ','|| DISPLAY_VALUE  || ' FROM ' ||  TABLE_NAME  ||\n"
                + "' WHERE 1=1 ' \n");
        sql.append("  FROM VIEW_PORTAL_UPLOAD_TBL_LOV_GEN\n");
        sql.append(" WHERE UPPER(TRIM( TABLE_NAME  || '.' ||  COLUMN_NAME )) = UPPER('" + REF_LOV_TABLE_COL + "')");
        U.log("SQL TO FETCH LOV VALUES :  " + sql);
        PreparedStatement ps;
        ResultSet rs;
        try {
            ps = c.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
//                subStringOfSql =rs.getString(1)+"~"+ rs.getString(2);
                subStringOfSql =rs.getString(2);
            }
        } catch (SQLException e) {
        }
        return subStringOfSql;
    }
}
