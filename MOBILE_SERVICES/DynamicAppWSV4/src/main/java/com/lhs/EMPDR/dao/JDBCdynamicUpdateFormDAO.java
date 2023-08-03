/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.RecordInfoJSON;
import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCdynamicUpdateFormDAO {

    Connection connection;
    HashMap<String, String> values = new HashMap<String, String>();//col name,col value
    HashMap<String, String> DefaultValues = new HashMap<String, String>();//col name,col value
    HashMap<String, byte[]> imgMap = new HashMap<String, byte[]>();
    HashMap<String, byte[]> imgMap1 = new HashMap<String, byte[]>();

    HashMap<String, String> displayColList = new HashMap<String, String>();
    ArrayList<String> fileId = new ArrayList<String>();
    String table_name;
    String sysdate = null;
    String imgDataType = "LONG";
    String UPDATE_KEY[] = null;//use as a primary key
    HashMap<String, String> columnTableName = new HashMap<String, String>();
    String isAddonTempEntry = null;
    String ORDER_CLAUSE = null;
    String newFormInstance = "";

    StringBuilder COLUMN_NAME_STR = new StringBuilder();

    public JDBCdynamicUpdateFormDAO(Connection connection) {
        this.connection = connection;
        U u = new U(this.connection);
    }
    String USER_CODE = "";

    public RecordInfoJSON getRecordDetailForUpdateForm(String seqNo, String userCode, String updateKey, String acccode, String isAddonTempEntry) throws SQLException {
        Date sysdate = new Date();
        USER_CODE = userCode.toUpperCase();
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        list = getDetailOfEntry("LONG", seqNo, updateKey, userCode, acccode);
        System.out.println("UPDATE KEY 11111: " + updateKey);
        RecordInfoJSON json = new RecordInfoJSON();
        json.setRecordsInfo(list);
        json.setNewFormInstance(newFormInstance);
        return json;
    }

    public List<DyanamicRecordsListModel> getDetailOfEntry(String imgDataType, String seq_no, String updateKey, String userCode, String acccode) throws SQLException {
        imgDataType = "BLOB";
        USER_CODE = userCode.toUpperCase();
        this.imgDataType = imgDataType;

        COLUMN_NAME_STR = new StringBuilder();

        PreparedStatement ps = null;
        ResultSet rs = null;
        StringBuffer sql1 = new StringBuffer();
        String[] DefualtvlaueForDropDownSql = null;
        String newFormInstanceQuery = "";
        String EMPCODE = "";
        sql1.append("select u.*,TO_CHAR(sysdate, 'DD-MM-YYYY  HH24:MI:SS') as systemdate,t.dependent_next_entry_seq ,t.update_key, t.new_form_instance,t.order_clause orderby"
                + " from lhssys_portal_data_dsc_update u,lhssys_portal_table_dsc_update t where ");
        sql1.append("u.seq_no=" + seq_no + " and t.seq_no=" + seq_no + " and u.status!='F'  order by u.column_slno");
        U.log("sql query12121=" + sql1.toString());
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {
            ps = connection.prepareStatement(sql1.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {

                try {
                    PreparedStatement ps10 = connection.prepareStatement("SELECT EMP_CODE from user_mast where user_code = '" + USER_CODE + "'");
                    ResultSet rs10 = ps10.executeQuery();
                    if (rs10 != null && rs10.next()) {
                        EMPCODE = rs10.getString(1);
                    }
                    newFormInstanceQuery = rs.getString("new_form_instance");
                    if (newFormInstanceQuery != null && !newFormInstanceQuery.isEmpty() && !newFormInstanceQuery.equals("")) {
                        newFormInstanceQuery = newFormInstanceQuery.replace("'USER_CODE'", "'" + USER_CODE + "'").replace("'EMP_CODE'", "'" + EMPCODE + "'").replace("'ACCCODE'", "'" + acccode + "'");
                        System.out.println("newFormInstanceQuery: " + newFormInstanceQuery);
                        try {
                            PreparedStatement ps2 = connection.prepareStatement(newFormInstanceQuery);
                            ResultSet rsNewForm = ps2.executeQuery();
                            if (rsNewForm != null && rsNewForm.next()) {
                            } else {
                            }
                        } catch (Exception e) {
//                        U.log("New Form Instance Exception !!" + e.getMessage());
                            String ValidatedMsgArr[] = e.getMessage().split(":");
                            String ValidatedMsgArr1[] = ValidatedMsgArr[1].trim().split("ORA-");
                            newFormInstance = ValidatedMsgArr1[0].trim();
//                        System.out.println("newFormInstance 1" + newFormInstance);
                        }
                    } else {
                        newFormInstance = "T#OK";
                    }
                } catch (Exception e) {
//                    e.printStackTrace();
                    U.log("NEW FORM INSTANCE NOT FOUND..!");
                    newFormInstance = "T#OK";
                }

//                U.log("update_key : " + UPDATE_KEY);
                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    table_name = rs.getString("table_name");
                    if (this.isAddonTempEntry != null) {
                        table_name = isAddonTempEntry;
                    }
                    displayColList.put(rs.getString("column_name"), rs.getString("column_type"));
                    sysdate = rs.getString("systemdate");
                    String keyArr = rs.getString("update_key");
//                    System.out.println("keyArr =------------------> " + keyArr);
                    columnTableName.put(rs.getString("column_name"), rs.getString("table_name"));
//                    System.out.println("UPDATE_KEY : " + keyArr);
                    if (keyArr != null && !keyArr.isEmpty()) {
                        UPDATE_KEY = keyArr.split("#");
                    }

//                    U.log("update key1111===>" + UPDATE_KEY);
                    model.setColumn_desc(rs.getString("column_desc"));
                    model.setColumn_name(rs.getString("Column_name"));
                    model.setColumn_type(rs.getString("Column_type"));
                    model.setREF_LOV_TABLE_COL(rs.getString("Ref_lov_table_col"));
                    model.setData_type(rs.getString("COLUMN_MASTER_REF_FLAG"));// COLUMN_MASTER_REF_FLAG
                    model.setValidate_dependent_row_slno(rs.getString("VALIDATE_DEPENDENT_ROW_SLNO"));// VALIDATE_DEPENDENT_ROW_SLNO // for minlength of number  
                    //--------------------------------------------------------------------------------------
                    //for dependent row
                    if (rs.getString("dependent_row") != null) {
                        String dependentRowArray[] = rs.getString("dependent_row").split("#");

                        String dependentRowString = "";
                        for (int i = 0; i < dependentRowArray.length; i++) {
                            if (i != 0) {
                                dependentRowString = dependentRowString + "," + dependentRowArray[i];
                            } else {
                                dependentRowString = dependentRowString + dependentRowArray[i];
                            }
                        }
                        String sql = "select column_name, slno,column_default_value from LHSSYS_PORTAL_DATA_DSC_UPDATE where slno in \n"
                                + "(" + dependentRowString + ") and seq_no=" + seq_no;
                        U.log("sqldependent : " + sql);
                        String dependentRowColumn = rs.getString("dependent_row");
                        String[] queryDepArr = dependentRowColumn.split("#");
                        String[] queryDepArrVal = queryDepArr;
                        try {
                            PreparedStatement preparedStatement = connection.prepareStatement(sql);
                            ResultSet RS = preparedStatement.executeQuery();

                            int count = 0;
                            DefualtvlaueForDropDownSql = new String[queryDepArr.length + 1];
                            if (RS != null && RS.next()) {
                                do {
                                    for (int i = 0; i < queryDepArr.length; i++) {
                                        if (queryDepArr[i].equalsIgnoreCase(RS.getString("slno"))) {
                                            queryDepArrVal[i] = RS.getString("column_name");

                                            DefualtvlaueForDropDownSql[i] = RS.getString("column_default_value");
                                        }
                                    }
                                    if (count != 0) {
                                        dependentRowColumn = dependentRowColumn + "#" + RS.getString("column_name");
                                    } else {
                                        dependentRowColumn = RS.getString("column_name");
                                    }

//                                dependentRowColumn = dependentRowColumn.replaceAll(RS.getString("slno"), RS.getString("column_name"));
                                    count++;
                                } while (RS.next());
                            }
                        } catch (Exception e) {
                            U.errorLog("exception here..");
                            e.getMessage();

                        }

                        U.log("column catg :: " + rs.getString("Column_catg"));
                        String val = "";
                        for (int i = 0; i < queryDepArr.length; i++) {
                            if (i != 0) {
                                val = val + "#" + queryDepArrVal[i];
                            } else {
                                val = queryDepArrVal[i];
                            }
                        }
                        model.setDependent_row(val);
                    } else {
                        model.setDependent_row(rs.getString("dependent_row"));
                    }
                    //-----------------END-----------------------------
                    //-----------------------------------------------------------------------------------------------------------
//                    U.log("column catg :: "+ rs.getString("Column_catg"));
                    String column_catg = (rs.getString("Column_catg"));
                    if (column_catg != null) {
                        ps = connection.prepareStatement("select " + column_catg + " columnHeading from dual");
                        U.log("column catg query :" + "select " + column_catg + " columnHeading from dual");
                        ResultSet rs1 = ps.executeQuery();
                        if (rs1 != null && rs1.next()) {
                            do {
                                column_catg = rs1.getString("columnHeading");

                            } while (rs1.next());
                        }
                    } else {
                        column_catg = "";
                    }

                    model.setColumn_catg(column_catg);
                    model.setColumn_validate(rs.getString("column_validate"));
                    model.setValidate_dependent_columns(rs.getString("VALIDATE_DEPENDENT_COLUMNS"));

                    if (rs.getString("Column_default_value") != null && rs.getString("status").contains("D")) {
                        try {
                            U.log("col==>" + rs.getString("column_name"));
                            String sql = rs.getString("Column_default_value").replaceAll("'ACCCODE'", "'" + acccode + "'");
                            System.out.println("Query --- " + sql);
                            PreparedStatement pst = connection.prepareStatement(sql);
                            ResultSet rst = pst.executeQuery();
                            if (rst != null && rst.next()) {
                                model.setValue(rst.getString(1));
                            }
                        } catch (Exception ex) {
                            ex.printStackTrace();
                        }
                    } else {
                        model.setColumn_default_value(rs.getString("Column_default_value"));

                    }
                    model.setColumn_size(rs.getString("Column_size"));
                    model.setEntry_by_user(rs.getString("Entry_by_user"));
                    model.setNullable(rs.getString("Nullable"));
                    model.setStatus(rs.getString("Status"));
                    model.setTable_name(rs.getString("Table_name"));
                    model.setUpdation_process(rs.getString("Updation_process"));
                    model.setItem_help_property(rs.getString("item_help_property"));
                    model.setREF_LOV_WHERE_CLAUSE(rs.getString("REF_LOV_WHERE_CLAUSE"));
                    model.setColumn_select_list_value(rs.getString("column_select_list_value"));
                    model.setDependent_row_logic(rs.getString("Dependent_row_logic"));
                    model.setFrom_value(rs.getString("From_value"));
                    model.setTo_value(rs.getString("To_value"));
                    model.setEditor_flag(rs.getString("Editor_flag"));
                    model.setExcel_upload(rs.getString("Excel_upload"));
                    model.setDecimal_digit(rs.getString("Decimal_digits"));
                    model.setTool_tip(rs.getString("Tool_tip"));
                    model.setDependent_nulable_logic(rs.getString("dependent_nulable_logic"));
                    model.setHeading_flag(rs.getString("heading_flag"));
                    model.setAuto_calculation(rs.getString("auto_calculation"));
                    model.setDependent_next_entry_seq(rs.getString("dependent_next_entry_seq"));
                    model.setSession_column_flag(rs.getString("session_column_flag"));
                    model.setSLNO(rs.getString("slno"));
                    //for drop down
                    if (rs.getString("item_help_property").contains("H") || rs.getString("item_help_property").contains("D")) {
                        String selectquery = rs.getString("column_select_list_value");
                        U.log("column name:: " + rs.getString("column_name") + "  select query::::" + selectquery);
                        if (selectquery != null) {
                            selectquery = selectquery.replace("USER_CODE", userCode);
                            if (acccode != null) {
                                selectquery = selectquery.replace("ACCCODE", acccode);
                            }
                        }
                        if (selectquery != null && !selectquery.toLowerCase().contains("select")) {
                            selectquery = "select " + selectquery + " from dual";
                        } else {
                            //for set col0,col1,col2 values
                            //---------------------------------------------------------------------------------------------------------
                            try {
                                U.log("select query---" + selectquery);
                                if (selectquery != null && selectquery.contains("USER_CODE")) {
                                    selectquery = selectquery.replace("USER_CODE", USER_CODE);
                                }

                                if (selectquery != null && selectquery.toLowerCase().contains("select")) {
                                    String whereClauseValue = "";

                                    //ACC_year alwyas be in last position in where condition
                                    String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE \n"
                                            + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )\n"
                                            + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
                                    U.log("getAccYearSQL : " + getAccYearSQL);
                                    String currentAccYear = "";

                                    PreparedStatement accYearStm = connection.prepareStatement(getAccYearSQL);
                                    ResultSet accYearRS = accYearStm.executeQuery();
                                    if (accYearRS != null && accYearRS.next()) {
                                        currentAccYear = accYearRS.getString(1);
                                        U.log("currentAccYear : " + currentAccYear);
                                        if (currentAccYear == null) {
                                            U.log("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                                        } else {
                                            if (DefualtvlaueForDropDownSql != null) {
                                                DefualtvlaueForDropDownSql[DefualtvlaueForDropDownSql.length - 1] = currentAccYear;
                                            }

                                        }
                                    } else {
                                        U.log("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                                    }

                                    //END FIND ACC_YEAR
                                    if (DefualtvlaueForDropDownSql != null) {

                                        for (int i = 0; i < DefualtvlaueForDropDownSql.length; i++) {
//                                      U.log("COL" + i+"==DefualtvlaueForDropDownSql==" + DefualtvlaueForDropDownSql[i]);
                                            //Aniket
                                            selectquery = selectquery.replaceAll("COL" + i, DefualtvlaueForDropDownSql[i] != null ? DefualtvlaueForDropDownSql[i] : acccode);
                                        }
                                    }

                                    selectquery = selectquery.replaceAll("ACCCODE", acccode);
                                    if (DefualtvlaueForDropDownSql != null) {
                                        selectquery = selectquery.replaceAll("STAXCODE", DefualtvlaueForDropDownSql[0]);
                                    }

                                } else {
                                    selectquery = "select " + selectquery + " from dual";
                                }
                                U.log("Dropdown selectQuery=" + selectquery);
                            } catch (Exception e) {
//                                System.out.println("Error--> " + );
//                                e.printStackTrace();
                            }
                        }

//                        U.log(rs.getString("column_name") + "=for dropDown==>" + selectquery);
                        PreparedStatement ps2 = connection.prepareStatement(selectquery);
                        try {
                            ResultSet rs2 = ps2.executeQuery();
                            if (rs2 != null && rs2.next()) {

                                U.log("\n***" + rs2.getString(1) + "***\n");
                                model.setDropdownVal(rs2.getString(1));
                                String dropDownListStr = rs2.getString(1);
                                //Display Selected First value of dropdown
                                if (!dropDownListStr.isEmpty() && !dropDownListStr.equals("")) {
//                                    if (dropDownListStr.trim().length() > 1) {
//                                        model.setValue(dropDownListStr.split("#")[0].split("~")[0]);
//                                    }
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                    } else if (rs.getString("item_help_property") != null && rs.getString("item_help_property").contains("AS")) {
                        JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(connection);
                        String autoCompleteString = dao.getAutoCompleteData(seq_no, rs.getString("Column_name"), "", userCode);
                        model.setDropdownVal(autoCompleteString);
                    }
                    if (rs.getString("Column_DESC").toLowerCase().contains("Entry Format Seq".toLowerCase())) {
                        model.setValue(rs.getString("Column_default_value"));
                    } else if (rs.getString("Column_default_value") != null && !rs.getString("column_name").contains("COL4")) {
                        String defaultValue = rs.getString("Column_default_value");

                        if (defaultValue.contains("sysdate")) {
                            model.setValue(sysdate);
                        } else if (defaultValue.contains("USER_CODE")) {
                            System.out.println("user_code========= " + USER_CODE + "defaultValue====" + defaultValue);
                            model.setValue(USER_CODE);
                        }
//                        else if(defaultValue.contains("ACCCODE")){
//                            U.log("ACC_CODE===>"+acccode);
//                            model.setValue(acccode);
//                        }
                    }
                    String status = rs.getString("Status");
//                    U.log("status of column==>" + rs.getString("column_desc") + "<==>" + rs.getString("Status"));
                    if (rs.getString("Status") != null && !status.contains("F")) {
                        if (!status.contains("D") && !rs.getString("updation_process").toUpperCase().contains("N")) {
                            String columnName = rs.getString("column_name");
                            if (rs.getString("column_type").toUpperCase().equalsIgnoreCase("DATETIME")) {
                                columnName = "TO_CHAR(" + rs.getString("column_name") + ",'DD-MM-YYYY HH24:MI:SS') " + rs.getString("column_name");
                            }

                            if (rs.getString("column_type").toUpperCase().equalsIgnoreCase("DATE")) {
                                columnName = "TO_CHAR(" + rs.getString("column_name") + ",'DD-MM-YYYY') " + rs.getString("column_name");
                            }

//                            U.log("column name str");
                            if (rs.getString("column_type").toUpperCase().equalsIgnoreCase("LATLONG")) {
                                // System.out.println("LATLONG");
                            } else if (rs.getString("FIELD_FONT_NAME") != null && !rs.getString("FIELD_FONT_NAME").equals("")) {
                                String function = rs.getString("FIELD_FONT_NAME");
                                COLUMN_NAME_STR.append("(SELECT ").append(function).append(" FROM DUAL) ||'~~'|| ").append(columnName).append(" ").append(columnName).append(",");
                            } else if (rs.getString("column_description") != null && rs.getString("column_description").equalsIgnoreCase("N")) {
                                COLUMN_NAME_STR.append("'" + rs.getString("Column_default_value") + "'" + columnName).append(",");
                            } else {
                                COLUMN_NAME_STR.append(columnName).append(",");
                            }
                        }
                        list.add(model);
                    }
                } while (rs.next());
                U.log("order clause  === " + ORDER_CLAUSE);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            rs.close();
            ps.close();
        }
//        U.log("list size==" + list.size());

        // if(dependentSeqNo!=null){
        U.log("update key value===" + updateKey);
        getValueOfEntry(updateKey + "", list);

        for (Map.Entry m : values.entrySet()) {
//            U.log(m.getKey() + " " + m.getValue());
        }
        try {
            for (int j = 0; j < list.size(); j++) {
                DyanamicRecordsListModel model = list.get(j);
//            U.log("column name====>"+model.getColumn_name());
                if (model.getColumn_type().contains("IMG") || model.getColumn_type().contains("VIDEO")) {
                    if (model.getTable_name().contains("DOC_TRAN")) {
                        String file_id = values.get(model.getColumn_name());
                        getImageDocTran(file_id);
                        model.setValue(Base64.encode(imgMap1.get(file_id)));
                    } else {
                        String file_id = values.get(model.getColumn_name());
                        model.setValue(Base64.encode(imgMap.get(file_id)));
                    }

                } else //   if(!model.getColumn_name().contains("COL6"))
                //    {
                {

//                U.log("inside else");

                    /*  if (model.getREF_LOV_TABLE_COL() != null) {
                String refLocSql = " SELECT 'SELECT DISTINCT ' || DISPLAY_VALUE || ' FROM ' || TABLE_NAME || ' WHERE 1=1 ' || 'AND '|| column_name||' = '\n"
                        + "        FROM VIEW_PORTAL_UPLOAD_TBL_LOV_GEN\n"
                        + " WHERE UPPER(TRIM(TABLE_NAME || '.' || COLUMN_NAME)) = \n"
                        + "       UPPER('" + model.getREF_LOV_TABLE_COL() + "')";

                U.log("refLocSql==" + refLocSql);
                String codeSql = "";
                try {
                    ps = connection.prepareStatement(refLocSql);
                    rs = ps.executeQuery();
                    String whereclause = "";
                    if (rs != null && rs.next()) {
                        U.log("before append codeSQL==" + rs.getString(1));
                        whereclause = values.get(model.getColumn_name());
                        if (whereclause != null && whereclause.contains("#")) {
                            whereclause = whereclause.split("#")[0];
                        }
                        codeSql = rs.getString(1) + "'" + whereclause + "'";

                    }
                    U.log("codeSql=" + codeSql);

                    String val = SqlUtil.findLovValue(codeSql, whereclause, connection);

                    if (model.getItem_help_property() != null && !model.getItem_help_property().equalsIgnoreCase("AS")) {
                        model.setCodeOfValue(whereclause);
                        model.setValue(val);
                    } else if (model.getItem_help_property() != null && model.getItem_help_property().equalsIgnoreCase("AS")) {
                        model.setValue(whereclause);
                    }
                } catch (Exception e) {
                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (SQLException e) {
                        }
                    }
                }
            } //  }
            else //  if(values.get(model.getColumn_default_value())!=null&&!values.get(model.getColumn_default_value()).contains("sysdate"))
            {*/ if (values.get(model.getColumn_name()) != null && !model.getColumn_name().contains("LASTUPDATE")) {

//                    U.log("col name==>" + model.getColumn_name() + ":::" + model.getColumn_type());
                        if (model.getColumn_type().equalsIgnoreCase("DATE") || model.getColumn_type().equalsIgnoreCase("DATETIME")) {
//                        U.log("col name==>" + model.getColumn_name());
                            try {
//                            U.log("sysdate::::" + sysdate);
                                if (model.getColumn_type().equalsIgnoreCase("DATETIME")) {
//                                  model.setValue(sysdate);
                                    model.setValue(values.get(model.getColumn_name()));
                                } else {
//                                  model.setValue(sysdate.split(" ")[0]);
                                    model.setValue(values.get(model.getColumn_name()));
                                }
                            } catch (Exception ex) {
                            }
                        } else {

                            if (values.get(model.getColumn_name()).contains("~~")) {
                                String valArr[] = values.get(model.getColumn_name()).split("~~");
                                try {
                                    model.setValue(valArr[0] != null ? valArr[0] : "");
                                } catch (Exception ex) {
                                    model.setValue("");
                                }
                                try {
                                    model.setCodeOfValue(valArr[1] != null ? valArr[1] : "");
                                } catch (Exception ex) {
                                    model.setCodeOfValue("");
                                }

                            } else {
                                model.setValue(values.get(model.getColumn_name()));
                            }

                        }
                    } else {
                        //for set defualt value if column not present in table

                        if (model.getColumn_default_value() != null) {

                            if (model.getColumn_type().equalsIgnoreCase("DATE") || model.getColumn_type().equalsIgnoreCase("DATETIME")) {
//                            U.log("col name==>1" + model.getColumn_name());
                                try {

                                    if (model.getColumn_type().equalsIgnoreCase("DATETIME")) {
                                        model.setValue(sysdate);
                                    } else {
                                        model.setValue(sysdate.split(" ")[0]);
                                    }
                                } catch (Exception ex) {

                                }
                            } else {
//                            U.log("col name==>******" + model.getColumn_name() + "DEFAULT VALUE==" + model.getValue());
                                if (model.getValue() != null) {
//                                U.log("col name==>******" + model.getColumn_name() + "|| VALUE==" + model.getValue());
                                    model.setValue(model.getValue());
                                } else {
                                    model.setValue(model.getColumn_default_value());
                                }
                            }
                        }
                    }
                    if (model.getColumn_default_value() != null && model.getColumn_name().equals("TCODE")) {
                        model.setValue(model.getColumn_default_value());
                    }

                    if (model.getItem_help_property().trim().equals("L") && values.get(model.getColumn_name()) != null) {
                        String valueSql = null;
                        String colName = model.getREF_LOV_TABLE_COL();
                        if (colName != null) {
                            U.log("REF_LOV_TABLE_COL=" + model.getREF_LOV_TABLE_COL());
                            String value = values.get(model.getColumn_name());

//                        valueSql = valueSql.replaceAll("colName", colName.split("\\.")[1]).replaceAll("tableName", colName.split("\\.")[0]);
//                            System.out.println("col name=="+ colName.split("\\.")[colName.split("\\.").length-1]);
//                            System.out.println("table name=="+colName.substring(0,colName.lastIndexOf(".")));
                            if (colName.contains("DISTINCT") || colName.contains("distinct")) {
                                valueSql = "select distinct lhs_utility.get_name('colName', colName) from tableName where colName='" + values.get(model.getColumn_name()) + "'";
                                colName = colName.replaceAll("DISTINCT", "");
                                valueSql = valueSql.replaceAll("colName", colName.split("\\.")[colName.split("\\.").length - 1].trim()).replaceAll("tableName", colName.substring(0, colName.lastIndexOf(".")));
                            } else {
                                valueSql = "select lhs_utility.get_name('colName', colName) from tableName where colName='" + values.get(model.getColumn_name()) + "'";
                                valueSql = valueSql.replaceAll("colName", colName.split("\\.")[colName.split("\\.").length - 1]).replaceAll("tableName", colName.substring(0, colName.lastIndexOf(".")));
                            }
                            U.log("REF_LOV_TABLE_COL valueSql=" + valueSql);
                            PreparedStatement ps2 = connection.prepareStatement(valueSql);
                            ResultSet rs2 = ps2.executeQuery();
                            if (rs2 != null && rs2.next()) {
                                value = rs2.getString(1);
                            }
                            if (value.contains("~")) {
                                model.setValue(value.split("~~")[0]);
                                model.setCodeOfValue(values.get(model.getColumn_name()).split("~~")[1]);
                            } else {
                                model.setValue(value);
                                model.setCodeOfValue(values.get(model.getColumn_name()));
                            }
                        }
                    }

                    //for code-value
                    if (model.getItem_help_property().contains("H") && model.getColumn_select_list_value() != null) {
                        U.log(userCode + "===" + model.getColumn_name() + "=null values==" + values.get(model.getColumn_name()));
//                    String val = SqlUtil.getValue(connection, values.get(model.getColumn_name()), model.getColumn_select_list_value(), userCode);

//                    U.log("value of H===" + val);
                        if (values.get(model.getColumn_name()) != null) {
                            model.setValue(values.get(model.getColumn_name()));

                        }

                    }
                }
//            list.set(j, model);
//            }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        // }

        U.log("list==>" + list.toString());
        return list;
    }

    public void getValueOfEntry(String upadteKeyValue, List<DyanamicRecordsListModel> list) {
//        InputStream imgStream = null;
//        PreparedStatement ps = null;
        String columnNameList = COLUMN_NAME_STR.toString();
//        U.log(columnNameList);
////        U.log("columnNameList.substring(columnNameList.length()-1)===>>"+columnNameList.substring(columnNameList.length()-1));
        columnNameList = columnNameList.substring(0, columnNameList.length() - 1);
//        ResultSet rs;
//        StringBuffer sql = new StringBuffer();
//        U.log("table name : " + table_name);
//        if (table_name.equalsIgnoreCase("CRM_CLIENT_TRAN")) {
//            sql.append("select " + columnNameList + " from " + table_name + " m where ");
//        } else {
//            sql.append("select " + columnNameList + " from " + table_name + " where ");
//        }
////        sql.append("select " + columnNameList + " from " + table_name + " m where ");
//        sql.append(UPDATE_KEY + "='" + upadteKeyValue + "'");
//        if (table_name.equalsIgnoreCase("CRM_CLIENT_TRAN")) {
//            sql.append(" AND STATUS_FLAG NOT IN ('L', 'C', 'D') AND m.SLNO =  (SELECT MAX(C.SLNO) FROM CRM_CLIENT_TRAN C WHERE C.SEQ_NO = m.SEQ_NO AND C.PARENT_SLNO = m.PARENT_SLNO)");
//        }
//        if (ORDER_CLAUSE != null) {
//            sql.append(" order by " + ORDER_CLAUSE);
//        }
//
//        U.log("\n\nUPDATE SQL: " + sql.toString() + "\n\n");
//        try {
//            ps = connection.prepareStatement(sql.toString());
        InputStream imgStream = null;
        PreparedStatement ps = null;
        ResultSet rs;
        StringBuffer sql = new StringBuffer();
        U.log("table name : " + table_name);
        if (table_name.equalsIgnoreCase("CRM_CLIENT_TRAN")) {
            sql.append("select " + columnNameList + " from " + table_name + " m where 1=1 ");
        } else {
            sql.append("select " + columnNameList + " from " + table_name + " where  1=1 ");
        }
//        sql.append("select " + columnNameList + " from " + table_name + " m where ");
        String upadteKeyValueArr[] = UPDATE_KEY;
        System.out.println("UPDATE_KEY==============================> " + UPDATE_KEY);
        if (upadteKeyValue != null && !upadteKeyValue.isEmpty()) {
            upadteKeyValueArr = upadteKeyValue.split("#");
        }

        String[] upadteKeyTypeArr = new String[UPDATE_KEY.length];

        for (DyanamicRecordsListModel model : list) {
            for (int i = 0; i < UPDATE_KEY.length; i++) {
                if (model.getColumn_name().equalsIgnoreCase(UPDATE_KEY[i])) {
                    upadteKeyTypeArr[i] = model.getColumn_type();
                    System.out.println("UPDATE_KEY [" + i + "]= " + UPDATE_KEY[i]);
                }
            }
        }

        for (int i = 0; i < UPDATE_KEY.length; i++) {
            try {
                if (upadteKeyTypeArr[i] != null && !upadteKeyTypeArr[i].isEmpty()) {
                    if (upadteKeyTypeArr[i].equalsIgnoreCase("DATE")) {
                        sql.append(" and " + UPDATE_KEY[i] + "=to_date('" + upadteKeyValueArr[i] + "','dd-mm-rrrr')");
                    } else if (upadteKeyTypeArr[i].equalsIgnoreCase("DATETIME")) {
                        sql.append(" and " + UPDATE_KEY[i] + "=to_date('" + upadteKeyValueArr[i] + "','dd-mm-rrrr HH:mm:ss')");
                    } else {
                        sql.append(" and " + UPDATE_KEY[i] + "='" + upadteKeyValueArr[i] + "'");
                    }
                } else {
                    sql.append(" and " + UPDATE_KEY[i] + "='" + upadteKeyValueArr[i] + "'");
                }
            } catch (Exception e) {
            }
        }

        if (table_name.equalsIgnoreCase("CRM_CLIENT_TRAN")) {
            sql.append(" AND STATUS_FLAG NOT IN ('L', 'C', 'D') AND m.SLNO =  (SELECT MAX(C.SLNO) FROM CRM_CLIENT_TRAN C WHERE C.SEQ_NO = m.SEQ_NO AND C.PARENT_SLNO = m.PARENT_SLNO)");
        }

        if (ORDER_CLAUSE != null) {
            sql.append(" order by " + ORDER_CLAUSE);
        }
        String sqlStr = sql.toString();
        if (table_name.equalsIgnoreCase("ORDER_HEAD")) {
            sqlStr = sql.toString().replace("LATITUDE", "'' LATITUDE").replace("LONGITUDE", "'' LONGITUDE").replace("LOCATION", "'' LOCATION");
        }
        U.log("entry detail sql : 111 " + sqlStr);

        try {

            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
//            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
//            int year = 2014, month = 10, day = 31;
//            Calendar cal = Calendar.getInstance();
//            cal.set(Calendar.YEAR, year);
//            cal.set(Calendar.MONTH, month - 1); // <-- months start at 0.
//            cal.set(Calendar.DAY_OF_MONTH, day);

            ps = connection.prepareStatement(sqlStr);
            rs = ps.executeQuery();
            ResultSetMetaData md = rs.getMetaData();
            int columnCount = md.getColumnCount();
            U.log("columnCount==" + columnCount);
            if (rs != null && rs.next()) {
                do {
                    for (int i = 1; i <= columnCount; i++) {
                        String colmnName = md.getColumnName(i);
                        if (displayColList.get(colmnName) != null) {
                            if (!displayColList.get(colmnName).contains("IMG")) {
//                                if (colmnName.contains("DATE")) {
//
//                                    DateFormat parser = new SimpleDateFormat("yyyy-MM-dd");
//                                    Date date;
//                                    try {
//                                        date = (Date) parser.parse(rs.getString(colmnName));
//                                        SimpleDateFormat formatter = new SimpleDateFormat("MM-dd-yyyy");
//                                        String formattedDate = formatter.format(date);
//                                        values.put(colmnName, formattedDate);
//                                    } catch (Exception ex) {
//                                    }
//
//                                } else 
                                {
//                                    U.log("values======>>" + colmnName);
                                    values.put(colmnName, rs.getString(colmnName));
                                }
                            } else {
//                                U.log("values=====::::" + rs.getString(colmnName));
                                values.put(colmnName, rs.getString(colmnName));
                                fileId.add(rs.getString(colmnName));
                            }
                        }
                    }
                } while (rs.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        U.log("map ==>" + values.toString());
        StringBuffer imgSql = new StringBuffer();
        if (fileId.size() > 0) {
            imgSql.append("select * from lhssys_portal_upload_file where 1=1 ");
            for (int i = 0; i < fileId.size(); i++) {
                imgSql.append(" or file_id=").append(fileId.get(i));
            }
            byte img[];
            try {
                ps = connection.prepareStatement(imgSql.toString());
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
//                        if (imgDataType.contains("LONG")) {
                        if (rs.getBinaryStream("store_file_LRAW") != null) {
                            imgStream = rs.getBinaryStream("store_file_LRAW");
                        } else {
                            imgStream = getClass().getResourceAsStream("/defualtDp.png");
                        }
                        /*} else if (rs.getBlob("store_file") != null) {
                            Blob b = rs.getBlob("store_file");
                            imgStream = b.getBinaryStream();
                        } else {
                            imgStream = getClass().getResourceAsStream("/defualtDp.png");
                        }*/

                        //imgMap.put(colmnName,);
                        //  Blob b = rs.getBlob(2);
                        //  byte barr[] = new byte[(int)b.length()]; //create empty array
                        //  barr = b.getBytes(1,(int)b.length());
//   FileOutputStream fout = new FileOutputStream("D:\\photo\\sonoo"+rs.getString("File_id")+".jpg");
//   fout.write(Util.getImgstreamToBytes(imgStream));
//fout.close();
                        imgMap.put(rs.getString("File_id"), Util.getImgstreamToBytes(imgStream));
                    } while (rs.next());
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                    }
                }
            }
        }
    }

    public void getImageDocTran(String refKey) {
        System.out.println("Ref Key---->" + refKey);
        InputStream imgStream = null;
        PreparedStatement ps = null;
        ResultSet rs;
        String docCode = "";
        StringBuffer sql = new StringBuffer();
        StringBuffer imgSql = new StringBuffer();
        imgSql.append("select doc_code from doc_mast where ");
        if (refKey != null && refKey.length() > 0) {
            imgSql.append(" ref_key=").append(refKey.trim());

            byte img[];
            try {
                ps = connection.prepareStatement(imgSql.toString());
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        docCode = rs.getString("DOC_CODE");
                    } while (rs.next());
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                    }
                }
            }
        }
        if (docCode != null && docCode.length() > 0) {

            String docTranImgSql = "select * from doc_tran_image where doc_code='" + docCode.trim() + "'";

            try {
                ps = connection.prepareStatement(docTranImgSql);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
//                        if (imgDataType.contains("LONG")) {
                        if (rs.getBinaryStream("DOC_IMAGE") != null) {
                            imgStream = rs.getBinaryStream("DOC_IMAGE");
                        } else {
                            imgStream = getClass().getResourceAsStream("/defualtDp.png");
                        }

                        imgMap1.put(refKey, Util.getImgstreamToBytes(imgStream));
                    } while (rs.next());
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                    }
                }
            }

        }
    }
}
