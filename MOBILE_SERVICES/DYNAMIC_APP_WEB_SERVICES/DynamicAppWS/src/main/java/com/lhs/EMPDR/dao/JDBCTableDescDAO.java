/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.TableDescGridJSON;
import com.lhs.EMPDR.JSONResult.TableDescJSON;
import com.lhs.EMPDR.Model.TableDescModel;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCTableDescDAO {

    Connection c;
    String paradesc;
    String valueFormatFlag;
    String columnCount;

    public JDBCTableDescDAO(Connection c) {
        this.c = c;
    }

    public TableDescJSON getTableDesc(String seqId, String slno, String value) {
        String sqltext = null;
        String sql = "select sql_text,para_Desc from LHSSYS_ALERT_DIRECT_EMAIL_PARA where seq_id=" + seqId + " and slno=" + slno;

        U.log("GET DRILL DOWN REPORT SQL : " + sql);

        PreparedStatement ps = null;
        ResultSet rs;

        List<TableDescModel> list = new ArrayList<TableDescModel>();
        try {
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();

            ResultSetMetaData rsmd = rs.getMetaData();

            if (rs != null && rs.next()) {

                U.log("DRILL DOWN REPORT SQL : " + rs.getString(1));
                sqltext = rs.getString(1);
                paradesc = rs.getString(2);
            }
            if (sqltext != null) {
                sqltext = sqltext + "'" + value + "'";
                // U.log("sql=="+sql);
                ps = c.prepareStatement(sqltext);
                rs = ps.executeQuery();
                ResultSetMetaData rsm = rs.getMetaData();

                if (rs != null && rs.next()) {
                    do {
                        for (int i = 1; i <= rsm.getColumnCount(); i++) {

                            TableDescModel model = new TableDescModel();
                            model.setCode(rsm.getColumnName(i));
                            model.setValue(rs.getString(i));
                            list.add(model);
                        }

                    } while (rs.next());
                }
                TableDescJSON json = new TableDescJSON();
                json.setTableDesc(list);
                json.setPara_desc(paradesc);
                return json;
            }
        } catch (Exception e) {
            System.out.println("exeception ---> " + e.getMessage());
//            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return null;
    }

    public TableDescGridJSON TableDescGridJSON(String seqId, String slno, String value, String columnName, int pageNo,
            String searchText, String valueFormat, String filterDataJSON, String user_code, String rowNum) {
        String sqltext = null;
        String sql = "select sql_text,para_Desc, OPERATOR_FLAG, COLUMN_COUNT,column_operator from LHSSYS_ALERT_DIRECT_EMAIL_PARA where seq_id=" + seqId + " and slno=" + slno;
        PreparedStatement ps = null;
        ResultSet rs;
        String serchTextPlaceholder = "";
        int fromRowNum = (pageNo * Integer.parseInt(rowNum)) + 1;
        int toRowNum = (pageNo + 1) * Integer.parseInt(rowNum);
        List<String> tableHeader = new ArrayList<String>();
        List<ArrayList> tableData = new ArrayList<ArrayList>();
        U.log("SQL TEXT TO GET DRILL DOWN SQL :  " + sql);
        try {

            String valueFormatSQL = "LHS_UTILITY.SET_VALUE_FORMAT_APP_MIS('VALUE_FORMAT')".replaceAll("'VALUE_FORMAT'", "'" + valueFormat + "'");
            System.out.println("valueFormatSQL : " + valueFormatSQL);
            try {
                if (valueFormat != null) {
                    ps = c.prepareCall("{call " + valueFormatSQL + "}");
                    ps.execute();
                }
            } catch (SQLException e) {
                System.out.println("exeception ---> " + e.getMessage());
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                        System.out.println("exeception ---> " + e.getMessage());
                    }
                }
            }

            try {
                ps = c.prepareStatement(sql);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    sqltext = rs.getString(1);
                    paradesc = rs.getString(2);
                    valueFormatFlag = rs.getString(3);
                    columnCount = rs.getString(4);
                    serchTextPlaceholder = rs.getString(5);
                }
            } catch (SQLException e) {
                System.out.println("exeception ---> " + e.getMessage());
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                        System.out.println("exeception ---> " + e.getMessage());
                    }
                }
            }

