package com.lhs.EMPDR.restDAO;

import com.lhs.EMPDR.JSONResult.DataInfoListJSON;
import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
import com.lhs.EMPDR.dao.JDBCgetLOVDyanamicallyDAO;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import javax.xml.bind.DatatypeConverter;

/**
 *
 * @author akshay.kakde
 */
public class FindDataInfoArrayDAO {

    Connection connection;
    String table_name;
    String UPDATE_KEY;
    List<HashMap<String, String>> valuesList = new ArrayList<HashMap<String, String>>();
    HashMap<String, String> DefaultValues = new HashMap<String, String>();//col name,col value
    HashMap<String, byte[]> imgMap = new HashMap<String, byte[]>();
    HashMap<String, String> displayColList = new HashMap<String, String>();
    ArrayList<String> fileId = new ArrayList<String>();
    String order_clause = null;
    String sysdate = null;
    String imgDataType = "LONG";
    String USER_CODE = "";
    StringBuilder COLUMN_NAME_STR = new StringBuilder();
    String isAddonTempEntry = null;

    public FindDataInfoArrayDAO(Connection con) {
        this.connection = con;
    }

    public DataInfoListJSON getDataInfoList(String primaryKey, String seqNo, String isAddonTempTable, String userCode, String accCode, String entityCode, String tcode, String approvedby) throws SQLException {
        Date sysdate = new Date();

        SimpleDateFormat formatter = new SimpleDateFormat("MM-dd-yyyy");
        String formattedDate = formatter.format(sysdate);
        List<List<DyanamicRecordsListModel>> list = new ArrayList<List<DyanamicRecordsListModel>>();
        LinkedHashMap<String, ArrayList<String>> defData = new LinkedHashMap<String, ArrayList<String>>();
        DataInfoListJSON json = new DataInfoListJSON();

        list = getDataInfo(primaryKey, seqNo, userCode, accCode, entityCode, tcode, approvedby);
        try {
            defData = getPopulatedData(primaryKey);
        } catch (Exception e) {
        }
        if (defData != null && defData.size() > 0) {
            json.setDefaultPopulateData(defData);
        }
        json.setRecordsInfo(list);

        return json;
    }

