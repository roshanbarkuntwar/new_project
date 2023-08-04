/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.RecordInfoJSON;
import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
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
import java.sql.Statement;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
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
    public LinkedHashMap<String, ArrayList<Object>> defaultPopulateResultMap = new LinkedHashMap<String, ArrayList<Object>>();
    private String series;
    Util util;
    
    public JDBCGetRecordDetailDAO(Connection c) {
        this.c = c;
        U u = new U(this.c);
        util = new Util();
    }
    
    public List<DyanamicRecordsListModel> getRecordDetailForUpdateForm(String seqNo, String userCode, int seqId, int fileId) {
        USER_CODE = userCode.toUpperCase();
        JDBCDisplayNewEntryDAO dao = new JDBCDisplayNewEntryDAO(c);
        HashMap<String, String> objList = null;
        HashMap<String, String> objListEmpty = null;
        
        try {
            objListEmpty = dao.displayDyanamicEntryDetailEmpty(userCode, seqId, fileId);
        } catch (SQLException ex) {
            Logger.getLogger(JDBCGetRecordDetailDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        try {
            objList = dao.displayDyanamicEntryDetail(userCode, seqId, fileId);
        } catch (SQLException ex) {
            Logger.getLogger(JDBCGetRecordDetailDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        U.log(objList);
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {
            String sql = " select sysdate,f.store_file,seq_no,Table_name,column_name, "
                    + "column_desc,column_type,column_size,column_catg,column_default_value, "
                    + "nullable,status,entry_by_user,updation_process , dependent_row,column_validate, "
                    + "Dependent_row_logic,item_help_property,REF_LOV_TABLE_COL,REF_LOV_WHERE_CLAUSE, "
                    + "column_select_list_value,nullable,column_description from  LHSSYS_PORTAL_UPLOAD_FILE f,LHSSYS_PORTAL_DATA_DSC_UPDATE "
                    + "where seq_no=" + seqNo + " and f.file_id=" + fileId;
            U.log("GET ADD ENTRY FORM SQL 1: " + sql);
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
                    
                    U.log("Sysdate with time : " + sysdate);
                    U.log("Sysdate with out time : " + onlyDate);
                    
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
                    model.setColumn_description(resultSet.getString("column_description"));
                    if (resultSet.getString("Column_DESC").toLowerCase().contains("Entry Format Seq".toLowerCase())) {
                        U.log("Default value : " + resultSet.getString("Column_default_value"));
                        model.setValue(resultSet.getString("Column_default_value"));
                    } else if (resultSet.getString("Column_default_value") != null) {
                        String defaultValue = resultSet.getString("Column_default_value");
                        String columnName = resultSet.getString("column_name");
                        String columnType = resultSet.getString("column_type");
                        if (defaultValue.contains("sysdate") && !columnName.contains("LASTUPDATE")) {
                            if (columnType.equals("DATE")) {
                                model.setValue(onlyDate);
                            } else {
                                model.setValue(sysdate);
                            }
                        } else if (defaultValue.contains("USER_CODE")) {
                            model.setValue(USER_CODE);
                        }
                        
                    } else {
                        model.setValue((objList.get(resultSet.getString("Column_name"))));
                    }
                    model.setCodeOfValue((objListEmpty.get(resultSet.getString("Column_name"))));
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
                                U.errorLog(e);
                                
                            }
                        }
                    }
                    
                    if (resultSet.getString("REF_LOV_TABLE_COL") != null) {
                        model.getLOV(c, seqNo);
                    }
                    String status = resultSet.getString("Status");
                    if (resultSet.getString("Status") != null && !status.contains("F")) {
//                        U.log("Status : " + status + " Column name : " + model.getColumn_name());
                        list.add(model);
                    }
                } while (resultSet.next());
                return list;
            }
        } catch (SQLException e) {
            U.errorLog(e);
        } catch (ParseException e) {
            U.errorLog(e);
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    U.errorLog(e);
                }
            }
        }
        return list;
    }

