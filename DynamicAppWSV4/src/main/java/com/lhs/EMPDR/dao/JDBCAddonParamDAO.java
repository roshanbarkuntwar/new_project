/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.google.common.collect.Multimap;
import com.lhs.EMPDR.Model.AddonModel;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author kirti.misal
 */
public class JDBCAddonParamDAO {

    public JDBCAddonParamDAO(Connection connection) {
        this.connection = connection;
        U u = new U(this.connection);
    }
    Connection connection;
    String pageLable;

    public AddonModel getAddonValue(String seqId, String entityType, String searchText) {
        String sqlTextForTerms = "";
        AddonModel model = new AddonModel();
        ArrayList<ArrayList<String>> addonList = new ArrayList<ArrayList<String>>();

        String sql = "select * from lhssys_portal_table_dsc_update where seq_no=" + seqId;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                pageLable = rs.getString("table_DESC");
                model.setPageLable(pageLable);
                String sqltest = rs.getString("SQL_TEXT");
                if (sqltest != null) {
                    if (sqltest.contains("whereclausevalue".toUpperCase())) {
                        sqltest = sqltest.replace("whereclausevalue".toUpperCase(), rs.getString("Where_clause"));
                    } else if (rs.getString("Where_clause") != null) {
                        sqltest = sqltest + " " + rs.getString("Where_clause");
                    }
                    if (rs.getString("Order_clause") != null) {
                        sqltest = sqltest + rs.getString("Order_clause");
                    }

                }
                sqlTextForTerms = sqltest;
            }
            U.log("SQLForParam=" + sql);

            //Execute sql for getting terms data
            if (sqlTextForTerms != null) {
                sqlTextForTerms = sqlTextForTerms.replaceAll("'ENTITYCODE'", "'" + entityType + "'");

                //FOR ACCYEAR
                String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE \n"
                        + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )\n"
                        + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
//                U.log("getAccYearSQL : " + getAccYearSQL);

                String AccYear = null;
                ps = connection.prepareStatement(getAccYearSQL);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    AccYear = rs.getString(1);
                }

                if (AccYear != null) {
                    sqlTextForTerms = sqlTextForTerms.replaceAll("ACCYEAR", AccYear);
                }
                try {
                    if (searchText != null && !searchText.isEmpty()) {
                        System.out.println("searchText--> " + searchText);
                        String[] searchParam = searchText.split("#");
                        for (int i = 0; i < searchParam.length; i++) {
                            sqlTextForTerms = sqlTextForTerms.replaceAll("'COL" + i + "'", "'" + searchParam[i] + "'");
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

                U.log("After Replace==" + sqlTextForTerms);
                ps = connection.prepareStatement(sqlTextForTerms);
                rs = ps.executeQuery();
                ResultSetMetaData rsmd = ps.getMetaData();
                int columnCount = rsmd.getColumnCount();
                ArrayList<String> value = new ArrayList<String>();
                int j = 0;
                if (rs != null && rs.next()) {
                    {
                        U.log("<---------rs is present------------>");
                        for (int i = 1; i <= columnCount; i++) {

                            String columName = rsmd.getColumnName(i);
//                            U.log("columName_"+i+"=>"+columName);
                            if (columName.contains("AFCODE") || columName.contains("TOTALAMT")) {
                                if (columName.contains("TOTALAMT")) {
                                    //for form design purpose
                                    value = new ArrayList<String>();
                                    value.add(null);
                                    value.add("Total amt");
                                    value.add(null);
                                    value.add(null);
                                    value.add("");
                                    value.add("");
                                    value.add("");
                                    value.add("");
                                    addonList.add(value);
                                }

                                if (value.get(0) != null) {
                                    if (value.get(0).equalsIgnoreCase("Basic Mat Value")) {
                                        //for form design purpose
                                        String rem = value.get(0);
                                        value = new ArrayList<String>();
                                        value.add(null);
                                        value.add(rem);
                                        value.add(null);
                                        value.add(null);
                                        value.add("");
                                        value.add("");
                                        value.add("");
                                    }
                                    //For holding value of textBox

                                    if (value.get(2) != null || value.get(2) != "") {
                                        value.add(value.get(2));
                                    } else {
                                        value.add("");
                                    }
                                    value.add("");
                                    addonList.add(value);
                                }
                                value = new ArrayList<String>();
                                j++;
                            }
                            value.add(rs.getString(i));
                        }

                    }
                }
            }
        } catch (Exception e) {
            U.errorLog(e);
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException ex) {
                    Logger.getLogger(TermsAndConditionDAO.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        U.log("addonList length==>" + addonList.size());
        model.setAddonparam(addonList);
        return model;
    }
}
