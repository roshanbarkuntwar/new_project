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
    String LOGINUSERFLAG = "";

    public JDBCgetLOVDyanamicallyDAO(Connection c) {
        this.c = c;
        U u = new U(this.c);
    }

    public WBSLocationJSON getLovDyanamically(String uniqueKey, String forWhichcolmn, String whereClauseValue, String userCode,
            String geoOrgCode, String accCode, String LOGINUSERFLAG, String accYear) throws SQLException {

        String sql = "";
        LOV obj_lov = new LOV();
        PreparedStatement ps1 = c.prepareStatement("select TO_CHAR(sysdate, 'DD-MM-YYYY HH24:MI:SS') as systemdate from dual");
        ResultSet rs1 = ps1.executeQuery();
        if (rs1 != null && rs1.next()) {
            sysdate = rs1.getString(1);
        }
        U.log("uniqueKey==" + uniqueKey);
        sql = "select * from LHSSYS_PORTAL_DATA_DSC_UPDATE where seq_no='" + uniqueKey + "' and column_name='" + forWhichcolmn + "'";
        U.log("sql==" + sql);
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
        U.log(" whereClauseValue : " + whereClauseValue);
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

                String lovSQL = obj_lov.createLOVsql(c);
                HeadingOfLov = lovSQL.split("~~")[0];
                lovSql.append(lovSQL.split("~~")[1]);
                if (ref_lov_where_clause != null) {
//                    lovSql.append(" " + ref_lov_where_clause);
                    U.log(ref_lov_where_clause + "==reflovsql===" + lovSql.toString());
                    String whereClauseString = "";

                    //FOR ACC_YEAR
                    if (ref_lov_where_clause.contains("'ACC_YEAR'")) {
                        String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE \n"
                                + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )\n"
                                + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
                        U.log("getAccYearSQL : " + getAccYearSQL);
                        String currentAccYear = "";

                        ps1 = c.prepareStatement(getAccYearSQL);
                        rs1 = ps1.executeQuery();
                        if (rs1 != null && rs1.next()) {
                            currentAccYear = rs1.getString(1);
                            U.log("currentAccYear : " + currentAccYear);
                            if (currentAccYear == null) {
                                U.log("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                            } else {
                                whereClauseValue = whereClauseValue + "#" + currentAccYear;
                            }
                        } else {
                            U.log("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                        }

                    }

                    String[] refLovWhereclauseArray = ref_lov_where_clause.split("#");
                    if (whereClauseValue != null && !whereClauseValue.equalsIgnoreCase("null") && whereClauseValue.trim().length() > 1 && refLovWhereclauseArray.length > 1) {
                        String[] whereClauseValArray = whereClauseValue.split("#");
                        for (int i = 0; i < whereClauseValArray.length; i++) {

                            String valueOfWhereCondition = "'" + whereClauseValArray[i] + "'";

                            if (valueOfWhereCondition != null && !valueOfWhereCondition.equalsIgnoreCase("null")) {
                                U.log(valueOfWhereCondition + "==dependentWhereClauseArray[i] : " + refLovWhereclauseArray[i]);
                                if (refLovWhereclauseArray[i].contains("UPPER")) {
                                    valueOfWhereCondition = "UPPER(TRIM(" + valueOfWhereCondition + "))";
                                }
                                if (refLovWhereclauseArray[i].contains("COL" + i)) {
                                    whereClauseString = whereClauseString + refLovWhereclauseArray[i].replaceAll("COL" + i, valueOfWhereCondition.replaceAll(",", "','"));
                                } else {
                                    whereClauseString = whereClauseString + "" + refLovWhereclauseArray[i] + "" + valueOfWhereCondition + "";
                                }
                            }
                        }
                        U.log("whereClauseString : " + whereClauseString);
                        lovSql.append(whereClauseString);
                    } else {
                        if (!ref_lov_where_clause.contains("COL")) {
                            lovSql.append(ref_lov_where_clause);
                        }
                    }
                }
                if (dependent_where_clause != null) {
//                    lovSql.append(" " + ref_lov_where_clause);
                    U.log("LOV GENERATION SQL 1:  " + lovSql.toString());
                    U.log("dependent_where_clause : " + dependent_where_clause + "\n whereClauseValue :  " + whereClauseValue);
                    String whereClauseString = "";
//                    HashMap<String, String> whereClauseValHash = new HashMap<String, String>();
                    if (dependent_where_clause.contains("= #")) {
                        String[] dependentWhereClauseArray = dependent_where_clause.split("#");
                        if (whereClauseValue != null) {
                            String[] whereClauseValArray = whereClauseValue.split("#");
                            U.log("whereClauseValArray.length : " + whereClauseValArray.length
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
                            U.log("whereClauseString 1 AFTER REPLACING VALUES : " + whereClauseString);
                            lovSql.append(whereClauseString);
                        }
                    } else {
                        if (whereClauseValue != null) {
                            String[] whereClauseValArray = whereClauseValue.split("#");
                            U.log("whereClauseValArray.length : " + whereClauseValArray.length);
                            for (int i = 0; i < whereClauseValArray.length; i++) {
                                dependent_where_clause = dependent_where_clause.replaceAll("COL" + i, whereClauseValArray[i]);
                            }
                            U.log("dependent_where_clause 2 AFTER REPLACING VALUES : " + dependent_where_clause);
                            lovSql.append(dependent_where_clause);
                        }
                    }
                }
                U.log("LOV GENERATION SQL :  " + lovSql.toString());
                if (order_clause != null) {
                    lovSql.append(" order by ").append(order_clause).append("");
                }
                U.log("geoOrgCode  :" + geoOrgCode);
                String sqlQuery = lovSql.toString();
                sqlQuery = sqlQuery.toString().replaceAll("USERCODE", userCode).replaceAll("GEOORGCODE", geoOrgCode);
                sqlQuery = sqlQuery.toString().replaceAll("ACCCODE", accCode);
                sqlQuery = sqlQuery.toString().replaceAll("ACCYEAR", accYear);
                sqlQuery = sqlQuery.replaceAll("'null'", "");
                sqlQuery = sqlQuery.replaceAll("'LOGINUSERFLAG'", "'" + LOGINUSERFLAG + "'");

                U.log(" getLovDyanamically ==SQL TO FETCH LOV VALUES :   " + sqlQuery);
                //ps = c.prepareStatement(lovSql.toString().replaceAll("USERCODE", userCode));
                ps = c.prepareStatement(sqlQuery);
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
                            U.errorLog(e);
                        }
                        list.add(m);
                    } while (rs.next());
                }
            }
        } catch (Exception e) {
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
        }
        WBSLocationJSON json = new WBSLocationJSON();
        json.setLocationList(list);
        json.setLovHeading(HeadingOfLov);
        return json;
    }

    public WBSLocationJSON getReportFilterLOV(String uniqueKey, String forWhichcolmn,
            String whereClauseValue, String userCode, String geoOrgCode) throws SQLException {
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

        U.log("ReportFilterLOV SQL : " + sql);
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
//                dependent_row_logic = rs.getString("dependent_row_logic");
                obj_lov.setREF_LOV_TABLE_COL(ref_lov_table_col);
                HeadingOfLov = obj_lov.createLOVsql(c).split("~")[0];
                StringBuffer lovSql = new StringBuffer();
                lovSql.append(obj_lov.createLOVsqlForReport(c));

                if (ref_lov_where_clause != null) {
//                    lovSql.append(" " + ref_lov_where_clause);
                    U.log(ref_lov_where_clause + "==reflovsql===" + lovSql.toString());
                    String whereClauseString = "";
                    String[] refLovWhereclauseArray = ref_lov_where_clause.split("#");
                    if (whereClauseValue != null) {
                        String[] whereClauseValArray = whereClauseValue.split("#");
                        for (int i = 0; i < whereClauseValArray.length; i++) {
                            if (refLovWhereclauseArray[i].contains("COL" + i)) {
                                whereClauseString = whereClauseString + "" + refLovWhereclauseArray[i].replace("COL" + i, whereClauseValArray[i]);
                            } else {
                                whereClauseString = whereClauseString + "" + refLovWhereclauseArray[i] + "'" + whereClauseValArray[i] + "'";
                            }
                        }
                        U.log("whereClauseString : " + whereClauseString);
                        lovSql.append(whereClauseString);
                    } else {
                        lovSql.append(ref_lov_where_clause);
                    }
                }

//                if (ref_lov_where_clause != null) {
//                    lovSql.append(" ").append(ref_lov_where_clause);
//                }
//                if (whereClauseValue != null) {
//                    lovSql.append("'").append(whereClauseValue).append("'");
//                }
                if (order_clause != null) {
                    lovSql.append(" order by ").append(order_clause).append("");
                }
                String lovSql1 = lovSql.toString().replaceAll("USERCODE", userCode)
                        .replaceAll("sysdate", sysdate).replaceAll("STR_ACC_CODE", userCode).replaceAll("GEOORGCODE", geoOrgCode);
                U.log("getReportFilterLOV==SQL TO FETCH LOV VALUES :  " + lovSql);
                ps = c.prepareStatement(lovSql1);
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
//                        try {
//                            m.setRowId(rs.getString("rowid"));
//                        } catch (Exception e) {
//                            U.log(e);
//                        }
                        list.add(m);
                        json.setLocationList(list);
                        json.setLovHeading(HeadingOfLov);
                    } while (rs.next());
                }
            }
        } catch (Exception e) {
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    U.errorLog(e);
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
        U.log("getAutoCompleteData sql : " + sql);
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
                    U.log(ref_lov_where_clause + "==reflovsql===" + lovSql.toString());
                    String whereClauseString = "";
                    String[] refLovWhereclauseArray = ref_lov_where_clause.split("#");
                    if (whereClauseValue != null) {
                        String[] whereClauseValArray = whereClauseValue.split("#");
                        for (int i = 0; i < whereClauseValArray.length; i++) {
                            whereClauseString = whereClauseString + "" + refLovWhereclauseArray[i] + "'" + whereClauseValArray[i] + "'";
                        }
                        U.log("whereClauseString===" + whereClauseString);
                        lovSql.append(whereClauseString);
                    } else {
                        lovSql.append(ref_lov_where_clause);
                    }
                }

                if (dependent_where_clause != null) {
//                    lovSql.append(" " + ref_lov_where_clause);
                    U.log("LOV GENERATION SQL :  " + lovSql.toString());
                    U.log("dependent_where_clause : " + dependent_where_clause + "\nwhereClauseValArray :  " + whereClauseValue);
                    String whereClauseString = "";
                    String[] dependentWhereClauseArray = dependent_where_clause.split("#");
                    if (whereClauseValue != null) {
                        String[] whereClauseValArray = whereClauseValue.split("#");
                        for (int i = 0; i < whereClauseValArray.length; i++) {
//                               whereClauseString=dependent_where_clause.replace("#",whereClauseValArray[i] );
                            if (!whereClauseValArray[i].equals("null")) {
                                if (dependentWhereClauseArray[i].contains("like")) {
                                    whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i] + " '%" + whereClauseValArray[i] + "%' ";
                                }
                                if (dependentWhereClauseArray[i].contains("COL" + i)) {
                                    whereClauseString = whereClauseString.replaceAll("COL" + i, whereClauseValArray[i]);
                                } else {
                                    whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i] + " '" + whereClauseValArray[i] + "' ";
                                }
                            } else {
                                if (dependentWhereClauseArray[i].contains("COL" + i)) {
                                    whereClauseString = whereClauseString.replaceAll("COL" + i, whereClauseValArray[i]);
                                } else {
                                    whereClauseString = whereClauseString + "" + dependentWhereClauseArray[i] + " " + whereClauseValArray[i] + " ";
                                }
                            }
                        }
                        U.log("whereClauseString===" + whereClauseString);
                        lovSql.append(whereClauseString);
                    }
                }
                U.log("LOV GENERATION SQL :  " + lovSql.toString());
                if (order_clause != null) {
                    lovSql.append(" order by ").append(order_clause).append("");
                }
                U.log("getAutoCompleteData==SQL TO FETCH LOV VALUES :   " + lovSql);
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
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
        }
        WBSLocationJSON json = new WBSLocationJSON();
        json.setLocationList(list);
        json.setLovHeading(HeadingOfLov);
//        U.log("dataList = " + dataList);
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
