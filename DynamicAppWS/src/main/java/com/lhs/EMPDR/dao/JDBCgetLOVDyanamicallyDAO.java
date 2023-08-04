/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.WBSLocationJSON;
import com.lhs.EMPDR.Model.GenericCodeNameModel;
import com.lhs.EMPDR.utility.LOV;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCgetLOVDyanamicallyDAO {

    Connection c;
    String sysdate = "";

    public JDBCgetLOVDyanamicallyDAO(Connection c) {
        this.c = c;
    }

    public List<WBSLocationJSON> getOfflineLOV(String userCode) throws SQLException {
        String sql = "";
        String uniqueKey = "";
        String forWhichcolmn = "";
        String whereClauseValue = "";
        PreparedStatement ps = null;
        ResultSet rs;
        WBSLocationJSON json = new WBSLocationJSON();
        List<WBSLocationJSON> list = new ArrayList<WBSLocationJSON>();
        sql = "select * from LHSSYS_PORTAL_DATA_DSC_UPDATE D, LHSSYS_PORTAL_TABLE_DSC_UPDATE T "
                + "where T.SEQ_NO = D.SEQ_NO AND T.OFFLINE_FLAG_APP_RUN = "
                + "'T'AND D.item_help_property = 'L' AND D.STATUS != 'F'";
        try {
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    //lov
                    json = getLovDyanamically(rs.getString("SEQ_NO"), rs.getString("COLUMN_NAME"), null, userCode, "", "");
                    list.add(json);
                } while (rs.next());
            }
        } catch (Exception e) {
            System.out.println("EXCEPTION IN LOV FETCHING : " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    System.out.println("EXCEPTION IN LOV FETCHING : " + e.getMessage());
                }
            }
        }
        return list;
    }

    public WBSLocationJSON getLovDyanamically(String uniqueKey, String forWhichcolmn, String whereClauseValue, String userCode, String accYear, String entityCode) throws SQLException {
        U.log("LOV PARAMS===>" + entityCode + "," + accYear);
        String sql = "";
        String sqlData = "";
        LOV obj_lov = new LOV();
        PreparedStatement ps1 = c.prepareStatement("select TO_CHAR(sysdate, 'DD-MM-YYYY HH24:MI:SS') as systemdate from dual");
        ResultSet rs1 = ps1.executeQuery();
        if (rs1 != null && rs1.next()) {
            sysdate = rs1.getString(1);
        }
        PreparedStatement ps2 = c.prepareStatement("select emp_code from user_mast u where  u.user_code = '" + userCode + "'");
        ResultSet rs2 = ps2.executeQuery();
        String empCode = "";
        if (rs1 != null && rs1.next()) {
            empCode = rs1.getString(1);
        }
        System.out.println("uniqueKey==" + uniqueKey);
        sql = "select * from LHSSYS_PORTAL_DATA_DSC_UPDATE where seq_no='" + uniqueKey + "' and column_name='" + forWhichcolmn
                + "' and (item_help_property = 'L' or item_help_property = 'M')";
//        System.out.println("sql==" + sql);
        PreparedStatement ps = null;
        ResultSet rs;
        String HeadingOfLov = "";
        String ref_lov_table_col = "";
        String ref_lov_where_clause = "";
        String order_clause = "";
        String column_select_list_value = "";
        String dependent_row_logic = null;
        String dependent_where_clause = "";
        List<GenericCodeNameModel> list = new ArrayList<GenericCodeNameModel>();
        System.out.println(" whereClauseValue : " + whereClauseValue);
        System.out.println(" Fetch Lov Query : " + sql);
        try {
            sqlData = sqlData + "\n----------Fetch Lov Query ----------\n" + sql;
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                U.log("get required value :  " + sql);
                ref_lov_table_col = rs.getString("ref_lov_table_col");
                ref_lov_where_clause = rs.getString("ref_lov_where_clause");
                order_clause = rs.getString("order_clause");
                column_select_list_value = rs.getString("column_select_list_value");
                dependent_row_logic = rs.getString("dependent_row_logic");
                obj_lov.setREF_LOV_TABLE_COL(ref_lov_table_col);
                dependent_where_clause = rs.getString("dependent_where_clause");
                StringBuffer lovSql = new StringBuffer();
                String lovSQL = obj_lov.createLOVsql(c);
                HeadingOfLov = lovSQL.split("~~")[0];
                lovSql.append(lovSQL.split("~~")[1]);
                if (ref_lov_where_clause != null) {
                    ref_lov_where_clause = ref_lov_where_clause.replaceAll("'USERCODE'", "'" + userCode + "'");
                    ref_lov_where_clause = ref_lov_where_clause.replaceAll("'ENTITYCODE'", "'" + entityCode + "'");
                    ref_lov_where_clause = ref_lov_where_clause.replaceAll("'EMPCODE'", "'" + empCode + "'");
                    ref_lov_where_clause = ref_lov_where_clause.replaceAll("'ACCYEAR'", "'" + accYear + "'");
//                    System.out.println(ref_lov_where_clause + "==reflovsql===" + lovSql.toString());
                    String whereClauseString = "";
                    String[] refLovWhereclauseArray = ref_lov_where_clause.split("#");
                    if (whereClauseValue != null) {
                        String[] whereClauseValArray = whereClauseValue.split("#");
                        for (int i = 0; i < whereClauseValArray.length; i++) {
                            whereClauseString = whereClauseString + "" + refLovWhereclauseArray[i] + "'" + whereClauseValArray[i] + "'";
                        }
//                        System.out.println("whereClauseString : " + whereClauseString);
                        lovSql.append(whereClauseString);
                    } else {
                        lovSql.append(ref_lov_where_clause);
                    }
                }
                System.out.println("lov sql--> "+lovSql);
                if (dependent_where_clause != null) {
//                    lovSql.append(" " + ref_lov_where_clause);
//                    System.out.println("LOV GENERATION SQL :  " + lovSql.toString());
                    System.out.println("dependent_where_clause : " + dependent_where_clause + "\n whereClauseValue1 :  " + whereClauseValue);
                    String whereClauseString = "";
                    dependent_where_clause = dependent_where_clause.replaceAll("'USERCODE'", "'" + userCode + "'");
                    dependent_where_clause = dependent_where_clause.replaceAll("'ENTITYCODE'", "'" + entityCode + "'");
                    dependent_where_clause = dependent_where_clause.replaceAll("'EMPCODE'", "'" + empCode + "'");
                    dependent_where_clause = dependent_where_clause.replaceAll("'ACCYEAR'", "'" + accYear + "'");
//                    HashMap<String, String> whereClauseValHash = new HashMap<String, String>();
                    if (dependent_where_clause.contains("= #")) {
                        String[] dependentWhereClauseArray = dependent_where_clause.split("#");
                        if (whereClauseValue != null) {
                            String[] whereClauseValArray = whereClauseValue.split("#");
                            System.out.println("whereClauseValArray.length : " + whereClauseValArray.length
                                    + "\n dependentWhereClauseArray.length :" + dependentWhereClauseArray.length);
                            for (int i = 0; i < dependentWhereClauseArray.length; i++) {
//                               whereClauseString=dependent_where_clause.replace("#",whereClauseValArray[i] );
                                if (i < whereClauseValArray.length) {
                                    if (!whereClauseValArray[i].equals("null")) {

                                        if (dependentWhereClauseArray[i].contains("like")) {
                                            whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i] + " '%" + whereClauseValArray[i] + "%' ";
                                        } else {
                                            whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i] + " '" + whereClauseValArray[i] + "' ";
                                        }
                                    }
                                } else {
                                    whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i];
                                }
                            }
                            System.out.println("whereClauseString 1 AFTER REPLACING VALUES : " + whereClauseString);
                            lovSql.append(whereClauseString);
                        }
                    } else {
                        if (whereClauseValue != null) {
                            String[] whereClauseValArray = whereClauseValue.split("#");
                            System.out.println("whereClauseValArray.length : " + whereClauseValArray.length);
                            for (int i = 0; i < whereClauseValArray.length; i++) {

                                if (whereClauseValArray[i].contains(",")) {
                                    String splitedSearchText[] = whereClauseValArray[i].split(", ");
                                    int splitedSearchTextCount = splitedSearchText.length;
                                    StringBuffer buildedSearchText = new StringBuffer();
                                    for (int j = 0; j < splitedSearchTextCount; j++) {
                                        if (j == splitedSearchTextCount - 1) {
                                            buildedSearchText.append("'").append(splitedSearchText[j]);
                                        } else if (j == 0) {
                                            buildedSearchText.append(splitedSearchText[j]).append("',");
                                        } else {
                                            buildedSearchText.append("'").append(splitedSearchText[j]).append("',");
                                        }
                                    }
                                    whereClauseValArray[i] = buildedSearchText.toString();
                                }

                                dependent_where_clause = dependent_where_clause.replaceAll("COL" + i, whereClauseValArray[i]);
                            }
                            System.out.println("dependent_where_clause 2 AFTER REPLACING VALUES : " + dependent_where_clause);
                            lovSql.append(dependent_where_clause);
                        }
                    }
                }
