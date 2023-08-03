/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.CardWithGridModel;
import com.lhs.EMPDR.Model.GraphLabelData;
import com.lhs.EMPDR.Model.GraphLabelDetailModel;
import com.lhs.EMPDR.utility.PreDefinedValue;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.InputStream;
import java.sql.CallableStatement;
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
import java.util.Locale;
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

    public JDBCTableLableDetailDAO(Connection c) {
        this.c = c;
        U u = new U(this.c);
    }

    public List<GraphLabelDetailModel> getGraphDetailData(String seqNo, String userCode) {
        GraphLabelDetailModel model = new GraphLabelDetailModel();
        PreparedStatement ps = null;
        ResultSet rs;
        String sql = "";
        U.log("useercode==" + userCode);
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
                U.log("columnCount===" + columnCount);
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
            U.errorLog(e);
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
        U.log("SQL TEXT :::::::::::" + sql);
        U.log("SQL TEXT :::::::::::" + sql);
        String datasql = sql;
        datasql = datasql.replaceAll("USERCODE", userCode);
        datasql = datasql.replaceAll("STR_ACC_CODE", userCode);
        datasql = datasql.replaceAll("SET_FILTER_VALUE", "");

        try {
            U.log("SQL TEXT AFTER REPLACING USERCODE : " + datasql);
            ps = c.prepareStatement(datasql);
            rs = ps.executeQuery();
            ResultSetMetaData rsmd = rs.getMetaData();
            U.log(datasql + "=columns: " + rsmd.getColumnCount());

            int count = rsmd.getColumnCount();

            ArrayList<String> arrr = new ArrayList<String>();
            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                arrr.add(rsmd.getColumnName(i));
                U.log("Columns Name : " + rsmd.getColumnName(i));
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
            U.errorLog(e);
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

    public List<GraphLabelDetailModel> getPagedGraphDetailData(String seqNo, String userCode, int pageNo, String valueFormat, String searchText,
            String vrno, String accCode, String geoOrgCode, String filterDataJSON) {
        GraphLabelDetailModel model = new GraphLabelDetailModel();
        PreparedStatement ps = null;
        ResultSet rs;
        String sql = "";
        int columnCount = 0;
        int paginationCount = 0;
        String graphDataSQL = "";
        String graphDispalyFlag = "";
        PreDefinedValue val;
        PreparedStatement ps1 = null;
        List<String> label = new ArrayList<String>();
        List<String> columnWidth = new ArrayList<String>();
        List<String> columnAlignment = new ArrayList<String>();
        ResultSet rs1;
        JSONParser json_parser = new JSONParser();
        JSONObject listjson = null;
        Iterator a = null;
        String sql1 = "select * from LHSSYS_ALERT_DIRECT_EMAIL d where  seq_id=" + seqNo;
        U.log("GET SQL_TEXT FROM LHSSYS_ALERT_DIRECT_EMAIL : " + sql1);
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
                if (searchText != null && !searchText.isEmpty()) {
                    sql = rs1.getString("body_text");
                }

                columnCount = rs1.getInt("no_of_column");
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
            U.errorLog(e);
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
        U.log("FETCH REPORT DATA SQL TEXT :   " + sql);
        int fromRowNum = (pageNo * paginationCount) + 1;
        int toRowNum = (pageNo + 1) * paginationCount;
        String valueFormatSQL = "LHS_UTILITY.SET_VALUE_FORMAT_APP_MIS('VALUE_FORMAT')".replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");
        U.log("valueFormatSQL : " + valueFormatSQL);
        try {
            if (valueFormat != null) {
                ps = c.prepareCall("{call " + valueFormatSQL + "}");
                ps.execute();
            }
        } catch (SQLException e) {
            U.errorLog(e.getMessage());
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
        datasql = datasql.replaceAll("'ACCCODE'", "'" + accCode + "'");
        datasql = datasql.replaceAll("STR_ACC_CODE", userCode);
        datasql = datasql.replaceAll("SET_FILTER_VALUE", "");
        datasql = datasql.replaceAll("ROWFROM", Integer.toString(fromRowNum));
        datasql = datasql.replaceAll("ROWTO", Integer.toString(toRowNum));
        datasql = datasql.replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");
        datasql = datasql.replaceAll("'VRNO'", "'" + vrno + "'");
        datasql = datasql.replaceAll("'GEOORGCODE'", "'" + geoOrgCode + "'");
        if (searchText != null && !searchText.isEmpty()) {
            datasql = datasql.replaceAll("SEARCHTEXT", searchText);
        } else {
            datasql = datasql.replaceAll("SEARCHTEXT", "");
        }
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
        try {
            U.log("FETCH REPORT DATA SQL TEXT AFTER REPLACING USERCODE ::: " + datasql);
            ps = c.prepareStatement(datasql);
            rs = ps.executeQuery();
            ResultSetMetaData rsmd = rs.getMetaData();
//            U.log("\n\n"+datasql + "=columns: " + rsmd.getColumnCount());

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

//                        U.log(i + " ----> " + rs.getString(i));
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
            model.setGraphLabelData(graphData);
            model.setSeries(label);
            model.setColumnWidth(columnWidth);
            model.setNoOfColumns(columnCount);
            model.setColumnAlignment(columnAlignment);
            model.setColumnName(arrr);
            model.setGraphDisplayFlag(graphDispalyFlag);

            if (graphDataSQL != null && !graphDataSQL.isEmpty()) {
                datasql = datasql.replaceAll("'GEOORGCODE'", "'" + geoOrgCode + "'");
                graphDataSQL = graphDataSQL.replaceAll("'USERCODE'", "'" + userCode + "'");
                graphDataSQL = graphDataSQL.replaceAll("'ACCCODE'", "'" + accCode + "'");
                graphDataSQL = graphDataSQL.replaceAll("STR_ACC_CODE", userCode);
                graphDataSQL = graphDataSQL.replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");
                U.log("graphDataSQL==>>" + graphDataSQL);
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
                            } else if (rs.getString(i) != null) {
                                arr.add(rs.getString(i));
                            } else {
                                arr.add("0");
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
                }
            }
        }
        list.add(model);
        return list;
    }

    public List<GraphLabelDetailModel> getSearchedGraphData(String seqNo, String userCode, int pageNo, String searchText) {
        GraphLabelDetailModel model = new GraphLabelDetailModel();
        PreparedStatement ps = null;
        ResultSet rs;
        String sql = "";
        U.log("useercode==" + userCode);
        int columnCount = 0;
        int paginationCount = 0;
        String graphDispalyFlag = "";
        PreDefinedValue val;
        PreparedStatement ps1 = null;
        List<String> label = new ArrayList<String>();
        ResultSet rs1;
        String sql1 = "select * from LHSSYS_ALERT_DIRECT_EMAIL d where  seq_id=" + seqNo;
        U.log("sql1=========== " + sql1);
        try {

            ps1 = c.prepareStatement(sql1);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
//                sql = rs1.getString("sql_text");
                sql = rs1.getString("body_text");
                columnCount = rs1.getInt("no_of_column");
                paginationCount = rs1.getInt("TOTAL_COLUMN");
                graphDispalyFlag = rs1.getString("flag");
                U.log("columnCount===" + columnCount);
                if (columnCount != 0) {
                    for (int i = 1; i <= columnCount; i++) {
                        label.add(rs1.getString("heading" + i));
                    }
                }
            }
        } catch (Exception e) {
            U.errorLog(e);
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
        U.log("FETCH SEARCHED REPORT DATA SQL TEXT :   " + sql);
        int fromRowNum = (pageNo * paginationCount) + 1;
        int toRowNum = (pageNo + 1) * paginationCount;

        U.log("FETCH REPORT DATA FOR PAGE NO  :   " + pageNo + " FROM ROW NUM : "
                + Integer.toString(fromRowNum) + " TO ROW NUM : " + Integer.toString(toRowNum));

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
//            U.log("\n\n"+datasql + "=columns: " + rsmd.getColumnCount());

            int count = rsmd.getColumnCount();

            ArrayList<String> arrr = new ArrayList<String>();
            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                arrr.add(rsmd.getColumnName(i));
                U.log("Columns Name : " + rsmd.getColumnName(i));
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
            U.errorLog(e);
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

    public GraphLabelDetailModel getCardListDetailData(String seqNo, String userCode, int pageNo, String valueFormat,
            String entityCode, String accCode, String vrno, String consigneeCode, String divCode) {
        U.log("value format : " + valueFormat);
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
        String yrbegdate = "";
        String yrenddate = "";
        String sql1 = "select * from LHSSYS_ALERT_DIRECT_EMAIL d where  seq_id=" + seqNo;
        U.log("GET SQL_TEXT FROM LHSSYS_ALERT_DIRECT_EMAIL : " + sql1);

        try {

            ps1 = c.prepareStatement(sql1);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                sql = rs1.getString("sql_text");
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
            U.errorLog(e);
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

        int fromRowNum = (pageNo * paginationCount) + 1;
        int toRowNum = (pageNo + 1) * paginationCount;

        String valueFormatSQL = "LHS_UTILITY.SET_VALUE_FORMAT_APP_MIS('VALUE_FORMAT')".replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");
        U.log("valueFormatSQL : " + valueFormatSQL);
        try {
            if (valueFormat != null) {
                ps = c.prepareCall("{call " + valueFormatSQL + "}");
                ps.execute();
            }
        } catch (SQLException e) {
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }

        String accYearSQL = "SELECT A.ACC_YEAR, to_char(a.yrbegdate,'dd-MON-rrrr'), TO_CHAR(A.YRENDDATE,'dd-MON-rrrr') FROM ACC_YEAR_MAST A "
                + " WHERE to_char(to_date(SUBSTR(sysdate, 1, 10),"
                + " 'dd-mm-yyyy')) between A.YRBEGDATE AND A.YRENDDATE AND ROWNUM =1 ORDER BY ACC_YEAR DESC";
        try {
            U.log("FETCH accYearSQL : " + accYearSQL);
            ps = c.prepareStatement(accYearSQL);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                do {
                    acc_year = rs.getString(1);
                    yrbegdate = rs.getString(2);
                    yrenddate = rs.getString(3);
                } while (rs.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        String datasql = sql;
        datasql = datasql.replaceAll("'USERCODE'", "'" + userCode + "'");
        datasql = datasql.replaceAll("'ACCCODE'", "'" + accCode + "'");
        datasql = datasql.replaceAll("'CONSIGNEE_CODE'", "'" + consigneeCode + "'");
        datasql = datasql.replaceAll("'DIV_CODE'", "'" + divCode + "'");
        datasql = datasql.replaceAll("SET_FILTER_VALUE", "");
        datasql = datasql.replaceAll("ROWFROM", Integer.toString(fromRowNum));
        datasql = datasql.replaceAll("ROWTO", Integer.toString(toRowNum));
        datasql = datasql.replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");
        datasql = datasql.replaceAll("'VRNO'", "'" + vrno + "'");
        datasql = datasql.replaceAll("'ACCYEAR'", "'" + acc_year + "'");
        datasql = datasql.replaceAll("YRBEGDATE", yrbegdate).replaceAll("YRENDDATE", yrenddate);
        U.log("ENTITY_CODE==>>" + entityCode);
        if (entityCode == null || entityCode.equalsIgnoreCase("null")) {
            entityCode = "";
        }
        U.log("ENTITY_CODE==>>" + entityCode);
        datasql = datasql.replaceAll("'ENTITYCODE'", "'" + entityCode + "'");

//        U.log("FETCH REPORT DATA SQL TEXT :   " + datasql);
        String procedureStat = "";
        if (datasql.contains("~")) {
            procedureStat = datasql.split("~")[0];
            datasql = datasql.split("~")[1];
        }
        if (procedureStat.length() > 1) {
            try {
                CallableStatement cStmt = c.prepareCall(procedureStat);
                cStmt.execute();
                U.log("PROCEDURE EXECUTED SUCCESSFULLY");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        try {
            U.log("FETCH REPORT DATA SQL TEXT : " + datasql);
            ps = c.prepareStatement(datasql);
            rs = ps.executeQuery();

            ResultSetMetaData rsmd = rs.getMetaData();

            int count = rsmd.getColumnCount();

            ArrayList<String> arrr = new ArrayList<String>();
            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                arrr.add(rsmd.getColumnName(i));
            }
            U.log("column name arr==>>" + arrr.toString());
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
//  U.log("count="+i+"=>"+arrrVal);
                                    dataplSql = plsql;
                                    if (!dataplSql.equalsIgnoreCase(".") && dataplSql.contains(arrrVal)) {
                                        dataplSql = dataplSql.replaceAll(arrrVal, "" + rs.getString(i) + "");
                                        U.log("dataplSql==" + dataplSql);
                                        plsqldataList.add(dataplSql);
                                    }

                                }
                            }
                        } catch (Exception e) {
                            U.errorLog("e==" + e.toString());
                        }
                        if (rsmd.getColumnName(i).contains("TABLEVALUE")) {
                            if (rs.getString(i) != null && rs.getString(i) != "") {
                                if (rs.getString(i).indexOf("#") > -1) {
                                    if (rs.getString(i).equalsIgnoreCase("##")) {

                                    } else {
                                        String[] splitData = rs.getString(i).split("#");
                                        for (int k = 0; k < splitData.length; k++) {
//                                            U.log("splitData[k]==" + splitData[k]);
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
//                                            U.log("splitData[k]==" + splitData[k]);
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
                                    U.log("start_dt=" + start_dt);
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
                                    U.log("finalString==" + finalString);
                                    arr.add(finalString);
                                }

                            } else {
                                arr.add(rs.getString(i));
                            }

                        } else {
                            arr.add("--");
                        }
                    }
                    U.log("\n----------arr==>" + arr.toString());
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
            U.log("mYyable " + tableData.toString());

            ArrayList<ArrayList<byte[]>> images = new ArrayList<ArrayList<byte[]>>();
            U.log("graphData===" + graphData.toString());
            U.log("dataplSql===" + dataplSql.toString());
            for (String data : plsqldataList) {
                ArrayList<byte[]> imageArray = new ArrayList<byte[]>();
                dataplSql = data;
                try {
                    if (dataplSql != null && dataplSql != "" && !dataplSql.equalsIgnoreCase(".")) {
                        ps = c.prepareStatement(dataplSql);
                        U.log("IMGQUERY==" + dataplSql);
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

    public List<CardWithGridModel> getcardWithGridDetails(String seqNo, String userCode, int pageNo, String valueFormat,
            String entityCode, String accCode, String vrno, String empCode, String targetEntity, String divCode) {
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
        List<String> columnWidth = new ArrayList<String>();
        List<String> columnAlignment = new ArrayList<String>();

        List<CardWithGridModel> targetData = new ArrayList<CardWithGridModel>();

        ResultSet rs1;
        String acc_year = "";
        String sql1 = "select * from LHSSYS_ALERT_DIRECT_EMAIL d where  seq_id=" + seqNo;
        U.log("GET SQL_TEXT FROM LHSSYS_ALERT_DIRECT_EMAIL : " + sql1);

        try {

            ps1 = c.prepareStatement(sql1);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                sql = rs1.getString("sql_text");
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
            U.errorLog(e);
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
        U.log("FETCH REPORT DATA SQL TEXT :   " + sql);
        int fromRowNum = (pageNo * paginationCount) + 1;
        int toRowNum = (pageNo + 1) * paginationCount;

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
        U.log("TARGETENTITY==>" + targetEntity + "  DIVCODE==>" + divCode);
        String datasql = sql;
        datasql = datasql.replaceAll("'USERCODE'", "'" + userCode + "'");
        datasql = datasql.replaceAll("'ACCCODE'", "'" + userCode + "'");
        datasql = datasql.replaceAll("SET_FILTER_VALUE", "");
        datasql = datasql.replaceAll("ROWFROM", Integer.toString(fromRowNum));
        datasql = datasql.replaceAll("ROWTO", Integer.toString(toRowNum));
        datasql = datasql.replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");
        datasql = datasql.replaceAll("'VRNO'", "'" + vrno + "'");
        datasql = datasql.replaceAll("'EMPCODE'", "'" + empCode + "'");
        datasql = datasql.replaceAll("'ACCYEAR'", "'" + acc_year + "'");
        datasql = datasql.replaceAll("'ACCCODE'", "'" + accCode + "'");
        datasql = datasql.replaceAll("'DIVCODE'", "'" + divCode + "'");
        datasql = datasql.replaceAll("'TARGETENTITY'", "'" + targetEntity + "'");
        U.log("ENTITY_CODE==>>" + entityCode);
        if (entityCode == null || entityCode == "null") {
            entityCode = "";
        }
        datasql = datasql.replaceAll("'ENTITYCODE'", "'" + entityCode + "'");

        try {
            U.log("FETCH REPORT DATA SQL TEXT AFTER REPLACING USERCODE : " + datasql);
            ps = c.prepareStatement(datasql);
            rs = ps.executeQuery();
            ResultSetMetaData rsmd = rs.getMetaData();
//            U.log("\n\n"+datasql + "=columns: " + rsmd.getColumnCount());

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

                    CardWithGridModel targetModel = new CardWithGridModel();
//                    for (int i = 1; i <= count; i++) {
                    //                        U.log("getColumnType--> " + rsmd.getColumnTypeName(i));

                    arr = new ArrayList<String>();
                    arr.add(rs.getString("month_period") == null || rs.getString("month_period") == "" ? "Not Defined" : rs.getString("month_period"));
                    arr.add(rs.getString("qty_month") == null || rs.getString("qty_month") == "" || Integer.parseInt(rs.getString("qty_month")) == 0 ? "-" : rs.getString("qty_month"));
                    arr.add(rs.getString("TILL_MONTH_SALES_QTY") == null || rs.getString("TILL_MONTH_SALES_QTY") == "" ? "-" : rs.getString("TILL_MONTH_SALES_QTY"));
                    if (rs.getString("qty_MONTH") == null || rs.getString("qty_MONTH") == "" || Integer.parseInt(rs.getString("qty_MONTH")) == 0) {
                        arr.add("N/A");
                    } else {
                        arr.add(rs.getString("MONTH_DIFF") == null || rs.getString("MONTH_DIFF") == "" ? "-" : rs.getString("MONTH_DIFF"));
                    }
                    targetModel.setMonth(arr);

                    arr = new ArrayList<String>();
                    arr.add(rs.getString("QTR_PERIOD") == null || rs.getString("QTR_PERIOD") == "" ? "Not Defined" : rs.getString("QTR_PERIOD"));
                    arr.add(rs.getString("qty_qtr") == null || rs.getString("qty_qtr") == "" || Integer.parseInt(rs.getString("qty_qtr")) == 0 ? "-" : rs.getString("qty_qtr"));
                    arr.add(rs.getString("TILL_qtr_SALES_QTY") == null || rs.getString("TILL_qtr_SALES_QTY") == "" ? "-" : rs.getString("TILL_qtr_SALES_QTY"));
                    if (rs.getString("qty_QTR") == null || rs.getString("qty_QTR") == "" || Integer.parseInt(rs.getString("qty_QTR")) == 0) {
                        arr.add("N/A");
                    } else {
                        arr.add(rs.getString("QTR_DIFF") == null || rs.getString("QTR_DIFF") == "" ? "-" : rs.getString("QTR_DIFF"));
                    }
                    targetModel.setQtr(arr);

                    arr = new ArrayList<String>();
                    arr.add(rs.getString("YR_PERIOD") == null || rs.getString("YR_PERIOD") == "" ? "Not Defined" : rs.getString("YR_PERIOD"));
                    arr.add(rs.getString("qty_YR") == null || rs.getString("qty_YR") == "" || Integer.parseInt(rs.getString("qty_YR")) == 0 ? "-" : rs.getString("qty_YR"));
                    arr.add(rs.getString("TILL_YR_SALES_QTY") == null || rs.getString("TILL_YR_SALES_QTY") == "" ? "-" : rs.getString("TILL_YR_SALES_QTY"));

                    if (rs.getString("qty_YR") == null || rs.getString("qty_YR") == "" || Integer.parseInt(rs.getString("qty_YR")) == 0) {
                        arr.add("N/A");
                    } else {
                        arr.add(rs.getString("YR_DIFF") == null || rs.getString("YR_DIFF") == "" ? "-" : rs.getString("YR_DIFF"));
                    }

                    targetModel.setYear(arr);

                    targetModel.setHeading(rs.getString("ITEM_NAME"));
                    targetData.add(targetModel);

                    p++;
                } while (rs.next());
            }
            model.setGraphLabelData(graphData);

            ArrayList<ArrayList<byte[]>> images = new ArrayList<ArrayList<byte[]>>();

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

        return targetData;
    }

}
