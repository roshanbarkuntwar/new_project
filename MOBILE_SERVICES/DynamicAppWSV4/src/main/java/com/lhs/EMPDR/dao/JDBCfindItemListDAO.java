/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.ItemListJSON;
import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
import com.lhs.EMPDR.Model.ParentChildItemListModel;
import com.lhs.EMPDR.Model.ValueClassModel;
import com.lhs.EMPDR.utility.LOV;
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

/**
 *
 * @author kirti.misal
 */
public class JDBCfindItemListDAO {

    Connection connection;
    HashMap<String, String> values = new HashMap<String, String>();//col name,col value
    HashMap<String, String> DefaultValues = new HashMap<String, String>();//col name,col value
    HashMap<String, byte[]> imgMap = new HashMap<String, byte[]>();
    HashMap<String, String> displayColList = new HashMap<String, String>();
    ArrayList<String> fileId = new ArrayList<String>();
    ArrayList<ParentChildItemListModel> paranetChildItemList = new ArrayList<ParentChildItemListModel>();
    ArrayList< HashMap<String, String>> itemList = new ArrayList< HashMap<String, String>>();//parent LIST
    ArrayList< ArrayList<DyanamicRecordsListModel>> child = new ArrayList<ArrayList<DyanamicRecordsListModel>>();

    String table_name;
    String sysdate = null;
    String imgDataType = "LONG";
    String UPDATE_KEY = null;//use as a primary key
    String ENTITYCODE;
    String TCODE;
    String CURRENCYCODE;

    //TAXRATE
    String ACCCODE;
    String GSTCODE;
    
    String FC_RATE;
    
    String DELIVERYTOSLNO;
    String STAXCODE;
    String UPDATE_KEY_VALUE;

    String executeQtyQry;
    String executeQtyValidateFlag;
    String executeQtyValidateQry;
    String executeFlag;
    Util utl;

    public JDBCfindItemListDAO(Connection c) {
        this.connection = c;
        U u = new U(this.connection);
        utl = new Util();
    }

    String USER_CODE = "";
    String SEQNO = "";

    public ItemListJSON getRecordDetailForUpdateForm(String seqNo, String userCode, String updateKey, String acccode, String searchText) throws SQLException {
        Date sysdate = new Date();
        USER_CODE = userCode.toUpperCase();
        SEQNO = seqNo;
        ACCCODE = acccode;
        UPDATE_KEY_VALUE = updateKey;

        SimpleDateFormat formatter = new SimpleDateFormat("MM-dd-yyyy");
        String formattedDate = formatter.format(sysdate);
        ArrayList<ArrayList<DyanamicRecordsListModel>> list = new ArrayList<ArrayList<DyanamicRecordsListModel>>();
        /*
        FIND ALL PARENT LIST OF FIELDS 
         */
        list = getDetailOfEntry("LONG", seqNo, updateKey, userCode, acccode);
        U.log("");
        /*
        SET CHILD
         */
        findChild(seqNo, updateKey, userCode, acccode, searchText);

        ItemListJSON json = new ItemListJSON();
        json.setPrntchild(paranetChildItemList);
        json.setRecordsInfo(list);
        return json;
    }