//                System.out.println("LOV GENERATION SQL :  " + lovSql.toString());
                if (order_clause != null) {
                    lovSql.append(" order by ").append(order_clause).append("");
                }
                U.log("SQL TO FETCH LOV VALUES :   " + lovSql);
                sqlData = sqlData + "\n---------- Lov Query ----------\n" + lovSql;
                ps = c.prepareStatement(lovSql.toString().replaceAll("USERCODE", userCode));
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
//                        U.log("lov sql have some values");
//                        U.log("1st value==" + rs.getString(1));
//                        U.log("2nd value==" + rs.getString(2));
                        //  U.log("3rd value=="+rs.getString(3));
                        //  LocationWBSnameModel m = new LocationWBSnameModel();
//                    m.setCOST_CODE(rs.getString("cost_code"));
//                    m.setWBS_Name(rs.getString("WBS_name"));
                        GenericCodeNameModel m = new GenericCodeNameModel();
                        m.setCode(rs.getString(1));
                        m.setName(rs.getString(2));
                        try {
//                            m.setRowId(rs.getString("rowid"));
                        } catch (Exception e) {
                            U.log(e);
                        }
                        list.add(m);
                    } while (rs.next());
                }
            }
        } catch (Exception e) {
            System.out.println("EXCEPTION IN LOV FETCHING : " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    System.out.println("EXCEPTION IN LOV FETCHING : " + e.getMessage());
                }
            }
        }
        WBSLocationJSON json = new WBSLocationJSON();
        json.setLocationList(list);
        json.setLovHeading(HeadingOfLov);
        json.setSqlData(sqlData);
        json.setOfflineLOVID("lov" + uniqueKey + forWhichcolmn);
        return json;
    }

    public WBSLocationJSON getSelectDyanamically(String uniqueKey, String forWhichcolmn, String whereClauseValue, String userCode, String searchTxt) throws SQLException {

        String sql = "";
        String sqlData = "";
        LOV obj_lov = new LOV();
        PreparedStatement ps1 = c.prepareStatement("select TO_CHAR(sysdate, 'DD-MM-YYYY HH24:MI:SS') as systemdate from dual");
        ResultSet rs1 = ps1.executeQuery();
        if (rs1 != null && rs1.next()) {
            sysdate = rs1.getString(1);
        }
        System.out.println("uniqueKey==" + uniqueKey);
        sql = "select * from LHSSYS_PORTAL_DATA_DSC_UPDATE where seq_no='" + uniqueKey + "' and column_name='" + forWhichcolmn + "'";
//        System.out.println("sql==" + sql);
        PreparedStatement ps = null;
        ResultSet rs;
        String HeadingOfLov = "";
        String ref_lov_table_col = "";
        String ref_lov_where_clause = "";
        String order_clause = "";
        String column_select_list_value = "";
        String dependent_row_logic = null;
        String dependent_where_clause = "";
        List<GenericCodeNameModel> list = new ArrayList<GenericCodeNameModel>();
        System.out.println(" whereClauseValue : " + whereClauseValue);
            System.out.println("fetch lov query==> "+sql);
        try {
            sqlData = sqlData + "\n----------Fetch Lov Query ----------\n" + sql;
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                U.log("get required value :  " + sql);
                ref_lov_table_col = rs.getString("ref_lov_table_col");
                ref_lov_where_clause = rs.getString("ref_lov_where_clause");
                order_clause = rs.getString("order_clause");
                column_select_list_value = rs.getString("column_select_list_value");
                dependent_row_logic = rs.getString("dependent_row_logic");
                obj_lov.setREF_LOV_TABLE_COL(ref_lov_table_col);
                dependent_where_clause = rs.getString("dependent_where_clause");
                StringBuffer lovSql = new StringBuffer();
                String lovSQL = obj_lov.createLOVsql(c);
                HeadingOfLov = lovSQL.split("~~")[0];
                lovSql.append(lovSQL.split("~~")[1]);
                if (ref_lov_where_clause != null) {
//                    System.out.println(ref_lov_where_clause + "==reflovsql===" + lovSql.toString());
                    String whereClauseString = "";
                    String[] refLovWhereclauseArray = ref_lov_where_clause.split("#");
                    if (whereClauseValue != null) {
                        String[] whereClauseValArray = whereClauseValue.split("#");
                        for (int i = 0; i < whereClauseValArray.length; i++) {
                            whereClauseString = whereClauseString + "" + refLovWhereclauseArray[i] + "'" + whereClauseValArray[i] + "'";
                        }
                        System.out.println("whereClauseString : " + whereClauseString);
                        lovSql.append(whereClauseString);
                    } else {
                        lovSql.append(ref_lov_where_clause);
                    }
                }
                if (dependent_where_clause != null) {
//                    System.out.println("LOV GENERATION SQL :  " + lovSql.toString());
                    System.out.println("dependent_where_clause : " + dependent_where_clause + "\n whereClauseValue :  " + whereClauseValue);
                    String whereClauseString = "";
                    if (dependent_where_clause.contains("= #")) {
                        String[] dependentWhereClauseArray = dependent_where_clause.split("#");
                        if (whereClauseValue != null) {
                            String[] whereClauseValArray = whereClauseValue.split("#");
                            System.out.println("whereClauseValArray.length : " + whereClauseValArray.length
                                    + "\n dependentWhereClauseArray.length :" + dependentWhereClauseArray.length);
                            for (int i = 0; i < dependentWhereClauseArray.length; i++) {
                                if (i < whereClauseValArray.length) {
                                    if (!whereClauseValArray[i].equals("null")) {

                                        if (dependentWhereClauseArray[i].contains("like")) {
                                            whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i] + " '%" + whereClauseValArray[i] + "%' ";
                                        } else {
                                            whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i] + " '" + whereClauseValArray[i] + "' ";
                                        }
                                    }
                                } else {
                                    whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i];
                                }
                            }
                            System.out.println("whereClauseString 1 AFTER REPLACING VALUES : " + whereClauseString);
                            lovSql.append(whereClauseString);
                        }
                    } else {
                        if (whereClauseValue != null) {
                            String[] whereClauseValArray = whereClauseValue.split("#");
                            System.out.println("whereClauseValArray.length : " + whereClauseValArray.length);
                            for (int i = 0; i < whereClauseValArray.length; i++) {
                                dependent_where_clause = dependent_where_clause.replaceAll("COL" + i, whereClauseValArray[i]);
                            }
                            System.out.println("dependent_where_clause 2 AFTER REPLACING VALUES : " + dependent_where_clause);
                            lovSql.append(dependent_where_clause);
                            lovSql.append("AND SERIES like '" + searchTxt + "%'");
                        }
                    }
                }
