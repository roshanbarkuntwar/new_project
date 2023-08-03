/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.RecordInfoJSON;
import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
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
import java.sql.Statement;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCGetRecordDetailDAO {

    Connection c;
    String USER_CODE = "";
    String sysdate = null;
    String onlyDate = null;
    String onlyTime = null;
    String onlyTime24Hr = null;
    String onlyTime12Hr = null;
    String onlyTime24HrAMPM = null;
    String onlyTime12HrAMPM = null;
    public LinkedHashMap<String, ArrayList<String>> defaultPopulateResultMap = new LinkedHashMap<String, ArrayList<String>>();

    public JDBCGetRecordDetailDAO(Connection c) {
        this.c = c;
    }

    public List<DyanamicRecordsListModel> getRecordDetailForUpdateForm(String seqNo, String userCode, int seqId, int fileId) throws SQLException {
        USER_CODE = userCode.toUpperCase();
        JDBCDisplayNewEntryDAO dao = new JDBCDisplayNewEntryDAO(c);
        HashMap<String, String> objList;
        HashMap<String, String> objListEmpty;
//        objListEmpty = dao.displayDyanamicEntryDetailEmpty(userCode, seqId, fileId);
//        objList = dao.displayDyanamicEntryDetail(userCode, seqId, fileId);
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {
            String sql = " select sysdate,f.store_file,seq_no,Table_name,column_name,\n"
                    + "column_desc,column_type,column_size,column_catg,column_default_value,\n"
                    + "nullable,status,entry_by_user,updation_process , dependent_row,column_validate,\n"
                    + "Dependent_row_logic,item_help_property,REF_LOV_TABLE_COL,REF_LOV_WHERE_CLAUSE,\n"
                    + "column_select_list_value,nullable from  LHSSYS_PORTAL_UPLOAD_FILE f,LHSSYS_PORTAL_DATA_DSC_UPDATE\n"
                    + "where seq_no=" + seqNo + " and f.file_id=" + fileId;
            System.out.println("GET ADD ENTRY FORM SQL : " + sql);
            preparedStatement = c.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    sysdate = resultSet.getString("sysdate");
                    SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
                    Date d = (Date) formatter.parse(sysdate);
                    sysdate = formatter.format(d);

                    onlyDate = resultSet.getString("sysdate");
                    SimpleDateFormat formatter1 = new SimpleDateFormat("dd-MM-yyyy");
                    Date d1 = (Date) formatter1.parse(onlyDate);
                    onlyDate = formatter1.format(d1);

                    onlyTime = resultSet.getString("systemdate");
                    SimpleDateFormat toFullDate = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
                    Date fullDate = toFullDate.parse(onlyTime);
                    SimpleDateFormat Hr24 = new SimpleDateFormat("HH:mm:ss");
                    SimpleDateFormat Hr12 = new SimpleDateFormat("hh:mm:ss");
                    SimpleDateFormat Hr24AMPM = new SimpleDateFormat("HH:mm:ss a");
                    SimpleDateFormat Hr12AMPM = new SimpleDateFormat("hh:mm:ss a");
                    onlyTime24Hr = Hr24.format(fullDate);
                    onlyTime12Hr = Hr12.format(fullDate);
                    onlyTime24HrAMPM = Hr24AMPM.format(fullDate);
                    onlyTime12HrAMPM = Hr12AMPM.format(fullDate);

                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    InputStream imgStream = null;

                    if (resultSet.getBlob("store_file") != null) {
                        imgStream = resultSet.getBlob("store_file").getBinaryStream();
                    } else {
                        imgStream = getClass().getResourceAsStream("/defualtDp.png");
                    }

                    String column_catg = (resultSet.getString("Column_catg"));
                    if (column_catg != null) {
                        preparedStatement = c.prepareStatement("select " + column_catg + " columnHeading from dual");
                        ResultSet rs = preparedStatement.executeQuery();
                        if (rs != null && rs.next()) {
                            do {
                                column_catg = rs.getString("columnHeading");
                            } while (rs.next());
                        }
                    } else {
                        column_catg = "";
                    }
                    model.setColumn_catg(column_catg);

                    if (resultSet.getString("Column_DESC").toLowerCase().contains("Entry Format Seq".toLowerCase())) {
//                        U.log("Default value : " + resultSet.getString("Column_default_value"));
                        model.setValue(resultSet.getString("Column_default_value"));
                    } else if (resultSet.getString("Column_default_value") != null) {
                        String defaultValue = resultSet.getString("Column_default_value");
                        String columnName = resultSet.getString("column_name");
                        String columnType = resultSet.getString("column_type");
                        if ((defaultValue.equalsIgnoreCase("sysdate") || defaultValue.equalsIgnoreCase("'sysdate'")) && !columnName.contains("LASTUPDATE")) {
                            if (columnType.equals("DATE")) {
                                model.setValue(onlyDate);
                            } else if (columnType.equals("TIME24HR")) {
                                model.setValue(onlyTime24Hr);
                            } else if (columnType.equals("TIME12HR")) {
                                model.setValue(onlyTime12Hr);
                            } else if (columnType.equals("TIME24HRAMPM")) {
                                model.setValue(onlyTime24HrAMPM);
                            } else if (columnType.equals("TIME12HRAMPM")) {
                                model.setValue(onlyTime12HrAMPM);
                            } else {
                                model.setValue(sysdate);
                            }
                        } else if (defaultValue.contains("USER_CODE")) {
                            model.setValue(USER_CODE);
                        }
                    } else {
//                        model.setValue((objList.get(resultSet.getString("Column_name"))));
                    }
//                    model.setCodeOfValue((objListEmpty.get(resultSet.getString("Column_name"))));
                    if (resultSet.getString("Column_DESC").toLowerCase().contains("Upload File".toLowerCase())) {
                        model.setValue(Base64.encode(Util.getImgstreamToBytes(imgStream)));
                    }
                    model.setColumn_default_value(resultSet.getString("Column_default_value"));
                    model.setColumn_desc(resultSet.getString("Column_desc"));
                    model.setColumn_name(resultSet.getString("Column_name"));
                    model.setColumn_size(resultSet.getString("Column_size"));
                    model.setColumn_type(resultSet.getString("Column_type"));
                    model.setEntry_by_user(resultSet.getString("Entry_by_user"));
                    model.setNullable(resultSet.getString("Nullable"));
                    model.setStatus(resultSet.getString("Status"));
                    model.setTable_name(resultSet.getString("Table_name"));
                    model.setUpdation_process(resultSet.getString("Updation_process"));

                    if (resultSet.getString("dependent_row") != null) {
                        sql = "select column_name from LHSSYS_PORTAL_DATA_DSC_UPDATE where slno=" + resultSet.getString("dependent_row");
                        preparedStatement = c.prepareStatement(sql);
                        ResultSet RS = preparedStatement.executeQuery();
                        if (RS != null && RS.next()) {
                            model.setDependent_row(RS.getString("column_name"));
                        }
                    } else {
                        model.setDependent_row(resultSet.getString("dependent_row"));
                    }

                    model.setItem_help_property(resultSet.getString("item_help_property"));
                    model.setREF_LOV_TABLE_COL(resultSet.getString("REF_LOV_TABLE_COL"));
                    model.setREF_LOV_WHERE_CLAUSE(resultSet.getString("REF_LOV_WHERE_CLAUSE"));
                    model.setColumn_select_list_value(resultSet.getString("column_select_list_value"));
                    model.setDependent_row_logic(resultSet.getString("Dependent_row_logic"));
                    model.setColumn_validate(resultSet.getString("column_validate"));
                    model.setSLNO(resultSet.getString("SLNO"));

                    if (resultSet.getString("item_help_property").contains("H") || resultSet.getString("item_help_property").contains("D")) {
                        String selectquery = resultSet.getString("column_select_list_value");
                        selectquery = "select " + selectquery + " from dual";
                        PreparedStatement ps2 = c.prepareStatement(selectquery);
                        ResultSet rs2 = ps2.executeQuery();
                        if (rs2 != null && rs2.next()) {
                            model.setDropdownVal(rs2.getString(1));
                        }
                        if (ps2 != null) {
                            try {
                                ps2.close();
                            } catch (SQLException e) {
                                System.out.println("exeception ---> " + e.getMessage());
                            }
                        }
                    }

                    if (resultSet.getString("REF_LOV_TABLE_COL") != null) {
                        model.getLOV(c, seqNo);
                    }
                    String status = resultSet.getString("Status");
                    if (resultSet.getString("Status") != null && !status.contains("F")) {
                        list.add(model);
                    }
                } while (resultSet.next());
                return list;
            }
        } catch (SQLException e) {
            System.out.println("exeception ---> " + e.getMessage());
        } catch (ParseException e) {
            System.out.println("exeception ---> " + e.getMessage());
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    System.out.println("exeception ---> " + e.getMessage());
                }
            }
        }
        return list;
    }

    public RecordInfoJSON recordsDetail(String entity, String seqNo, String userCode, String accCode, String searchText, String sqlFlag) throws ParseException {
        RecordInfoJSON json = new RecordInfoJSON();

        String[] populatedColumnName = null;
        int defaultPopulateRowCount = 1;
        String defaultPopulateDataSql = null;
        USER_CODE = userCode.toUpperCase();
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String entityCode = null;
        String sqldata = "";
        String EMPCODE = "";
        String newFormInstanceQuery = "";
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {

            PreparedStatement ps9 = c.prepareStatement("SELECT EMP_CODE from USER_MAST U WHERE U.USER_CODE ='" + userCode + "'");
            ResultSet rs9 = ps9.executeQuery();
            if (rs9 != null && rs9.next()) {
                EMPCODE = rs9.getString(1);
            }
            System.out.println("EMP_CODE = " + EMPCODE);
            String firstScreen = "select TO_CHAR(sysdate, 'DD-MM-YYYY  HH24:MI:SS') as systemdate,"
                    + " t.* from LHSSYS_PORTAL_TABLE_DSC_UPDATE t where t.seq_no=" + seqNo;
            preparedStatement = c.prepareStatement(firstScreen);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                sysdate = resultSet.getString("systemdate");
                onlyDate = resultSet.getString("systemdate");
                SimpleDateFormat formatter1 = new SimpleDateFormat("dd-MM-yyyy");
                Date d1 = (Date) formatter1.parse(onlyDate);
                onlyDate = formatter1.format(d1);

                try {
                    onlyTime = resultSet.getString("systemdate");
                    SimpleDateFormat toFullDate = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
                    Date fullDate = toFullDate.parse(onlyTime);
                    SimpleDateFormat Hr24 = new SimpleDateFormat("HH:mm:ss");
                    SimpleDateFormat Hr12 = new SimpleDateFormat("hh:mm:ss");
                    SimpleDateFormat Hr24AMPM = new SimpleDateFormat("HH:mm:ss a");
                    SimpleDateFormat Hr12AMPM = new SimpleDateFormat("hh:mm:ss a");
                    onlyTime24Hr = Hr24.format(fullDate);
                    onlyTime12Hr = Hr12.format(fullDate);
                    onlyTime24HrAMPM = Hr24AMPM.format(fullDate);
                    onlyTime12HrAMPM = Hr12AMPM.format(fullDate);
                } catch (Exception e) {
                }
                defaultPopulateDataSql = resultSet.getString("default_populate_data");
                entityCode = resultSet.getString("entity_code_str");
                try {
                    newFormInstanceQuery = resultSet.getString("new_form_instance");

                    String newFormInstance = "";
                    System.out.println("newFormInstanceQuery: " + newFormInstanceQuery);
                    System.out.println("STATUS : " + newFormInstanceQuery != null && !newFormInstanceQuery.isEmpty() && !newFormInstanceQuery.equals(""));
                    if (newFormInstanceQuery != null && !newFormInstanceQuery.isEmpty() && !newFormInstanceQuery.equals("")) {
                        newFormInstanceQuery = newFormInstanceQuery.replace("'USER_CODE'", "'" + USER_CODE + "'").replace("'EMPCODE'", "'" + EMPCODE + "'");
                        System.out.println("newFormInstanceQuery: after replace " + newFormInstanceQuery);
                        try {
                            PreparedStatement ps = c.prepareStatement(newFormInstanceQuery);
                            ResultSet rsNewForm = ps.executeQuery();
                            if (rsNewForm != null && rsNewForm.next()) {
//                            newFormInstance = rsNewForm.getString(1);
                            } else {
//                            newFormInstance = "";
                            }

                        } catch (Exception e) {
//                    U.log("New Form Instance Exception !!" + e.getMessage());
                            String ValidatedMsgArr[] = e.getMessage().split(":");
                            String ValidatedMsgArr1[] = ValidatedMsgArr[1].trim().split("ORA-");
                            newFormInstance = ValidatedMsgArr1[0].trim();
                            json.setNewFormInstance(newFormInstance);
                        }
                    } else {
                        json.setNewFormInstance("T#OK");
                    }
                } catch (Exception e) {
                    U.log("NEW FORM INSTANCE NOT FOUND..!");
                    json.setNewFormInstance("T#OK");
                }
            }
            if (defaultPopulateDataSql != null) {
                U.log("defaultPopulateDataSql :  " + defaultPopulateDataSql.replace("user_code", USER_CODE));
                U.log("defaultPopulateDataSql searchText : " + searchText);
                if (defaultPopulateDataSql.contains("'COL0'")) {
                    String[] whereClauseValArray = searchText.split("#");
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
                        defaultPopulateDataSql = defaultPopulateDataSql.replaceAll("COL" + i, whereClauseValArray[i]);
                    }
                } else if (searchText.contains(",")) {
                    String splitedSearchText[] = searchText.split(", ");
                    int splitedSearchTextCount = splitedSearchText.length;
                    StringBuffer buildedSearchText = new StringBuffer();
                    for (int i = 0; i < splitedSearchTextCount; i++) {
                        if (i == splitedSearchTextCount - 1) {
                            buildedSearchText.append("'").append(splitedSearchText[i]).append("'");
                        } else {
                            buildedSearchText.append("'").append(splitedSearchText[i]).append("',");
                        }
                    }
                    defaultPopulateDataSql = defaultPopulateDataSql.replaceAll(Pattern.quote("searchtext"), buildedSearchText.toString());
                } else if (searchText.contains("#") || searchText.contains("~~")) {
                    String splitedSearchText[] = searchText.split("#");
                    int splitedSearchTextCount = splitedSearchText.length;
                    StringBuffer buildedSearchText = new StringBuffer();
                    for (int i = 0; i < splitedSearchTextCount; i++) {
                        buildedSearchText.append("'").append(splitedSearchText[i].replaceAll("~~", "#")).append("'");
                    }
                    defaultPopulateDataSql = defaultPopulateDataSql.replaceAll(Pattern.quote("searchtext"), buildedSearchText.toString());
                    String replacedDefaultPopulateDataSql = "";
                    String[] defaultPopulateDataArray = defaultPopulateDataSql.split("#");
                    if (searchText != null) {
                        String[] searchTextArray = searchText.split("#");
                        for (int i = 0; i < defaultPopulateDataArray.length; i++) {
                            if (i < searchTextArray.length) {
                                if (defaultPopulateDataArray[i].contains("like")) {
                                    replacedDefaultPopulateDataSql = replacedDefaultPopulateDataSql + "" + defaultPopulateDataArray[i] + " '%" + searchTextArray[i].replaceAll("~~", "#") + "%' ";
                                } else {
                                    replacedDefaultPopulateDataSql = replacedDefaultPopulateDataSql + "" + defaultPopulateDataArray[i] + " '" + searchTextArray[i].replaceAll("~~", "#") + "' ";
                                }
                            } else {
                                replacedDefaultPopulateDataSql = replacedDefaultPopulateDataSql + " " + defaultPopulateDataArray[i];
                            }
                        }
                    }
                    defaultPopulateDataSql = replacedDefaultPopulateDataSql;
                    System.out.println("defaultPopulateDataSql=====================" + defaultPopulateDataSql);
                } else {
                    String splitedSearchText[] = searchText.split(", ");
                    int splitedSearchTextCount = splitedSearchText.length;
                    StringBuilder buildedSearchText = new StringBuilder();
                    for (int i = 0; i < splitedSearchTextCount; i++) {
                        if (i == splitedSearchTextCount - 1) {
                            buildedSearchText.append("'").append(splitedSearchText[i]).append("'");
                        } else {
                            buildedSearchText.append("'").append(splitedSearchText[i]).append("',");
                        }
                    }
                    defaultPopulateDataSql = defaultPopulateDataSql.replaceAll(Pattern.quote("searchtext"), buildedSearchText.toString());
                }
                defaultPopulateDataSql = defaultPopulateDataSql.replace("user_code", USER_CODE);
                U.log("Replaced defaultPopulateDataSql  : " + defaultPopulateDataSql);
                try {
                    if (sqlFlag != null && !sqlFlag.isEmpty()) {
                        System.out.println("sqlFlag---> " + sqlFlag);
                        if (sqlFlag.equals("T")) {
                            sqldata = sqldata + "---------Populate Data Sql----------\n ";
                            sqldata = sqldata + defaultPopulateDataSql + "\n";
                            json.setSqlData(sqldata);
                        }
                    }
                } catch (Exception e) {
                    System.out.println("exeception ---> " + e.getMessage());
                }
                try {
                    preparedStatement = c.prepareStatement(defaultPopulateDataSql);
                    resultSet = preparedStatement.executeQuery();
                    ResultSetMetaData md = resultSet.getMetaData();
                    int clCount = md.getColumnCount();
                    for (int i = 1; i <= clCount; i++) {
                        defaultPopulateResultMap.put(md.getColumnName(i), new ArrayList<String>());
                    }
                    if (resultSet != null && resultSet.next()) {
                        do {
                            for (int i = 1; i <= clCount; i++) {
                                defaultPopulateResultMap.get(md.getColumnName(i)).add(resultSet.getString(i));
                            }
                        } while (resultSet.next());
                    }
                    defaultPopulateRowCount = defaultPopulateResultMap.get(md.getColumnName(1)).size();
                } catch (Exception e) {
                    System.out.println("exeception ---> " + e.getMessage());
                }
            }

            String sql = " select u.*,t.dependent_next_entry_seq from LHSSYS_PORTAL_DATA_DSC_UPDATE u ,LHSSYS_PORTAL_table_DSC_UPDATE t\n"
                    + "where u.seq_no=" + seqNo + "and t.seq_no=" + seqNo + "  order by COLUMN_SLNO";
            System.out.println("GET ADD ENTRY FORM SQL : " + sql);
            preparedStatement = c.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    String column_catg = resultSet.getString("Column_catg");
                    if (column_catg != null) {
                        model.setColumn_catg(column_catg);
                    } else {
                        column_catg = "";
                    }
                    if (resultSet.getString("Column_DESC").toLowerCase().contains("Entry Format Seq".toLowerCase())) {
                        model.setValue(resultSet.getString("Column_default_value"));
                    } else if (resultSet.getString("Column_default_value") != null) {
                        String defaultValue = resultSet.getString("Column_default_value");
                        String columnName = resultSet.getString("column_name");
                        String columnType = resultSet.getString("column_type");
                        if (defaultValue.contains("DAY")) {
                            PreparedStatement ps;
                            ResultSet rs;
                            String getDaySQLValue = "";
                            String getDaySQL = "select SUBSTR(to_char(sysdate, 'DAY'), 1, 3) from dual";
                            ps = c.prepareStatement(getDaySQL);
                            rs = ps.executeQuery();
                            if (rs != null && rs.next()) {
                                getDaySQLValue = rs.getString(1);
                                System.out.println("getDaySQL VALUE : " + getDaySQLValue);
                            }
                            model.setValue(getDaySQLValue);
                        } else if (defaultValue.contains("LHSSYS_CALENDER_SCHEDULER")) {
                            PreparedStatement ps;
                            ResultSet rs;
                            String getEMPLocationSQLValue = "";
                            String getEMPLocationSQL = "SELECT T.LOCATION || '#'|| T.GEO_CODE FROM LHSSYS_CALENDER_SCHEDULER \n"
                                    + "T WHERE T.USER_CODE = '" + USER_CODE + "' AND T.TASK_DATE = SUBSTR(to_char(sysdate,'dd-Mon-yy'), 1, 9) \n"
                                    + "AND T.GEO_CODE IS NOT NULL";
                            System.out.println("getEMPLocation SQL : " + getEMPLocationSQL);
                            ps = c.prepareStatement(getEMPLocationSQL);
                            rs = ps.executeQuery();
                            if (rs != null && rs.next()) {
                                getEMPLocationSQLValue = rs.getString(1);
                                System.out.println("getEMPLocation VALUE : " + getEMPLocationSQLValue);
                            }
                            model.setValue(getEMPLocationSQLValue);
                        } else if ((defaultValue.equalsIgnoreCase("sysdate") || defaultValue.equalsIgnoreCase("'sysdate'")) && !columnName.contains("LASTUPDATE")) {
//                            model.setValue(sysdate);
                            if (columnType.equals("DATE")) {
                                model.setValue(onlyDate);
                            } else if (columnType.equals("TIME24HR")) {
                                model.setValue(onlyTime24Hr);
                            } else if (columnType.equals("TIME12HR")) {
                                model.setValue(onlyTime12Hr);
                            } else if (columnType.equals("TIME24HRAMPM")) {
                                model.setValue(onlyTime24HrAMPM);
                            } else if (columnType.equals("TIME12HRAMPM")) {
                                model.setValue(onlyTime12HrAMPM);
                            } else {
                                model.setValue(sysdate);
                            }
                        } else if (defaultValue.contains("CONFIG_AUTO_ENTRY") || defaultValue.contains("USER_RIGHTS")) {
                            System.out.println("GET DEFAULT VR SERIES SQL : " + defaultValue);
                            defaultValue = defaultValue.replace("USERCODE", USER_CODE);
                            String projectSql = defaultValue;
                            System.out.println("GET DEFAULT VR SERIES SQL : " + projectSql);

                            Statement st = c.createStatement();
                            ResultSet defaultRs = st.executeQuery(projectSql);
                            String vrSeries = "";
                            String vrSeriesName = "";
                            if (defaultRs != null && defaultRs.next()) {
                                vrSeries = defaultRs.getString(1);
                                vrSeriesName = defaultRs.getString(2);
                            }
                            model.setValue(vrSeriesName);
                            model.setCodeOfValue(vrSeries);
                        } else if (defaultValue.contains("shift_mast")) {
                            String projectSql = defaultValue;
                            System.out.println("GET DEFAULT SHIFT SQL : " + projectSql);
                            Statement st = c.createStatement();
                            ResultSet defaultRs = st.executeQuery(projectSql);
                            String vrSeries = "";
                            String vrSeriesName = "";
                            if (defaultRs != null && defaultRs.next()) {
                                vrSeries = defaultRs.getString(1);
                                vrSeriesName = defaultRs.getString(2);
                            }
                            model.setValue(vrSeriesName);
                            model.setCodeOfValue(vrSeries);
                        } else if (defaultValue.contains("USER_CODE")) {
                            model.setValue(USER_CODE);
                        } else if (defaultValue.contains("EMP_CODE")) {
                            String getEMPCODE_SQL = "select EMP_CODE from user_mast where user_code='" + USER_CODE + "'";
                            Statement st = c.createStatement();
                            ResultSet defaultRs = st.executeQuery(getEMPCODE_SQL);
                            String EMP_CODE = "";
                            if (defaultRs != null && defaultRs.next()) {
                                EMP_CODE = defaultRs.getString(1);
                                model.setValue(EMP_CODE);
                            }
                        } else if (defaultValue.contains("PROJECT_STR")) {
                            String projectSql = "select project_str from user_mast where user_code='" + USER_CODE + "'";
                            U.log("PROJECT_STR SQL :  " + projectSql);
                            Statement st = c.createStatement();
                            ResultSet defaultRs = st.executeQuery(projectSql);
                            String whereclause = "";
                            if (defaultRs != null && defaultRs.next()) {
                                whereclause = defaultRs.getString(1);
                            }
                            if (whereclause != null) {
                                LOV lov = new LOV();
                                lov.setREF_LOV_TABLE_COL(resultSet.getString("REF_LOV_TABLE_COL"));
                                StringBuffer lovSqll = new StringBuffer();
                                String lovSql = lov.createLOVsql(c);
                                String[] parts = lovSql.split("~~");
                                String part2 = parts[1];
                                lovSqll.append(part2);
                                U.log(resultSet.getString("REF_LOV_TABLE_COL") + "  ===  " + lovSql);
                                lovSqll.append("and cost_code='").append(whereclause).append("'");
                                if (resultSet.getString("order_clause") != null) {
                                    lovSqll.append(" order by ").append(resultSet.getString("order_clause")).append("");
                                }
                                U.log(" GET PROJECT_STR SQL :   " + lovSqll);
                                Statement st1 = c.createStatement();
                                ResultSet defaultRs1 = st1.executeQuery(lovSqll.toString());
                                if (defaultRs1 != null && defaultRs1.next()) {
                                    model.setValue(defaultRs1.getString(2));
                                    model.setCodeOfValue(defaultRs1.getString(1));
                                }
                            }
                        } else if (defaultValue.contains("retailer_seq")) {
                            String projectSql = "select nextval('retailer_seq')";
                            Statement st = c.createStatement();
                            ResultSet defaultRs = st.executeQuery(projectSql);
                            String retailer_seq = "";
                            if (defaultRs != null && defaultRs.next()) {
                                retailer_seq = defaultRs.getString(1);
                            }
                            model.setValue(retailer_seq);
                        } else if (defaultValue.contains("(")
                                && defaultValue.contains(")")
                                && !defaultValue.contains("get_generate_code_TBL")) {
                            String projectSql = "select " + defaultValue + " from dual";
                            System.out.println("accCode : " + accCode);
                            projectSql = projectSql.replace("acc_code')", accCode + "')");
                            projectSql = projectSql.replace("'USER_CODE'", "'" + accCode + "'");
                            System.out.println("sqlll==" + projectSql);
                            Statement st = c.createStatement();
                            ResultSet defaultRs = st.executeQuery(projectSql);
                            String retailer_seq = "";
                            if (defaultRs != null && defaultRs.next()) {
                                retailer_seq = defaultRs.getString(1);
                                U.log("retailer_seq  : " + retailer_seq);
                            }
                            if (retailer_seq != null && !retailer_seq.isEmpty()) {
                                if (retailer_seq.contains("~")) {
                                    model.setValue(retailer_seq.split("~")[0].trim());
                                    model.setCodeOfValue(retailer_seq.split("~")[1].trim());
                                } else {
                                    model.setValue(retailer_seq);
                                }
                            } else {
                                model.setValue("");
                            }
                        } else if (defaultValue.contains("ACC_FOLLOW_TRAN_SEQ")) {
                            String seqSql = "select acc_follow_tran_seq.nextval from dual";
                            String seq = "";
                            try {
                                PreparedStatement ps1 = c.prepareStatement(seqSql);
                                ResultSet rs1 = ps1.executeQuery();
                                if (rs1.next()) {
                                    seq = rs1.getString(1);
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                            model.setValue(seq);
                        } else if (defaultValue != null) {
                            model.setValue(resultSet.getString("Column_default_value"));
                        }
                    }

                    model.setColumn_default_value(resultSet.getString("Column_default_value"));
                    model.setColumn_desc(resultSet.getString("Column_desc"));
                    model.setColumn_name(resultSet.getString("Column_name"));
                    model.setColumn_size(resultSet.getString("Column_size"));
                    model.setColumn_type(resultSet.getString("Column_type"));
                    model.setEntry_by_user(resultSet.getString("Entry_by_user"));
                    model.setNullable(resultSet.getString("Nullable"));
                    model.setStatus(resultSet.getString("Status"));
                    model.setTable_name(resultSet.getString("Table_name"));
                    model.setUpdation_process(resultSet.getString("Updation_process"));
                    model.setDependent_nulable_logic(resultSet.getString("dependent_nulable_logic"));
                    model.setHeading_flag(resultSet.getString("heading_flag"));
                    model.setAuto_calculation(resultSet.getString("auto_calculation"));
                    model.setDependent_next_entry_seq(resultSet.getString("dependent_next_entry_seq"));
                    model.setSession_column_flag(resultSet.getString("session_column_flag"));
                    model.setSummary_function_flag(resultSet.getString("Summary_function_flag"));
                    model.setDependent_column_name(resultSet.getString("dependent_column_name"));
                    if (resultSet.getString("dependent_row") != null) {
                        String dependentRowArray[] = resultSet.getString("dependent_row").split("#");
                        String dependentRowString = "";
                        for (int i = 0; i < dependentRowArray.length; i++) {
                            if (i != 0) {
                                dependentRowString = dependentRowString + "," + dependentRowArray[i];
                            } else {
                                dependentRowString = dependentRowString + dependentRowArray[i];
                            }
                        }
                        sql = "select column_name, slno from LHSSYS_PORTAL_DATA_DSC_UPDATE where slno in \n"
                                + "(" + dependentRowString + ") and seq_no=" + seqNo;
                        preparedStatement = c.prepareStatement(sql);
                        ResultSet RS = preparedStatement.executeQuery();
                        String dependentRowColumn = resultSet.getString("dependent_row");
                        String[] queryDepArr = dependentRowColumn.split("#");
                        String[] queryDepArrVal = queryDepArr;
                        int count = 0;
                        if (RS != null && RS.next()) {
                            do {
                                for (int i = 0; i < queryDepArr.length; i++) {
                                    if (queryDepArr[i].equalsIgnoreCase(RS.getString("slno"))) {
                                        queryDepArrVal[i] = RS.getString("column_name");
                                    }
                                }
                                if (count != 0) {
                                    dependentRowColumn = dependentRowColumn + "#" + RS.getString("column_name");
                                } else {
                                    dependentRowColumn = RS.getString("column_name");
                                }
                                count++;
                            } while (RS.next());
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
                        model.setDependent_row(resultSet.getString("dependent_row"));
                    }
                    if (resultSet.getString("query_dependent_row") != null) {
                        String dependentRowArray[] = resultSet.getString("query_dependent_row").split("#");
                        String dependentRowString = "";
                        for (int i = 0; i < dependentRowArray.length; i++) {
                            if (i != 0) {
                                dependentRowString = dependentRowString + "," + dependentRowArray[i];
                            } else {
                                dependentRowString = dependentRowString + dependentRowArray[i];
                            }
                        }
                        sql = "select column_name, slno from LHSSYS_PORTAL_DATA_DSC_UPDATE where slno in \n"
                                + "(" + dependentRowString + ") and seq_no=" + seqNo;
                        preparedStatement = c.prepareStatement(sql);
                        ResultSet RS = preparedStatement.executeQuery();
                        String dependentRowColumn = resultSet.getString("query_dependent_row");

                        String[] queryDepArr = dependentRowColumn.split("#");
                        String[] queryDepArrVal = queryDepArr;
                        int count = 0;
                        if (RS != null && RS.next()) {
                            do {
                                for (int i = 0; i < queryDepArr.length; i++) {
                                    if (queryDepArr[i].equalsIgnoreCase(RS.getString("slno"))) {
                                        queryDepArrVal[i] = RS.getString("column_name");
                                    }
                                }
                                if (count != 0) {
                                    dependentRowColumn = dependentRowColumn + "#" + RS.getString("column_name");
                                } else {
                                    dependentRowColumn = RS.getString("column_name");
                                }
                                count++;
                            } while (RS.next());
                        }

                        String val = "";
                        for (int i = 0; i < queryDepArr.length; i++) {
                            if (i != 0) {
                                val = val + "#" + queryDepArrVal[i];
                            } else {
                                val = queryDepArrVal[i];
                            }
                        }
                        model.setQuery_dependent_row(val);
                    } else {
                        model.setQuery_dependent_row(resultSet.getString("query_dependent_row"));
                    }

                    if (resultSet.getString("item_help_property") != null) {
                        String IHP = resultSet.getString("item_help_property");
                        if (IHP.contains("#")) {
                            String IHP_data[] = IHP.split("#");
                            model.setItem_help_property(IHP_data[0]);
                            if (IHP_data[1].contains("~")) {
                                String nextPageData[] = IHP_data[1].split("~");
                                String nextPageFirstScreen = nextPageData[0];
                                String nextPageSeqNo = nextPageData[1];
                                String nextPageButtonLabel = nextPageData[2];
                                model.setNextPageFirstScreen(nextPageFirstScreen);
                                model.setNextPageSeqNo(nextPageSeqNo);
                                model.setNextPageButtonName(nextPageButtonLabel);
                            }

                        } else {
                            model.setItem_help_property(resultSet.getString("item_help_property"));
                        }

                    }
                    model.setREF_LOV_TABLE_COL(resultSet.getString("REF_LOV_TABLE_COL"));
                    model.setREF_LOV_WHERE_CLAUSE(resultSet.getString("REF_LOV_WHERE_CLAUSE"));
                    model.setColumn_select_list_value(resultSet.getString("column_select_list_value"));
                    model.setDependent_row_logic(resultSet.getString("Dependent_row_logic"));
                    model.setFrom_value(resultSet.getString("From_value"));
                    model.setTo_value(resultSet.getString("To_value"));
                    model.setEditor_flag(resultSet.getString("Editor_flag"));
                    model.setExcel_upload(resultSet.getString("Excel_upload"));
                    model.setDecimal_digit(resultSet.getString("Decimal_digits"));
                    model.setData_type(resultSet.getString("COLUMN_MASTER_REF_FLAG"));// COLUMN_MASTER_REF_FLAG
                    model.setTool_tip(resultSet.getString("Tool_tip"));

                    if (resultSet.getString("column_validate") != null && resultSet.getString("DATA_SAVE_ERROR_MESSAGE") != null) {
                        String dependentRowColumn = "";
                        String columnValidateSQL = resultSet.getString("column_validate");
                        String columnValidateArrCols[] = null;
                        String columnValidateArr[] = null;
                        if (columnValidateSQL.contains("~~")) {
                            columnValidateArr = columnValidateSQL.split("~~");
                            columnValidateArrCols = columnValidateArr[1].split("#");
                            dependentRowColumn = columnValidateArr[1];
                        } else {
                            columnValidateArrCols = resultSet.getString("DATA_SAVE_ERROR_MESSAGE").split("#");
                        }

                        String dependentRowString = "";
                        for (int i = 0; i < columnValidateArrCols.length; i++) {
                            if (i != 0) {
                                dependentRowString = dependentRowString + "," + columnValidateArrCols[i];
                            } else {
                                dependentRowString = dependentRowString + columnValidateArrCols[i];
                            }
                        }
                        sql = "select column_name, slno from LHSSYS_PORTAL_DATA_DSC_UPDATE where slno in \n"
                                + "(" + dependentRowString + ") and seq_no=" + seqNo;
                        System.out.println("columnValidateArrColsSQL : " + sql);

                        preparedStatement = c.prepareStatement(sql);
                        ResultSet RS = preparedStatement.executeQuery();
                        int count = 0;
                        if (RS != null && RS.next()) {
                            do {
                                for (int i = 0; i < columnValidateArrCols.length; i++) {
                                    if (columnValidateArrCols[i].equalsIgnoreCase(RS.getString("slno"))) {
                                        columnValidateArrCols[i] = RS.getString("column_name");
                                    }
                                }
                                if (count != 0) {
                                    dependentRowColumn = dependentRowColumn + "#" + RS.getString("column_name");
                                } else {
                                    dependentRowColumn = RS.getString("column_name");
                                }
                                count++;
                            } while (RS.next());
                        }

                        String val = "";
                        for (int i = 0; i < columnValidateArrCols.length; i++) {
                            if (i != 0) {
                                val = val + "#" + columnValidateArrCols[i];
                            } else {
                                val = columnValidateArrCols[i];
                            }
                        }
                        model.setColumn_validate(val);
                    } else {
                        model.setColumn_validate(resultSet.getString("column_validate"));
                    }
                    model.setSLNO(resultSet.getString("SLNO"));
                    if (resultSet.getString("column_select_list_value") != null
                            && resultSet.getString("item_help_property").equals("H")
                            || resultSet.getString("item_help_property").equals("D") || resultSet.getString("item_help_property").equals("MD")) {
                        String selectquery = resultSet.getString("column_select_list_value");
                        selectquery = selectquery.replace("USER_CODE", USER_CODE);
                        selectquery = "select " + selectquery + " from dual";

                        System.out.println("selectquery:  " + selectquery);

                        PreparedStatement ps2 = c.prepareStatement(selectquery);
                        ResultSet rs2 = ps2.executeQuery();
                        if (rs2 != null && rs2.next()) {
                            model.setDropdownVal(rs2.getString(1));
                        }
                    } else if (resultSet.getString("item_help_property") != null && resultSet.getString("item_help_property").contains("AS")) {
                        JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
                        String autoCompleteString = dao.getAutoCompleteData(seqNo, resultSet.getString("Column_name"), "", userCode);
                        model.setDropdownVal(autoCompleteString);
                    }
                    String status = resultSet.getString("Status");
                    if (resultSet.getString("Status") != null && !status.contains("F")) {
                        list.add(model);
                    }
                } while (resultSet.next());
                json.setRecordsInfo(list);
                json.setDefaultPopulateData(defaultPopulateResultMap);
                json.setSeqNo(seqNo);
                return json;
            }
        } catch (SQLException e) {
            U.log(e);
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    U.log(e);
                }
            }
        }
        return json;
    }

    public RecordInfoJSON reportFilterDetail(String entity, String seqNo, String userCode) {
        RecordInfoJSON json = new RecordInfoJSON();
        USER_CODE = userCode.toUpperCase();
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        ResultSet rss = null;
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {
            String sysdateSQL = "select TO_CHAR(SYSDATE, 'DD-MM-YYYY  HH24:MI:SS') as systemdate,TO_CHAR(SYSDATE, 'DD-MM-YYYY') as ONLY_DATE from dual";
            U.log("sysdateSQL : " + sysdateSQL);
            preparedStatement = c.prepareStatement(sysdateSQL);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                sysdate = resultSet.getString("systemdate");
                onlyDate = resultSet.getString("ONLY_DATE");
            }

            String sql = " select  DISTINCT P.* from LHSSYS_PORTAL_table_DSC_UPDATE t, LHSSYS_ALERT_DIRECT_EMAIL E, LHSSYS_ALERT_DIRECT_EMAIL_PARA P"
                    + " where E.seq_ID = " + seqNo + "   and P.seq_ID = " + seqNo + "   and P.ITEM_HELP_PROPERTY != 'X' order by COLUMN_SLNO";
            U.log("REPORT FILTER DETAILS SQL :  " + sql);
            preparedStatement = c.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();
            String getFilterDataSQL = "SELECT * FROM LHSSYS_ALERT_DIRECT_EMAIL_USER L WHERE L.SEQ_ID='" + seqNo + "'  AND L.USER_CODE = '" + userCode + "'";
            System.out.println("getFilterDataSQL : " + getFilterDataSQL);
            PreparedStatement ps = c.prepareStatement(getFilterDataSQL);
            rss = ps.executeQuery();
            if (rss != null) {
                rss.next();
            }
            int loopCount = 1;
            if (resultSet != null && resultSet.next()) {
                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    if (resultSet.getString("para_default_value") != null) {
                        String defaultValue = resultSet.getString("para_default_value");
                        String columnName = resultSet.getString("para_desc");
                        String columnType = resultSet.getString("DATA_TYPE");
                        if ((defaultValue.equalsIgnoreCase("sysdate") || defaultValue.equalsIgnoreCase("'sysdate'")) && !columnName.contains("LASTUPDATE")) {
                            if (columnType.equals("DATE")) {
                                model.setValue(onlyDate);
                            } else {
                                model.setValue(sysdate);
                            }
                        } else if (defaultValue.contains("USER_CODE")) {
                            model.setValue(USER_CODE);
                        } else if (defaultValue.contains("EMP_CODE")) {
                            String getEMPCODE_SQL = "select EMP_CODE from user_mast where user_code='" + USER_CODE + "'";
                            Statement st = c.createStatement();
                            ResultSet defaultRs = st.executeQuery(getEMPCODE_SQL);
                            String EMP_CODE = "";
                            if (defaultRs != null && defaultRs.next()) {
                                EMP_CODE = defaultRs.getString(1);
                                model.setValue(EMP_CODE);
                            }
                        } else if (defaultValue.contains("PROJECT_STR")) {
                            String projectSql = "select project_str from user_mast where user_code='" + USER_CODE + "'";
                            preparedStatement = c.prepareStatement(projectSql);
                            ResultSet defaultRs = preparedStatement.executeQuery();
                            String whereclause = "";
                            try {
                                if (defaultRs != null && defaultRs.next()) {
                                    whereclause = defaultRs.getString(1);
                                }
                            } finally {
                                if (defaultRs != null) {
                                    try {
                                        defaultRs.close();
                                    } catch (SQLException e) {
                                    }
                                }
                            }
                            if (whereclause != null) {
                                LOV lov = new LOV();
                                lov.setREF_LOV_TABLE_COL(resultSet.getString("REF_LOV_TABLE_COL"));
                                StringBuffer lovSql = new StringBuffer();
                                lovSql.append(lov.createLOVsql(c));
                                U.log(resultSet.getString("REF_LOV_TABLE_COL") + "  <===>   " + lovSql.toString());
                                lovSql.append("and cost_code='").append(whereclause).append("'");
                                if (resultSet.getString("order_clause") != null) {
                                    lovSql.append(" order by ").append(resultSet.getString("order_clause")).append("");
                                }
                                U.log("GET LOV SQL :    " + lovSql);
                                preparedStatement = c.prepareStatement(lovSql.toString());
                                ResultSet defaultRs1 = preparedStatement.executeQuery();
                                try {
                                    if (defaultRs1 != null && defaultRs1.next()) {
                                        model.setValue(defaultRs1.getString(2));
                                        model.setCodeOfValue(defaultRs1.getString(1));
                                    }
                                } finally {
                                    if (defaultRs1 != null) {
                                        try {
                                            defaultRs1.close();
                                        } catch (SQLException e) {
                                        }
                                    }
                                }
                            }
                        } else if (defaultValue != null) {
                            try {
                                String count = resultSet.getString("slno");
                                String val = rss.getString("PARA_DEFAULT_VALUE" + count);
                                if (val != null && !val.isEmpty()) {
                                    model.setValue(val);
                                } else {
                                    model.setValue(resultSet.getString("para_default_value"));
                                }
                            } catch (SQLException e) {
                                model.setValue(resultSet.getString("para_default_value"));
                            }
                        }
                    } else {
                        try {
                            String count = resultSet.getString("slno");
                            model.setValue(rss.getString("PARA_DEFAULT_VALUE" + count));
                        } catch (SQLException e) {
                            model.setValue("");
                        }
                    }

                    model.setPara_default_value(resultSet.getString("Para_default_value"));
                    model.setPara_desc(resultSet.getString("Para_desc"));
                    model.setColumn_size(resultSet.getString("Column_size"));
                    model.setData_type(resultSet.getString("Data_type"));
                    model.setEntry_by_user(resultSet.getString("Entry_by_user"));
                    model.setNullable(resultSet.getString("Nullable"));
                    model.setStatus(resultSet.getString("Status"));
                    model.setPara_column(resultSet.getString("para_column"));
                    if (resultSet.getString("dependent_row") != null) {
                        String dependentRowArray[] = resultSet.getString("dependent_row").split("#");
                        String dependentRowString = "";
                        for (int i = 0; i < dependentRowArray.length; i++) {
                            if (i != 0) {
                                dependentRowString = dependentRowString + "," + dependentRowArray[i];
                            } else {
                                dependentRowString = dependentRowString + dependentRowArray[i];
                            }
                        }
                        sql = "select para_column from LHSSYS_ALERT_DIRECT_EMAIL_PARA where slno in \n"
                                + "(" + dependentRowString + ") and seq_id=" + seqNo;
                        preparedStatement = c.prepareStatement(sql);
                        ResultSet RS = preparedStatement.executeQuery();
                        String dependentRowColumn = "";
                        int count = 0;
                        try {
                            if (RS != null && RS.next()) {
                                do {
                                    if (count != 0) {
                                        dependentRowColumn = dependentRowColumn + "#" + RS.getString("para_column");
                                    } else {
                                        dependentRowColumn = RS.getString("para_column");
                                    }
                                    count++;
                                } while (RS.next());
                            }
                            model.setDependent_row(dependentRowColumn);
                        } finally {
                            if (RS != null) {
                                try {
                                    RS.close();
                                } catch (SQLException e) {
                                }
                            }
                        }
                    } else {
                        model.setDependent_row(resultSet.getString("dependent_row"));
                    }
                    model.setItem_help_property(resultSet.getString("item_help_property"));
                    model.setREF_LOV_TABLE_COL(resultSet.getString("REF_LOV_TABLE_COL"));
                    model.setREF_LOV_WHERE_CLAUSE(resultSet.getString("REF_LOV_WHERE_CLAUSE"));
                    model.setColumn_select_list_value(resultSet.getString("column_select_list_value"));
                    model.setFrom_value(resultSet.getString("From_value"));
                    model.setTo_value(resultSet.getString("To_value"));
                    model.setSLNO(resultSet.getString("SLNO"));
                    model.setShowDataInReportHead(resultSet.getString("rep_para_name"));
                    //for dropdown (D)or H
                    if (resultSet.getString("column_select_list_value") != null && resultSet.getString("item_help_property").contains("H")
                            || resultSet.getString("item_help_property").contains("D") || resultSet.getString("item_help_property").contains("MD")) {
                        String selectquery = resultSet.getString("column_select_list_value");
                        selectquery = selectquery.replace("USER_CODE", USER_CODE);
                        selectquery = "select " + selectquery + " from dual";
                        preparedStatement = c.prepareStatement(selectquery);
                        ResultSet rs2 = preparedStatement.executeQuery();
                        try {
                            if (rs2 != null && rs2.next()) {
                                model.setDropdownVal(rs2.getString(1));
                            }
                        } finally {
                            if (rs2 != null) {
                                try {
                                    rs2.close();
                                } catch (SQLException e) {
                                }
                            }
                        }
                    }
                    String status = resultSet.getString("status");
                    if (resultSet.getString("Status") != null && !status.contains("F")) {
                        list.add(model);
                    }
                    loopCount++;
                } while (resultSet.next());
                json.setRecordsInfo(list);
                json.setDefaultPopulateData(defaultPopulateResultMap);
                json.setSeqNo(seqNo);
                return json;
            }

        } catch (Exception e) {
            U.log(e);
        } finally {
            if (resultSet != null && rss != null) {
                try {
                    resultSet.close();
                    rss.close();
                } catch (SQLException e) {
                }
            }
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (Exception e) {
                    System.out.println("EXCEPTION----> " + e.getMessage());
                }
            }
        }
        return json;
    }
    public RecordInfoJSON updateErpApprovalDetails(String entity, String seqNo, String userCode, String slno) {
        RecordInfoJSON json = new RecordInfoJSON();
        USER_CODE = userCode.toUpperCase();
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {
            String sysdateSQL = "select TO_CHAR(SYSDATE, 'DD-MM-YYYY  HH24:MI:SS') as systemdate,TO_CHAR(SYSDATE, 'DD-MM-YYYY') as ONLY_DATE from dual";
            U.log("sysdateSQL : " + sysdateSQL);
            preparedStatement = c.prepareStatement(sysdateSQL);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                sysdate = resultSet.getString("systemdate");
                onlyDate = resultSet.getString("ONLY_DATE");
            }
            String sql = "select P.*  from lhssys_alert_direct_email a, lhssys_alert_direct_email_para p where a.seq_id = p.seq_id and a.flag = 'T'"
                    + " and p.status = 'T' and p.seq_id = '" + seqNo + "' and p.slno = '" + slno + "' order by p.column_slno";
            U.log("REPORT FILTER DETAILS SQL :  " + sql);
            preparedStatement = c.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();

            int loopCount = 1;
            if (resultSet != null && resultSet.next()) {
                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    if (resultSet.getString("para_default_value") != null) {
                        String defaultValue = resultSet.getString("para_default_value");
                        String columnName = resultSet.getString("para_desc");
                        String columnType = resultSet.getString("DATA_TYPE");
                        if ((defaultValue.equalsIgnoreCase("sysdate") || defaultValue.equalsIgnoreCase("'sysdate'")) && !columnName.contains("LASTUPDATE")) {
                            if (columnType.equals("DATE")) {
                                model.setValue(onlyDate);
                            } else {
                                model.setValue(sysdate);
                            }
                        } else if (defaultValue.contains("USER_CODE")) {
                            model.setValue(USER_CODE);
                        } else if (defaultValue.contains("EMP_CODE")) {
                            String getEMPCODE_SQL = "select EMP_CODE from user_mast where user_code='" + USER_CODE + "'";
                            Statement st = c.createStatement();
                            ResultSet defaultRs = st.executeQuery(getEMPCODE_SQL);
                            String EMP_CODE = "";
                            if (defaultRs != null && defaultRs.next()) {
                                EMP_CODE = defaultRs.getString(1);
                                model.setValue(EMP_CODE);
                            }
                        } else if (defaultValue.contains("PROJECT_STR")) {
                            String projectSql = "select project_str from user_mast where user_code='" + USER_CODE + "'";
                            preparedStatement = c.prepareStatement(projectSql);
                            ResultSet defaultRs = preparedStatement.executeQuery();
                            String whereclause = "";
                            try {
                                if (defaultRs != null && defaultRs.next()) {
                                    whereclause = defaultRs.getString(1);
                                }
                            } finally {
                                if (defaultRs != null) {
                                    try {
                                        defaultRs.close();
                                    } catch (SQLException e) {
                                    }
                                }
                            }
                            if (whereclause != null) {
                                LOV lov = new LOV();
                                lov.setREF_LOV_TABLE_COL(resultSet.getString("REF_LOV_TABLE_COL"));
                                StringBuffer lovSql = new StringBuffer();
                                lovSql.append(lov.createLOVsql(c));
                                U.log(resultSet.getString("REF_LOV_TABLE_COL") + "  <===>   " + lovSql.toString());
                                lovSql.append("and cost_code='").append(whereclause).append("'");
                                if (resultSet.getString("order_clause") != null) {
                                    lovSql.append(" order by ").append(resultSet.getString("order_clause")).append("");
                                }
                                U.log("GET LOV SQL :    " + lovSql);
                                preparedStatement = c.prepareStatement(lovSql.toString());
                                ResultSet defaultRs1 = preparedStatement.executeQuery();
                                try {
                                    if (defaultRs1 != null && defaultRs1.next()) {
                                        model.setValue(defaultRs1.getString(2));
                                        model.setCodeOfValue(defaultRs1.getString(1));
                                    }
                                } finally {
                                    if (defaultRs1 != null) {
                                        try {
                                            defaultRs1.close();
                                        } catch (SQLException e) {
                                        }
                                    }
                                }
                            }
                        } else if (defaultValue != null) {
                            try {
                                String count = resultSet.getString("slno");
                                model.setValue(resultSet.getString("para_default_value"));
                            } catch (SQLException e) {
                                model.setValue(resultSet.getString("para_default_value"));
                            }
                        }
                    } else {
                        try {
                            String count = resultSet.getString("slno");
                        } catch (SQLException e) {
                            model.setValue("");
                        }
                    }

                    model.setPara_default_value(resultSet.getString("Para_default_value"));
                    model.setPara_desc(resultSet.getString("Para_desc"));
                    model.setColumn_size(resultSet.getString("Column_size"));
                    model.setData_type(resultSet.getString("Data_type"));
                    model.setEntry_by_user(resultSet.getString("Entry_by_user"));
                    model.setNullable(resultSet.getString("Nullable"));
                    model.setStatus(resultSet.getString("Status"));
                    model.setPara_column(resultSet.getString("para_column"));
                    if (resultSet.getString("dependent_row") != null) {
                        String dependentRowArray[] = resultSet.getString("dependent_row").split("#");
                        String dependentRowString = "";
                        for (int i = 0; i < dependentRowArray.length; i++) {
                            if (i != 0) {
                                dependentRowString = dependentRowString + "," + dependentRowArray[i];
                            } else {
                                dependentRowString = dependentRowString + dependentRowArray[i];
                            }
                        }
                        sql = "select para_column from LHSSYS_ALERT_DIRECT_EMAIL_PARA where slno in \n"
                                + "(" + dependentRowString + ") and seq_id=" + seqNo;
                        preparedStatement = c.prepareStatement(sql);
                        ResultSet RS = preparedStatement.executeQuery();
                        String dependentRowColumn = "";
                        int count = 0;
                        try {
                            if (RS != null && RS.next()) {
                                do {
                                    if (count != 0) {
                                        dependentRowColumn = dependentRowColumn + "#" + RS.getString("para_column");
                                    } else {
                                        dependentRowColumn = RS.getString("para_column");
                                    }
                                    count++;
                                } while (RS.next());
                            }
                            model.setDependent_row(dependentRowColumn);
                        } finally {
                            if (RS != null) {
                                try {
                                    RS.close();
                                } catch (SQLException e) {
                                }
                            }
                        }
                    } else {
                        model.setDependent_row(resultSet.getString("dependent_row"));
                    }
                    model.setItem_help_property(resultSet.getString("item_help_property"));
                    model.setREF_LOV_TABLE_COL(resultSet.getString("REF_LOV_TABLE_COL"));
                    model.setREF_LOV_WHERE_CLAUSE(resultSet.getString("REF_LOV_WHERE_CLAUSE"));
                    model.setColumn_select_list_value(resultSet.getString("column_select_list_value"));
                    model.setFrom_value(resultSet.getString("From_value"));
                    model.setTo_value(resultSet.getString("To_value"));
                    model.setSLNO(resultSet.getString("SLNO"));
                    model.setShowDataInReportHead(resultSet.getString("rep_para_name"));
                    //for dropdown (D)or H
                    if (resultSet.getString("column_select_list_value") != null && resultSet.getString("item_help_property").contains("H")
                            || resultSet.getString("item_help_property").contains("D") || resultSet.getString("item_help_property").contains("MD")) {
                        String selectquery = resultSet.getString("column_select_list_value");
                        selectquery = selectquery.replace("USER_CODE", USER_CODE);
                        selectquery = "select " + selectquery + " from dual";
                        preparedStatement = c.prepareStatement(selectquery);
                        ResultSet rs2 = preparedStatement.executeQuery();
                        try {
                            if (rs2 != null && rs2.next()) {
                                model.setDropdownVal(rs2.getString(1));
                            }
                        } finally {
                            if (rs2 != null) {
                                try {
                                    rs2.close();
                                } catch (SQLException e) {
                                }
                            }
                        }
                    }
                    String status = resultSet.getString("status");
                    if (resultSet.getString("Status") != null && !status.contains("F")) {
                        list.add(model);
                    }
                    loopCount++;
                } while (resultSet.next());
                json.setRecordsInfo(list);
                json.setDefaultPopulateData(defaultPopulateResultMap);
                json.setSeqNo(seqNo);
                return json;
            }

        } catch (Exception e) {
            U.log(e);
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (Exception e) {
                    System.out.println("EXCEPTION----> " + e.getMessage());
                }
            }
        }
        return json;
    }
    
     public HashMap<String, String> updateErpApprovalData(String entity, String seqNo, String userCode, String slno, String updateKey, String value) {
        HashMap<String, String> res = new HashMap<String, String>();
        String updateErpApprovalDataSql = "select P.*  from lhssys_alert_direct_email a, lhssys_alert_direct_email_para p where a.seq_id = p.seq_id and a.flag = 'T'"
                + " and p.status = 'T' and p.seq_id = '" + seqNo + "'and slno = '" + slno + "' order by p.column_slno";
        PreparedStatement ps, ps1;
        ResultSet rs;
        int i = 0;
        String updateQry;
        try {
            ps = c.prepareStatement(updateErpApprovalDataSql);
            rs = ps.executeQuery();
            try {
                if (rs != null && rs.next()) {
                    updateQry = rs.getString("SQL_TEXT");
                    System.out.println("UPDATE_QRY : " + updateQry);
                    if (updateKey != null && !updateKey.isEmpty()) {
                        JSONParser json_parser = new JSONParser();
                        JSONObject updateKeyStr = (JSONObject) json_parser.parse(updateKey);
                        Set<Object> set = updateKeyStr.keySet();
                        Iterator<Object> iterator = set.iterator();
                        while (iterator.hasNext()) {
                            Object key = iterator.next();
                            if (updateKeyStr.get(key) != null && !updateKeyStr.get(key).toString().isEmpty()) {
                                updateQry = updateQry.replaceAll("'" + key + "'", "'" + updateKeyStr.get(key) + "'");
                            } else {
                                updateQry = updateQry.replaceAll("'" + key + "'", "NULL");
                            }
                        }
                    }
                    updateQry = updateQry.replaceAll("VALUE", value);
                    System.out.println("UPDATE_QRY After Replace : " + updateQry);
                    ps1 = c.prepareStatement(updateQry);
                    i = ps1.executeUpdate();
                }
            } catch (Exception e) {
//                U.errorLog("exeception Inner---> " + e.getMessage());
            } finally {
                if (rs != null) {
                    try {
                        rs.close();
                    } catch (SQLException e) {
                    }
                }
            }
            U.log("rows updated:--> " + i);
            if (i > 0) {
                res.put("updateStatus", "success");
                res.put("msg", " Data updated successfully");
            } else {
                res.put("updateStatus", "success");
                res.put("msg", " Data Not updated");
            }
        } catch (Exception ex) {
            res.put("updateStatus", "error");
            res.put("msg", " Data Not updated Due to Exception ");
//            U.errorLog("exeception ---> " + ex.getMessage());
        }

        return res;
    }
}
