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
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import org.json.simple.JSONObject;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCDependentRowLogicDAO {

    Connection c;
    public LinkedHashMap<String, ArrayList<String>> defaultPopulateResultMap = new LinkedHashMap<String, ArrayList<String>>();

    public JDBCDependentRowLogicDAO(Connection c) {
        this.c = c;
        U u = new U(this.c);
    }

    public ValueClassModel getRowVal(String uniqueKey, String forWhichcolmn, String whereClauseValue, String geoOrgCode, String empCode) throws SQLException {

        ValueClassModel model = new ValueClassModel();
        if (forWhichcolmn.equals("STAX_CODE")) {

            model = findStaxCode(uniqueKey, forWhichcolmn, whereClauseValue);
            return model;
        }

        String sql = "";
        LOV obj_lov = new LOV();

        sql = "select * from LHSSYS_PORTAL_DATA_DSC_UPDATE where seq_no='" + uniqueKey + "' and column_name='" + forWhichcolmn + "'";

        PreparedStatement ps = null;
        ResultSet rs;

        String ref_lov_table_col = "";
        String ref_lov_where_clause = "";
        String order_clause = "";
        String column_select_list_value = "";
        String dependent_row_logic = "";
        String dependent_where_clause = "";
        U.log("get required value SQL : " + sql);
        try {
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                U.log("dependent_row_logic===>>" + dependent_row_logic);
                ref_lov_table_col = rs.getString("ref_lov_table_col");
                ref_lov_where_clause = rs.getString("ref_lov_where_clause");
                order_clause = rs.getString("order_clause");
                column_select_list_value = rs.getString("column_select_list_value");
                dependent_row_logic = rs.getString("dependent_row_logic");
                dependent_where_clause = rs.getString("dependent_where_clause");
                obj_lov.setREF_LOV_TABLE_COL(ref_lov_table_col);

                U.log("dependent_row_logic===>>" + dependent_row_logic);

                String lovSql = "";

                if (dependent_row_logic != null) {
                    if (dependent_row_logic.equals("=")) {
                    } else {
                        lovSql = lovSql.concat(dependent_row_logic);
                    }
                    U.log("lovSql BEFORE ADDING whereClauseValue : " + lovSql);
                    if (lovSql.contains("whereClauseValue")) {
                        String aa = "'" + whereClauseValue + "'";
                        U.log("whereClauseValue  : " + aa);
                        lovSql = lovSql.replaceAll("whereClauseValue", aa);
                    } else {
                        if (dependent_where_clause == null) {
                            U.log("dependent_where_clause===" + dependent_where_clause);
                            if (lovSql.contains("col")) {
                                String[] val = whereClauseValue.split("#");
                                for (int i = 0; i < val.length; i++) {
                                    lovSql = lovSql.replace("'col" + i + "'", "'" + val[i] + "'");
                                }
                            } else {
                                lovSql = lovSql.concat("'" + whereClauseValue + "'");
                            }
                        } else if (dependent_where_clause != null && !dependent_where_clause.contains("COL")) {
                            lovSql = lovSql.concat("'" + whereClauseValue + "'");
                        }
                    }
                    U.log("lovSql AFTER ADDING whereClauseValue ::: " + lovSql);
                }

                if (dependent_where_clause != null && dependent_row_logic != null) {
                    if (dependent_row_logic.equals("=")) {
                    } else {
                        lovSql = lovSql.concat(" " + dependent_where_clause);
                    }

                    U.log("LOVSQL WITH dependent_where_clause SQL  : " + lovSql);
                    U.log("dependent_where_clause : " + dependent_where_clause + "\n        whereClauseValArray : " + whereClauseValue);
                    String whereClauseString = "";
//                    String[] dependentWhereClauseArray = dependent_where_clause.split("AND");
                    String[] dependentWhereClauseArray = dependent_where_clause.split("#");
                    if (dependent_where_clause.contains("= #")) {
                        if (whereClauseValue != null) {
                            String[] whereClauseValArray = whereClauseValue.split("#");
                            for (int i = 0; i < whereClauseValArray.length; i++) {
                                if (!whereClauseValArray[i].equals("null")) {
//                                whereClauseString = whereClauseString + " AND " + dependentWhereClauseArray[i].replace("#", whereClauseValArray[i]);
                                    if (i == 0) {
                                        if (dependentWhereClauseArray[i].contains("#")) {
                                            whereClauseString = whereClauseString + dependentWhereClauseArray[i].replace("#",
                                                    whereClauseValArray[i].toUpperCase());
                                        } else {
                                            whereClauseString = whereClauseString + dependentWhereClauseArray[i].replace("=",
                                                    "=" + whereClauseValArray[i].toUpperCase());
                                        }
                                    } else {
                                        if (dependentWhereClauseArray[i].contains("#")) {
                                            whereClauseString = whereClauseString + " AND " + dependentWhereClauseArray[i].replace("#",
                                                    whereClauseValArray[i].toUpperCase());
                                        } else {
                                            whereClauseString = whereClauseString + " AND " + dependentWhereClauseArray[i].replace("=",
                                                    "=" + whereClauseValArray[i].toUpperCase());
                                        }
                                    }
                                } else {
                                    if (dependentWhereClauseArray[i + 1].contains("like")) {
                                        U.log("\n\nLIKe dependentWhereClauseArray[" + i + 1 + "]==" + dependentWhereClauseArray[i + 1]);
                                        whereClauseString = whereClauseString + " AND " + dependentWhereClauseArray[i + 1].replace("#", "");
                                    } else {
                                        whereClauseString = whereClauseString + " AND " + dependentWhereClauseArray[i + 1]
                                                .replace("'#'", whereClauseValArray[i]);
                                    }
                                }
                                U.log("whereClauseString===" + i + "==" + whereClauseString);
                            }
                            U.log("whereClauseString : " + whereClauseString);
                            lovSql = whereClauseString;
                            U.log("lovSql AFTER ADDING whereClauseValue : " + lovSql);
                        }
                    } else {
                        if (whereClauseValue != null) {
                            String[] whereClauseValArray = whereClauseValue.split("#");
                            U.log("whereClauseValArray.length : " + whereClauseValArray.length);
                            for (int i = 0; i < whereClauseValArray.length; i++) {
                                dependent_where_clause = dependent_where_clause.replaceAll("COL" + i, whereClauseValArray[i]);
                                dependent_where_clause = dependent_where_clause.replaceAll("GEOORGCODE", geoOrgCode);
                                dependent_where_clause = dependent_where_clause.replaceAll("EMPCODE", empCode);
                            }
                            U.log("dependent_where_clause 2 AFTER REPLACING VALUES : " + dependent_where_clause);
                            if (dependent_row_logic.equals("=")) {
                                lovSql = dependent_where_clause;
                            } else {
                                lovSql = dependent_row_logic.concat(" " + dependent_where_clause);
                            }
                        }
                    }
                }

                U.log("Final QUERY:-" + lovSql);
                U.log("WHERE CLAUSE ARRAY == >"+whereClauseValue);

                if (lovSql != null & lovSql.contains("get_gst_item_rate")) {
                    boolean isIgstflag = true;
                    lovSql = lovSql.replace("'" + whereClauseValue + "'", "");
                    String arr[] = whereClauseValue.split("#");

                    /*
                     whereClauseValue='IG06#10921#7216#FG0006006';
                     whereClauseValue=ENTITYCODE#DeliveryToslno#gstcode#itemcode#accCode
                     */
                    lovSql = lovSql.replace("ENTITYCODE", arr[0]);
                    lovSql = lovSql.replace("DELIVERYTOSLNO", arr[1]);
                    U.log("\narr[5]=" + arr[5] + "\n");
                    if (arr[2] == null || arr[2].equalsIgnoreCase("null")) {
                        U.log("\nGST_CODE=" + arr[2] + "\n");
                        ps = c.prepareStatement("select t.gst_code from item_mast t where t.item_code ='" + arr[3] + "'");
                        rs = ps.executeQuery();
                        if (rs != null && rs.next()) {
                            arr[2] = rs.getString(1);
                        }
                    }
                    lovSql = lovSql.replace("GSTCODE", arr[2]);
                    lovSql = lovSql.replace("ITEMCODE", arr[3]);
                    lovSql = lovSql.replace("ACCCODE", arr[4]);
//                    U.log("alert 1");
                    /*
                    set rateid= igst_rate/cgst_rate/sgst_rate
                    if(stax_code='IGST' then tax_rate1 value should be calculated using igst_rate)
                    if(stax_code='CGST+SGST' then tax_rate1=cgst_rate and tax_rate=sgst_rate value should be calculated using cgst_rate/sgst_rate in function)
                     */
                    JSONObject gstViewJson = new JSONObject();
                    try {

                        PreparedStatement viewGstPs = c.prepareStatement("select * from VIEW_APP_STAX_CODE_COLUMN");
                        ResultSet viewStaxRs = viewGstPs.executeQuery();
                        while (viewStaxRs != null && viewStaxRs.next()) {
                            gstViewJson.put(viewStaxRs.getString(2), viewStaxRs.getString(1));
                        }
                        System.out.println("GST VIEW: - ");
                        System.out.println(gstViewJson.toString());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    System.out.println("GST: " + gstViewJson.get(arr[5]).toString());
//                    if (arr[5].contains("IG06") || arr[5].contains("IGST") || arr[5].contains("GS01")) {
                    if (gstViewJson.get(arr[5]).toString().equalsIgnoreCase("IGST")) {
                        U.log("forWhichcolmn===>>" + forWhichcolmn);
                        if (forWhichcolmn.equalsIgnoreCase("tax_rate1")) {
                            lovSql = lovSql.replace("rateid", "igst_rate");
                        }
                        if (forWhichcolmn.equalsIgnoreCase("tax_rate")) {
                            isIgstflag = false;
                        }
                    }
//                    if (arr[5].contains("SG04") || arr[5].contains("SGST")) {
                    if (gstViewJson.get(arr[5]).toString().equalsIgnoreCase("SGST")) {
                        isIgstflag = true;
                        if (forWhichcolmn.equalsIgnoreCase("tax_rate")) {
                            lovSql = lovSql.replace("rateid", "cgst_rate");
                        } else {
                            lovSql = lovSql.replace("rateid", "sgst_rate");
                        }
                    }

                    U.log(" QUERY:-" + lovSql);
                    if (isIgstflag) {
                        ps = c.prepareStatement(lovSql);
                        rs = ps.executeQuery();
                    }
                } else {

                    if (lovSql.length() > 1) {
                        ps = c.prepareStatement(lovSql);
                        rs = ps.executeQuery();
                    }
                }
                ResultSetMetaData rsmd = null;
                int columnCount = 0;
                if (rs != null) {
                    rsmd = rs.getMetaData();
                    columnCount = rsmd.getColumnCount();
                }
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
            U.errorLog(e);
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

        get_dependent_value_querySQL = "select * from LHSSYS_PORTAL_DATA_DSC_UPDATE where seq_no='" + uniqueKey + "' and column_name='" + forWhichcolmn + "'";
        U.log(" get_dependent_value_querySQL :" + get_dependent_value_querySQL);
        PreparedStatement ps = null;
        ResultSet rs;
        String dependent_column_name = "";
        String lovSql = "";
//        U.log("get required value in selfDependantRowValue SQL : " + get_dependent_value_querySQL);
        try {
            ps = c.prepareStatement(get_dependent_value_querySQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                dependent_column_name = rs.getString("dependent_column_name");
                lovSql = rs.getString("validate_dependent_columns");
                String dependent_column_nameArr[] = null;
                int dependent_column_nameArrLength = 0;
                if (dependent_column_name != null && lovSql != null) {
                    if (dependent_column_name.contains("#")) {
                        dependent_column_nameArr = dependent_column_name.split("#");
                        dependent_column_nameArrLength = dependent_column_nameArr.length;
                    }

                    whereClauseValue = whereClauseValue.replaceAll("~~", "#");
//                    U.log("get_dependent_value_query : " + lovSql);
                    U.log("whereClauseValue : " + whereClauseValue);
                    if (lovSql.contains("~~")) {
                        lovSql = lovSql.replace("'~~'", "'" + whereClauseValue + "'");
                    } else if (whereClauseValue.contains("~")) {
                        String[] whereClauseValArray = whereClauseValue.split("~");
                        for (int i = 0; i < whereClauseValArray.length; i++) {
                            lovSql = lovSql.replaceAll("'COL" + i + "'", "'" + whereClauseValArray[i].trim() + "'");
                        }
                    } else if (whereClauseValue.contains("#") || lovSql.contains("COL0")) {
                        String[] whereClauseValArray = whereClauseValue.split("#");
                        for (int i = 0; i < whereClauseValArray.length; i++) {
                            lovSql = lovSql.replaceAll("'COL" + i + "'", "'" + whereClauseValArray[i].trim() + "'");
                        }
                    } else {
                        lovSql = lovSql.concat("'" + whereClauseValue.trim() + "'");
                    }
                    U.log("GET DEPENDENT VALUE SQL : " + lovSql);
                    ps = c.prepareStatement(lovSql);
                    rs = ps.executeQuery();
                    if (rs != null && rs.next()) {
                        for (int i = 0; i < dependent_column_nameArrLength; i++) {
                            DependentRowResponseModel model = new DependentRowResponseModel();
                            model.setValue(rs.getString(i + 1));
                            model.setColumnName(dependent_column_nameArr[i]);
                            model.setCode("");
                            list.add(model);
                        }
                        model1.setListDependentValue(list);
                        return model1;
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
                        U.log("ERROR IN selfDependantRowValue");
                        return model1;
                    }
                }
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
        return model1;
    }

    public ValidateValueModel validateValue(String SeqNo, String colSLNO, String valueToValidate) {

        PreparedStatement ps = null;
        ResultSet rs;
        String ValidatedMsg = "";
        String getValidationQuerySQL = "";
        String valueValidationSQL = "";

        ValidateValueModel model = new ValidateValueModel();
        try {
            getValidationQuerySQL = "SELECT T.COLUMN_VALIDATE FROM LHSSYS_PORTAL_DATA_DSC_UPDATE T WHERE T.SEQ_NO = '"
                    + SeqNo + "' AND T.SLNO = '" + colSLNO + "'";
            U.log("getValidationQuerySQL : " + getValidationQuerySQL);
            ps = c.prepareStatement(getValidationQuerySQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                valueValidationSQL = rs.getString(1);
                if (valueValidationSQL != null) {
                    U.log("valueValidationSQL : " + valueValidationSQL);
                    if (valueValidationSQL.contains("~~")) {
                        String valueValidationSQLArr[] = valueValidationSQL.split("~~");
                        valueValidationSQL = valueValidationSQLArr[0];
                    } else {
                        valueValidationSQL = valueValidationSQL;
                    }
                    U.log("valueToValidate : " + valueToValidate);
                    String valueValidationArr[] = valueToValidate.split(",");
                    for (int i = 0; i < valueValidationArr.length; i++) {
                        valueValidationSQL = valueValidationSQL.replaceAll("'valueToValidate" + i + "'", "'" + valueValidationArr[i] + "'");
                    }
                    U.log("valueValidationSQL after replacing : " + valueValidationSQL);
                    ps = c.prepareStatement(valueValidationSQL);
//                    ps.executeUpdate();
                    rs = ps.executeQuery();
                    if (rs != null && rs.next()) {
                        model.setValidatedMsg(rs.getString(1));
                    }
                } else {
                    U.log("ERROR IN VALUE OF valueValidationSQL");
                }
            } else {
                U.log("ERROR WHILE FETCHING valueValidationSQL");
            }
        } catch (SQLException e) {
            U.errorLog(e);
            ValidatedMsg = e.getMessage();
            String ValidatedMsgArr[] = ValidatedMsg.split(":");
            ValidatedMsg = ValidatedMsgArr[1].trim();
            String ValidatedMsgArr1[] = ValidatedMsg.split("~");
            ValidatedMsg = ValidatedMsgArr1[0];
            model.setValidatedMsg(ValidatedMsg);
            U.errorLog("ValidatedMsg : " + ValidatedMsg);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    U.errorLog(e);
                }
            }
        }
        return model;
    }

    public DetailInfoModel getDetailInformation(String uniqueKey, String forWhichcolmn, String whereClauseValue) throws SQLException {

        String get_dependent_value_querySQL = "select * from LHSSYS_PORTAL_DATA_DSC_UPDATE where seq_no='"
                + uniqueKey + "' and column_name='" + forWhichcolmn + "'";
        DetailInfoModel json = new DetailInfoModel();
        PreparedStatement ps = null;
        ResultSet rs;
        String lovSql = "";
        U.log("get required value in selfDependantRowValue SQL : " + get_dependent_value_querySQL);
        try {
            ps = c.prepareStatement(get_dependent_value_querySQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                lovSql = rs.getString("validate_dependent_columns");
                whereClauseValue = whereClauseValue.replaceAll("~~", "#");
                U.log("get_dependent_value_query : " + lovSql);
                U.log("whereClauseValue : " + whereClauseValue);
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
                U.log("GET DETAILED INFORMATION SQL : " + lovSql);
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

    public ValueClassModel findStaxCode(String uniqueKey, String forWhichcolmn, String whereClauseValue) {
        String addressString = "";
        ValueClassModel model = new ValueClassModel();
        try {
            String sql = "select * from LHSSYS_PORTAL_DATA_DSC_UPDATE where seq_no='" + uniqueKey + "' and column_name='" + forWhichcolmn + "'";

            PreparedStatement ps = null;
            ResultSet rs;

            String order_clause = "";
            String dependent_row_logic = "";
            String dependent_where_clause = "";
            U.log("get required value SQL : " + sql);

            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {

                order_clause = rs.getString("order_clause");
                dependent_row_logic = rs.getString("dependent_row_logic");
                dependent_where_clause = rs.getString("dependent_where_clause");

                String lovSql = "";
            }
            String accyear = accYear();

//            U.log("dependent_where_clause==>" + dependent_where_clause);
//            U.log("whereClauseValue==>" + whereClauseValue);
            if (dependent_row_logic.contains("COL")) {
                String[] val = whereClauseValue.split("#");
                System.out.println("VAL111================================================="+ whereClauseValue);
                for (int i = 0; i < val.length; i++) {
                    dependent_row_logic = dependent_row_logic.replace("COL" + i, val[i]);
                }
            }
            if (dependent_where_clause.contains("COL")) {
                System.out.println("VAL222================================================="+ whereClauseValue);
                String[] val = whereClauseValue.split("#");
                for (int i = 0; i < val.length; i++) {
//                    U.log("===>" + "COL" + i);
                    if (dependent_where_clause.contains("COL" + i)) {
                        dependent_where_clause = dependent_where_clause.replace("COL" + i, val[i]);
                    } else {
                        if (addressString.length() > 0) {
                            addressString = addressString + "#" + val[i];
                        } else {
                            addressString = val[i];
                        }
                    }
                }
            }
            dependent_row_logic = dependent_row_logic.replace("ACCYEAR", accyear);
            dependent_where_clause = dependent_where_clause.replace("ACCYEAR", accyear);
//               U.log("dependent_where_clause AFTER REPLACE="+dependent_where_clause);

            //for inclause
            if (dependent_row_logic.contains("INCLAUSE")) {
                try {
                    System.out.println("INCLAUSE SQL--------> " + dependent_where_clause);
                    PreparedStatement ps1 = c.prepareStatement(dependent_where_clause);
                    ResultSet rs1 = ps1.executeQuery();
                    if (rs1 != null && rs1.next()) {
                        dependent_where_clause = rs1.getString(1);
                        U.log("INCLAUSE result==>" + dependent_where_clause);
                        if (dependent_where_clause != null) {
                            dependent_where_clause = "'" + dependent_where_clause.replaceAll(",", "','") + "'";
                            dependent_row_logic = dependent_row_logic.replace("INCLAUSE", dependent_where_clause);
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
//               U.log("STAX_CODE="+dependent_row_logic);
            U.log("==>>" + addressString);
            String[] fromToAdd = addressString.split("#");
            String fromstate = null;
            String tostate = null;
            try {
                if (fromToAdd.length == 2) {
                    System.out.println("State Query--> " + "select state_code from address_mast where slno=" + fromToAdd[0] + " or slno= " + fromToAdd[1]);
                    PreparedStatement ps1 = c.prepareStatement("select state_code from address_mast where slno=" + fromToAdd[0] + " or slno= " + fromToAdd[1]);

                    ResultSet rs1 = ps1.executeQuery();
                    if (rs1 != null && rs1.next()) {
                        fromstate = rs1.getString(1);
                        if (rs1 != null && rs1.next()) {
                            tostate = rs1.getString(1);
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            String ISSAMESTATE = "S";

            System.out.println("FROM STATE : " + fromstate);
            System.out.println("TO STATE : " + tostate);

            if (fromstate != null && fromstate.equals(tostate)) {
                ISSAMESTATE = "S";
            } else {
                ISSAMESTATE = "O";
            }
            dependent_row_logic = dependent_row_logic.replaceAll("ISSAMESTATE", ISSAMESTATE);

            U.log("STAX_CODE=" + dependent_row_logic);

            try {
                PreparedStatement ps1 = c.prepareStatement(dependent_row_logic);
                ResultSet rs1 = ps1.executeQuery();
                if (rs1 != null && rs1.next()) {
                    if (rs1.getString(1) != null) {
                        model.setCode(rs1.getString(1).split("~")[1]);
                        model.setValue(rs1.getString(1).split("~")[0]);
                        if (rs1.getString(1).contains("#")) {
                            model.setValue(rs1.getString(1));
                            model.setCode(null);
                        }

                    }
                }
            } catch (Exception e) {
                U.errorLog("\nERROR message=>>" + e.getMessage());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return model;
    }

    public String accYear() {
        String currentAccYear = "";

        try {

            String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE \n"
                    + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )\n"
                    + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
            U.log("getAccYearSQL : " + getAccYearSQL);

            PreparedStatement accYearStm = c.prepareStatement(getAccYearSQL);
            ResultSet accYearRS = accYearStm.executeQuery();
            if (accYearRS != null && accYearRS.next()) {
                currentAccYear = accYearRS.getString(1);
                U.log("currentAccYear : " + currentAccYear);
                if (currentAccYear == null) {
                    U.log("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return currentAccYear;
    }
}