//                System.out.println("LOV GENERATION SQL :  " + lovSql.toString());
                if (order_clause != null) {
                    lovSql.append(" order by ").append(order_clause).append("");
                }
                U.log("SQL TO FETCH LOV VALUES :   " + lovSql);
                sqlData = sqlData + "\n---------- Lov Query ----------\n" + lovSql;

                ps = c.prepareStatement(lovSql.toString().replaceAll("USERCODE", userCode));
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        GenericCodeNameModel m = new GenericCodeNameModel();
                        m.setCode(rs.getString(1));
                        m.setName(rs.getString(2));
                        try {
                        } catch (Exception e) {
                            U.log(e);
                        }
                        list.add(m);
                    } while (rs.next());
                }
            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
        }
        WBSLocationJSON json = new WBSLocationJSON();
        json.setLocationList(list);
        json.setLovHeading(HeadingOfLov);
        json.setSqlData(sqlData);
        return json;
    }

    public WBSLocationJSON getReportFilterLOV(String uniqueKey, String forWhichcolmn,
            String whereClauseValue, String userCode) throws SQLException {
        WBSLocationJSON json = new WBSLocationJSON();
        String sql = "";
        LOV obj_lov = new LOV();
        PreparedStatement ps1 = c.prepareStatement("select TO_CHAR(SYSDATE, 'DD-MM-YYYY HH24:MI:SS') as systemdate from dual");
        ResultSet rs1 = ps1.executeQuery();
        if (rs1 != null && rs1.next()) {
            sysdate = rs1.getString(1);
        }
        // SELECT * FROM LHSSYS_ALERT_DIRECT_EMAIL_PARA E WHERE E.SEQ_ID = 2 AND E.PARA_DESC = 'Party Contract No';
        // SELECT * FROM LHSSYS_ALERT_DIRECT_EMAIL_PARA E WHERE E.SEQ_ID = '" + uniqueKey + "' AND E.PARA_DESC = '" + forWhichcolmn + "';
        sql = "SELECT * FROM LHSSYS_ALERT_DIRECT_EMAIL_PARA E WHERE E.SEQ_ID = '" + uniqueKey + "' AND E.PARA_COLUMN = '" + forWhichcolmn + "'";

        System.out.println("ReportFilterLOV SQL : " + sql);
        PreparedStatement ps = null;
        ResultSet rs;

        String HeadingOfLov = "";
        String ref_lov_table_col = "";
        String ref_lov_where_clause = "";
        String order_clause = "";
        String column_select_list_value = "";
        String dependent_row_logic = null;
        List<GenericCodeNameModel> list = new ArrayList<GenericCodeNameModel>();

        try {
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                ref_lov_table_col = rs.getString("ref_lov_table_col");
                ref_lov_where_clause = rs.getString("ref_lov_where_clause");
                order_clause = rs.getString("order_clause");
                column_select_list_value = rs.getString("column_select_list_value");
                try {
                    dependent_row_logic = rs.getString("dependent_row_logic");
                } catch (Exception e) {
                }

                obj_lov.setREF_LOV_TABLE_COL(ref_lov_table_col);
                HeadingOfLov = obj_lov.createLOVsql(c).split("~")[0];
                StringBuffer lovSql = new StringBuffer();
                lovSql.append(obj_lov.createLOVsqlForReport(c));

                if (ref_lov_where_clause != null) {
//                    lovSql.append(" " + ref_lov_where_clause);
//                    System.out.println(ref_lov_where_clause + "==reflovsql===" + lovSql.toString());
                    String whereClauseString = "";
                    String[] refLovWhereclauseArray = ref_lov_where_clause.split("#");
                    if (whereClauseValue != null) {
                        String[] whereClauseValArray = whereClauseValue.split("#");
                        for (int i = 0; i < whereClauseValArray.length; i++) {
                            whereClauseString = whereClauseString + "" + refLovWhereclauseArray[i] + "'" + whereClauseValArray[i] + "'";
                        }
                        System.out.println("whereClauseString : " + whereClauseString);
                        lovSql.append(whereClauseString);
                    } else {
                        lovSql.append(ref_lov_where_clause);
                    }
                }
                if (dependent_row_logic != null) {
//                    lovSql.append(" " + ref_lov_where_clause);
//                    System.out.println("LOV GENERATION SQL :  " + lovSql.toString());
                    System.out.println("dependent_where_clause : " + dependent_row_logic + "\n whereClauseValue :  " + whereClauseValue);
                    String whereClauseString = "";
//                    HashMap<String, String> whereClauseValHash = new HashMap<String, String>();
                    if (dependent_row_logic.contains("= #")) {
                        String[] dependentWhereClauseArray = dependent_row_logic.split("#");
                        if (whereClauseValue != null) {
                            String[] whereClauseValArray = whereClauseValue.split("#");
                            System.out.println("whereClauseValArray.length : " + whereClauseValArray.length
                                    + "\n dependentWhereClauseArray.length :" + dependentWhereClauseArray.length);
                            for (int i = 0; i < dependentWhereClauseArray.length; i++) {
//                               whereClauseString=dependent_where_clause.replace("#",whereClauseValArray[i] );
                                if (i < whereClauseValArray.length) {
                                    if (!whereClauseValArray[i].equals("null")) {

                                        if (dependentWhereClauseArray[i].contains("like")) {
                                            whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i] + " '%" + whereClauseValArray[i] + "%' ";
                                        } else {
                                            whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i] + " '" + whereClauseValArray[i] + "' ";
                                        }
                                    }
                                } else {
                                    whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i];
                                }
                            }
                            System.out.println("whereClauseString 1 AFTER REPLACING VALUES : " + whereClauseString);
                            lovSql.append(whereClauseString);
                        }
                    } else {
                        if (whereClauseValue != null) {
                            String[] whereClauseValArray = whereClauseValue.split("#");
                            System.out.println("whereClauseValArray.length : " + whereClauseValArray.length);
                            for (int i = 0; i < whereClauseValArray.length; i++) {
                                dependent_row_logic = dependent_row_logic.replaceAll("COL" + i, whereClauseValArray[i]);
                            }
                            System.out.println("dependent_where_clause 2 AFTER REPLACING VALUES : " + dependent_row_logic);
                            lovSql.append(dependent_row_logic);
                        }
                    }
                }

                if (order_clause != null) {
                    lovSql.append(" order by ").append(order_clause).append("");
                }
                String lovSql1 = lovSql.toString().replaceAll("USERCODE", userCode).replaceAll("STR_ACC_CODE", userCode);
                U.log("SQL TO FETCH LOV VALUES :  " + lovSql1);
                ps = c.prepareStatement(lovSql1);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        GenericCodeNameModel m = new GenericCodeNameModel();
                        m.setCode(rs.getString(1));
                        m.setName(rs.getString(2));
                        list.add(m);
                        json.setLocationList(list);
                        json.setLovHeading(HeadingOfLov);
                    } while (rs.next());
                }
            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
        }
        return json;
    }

    public String getAutoCompleteData(String uniqueKey, String forWhichcolmn, String whereClauseValue, String userCode) throws SQLException {

        String dataList = "";
        String sql = "";
        LOV obj_lov = new LOV();
        PreparedStatement ps1 = c.prepareStatement("select TO_CHAR(sysdate, 'DD-MM-YYYY HH24:MI:SS') as systemdate from dual");
        ResultSet rs1 = ps1.executeQuery();
        if (rs1 != null && rs1.next()) {
            sysdate = rs1.getString(1);
        }
        sql = "select * from LHSSYS_PORTAL_DATA_DSC_UPDATE where seq_no='" + uniqueKey + "' and column_name='" + forWhichcolmn + "'";
        System.out.println("getAutoCompleteData sql : " + sql);
        PreparedStatement ps = null;
        ResultSet rs;

        String HeadingOfLov = "";
        String ref_lov_table_col = "";
        String ref_lov_where_clause = "";
        String order_clause = "";
        String column_select_list_value = "";
        String dependent_row_logic = null;
        String dependent_where_clause = "";
        List<GenericCodeNameModel> list = new ArrayList<GenericCodeNameModel>();

        try {
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                U.log("get required value :  " + sql);
                ref_lov_table_col = rs.getString("ref_lov_table_col");
                ref_lov_where_clause = rs.getString("ref_lov_where_clause");
                order_clause = rs.getString("order_clause");
                column_select_list_value = rs.getString("column_select_list_value");
                dependent_row_logic = rs.getString("dependent_row_logic");
                obj_lov.setREF_LOV_TABLE_COL(ref_lov_table_col);
                dependent_where_clause = rs.getString("dependent_where_clause");
                StringBuffer lovSql = new StringBuffer();
                HeadingOfLov = obj_lov.createLOVsql(c).split("~")[0];
                lovSql.append(obj_lov.createLOVsql(c).split("~")[1]);
                if (ref_lov_where_clause != null) {
//                    lovSql.append(" " + ref_lov_where_clause);
//                    System.out.println(ref_lov_where_clause + "==reflovsql===" + lovSql.toString());
                    String whereClauseString = "";
                    String[] refLovWhereclauseArray = ref_lov_where_clause.split("#");
                    if (whereClauseValue != null) {
                        String[] whereClauseValArray = whereClauseValue.split("#");
                        for (int i = 0; i < whereClauseValArray.length; i++) {
                            whereClauseString = whereClauseString + "" + refLovWhereclauseArray[i] + "'" + whereClauseValArray[i] + "'";
                        }
                        System.out.println("whereClauseString===" + whereClauseString);
                        lovSql.append(whereClauseString);
                    } else {
                        lovSql.append(ref_lov_where_clause);
                    }
                }

                if (dependent_where_clause != null) {
//                    lovSql.append(" " + ref_lov_where_clause);
//                    System.out.println("LOV GENERATION SQL :  " + lovSql.toString());
                    System.out.println("dependent_where_clause : " + dependent_where_clause + "\nwhereClauseValArray :  " + whereClauseValue);
                    String whereClauseString = "";
                    String[] dependentWhereClauseArray = dependent_where_clause.split("#");
                    if (whereClauseValue != null) {
                        String[] whereClauseValArray = whereClauseValue.split("#");
                        for (int i = 0; i < whereClauseValArray.length; i++) {
//                               whereClauseString=dependent_where_clause.replace("#",whereClauseValArray[i] );
                            if (!whereClauseValArray[i].equals("null")) {
                                if (dependentWhereClauseArray[i].contains("like")) {
                                    whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i] + " '%" + whereClauseValArray[i] + "%' ";
                                } else {
                                    whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i] + " '" + whereClauseValArray[i] + "' ";
                                }
                            } else {
                                whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i] + " " + whereClauseValArray[i] + " ";
                            }
                        }
                        System.out.println("whereClauseString===" + whereClauseString);
                        lovSql.append(whereClauseString);
                    }
                }
