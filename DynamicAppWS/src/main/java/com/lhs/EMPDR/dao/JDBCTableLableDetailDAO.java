/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.GraphLabelData;
import com.lhs.EMPDR.Model.GraphLabelDetailModel;
import com.lhs.EMPDR.utility.PreDefinedValue;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCTableLableDetailDAO {

    Connection c;
    Util utl;

    public JDBCTableLableDetailDAO(Connection c) {
        this.c = c;
        this.utl = new Util();
    }

    public List<GraphLabelDetailModel> getGraphDetailData(String seqNo, String userCode) {
        GraphLabelDetailModel model = new GraphLabelDetailModel();
        PreparedStatement ps = null;
        ResultSet rs;
        String sql = "";
        int columnCount = 0;
        String graphDispalyFlag = "";
        PreDefinedValue val;
        PreparedStatement ps1;
        List<String> label = new ArrayList<String>();
        List<String> columnWidth = new ArrayList<String>();
        List<String> columnAlignment = new ArrayList<String>();
        ResultSet rs1;
        String sql1 = "select * from LHSSYS_ALERT_DIRECT_EMAIL d where  seq_id=" + seqNo;

        try {

            ps1 = c.prepareStatement(sql1);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                sql = rs1.getString("sql_text");
                columnCount = rs1.getInt("no_of_column");
                graphDispalyFlag = rs1.getString("flag");
                if (columnCount != 0) {
                    for (int i = 1; i <= columnCount; i++) {
                        label.add(rs1.getString("heading" + i));
                        columnWidth.add(rs1.getString("head_width" + i));
                        String align = rs1.getString("data_type" + i);
                        if (align == null || align.isEmpty() || align.equals("")) {
                            columnAlignment.add("center");
                        } else {
                            if (!align.equals("right")
                                    && !align.equals("left")) {
                                columnAlignment.add("center");
                            } else {
                                columnAlignment.add(align);
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }

        List<GraphLabelDetailModel> list = new ArrayList<GraphLabelDetailModel>();
        List<ArrayList> graphData = new ArrayList<ArrayList>();
        String datasql = sql;
        datasql = datasql.replaceAll("USERCODE", userCode);
        datasql = datasql.replaceAll("STR_ACC_CODE", userCode);
        datasql = datasql.replaceAll("SET_FILTER_VALUE", "");

        try {
            U.log("SQL TEXT AFTER REPLACING USERCODE : " + datasql);
            ps = c.prepareStatement(datasql);
            rs = ps.executeQuery();
            ResultSetMetaData rsmd = rs.getMetaData();
            int count = rsmd.getColumnCount();
            ArrayList<String> arrr = new ArrayList<String>();
            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                arrr.add(rsmd.getColumnName(i));
            }
            int p = 1;
            ArrayList<String> arr;
            if (rs != null && rs.next()) {
                do {
                    arr = new ArrayList<String>();
                    for (int i = 1; i <= count; i++) {

                        if (rs.getString(i) != null) {
                            arr.add(rs.getString(i));
                        } else {
                            arr.add("--");
                        }
                    }
                    graphData.add(arr);
                    p++;
                } while (rs.next());
            }
            model.setGraphLabelData(graphData);
            model.setSeries(label);
            model.setColumnWidth(columnWidth);
            model.setNoOfColumns(columnCount);
            model.setColumnAlignment(columnAlignment);
            model.setColumnName(arrr);
            model.setGraphDisplayFlag(graphDispalyFlag);
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        list.add(model);
        return list;
    }

    public List<GraphLabelDetailModel> getPagedGraphDetailData(String seqNo, String userCode, int pageNo, String valueFormat, String searchText, String filterDataJSON) {
//        U.log("filterDataJSON==>"+filterDataJSON);
        GraphLabelDetailModel model = new GraphLabelDetailModel();
        PreparedStatement ps = null;
        ResultSet rs;
        String sql = "";
        int columnCount = 0;
        int paginationCount = 0;
        String graphDispalyFlag = "";
        String searchPlaceHolder = "";
        String graphDataSQL = "";
        PreDefinedValue val;
        PreparedStatement ps1 = null;
        List<String> label = new ArrayList<String>();
        List<String> columnWidth = new ArrayList<String>();
        List<String> columnAlignment = new ArrayList<String>();
        ResultSet rs1;
        String sql1 = "select * from LHSSYS_ALERT_DIRECT_EMAIL d where  seq_id=" + seqNo;
        System.out.println("GET SQL_TEXT FROM LHSSYS_ALERT_DIRECT_EMAIL : " + sql1);
        JSONParser json_parser = new JSONParser();
        JSONObject listjson = null;
        Iterator a = null;
        System.out.println("FILTER JSON : " + filterDataJSON);
        if (!filterDataJSON.equalsIgnoreCase("N") && filterDataJSON.length() > 3) {
            try {
                System.out.println("!11111");
                listjson = (JSONObject) json_parser.parse(filterDataJSON);
            } catch (org.json.simple.parser.ParseException ex) {
                Logger.getLogger(JDBCTableLableDetailDAO.class.getName()).log(Level.SEVERE, null, ex);
            }
            Set keys = listjson.keySet();
            a = keys.iterator();
        }
        try {

            ps1 = c.prepareStatement(sql1);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                sql = rs1.getString("sql_text");
                columnCount = rs1.getInt("no_of_column");
                searchPlaceHolder = rs1.getString("EMAIL_HEADER");
                paginationCount = rs1.getInt("TOTAL_COLUMN");
                graphDispalyFlag = rs1.getString("flag");
                graphDataSQL = rs1.getString("EMAIL_SQL_TEXT");
                String graphTypeStr = rs1.getString("batch_file");
                if (graphTypeStr != null && !graphTypeStr.isEmpty()) {
                    model.setGraphType(graphTypeStr.split("#"));
                }

                if (columnCount != 0) {
                    for (int i = 1; i <= columnCount; i++) {
                        label.add(rs1.getString("heading" + i));
                        columnWidth.add(rs1.getString("head_width" + i));
                        String align = rs1.getString("data_type" + i);
                        if (align == null || align.isEmpty() || align.equals("")) {
                            columnAlignment.add("center");
                        } else {
                            if (!align.equals("right")
                                    && !align.equals("left")) {
                                columnAlignment.add("center");
                            } else {
                                columnAlignment.add(align);
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (SQLException e) {
                }
            }
        }

        List<GraphLabelDetailModel> list = new ArrayList<GraphLabelDetailModel>();
        List<ArrayList> graphData = new ArrayList<ArrayList>();
//        U.log("FETCH REPORT DATA SQL TEXT :   " + sql);
        int fromRowNum = (pageNo * paginationCount) + 1;
        int toRowNum = (pageNo + 1) * paginationCount;
        String valueFormatSQL = "LHS_UTILITY.SET_VALUE_FORMAT_APP_MIS('VALUE_FORMAT')".replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");
        System.out.println("valueFormatSQL : " + valueFormatSQL);
        try {
            System.out.println("VALUE FORMAT : " + valueFormat);
            if (valueFormat != null && !valueFormat.isEmpty()) {
                ps = c.prepareCall("{call " + valueFormatSQL + "}");
                ps.execute();
            }
        } catch (SQLException e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }

        String datasql = sql;
        datasql = datasql.replaceAll("'USERCODE'", "'" + userCode + "'");
        datasql = datasql.replaceAll("STR_ACC_CODE", userCode);
        datasql = datasql.replaceAll("SET_FILTER_VALUE", "");
        datasql = datasql.replaceAll("ROWFROM", Integer.toString(fromRowNum));
        datasql = datasql.replaceAll("ROWTO", Integer.toString(toRowNum));
        datasql = datasql.replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");
        System.out.println("FIL : " + filterDataJSON);
        if (filterDataJSON != "N" && filterDataJSON.length() > 3) {
            while (a.hasNext()) {
                String key = (String) a.next();
                String value = "";
                if (listjson.get(key) != null) {
                    value = (String) listjson.get(key);
                }
                U.log(key + "=iterator=" + value);
                if (key.equalsIgnoreCase("ENTITY_CODE") && value.equalsIgnoreCase("All")) {
                    value = "";
                }
//                    whenString.append("when para_column='" + key + "' then '" + value + "' ");
                if (datasql.contains("'" + key + "'")) {
                    datasql = datasql.replace("'" + key + "'", "'" + value + "'");
                }
            }
        }

        if (searchText != null && !searchText.isEmpty()) {
            datasql = datasql.replaceAll("SEARCHTEXT", searchText);
        } else {
            datasql = datasql.replaceAll("SEARCHTEXT", "");
        }
        try {
            U.log("FETCH REPORT DATA SQL TEXT AFTER REPLACING USERCODE : " + datasql);
            ps = c.prepareStatement(datasql);
            rs = ps.executeQuery();
            ResultSetMetaData rsmd = rs.getMetaData();
//            System.out.println("\n\n"+datasql + "=columns: " + rsmd.getColumnCount());

            int count = rsmd.getColumnCount();

            ArrayList<String> arrr = new ArrayList<String>();
            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                arrr.add(rsmd.getColumnName(i));
            }

            //  U.log(count);
            int p = 1;
            ArrayList<String> arr;
            if (rs != null && rs.next()) {
                do {
                    arr = new ArrayList<String>();
                    for (int i = 1; i <= count; i++) {

                        if (rs.getString(i) != null) {
                            arr.add(rs.getString(i));
                            //   U.log(md.getColumnName(i));
//                                    if(p==1)
//                                    label.add(md.getColumnName(i));
                        } else {
                            arr.add("--");
                        }
                    }
                    graphData.add(arr);
                    p++;
                } while (rs.next());
            }

            if (graphData.size() < toRowNum) {
                model.setPaginationFlag("F");
            } else {
                model.setPaginationFlag("T");
            }
            model.setGraphLabelData(graphData);
            model.setSeries(label);
            model.setColumnWidth(columnWidth);
            model.setNoOfColumns(columnCount);
            model.setColumnAlignment(columnAlignment);
            model.setSearchPlaceHolder(searchPlaceHolder);
            model.setColumnName(arrr);
            model.setGraphDisplayFlag(graphDispalyFlag);
            model.setTotal_rows(paginationCount);

            if (graphDataSQL != null && !graphDataSQL.isEmpty()) {
                graphDataSQL = graphDataSQL.replaceAll("'USERCODE'", "'" + userCode + "'");
                graphDataSQL = graphDataSQL.replaceAll("STR_ACC_CODE", userCode);
                graphDataSQL = graphDataSQL.replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");
                graphDataSQL = repalceFilterParam(graphDataSQL, seqNo, userCode);
                System.out.println("graphDataSQL--> " + graphDataSQL);
                ps = c.prepareStatement(graphDataSQL);
                rs = ps.executeQuery();
                rsmd = rs.getMetaData();
                ArrayList<String> lable = new ArrayList<String>();
                ArrayList<String> series = new ArrayList<String>();
                ArrayList<  ArrayList<String>> dataList = new ArrayList<  ArrayList<String>>();
                for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                    lable.add(rsmd.getColumnName(i));
                }
                if (rs != null && rs.next()) {
                    do {
                        arr = new ArrayList<String>();
                        for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                            if (i == 1) {
                                series.add(rs.getString(i));
                            } else {
                                if (rs.getString(i) != null) {
                                    arr.add(rs.getString(i));
                                } else {
                                    arr.add("0");
                                }
                            }
                        }
                        dataList.add(arr);
                    } while (rs.next());
                }

                HashMap<String, Object> graphDetails = new HashMap<String, Object>();
                graphDetails.put("lable", lable);
                graphDetails.put("series", series);
                graphDetails.put("data", dataList);
                model.setGraphData(graphDetails);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        list.add(model);
        return list;
    }

    public GraphLabelDetailModel getGraphDrillDownData(String seqNo, String userCode, String valueFormat, String valueParameters, String level) {
        GraphLabelDetailModel model = new GraphLabelDetailModel();
        PreparedStatement ps = null;
        ResultSet rs;
        String sql = "";
        String graphDataSQL = "";
        PreparedStatement ps1 = null;

        ResultSet rs1;
        String sql1 = "select * from LHSSYS_ALERT_DIRECT_EMAIL d where  seq_id=" + seqNo;

        try {
            ps1 = c.prepareStatement(sql1);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                if (level.equalsIgnoreCase("1")) {
                    sql = rs1.getString("TO_EMAIL_SQL_ID");
                } else {
                    sql = rs1.getString("EMAIL_FOOTER");
                }
            }
        } catch (Exception e) {
            U.log(e);
        }

        U.log("FETCH REPORT DATA SQL TEXT :   " + sql);

        String valueFormatSQL = "LHS_UTILITY.SET_VALUE_FORMAT_APP_MIS('VALUE_FORMAT')".replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");
        System.out.println("valueFormatSQL : " + valueFormatSQL);
        try {
            if (valueFormat != null) {
                ps = c.prepareCall("{call " + valueFormatSQL + "}");
                ps.execute();
            }
        } catch (SQLException e) {
            U.log(e);
        } finally {
        }

        graphDataSQL = sql;
        if (graphDataSQL != null && !graphDataSQL.isEmpty()) {
            graphDataSQL = graphDataSQL.replaceAll("'USERCODE'", "'" + userCode + "'");
            graphDataSQL = graphDataSQL.replaceAll("STR_ACC_CODE", userCode);
            graphDataSQL = graphDataSQL.replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");

            if (valueParameters != null && !valueParameters.isEmpty()) {
                String parm[] = valueParameters.split("#");
                for (int i = 0; i < parm.length; i++) {
                    graphDataSQL = graphDataSQL.replaceAll("'LEVEL" + (i + 1) + "'", "'" + parm[i] + "'");
                }
            }
            System.out.println("graphDataSQL : " + graphDataSQL);
            try {
                ps = c.prepareStatement(graphDataSQL);
                rs = ps.executeQuery();

                ArrayList<String> lable = new ArrayList<String>();
                ArrayList<String> series = new ArrayList<String>();
                ArrayList<  ArrayList<String>> dataList = new ArrayList<  ArrayList<String>>();
                ResultSetMetaData rsmd = rs.getMetaData();
                for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                    lable.add(rsmd.getColumnName(i));
                }
                if (rs != null && rs.next()) {
                    do {
                        ArrayList<String> arr = new ArrayList<String>();
                        for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                            if (i == 1) {
                                series.add(rs.getString(i));
                            } else {
                                if (rs.getString(i) != null) {
                                    arr.add(rs.getString(i));
                                } else {
                                    arr.add("0");
                                }
                            }
                        }
                        dataList.add(arr);

                    } while (rs.next());
                }

                HashMap<String, Object> graphDetails = new HashMap<String, Object>();
                graphDetails.put("lable", lable);
                graphDetails.put("series", series);
                graphDetails.put("data", dataList);
                model.setGraphData(graphDetails);

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
        return model;
    }

    public List<GraphLabelDetailModel> getSearchedGraphData(String seqNo, String userCode, int pageNo, String searchText) {
        GraphLabelDetailModel model = new GraphLabelDetailModel();
        PreparedStatement ps = null;
        ResultSet rs;
        String sql = "";
        int columnCount = 0;
        int paginationCount = 0;
        String graphDispalyFlag = "";
        PreDefinedValue val;
        PreparedStatement ps1 = null;
        List<String> label = new ArrayList<String>();
        ResultSet rs1;
        String sql1 = "select * from LHSSYS_ALERT_DIRECT_EMAIL d where  seq_id=" + seqNo;

        try {

            ps1 = c.prepareStatement(sql1);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
//                sql = rs1.getString("sql_text");
                sql = rs1.getString("body_text");
                columnCount = rs1.getInt("no_of_column");
                paginationCount = rs1.getInt("TOTAL_COLUMN");
                graphDispalyFlag = rs1.getString("flag");
                if (columnCount != 0) {
                    for (int i = 1; i <= columnCount; i++) {
                        label.add(rs1.getString("heading" + i));
                    }
                }
            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (SQLException e) {
                }
            }
        }

        List<GraphLabelDetailModel> list = new ArrayList<GraphLabelDetailModel>();
        List<ArrayList> graphData = new ArrayList<ArrayList>();
//        U.log("FETCH SEARCHED REPORT DATA SQL TEXT :   " + sql);
        int fromRowNum = (pageNo * paginationCount) + 1;
        int toRowNum = (pageNo + 1) * paginationCount;
//
//        U.log("FETCH REPORT DATA FOR PAGE NO  :   " + pageNo + " FROM ROW NUM : "
//                + Integer.toString(fromRowNum) + " TO ROW NUM : " + Integer.toString(toRowNum));

        String datasql = sql;
        datasql = datasql.replaceAll("SEARCHTEXT", searchText);
        datasql = datasql.replaceAll("USERCODE", userCode);
        datasql = datasql.replaceAll("STR_ACC_CODE", userCode);
        datasql = datasql.replaceAll("SET_FILTER_VALUE", "");
        datasql = datasql.replaceAll("ROWFROM", Integer.toString(fromRowNum));
        datasql = datasql.replaceAll("ROWTO", Integer.toString(toRowNum));

        try {
            U.log("FETCH SEARCHED REPORT DATA SQL TEXT AFTER REPLACING SEARCHTEXT & USERCODE : " + datasql);
            ps = c.prepareStatement(datasql);
            rs = ps.executeQuery();
            ResultSetMetaData rsmd = rs.getMetaData();
//            System.out.println("\n\n"+datasql + "=columns: " + rsmd.getColumnCount());

            int count = rsmd.getColumnCount();

            ArrayList<String> arrr = new ArrayList<String>();
            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                arrr.add(rsmd.getColumnName(i));
                System.out.println("Columns Name : " + rsmd.getColumnName(i));
            }

            //  U.log(count);
            int p = 1;
            ArrayList<String> arr;
            if (rs != null && rs.next()) {
                do {
                    arr = new ArrayList<String>();
                    for (int i = 1; i <= count; i++) {

                        if (rs.getString(i) != null) {
                            arr.add(rs.getString(i));
                            //   U.log(md.getColumnName(i));
//                                    if(p==1)
//                                    label.add(md.getColumnName(i));
                        } else {
                            arr.add("00");
                        }
                    }
                    graphData.add(arr);
                    p++;
                } while (rs.next());
            }
            model.setGraphLabelData(graphData);
            model.setSeries(label);
            model.setNoOfColumns(columnCount);
            model.setColumnName(arrr);
            model.setGraphDisplayFlag(graphDispalyFlag);
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        list.add(model);
        return list;
    }

    private String repalceFilterParam(String graphDataSQL, String seqNo, String user_code) {

        String replaced_graphDataSQL = graphDataSQL;
        String sql1 = " select * from LHSSYS_ALERT_DIRECT_EMAIL_PARA P where p.seq_ID = " + seqNo + "  and P.ITEM_HELP_PROPERTY != 'X'  AND P.STATUS = 'T' order by slno";
        String sql2 = " SELECT * FROM LHSSYS_ALERT_DIRECT_EMAIL_USER L WHERE L.SEQ_ID='" + seqNo + "'  AND L.USER_CODE = '" + user_code + "'";

        ArrayList<String> paraColaArr = new ArrayList<String>();
        try {

            PreparedStatement ps = c.prepareStatement(sql1);
            ResultSet rs = ps.executeQuery();
//            ResultSetMetaData rsmd = rs.getMetaData();
//            int count = rsmd.getColumnCount();

            if (rs != null && rs.next()) {
                do {
                    paraColaArr.add(rs.getString("para_column"));
                } while (rs.next());
            }

            if (paraColaArr.size() > 0) {
                ps = c.prepareStatement(sql2);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    int count = 1;
                    for (String param : paraColaArr) {
                        replaced_graphDataSQL.replaceAll("'" + param + "'", rs.getString("Para_Default_Value" + count));
                        count++;
                    }

                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("replaced_graphDataSQL--> " + replaced_graphDataSQL);
        return replaced_graphDataSQL;
    }

    //--- SCHEME WEB SERVICES FROM LHSCRM--- //
    public GraphLabelDetailModel getCardListDetailData(String seqNo, String userCode, int pageNo, String valueFormat,
            String entityCode, String accCode, String vrno) {
        GraphLabelDetailModel model = new GraphLabelDetailModel();
        PreparedStatement ps = null;
        ResultSet rs;
        String sql = "";
        String plsql = "";
        int columnCount = 0;
        int paginationCount = 0;
        String graphDispalyFlag = "";
        PreDefinedValue val;
        PreparedStatement ps1 = null;
        List<String> label = new ArrayList<String>();
        List<String> columnWidth = new ArrayList<String>();
        List<String> columnAlignment = new ArrayList<String>();
        ResultSet rs1;
        String acc_year = "";
        String sql1 = "select * from LHSSYS_ALERT_DIRECT_EMAIL d where  seq_id=" + seqNo;
        System.out.println("GET SQL_TEXT FROM LHSSYS_ALERT_DIRECT_EMAIL : " + sql1);

        try {

            ps1 = c.prepareStatement(sql1);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                sql = rs1.getString("sql_text");
                System.out.println("SQL_TEXT   :" + sql);
                plsql = rs1.getString("pl_sql_text");
                columnCount = rs1.getInt("no_of_column");
                paginationCount = rs1.getInt("TOTAL_COLUMN");
                graphDispalyFlag = rs1.getString("flag");
                if (columnCount != 0) {
                    for (int i = 1; i <= columnCount; i++) {
                        label.add(rs1.getString("heading" + i));
                        columnWidth.add(rs1.getString("head_width" + i));
                        String align = rs1.getString("data_type" + i);
                        if (align == null || align.isEmpty() || align.equals("")) {
                            columnAlignment.add("center");
                        } else if (!align.equals("right")
                                && !align.equals("left")) {
                            columnAlignment.add("center");
                        } else {
                            columnAlignment.add(align);
                        }
                    }
                }
            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (SQLException e) {
                }
            }
        }

        List<GraphLabelDetailModel> list = new ArrayList<GraphLabelDetailModel>();
        List<ArrayList> graphData = new ArrayList<ArrayList>();
        List<ArrayList> tableData = new ArrayList<ArrayList>();
        List<ArrayList> slabData = new ArrayList<ArrayList>();

        List<ArrayList> tableData1 = new ArrayList<ArrayList>();
        List<ArrayList> slabData1 = new ArrayList<ArrayList>();
        List<ArrayList> graphData1 = new ArrayList<ArrayList>();
        List<String> plsqldataList = new ArrayList<String>();

        U.log("FETCH REPORT DATA SQL TEXT :   " + sql);
        int fromRowNum = (pageNo * paginationCount) + 1;
        int toRowNum = (pageNo + 1) * paginationCount;
        String valueFormatSQL = "LHS_UTILITY.SET_VALUE_FORMAT_APP_MIS('VALUE_FORMAT')".replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");
        System.out.println("valueFormatSQL : " + valueFormatSQL);
        try {
            if (valueFormat != null) {
                ps = c.prepareCall("{call " + valueFormatSQL + "}");
                ps.execute();
            }
        } catch (SQLException e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }

        String accYearSQL = "SELECT A.ACC_YEAR, TO_CHAR(A.YRBEGDATE), TO_CHAR(A.YRENDDATE) FROM ACC_YEAR_MAST A "
                + " WHERE to_char(to_date(SUBSTR(sysdate, 1, 10),"
                + " 'dd-mm-yyyy')) between A.YRBEGDATE AND A.YRENDDATE AND ROWNUM =1 ORDER BY ACC_YEAR DESC";
        try {
            U.log("FETCH accYearSQL : " + accYearSQL);
            ps = c.prepareStatement(accYearSQL);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                do {
                    acc_year = rs.getString(1);
                } while (rs.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        String datasql = sql;
        datasql = datasql.replaceAll("'USERCODE'", "'" + userCode + "'");
        datasql = datasql.replaceAll("'ACCCODE'", "'" + accCode + "'");
        datasql = datasql.replaceAll("SET_FILTER_VALUE", "");
        datasql = datasql.replaceAll("ROWFROM", Integer.toString(fromRowNum));
        datasql = datasql.replaceAll("ROWTO", Integer.toString(toRowNum));
        datasql = datasql.replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");
        datasql = datasql.replaceAll("'VRNO'", "'" + vrno + "'");
        datasql = datasql.replaceAll("'ACCYEAR'", "'" + acc_year + "'");
        datasql = datasql.replaceAll("'ENTITYCODE'", "'" + entityCode + "'");

        try {
            U.log("FETCH REPORT DATA SQL TEXT AFTER REPLACING USERCODE : " + datasql);
            ps = c.prepareStatement(datasql);
            rs = ps.executeQuery();

            ResultSetMetaData rsmd = rs.getMetaData();

            int count = rsmd.getColumnCount();

            ArrayList<String> arrr = new ArrayList<String>();
            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                arrr.add(rsmd.getColumnName(i));
            }
            System.out.println("column name arr==>>" + arrr.toString());
            String dataplSql = plsql;

            int p = 1;
            ArrayList<String> arr;
            ArrayList<String> tablearr;
            ArrayList<String> slabarr;
            ArrayList<GraphLabelData> graphLabelDataList = new ArrayList<GraphLabelData>();

            if (rs != null && rs.next()) {
                do {
                    arr = new ArrayList<String>();
                    GraphLabelData graphLabelData = new GraphLabelData();
                    tableData1 = new ArrayList<ArrayList>();
                    slabData1 = new ArrayList<ArrayList>();
                    graphData1 = new ArrayList<ArrayList>();

                    for (int i = 1; i <= count; i++) {
                        tablearr = new ArrayList<String>();
                        slabarr = new ArrayList<String>();

                        try {
                            for (String arrrVal : arrr) {

                                if (rsmd.getColumnName(i).equalsIgnoreCase(arrrVal)) {
//  System.out.println("count="+i+"=>"+arrrVal);
                                    dataplSql = plsql;
                                    if (!dataplSql.equalsIgnoreCase(".") && dataplSql.contains(arrrVal)) {
                                        dataplSql = dataplSql.replaceAll(arrrVal, "" + rs.getString(i) + "");
                                        System.out.println("dataplSql==" + dataplSql);
                                        plsqldataList.add(dataplSql);
                                    }

                                }
                            }
                        } catch (Exception e) {
                            System.out.println("e==" + e.toString());
                        }
                        if (rsmd.getColumnName(i).contains("TABLEVALUE")) {
                            if (rs.getString(i) != null && rs.getString(i) != "") {
                                if (rs.getString(i).indexOf("#") > -1) {
                                    if (rs.getString(i).equalsIgnoreCase("##")) {

                                    } else {
                                        String[] splitData = rs.getString(i).split("#");
                                        for (int k = 0; k < splitData.length; k++) {
//                                            System.out.println("splitData[k]==" + splitData[k]);
                                            if (!"".equals(splitData[k])) {
                                                tablearr.add(splitData[k]);
                                            } else {
                                                tablearr.add("-");
                                            }
                                        }
                                        tableData.add(tablearr);
                                        tableData1.add(tablearr);
                                    }

                                }
                            }

                        } else if (rsmd.getColumnName(i).contains("SLABVALUE")) {
                            if (rs.getString(i) != null && rs.getString(i) != "") {
                                if (rs.getString(i).indexOf("#") > -1) {
                                    if (rs.getString(i).equalsIgnoreCase("##")) {

                                    } else {
                                        String[] splitData = rs.getString(i).split("#");
                                        for (int k = 0; k < splitData.length; k++) {
//                                            System.out.println("splitData[k]==" + splitData[k]);
                                            if (!"".equals(splitData[k])) {
                                                slabarr.add(splitData[k]);
                                            } else {
                                                slabarr.add("-");
                                            }
                                        }
                                        slabData.add(slabarr);
                                        slabData1.add(slabarr);

                                    }

                                }
                            }
                        } else if (rs.getString(i) != null) {
                            if (rsmd.getColumnTypeName(i).equalsIgnoreCase("DATE")) {
                                String dateValue = rs.getString(i);
                                if (dateValue != null && dateValue != "") {
                                    String start_dt = dateValue;
                                    System.out.println("start_dt=" + start_dt);
                                    DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
                                    Date date = new Date();
                                    try {
                                        date = (Date) formatter.parse(start_dt);
                                    } catch (ParseException ex) {
//                                        date=new Date();
                                        Logger.getLogger(JDBCTableLableDetailDAO.class.getName()).log(Level.SEVERE, null, ex);
                                    }
                                    SimpleDateFormat newFormat = new SimpleDateFormat("dd-MM-yyyy");
                                    String finalString = newFormat.format(date);
                                    System.out.println("finalString==" + finalString);
                                    arr.add(finalString);
                                }

                            } else {
                                arr.add(rs.getString(i));
                            }

                        } else {
                            arr.add("--");
                        }
                    }
                    System.out.println("\n----------arr==>" + arr.toString());
                    graphData.add(arr);
                    graphData1.add(arr);

                    graphLabelData.setSlabDataValue(slabData1);
                    graphLabelData.setTableDataValue(tableData1);
                    graphLabelData.setGraphLabelData(graphData1);
                    graphLabelDataList.add(graphLabelData);
                    p++;
                } while (rs.next());
            }

            model.setGraphLabelData(graphData);
            model.setTableDataValue(tableData);
            model.setSlabDataValue(slabData);

            model.setGraphLabelDataList(graphLabelDataList);
            System.out.println("mYyable " + tableData.toString());

            ArrayList<ArrayList<byte[]>> images = new ArrayList<ArrayList<byte[]>>();
            System.out.println("graphData===" + graphData.toString());
            System.out.println("dataplSql===" + dataplSql.toString());
            for (String data : plsqldataList) {
                ArrayList<byte[]> imageArray = new ArrayList<byte[]>();
                dataplSql = data;
                try {
                    if (dataplSql != null && dataplSql != "" && !dataplSql.equalsIgnoreCase(".")) {
                        ps = c.prepareStatement(dataplSql);
                        System.out.println("IMGQUERY==" + dataplSql);
                        rs = ps.executeQuery();
                        if (rs != null && rs.next()) {
                            do {
                                byte[] longx = rs.getBytes("doc_image");
                                if (longx != null) {

                                    imageArray.add(longx);
                                } else {
                                    imageArray.add(null);
                                }
                            } while (rs.next());

                        }
                    }

                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
                images.add(imageArray);

//                data.add(imageArray);
            }

            model.setSeries(label);
            model.setColumnWidth(columnWidth);
            model.setNoOfColumns(columnCount);
            model.setColumnAlignment(columnAlignment);
            model.setColumnName(arrr);
            model.setGraphDisplayFlag(graphDispalyFlag);
            model.setImageArray(images);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }

        return model;
    }

    //--- SCHEME WEB SERVICES FROM LHSCRM--- //
}