    public ArrayList<DyanamicRecordsListModel> getcolumnDetails(String imgDataType, String seq_no, String updateKey, String userCode, String acccode) {
        //U.log("\n$$$$$$$$$$$$$$$$$$$$\nHELLO\n########################\n");

        imgDataType = "BLOB";
        USER_CODE = userCode.toUpperCase();
        this.imgDataType = imgDataType;
        // SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        // String formattedDate = formatter.format(sysdate);
        PreparedStatement ps = null;
        ResultSet rs = null;
        StringBuffer sql1 = new StringBuffer();
        String[] DefualtvlaueForDropDownSql = null;

        sql1.append("select u.*,TO_CHAR(sysdate, 'DD-MM-YYYY  HH24:MI:SS') as systemdate,t.dependent_next_entry_seq ,t.update_key,t.EXECUTE_AFTER_DELETE"
                + " from lhssys_portal_data_dsc_update u,lhssys_portal_table_dsc_update t where ");
        sql1.append("u.seq_no=" + seq_no + " and t.seq_no=" + seq_no + " and u.status not in ('F','I') order by u.column_slno");
        U.log("sql query=" + sql1.toString());
        ArrayList<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();

        try {
            ps = connection.prepareStatement(sql1.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
//                U.log("update_key : " + UPDATE_KEY);
                do {
//                    U.log("\n\n\nstart=>" + rs.getString("column_name") + "\n\n\n");
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    table_name = rs.getString("table_name");
                    displayColList.put(rs.getString("column_name"), rs.getString("column_type"));
                    sysdate = rs.getString("systemdate");
                    UPDATE_KEY = rs.getString("update_key");
                    executeFlag = (rs.getString("execute_after_delete")!=null ? rs.getString("execute_after_delete") : null);
                    model.setColumn_desc(rs.getString("column_desc"));
                    model.setColumn_name(rs.getString("Column_name"));
                    model.setColumn_type(rs.getString("Column_type"));
                    model.setREF_LOV_TABLE_COL(rs.getString("Ref_lov_table_col"));
                    model.setColumn_validate(rs.getString("column_validate"));
                    model.setSummary_function_flag(rs.getString("Summary_function_flag"));
                    model.setREF_LOV_WHERE_CLAUSE(rs.getString("REF_LOV_WHERE_CLAUSE"));
                    model.setSLNO(rs.getString("slno"));
                    model.setData_type(rs.getString("COLUMN_MASTER_REF_FLAG"));// COLUMN_MASTER_REF_FLAG
                    //for currencycode
//                    if(model.getColumn_name())
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
                        String sql = "select column_name, slno,column_default_value from LHSSYS_PORTAL_DATA_DSC_UPDATE where slno in "
                                + "(" + dependentRowString + ") and seq_no=" + seq_no;
//                        U.log(rs.getString("column_name") + "=>sqldependent : " + sql);
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
                            e.printStackTrace();
                        }
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

                    String column_catg = (rs.getString("Column_catg"));
                    if (column_catg != null) {
                        ps = connection.prepareStatement("select " + column_catg + " columnHeading from dual");
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
                    model.setColumn_default_value(rs.getString("Column_default_value"));
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
                    model.setFrom_value(rs.getDouble("From_value") + "");
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
                    model.setValidate_dependent_row_slno(rs.getString("validate_dependent_row_slno"));
                    model.setData_save_success_message(rs.getString("data_save_success_message")!= null ? rs.getString("data_save_success_message") : "");
                    //for drop down
                    if (rs.getString("item_help_property").contains("H") || rs.getString("item_help_property").contains("D")) {
                        String selectquery = rs.getString("column_select_list_value");

                        if (selectquery != null) {
                            selectquery = selectquery.replace("USER_CODE", userCode);
                            if (acccode != null) {
                                selectquery = selectquery.replace("ACCCODE", acccode);
                            }
                        }
                        if (!selectquery.toLowerCase().contains("select")) {
                            selectquery = "select " + selectquery + " from dual";
                        } else {
                            //for set col0,col1,col2 values
                            //---------------------------------------------------------------------------------------------------------

                            selectquery = selectquery.replace("USER_CODE", USER_CODE);

                            if (selectquery.toLowerCase().contains("select")) {
                                String whereClauseValue = "";

                                //ACC_year alwyas be in last position in where condition
                                String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE "
                                        + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') ) "
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
                                        DefualtvlaueForDropDownSql[DefualtvlaueForDropDownSql.length - 1] = currentAccYear;
                                    }
                                } else {
                                    U.log("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                                }

                                //END FIND ACC_YEAR
                                if (DefualtvlaueForDropDownSql != null) {

                                    for (int i = 0; i < DefualtvlaueForDropDownSql.length; i++) {
//                                      U.log("COL" + i+"==DefualtvlaueForDropDownSql==" + DefualtvlaueForDropDownSql[i]);
                                        selectquery = selectquery.replaceAll("COL" + i, DefualtvlaueForDropDownSql[i]);
                                    }
                                }

                                selectquery = selectquery.replaceAll("ACCCODE", acccode).replaceAll("STAXCODE", DefualtvlaueForDropDownSql[0]);

                            } else {
                                selectquery = "select " + selectquery + " from dual";
                            }
                            //U.log("selectQuery=" + selectquery);

                            //----------------------------------------------------------------------------------------------------------
                            //----------------------------------------------------------------------------------------------------------
                        }

                        U.log("column_select_list_value==>" + selectquery);

                        PreparedStatement ps2 = connection.prepareStatement(selectquery);
                        try {
                            ResultSet rs2 = ps2.executeQuery();
                            if (rs2 != null && rs2.next()) {
//                                U.log("dropdownstr==" + rs2.getString(1));
                                model.setDropdownVal(rs2.getString(1));
                                String dropDownListStr = rs2.getString(1);
                                //Display Selected First value of dropdown
                                if (dropDownListStr.trim().length() > 1) {
                                    model.setValue(dropDownListStr.split("#")[0].split("~")[0]);
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
                            model.setValue(USER_CODE);
                        }
                    }
                    String status = rs.getString("Status");
//                    U.log("status of column==>"+rs.getString("column_desc")+"<==>"+rs.getString("Status"));
                    if (rs.getString("Status") != null && !status.contains("F")) {
                        list.add(model);
                    }
//                    U.log("\n\n\nend=" + rs.getString("column_name") + "\n\n\n");
                } while (rs.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                rs.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            try {
                ps.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }

        U.log("\n\n\n size=" + list + "\n\n\n");
        return list;
    }

    public void findChild(String seq_no, String updateKey, String userCode, String acccode, String searchText) {
        int count = 1;
        for (ParentChildItemListModel parentItem : paranetChildItemList) {
            ArrayList<String> dpendRowKeyValuePair = new ArrayList<String>();
            ArrayList<DyanamicRecordsListModel> list1 = new ArrayList<DyanamicRecordsListModel>();
            try {
                list1 = getcolumnDetails(imgDataType, seq_no, updateKey, userCode, acccode);
            } catch (Exception e) {
                e.printStackTrace();
            }

            
            LOV obj_lov = new LOV();
            String contractVrno = null;
            String contractSlno = null;
            String contractAmendno = null;
            String contractTcode = null;

            String quotVrno = null;
            String quotSlno = null;
            String quotAmendno = null;
            String quotTcode = null;

            String VAT = null;
            String parentItemCode = null;
            StringBuffer lovSQL = new StringBuffer();
            String whereClauseValue;
            String forWhichColmn = null;
            String ref_lov_table_col = null;
            String ref_lov_where_clause = null;
            String whereClauseSlno[] = null;
            String itemcode = "";
            child = new ArrayList<ArrayList<DyanamicRecordsListModel>>();
            for (DyanamicRecordsListModel record : parentItem.getParent()) {
//                U.log("summry flag value=>>" + record.getColumn_name());
                if (record.getSummary_function_flag() != null && record.getSummary_function_flag().equals("P")) {

                    forWhichColmn = record.getColumn_name();
                    whereClauseSlno = record.getDependent_row().split("#");

                    System.out.println("#############RANJEET-----" + record.getDependent_row());

                    ref_lov_table_col = record.getREF_LOV_TABLE_COL();
                    obj_lov.setREF_LOV_TABLE_COL(ref_lov_table_col);
                    ref_lov_where_clause = record.getREF_LOV_WHERE_CLAUSE();
//                    U.log("where clause value=>>" + ref_lov_where_clause);
                }

                if (record.getColumn_name().equals("VRNO")) {
                    contractVrno = (String) record.getValue();
                }
                //-------------------------------------
                if (record.getColumn_name().equals("TCODE")) {

                    System.out.println(record.getValue() + " <---TCODE---> " + TCODE);
                    contractTcode = (String) record.getValue();
                }
                if (record.getColumn_name().equals("SLNO")) {
                    contractSlno = (String) record.getValue();
                }   
                if (record.getColumn_name().equals("AMENDNO")) {
                    contractAmendno = (String) record.getValue();
                }
                //-------------------------------------
//
                //-------------------------------------
                if (record.getColumn_name().equals("QUOTATION_VRNO")) {
                    quotVrno = (String) record.getValue();
                }
                if (record.getColumn_name().equals("QUOTATION_TCODE")) {
                    quotTcode = (String) record.getValue();
                }
                if (record.getColumn_name().equals("QUOTATION_SLNO")) {
                    quotSlno = (String) record.getValue();
                }
                if (record.getColumn_name().equals("QUOTATION_AMENDNO")) {
                    quotAmendno = (String) record.getValue();
                }
                //-------------------------------------

                if (record.getColumn_desc().equals("VAT")) {
                    VAT = (String) record.getValue();
                }
                if (record.getColumn_name().toUpperCase().equals("ITEM_CODE")) {
                    parentItemCode = (String) record.getCodeOfValue();
                    System.out.println("########ANJALI--------------------------------------" + parentItemCode);
                }
                if (record.getColumn_name().toUpperCase().equals("STAX_CODE")) {

                    if ((String) record.getCodeOfValue() != null) {
                        STAXCODE = (String) record.getCodeOfValue();
                    } else {
                        STAXCODE = (String) record.getValue();
                    }
                }
                if (record.getColumn_name().toUpperCase().equals("GST_CODE")) {
                    if ((String) record.getCodeOfValue() != null) {
                        GSTCODE = (String) record.getCodeOfValue();
                    } else {
                        GSTCODE = (String) record.getValue();
                    }
                    U.log("GSTCODE==>" + GSTCODE);
                }
                
                if (record.getColumn_name().toUpperCase().equals("FC_RATE")) {
                    if ((String) record.getCodeOfValue() != null) {
                        FC_RATE = (String) record.getCodeOfValue();
                    } else {
                        FC_RATE = (String) record.getValue();
                    }
                    U.log("FC_RATE==>" + FC_RATE);
                }
                if (record.getColumn_name().toUpperCase().equals("DELIVERY_TO_SLNO")) {
                    if ((String) record.getCodeOfValue() != null) {
                        DELIVERYTOSLNO = (String) record.getCodeOfValue();
                    } else {
                        DELIVERYTOSLNO = (String) record.getValue();
                    }
                }
            }
            try {
                lovSQL.append(obj_lov.createLOVsql(connection).split("~~")[1]);
            } catch (Exception e) {
                U.errorLog(e + "==create love sql has problem.");
            }
            if (whereClauseSlno != null) {
                for (int i = 0; i < whereClauseSlno.length; i++) {
                    //U.log("depend slno==>>" + whereClauseSlno[i]);
                    for (DyanamicRecordsListModel record : parentItem.getParent()) {
                        if (record.getColumn_name().toLowerCase().contains(whereClauseSlno[i].toLowerCase())) {
                            String value = null;
                            if (record.getItem_help_property().equals("L")) {
                                value = record.getCodeOfValue();
                            } else {
                                value = (String) record.getValue();
                            }
                            dpendRowKeyValuePair.add(value);
                        }
                    }
                }
            }

            String whereClauseString = "";
            String[] refLovWhereclauseArray = ref_lov_where_clause.split("#");
            whereClauseValue = dpendRowKeyValuePair.toString().replaceAll(",", "#");
            whereClauseValue = whereClauseValue.replaceAll("[\\[\\]]", "");;
            U.log("whereClauseValue==>" + whereClauseValue);
            if (whereClauseValue != null && !whereClauseValue.equalsIgnoreCase("null") && whereClauseValue.trim().length() > 0) {
                String[] whereClauseValArray = whereClauseValue.split("#");
                for (int i = 0; i < whereClauseValArray.length; i++) {

                    String valueOfWhereCondition = "'" + whereClauseValArray[i].trim() + "'";

                    if (valueOfWhereCondition != null && !valueOfWhereCondition.equalsIgnoreCase("null")) {
                        //U.log(valueOfWhereCondition + "==dependentWhereClauseArray[i] : " + refLovWhereclauseArray[i]);
                        if (refLovWhereclauseArray[i].contains("UPPER")) {
                            valueOfWhereCondition = "UPPER(TRIM(" + valueOfWhereCondition + "))";
                        }
                        int columnIndex = i;
                        if (i == 0) {
                            columnIndex = i + 1;
                        }
                        if (refLovWhereclauseArray[i].contains("COL" + columnIndex)) {
                            whereClauseString = whereClauseString + refLovWhereclauseArray[i].replaceAll("COL" + columnIndex, valueOfWhereCondition.replaceAll(",", "','"));
                        } else {
                            whereClauseString = whereClauseString + "" + refLovWhereclauseArray[columnIndex] + "" + valueOfWhereCondition + "";
                        }
                    }
                }
                //U.log("whereClauseString : " + whereClauseString);
                lovSQL.append(whereClauseString);
            } else {
                if (!ref_lov_where_clause.contains("COL")) {
                    lovSQL.append(ref_lov_where_clause);
                }
            }

            U.log("LOV SQL==>>" + lovSQL);
            try {
                PreparedStatement ps = connection.prepareStatement(lovSQL.toString());
                ResultSet rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {

                        list1 = getcolumnDetails(imgDataType, seq_no, updateKey, userCode, acccode);

                        for (DyanamicRecordsListModel drlm : list1) {
                            
                            if (drlm.getColumn_name().equals(forWhichColmn)) {
                                drlm.setCodeOfValue(rs.getString(1));
                                drlm.setValue(rs.getString(2));
                                itemcode = rs.getString(1);
                                System.out.println("--item code--"+ itemcode);
                            }
                            if (drlm.getColumn_name().equals("CONTRACT_VRNO") || drlm.getColumn_name().equals("QUOTATION_VRNO")) {
                                drlm.setValue(contractVrno);
                            }
                            //-------------------- 
                            if (drlm.getColumn_name().equals("CONTRACT_SLNO") || drlm.getColumn_name().equals("QUOTATION_SLNO")) {
                                drlm.setValue(contractSlno);
                            }
                            if (drlm.getColumn_name().equals("CONTRACT_AMENDNO") || drlm.getColumn_name().equals("QUOTATION_AMENDNO")) {
                                drlm.setValue(contractAmendno);
                            }
                            if (drlm.getColumn_name().equals("CONTRACT_TCODE") || drlm.getColumn_name().equals("QUOTATION_TCODE")) {

                                System.out.println(drlm.getColumn_name() + " --> " + TCODE);
                                drlm.setValue(TCODE);
                            }

                            //--------------------For OR series
                            if (drlm.getColumn_name().equals("QUOTATION_VRNO") && quotVrno != null && !quotVrno.isEmpty()) {
                                drlm.setValue(quotVrno);
                            }
                            if (drlm.getColumn_name().equals("QUOTATION_SLNO") && quotSlno != null && !quotSlno.isEmpty()) {
                                drlm.setValue(quotSlno);
                            }
                            if (drlm.getColumn_name().equals("QUOTATION_AMENDNO") && quotAmendno != null && !quotAmendno.isEmpty()) {
                                drlm.setValue(quotAmendno);
                            }
                            if (drlm.getColumn_name().equals("QUOTATION_TCODE") && quotTcode != null && !quotTcode.isEmpty()) {
                                drlm.setValue(quotTcode);
                            }

                            //----------------
                            if (drlm.getColumn_desc().equals("VAT")) {
                                drlm.setValue(VAT);
                            }
//                            if (drlm.getColumn_name().equals("UM")) {
//                                drlm.setValue(drlm);
//                            }
                            if (drlm.getColumn_name().equals("GST_CODE")) {
                                drlm.setValue(GSTCODE);
                            }
                            
                            if (drlm.getColumn_name().equals("FC_RATE")) {
                                drlm.setValue(FC_RATE);
                            }
                            //for set defualt value if column not present in table
                            if (drlm.getColumn_default_value() != null) {
                                drlm.setValue(drlm.getColumn_default_value());
                            }
                            if (drlm.getColumn_name().equals("SLNO")) {
                                drlm.setValue(count);
                            }

//                                 U.log("\n drlm.getColumn_select_list_value()=>"+drlm.getColumn_select_list_value()+"\n");
                            if (drlm.getColumn_select_list_value() != null && !drlm.getColumn_select_list_value().trim().equals("T") && (drlm.getColumn_name().equalsIgnoreCase("FC_RATE") || drlm.getColumn_name().equalsIgnoreCase("RATE"))) {
                                String sqlString = " select " + drlm.getColumn_select_list_value() + " from dual";
//                                U.log("\n rate function=>"+sqlString+"\n");
//                                U.log("\nsqlString==>>>" + ENTITYCODE + "===" + CURRENCYCODE + "===" + TCODE + "===");

                                // ----------------- 20190909 ----------Start----------------//
                                System.out.println("SEARCH_TEXT : " + searchText);
                                String dependentRows[] = searchText.split("#");
                                if (sqlString.contains("col")) {
                                    for (int i = 0; i < dependentRows.length; i++) {
                                        String replaceValue = utl.isNull(dependentRows[i]) ? "" : dependentRows[i];
                                        sqlString = sqlString.replace("'col" + i + "'", "'" + replaceValue + "'");
                                    }
                                }
                                // ----------------- 20190909 -----------END---------------//
                                U.log(itemcode + "===" + parentItemCode + "\n**********\n");
                                sqlString = sqlString.replace("ENTITYCODE", ENTITYCODE).replace("CURRENCYCODE", CURRENCYCODE).replace("TCODE", TCODE);
                                sqlString = sqlString.replace("CHILDITEM", itemcode);
                                sqlString = sqlString.replace("CONTRACTITEM", parentItemCode);
                                try {
                                    sqlString = sqlString.replace("ACCCODE", acccode);
                                } catch (Exception e) {

                                }
//                                U.log("\nsqlString==>>>" + sqlString + "\n**********\n");
                                System.out.println("sqlString--> " + sqlString);
                                PreparedStatement ps1 = connection.prepareStatement(sqlString);
                                ResultSet rs1 = ps1.executeQuery();

                                if (rs1 != null && rs1.next()) {
//                                     U.log("\nvalue==>>>" + rs1.getString(1) + "\n**********\n");
                                    drlm.setValue(rs1.getString(1));
                                }
                            }

                            if (drlm.getDependent_row_logic() != null) {
                                String resultstr = dependentRowLogic(drlm, itemcode);
                                if (resultstr != null) {
                                    drlm.setValue(resultstr);
                                }
                            }
                            if(drlm.getColumn_name().equalsIgnoreCase("vrdate")){
                                System.out.println("vrdate====> "+ drlm.getValue());
                            }

                        }
                        count++;
                        
                        child.add(list1);
                    } while (rs.next());

                }
                
                parentItem.setChild(child);
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
    }

    public ArrayList<ArrayList<DyanamicRecordsListModel>> getDetailOfEntry(String imgDataType, String seq_no, String updateKey, String userCode, String acccode) throws SQLException {

        ArrayList<DyanamicRecordsListModel> list1 = getcolumnDetails(imgDataType, seq_no, updateKey, userCode, acccode);//all fields info

        ArrayList<ArrayList<DyanamicRecordsListModel>> arrayOfItemList = new ArrayList<ArrayList<DyanamicRecordsListModel>>();

        /*
        FIND ALL RECORD OF PARENT
         */
        try {
            PreparedStatement psExeQty = connection.prepareStatement("SELECT SQL_TEXT, EMAIL_SEND_CONDITION from LHSSYS_PORTAL_TABLE_DSC_UPDATE where SEQ_NO = " + seq_no);
            ResultSet rsQry = psExeQty.executeQuery();
            if (rsQry != null && rsQry.next()) {
                executeQtyQry = rsQry.getString(1);
                executeQtyValidateFlag = rsQry.getString(2) != null ? rsQry.getString(2) : "NA";
            }
        } catch (Exception e) {
        }

        getValueOfEntry(updateKey + "");
        /*
        END
         */
        U.log("itemlist=" + itemList.size());
        for (int i = 0; i < itemList.size(); i++) {
//            U.log("itemlist=" + itemList.get(i).toString());
            HashMap<String, String> item = itemList.get(i);

            ArrayList<DyanamicRecordsListModel> templist = new ArrayList<DyanamicRecordsListModel>();
            templist = getcolumnDetails(imgDataType, seq_no, updateKey, userCode, acccode);

            //U.log(list1.equals(templist) + "==list=" + templist.get(i).toString());
            //U.log("list size==" + templist.size() + "<====>hashcode=>" + templist.hashCode());
            for (int j = 0; j < templist.size(); j++) {

                DyanamicRecordsListModel model = new DyanamicRecordsListModel();

                model = templist.get(j);
                

                if (model.getColumn_type().contains("IMG") || model.getColumn_type().contains("VIDEO")) {
                    String file_id = item.get(model.getColumn_name());
                    model.setValue(Base64.encode(imgMap.get(file_id)));
                } else if (item.get(model.getColumn_name()) != null && !model.getColumn_name().contains("LASUPDATE")) {
                    if (model.getColumn_name().equals("GST_CODE")) {
                        U.log("gst_code of parent=>" + item.get(model.getColumn_name()));
                        model.setValue(item.get(model.getColumn_name()));
                    }

//                    U.log(model.getColumn_name()+"==parent column name value==>"+item.get(model.getColumn_name()));
                    model.setValue(item.get(model.getColumn_name()));

                    if (model.getColumn_name().equalsIgnoreCase("entity_code")) {
                        if (item.get(model.getColumn_name()) != null) {
                            ENTITYCODE = item.get(model.getColumn_name());
                        } else {
                            ENTITYCODE = item.get(model.getColumn_default_value());
                        }
                    }
                    if (model.getColumn_name().equalsIgnoreCase("tcode")) {
                        if (item.get(model.getColumn_name()) != null) {
                            TCODE = item.get(model.getColumn_name());
                        } else {
                            TCODE = item.get(model.getColumn_default_value());
                        }
                    }
                    if (model.getColumn_name().equalsIgnoreCase("currency_code")) {
                        //U.log("currency defualt value--" + model.getColumn_default_value());
                        if (item.get(model.getColumn_name()) != null) {
                            CURRENCYCODE = item.get(model.getColumn_name());
                        } else {
                            CURRENCYCODE = model.getColumn_default_value();
                        }
                    }
                } else {
                    //for set defualt value if column not present in table
                    if (model.getColumn_default_value() != null) {
                        model.setValue(model.getColumn_default_value());
                        if (model.getColumn_name().equalsIgnoreCase("currency_code")) {
                            //U.log("currency defualt value--" + model.getColumn_default_value());

                            CURRENCYCODE = model.getColumn_default_value();

                        }
                    }
                }
                if (model.getColumn_default_value() != null && model.getColumn_name().equals("TCODE")) {
                    model.setValue(model.getColumn_default_value());
                }

//                if (model.getItem_help_property().trim().equals("L") && item.get(model.getColumn_name()) != null) {
//                    String valueSql = "select lhs_utility.get_name('colName', colName) from tableName where colName='" + item.get(model.getColumn_name()) + "'";
//                    String colName = model.getREF_LOV_TABLE_COL();
//                    if (colName != null) {
//                        //U.log("REF_LOV_TABLE_COL=" + model.getREF_LOV_TABLE_COL());
//                        String value = item.get(model.getColumn_name());
//                        valueSql = valueSql.replaceAll("colName", colName.split("\\.")[1]).replaceAll("tableName", colName.split("\\.")[0]);
//                        //U.log("REF_LOV_TABLE_COL valueSql=" + valueSql);
//                        PreparedStatement ps2 = connection.prepareStatement(valueSql);
//                        ResultSet rs2 = ps2.executeQuery();
//                        if (rs2 != null && rs2.next()) {
//                            value = rs2.getString(1);
//                        }
//
//                        model.setValue(value);
//                        model.setCodeOfValue(item.get(model.getColumn_name()));
//                    }
//                }
                if (model.getItem_help_property().trim().equals("L") && itemList.get(i).get(model.getColumn_name()) != null) {
                    String valueSql = null;
                    String colName = model.getREF_LOV_TABLE_COL();
                    if (colName != null) {
                        U.log("REF_LOV_TABLE_COL=" + model.getREF_LOV_TABLE_COL());
                        String value = itemList.get(i).get(model.getColumn_name());

//                        valueSql = valueSql.replaceAll("colName", colName.split("\\.")[1]).replaceAll("tableName", colName.split("\\.")[0]);
//                            System.out.println("col name=="+ colName.split("\\.")[colName.split("\\.").length-1]);
//                            System.out.println("table name=="+colName.substring(0,colName.lastIndexOf(".")));
                        if (colName.contains("DISTINCT") || colName.contains("distinct")) {
                            valueSql = "select distinct lhs_utility.get_name('colName', colName) from tableName where colName='" + itemList.get(i).get(model.getColumn_name()) + "'";
                            colName = colName.replaceAll("DISTINCT", "");
                            valueSql = valueSql.replaceAll("colName", colName.split("\\.")[colName.split("\\.").length - 1].trim()).replaceAll("tableName", colName.substring(0, colName.lastIndexOf(".")));
                        } else {
                            valueSql = "select lhs_utility.get_name('colName', colName) from tableName where colName='" + itemList.get(i).get(model.getColumn_name()) + "'";
                            valueSql = valueSql.replaceAll("colName", colName.split("\\.")[colName.split("\\.").length - 1]).replaceAll("tableName", colName.substring(0, colName.lastIndexOf(".")));
                        }
                        U.log("REF_LOV_TABLE_COL valueSql=" + valueSql);
                        PreparedStatement ps2 = connection.prepareStatement(valueSql);
                        ResultSet rs2 = ps2.executeQuery();
                        if (rs2 != null && rs2.next()) {
                            value = rs2.getString(1);
                        }
                        model.setValue(value);
                        System.out.println("item code--> "+itemList.get(i).get(model.getColumn_name()).toString());
                        model.setCodeOfValue(itemList.get(i).get(model.getColumn_name()));
                    }
                }
            }
//            //U.log("index==" + i + "==>" + temp.toString());
            ParentChildItemListModel p = new ParentChildItemListModel();
            p.setParent(templist);
            paranetChildItemList.add(p);
            arrayOfItemList.add(templist);
//            //U.log("arrayOfItemList==>" + arrayOfItemList.get(i).toString());
        }

        //return parent list
        return arrayOfItemList;
    }

    public void getValueOfEntry(String upadteKeyValue) {
        PreparedStatement ps = null;
        ResultSet rs = null;
        String itemSlno = "";

        InputStream imgStream = null;

        StringBuffer sql = new StringBuffer();
//        U.log("table name : " + table_name);
        sql.append("select * from " + table_name + " where ");
        sql.append(UPDATE_KEY + "='" + upadteKeyValue + "'");
        U.log("entry detail sql : 222 " + sql.toString() + "****************");
        try {
            ps = connection.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            ResultSetMetaData md = rs.getMetaData();
            int columnCount = md.getColumnCount();
            if (rs != null && rs.next()) {
                do {
                    double remainingQuantity = 0;
                    values = new HashMap<String, String>();
                    for (int i = 1; i <= columnCount; i++) {
                        String colmnName = md.getColumnName(i);
                        if (displayColList.get(colmnName) != null) {

                            if (!displayColList.get(colmnName).contains("IMG")) {
                                if (colmnName.contains("SLNO")) {
                                    itemSlno = rs.getString(colmnName);
                                }

                                if (!colmnName.contains("AQTYORDER")) {
                                    if (colmnName.equals("GST_CODE")) {
                                        U.log("GST_CODE value==>>" + rs.getString(colmnName));
                                    }
//                                    U.log("values map ===>>>>" + colmnName + "====" + rs.getString(colmnName));

                                    values.put(colmnName, rs.getString(colmnName));
                                } else {
                                    double quantity;
                                    if (executeQtyValidateFlag.equalsIgnoreCase("OL")) {
                                        quantity = 0;
                                    } else {
                                        quantity = findTotalQuantityFromContract(upadteKeyValue, itemSlno, rs.getString("tcode"));
                                    }
                                    if (rs.getString(colmnName) != null && rs.getString(colmnName).trim() != "") {
                                        //U.log("DO item quantity=" + Integer.parseInt(rs.getString(colmnName)) + "-" + quantity);
                                        remainingQuantity = Double.parseDouble(rs.getString(colmnName)) - quantity;
                                    }
//                                    values.put(colmnName, remainingQuantity + "");
                                    values.put(colmnName, Double.parseDouble(rs.getString(colmnName)) + "#" + quantity);
                                }
                            } else {
                                U.log("values map ===>>>>" + colmnName + "====" + rs.getString(colmnName));
                                values.put(colmnName, rs.getString(colmnName));
                                fileId.add(rs.getString(colmnName));

                            }
                        }
                    }

                    System.out.println("remainingcount==>" + remainingQuantity);
                    //if quantity is zero so not display in list
                    if (remainingQuantity > 0 || (executeFlag!=null && executeFlag.equalsIgnoreCase("T"))) {
                        itemList.add(values);
                    }

                } while (rs.next());
//                System.out.println("hello harsh");
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

                        if (rs.getBinaryStream("store_file_LRAW") != null) {
                            imgStream = rs.getBinaryStream("store_file_LRAW");
                        } else {
                            imgStream = getClass().getResourceAsStream("/defualtDp.png");
                        }

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

    public double findTotalQuantityFromContract(String updateKey, String slno, String tcode) {

        PreparedStatement ps = null;
        ResultSet rs = null;
        double quantity = 0;
        //for last DO quantity
//        String qtySql = "select AQTYORDER from " + table_name + " where CONTRACT_VRNO='" + updateKey + "' and contract_slno='" + slno + "'";
//fOR TCODE =6
//        String qtySql = "select AQTYORDER from " + table_name + " where QUOTATION_VRNO='" + updateKey + "' and QUOTATION_slno='" + slno + "' ";//" AND  QUOTATION_TCODE  ='" + TCODE + "'";
        String qtySql = null;
//        System.out.println(" TABLE : "+table_name + " EN : "+ ENTITYCODE +" VRNO : "+ updateKey );
//        System.out.println("EXE -- " + executeQtyQry);
        if (executeQtyQry != null && !executeQtyQry.equalsIgnoreCase("")) {
            qtySql = executeQtyQry;
            qtySql = qtySql.replaceAll("'ENTITY_CODE'", "'" + ENTITYCODE + "'");
            qtySql = qtySql.replaceAll("'TABLE_NAME'", table_name);
            qtySql = qtySql.replaceAll("'VRNO'", "'" + updateKey + "'");
            qtySql = qtySql.replaceAll("'TCODE'", "'" + tcode + "'");
            qtySql = qtySql.replaceAll("'SLNO'", "'" + slno + "'");
        } else {
            if (tcode.equalsIgnoreCase("6")) {
                qtySql = "select AQTYORDER from " + table_name + " where QUOTATION_VRNO='" + updateKey + "' and QUOTATION_slno='" + slno + "' ";//" AND  QUOTATION_TCODE  ='" + TCODE + "'";
            } else {
//            qtySql = "select AQTYORDER from " + table_name + " where CONTRACT_VRNO='" + updateKey + "' and contract_slno='" + slno + "'";
                qtySql = "select SUM(NVL(AQTYORDER, 0)-NVL(B.QTYCANCELLED, 0)) from " + table_name + " B where /* B.ENTITY_CODE = '" + ENTITYCODE + "' AND */  CONTRACT_VRNO='" + updateKey + "' AND B.CONTRACT_TCODE = '" + tcode + "' "
                        + "AND B.CONTRACT_AMENDNO = (SELECT MAX(CONTRACT_AMENDNO) FROM ORDER_BODY B1 WHERE B1.ENTITY_CODE = B.ENTITY_CODE AND B1.CONTRACT_VRNO = B.CONTRACT_VRNO AND B.CONTRACT_TCODE = B1.CONTRACT_TCODE) and contract_slno='" + slno + "'";
            }
        }

        System.out.println("qtySql----------- " + qtySql);
//        U.log(tcode + " --- qtysql=" + qtySql);
        try {
            ps = connection.prepareStatement(qtySql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    if (rs.getString(1) != null && rs.getString(1).trim() != "") {
                        quantity = Double.parseDouble(rs.getString(1));
                    }
                } while (rs.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return quantity;
    }

    public String dependentRowLogic(DyanamicRecordsListModel drlm, String itemCode) {
        String result = null;
        try {
            String query = drlm.getDependent_row_logic();

            if (drlm.getColumn_name().equalsIgnoreCase("UM") || drlm.getColumn_name().equalsIgnoreCase("AUM")) {
//                U.log(drlm.getColumn_name() + "<==dependent_row_logic==>" + query);
                query = query + "'" + itemCode + "'";
                PreparedStatement ps = connection.prepareStatement(query);
                ResultSet rs1 = ps.executeQuery();

                if (rs1 != null && rs1.next()) {
                    result = rs1.getString(1);
                }
            } else {
                //select lhs_utility.get_gst_item_rate('ENTITYCODE','ACCCODE','ITEMCODE', 'GSTCODE', DELIVERYTOSLNO, TRIM(SYSDATE),'rateid', 'TAXCODE')   from dual  
                //forWhichcolmn=TAX_RATE&whereClauseValue=MP#12192#2701#FG0001001#DA064#IG06&uniquKey=6.2
                if (drlm.getColumn_name().contains("TAX_RATE")) {
                    ValueClassModel model = new ValueClassModel();
                    try {
                        JDBCDependentRowLogicDAO dao = new JDBCDependentRowLogicDAO(connection);
                        findParamValueFromOrderHead(UPDATE_KEY);
                        U.log("whereclauseValue==>>" + ENTITYCODE + "#" + DELIVERYTOSLNO + "#" + GSTCODE + "#" + itemCode + "#" + ACCCODE + "#" + STAXCODE);
                        model = dao.getRowVal(SEQNO, drlm.getColumn_name(), ENTITYCODE + "#" + DELIVERYTOSLNO + "#" + GSTCODE + "#" + itemCode + "#" + ACCCODE + "#" + STAXCODE, "", "");
                        result = model.getValue();
                    } catch (Exception e) {
                        U.errorLog(e);
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
//        U.log(drlm.getColumn_name() + "<==dependent_row_logic RESULT==>" + result);
        return result;
    }

    public void findParamValueFromOrderHead(String updateKey) {
        String query = "select delivery_to_slno,stax_code,acc_code from order_head where vrno='" + UPDATE_KEY_VALUE + "'";
        U.log("param value from head table=>" + query);
        try {
            PreparedStatement ps = connection.prepareStatement(query);
            ResultSet rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                DELIVERYTOSLNO = rs.getString(1);
                STAXCODE = rs.getString(2);
                ACCCODE = rs.getString(3);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<String> getDependentValues(String[] dependentRows, List<DyanamicRecordsListModel> drlmArr) {
//        for (String s : dependentRows) {
//            System.out.println("~~~~~~~" + s);
//        }
        List<String> dependentValues = new ArrayList<String>();
        for (String dependentRow : dependentRows) {
            for (DyanamicRecordsListModel drlm : drlmArr) {
                if (drlm.getColumn_name().equalsIgnoreCase(dependentRow)) {
                    System.out.println("DRLM-Col Name : " + drlm.getColumn_name() + " VALUE :" + drlm.getValue() + "CODE : " + drlm.getCodeOfValue());
                    if (drlm.getItem_help_property().equalsIgnoreCase("L")) {
                        dependentValues.add(drlm.getCodeOfValue());
                    } else {
                        dependentValues.add((String) drlm.getValue());
                    }
                }
            }
        }

        return dependentValues;
    }

}