//            --------------------------------------
//            System.out.println("sqltext---> " + sqltext);
            String[] sqlarr = sqltext.split("~##~");
            sqltext = sqlarr[0];
//            System.out.println(sqlarr[0]);
//            System.out.println(sqlarr[1]);
            if (sqlarr.length > 1) {
                String plsqlText = sqlarr[1];
                JSONParser json_parser = new JSONParser();
                JSONObject listjson = (JSONObject) json_parser.parse(filterDataJSON);
                Set keys = listjson.keySet();
                Iterator a = keys.iterator();
                String updateQuery = "update lhssys_alert_direct_email_para set column_value= case ";
                StringBuilder whenString = new StringBuilder();
                whenString.append(updateQuery);
                while (a.hasNext()) {
                    String key = (String) a.next();
                    String values = (String) listjson.get(key);
//                    System.out.print("key : " + key + " value :" + values);
                    if (plsqlText.contains("'" + key + "'")) {
                        plsqlText = plsqlText.replace("'" + key + "'", "'" + values + "'");
                    }
                    if (sqltext.contains("'" + key + "'")) {
                        sqltext = sqltext.replace("'" + key + "'", "'" + values + "'");
                    }
                }

                System.out.println("plsqlText--> " + plsqlText);
                try {
                    ps = c.prepareStatement(plsqlText);
                    ps.execute();
                } catch (Exception e) {
                }
            }
            System.out.println("REPLACED sqltext : " + sqltext);
//            --------------------------------------
            U.log("VALUES TO BE RAPLACED IN DRILL DOWN SQL  : " + value);
            U.log("COLUMN_NAME TO BE RAPLACED IN DRILL DOWN SQL  : " + columnName);
            String values[] = value.split("~");
            String columnNames[] = columnName.split(",");
//            sqltext = sqltext.toUpperCase();
            sqltext = sqltext.replaceAll("ROWFROM", Integer.toString(fromRowNum));
            sqltext = sqltext.replaceAll("ROWTO", Integer.toString(toRowNum));
            sqltext = sqltext.replaceAll("SEARCHTEXT", searchText);
            if (user_code != null && !user_code.isEmpty()) {
                sqltext = sqltext.replaceAll("USERCODE", user_code);
            }
            for (int i = 0; i < columnNames.length; i++) {
                if (sqltext.contains("'" + columnNames[i] + "'")) {
                    sqltext = sqltext.replace(("'" + columnNames[i] + "'"), ("'" + values[i] + "'"));
                }
            }

            if (sqltext != null) {
                U.log("SQL TEXT TO GET DRILL DOWN VALUE GRID AFTER REPLACING VALUES  :    " + sqltext);
                ps = c.prepareStatement(sqltext);
                rs = ps.executeQuery();
                ResultSetMetaData rsm = rs.getMetaData();

                for (int i = 1; i <= rsm.getColumnCount(); i++) {
//                    U.log(" tableHeader i :" + i);
                    tableHeader.add(rsm.getColumnName(i));
                }
                int rowcount = 1;
                if (rs != null && rs.next()) {
                    do {
//                        if (rowcount != 1) {
                        ArrayList<String> list = new ArrayList<String>();
                        for (int i = 1; i <= rsm.getColumnCount(); i++) {
//                                U.log(" tableData i :" + i);
                            list.add(rs.getString(i));
                        }
                        tableData.add(list);
//                        }
                        rowcount++;
                    } while (rs.next());
                }
                TableDescGridJSON jsonn = new TableDescGridJSON();
                jsonn.setTableData(tableData);
                jsonn.setTableHeader(tableHeader);
                jsonn.setPara_desc(paradesc);
                jsonn.setValueFormatFlag(valueFormatFlag);
                jsonn.setColumnCount(columnCount);
                jsonn.setSearchPlaceHolder(serchTextPlaceholder);
//                System.out.println("serchTextPlaceholder----------> " + serchTextPlaceholder);
                return jsonn;
            }
        } catch (Exception e) {
            System.out.println("exeception -----> " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    System.out.println("exeception ---> " + e.getMessage());
                }
            }
        }
        return null;
    }
}
