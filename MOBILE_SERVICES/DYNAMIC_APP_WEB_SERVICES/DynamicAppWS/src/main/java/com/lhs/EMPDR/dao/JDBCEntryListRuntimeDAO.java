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
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

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
    String UPDATION_PROCESS;
    List<String> columnList = new ArrayList<String>();
    String table_name = "";

    public JDBCEntryListRuntimeDAO(Connection connection) {
        this.connection = connection;
    }

    public List<List<EntryListRuntimeModel>> getEntryList(String userCode, String reportDate, String apptype, String vrno, String filterParam) {
        USERCODE = userCode.toUpperCase();

        U.log("ENTRY LIST OF SELECTED DATE :  " + reportDate);
        String tableSql = "SELECT 'SELECT DISTINCT ' || u.TABLE_NAME|| '.*' ||' FROM ' "
                + "|| u.TABLE_NAME || ' WHERE 1=1 ' || u.where_clause || ' order by '|| u.order_clause "
                + " ,u.*,d.column_type,d.column_desc,d.column_name,d.ref_lov_table_col,d.column_select_list_value, "
                + "d.item_help_property FROM LHSSYS_PORTAL_TABLE_DSC_UPDATE u,LHSSYS_PORTAL_DATA_DSC_UPDATE d "
                + " WHERE u.seq_no=" + apptype + " and d.seq_no=(CASE "
                + " WHEN INSTR('" + apptype + "','.' ) > 0 THEN TRUNC('" + apptype + "')"
                + " WHEN u.dependent_next_entry_seq IS NULL THEN u.seq_no "
                + "                                             ELSE u.dependent_next_entry_seq END)";
        U.log("ENTRY LIST SQL GENERATING SQL :  " + tableSql);
        PreparedStatement ps = null;
        ResultSet rs;
        String entrySql = null;
        List<EntryListRuntimeModel> modelList = new ArrayList<EntryListRuntimeModel>();

//        SimpleDateFormat sdf = new SimpleDateFormat("MM-dd-yyyy HH:mm:ss");
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-YYYY");
        int year = 2014, month = 10, day = 31;
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, year);
        cal.set(Calendar.MONTH, month - 1); // <-- months start at 0.
        cal.set(Calendar.DAY_OF_MONTH, day);

        try {
            ps = connection.prepareStatement(tableSql);
            rs = ps.executeQuery();
            int columnlength = 0;
            int colDispList = 0;

            if (rs != null && rs.next()) {
                do {
                    UPDATE_KEY = rs.getString("update_key");
                    EntryListRuntimeModel model = new EntryListRuntimeModel();
                    if (columnlength == 0) {
                        entrySql = rs.getString(1);
                        table_name = rs.getString("table_name");
                        displayColm = rs.getString("list_columns_update");
                        UPDATION_PROCESS = rs.getString("Updation_Process");
                        System.out.println("COLUMN TO SHOW IN ENTRY LIST : " + displayColm);
                        if (displayColm.contains("~")) {
                            String dspCol[] = displayColm.split("~");
                            System.out.println("DSP_LIST:" + dspCol[1]);
                            colDispList = Integer.parseInt(dspCol[1]);
                            displayColm = dspCol[0];
                        }
                        for (int i = 0; i < displayColm.split("#").length; i++) {
                            columnList.add(displayColm.split("#")[i]);
                        }
                        columnlength++;
                    }
                    if (colDispList != 0) {
                        for (int i = 0; i < colDispList; i++) {
                            if (columnList.get(i).equalsIgnoreCase(rs.getString("column_name"))) {
                                model.setColumn_desc(rs.getString("column_desc"));
                                model.setColumn_name(rs.getString("column_name"));
                                model.setColumn_type(rs.getString("column_type"));
                                model.setRef_lov_table_col(rs.getString("ref_lov_table_col"));
                                model.setColumn_select_list_value(rs.getString("column_select_list_value"));
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
                    } else {
                        for (int i = 0; i < columnList.size(); i++) {
                            if (columnList.get(i).equalsIgnoreCase(rs.getString("column_name"))) {
                                model.setColumn_desc(rs.getString("column_desc"));
                                model.setColumn_name(rs.getString("column_name"));
                                model.setColumn_type(rs.getString("column_type"));
                                model.setRef_lov_table_col(rs.getString("ref_lov_table_col"));
                                model.setColumn_select_list_value(rs.getString("column_select_list_value"));
                                model.setItem_help_property(rs.getString("Item_help_property"));
                                model.setUpdationProcess(UPDATION_PROCESS);
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
                    }
                } while (rs.next());
            }
        } catch (SQLException e) {
            System.out.println("exception ---> " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }

        List<EntryListRuntimeModel> entryListInOrder = new ArrayList<EntryListRuntimeModel>();

        for (int i = 0; i < columnList.size(); i++) {
            for (EntryListRuntimeModel model : modelList) {
                if (columnList.get(i).equalsIgnoreCase(model.getColumn_name())) {
                    entryListInOrder.add(model);
                }
            }
        }

        List<List<EntryListRuntimeModel>> entryList = new ArrayList<List<EntryListRuntimeModel>>();
        if (entrySql != null) {
            U.log("ENTRY LIST SQL : " + entrySql);
            try {
                String getEmpCodeSQL = "SELECT EMP_CODE FROM USER_MAST WHERE USER_CODE = '" + USERCODE + "'";
                ps = connection.prepareStatement(getEmpCodeSQL);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    EMPCODE = rs.getString("EMP_CODE");
                }
            } catch (Exception e) {
                System.out.println("exception ---> " + e.getMessage());
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                        System.out.println("exception ---> " + e.getMessage());
                    }
                }
            }
            entrySql = entrySql.replaceAll("'USERCODE'", "'" + USERCODE + "'").replaceAll("'EMPCODE'", "'" + EMPCODE + "'").replaceAll("reportdate", "'"
                    + reportDate + "%'");
            if (vrno != null && !vrno.isEmpty()) {
                entrySql = entrySql.replaceAll("'VRNO'", "'" + vrno + "'");
            }
            U.log("DATEWISE ENTRY LIST SQL :   " + entrySql);
            entrySql = entrySql.replaceAll(table_name + "\\.\\*", displayColm.replaceAll("#", ","));
            U.log("DATEWISE ENTRY LIST SQL WITH COLUMN NAME :   " + entrySql + "\n");

            try {
//                String filterWhereClause = "";
                if (filterParam != null && !filterParam.isEmpty() && filterParam.length() > 3) {
                    System.out.println("Filter Param -----------> " + filterParam);
                    JSONParser json_parser = new JSONParser();
                    JSONObject filterJson = (JSONObject) json_parser.parse(filterParam);
                    Set<Object> set = filterJson.keySet();
                    Iterator<Object> iterator = set.iterator();
                    while (iterator.hasNext()) {
                        Object key = iterator.next();
//                    String replaceStr = filterJson.get(key).toString();
                        if (filterJson.get(key) != null && !filterJson.get(key).toString().isEmpty()) {
//                            filterWhereClause = filterWhereClause + " And " + key + " = " + filterJson.get(key);
                            entrySql = entrySql.replaceAll("'" + key + "'", "'" + filterJson.get(key) + "'");
                            System.out.println("'" + key + "' ---> '" + filterJson.get(key) + "'");
                        } else {
                            entrySql = entrySql.replaceAll("'" + key + "'", "''");
                        }
                    }
                }
//                entrySql = entrySql.replaceAll("'FILTERWHERECLAUSE'", filterWhereClause);
                System.out.println("entrySql--------> " + entrySql);
//            
            } catch (Exception e) {
            }

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
                            model1.setUpdationProcess(UPDATION_PROCESS);
                            model1.setColumn_select_list_value(model.getColumn_select_list_value());
                            if (!model.getColumn_type().contains("IMG")) {
                                if (model.getRef_lov_table_col() != null) {
                                    String refLovSql = " SELECT 'SELECT DISTINCT ' || DISPLAY_VALUE || ' FROM ' "
                                            + "|| TABLE_NAME || ' WHERE 1=1 ' || 'AND '|| column_name||' = ' "
                                            + "        FROM VIEW_PORTAL_UPLOAD_TBL_LOV_GEN "
                                            + " WHERE UPPER(TRIM(TABLE_NAME || '.' || COLUMN_NAME)) =  "
                                            + "       UPPER('" + model.getRef_lov_table_col() + "')";
                                    String codeSql = "";
                                    try {
                                        PreparedStatement ps1 = connection.prepareStatement(refLovSql);
                                        ResultSet rs1 = ps1.executeQuery();
                                        if (rs1 != null && rs1.next()) {
                                            String whereclause = rs.getString(model.getColumn_name());//values.get(model.getColumn_name());
//                                            U.log(model.getColumn_name() + "=whereclause=" + rs.getString(model.getColumn_name()));
                                            if (whereclause.contains("#")) {
                                                whereclause = whereclause.split("#")[0];
                                            }
                                            codeSql = rs1.getString(1) + "'" + whereclause + "'";
                                        }
//                                        U.log("codeSql : " + codeSql);
//                                        U.log(findLovValue(codeSql));
                                        model1.setCodeOfvalue(rs.getString(model.getColumn_name()));
                                        model1.setValue(findLovValue(codeSql));
                                    } catch (Exception e) {
                                    }
                                } else {
                                    try {
                                        if (model.getColumn_type().equals("DATE")) {
                                            try {
                                                java.sql.Date dbSqlDate = rs.getDate(model.getColumn_name());
//                                                model1.setValue(sdf.format(dbSqlDate).split(" ")[0]);
                                                model1.setValue(sdf.format(dbSqlDate));
                                            } catch (Exception e) {
                                                model1.setValue(rs.getString(model.getColumn_name()));
                                            }
                                        } else if (model.getColumn_type().equals("DATETIME")) {
                                            try {
                                                java.sql.Date dbSqlDate = rs.getDate(model.getColumn_name());
                                                model1.setValue(sdf.format(dbSqlDate));
                                            } catch (Exception e) {
                                                model1.setValue(rs.getString(model.getColumn_name()));
                                            }
                                        }
                                        else if(model.getColumn_type().equalsIgnoreCase("NUMBER")){
                                            Double d = rs.getDouble(model.getColumn_name());
                                            model1.setValue(d.toString());
                                        }
                                        else {
                                            model1.setValue(rs.getString(model.getColumn_name()));
                                        }
                                    } catch (SQLException e1) {
                                    }
                                }
                            } else {
                                model1.setValue(rs.getString(model.getColumn_name()));
                                InputStream imgStream = null;
                                model1.setImg(Util.getImgstreamToBytes(imgStream));
                            }
                            entryDetailList.add(model1);
                        }
                        entryList.add(entryDetailList);
                    } while (rs.next());
                } else {
                    System.out.println("REQUESTED ENTRY LIST IS ENPTY...");
                }
            } catch (Exception e) {
                System.out.println("exception ---> " + e.getMessage());
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                        System.out.println("exception ---> " + e.getMessage());
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
        String tableSql = "SELECT 'SELECT  ' || u.TABLE_NAME|| '.*' ||' FROM ' || u.TABLE_NAME || ' WHERE 1=1 ' || "
                + " u.where_clause || ' order by '|| u.order_clause  "
                + " ,u.*,d.column_type,d.column_desc,d.column_name,d.ref_lov_table_col,d.column_select_list_value, "
                + "d.item_help_property FROM LHSSYS_PORTAL_TABLE_DSC_UPDATE u,LHSSYS_PORTAL_DATA_DSC_UPDATE d "
                + " WHERE u.seq_no=" + apptype + " and d.seq_no=(CASE WHEN u.dependent_next_entry_seq IS NULL THEN u.seq_no "
                + "   ELSE u.dependent_next_entry_seq END)";
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
                        System.out.println("COLUMN TO SHOW IN ENTRY LIST : " + displayColm);
                        for (int i = 0; i < displayColm.split("#").length; i++) {
                            columnList.add(displayColm.split("#")[i]);
                        }
                        columnlength++;
                    }