//    public InputStream getInputStream(String stud_code) {
//        String imgQuery = "select photo from le_stud_photo_mast where stud_code='" + stud_code + "'";
//        ResultSet rs = null;
//        PreparedStatement ps = null;
//        try {
//            ps = con.prepareStatement(imgQuery);
//            rs = ps.executeQuery();
//            if (rs != null && rs.next()) {
//                return rs.getBlob("photo").getBinaryStream();
//            }
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//        return null;
//    }
    public RecordInfoJSON recordsDetail(String entity, String seqNo, String userCode, String accCode, String searchText, String sessionMapValueString, String geoOrgCode) throws ParseException {
        RecordInfoJSON json = new RecordInfoJSON();
//        List< List<DyanamicRecordsListModel>> populatedEntry = new ArrayList<List<DyanamicRecordsListModel>>();
        U.log("searchtext===>" + searchText);
        String displayScreen = null;
        String[] populatedColumnName = null;
        int defaultPopulateRowCount = 1;
        String defaultPopulateDataSql = null;
        USER_CODE = userCode.toUpperCase();
        String defualt_div_code = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String entityCode = null;
        String string_vrno = null;
        String acc_year = null;
        String first_screen = null;
        String access_control = null;
        String access_control_value = null;
        String[] DefualtvlaueForDropDownSql = null;
        String tcode = null;
        String EMPCODE = "";
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {
            
            PreparedStatement ps10 = c.prepareStatement("SELECT EMP_CODE from user_mast where user_code = '" + USER_CODE + "'");
            ResultSet rs10 = ps10.executeQuery();
            if (rs10 != null && rs10.next()) {
                EMPCODE = rs10.getString(1);
            }

//            TO_CHAR(sysdate, 'DD-MM-YYYY  HH24:MI:SS')
            String firstScreen = "select TO_CHAR(sysdate, 'DD-MM-YYYY  HH24:MI:SS') as systemdate,"
                    + "l.default_div_code,t.*,y.acc_year "
                    + "from LHSSYS_PORTAL_TABLE_DSC_UPDATE t,acc_year_mast y,"
                    + "view_default_user_links l where t.seq_no=" + seqNo + " and trunc(sysdate) between trunc(y.yrbegdate) and trunc(y.yrenddate) ";
//                    + " and y.entity_code=t.entity_code_str";
            U.log("firstScreen :" + firstScreen);
            preparedStatement = c.prepareStatement(firstScreen);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                sysdate = resultSet.getString("systemdate");
                onlyDate = resultSet.getString("systemdate");
                SimpleDateFormat formatter1 = new SimpleDateFormat("dd-MM-yyyy");
                Date d1 = (Date) formatter1.parse(onlyDate);
                onlyDate = formatter1.format(d1);
                displayScreen = resultSet.getString("first_screen");
                defualt_div_code = resultSet.getString("default_div_code");
                defaultPopulateDataSql = resultSet.getString("default_populate_data");
                entityCode = resultSet.getString("entity_code_str");
                acc_year = resultSet.getString("acc_year");
                first_screen = resultSet.getString("First_screen");
                access_control = resultSet.getString("access_control");
                
                try {
                    String newFormInstanceQuery = resultSet.getString("new_form_instance");
                    
                    String newFormInstance = "";
//                    System.out.println("newFormInstanceQuery: " + newFormInstanceQuery);
                    if (newFormInstanceQuery != null && !newFormInstanceQuery.isEmpty() && !newFormInstanceQuery.equals("")) {
                        newFormInstanceQuery = newFormInstanceQuery.replace("'USER_CODE'", "'" + USER_CODE + "'").replace("'EMP_CODE'", "'" + EMPCODE + "'");
                        newFormInstanceQuery = newFormInstanceQuery.replace("'GEOORGCODE'", "'" + geoOrgCode + "'").replace("'ACCCODE'", "'" + accCode + "'");
                        System.out.println("newFormInstanceQuery: " + newFormInstanceQuery);
                        try {
                            PreparedStatement ps = c.prepareStatement(newFormInstanceQuery);
                            int rsNewForm = ps.executeUpdate();
//                            if (rsNewForm != null && rsNewForm.next()) {
////                            newFormInstance = rsNewForm.getString(1);
//                            } else {
////                            newFormInstance = "";
//                            }

//                            if (rsNewForm > 0) {
//                                json.setNewFormInstance("T#OK");
//                            } else {
//                                json.setNewFormInstance("F#ER");
//                            }
                            json.setNewFormInstance("T#OK");
                            
                        } catch (Exception e) {
                            U.log("New Form Instance Exception !!" + e.getMessage());
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
                
                System.out.println("" + json.getNewFormInstance());
                
            }
            
            System.out.println("defaultPopulateDataSql--->" + defaultPopulateDataSql);
            if (defaultPopulateDataSql != null) {
//                U.log("defaultPopulateDataSql :  " + defaultPopulateDataSql.replace("user_code", USER_CODE));
                U.log("defaultPopulateDataSql searchText : " + searchText);
                defaultPopulateDataSql = defaultPopulateDataSql.replaceAll("ACCCODE", accCode);
                if (defaultPopulateDataSql.contains("'COL0'") || defaultPopulateDataSql.contains("'COL1'")) {
                    U.log("contains COL0 else if");
                    String[] whereClauseValArray = searchText.split("#");
                    U.log("length==" + whereClauseValArray.length);
                    for (int i = 0; i < whereClauseValArray.length; i++) {
                        System.out.println("whereClauseValArray[" + i + "]-- " + whereClauseValArray[i]);
                        if (whereClauseValArray[i].equals("null") || whereClauseValArray[i].equals("")
                                || whereClauseValArray[i].equals(null) || whereClauseValArray[i] == null) {
                            U.log("where clause null");
                            whereClauseValArray[i] = "";
                        }
                        
                        defaultPopulateDataSql = defaultPopulateDataSql.replaceAll("COL" + i, whereClauseValArray[i]);
                        if (defaultPopulateDataSql.contains("SEARCHTEXT") && whereClauseValArray[i].contains("-")
                                && !(whereClauseValArray[i].split("-")[0].equals("null") || whereClauseValArray[i].split("-")[0].equals(null)
                                || whereClauseValArray[i].split("-")[0].equals("") || whereClauseValArray[i].split("-")[0] == null)) {
                            String itemNames[] = whereClauseValArray[i].split("-");
                            String itemColumnName = itemNames[1];
                            if (itemNames[0].contains(" ")) {
                                StringBuilder itemSearchBuilder = new StringBuilder();
//                                U.log("DEAFULTSEARCH==>" + itemSearchBuilder.toString());
                                String search[] = itemNames[0].trim().split(" ");
                                U.log("search-->" + search);
                                for (int j = 0; j < search.length; j++) {
//                                    U.log("DEAFULTSEARCH==> " + j);
                                    itemSearchBuilder.append("upper(" + itemColumnName + ") like upper('%" + search[j].trim() + "%') OR ");
                                }
//                                U.log("DEAFULTSEARCH==>>>>" + itemSearchBuilder.toString());
                                defaultPopulateDataSql = defaultPopulateDataSql.replace("SEARCHTEXT", "(" + itemSearchBuilder.toString().substring(0, itemSearchBuilder.toString().lastIndexOf("R") - 1) + ")");
//                                defaultPopulateDataSql.replace("SEARCHTEXT", "54");
//                                U.log("DEAFULTSEARCH==<<<<<<" + itemSearchBuilder.toString().substring(0, itemSearchBuilder.toString().lastIndexOf("R") - 1));
                            } else {
                                defaultPopulateDataSql = defaultPopulateDataSql.replace("SEARCHTEXT", "upper(" + itemColumnName + ") like upper('%" + itemNames[0] + "%')");
                            }

//                           defaultPopulateDataSql.replace("SEARCHTEXT", "("+itemNames[1]+ "=" +itemNames[0].+" OR " + itemNames[1] +"="+ itemNames[0] +")");
                        } else if (defaultPopulateDataSql.contains("SEARCHTEXT") && whereClauseValArray[i].contains("-") && (whereClauseValArray[i].split("-")[0].equals("null") || whereClauseValArray[i].split("-")[0].equals(null)
                                || whereClauseValArray[i].split("-")[0].equals("") || whereClauseValArray[i].split("-")[0] == null)) {
                            String itemNames[] = whereClauseValArray[i].split("-");
                            String itemColumnName = itemNames[1];
                            defaultPopulateDataSql = defaultPopulateDataSql.replace("SEARCHTEXT", "upper(" + itemColumnName + ") like upper('%%')");
                        }
                    }
                } else if (searchText.contains(",")) {
//                    U.log("contains , else if");
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
//                    U.log("contains 3 else if  :::  "+defaultPopulateDataSql);

                    if (sessionMapValueString != null) {
                        defaultPopulateDataSql = replaceKeyBySessionMapValue(defaultPopulateDataSql, sessionMapValueString);
                    } else {
                        
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
//                            U.log("searchTextArray.length : " + searchTextArray.length);
//                            U.log("defaultPopulateDataArray.length : " + defaultPopulateDataArray.length);
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
//                    U.log("contains # esle if defaultsql   :::::: "+ defaultPopulateDataSql);
                    }
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
//                    U.log("searched text" + buildedSearchText.toString());
                    defaultPopulateDataSql = defaultPopulateDataSql.replaceAll(Pattern.quote("searchtext"), buildedSearchText.toString());
                    
                }
                
                defaultPopulateDataSql = defaultPopulateDataSql.replace("user_code", USER_CODE);
                defaultPopulateDataSql = defaultPopulateDataSql.replaceAll("'GEOORGCODE'", geoOrgCode);
                
                U.log("Replaced defaultPopulateDataSql  : " + defaultPopulateDataSql);
                try {
                    preparedStatement = c.prepareStatement(defaultPopulateDataSql);
                    resultSet = preparedStatement.executeQuery();
                    
                    ResultSetMetaData md = resultSet.getMetaData();
                    int clCount = md.getColumnCount();
//                populatedColumnName = new String[clCount];
                    for (int i = 1; i <= clCount; i++) {
                        
                        defaultPopulateResultMap.put(md.getColumnName(i), new ArrayList<Object>());
//                    populatedColumnName[i - 1] = md.getColumnName(i);
                    }
                    if (resultSet != null && resultSet.next()) {
                        do {
                            for (int i = 1; i <= clCount; i++) {
//                                U.log("entry date=>>" + resultSet.getString(i));
                                if (md.getColumnTypeName(i).equalsIgnoreCase("long raw")) {
//                                    U.log("image==>"+resultSet.get(i));
                                    if (resultSet.getBinaryStream(i) != null) {
//                                        InputStream ip = resultSet.getBinaryStream(i);
//                                        U.l/og("image==>" + resultSet.getBytes(i).toString());

                                        byte[] longx = Util.getImgstreamToBytes(resultSet.getBinaryStream(i));
                                        
                                        defaultPopulateResultMap.get(md.getColumnName(i)).add(longx);
                                    } else {
                                        defaultPopulateResultMap.get(md.getColumnName(i)).add("");
                                    }
//                                    defaultPopulateResultMap.get(md.getColumnName(i)).add(Util.getImgstreamToBytes((resultSet.getBinaryStream(i)!=null) ? resultSet.getBinaryStream(i) : null).toString());
                                } else {
                                    defaultPopulateResultMap.get(md.getColumnName(i)).add(resultSet.getString(i));
                                }
                            }
                        } while (resultSet.next());
                    }
                    defaultPopulateRowCount = defaultPopulateResultMap.get(md.getColumnName(1)).size();
//                    U.log("defaultPopulateRowCount ::::   " + defaultPopulateRowCount);
                } catch (Exception e) {
                    U.errorLog("defaultPopulateRowCount exception ::::   " + defaultPopulateRowCount);
                    e.printStackTrace();
                }
            }
            if (access_control != null) {
                try {
                    String query = "select " + access_control + " from dual";
                    U.log("access_control query: >>" + query);
                    preparedStatement = c.prepareStatement(query);
                    resultSet = preparedStatement.executeQuery();
                    
                    if (resultSet != null && resultSet.next()) {
                        access_control_value = resultSet.getString(1);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            
            String sql = " select u.*,t.dependent_next_entry_seq from LHSSYS_PORTAL_DATA_DSC_UPDATE u ,LHSSYS_PORTAL_table_DSC_UPDATE t "
                    + "where u.seq_no=" + seqNo + "and t.seq_no=" + seqNo + "  order by COLUMN_SLNO";
            U.log("GET ADD ENTRY FORM SQL : " + sql);
            String getNextSeqValue = "";
            preparedStatement = c.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                U.log("ENTRY FORM : --->");
                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    String column_catg = resultSet.getString("Column_catg");
                    if (column_catg != null) {
                        model.setColumn_catg(column_catg);
                    } else {
                        column_catg = "";
                    }
//                    model.setColumn_catg(column_catg);
                    if (resultSet.getString("Column_DESC").toLowerCase().contains("Entry Format Seq".toLowerCase())) {
                        model.setValue(resultSet.getString("Column_default_value"));
                    } else if (resultSet.getString("Column_default_value") != null) {
                        String defaultValue = resultSet.getString("Column_default_value");
                        String columnName = resultSet.getString("column_name");
                        String columnType = resultSet.getString("column_type");
                        if (defaultValue.toLowerCase().contains("nextval")) {
                            PreparedStatement ps;
                            ResultSet rs;
//                            String getNextSeqValue = "";
                            String getDaySQL = "select " + defaultValue + " from dual";
                            U.log("getDaySQL===>>" + getDaySQL);
                            ps = c.prepareStatement(getDaySQL);
                            rs = ps.executeQuery();
                            if (rs != null && rs.next()) {
                                getNextSeqValue = rs.getString(1);
                                U.log("get next seq VALUE : " + getNextSeqValue);
                            }
                            model.setValue(getNextSeqValue);
                        } else if (defaultValue.contains("DAY")) {
                            PreparedStatement ps;
                            ResultSet rs;
                            String getDaySQLValue = "";
                            String getDaySQL = "select SUBSTR(to_char(sysdate, 'DAY'), 1, 3) from dual";
                            ps = c.prepareStatement(getDaySQL);
                            rs = ps.executeQuery();
                            if (rs != null && rs.next()) {
                                getDaySQLValue = rs.getString(1);
                                U.log(columnName + "<<<<<<<getDaySQL VALUE : " + getDaySQLValue);
                            }
                            model.setValue(getDaySQLValue);
                        } else if (defaultValue.contains("LHSSYS_CALENDER_SCHEDULER")) {
                            PreparedStatement ps;
                            ResultSet rs;
                            String getEMPLocationSQLValue = "";
                            String getEMPLocationSQL = "SELECT T.LOCATION || '#'|| T.GEO_CODE FROM LHSSYS_CALENDER_SCHEDULER  "
                                    + "T WHERE T.USER_CODE = '" + USER_CODE + "' AND T.TASK_DATE = SUBSTR(to_char(sysdate,'dd-Mon-yy'), 1, 9)  "
                                    + "AND T.GEO_CODE IS NOT NULL";
                            U.log("getEMPLocation SQL : " + getEMPLocationSQL);
                            ps = c.prepareStatement(getEMPLocationSQL);
                            rs = ps.executeQuery();
                            if (rs != null && rs.next()) {
                                getEMPLocationSQLValue = rs.getString(1);
                                U.log("getEMPLocation VALUE : " + getEMPLocationSQLValue);
                            }
                            model.setValue(getEMPLocationSQLValue);
                        } else if (defaultValue.contains("(")
                                && defaultValue.contains(")")
                                && !defaultValue.contains("get_generate_code_TBL") && !defaultValue.contains("CRM_QUOTA")) {
                            String projectSql = "";
                            if (!defaultValue.toLowerCase().contains("select")) {
                                projectSql = "select " + defaultValue + " from dual";
                            } else {
                                projectSql = defaultValue;
                            }
                            //                            U.log("accCode : " + accCode);
                            projectSql = projectSql.replace("acc_code')", accCode + "')").replaceAll("ACCCODE", accCode);
                            U.log("column_default_value sqll==" + projectSql);
                            Statement st = c.createStatement();
                            ResultSet defaultRs = st.executeQuery(projectSql);
                            String retailer_seq = "";
                            if (defaultRs != null && defaultRs.next()) {
                                retailer_seq = defaultRs.getString(1);
                                U.log("retailer_seq  : " + retailer_seq);
                            }
                            if (retailer_seq != null && retailer_seq.contains("~")) {
                                model.setValue(retailer_seq.split("~")[0].trim());
                                model.setCodeOfValue(retailer_seq.split("~")[1].trim());
                            } else {
                                model.setValue(retailer_seq);
                            }
                        } else if (defaultValue.contains("sysdate") && !columnName.contains("LASTUPDATE")) {
                            
                            U.log("  =sysdate===>>" + sysdate + "   ");
                            
                            if (columnType.equals("DATE")) {
                                model.setValue(onlyDate);
//                                U.log("LASTUPDATE :");
                            } else {
                                model.setValue(sysdate);
                            }
                        } else if (defaultValue.contains("sysdate") && columnName.contains("LASTUPDATE")) {
                            if (columnType.equals("DATE")) {
                                model.setValue(onlyDate);
//                                U.log("LASTUPDATE===>" + onlyDate);
                            } else {
                                model.setValue(sysdate);
                            }
                        } else if (defaultValue.contains("CONFIG_AUTO_ENTRY") || defaultValue.contains("USER_RIGHTS")) {
                            U.log("GET DEFAULT VR SERIES SQL : " + defaultValue);
                            defaultValue = defaultValue.replace("USERCODE", USER_CODE);
                            String projectSql = defaultValue;
                            U.log("GET DEFAULT VR SERIES SQL : " + projectSql);
                            
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
                            U.log("GET DEFAULT SHIFT SQL : " + projectSql);
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
//                            U.log("user_code===>" + USER_CODE);
                            model.setValue(USER_CODE);
                        } else if (defaultValue.contains("EMP_CODE")) {
                            String getEMPCODE_SQL = "select EMP_CODE from user_mast where user_code='" + USER_CODE + "'";
                            U.log("getEMPCODE_SQL :  " + getEMPCODE_SQL);
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
                                String[] parts = lovSql.split("~");
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
                        } else if (defaultValue.contains("MAX_SLNO")) {
                            String maxslno = "SELECT NVL((MAX(SLNO)+1), 1) FROM CRM_CLIENT_TRAN T WHERE T.SEQ_NO=" + getNextSeqValue;
                            Statement st = c.createStatement();
                            ResultSet rs = st.executeQuery(maxslno);
                            String client_slno = "";
                            if (rs != null && rs.next()) {
                                client_slno = rs.getString(1);
                            }
                            model.setValue(client_slno);
                        } else if (defaultValue.contains("ACC_CODE")) {
                            U.log("inside acc code===" + defaultValue);
                            
                            if (defaultValue.contains("SELECT")) {
                                U.log("SELECT ACC_CODE UTILITY====" + defaultValue);
                                //                                String maxslno = "select nvl(max(slno),0)+1 slno from crm_client_tran";
                                Statement st = c.createStatement();
                                ResultSet rs = null;
                                defaultValue = defaultValue.replaceAll("ACC_CODE", accCode);
                                rs = st.executeQuery(defaultValue);
                                
                                String acc_code = "";
                                if (rs != null && rs.next()) {
                                    acc_code = rs.getString(1);
                                }
                                model.setValue(acc_code);
                            } else {
                                Statement st = c.createStatement();
                                ResultSet rs = st.executeQuery("select lhs_utility.get_name('ACC_CODE', '" + accCode + "') acc_name from dual");
                                if (rs != null && rs.next()) {
                                    model.setValue(rs.getString(1));
                                    model.setCodeOfValue(accCode);
                                } else {
                                    model.setValue(accCode);
                                }
//                                model.setValue(accCode);
                            }
                        } else if (defaultValue.contains("GEO_ORG_CODE")) {
                            System.out.println("geo org code=====> "+geoOrgCode);
                            model.setValue(geoOrgCode);
                        } else if (defaultValue != null) {
                            model.setValue(resultSet.getString("Column_default_value"));
                        }
                    }
                    if (resultSet.getString("Column_desc").equals("VRNO") && !seqNo.contains(".5")) {
                        String svVoucherSeries = null;
                        String svVoucherPad = null;
                        String svVoucherCode = null;
                        String svVoucherDefaultDivCode = null;
                        String getdefultuserLinkValue = "select * from view_default_user_links";
                        PreparedStatement ds = c.prepareStatement(getdefultuserLinkValue);
                        ResultSet rs = ds.executeQuery();
//                        U.log("FIRST SCREEN FOR VRNO : " + first_screen);
                        if (rs != null && rs.next()) {
//                            U.log("inside default link");
                            if (first_screen != null && first_screen.contains("S")) {
                                svVoucherCode = rs.getString("sv_Voucher_TCode");
                                svVoucherSeries = rs.getString("sv_Voucher_series");
                                svVoucherPad = rs.getString("sv_Voucher_pad");
                                svVoucherDefaultDivCode = rs.getString("sv_voucher_default_div_code");
                            }
                            if (first_screen != null && first_screen.equalsIgnoreCase("O")) {
                                svVoucherCode = rs.getString("order_TCode");
                                svVoucherSeries = rs.getString("order_series");
                                svVoucherPad = rs.getString("order_pad");
                                svVoucherDefaultDivCode = rs.getString("order_default_div_code");
//                                U.log("sv_Voucher_TCode::" + svVoucherCode + "  sv_Voucher_series::" + svVoucherSeries + " sv_Voucher_pad" + svVoucherPad + " sv_voucher_default_div_code::" + svVoucherDefaultDivCode);
                            } else {
                                svVoucherCode = rs.getString("sv_Voucher_TCode");
                                svVoucherSeries = rs.getString("sv_Voucher_series");
                                svVoucherPad = rs.getString("sv_Voucher_pad");
                                svVoucherDefaultDivCode = rs.getString("sv_voucher_default_div_code");
//                                U.log("sv_Voucher_TCode::" + svVoucherCode + "  sv_Voucher_series::" + svVoucherSeries + " sv_Voucher_pad" + svVoucherPad + " sv_voucher_default_div_code::" + svVoucherDefaultDivCode);
                            }
                        }
//                        U.log("PROCEDURE TO GENERATE VRNO :   " + "BEGIN lhs_crm.generate_VRNO('" + svVoucherSeries + "',TO_DATE(sysdate,'DD-MM-RRRR'),"
//                                + svVoucherPad + ",'" + entityCode + "','" + svVoucherDefaultDivCode
//                                + "','" + acc_year + "','" + svVoucherCode + "'); END;");

//                        String executeProc = "{call lhs_crm.generate_VRNO(?,TO_DATE(sysdate,'DD-MM-RRRR'),?,?,?,?,?)}";
//                        PreparedStatement procCall = c.prepareCall(executeProc);
//                        procCall.setString(1, svVoucherSeries);
//                        procCall.setString(2, svVoucherPad);
//                        procCall.setString(3, entityCode);
//                        procCall.setString(4, svVoucherDefaultDivCode);
//                        procCall.setString(5, acc_year);
//                        procCall.setString(6, svVoucherCode);
//                        try {
//                            procCall.executeUpdate();
//                            Statement stmt = c.createStatement();
//                            String returnNewVRNO_SQL = "select lhs_crm.return_new_vrno from dual";
//                            U.log("returnNewVRNO_SQL : " + returnNewVRNO_SQL);
//                            rs = stmt.executeQuery(returnNewVRNO_SQL);
//                            if (rs.next()) {
//                                string_vrno = rs.getString(1);
//                                U.log("GENERATED VRNO :   " + string_vrno);
//                                if (string_vrno == null) {
//                                    model.setValue("0000");
//                                    U.log("vrno=0000");
//                                } else {
//                                    model.setValue(string_vrno);
//                                }
//                            }
//                            appendVRNO(string_vrno, entityCode, svVoucherDefaultDivCode, acc_year, svVoucherCode);
//                        } catch (SQLException e) {
//                        }
                    }
                    
                    model.setColumn_default_value(resultSet.getString("Column_default_value"));
                    model.setColumn_desc(resultSet.getString("Column_desc"));
                    model.setColumn_name(resultSet.getString("Column_name"));
                    if (resultSet.getString("column_name").equalsIgnoreCase("TCODE")) {
                        tcode = resultSet.getString("column_default_value");
                    }
                    if (resultSet.getString("column_name").equalsIgnoreCase("series")) {
                        series = resultSet.getString("column_default_value");
                    }
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
                    model.setDependent_where_clause(resultSet.getString("dependent_where_clause"));
                    model.setValidate_dependent_row_slno(resultSet.getString("VALIDATE_DEPENDENT_ROW_SLNO"));                    
                    model.setValidate_dependent_columns(resultSet.getString("VALIDATE_DEPENDENT_COLUMNS"));
                    model.setData_save_success_message(resultSet.getString("DATA_SAVE_SUCCESS_MESSAGE"));
                    
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
                        sql = "select column_name, slno,column_default_value from LHSSYS_PORTAL_DATA_DSC_UPDATE where slno in  "
                                + "(" + dependentRowString + ") and seq_no=" + seqNo;
                        U.log("sqldependent : " + sql);
                        String dependentRowColumn = resultSet.getString("dependent_row");
                        String[] queryDepArr = dependentRowColumn.split("#");
                        String[] queryDepArrVal = queryDepArr;
                        try {
                            preparedStatement = c.prepareStatement(sql);
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
                        sql = "select column_name, slno from LHSSYS_PORTAL_DATA_DSC_UPDATE where slno in  "
                                + "(" + dependentRowString + ") and seq_no=" + seqNo;
                        U.log("query_dependent_row : " + sql);
                        
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
//                        model.setQuery_dependent_row(dependentRowColumn);
                    } else {
                        model.setQuery_dependent_row(resultSet.getString("query_dependent_row"));
                    }
                    model.setItem_help_property(resultSet.getString("item_help_property"));
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
                    model.setValidate_dependent_row_slno(resultSet.getString("VALIDATE_DEPENDENT_ROW_SLNO"));// VALIDATE_DEPENDENT_ROW_SLNO // for minlength of number  
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
                        sql = "select column_name, slno from LHSSYS_PORTAL_DATA_DSC_UPDATE where slno in  "
                                + "(" + dependentRowString + ") and seq_no=" + seqNo;
                        U.log("columnValidateArrColsSQL : " + sql);
                        
                        preparedStatement = c.prepareStatement(sql);
                        ResultSet RS = preparedStatement.executeQuery();

//
//                        String[] queryDepArr = dependentRowColumn.split("#");
//                        String[] queryDepArrVal = queryDepArr;
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
                    
                    {
                        if (resultSet.getString("column_select_list_value") != null
                                && resultSet.getString("item_help_property").equalsIgnoreCase("H")
                                || resultSet.getString("item_help_property").equalsIgnoreCase("D")) {
                            String inClause = resultSet.getString("dependent_where_clause");
                            System.out.println("  inclause=>>" + inClause + "  ");
                            String selectquery = resultSet.getString("column_select_list_value");
                            selectquery = selectquery.replace("USER_CODE", USER_CODE);
                            selectquery = selectquery.replace("USERCODE", USER_CODE);
                            String currentAccYear = "";
                            if (selectquery.toLowerCase().contains("select")) {
                                String whereClauseValue = "";

                                //ACC_year alwyas be in last position in where condition
                                String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE  "
                                        + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') ) "
                                        + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
                                U.log("getAccYearSQL : " + getAccYearSQL);
                                
                                PreparedStatement accYearStm = c.prepareStatement(getAccYearSQL);
                                ResultSet accYearRS = accYearStm.executeQuery();
                                if (accYearRS != null && accYearRS.next()) {
                                    currentAccYear = accYearRS.getString(1);
                                    U.log("currentAccYear : " + currentAccYear);
                                    if (currentAccYear == null) {
                                        U.log("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                                    } else {
//                                    U.log("DefualtvlaueForDropDownSql######=" + DefualtvlaueForDropDownSql.length);
//                                    U.log("DefualtvlaueForDropDownSql######=::;" + DefualtvlaueForDropDownSql[2]);
                                        try {
                                            DefualtvlaueForDropDownSql[DefualtvlaueForDropDownSql.length - 1] = currentAccYear;
                                            U.log("=>DefualtvlaueForDropDownSql######=::;" + DefualtvlaueForDropDownSql[DefualtvlaueForDropDownSql.length - 1]);
                                        } catch (Exception e) {
                                            
                                            U.errorLog("ERORR--> " + e.getMessage());
                                        }
                                        
                                    }
                                } else {
                                    U.log("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                                }

                                //END FIND ACC_YEAR
                                if (DefualtvlaueForDropDownSql != null) {
                                    try {
                                        for (int i = 0; i < DefualtvlaueForDropDownSql.length; i++) {

//                                            U.log("COL" + i + "==DefualtvlaueForDropDownSql==" + DefualtvlaueForDropDownSql[i]);
                                            selectquery = selectquery.replaceAll("COL" + i, DefualtvlaueForDropDownSql[i]);

//                                            U.log("COL" + 0 + "==DefualtvlaueForDropDownSql==" + DefualtvlaueForDropDownSql[0]);
                                            selectquery = selectquery.replaceAll("ACCCODE", accCode).replaceAll("STAXCODE", DefualtvlaueForDropDownSql[0]);
                                            
                                            if (inClause != null) {
                                                inClause = inClause.replaceAll("COL" + i, DefualtvlaueForDropDownSql[i]);
                                                inClause = inClause.replaceAll("ACCCODE", accCode).replaceAll("STAXCODE", DefualtvlaueForDropDownSql[0]);
                                                
                                            }
                                        }
                                    } catch (Exception e) {
                                        
                                        U.errorLog(e);
                                        
                                    }
                                }
                                
                            } else {
                                selectquery = "select " + selectquery + " from dual";
                            }
                            
                            if (selectquery.contains("ACCYEAR")) {
                                selectquery = selectquery.replaceAll("ACCYEAR", currentAccYear);
                                //System.out.println("Accyear  after replace in select query --- " +selectquery);
                            }
                            
                            if (inClause != null) {
                                inClause = inClause.replace("ACCYEAR", currentAccYear);
                            }
                            System.out.println("inclause query===>>>" + inClause);
                            if (selectquery.contains("INCLAUSE")) {
                                
                                try {
                                    PreparedStatement ps = c.prepareStatement(inClause);
                                    ResultSet rs = ps.executeQuery();
                                    if (rs != null && rs.next()) {
                                        inClause = rs.getString(1);
                                        if (inClause != null) {
                                            inClause = "'" + inClause.replaceAll(",", "','") + "'";
                                            selectquery = selectquery.replace("INCLAUSE", inClause);
                                        }
                                    }
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }
                            
                            if (geoOrgCode != null) {
                                selectquery = selectquery.replace("GEOORGCODE", geoOrgCode);
                            }
                            U.log("acc_code===" + accCode);
                            
                            selectquery = selectquery.replaceAll("ACCCODE", accCode);
                            
                            System.out.println("COLUMN_SELECT_LIST_VALUE selectQuery=" + selectquery);
                            try {
                                PreparedStatement ps2 = c.prepareStatement(selectquery);
                                ResultSet rs2 = ps2.executeQuery();
                                if (rs2 != null && rs2.next()) {
                                    do {
                                        U.log("rs2.getString(1)=>>" + rs2.getString(1));
                                        model.setDropdownVal(rs2.getString(1));
                                        String dropDownListStr = rs2.getString(1);
                                        //Display Selected First value of dropdown
                                        if (dropDownListStr != null && dropDownListStr.trim().length() > 1 && !resultSet.getString("column_name").equalsIgnoreCase("STAX_CODE")) {
                                            
                                            if (model.getValue() == null) {
                                                model.setValue(dropDownListStr.split("#")[0].split("~")[0]);
                                            } else if (model.getValue().toString().contains("GEO_ORG_CODE")) {
                                                U.log("==GEO_ORG_CODE==");
                                                model.setValue(geoOrgCode);
                                            } else if (model.getValue().toString().contains("ACC_CODE")) {
                                                model.setValue(accCode);
                                            }
                                            
                                            U.log(model.getColumn_name() + "=" + model.getValue());

                                            //set address_from_slno = config_mast.entity_ADD_SLNO 
//                                        U.log(" col name===>"+resultSet.getString("column_name")+"==tcode==>"+tcode+" ");
                                            if (resultSet.getString("column_name").equalsIgnoreCase("DELIVERY_FROM_SLNO") && tcode != null) {
                                                String entityADDSlnoQuery = "select entity_add_slno from config_mast where tcode='" + tcode + "' and acc_year='" + acc_year + "' and series='" + series + "'";
                                                
                                                U.log("entityADDSlnoQuery=" + entityADDSlnoQuery);
                                                
                                                try {
                                                    PreparedStatement addStm = c.prepareStatement(entityADDSlnoQuery);
                                                    ResultSet addRS = addStm.executeQuery();
                                                    if (addRS != null && addRS.next()) {
                                                        U.log("entityADDSlnoQuery value=" + addRS.getString(1));
                                                        
                                                        model.setValue(addRS.getString(1));
                                                    }
                                                } catch (Exception e) {
                                                    e.printStackTrace();
                                                }
                                            }
                                            
                                        } else {
                                            /*
                                        Logic for Fixed stax code by using state code
                                             */
                                            
                                            ValueClassModel vmodel = new ValueClassModel();
                                            JDBCDependentRowLogicDAO dao = new JDBCDependentRowLogicDAO(c);
                                            String str = "";
                                            if (DefualtvlaueForDropDownSql != null) {
                                                for (int i = 0; i < DefualtvlaueForDropDownSql.length; i++) {
                                                    if (i > 0) {
                                                        str = str + "," + DefualtvlaueForDropDownSql[i];
                                                    } else {
                                                        str = DefualtvlaueForDropDownSql[i];
                                                    }
                                                    
                                                }
                                            }
                                            try {
                                                vmodel = dao.getRowVal(seqNo, "STAX_CODE", str.replaceAll(",", "#"), "", "");
                                                if (vmodel.getValue() != null) {
//                                                U.log("======>>>>" + vmodel.getValue());
                                                    model.setValue(vmodel.getValue());

                                                    //---commented 11-12-2018
//                                                model.setCodeOfValue(vmodel.getValue());
                                                }
                                            } catch (Exception e) {
                                                e.printStackTrace();
                                            }
                                            
                                        }
                                    } while (rs2.next());
                                }
                            } catch (Exception e) {
                                U.errorLog(e);
                            }
                            
                        } else if (resultSet.getString("item_help_property") != null && resultSet.getString("item_help_property").contains("AS")) {
                            JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
                            String autoCompleteString = dao.getAutoCompleteData(seqNo, resultSet.getString("Column_name"), "", userCode);
                            model.setDropdownVal(autoCompleteString);
                        }
                    }
//                    U.log("resultSet.getString(\"Status\") =="+resultSet.getString("Status") );
                    String status = resultSet.getString("Status");
                    if (resultSet.getString("Status") != null && !status.contains("F")) {
                        list.add(model);
                    }

                    /**
                     * FOR ICON
                     */
//                    U.log("model  ==="+model.getREF_LOV_TABLE_COL());
                    model.setImg(Util.getImgstreamToBytes(resultSet.getBinaryStream("field_image")));
                    
                } while (resultSet.next());
                
                json.setRecordsInfo(list);
                json.setDefaultPopulateData(defaultPopulateResultMap);
                json.setSeqNo(seqNo);
                json.setAccess_control(access_control_value);
                return json;
            }
            
        } catch (SQLException e) {
            U.errorLog(e);
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    U.errorLog(e);
                }
            }
        }
        return json;
    }
    
    public RecordInfoJSON reportFilterDetail(String entity, String seqNo, String userCode, String accCode, String userFlag) {
        RecordInfoJSON json = new RecordInfoJSON();
        List< List<DyanamicRecordsListModel>> populatedEntry = new ArrayList<List<DyanamicRecordsListModel>>();
        String displayScreen = null;
        String[] populatedColumnName = null;
        int defaultPopulateRowCount = 1;
        String defaultPopulateDataSql = null;
        USER_CODE = userCode.toUpperCase();
        String defualt_div_code = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        ResultSet rss = null;
        String entityCode = null;
        String string_vrno = null;
        String acc_year = null;
        String first_screen = null;
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {
            String firstScreen = "select TO_CHAR(SYSDATE, 'DD-MM-YYYY  HH24:MI:SS') as systemdate,l.default_div_code,"
                    + "t.*,y.acc_year from LHSSYS_PORTAL_TABLE_DSC_UPDATE t,acc_year_mast y,view_default_user_links "
                    + "l where t.seq_no=" + seqNo + " and sysdate between y.yrbegdate and y.yrenddate and "
                    + "y.entity_code=t.entity_code_str";
            U.log("view_default_user_links SQL  : " + firstScreen);
            preparedStatement = c.prepareStatement(firstScreen);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                sysdate = resultSet.getString("systemdate");
                U.log("system date : " + sysdate);
                displayScreen = resultSet.getString("first_screen");
                defualt_div_code = resultSet.getString("default_div_code");
                defaultPopulateDataSql = resultSet.getString("default_populate_data");
                entityCode = resultSet.getString("entity_code_str");
                acc_year = resultSet.getString("acc_year");
                first_screen = resultSet.getString("First_screen");
            }
            if (defaultPopulateDataSql != null) {
                U.log("defaultPopulateDataSql==" + defaultPopulateDataSql.replace("user_code", USER_CODE));
                defaultPopulateDataSql = defaultPopulateDataSql.replace("user_code", USER_CODE);
                preparedStatement = c.prepareStatement(defaultPopulateDataSql);
                resultSet = preparedStatement.executeQuery();
                ResultSetMetaData md = resultSet.getMetaData();
                int clCount = md.getColumnCount();
                populatedColumnName = new String[clCount];
                for (int i = 1; i <= clCount; i++) {
                    defaultPopulateResultMap.put(md.getColumnName(i), new ArrayList<Object>());
                    populatedColumnName[i - 1] = md.getColumnName(i);
                }
                U.log(clCount + "===" + defaultPopulateResultMap.size());
                if (resultSet != null && resultSet.next()) {
                    do {
                        for (int i = 1; i <= clCount; i++) {
                            defaultPopulateResultMap.get(md.getColumnName(i)).add(resultSet.getString(i));
                        }
                    } while (resultSet.next());
                }
                defaultPopulateRowCount = defaultPopulateResultMap.get(md.getColumnName(1)).size();
            }
            
            String sql = " select  DISTINCT P.* "
                    + "  from LHSSYS_PORTAL_table_DSC_UPDATE t,  "
                    + "       LHSSYS_ALERT_DIRECT_EMAIL E, "
                    + "       LHSSYS_ALERT_DIRECT_EMAIL_PARA P "
                    + " where E.seq_ID = " + seqNo + " "
                    + "   and P.seq_ID = " + seqNo + " "
                    + "   and P.ITEM_HELP_PROPERTY != 'X' "
                    + " order by COLUMN_SLNO";
            U.log("REPORT FILTER DETAILS SQL :  " + sql);
            preparedStatement = c.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();
            String getFilterDataSQL = "SELECT * FROM LHSSYS_ALERT_DIRECT_EMAIL_USER L WHERE L.SEQ_ID='" + seqNo + "' ";
            if (userFlag != null && !userFlag.isEmpty()) {
                if (userFlag == "E" || userFlag.equalsIgnoreCase("E")) {
                    getFilterDataSQL = getFilterDataSQL + "AND L.USER_CODE = '" + userCode + "'";
                } else {
                    getFilterDataSQL = getFilterDataSQL + "AND L.USER_CODE = '" + accCode + "'";
                }
            } else {
                getFilterDataSQL = getFilterDataSQL + "AND L.USER_CODE = '" + userCode + "'";
            }
            
            U.log("getFilterDataSQL : " + getFilterDataSQL);
            PreparedStatement ps = c.prepareStatement(getFilterDataSQL);
            rss = ps.executeQuery();
            if (rss != null) {
                rss.next();
            }
            int loopCount = 1;

            // CODE TO PRINT RESULTSET
//            ResultSetMetaData rsmd = resultSet.getMetaData();
//            int columnsNumber = rsmd.getColumnCount();
//            while (resultSet.next()) {
//                for (int i = 1; i <= columnsNumber; i++) {
//                    if (i > 1) {
//                        System.out.print("  ");
//                    }
//                    String columnValue = resultSet.getString(i);
//                    System.out.print("COLUMN VALUE : "+columnValue + " COLUMN NAME : " + rsmd.getColumnName(i));
//                }
//            }
            // CODE TO PRINT RESULTSET
            if (resultSet != null && resultSet.next()) {
                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    if (resultSet.getString("column_value") != null) {
                        model.setValue(resultSet.getString("column_value"));
                    } else if (resultSet.getString("para_default_value") != null) {
                        String defaultValue = resultSet.getString("para_default_value");
                        String columnName = resultSet.getString("para_desc");
                        if (defaultValue.contains("sysdate") && !columnName.contains("LASTUPDATE")) {
                            String query = "select TO_CHAR(" + defaultValue + ", 'DD-MM-YYYY  HH24:MI:SS') as systemdate from dual";
                            ResultSet rs = null;
                            try {
                                preparedStatement = c.prepareStatement(query);
                                rs = preparedStatement.executeQuery();
                                String sysdate = "";
                                if (rs != null && rs.next()) {
                                    sysdate = rs.getString(1);
                                }
                                U.log("Sysdate = " + sysdate);
                                model.setValue(sysdate);
                            } finally {
                                if (rs != null) {
                                    try {
                                        rs.close();
                                    } catch (Exception e) {
                                        //log error
                                    }
                                }
                            }
                        } else if (defaultValue.contains("USER_CODE")) {
                            model.setValue(USER_CODE);
                        } else if (defaultValue.contains("ACC_CODE")) {
                            model.setValue(accCode.toUpperCase());
                            
                        } else if (defaultValue.contains("PROJECT_STR")) {
                            String projectSql = "select project_str from user_mast where user_code='" + USER_CODE + "'";
//                            Statement st = c.createStatement();
                            preparedStatement = c.prepareStatement(projectSql);
                            ResultSet defaultRs = preparedStatement.executeQuery();
                            String whereclause = "";
                            try {
                                if (defaultRs != null && defaultRs.next()) {
                                    whereclause = defaultRs.getString(1);
                                }
                                
                                U.log("whereclause  =====>" + whereclause);
                                
                            } finally {
                                if (defaultRs != null) {
                                    try {
                                        defaultRs.close();
                                    } catch (SQLException e) {
                                        //log error
                                    }
                                }
                            }
                            if (whereclause != null) {
                                LOV lov = new LOV();
                                lov.setREF_LOV_TABLE_COL(resultSet.getString("REF_LOV_TABLE_COL"));
                                StringBuffer lovSql = new StringBuffer();
                                lovSql.append(lov.createLOVsql(c));
                                U.log(resultSet.getString("REF_LOV_TABLE_COL") + "===" + lovSql.toString());
                                lovSql.append("and cost_code='").append(whereclause).append("'");
                                if (resultSet.getString("order_clause") != null) {
                                    lovSql.append(" order by ").append(resultSet.getString("order_clause")).append("");
                                }
                                U.log("GET PROJECT_STR SQL :    " + lovSql);
//                                Statement st1 = c.createStatement();
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
                                            //log error
                                        }
                                    }
                                }
                            }
                        } else if (defaultValue != null) {
                            model.setValue(resultSet.getString("para_default_value"));
                        }
                    } else {
                        try {
                            String count = resultSet.getString("slno");
//                            if (rss.getString("PARA_DEFAULT_VALUE" + loopCount) != null) {
                            model.setValue(rss.getString("PARA_DEFAULT_VALUE" + count));
//                            } else {
//                                loopCount = loopCount + 1;
//                                model.setValue(rss.getString("PARA_DEFAULT_VALUE" + loopCount));
//                            }
                        } catch (SQLException e) {
                            model.setValue("");
                        }
                    }
                    if (resultSet.getString("para_desc").equals("VRNO")) {
                        String svVoucherSeries = null;
                        String svVoucherPad = null;
                        String svVoucherCode = null;
                        String svVoucherDefaultDivCode = null;
                        String getdefultuserLinkValue = "select * from view_default_user_links";
//                        PrepareStatement ds = c.prepareStatement("");
                        preparedStatement = c.prepareStatement(getdefultuserLinkValue);
                        ResultSet rs = preparedStatement.executeQuery(getdefultuserLinkValue);
                        try {
                            if (rs != null && rs.next()) {
                                if (first_screen.contains("S")) {
                                    svVoucherCode = rs.getString("sv_Voucher_TCode");
                                    svVoucherSeries = rs.getString("sv_Voucher_series");
                                    svVoucherPad = rs.getString("sv_Voucher_pad");
                                    svVoucherDefaultDivCode = rs.getString("sv_voucher_default_div_code");
                                }
                                if (first_screen.contains("O")) {
                                    svVoucherCode = rs.getString("order_TCode");
                                    svVoucherSeries = rs.getString("order_series");
                                    svVoucherPad = rs.getString("order_pad");
                                    svVoucherDefaultDivCode = rs.getString("order_default_div_code");
                                } else {
                                    svVoucherCode = rs.getString("sv_Voucher_TCode");
                                    svVoucherSeries = rs.getString("sv_Voucher_series");
                                    svVoucherPad = rs.getString("sv_Voucher_pad");
                                    svVoucherDefaultDivCode = rs.getString("sv_voucher_default_div_code");
                                }
                            }
                        } finally {
                            if (rs != null) {
                                try {
                                    rs.close();
                                } catch (SQLException e) {
                                    //log error
                                }
                            }
                        }
                        U.log("PROCEDURE TO GENERATE VRNO :  " + "call lhs_crm.generate_VRNO(" + svVoucherSeries + ",TO_DATE(sysdate,'DD-MM-RRRR'),"
                                + svVoucherPad + "," + entityCode + "," + svVoucherDefaultDivCode
                                + "," + acc_year + "," + svVoucherCode + ")");
                        
                        String executeProc = "{call lhs_crm.generate_VRNO(?,TO_DATE(sysdate,'DD-MM-RRRR'),?,?,?,?,?)}";
                        PreparedStatement procCall = c.prepareCall(executeProc);
                        procCall.setString(1, svVoucherSeries);// series----EQ
                        procCall.setString(2, svVoucherPad);//pad-----3
                        procCall.setString(3, entityCode);
                        procCall.setString(4, svVoucherDefaultDivCode);
                        procCall.setString(5, acc_year);
                        procCall.setString(6, svVoucherCode);// tcode----E
                        try {
                            procCall.executeUpdate();
                        } catch (Exception e) {
                            U.errorLog(e);
                        }
//                        Statement stmt = c.createStatement();

                        String strSLNoQuery = "select lhs_crm.return_new_vrno from dual";
                        preparedStatement = c.prepareStatement(strSLNoQuery);
                        rs = preparedStatement.executeQuery(strSLNoQuery);
                        try {
                            if (rs.next()) {
                                string_vrno = rs.getString(1);
                                U.log("String_vrno===" + string_vrno);
                                model.setValue(string_vrno);
                            }
                        } finally {
                            if (rs != null) {
                                try {
                                    rs.close();
                                } catch (SQLException e) {
                                    //log error
                                }
                            }
                        }
                        appendVRNO(string_vrno, entityCode, svVoucherDefaultDivCode, acc_year, svVoucherCode);
                    }
                    if (resultSet.getString("para_desc").contains("Consumer Number")) {
                        String defult_value = resultSet.getString("Column_default_value");
                        defult_value = defult_value.replace("ENTITY_CODE", entity).replace("DIV_CODE", defualt_div_code);
                        String consumerVal = getConsumerNumber(defult_value);
                        model.setValue(consumerVal);
                    }
                    model.setPara_default_value(resultSet.getString("Para_default_value"));
                    model.setPara_desc(resultSet.getString("Para_desc"));
                    model.setColumn_size(resultSet.getString("Column_size"));
                    model.setData_type(resultSet.getString("Data_type"));
                    model.setEntry_by_user(resultSet.getString("Entry_by_user"));
                    model.setNullable(resultSet.getString("Nullable"));
                    model.setStatus(resultSet.getString("Status"));
                    model.setPara_column(resultSet.getString("para_column"));
//                    model.setDependent_row(resultSet.getString("dependent_row"));
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
                        sql = "select para_column from LHSSYS_ALERT_DIRECT_EMAIL_PARA where slno in  "
                                + "(" + dependentRowString + ") and seq_id=" + seqNo;
                        U.log("sqldependent : " + sql);
                        
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
                                    //log error
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
//                    U.log("slno  ::  " + model.getSLNO());
                    model.setShowDataInReportHead(resultSet.getString("rep_para_name"));

//                    U.log("resultSet.getString(\"dependent_row\")=="+resultSet.getString("dependent_row"));
                    //for dropdown (D)or H
                    if (resultSet.getString("dependent_row") == null || resultSet.getString("dependent_row") == "") {
                        if (resultSet.getString("column_select_list_value") != null && resultSet.getString("item_help_property").contains("H")
                                || resultSet.getString("item_help_property").contains("D")) {
                            String selectquery = resultSet.getString("column_select_list_value");
                            selectquery = selectquery.replace("USER_CODE", USER_CODE);
                            selectquery = "select " + selectquery + " from dual";
//                        U.log("DROP DOWN CONTROL VALUE SQL : " + selectquery);
//                        PreparedStatement ps2 = c.prepareStatement(selectquery);
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
                                        //log error
                                    }
                                }
                            }
                        }
                    }
                    if (resultSet.getString("dependent_row_logic") != null) {
                        PreparedStatement pr = null;
                        ResultSet rs = null;
                        try {
                            String sqlQuary = resultSet.getString("dependent_row_logic");
                            pr = c.prepareStatement(sqlQuary.replace("'replaceValue'", "'" + model.getValue() + "'"));
                            rs = pr.executeQuery();
                            if (rs != null && rs.next()) {
                                model.setValue(rs.getString(1));
                            }
                        } catch (Exception ex) {
                            ex.printStackTrace();
                        } finally {
                            try {
                                if (rs != null) {
                                    rs.close();
                                }
                            } catch (Exception ex) {
                                
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
            U.errorLog(e);
        } finally {
            if (resultSet != null && rss != null) {
                try {
                    resultSet.close();
                    rss.close();
                } catch (SQLException e) {
                    //log error
                }
            }
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
        }
        return json;
    }
    
    public void getListOfLOV() {
    }
    
    public void appendVRNO(String vrno, String entity_code, String div_code, String acc_year, String t_code) {
        PreparedStatement ps = null;
        ResultSet rs;
        U.log("VRNO GENERATION PROCEDURE in appendVRNO function : " + "{call LHS_CRM.append_vrno(" + vrno + "," + entity_code
                + "," + div_code + "," + acc_year + "," + t_code + ")}");
        String executeProc = "{call LHS_CRM.append_vrno(?,?,?,?,?)}";
        try {
            ps = c.prepareCall(executeProc);
            ps.setString(1, vrno);//vrno
            ps.setString(2, entity_code);//entity_code
            ps.setString(3, div_code);//div_code
            ps.setString(4, acc_year);//acc_year
            ps.setString(5, t_code);//t_code-----E
            ps.execute();
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
    }
    
    public String getConsumerNumber(String consumernoFun) {
        String consumer_no = null;
        PreparedStatement ps = null;
        String sql = "select " + consumernoFun + " from dual";
        U.log("consumer no. query :   " + sql);
        try {
            ps = c.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                consumer_no = rs.getString(1);
                U.log("GENERATED CONSUMER NO :   " + consumer_no);
            }
        } catch (SQLException e) {
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
        }
        return consumer_no;
    }
    
    public String replaceKeyBySessionMapValue(String defualtPopulatedSQL, String sessionMapValueString) {
//        U.log("defaultPopulateSql2 :" + defualtPopulatedSQL);
        String dates[] = sessionMapValueString.split("#");
///FROM_DATE~29-09-2018#TO_DATE~29-09-2018
        Map<String, String> map = new HashMap<String, String>();
        //to_date('28-09-2018','dd-mm-yyyy')
        System.out.println("sessionMapValueString: " + sessionMapValueString);
        System.out.println("DATES: " + dates.length);
        for (int i = 0; i < dates.length; i++) {
            if (dates[i].contains("FROM_DATE")) {
                U.log("===========>>>" + dates[i]);
                String[] fromDate = dates[i].split("~");
                if (fromDate[1].contains(" ")) {
                    fromDate[1] = fromDate[1].split(" ")[0];
                }
//                map.put("FROM_DATE", "to_date('" + fromDate[1] + "','mm-dd-yyyy')"); // for plugin Datepicker
//                map.put("FROM_DATE", "to_date('" + fromDate[1] + "','yyyy-mm-dd')"); // for Default Datepicker
                map.put("FROM_DATE", "to_date('" + fromDate[1] + "','dd-mm-yyyy')"); // for Default Datepicker
            } else {
                U.log("===========>>>" + dates[i]);
                String[] toDate = dates[i].split("~");
//                map.put("TO_DATE", "to_date('" + toDate[1] + "','mm-dd-yyyy')");   
//                map.put("TO_DATE", "to_date('" + toDate[1] + "','mm-dd-yyyy')");
                map.put("TO_DATE", "to_date('" + toDate[1] + "','dd-mm-yyyy')");
                
            }
        }
        defualtPopulatedSQL = defualtPopulatedSQL.replace("'FORM_DATE'", map.get("FROM_DATE"));
        defualtPopulatedSQL = defualtPopulatedSQL.replace("'TO_DATE'", map.get("TO_DATE"));
        U.log("replaced string with value map::::: " + defualtPopulatedSQL);
        return defualtPopulatedSQL;
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
                U.errorLog("exeception Inner---> " + e.getMessage());
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
            U.errorLog("exeception ---> " + ex.getMessage());
        }
        
        return res;
    }
}
