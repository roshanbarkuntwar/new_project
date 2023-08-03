/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.DependentRowResponseModel;
import com.lhs.EMPDR.Model.DetailInfoModel;
import com.lhs.EMPDR.Model.ListOfDependentRowValueModel;
import com.lhs.EMPDR.Model.ValidateValueModel;
import com.lhs.EMPDR.Model.ValueClassModel;
import com.lhs.EMPDR.utility.LOV;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import org.postgresql.jdbc4.Jdbc4ResultSetMetaData;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCDependentRowLogicDAO {

    Connection c;
    public LinkedHashMap<String, ArrayList<String>> defaultPopulateResultMap = new LinkedHashMap<String, ArrayList<String>>();

    public JDBCDependentRowLogicDAO(Connection c) {
        this.c = c;
    }

    public ValueClassModel getRowVal(String uniqueKey, String forWhichcolmn, String whereClauseValue) throws SQLException {

        String sql = "";
        LOV obj_lov = new LOV();
        ValueClassModel model = new ValueClassModel();
        String sqlData = "";
        sql = "select * from LHSSYS_PORTAL_DATA_DSC_UPDATE where seq_no='" + uniqueKey + "' and column_name='" + forWhichcolmn + "'";

        PreparedStatement ps = null;
        ResultSet rs;

        String ref_lov_table_col = "";
        String ref_lov_where_clause = "";
        String order_clause = "";
        String column_select_list_value = "";
        String dependent_row_logic = "";
        String dependent_where_clause = "";
        try {
            sqlData = sqlData + "\n----------Get Dependent Row Sql Query ----------\n" + sql;
            System.out.println("sql-->" + sql);
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {

                ref_lov_table_col = rs.getString("ref_lov_table_col");
                ref_lov_where_clause = rs.getString("ref_lov_where_clause");
                order_clause = rs.getString("order_clause");
                column_select_list_value = rs.getString("column_select_list_value");
                dependent_row_logic = rs.getString("dependent_row_logic");
                dependent_where_clause = rs.getString("dependent_where_clause");
                obj_lov.setREF_LOV_TABLE_COL(ref_lov_table_col);

                String lovSql = "";

                if (dependent_row_logic != null) {
                    lovSql = lovSql.concat(dependent_row_logic);
//                    System.out.println("lovSql BEFORE ADDING whereClauseValue : " + lovSql);
                    if (lovSql.contains("whereClauseValue")) {
                        String aa = "'" + whereClauseValue + "'";
                        System.out.println("whereClauseValue  : " + aa);
                        lovSql = lovSql.replaceAll("whereClauseValue", aa);
                    } else {
                        lovSql = lovSql.concat("'" + whereClauseValue + "'");
                    }
//                    System.out.println("lovSql AFTER ADDING whereClauseValue ::: " + lovSql);
                }

                if (dependent_where_clause != null) {
                    lovSql = lovSql.concat(dependent_where_clause);
//                    System.out.println("LOVSQL WITH dependent_where_clause SQL  : " + lovSql);
//                    System.out.println("dependent_where_clause : " + dependent_where_clause + "\n        whereClauseValArray : " + whereClauseValue);
                    String whereClauseString = "";
                    String[] dependentWhereClauseArray = dependent_where_clause.split("#");
                    if (dependent_where_clause.contains("= #")) {
                        if (whereClauseValue != null) {
                            String[] whereClauseValArray = whereClauseValue.split("#");
                            for (int i = 0; i < whereClauseValArray.length; i++) {
                                if (!whereClauseValArray[i].equals("null")) {
                                    if (i == 0) {
                                        whereClauseString = whereClauseString + dependentWhereClauseArray[i].replace("#",
                                                whereClauseValArray[i].toUpperCase());
                                    } else {
                                        whereClauseString = whereClauseString + " AND " + dependentWhereClauseArray[i].replace("#",
                                                whereClauseValArray[i].toUpperCase());
                                    }
                                } else {
                                    if (dependentWhereClauseArray[i + 1].contains("like")) {
                                        whereClauseString = whereClauseString + " AND " + dependentWhereClauseArray[i + 1].replace("#", "");
                                    } else {
                                        whereClauseString = whereClauseString + " AND " + dependentWhereClauseArray[i + 1]
                                                .replace("'#'", whereClauseValArray[i]);
                                    }
                                }
                            }
                            lovSql = whereClauseString;
                            System.out.println("lovSql AFTER ADDING whereClauseValue : " + lovSql);
                        }
                    } else {
                        if (whereClauseValue != null) {
                            String[] whereClauseValArray = whereClauseValue.split("\\#",-1);
                            for (int i = 0; i < whereClauseValArray.length; i++) {
                                dependent_where_clause = dependent_where_clause.replaceAll("'COL" + i+ "'", "'"+whereClauseValArray[i]+"'");
                            }
//                            System.out.println("dependent_where_clause 2 AFTER REPLACING VALUES : " + dependent_where_clause);
                            lovSql = dependent_where_clause;
                        }
                    }
                }
                System.out.println("Dependent_Row_Query -->" + lovSql);
                sqlData = sqlData + "\n----------Dependent Row Query ----------\n" + lovSql;
                ps = c.prepareStatement(lovSql);
                rs = ps.executeQuery();
                model.setSqlData(sqlData);
                ResultSetMetaData rsmd = rs.getMetaData();
                int columnCount = rsmd.getColumnCount();
                if (rs != null && rs.next()) {
                    do {
                        model.setValue(rs.getString(1));
                        if (columnCount > 1) {
                            model.setCode(rs.getString(2));
                        }
                        return model;
                    } while (rs.next());
                } else {
                    do {
                        model.setValue("");
                        if (columnCount > 1) {
                            model.setCode("");
                        }
                        return model;
                    } while (rs.next());
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("exception ---> " + e.getMessage());
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

    public ListOfDependentRowValueModel selfDependantRowValue(String uniqueKey, String forWhichcolmn, String whereClauseValue) throws SQLException {

        String get_dependent_value_querySQL = "";
        ListOfDependentRowValueModel model1 = new ListOfDependentRowValueModel();
        List<DependentRowResponseModel> list = new ArrayList<DependentRowResponseModel>();
        String sqlData = "";

        get_dependent_value_querySQL = "select * from LHSSYS_PORTAL_DATA_DSC_UPDATE where seq_no='" + uniqueKey + "' and column_name='" + forWhichcolmn + "'";
        sqlData = sqlData + "\n----------dependent value query SQL----------\n" + get_dependent_value_querySQL;
        PreparedStatement ps = null;
        ResultSet rs;
        String dependent_column_name = "";
        String lovSql = "";
        System.out.println("exception ---> 1");
        try {
            ps = c.prepareStatement(get_dependent_value_querySQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                dependent_column_name = rs.getString("dependent_column_name");
                lovSql = rs.getString("validate_dependent_columns");
                System.out.println("exception ---> 2" + lovSql);
                String dependent_column_nameArr[] = null;
                int dependent_column_nameArrLength = 0;
                if (dependent_column_name != null && lovSql != null) {
                    if (dependent_column_name.contains("#")) {
                        dependent_column_nameArr = dependent_column_name.split("#");
                        dependent_column_nameArrLength = dependent_column_nameArr.length;
                    }

                    whereClauseValue = whereClauseValue.replaceAll("~~", "#");
                    System.out.println("whereClauseValue : " + whereClauseValue);
                    if (lovSql.contains("~~")) {
                        lovSql = lovSql.replace("'~~'", "'" + whereClauseValue + "'");
                    } else if (whereClauseValue.contains("~")) {
                        String[] whereClauseValArray = whereClauseValue.split("~");
                        for (int i = 0; i < whereClauseValArray.length; i++) {
                            lovSql = lovSql.replaceAll("'COL" + i + "'", "'" + whereClauseValArray[i] + "'");
                        }
                    } else if (whereClauseValue.contains("#") || lovSql.contains("COL0")) {
                        String[] whereClauseValArray = whereClauseValue.split("#");
                        for (int i = 0; i < whereClauseValArray.length; i++) {
                            lovSql = lovSql.replaceAll("'COL" + i + "'", "'" + whereClauseValArray[i] + "'");
                        }
                    } else {
                        lovSql = lovSql.concat("'" + whereClauseValue + "'");
                    }
                    System.out.println("GET DEPENDENT VALUE SQL : " + lovSql);
                    sqlData = sqlData + "\n----------DEPENDENT VALUE SQL----------\n" + lovSql;
                    ps = c.prepareStatement(lovSql);
                    rs = ps.executeQuery();
                    ResultSetMetaData rsmd = rs.getMetaData();
                    if (rs != null && rs.next()) {
                        for (int i = 0; i < dependent_column_nameArrLength; i++) {
                            DependentRowResponseModel model = new DependentRowResponseModel();
                            String val1 = rs.getString(i + 1);
                            if (val1 != null && !val1.isEmpty()) {
                                if (val1.contains("~")) {
                                    String depVal[] = val1.split("~");
                                    model.setValue(depVal[1]);
                                    model.setCode(depVal[0]);
                                } else {
                                    model.setValue(val1);
                                    model.setCode("");
                                }
                            }
//                            model.setValue(rs.getString(i + 1));
                            if (rsmd.getColumnTypeName(i + 1).equalsIgnoreCase("NUMBER")) {
                                String val = rs.getString(i + 1);

                                if (val != null && !val.isEmpty()) {
                                    if (val.indexOf('.') == 0) {
                                        model.setValue("0" + val);
                                        model.setCode("");
                                    }

                                }
                            }

                            model.setColumnName(dependent_column_nameArr[i]);
//                            model.setCode("");
                            list.add(model);
                        }
                        model1.setListDependentValue(list);
                    } else {
                        for (int i = 0; i < dependent_column_nameArrLength; i++) {
                            DependentRowResponseModel model = new DependentRowResponseModel();
                            model.setValue("");
                            model.setColumnName(dependent_column_nameArr[i]);
                            model.setCode("");
                            list.add(model);
                        }
                        model1.setListDependentValue(list);
                        model1.setMessage("Data not available against given value.");
                        System.out.println("ERROR IN selfDependantRowValue");
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("exception ---> " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        model1.setSqlData(sqlData);
        return model1;
    }

    public ValidateValueModel validateValue(String SeqNo, String colSLNO, String valueToValidate) {

        PreparedStatement ps = null;
        ResultSet rs;
        String ValidatedMsg = "";
        String getValidationQuerySQL = "";
        String valueValidationSQL = "";
        String sqlData = "";

        ValidateValueModel model = new ValidateValueModel();
        try {
            getValidationQuerySQL = "SELECT T.COLUMN_VALIDATE FROM LHSSYS_PORTAL_DATA_DSC_UPDATE T WHERE T.SEQ_NO = '"
                    + SeqNo + "' AND T.SLNO = '" + colSLNO + "'";
            System.out.println("getValidationQuerySQL : " + getValidationQuerySQL);
            sqlData = sqlData + "\n----------Validation Query SQL----------\n" + getValidationQuerySQL;
            ps = c.prepareStatement(getValidationQuerySQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                valueValidationSQL = rs.getString(1);
                if (valueValidationSQL != null) {
//                    System.out.println("valueValidationSQL : " + valueValidationSQL);
                    if (valueValidationSQL.contains("~~")) {
                        String valueValidationSQLArr[] = valueValidationSQL.split("~~");
                        valueValidationSQL = valueValidationSQLArr[0];
                    } else {
                        valueValidationSQL = valueValidationSQL;
                    }
                    System.out.println("valueToValidate : " + valueToValidate);
                    String valueValidationArr[] = valueToValidate.split(",");
                    for (int i = 0; i < valueValidationArr.length; i++) {
                        valueValidationSQL = valueValidationSQL.replaceAll("'valueToValidate" + i + "'", "'" + valueValidationArr[i] + "'");
                    }
                    System.out.println("valueValidationSQL after replacing : " + valueValidationSQL);
                    sqlData = sqlData + "\n----------Validation SQL----------\n" + valueValidationSQL;
                    ps = c.prepareStatement(valueValidationSQL);
                    ps.executeUpdate();
                } else {
                    System.out.println("ERROR IN VALUE OF valueValidationSQL");
                }
            } else {
                System.out.println("ERROR WHILE FETCHING valueValidationSQL");
            }
        } catch (SQLException e) {
            ValidatedMsg = e.getMessage();
            String ValidatedMsgArr[] = ValidatedMsg.split(":");
            ValidatedMsg = ValidatedMsgArr[1].trim();
            String ValidatedMsgArr1[] = ValidatedMsg.split("~");
            ValidatedMsg = ValidatedMsgArr1[0];
            model.setValidatedMsg(ValidatedMsg);
            System.out.println("ValidatedMsg : " + ValidatedMsg);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }
        model.setSqlData(sqlData);
        return model;
    }

    public DetailInfoModel getDetailInformation(String uniqueKey, String forWhichcolmn, String whereClauseValue) throws SQLException {

        String get_dependent_value_querySQL = "select * from LHSSYS_PORTAL_DATA_DSC_UPDATE where seq_no='"
                + uniqueKey + "' and column_name='" + forWhichcolmn + "'";
        DetailInfoModel json = new DetailInfoModel();
        PreparedStatement ps = null;
        ResultSet rs;
        String lovSql = "";
        System.out.println("get required value in selfDependantRowValue SQL : " + get_dependent_value_querySQL);
        try {
            ps = c.prepareStatement(get_dependent_value_querySQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                lovSql = rs.getString("validate_dependent_columns");
                whereClauseValue = whereClauseValue.replaceAll("~~", "#");
                System.out.println("get_dependent_value_query : " + lovSql);
                System.out.println("whereClauseValue : " + whereClauseValue);
                if (lovSql.contains("~~")) {
                    lovSql = lovSql.replace("'~~'", "'" + whereClauseValue + "'");
                } else if (whereClauseValue.contains("~")) {
                    String[] whereClauseValArray = whereClauseValue.split("~");
                    for (int i = 0; i < whereClauseValArray.length; i++) {
                        lovSql = lovSql.replaceAll("'COL" + i + "'", "'" + whereClauseValArray[i] + "'");
                    }
                } else if (whereClauseValue.contains("#")) {
                    String[] whereClauseValArray = whereClauseValue.split("#");
                    for (int i = 0; i < whereClauseValArray.length; i++) {
                        lovSql = lovSql.replaceAll("'COL" + i + "'", "'" + whereClauseValArray[i] + "'");
                    }
                } else {
                    lovSql = lovSql.concat("'" + whereClauseValue + "'");
                }
                System.out.println("GET DETAILED INFORMATION SQL : " + lovSql);
                try {
                    ps = c.prepareStatement(lovSql);
                    rs = ps.executeQuery();
                    ResultSetMetaData md = rs.getMetaData();
                    int clCount = md.getColumnCount();
                    for (int i = 1; i <= clCount; i++) {
                        defaultPopulateResultMap.put(md.getColumnName(i), new ArrayList<String>());
                    }
                    if (rs != null && rs.next()) {
                        do {
                            for (int i = 1; i <= clCount; i++) {
                                defaultPopulateResultMap.get(md.getColumnName(i)).add(rs.getString(i));
                            }
                        } while (rs.next());
                    }
                    json.setDefaultPopulateData(defaultPopulateResultMap);
                    json.setStatus("success");
                    json.setMessage("");
                } catch (Exception e) {
                    json.setStatus("error");
                    json.setMessage("Data not available for selected value.");
                }
            }
        } catch (SQLException e) {
            json.setStatus("error");
            json.setMessage("Data not available for selected value.");
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return json;
    }
}
