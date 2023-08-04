/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.TermsAndCondition;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author kirti.misal
 */
public class TermsAndConditionDAO {

    Connection connection;
    String pageLable;

    public TermsAndConditionDAO(Connection connection) {
        this.connection = connection;
        U u = new U(this.connection);
    }

    public TermsAndCondition getTermsValue(String seqId, String entityType, String searchText) {
        LinkedHashMap<String, String> headingValuePair = new LinkedHashMap<String, String>();
        String sqlTextForTerms = "";
        TermsAndCondition termObj = new TermsAndCondition();
        String sql = "select * from lhssys_portal_table_dsc_update where seq_no=" + seqId;
        U.log("seqid :" + seqId);
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                String sqltest = rs.getString("SQL_TEXT");
                U.log("sqltest :" + sqltest);
                pageLable = rs.getString("table_DESC");
                termObj.setPageLable(pageLable);
                if (sqltest != null) {
                    if (rs.getString("Where_clause") != null) {
                        sqltest = sqltest + " " + rs.getString("Where_clause");
                    }
                    if (rs.getString("Order_clause") != null) {
                        sqltest = sqltest + rs.getString("Order_clause");
                    }

                }
                sqlTextForTerms = sqltest;
            }

            U.log("SQLForTerms=" + sqlTextForTerms);
            String[] searchArr = (searchText != null ? searchText : "").split("#");
            if (sqlTextForTerms.contains("'COL0'") || sqlTextForTerms.contains("'COL1'")) {
                for (int i = 0; i < searchArr.length; i++) {
                    sqlTextForTerms = sqlTextForTerms.replace("'COL"+i+"'", "'"+searchArr[i]+"'");
                }
            }

            //Execute sql for getting terms data
            if (sqlTextForTerms != null) {
                sqlTextForTerms = sqlTextForTerms.replaceAll("'ENTITYCODE'", "'" + entityType + "'");

                //FOR ACCYEAR
                String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE \n"
                        + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )\n"
                        + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
                U.log("getAccYearSQL : " + getAccYearSQL);

                String AccYear = null;
                ps = connection.prepareStatement(getAccYearSQL);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    AccYear = rs.getString(1);
                }

                if (AccYear != null) {
                    sqlTextForTerms = sqlTextForTerms.replaceAll("'ACCYEAR'", "'" + AccYear + "'");
                }

                U.log("After Replace==" + sqlTextForTerms);
                ps = connection.prepareStatement(sqlTextForTerms);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    for (int i = 1; i <= 20; i++) {
                        if (rs.getString("IRFHEAD" + i) != null) {
                            headingValuePair.put(rs.getString("IRFHEAD" + i), rs.getString("REM" + i) != null ? rs.getString("REM" + i) : "");
                        }
                    }
                }

            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException ex) {
                    Logger.getLogger(TermsAndConditionDAO.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        termObj.setTermsList(headingValuePair);
        return termObj;
    }

}
