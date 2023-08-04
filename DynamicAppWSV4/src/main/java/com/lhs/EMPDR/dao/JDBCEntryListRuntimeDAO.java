/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.EntryListRuntimeModel;
import com.lhs.EMPDR.utility.SqlUtil;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCEntryListRuntimeDAO {

    Connection connection;
    String USERCODE = "";
    String EMPCODE = "";
    String displayColm = "";
    String UPDATE_KEY;
    List<String> columnList = new ArrayList<String>();
    String table_name = "";

    public JDBCEntryListRuntimeDAO(Connection connection) {
        this.connection = connection;
        U u = new U(this.connection);
    }

    public List<List<EntryListRuntimeModel>> getEntryList(String userCode, String reportDate, String apptype, String vrno, String accCode) {
        USERCODE = userCode.toUpperCase();
        U.log("vrno :  " + vrno);
        U.log("ENTRY LIST OF SELECTED DATE :  " + reportDate);
        String tableSql = "SELECT 'SELECT DISTINCT ' || u.TABLE_NAME|| '.*' ||' FROM ' \n"
                + "|| u.TABLE_NAME || ' WHERE 1=1 ' || u.where_clause || ' order by '|| u.order_clause \n"
                + " ,u.*,d.column_type,d.column_desc,d.column_name,d.ref_lov_table_col,d.column_select_list_value,\n"
                + "d.item_help_property FROM LHSSYS_PORTAL_TABLE_DSC_UPDATE u,LHSSYS_PORTAL_DATA_DSC_UPDATE d\n"
                + " WHERE u.seq_no=" + apptype + " and d.seq_no=(CASE WHEN u.dependent_next_entry_seq IS NULL THEN u.seq_no\n"
                + "                                             ELSE u.dependent_next_entry_seq END)";
        U.log("ENTRY LIST SQL GENERATING SQL :  " + tableSql);
        PreparedStatement ps = null;
        ResultSet rs;
        String entrySql = null;
        List<EntryListRuntimeModel> modelList = new ArrayList<EntryListRuntimeModel>();
        try {
            ps = connection.prepareStatement(tableSql);
            rs = ps.executeQuery();
            int columnlength = 0;

            if (rs != null && rs.next()) {
                do {
                    UPDATE_KEY = rs.getString("update_key");
                    System.out.println("UPFATE KEY  : " + UPDATE_KEY);
                    EntryListRuntimeModel model = new EntryListRuntimeModel();
                    if (columnlength == 0) {
                        entrySql = rs.getString(1);
                        table_name = rs.getString("table_name");
                        displayColm = rs.getString("list_columns_update");
                        String tempDisplayColm = displayColm;
                        if (tempDisplayColm.contains("SUM(AMT) AMT") || tempDisplayColm.contains("SUM(ARATE) ARATE")) {
                            tempDisplayColm = tempDisplayColm.replaceAll(Pattern.quote("SUM(AMT) AMT"), "AMT").replaceAll(Pattern.quote("SUM(ARATE) ARATE"), "ARATE");
                        }
                        for (int i = 0; i < tempDisplayColm.split("#").length; i++) {
                            columnList.add(tempDisplayColm.split("#")[i]);
                        }
                        columnlength++;
                    }
                    for (int i = 0; i < columnList.size(); i++) {
//                         U.log(columnList.get(i)+"=="+rs.getString("column_name"));
                        if (columnList.get(i).equalsIgnoreCase(rs.getString("column_name"))) {
                            model.setColumn_desc(rs.getString("column_desc"));
                            model.setColumn_name(rs.getString("column_name"));
                            model.setColumn_type(rs.getString("column_type"));
                            model.setRef_lov_table_col(rs.getString("ref_lov_table_col"));
                            model.setColumn_select_list_value(rs.getString("column_select_list_value"));
                            model.setItem_help_property(rs.getString("Item_help_property"));
                            model.setUpdate_key(UPDATE_KEY);

                            if (columnList.get(i).contains(rs.getString("column_name")) && !rs.getString("column_name").equals("SEQ_ID")
                                    && !rs.getString("column_name").equals("COL1")) {
                                model.setDisplayFlag("TRUE");
                            } else {
                                model.setDisplayFlag("false");
                            }
                            modelList.add(model);
                        }
                    }
                } while (rs.next());
            }
        } catch (SQLException e) {
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    U.errorLog(e);
                }
            }
        }

        List<EntryListRuntimeModel> entryListInOrder = new ArrayList<EntryListRuntimeModel>();

        for (int i = 0; i < columnList.size(); i++) {
            for (EntryListRuntimeModel model : modelList) {
                if (columnList.get(i).contains(model.getColumn_name())) {
                    entryListInOrder.add(model);
                }
            }
        }

        List<List<EntryListRuntimeModel>> entryList = new ArrayList<List<EntryListRuntimeModel>>();
        if (entrySql != null) {
            U.log("ENTRY LIST SQL :   " + entrySql);
            try {
                String getEmpCodeSQL = "SELECT EMP_CODE FROM USER_MAST WHERE USER_CODE = '" + USERCODE + "'";
                ps = connection.prepareStatement(getEmpCodeSQL);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    EMPCODE = rs.getString("EMP_CODE");
                }
            } catch (Exception e) {
                U.errorLog(e);
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                        U.errorLog(e);
                    }
                }
            }
            entrySql = entrySql.replaceAll("USERCODE", "'" + USERCODE + "'").replaceAll("EMPCODE", "'" + EMPCODE + "'").replaceAll("reportdate", "'"
                    + reportDate + "%'").replaceAll("ACCCODE", accCode);
            if (vrno != null) {
                entrySql = entrySql.replaceAll("VRNO", "'" + vrno + "'");
            }
            U.log("DATEWISE ENTRY LIST SQL :   " + entrySql);
            entrySql = entrySql.replaceAll(table_name + "\\.\\*", displayColm.replaceAll("#", ","));
            U.log("DATEWISE ENTRY LIST SQL WITH COLUMN NAME :   " + entrySql);
            try {
                ps = connection.prepareStatement(entrySql);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        List<EntryListRuntimeModel> entryDetailList = new ArrayList<EntryListRuntimeModel>();
                        for (EntryListRuntimeModel model : entryListInOrder) {
                            EntryListRuntimeModel model1 = new EntryListRuntimeModel();
                            model1.setColumn_desc(model.getColumn_desc());
                            model1.setColumn_name(model.getColumn_name());
                            model1.setColumn_type(model.getColumn_type());
                            model1.setUpdate_key(model.getUpdate_key());
                            model1.setDisplayFlag(model.getDisplayFlag());
                            model1.setItem_help_property(model.getItem_help_property());
                            model1.setColumn_select_list_value(model.getColumn_select_list_value());
//                            U.log("model.getColumn_type()" + model.getColumn_type());
                            if (!model.getColumn_type().contains("IMG")) {

                                model1.setValue(rs.getString(model.getColumn_name()));

                            } else {
//                                U.log("column name : " + model.getColumn_name());
                                model1.setValue(rs.getString(model.getColumn_name()));
                                InputStream imgStream = null;
                                model1.setImg(Util.getImgstreamToBytes(imgStream));
                            }
                            entryDetailList.add(model1);
                        }
                        entryList.add(entryDetailList);
                    } while (rs.next());
                } else {
                    U.log("REQUESTED ENTRY LIST IS EMPTY...");
                }
            } catch (Exception e) {
                U.errorLog(e);
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                        U.errorLog(e);
                    }
                }
            }
        }
        return entryList;
    }

    public List<List<EntryListRuntimeModel>> searchedEntryList(String userCode, String reportDate,
            String apptype, String vrno, String searchText, String fromDate, String toDate) {
        USERCODE = userCode.toUpperCase();

        U.log("ENTRY LIST OF SELECTED DATE :  " + reportDate);
        String tableSql = "SELECT 'SELECT  ' || u.TABLE_NAME|| '.*' ||' FROM ' || u.TABLE_NAME || ' WHERE 1=1 ' ||\n"
                + " u.where_clause || ' order by '|| u.order_clause \n"
                + " ,u.*,d.column_type,d.column_desc,d.column_name,d.ref_lov_table_col,d.column_select_list_value,\n"
                + "d.item_help_property FROM LHSSYS_PORTAL_TABLE_DSC_UPDATE u,LHSSYS_PORTAL_DATA_DSC_UPDATE d\n"
                + " WHERE u.seq_no=" + apptype + " and d.seq_no=(CASE WHEN u.dependent_next_entry_seq IS NULL THEN u.seq_no\n"
                + "                                             ELSE u.dependent_next_entry_seq END)";
        U.log("ENTRY LIST SQL GENERATING SQL :  " + tableSql);
        PreparedStatement ps = null;
        ResultSet rs;
        String entrySql = null;
        List<EntryListRuntimeModel> modelList = new ArrayList<EntryListRuntimeModel>();
        try {
            ps = connection.prepareStatement(tableSql);
            rs = ps.executeQuery();
            int columnlength = 0;

            if (rs != null && rs.next()) {
                do {
                    UPDATE_KEY = rs.getString("update_key");
                    EntryListRuntimeModel model = new EntryListRuntimeModel();
                    if (columnlength == 0) {
                        entrySql = rs.getString(1);
                        table_name = rs.getString("table_name");
                        displayColm = rs.getString("list_columns_update");
                        U.log("COLUMN TO SHOW IN ENTRY LIST : " + displayColm);
                        for (int i = 0; i < displayColm.split("#").length; i++) {
//                            U.log("columnList=" + displayColm.split("#")[i]);
                            columnList.add(displayColm.split("#")[i]);
                        }
                        columnlength++;
                    }
                    U.log("column_name : " + rs.getString("column_name"));
                    for (int i = 0; i < columnList.size(); i++) {
                        if (columnList.get(i).contains(rs.getString("column_name")) || rs.getString("column_type").contains("IMG")
                                || rs.getString("column_name").contains("VIDEO")) {//rs.getString("column_name").contains("SEQ_ID")
                            model.setColumn_desc(rs.getString("column_desc"));
                            model.setColumn_name(rs.getString("column_name"));
                            model.setColumn_type(rs.getString("column_type"));
                            model.setRef_lov_table_col(rs.getString("ref_lov_table_col"));
                            model.setColumn_select_list_value(rs.getString("column_select_list_value"));
                            model.setItem_help_property(rs.getString("Item_help_property"));
                            model.setUpdate_key(UPDATE_KEY);
                            if (columnList.get(i).contains(rs.getString("column_name")) && !rs.getString("column_name").equals("SEQ_ID")
                                    && !rs.getString("column_name").equals("COL1")) {
                                model.setDisplayFlag("TRUE");
                            } else {
                                model.setDisplayFlag("false");
                            }
                            modelList.add(model);
                        }
                    }

                } while (rs.next());
            }
        } catch (SQLException e) {
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    U.errorLog(e);
                }
            }
        }

        List<EntryListRuntimeModel> entryListInOrder = new ArrayList<EntryListRuntimeModel>();

        for (int i = 0; i < columnList.size(); i++) {
            for (EntryListRuntimeModel model : modelList) {
                if (columnList.get(i).contains(model.getColumn_name())) {
//                    U.log("order [" + i + "]==" + columnList.get(i));
                    entryListInOrder.add(model);
                }
            }
        }

        List<List<EntryListRuntimeModel>> entryList = new ArrayList<List<EntryListRuntimeModel>>();
        if (entrySql != null) {
            U.log("ENTRY LIST SQL :   " + entrySql);
            entrySql = entrySql.replaceAll("USERCODE", "'" + USERCODE + "'").replaceAll("reportdate", "'"
                    + reportDate + "%'").replaceAll("VRNO", "'" + vrno + "'");

            U.log("DATEWISE ENTRY LIST SQL BEFORE ADDING COLUMNS:   " + entrySql + "\n");
            entrySql = entrySql.replaceAll(table_name + "\\.\\*", displayColm.replaceAll("#", ","));
            U.log("DATEWISE ENTRY LIST SQL :   " + entrySql + "\n");

            U.log("SEARCH TEXT : " + searchText + " \n" + " FROM DATE : " + fromDate + " \n" + " TO DATE : " + toDate + " \n");

            if (searchText == null || searchText.isEmpty() || searchText.equals("")) {
                String searchEntryListWhereClause = " ((COL4 between '" + fromDate + "' AND '"
                        + toDate + "')OR COL4 like '" + fromDate.substring(0, 10) + "%' )";
                entrySql = entrySql.replaceAll("1=1", searchEntryListWhereClause);
            } else {
                String searchEntryListWhereClause = " (COL5 LIKE '%" + searchText + "%' OR COL5 LIKE UPPER('%" + searchText
                        + "%') OR COL5 LIKE INITCAP('%" + searchText + "%') OR COL3 LIKE UPPER('%" + searchText
                        + "%') OR COL3 LIKE INITCAP('%" + searchText + "%') OR COL3 LIKE '%" + searchText + "%')";
                entrySql = entrySql.replaceAll("1=1", searchEntryListWhereClause);
            }

            U.log("DATEWISE ENTRY LIST SQL WITH REPLACED searchEntryListWhereClause :   " + entrySql + "\n");

            try {
                ps = connection.prepareStatement(entrySql);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        U.log("size of modelList=" + modelList.size());
                        List<EntryListRuntimeModel> entryDetailList = new ArrayList<EntryListRuntimeModel>();
                        for (EntryListRuntimeModel model : entryListInOrder) {
                            EntryListRuntimeModel model1 = new EntryListRuntimeModel();
                            model1.setColumn_desc(model.getColumn_desc());
                            model1.setColumn_name(model.getColumn_name());
                            model1.setColumn_type(model.getColumn_type());
                            model1.setUpdate_key(model.getUpdate_key());
                            model1.setDisplayFlag(model.getDisplayFlag());
                            model1.setItem_help_property(model.getItem_help_property());
                            model1.setColumn_select_list_value(model.getColumn_select_list_value());
//                            U.log("model.getColumn_type()" + model.getColumn_type());
                            if (!model.getColumn_type().contains("IMG")) {
//                                U.log("column name=" + model.getColumn_name());
//                                U.log("\n column value==" + rs.getString(model.getColumn_name()));

                                if (model.getRef_lov_table_col() != null) {
                                    String refLocSql = " SELECT 'SELECT DISTINCT ' || DISPLAY_VALUE || ' FROM ' "
                                            + "|| TABLE_NAME || ' WHERE 1=1 ' || 'AND '|| column_name||' = '\n"
                                            + "        FROM VIEW_PORTAL_UPLOAD_TBL_LOV_GEN\n"
                                            + " WHERE UPPER(TRIM(TABLE_NAME || '.' || COLUMN_NAME)) = \n"
                                            + "       UPPER('" + model.getRef_lov_table_col() + "')";

                                    U.log("refLocSql==" + refLocSql);
                                    String codeSql = "";

                                    PreparedStatement ps1 = connection.prepareStatement(refLocSql);
                                    ResultSet rs1 = ps1.executeQuery();
                                    if (rs1 != null && rs1.next()) {
                                        String whereclause = rs.getString(model.getColumn_name());
                                        U.log(model.getColumn_name() + "=whereclause=" + rs.getString(model.getColumn_name()));
                                        if (whereclause.contains("#")) {
                                            whereclause = whereclause.split("#")[0];
                                        }
                                        codeSql = rs1.getString(1) + "'" + whereclause + "'";
                                    }
                                    U.log("codeSql=" + codeSql);
                                    U.log(findLovValue(codeSql));
                                    model1.setCodeOfvalue(rs.getString(model.getColumn_name()));
                                    model1.setValue(findLovValue(codeSql));
                                } else {
                                    model1.setValue(rs.getString(model.getColumn_name()));
                                    if (model1.getItem_help_property().contains("H") && model1.getColumn_select_list_value() != null) {
//                                        U.log(model1.getColumn_name() + "=null values==" + rs.getString(model1.getColumn_name()));
                                        String val = SqlUtil.getValue(connection,
                                                rs.getString(model1.getColumn_name()), model1.getColumn_select_list_value(), USERCODE);
//                                        U.log("value of H : " + val);
                                        model1.setValue(val);
                                    }
                                }
                            } else {
//                                U.log("column name : " + model.getColumn_name());
                                model1.setValue(rs.getString(model.getColumn_name()));
                                InputStream imgStream = null;
                                model1.setImg(Util.getImgstreamToBytes(imgStream));
                            }
                            entryDetailList.add(model1);
                        }
                        entryList.add(entryDetailList);
                    } while (rs.next());
                }
            } catch (SQLException e) {
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                        U.errorLog(e);
                    }
                }
            }
        }
        return entryList;
    }

    public String findLovValue(String sql) {
        String code = "";
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                code = rs.getString(1);
            }
        } catch (SQLException e) {
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    U.errorLog(e);
                }
            }
        }
        return code;
    }

}