    public List<DyanamicRecordsListModel> getColumnDetails(String seqNo, String userCode, String acccode) throws SQLException {
        PreparedStatement ps = null;
        ResultSet rs = null;
        StringBuffer sql1 = new StringBuffer();
        String[] DefualtvlaueForDropDownSql = null;
        COLUMN_NAME_STR = new StringBuilder();
        sql1.append("select u.*,TO_CHAR(sysdate, 'DD-MM-YYYY  HH24:MI:SS') as systemdate,t.dependent_next_entry_seq ,t.update_key,t.order_clause TABLE_DSC_ORDER_CLAUSE"
                + " from lhssys_portal_data_dsc_update u,lhssys_portal_table_dsc_update t where ");
        sql1.append("u.seq_no=" + seqNo + " and t.seq_no=" + seqNo + " and u.status not in ('F') order by u.column_slno");
        U.log("sql query=" + sql1.toString());
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {
            ps = connection.prepareStatement(sql1.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                U.log("update_key : " + UPDATE_KEY);
                U.log("order_clause : " + order_clause);

                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    table_name = rs.getString("table_name");
                    if (this.isAddonTempEntry != null) {
                        table_name = isAddonTempEntry;
                    }
//                    U.log("rs.getString(column_name)===" + rs.getString("column_name"));
                    String colname = rs.getString("column_name");
                    String coltype = rs.getString("column_type");
//                    if (colname.contains("APPROVED_BY")) {
//                        U.log("===approved_by=====");
//                        colname = "APPROVED_BY";
//                    }
//                    
                    displayColList.put(colname, coltype);

                    sysdate = rs.getString("systemdate");
                    UPDATE_KEY = rs.getString("update_key");
                    order_clause = rs.getString("TABLE_DSC_ORDER_CLAUSE");
                    if (this.isAddonTempEntry != null) {
                        UPDATE_KEY = "seq_id";
                    }
                    model.setColumn_desc(rs.getString("column_desc"));
                    model.setColumn_name(rs.getString("Column_name"));
                    model.setColumn_type(rs.getString("Column_type"));
                    model.setREF_LOV_TABLE_COL(rs.getString("Ref_lov_table_col"));

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
                                + "(" + dependentRowString + ") and seq_no=" + seqNo;
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
                            e.getMessage();
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
                    model.setColumn_validate(rs.getString("column_validate"));
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
                    //for drop down
                    if (rs.getString("item_help_property").contains("H") || rs.getString("item_help_property").equals("D")) {
                        String selectquery = rs.getString("column_select_list_value");

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

                                selectquery = selectquery.replace("USER_CODE", USER_CODE);

                                if (selectquery.toLowerCase().contains("select")) {
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
                            } catch (Exception e) {
                            }
                        }

                        PreparedStatement ps2 = connection.prepareStatement(selectquery);
                        try {
                            ResultSet rs2 = ps2.executeQuery();
                            if (rs2 != null && rs2.next()) {
                                model.setDropdownVal(rs2.getString(1));
                                String dropDownListStr = rs2.getString(1);
                                //Display Selected First value of dropdown
                                if (dropDownListStr.trim().length() > 1) {
                                    model.setValue(dropDownListStr.split("#")[0].split("~")[0]);
                                }
                            }
                        } catch (Exception e) {

                        }

                    } else if (rs.getString("item_help_property") != null && rs.getString("item_help_property").contains("AS")) {
                        JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(connection);
                        String autoCompleteString = dao.getAutoCompleteData(seqNo, rs.getString("Column_name"), "", userCode);
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
                        } else if (defaultValue.contains("ACC_CODE")) {
                            if (defaultValue.contains("select")) {
                                PreparedStatement pst = null;
                                ResultSet rset = null;
                                try {
                                    defaultValue = defaultValue.replace("ACC_CODE", acccode);

                                    pst = connection.prepareStatement(defaultValue);
                                    rset = pst.executeQuery();
                                    if (rset != null && rset.next()) {
                                        model.setValue(rset.getString(1));
                                    }
                                } catch (Exception ex) {
                                    ex.printStackTrace();
                                } finally {
                                    pst.close();
                                }
                            } else {
                                model.setValue(acccode);
                            }
                        }
                    }
                    String status = rs.getString("Status");
//                    U.log("status of column==>"+rs.getString("column_desc")+"<==>"+rs.getString("Status"));
                    if (rs.getString("Status") != null && !status.contains("F")) {
                        if (!status.contains("D") && !rs.getString("updation_process").toUpperCase().contains("N")) {
                            String columnName = rs.getString("column_name");
                            if (rs.getString("column_type").toUpperCase().equalsIgnoreCase("DATETIME")) {
                                if (rs.getString("column_default_value") != null && rs.getString("column_default_value").contains("sysdate")) {
                                    if (rs.getString("FIELD_FONT_NAME") != null && !rs.getString("FIELD_FONT_NAME").equals("")) {
                                        String function = rs.getString("FIELD_FONT_NAME");
                                        columnName = "TO_CHAR(" + function + ",'DD-MM-YYYY HH24:MI:SS') " + rs.getString("column_name");
                                    } else {
                                        columnName = "TO_CHAR(sysdate,'DD-MM-YYYY HH24:MI:SS') " + rs.getString("column_name");
                                    }
                                } else {
                                    columnName = "TO_CHAR(" + rs.getString("column_name") + ",'DD-MM-YYYY HH24:MI:SS') " + rs.getString("column_name");
                                }
                            }

                            if (rs.getString("column_type").toUpperCase().equalsIgnoreCase("DATE")) {
                                columnName = "TO_CHAR(" + rs.getString("column_name") + ",'DD-MM-YYYY') " + rs.getString("column_name");
                            }
                            if (rs.getString("FIELD_FONT_NAME") != null && !rs.getString("FIELD_FONT_NAME").equals("") && !rs.getString("column_type").contains("DATE")) {
                                String function = rs.getString("FIELD_FONT_NAME");
                                COLUMN_NAME_STR.append("(SELECT ").append(function).append(" FROM DUAL) ").append(columnName).append(",");
                            } else {
                                COLUMN_NAME_STR.append(columnName).append(",");
                            }
                        }

                        list.add(model);
                    }
                } while (rs.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            rs.close();
            ps.close();
        }
        return list;
    }

    public LinkedHashMap<String, ArrayList<String>> getPopulatedData(String updateKey) {
        LinkedHashMap<String, ArrayList<String>> defaultPopulateData = new LinkedHashMap<String, ArrayList<String>>();
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {

            String query1 = "select to_char(ENTRY_DATE,'dd-mm-yyyy') ENTRY_DATE\n"
                    + "  from lhssys_calender_scheduler\n"
                    + " where entry_date between\n"
                    + "       (select min(entry_date)\n"
                    + "          from lhssys_calender_scheduler where " + UPDATE_KEY + "='" + updateKey + "') AND\n"
                    + "       (select max(entry_date)\n"
                    + "          from lhssys_calender_scheduler where " + UPDATE_KEY + "='" + updateKey + "') and " + UPDATE_KEY + "='" + updateKey + "' order by entry_date";
            ps = connection.prepareStatement(query1);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                ArrayList<String> list1 = new ArrayList<String>();
                do {
                    list1.add(rs.getString("ENTRY_DATE"));
                } while (rs.next());
                if (list1 != null && list1.size() > 0) {
                    defaultPopulateData.put("ENTRY_DATE", list1);
                }
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
        return defaultPopulateData;
    }

    public List<List<DyanamicRecordsListModel>> getDataInfo(String updateKey, String seqNo, String userCode, String acccode, String entityCode, String tcode, String approvedby) throws SQLException {
        U.log("update key===>" + updateKey);
        PreparedStatement ps = null;
        ResultSet rs = null;
        StringBuffer sql1 = new StringBuffer();
        String[] DefualtvlaueForDropDownSql = null;
        USER_CODE = userCode.toUpperCase();
        List<List<DyanamicRecordsListModel>> dyanamicRecordsListModelList = new ArrayList<List<DyanamicRecordsListModel>>();

        getColumnDetails(seqNo, userCode, acccode);

        getValueOfEntry(updateKey + "", entityCode, tcode, approvedby, seqNo);
        U.log("Update keey  -->" + UPDATE_KEY);

        for (HashMap<String, String> values : valuesList) {
            
            List<DyanamicRecordsListModel> list2 = getColumnDetails(seqNo, userCode, acccode);
            List<DyanamicRecordsListModel> list1 = new ArrayList<DyanamicRecordsListModel>();
            for (int j = 0; j < list2.size(); j++) {
                DyanamicRecordsListModel model = list2.get(j);

                if (model.getColumn_type().contains("IMG") || model.getColumn_type().contains("VIDEO")) {
                    System.out.println("L LLLLLLLLLLL: "+ values.get(model.getColumn_name()));
//                    String file_id = values.get(model.getColumn_name());
//                    model.setValue(Base64.encode(imgMap.get(file_id)));
                    model.setValue(values.get(model.getColumn_name()));
                } else if (values.get(model.getColumn_name()) != null && !model.getColumn_name().contains("LASTUPDATE")) {
                    if (model.getColumn_type().equals("DATE")) {
//                        DateFormat parser = new SimpleDateFormat("yyyy-MM-dd");
//                        Date date;
//                        try {
//                            U.log("values.get(model.getColumn_name())==>>" + values.get(model.getColumn_name()));
//                            date = (Date) parser.parse(values.get(model.getColumn_name()));
//                            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
//                            String formattedDate = formatter.format(date);
//                            model.setValue(formattedDate);
//                        } catch (Exception ex) {
//                        }
                        model.setValue(values.get(model.getColumn_name()));
                    } else {
//                        U.log("11----->" + model.getColumn_name());
                        model.setValue(values.get(model.getColumn_name()));
                    }
                } else {
                    //for set defualt value if column not present in table
                    if (model.getColumn_default_value() != null) {
                        model.setValue(model.getColumn_default_value());
                    }
                }
                if (model.getColumn_default_value() != null && model.getColumn_name().equals("TCODE") && !(model.getColumn_name().equals("SLNO"))) {
                    model.setValue(model.getColumn_default_value());
                }

//                if (model.getItem_help_property().trim().equals("L") && values.get(model.getColumn_name()) != null) {
//                    String valueSql = "select lhs_utility.get_name('colName', colName) from tableName where colName='" + values.get(model.getColumn_name()) + "'";
//                    String colName = model.getREF_LOV_TABLE_COL();
//                    if (colName != null) {
//                        U.log("REF_LOV_TABLE_COL=" + model.getREF_LOV_TABLE_COL());
//                        String value = values.get(model.getColumn_name());
//                        valueSql = valueSql.replaceAll("colName", colName.split("\\.")[1]).replaceAll("tableName", colName.split("\\.")[0]);
//                        U.log("REF_LOV_TABLE_COL valueSql=" + valueSql);
//                        PreparedStatement ps2 = connection.prepareStatement(valueSql);
//                        ResultSet rs2 = ps2.executeQuery();
//                        if (rs2 != null && rs2.next()) {
//                            value = rs2.getString(1);
//                        }
//
//                        model.setValue(value);
//                        model.setCodeOfValue(values.get(model.getColumn_name()));
//                    }
//                }
                if (model.getItem_help_property().trim().equals("L") && values.get(model.getColumn_name()) != null) {
                    String valueSql = null;
                    String colName = model.getREF_LOV_TABLE_COL();
                    if (colName != null) {
                        U.log("REF_LOV_TABLE_COL=" + model.getREF_LOV_TABLE_COL());
                        String value = (String) values.get(model.getColumn_name());

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

                        model.setValue(value);
                        model.setCodeOfValue((String) values.get(model.getColumn_name()));
                    }
                }
                list1.add(model);
            }
            dyanamicRecordsListModelList.add(list1);
        }

        return dyanamicRecordsListModelList;
    }

    public void getValueOfEntry(String upadteKeyValue, String entityCode, String tcode, String approvedby, String seqNo) {
        InputStream imgStream = null;
        PreparedStatement ps = null;
        ResultSet rs;
        String columnNameList = COLUMN_NAME_STR.toString();
        U.log(columnNameList);
//        U.log("columnNameList.substring(columnNameList.length()-1)===>>" + columnNameList.substring(columnNameList.length() - 1));
        columnNameList = columnNameList.substring(0, columnNameList.length() - 1);
        StringBuffer sql = new StringBuffer();
        U.log("table name : " + table_name);
//        if (seqNo.equals("77.2") || seqNo.equals("78.2") || seqNo.equals("81.2") || seqNo.equals("79.2") || seqNo.equals("80.2") || seqNo.equals("82.2")
//                || seqNo.equals("54.2") || seqNo.equals("56.2") || seqNo.equals("55.2") || seqNo.equals("91.2") || seqNo.equals("92.2") || seqNo.equals("93.2")
//                || seqNo.equals("87.2") || seqNo.equals("88.2") || seqNo.equals("89.2") || seqNo.equals("83.2") || seqNo.equals("84.2") || seqNo.equals("85.2")
//                || seqNo.equals("122.2") || seqNo.equals("124.2") || seqNo.equals("121.2") || seqNo.equals("125.2")) {

//            if (columnNameList.contains("APPROVEDBY")) {
//                //String arr[] = columnNameList.split(",");
//                String getApprCrmFunc = null;
////        for(int i=0;i<arr.length;i++){
////            if(arr[i].equalsIgnoreCase("approvedby")){
//                getApprCrmFunc = "(select GET_APPROVEDBY_CRM(approvedby) from dual) APPROVEDBY";
////            }
////        }
//                columnNameList = columnNameList.replaceFirst("APPROVEDBY", getApprCrmFunc);
////        columnNameList = columnNameList.concat(",APPROVEDBY approved_by");
//
//            }
//            if (columnNameList.contains("APPR_STATUS")) {
//                columnNameList = columnNameList.replace("APPR_STATUS", "decode(APPR_STATUS, 'C' ,'Confirmed', 'A', 'Approved', 'R', 'Rejected', 'P', 'Pending','Pending') APPR_STATUS");
//            }
//            if (columnNameList.contains("APPROVEDDATE")) {
//                columnNameList = columnNameList.replaceFirst("APPROVEDDATE", "nvl(approveddate, lastupdate)");
//            }
        if (columnNameList.contains("APPROVEDBY APPROVED_BY")) {
            columnNameList = columnNameList.replace("APPROVEDBY APPROVED_BY", "APPROVEDBY || '#' || decode(APPR_STATUS,\n"
                    + "              'C',\n"
                    + "              'Confirmed',\n"
                    + "              'A',\n"
                    + "              'Approved',\n"
                    + "              'R',\n"
                    + "              'Rejected',\n"
                    + "              'P',\n"
                    + "              'Pending',\n"
                    + "              'Pending')\"APPROVEDBY APPROVED_BY\"");
        }

//        }
        if (table_name.equalsIgnoreCase("emp_tb_body")) {
            displayColList.put("ATTACHMENT", "IMG");
            sql = sql.append("select v.ENTITY_CODE,\n"
                    + "       v.TCODE,\n"
                    + "       v.VRNO,\n"
                    + "       TO_CHAR(VRDATE, 'DD-MM-YYYY') VRDATE,\n"
                    + "       TO_CHAR(EXPENSE_DATE, 'DD-MM-YYYY') EXPENSE_DATE,\n"
                    + "       GEO_CODE,\n"
                    + "       TO_GEO_CODE,\n"
                    + "       NAFHEAD,\n"
                    + "       RATE,\n"
                    + "       FC_AMT,\n"
                    + "       CURRENCY_CODE,\n"
                    + "       QTY,\n"
                    + "       v.REMARK,\n"
                    + "       v.SLNO,\n"
                    + "       a.attachment\n"
                    + "  from emp_tb_body v, (select * from emp_tb_attachment h where h.slno = 1) a\n"
                    + " where a.vrno(+) = v.vrno\n"
                    + " and v.slno = a.slno_tb_body(+)\n"
                    + " and v.vrno = '" + upadteKeyValue + "'");
        } else {
            sql.append("select " + columnNameList + " from " + table_name + " where ");
            sql.append(UPDATE_KEY + "='" + upadteKeyValue + "'");
        }
        if (table_name.equalsIgnoreCase("LHSSYS_APPR_TRAN")) {
            sql.append(" and entity_code='" + entityCode + "' and tcode='" + tcode + "' ");
        }

        if (order_clause != null) {
            sql.append(" order by " + order_clause);
        }
        if (table_name.equalsIgnoreCase("LHSSYS_APPR_TRAN")) {
            sql.append(" order by user_level");
        }
        U.log("update key==>" + UPDATE_KEY + "  VALUE==>" + upadteKeyValue);
        U.log("entry detail sql cards: " + sql.toString());
        try {
            ps = connection.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            ResultSetMetaData md = rs.getMetaData();
            int columnCount = md.getColumnCount();
            U.log("column_count==" + columnCount);
            InputStream imgData = null;
            if (rs != null && rs.next()) {
                do {
                    HashMap<String, String> values = new HashMap<String, String>();//col name,col value

                    for (int i = 1; i <= columnCount; i++) {
                        String colmnName = md.getColumnName(i);
//                        U.log("column name:::" + colmnName);
//                        U.log("displayColList (" + i + ")" + " - colname --> " + colmnName + " --- " + displayColList.get(colmnName));
                        if (displayColList.get(colmnName) != null) {

                            if (!displayColList.get(colmnName).contains("IMG")) {
                                if (colmnName.contains("DATE")) {

//                                    DateFormat parser = new SimpleDateFormat("yyyy-MM-dd");
//                                    Date date;
//                                    try {
//                                        date = (Date) parser.parse(rs.getString(colmnName));
//                                        SimpleDateFormat formatter = new SimpleDateFormat("MM-dd-yyyy");
//                                        String formattedDate = formatter.format(date);
//                                        values.put(colmnName, formattedDate);
//                                    } catch (Exception ex) {
//                                    }
                                    values.put(colmnName, rs.getString(colmnName));
                                } else {
//                                    U.log("column name --- "+colmnName+", columnValue --- "+rs.getString(colmnName));

                                    values.put(colmnName, rs.getString(colmnName));
                                }
                            } else if (colmnName.equalsIgnoreCase("attachment")) {
                                String imgBase64 = "";
                                if (rs.getBlob("attachment") != null) {
                                    System.out.println("--------if------");
//                                    imgData = rs.getBlob("attachment").getBinaryStream();
                                    Blob imgBlob = rs.getBlob("attachment");
                                    if (imgBlob != null) {
                                        byte[] imgByteArr = imgBlob.getBytes(1, (int) imgBlob.length());
                                        imgBase64 = DatatypeConverter.printBase64Binary(imgByteArr);
                                    }
                                } 
//                                    else {
//                                    System.out.println("~~~~~~~~~else~~~~~~~~~");
//                                    imgData = getClass().getResourceAsStream("/defualtDp.png");
//                                    byte[] imgByteArr = Util.getImgstreamToBytes(imgData);
//                                    imgBase64 = DatatypeConverter.printBase64Binary(imgByteArr);
//                                }
                                System.out.println("$$$$$$       " + imgData);
                                values.put(colmnName, imgBase64);
                            } else {
//                                U.log("columnname===>"+colmnName);
                                values.put(colmnName, rs.getString(colmnName));
                                fileId.add(rs.getString(colmnName));
                            }
                        } //                        else if(displayColList.get("APPROVEDBY APPROVED_BY")) {
                        //                            values.put(colmnName, rs.getString(colmnName));
                        //                        }
                        else if (colmnName != null) {
                            values.put(colmnName, rs.getString(colmnName));
                        }

                    }

                    valuesList.add(values);
                } while (rs.next());
//                HashMap<String, String> imgData = getImageData(seqNo, UPDATE_KEY, upadteKeyValue);
//                    Set set = (Set) imgData.entrySet();
//                    Iterator itr = set.iterator();
//                    while (itr.hasNext()) {
//                        Map.Entry mapEntry = (Map.Entry<String, Object>) itr.next();
//                        String imgKey = (String) mapEntry.getKey();
//                        String imgValue = (String) mapEntry.getValue();
//                        values.put(imgKey, imgValue);
//                    }
            }
//            getImageData(seqNo, UPDATE_KEY, upadteKeyValue);
            U.log("value List===>" + valuesList);
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

    public HashMap<String, String> getImageData(String seqNo, String updateKey, String updateKeyValue) {
        String imageData = "";
        String imgColumnName = "";
        String imgTableName = "";
        InputStream iss = null;
        HashMap<String, String> imgDataMap = new HashMap<String, String>();
        try {
            String imageDataColQry = "SELECT TABLE_NAME, COLUMN_NAME FROM LHSSYS_PORTAL_DATA_DSC_UPDATE U WHERE U.SEQ_NO = '" + seqNo + "' AND U.TABLE_NAME LIKE '%~%'";
            System.out.println("IMG SQL : " + imageDataColQry);
            PreparedStatement idcPs = connection.prepareStatement(imageDataColQry);
            ResultSet idcRs = idcPs.executeQuery();
            while (idcRs != null && idcRs.next()) {
                imgTableName = idcRs.getString(1).split("~")[0];
                imgColumnName = idcRs.getString(2);
                String imageDataQry = "select  " + imgColumnName + " from " + imgTableName + "  where  " + updateKey + "='" + updateKeyValue + "'";
                try {
                    PreparedStatement ps1 = connection.prepareStatement(imageDataQry);
                    ResultSet rs1 = ps1.executeQuery();
                    while (rs1 != null && rs1.next()) {
                        System.out.println("    TRUE  ");
                        iss = rs1.getBlob(1).getBinaryStream();
                        byte[] imgDataBase64 = Util.getImgstreamToBytes(iss);

                        System.out.println("IMAGE: " + imgDataBase64);
                        String imgDataStr = new String(imgDataBase64);
                        imgDataMap.put(imgColumnName, imgDataStr);
                        valuesList.add(imgDataMap);
                    }
                } catch (Exception e) {
                }

                System.out.println("IMG DATA QRY  = " + imageDataQry);

            }
        } catch (Exception e) {
        }

        return imgDataMap;
    }

}