//                    U.log("column_name : " + rs.getString("column_name"));
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
                    System.out.println("exception ---> " + e.getMessage());
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
//            U.log("ENTRY LIST SQL :   " + entrySql);
            entrySql = entrySql.replaceAll("USERCODE", "'" + USERCODE + "'").replaceAll("reportdate", "'"
                    + reportDate + "%'");

            if (vrno != null && !vrno.isEmpty()) {
                entrySql = entrySql.replaceAll("VRNO", "'" + vrno + "'");
            }
//            U.log("DATEWISE ENTRY LIST SQL BEFORE ADDING COLUMNS:   " + entrySql + "\n");
            entrySql = entrySql.replaceAll(table_name + "\\.\\*", displayColm.replaceAll("#", ","));

//            U.log("DATEWISE ENTRY LIST SQL :   " + entrySql + "\n");
//            U.log("SEARCH TEXT : " + searchText + " \n" + " FROM DATE : " + fromDate + " \n" + " TO DATE : " + toDate + " \n");
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
                            if (!model.getColumn_type().contains("IMG")) {
                                if (model.getRef_lov_table_col() != null) {
                                    String refLocSql = " SELECT 'SELECT DISTINCT ' || DISPLAY_VALUE || ' FROM ' "
                                            + "|| TABLE_NAME || ' WHERE 1=1 ' || 'AND '|| column_name||' = ' "
                                            + "        FROM VIEW_PORTAL_UPLOAD_TBL_LOV_GEN "
                                            + " WHERE UPPER(TRIM(TABLE_NAME || '.' || COLUMN_NAME)) =  "
                                            + "       UPPER('" + model.getRef_lov_table_col() + "')";

                                    U.log("refLocSql==" + refLocSql);
                                    String codeSql = "";

                                    PreparedStatement ps1 = connection.prepareStatement(refLocSql);
                                    ResultSet rs1 = ps1.executeQuery();
                                    if (rs1 != null && rs1.next()) {
                                        String whereclause = rs.getString(model.getColumn_name());
                                        if (whereclause.contains("#")) {
                                            whereclause = whereclause.split("#")[0];
                                        }
                                        codeSql = rs1.getString(1) + "'" + whereclause + "'";
                                    }
                                    model1.setCodeOfvalue(rs.getString(model.getColumn_name()));
                                    model1.setValue(findLovValue(codeSql));
                                } else {
                                    model1.setValue(rs.getString(model.getColumn_name()));
                                    if (model1.getItem_help_property().contains("H") && model1.getColumn_select_list_value() != null) {
                                        String val = SqlUtil.getValue(connection,
                                                rs.getString(model1.getColumn_name()), model1.getColumn_select_list_value(), USERCODE);
                                        model1.setValue(val);
                                    }
                                }
                            } else {
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
                        System.out.println("exception ---> " + e.getMessage());
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
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }
        return code;
    }

}