//                System.out.println("LOV GENERATION SQL :  " + lovSql.toString());
                if (order_clause != null) {
                    lovSql.append(" order by ").append(order_clause).append("");
                }
                U.log("SQL TO FETCH LOV VALUES :   " + lovSql);
                ps = c.prepareStatement(lovSql.toString().replaceAll("USERCODE", userCode).replaceAll("sysdate", sysdate));
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        if (dataList == null || dataList.equalsIgnoreCase("")) {
                            dataList = rs.getString(2);
                        } else {
                            dataList = dataList + "#" + rs.getString(2);
                        }
                    } while (rs.next());
                }
            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
        }
        WBSLocationJSON json = new WBSLocationJSON();
        json.setLocationList(list);
        json.setLovHeading(HeadingOfLov);
//        System.out.println("dataList = " + dataList);
        return dataList;
    }

    public ArrayList<GenericCodeNameModel> getUserLOV(String seq_id) {

        ArrayList<GenericCodeNameModel> arrayList = new ArrayList<GenericCodeNameModel>();

        String sql = "SELECT DISTINCT(L.USER_CODE), (SELECT U.USER_NAME FROM USER_MAST U WHERE "
                + "     U.USER_CODE = L.USER_CODE) USER_NAME FROM LHSSYS_PORTAL_APP_TRAN L"
                + "     WHERE L.DYNAMIC_TABLE_SEQ_ID = '" + seq_id + "'";

        PreparedStatement ps = null;
        ResultSet rs;
        try {

            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    GenericCodeNameModel model = new GenericCodeNameModel();
                    model.setCode(rs.getString(1));
                    model.setName(rs.getString(2));
                    arrayList.add(model);
                } while (rs.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return arrayList;
    }
}
