/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.google.common.collect.ListMultimap;
import com.lhs.EMPDR.JSONResult.FileUploadStatus;
import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
import com.lhs.EMPDR.entity.FileClass;

import com.lhs.EMPDR.entity.LoggerWrite;
import com.lhs.EMPDR.utility.LogStreamReader;
import com.lhs.EMPDR.utility.U;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.DateFormatSymbols;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.imageio.ImageIO;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCAddEntryDyanamicallyDAO {

    String base64Image;
    byte[] imageBytes;
    String[] imageTime;
    InputStream is;
    String table_name;
    String SS_TRAN_VRNO;
    String acc_year = null;
    Connection connection;
    StringBuffer colName = new StringBuffer();
    StringBuffer colValue = new StringBuffer();
    int seq_id = 0;
    JSONObject imgJSON = new JSONObject();
    FileClass f = new FileClass();
    boolean multipleEntryFlag = false;
    String replicateColumn = "";
    String replicateColumnValue = "";
    String generatedProdVRNO = "";
    HashMap<String, String> nondisplayColList = new HashMap<String, String>();
    HashMap<String, String> imgfileID = new HashMap<String, String>();
    HashMap<String, String> videofileId = new HashMap<String, String>();
    HashMap<String, String> defultValue = new HashMap<String, String>();
    String USER_CODE;
    LoggerWrite log = new LoggerWrite();
    HashMap<String, String> displayColList = new HashMap<String, String>();
    HashMap<String, String> columnStatus = new HashMap<String, String>();
    String seq_no;
    //Logger LOGGER=log.getLog();

    public JDBCAddEntryDyanamicallyDAO(Connection connection) {
        this.connection = connection;
    }

    public void getDetailOfColumns() {
        PreparedStatement ps = null;
        ResultSet rs;
        StringBuilder sql = new StringBuilder();

        sql.append("select u.* from lhssys_portal_data_dsc_update u where ");
        sql.append("seq_no=").append(seq_no).append("order by slno");

        U.log("SQL TO FETCH lhssys_portal_data_dsc_update for SEQ_NO : " + seq_no + " : " + sql.toString());
        try {
            ps = connection.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    table_name = rs.getString("table_name");
                    if (rs.getString("column_desc").equals("Invite Employee")) {
                        multipleEntryFlag = true;
                        replicateColumn = rs.getString("column_name");
                    }
                    if (rs.getString("status") != null && !rs.getString("status").contains("F")) {
                        displayColList.put(rs.getString("column_name"), rs.getString("column_default_value"));
                    } else {
                        String defaultVal = rs.getString("column_default_value");
                        if (defaultVal == null && rs.getString("column_name").contains("SEQ_ID")) {
                            if (seq_id == 0) {
                                //MOST IMPORTANT 
                                //select portal_app_tran_seq.nextval from dual
                                if (table_name.equals("LHSSYS_PORTAL_APP_TRAN")) {
                                    seq_id = nextSeqID(table_name);
                                } else {
                                    seq_id = (getDocumentListCount(table_name) + 1);
                                }
                            }
                            defaultVal = seq_id + "";
                        }
                        nondisplayColList.put(rs.getString("column_name"), defaultVal);
                    }
                } while (rs.next());
            }
        } catch (Exception e) {
            System.out.println("exeception ---> " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    System.out.println("exeception ---> " + e.getMessage());
                }
            }
        }
    }
    String sysdate = "";
    String userEnteredDate = "";

    public FileUploadStatus addEntry(String jsonString) throws ParseException, Exception {
        U.log("jsonstring : " + jsonString);
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        String returnREsult = "insert data";
        String procedureOfUpadte = "";
        String procedureOfInsert = "";
        String procedureOfInsertNew = "";
        PreparedStatement ps1 = null;
        ResultSet rs1 = null;

        String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE \n"
                + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )\n"
                + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
        System.out.println("getAccYearSQL : " + getAccYearSQL);

        try {
            ps1 = connection.prepareStatement(getAccYearSQL);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                acc_year = rs1.getString(1);
                System.out.println("currentAccYear : " + acc_year);
            } else {
                System.out.println("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
            }
        } catch (Exception e) {
        }

        try {

            JSONArray jsonArray = new JSONArray();
            JSONParser json_parser = new JSONParser();
            JSONObject json = (JSONObject) json_parser.parse(jsonString);
            jsonArray = (JSONArray) json.get("recordsInfo");
            int jsonArrLength = jsonArray.size();
//            U.log("json length :  " + jsonArrLength);
            for (int i = 0; i < 1; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);
                seq_no = obj1.get("DYNAMIC_TABLE_SEQ_ID") + "";
            }
            U.log("dynamic_table_seq_id : " + seq_no);
            getColumnStatus(seq_no);
            String getSS_TRAN_VRNO_SQL = "SELECT U.PRE_DATA_SAVE_EVENT FROM LHSSYS_PORTAL_TABLE_DSC_UPDATE U WHERE U.SEQ_NO = '" + seq_no + "'";
            String PRE_DATA_SAVE_EVENT = "";
            System.out.println("getSS_TRAN_VRNO_SQL : " + getSS_TRAN_VRNO_SQL);
            try {
                ps1 = connection.prepareStatement(getSS_TRAN_VRNO_SQL);
                rs1 = ps1.executeQuery();
                if (rs1 != null && rs1.next()) {
                    PRE_DATA_SAVE_EVENT = rs1.getString(1);
                    System.out.println("PRE_DATA_SAVE_EVENT : " + PRE_DATA_SAVE_EVENT);
                    if (PRE_DATA_SAVE_EVENT != null) {
                        if (PRE_DATA_SAVE_EVENT.contains("'ACC_CODE'")) {
                            PRE_DATA_SAVE_EVENT = PRE_DATA_SAVE_EVENT.replaceAll("'ACC_CODE'", "'" + acc_year + "'");
                        }
                        for (int i = 0; i < 1; i++) {
                            JSONObject jSONObject = (JSONObject) jsonArray.get(i);
                            for (int k = 0; k < jSONObject.size(); k++) {
                                Set<Map.Entry<String, Object>> entrySet = jSONObject.entrySet();
                                for (Map.Entry<String, Object> map : entrySet) {
                                    if (map.getKey().equals("DYNAMIC_TABLE_SEQ_ID")) {
                                        PRE_DATA_SAVE_EVENT = PRE_DATA_SAVE_EVENT.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()) + "'");
                                    } else {
                                        PRE_DATA_SAVE_EVENT = PRE_DATA_SAVE_EVENT.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()).toUpperCase() + "'");
                                    }
                                }
                            }
                        }
                        System.out.println("PRE_DATA_SAVE_EVENT AFTER REPLACING : " + PRE_DATA_SAVE_EVENT);
                        try {
                            PreparedStatement ps = connection.prepareStatement(PRE_DATA_SAVE_EVENT);
                            ps.executeUpdate();
                        } catch (Exception e) {
                            System.out.println("exeception ---> " + e.getMessage());
                            SS_TRAN_VRNO = e.getMessage();
                            String ValidatedMsgArr[] = SS_TRAN_VRNO.split(":");
                            SS_TRAN_VRNO = ValidatedMsgArr[1].trim();
                            String ValidatedMsgArr1[] = SS_TRAN_VRNO.split("ORA-");
                            SS_TRAN_VRNO = ValidatedMsgArr1[0].trim();
                            System.out.println("SS_TRAN_VRNO : " + SS_TRAN_VRNO);
                        }
                    }
                }
            } catch (Exception e) {
                System.out.println("exeception ---> " + e.getMessage());
            } finally {
                ps1.close();
                rs1.close();
            }

            try {
                for (int i = 1; i < jsonArrLength; i++) {
                    JSONObject obj1 = (JSONObject) jsonArray.get(i);
                    if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
                        for (String key : imgfileID.keySet()) {
                            System.out.println(key + " " + imgfileID.get(key));
                            String replaceKey = imgfileID.get(key).replaceAll("(\\d+)(.\\d+)", seq_id + "\\.$2");
                            U.log("replaceKey : " + replaceKey);
                            imgfileID.put(key, replaceKey);
                        }
                        U.log("imageTime: " + obj1.get("imageTime").toString() + "\n fileName : " + obj1.get("fileName").toString() + "\n USER_CODE : "
                                + USER_CODE + "\n image desc : " + obj1.get("desc").toString() + " \n sysFileName : " + obj1.get("sysFileName").toString());
                        String fileId = obj1.get("fileId").toString();
                        is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
                        if (obj1.get("sysFileName").toString().contains("sysFileName")
                                || obj1.get("sysFileName").toString().indexOf("sysFileName") > -1
                                || obj1.get("sysFileName").toString().lastIndexOf("sysFileName") > -1) {
                            insertDocument(obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
                                    obj1.get("sysFileName").toString(), is, Float.parseFloat(imgfileID.get(fileId)));
                        } else {
                            U.log("IMAGE PATH : " + obj1.get("sysFileName"));
                            writeFile(is, obj1);
                        }
                    }
                    if (obj1.get("videofile") != null && obj1.get("videofile").toString().length() > 3) {
                        base64Image = obj1.get("videofile").toString().split(",")[1];
                        imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
                        is = new ByteArrayInputStream(imageBytes);
                        if (is == null) {
                            U.log("video file is null");
                        }
                        insertVideo(obj1.get("videoFileName").toString(), USER_CODE, obj1.get("videoDesc").toString(),
                                obj1.get("sysFileName").toString(), is,
                                Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                    }
                }
            } catch (Exception e) {

            }
            Object obj = json_parser.parse(json.toString());
            JSONObject json_obj = new JSONObject();
            json_obj = (JSONObject) obj;
            Set<Object> set = json_obj.keySet();
            Iterator<Object> iterator = set.iterator();
            while (iterator.hasNext()) {
                Object obj1 = iterator.next();
                String columnValue = "";
                try {
                    columnValue = json_obj.get(obj).toString();
//                    U.log("columnValue  :  " + columnValue);
                } catch (Exception e) {
                    if (f.isNumber(obj.toString())) {
                        columnValue = null;
                    } else {
                        columnValue = "";
                    }
                }

                if (obj1.toString().equals("VRNO") && columnValue.isEmpty()) {
                    if (SS_TRAN_VRNO != null && !SS_TRAN_VRNO.isEmpty()) {
                        columnValue = SS_TRAN_VRNO;
                        fileUploadStatus.setVRNO(SS_TRAN_VRNO);
                    } else {
                        String prodVRNO_SQL = getReplacedprodVRNO_SQL(json_obj);
                        System.out.println("ReplacedprodVRNO_SQL : " + prodVRNO_SQL);

                        if (!acc_year.isEmpty()) {
                            prodVRNO_SQL = prodVRNO_SQL.replaceAll("ACC_YEAR", acc_year);
                        } else {
                            System.out.println("DIDN'T GOT CURRENT ACC YEAR ");
                        }

                        String prodVRNO_SQLArr[] = prodVRNO_SQL.split("~");
                        String getProdVRNO_SQL = prodVRNO_SQLArr[0];
                        String appendProdVRNO_SQL = prodVRNO_SQLArr[1];
                        System.out.println("getProdVRNO_SQL : " + getProdVRNO_SQL);
                        System.out.println("appendProdVRNO_SQL : " + appendProdVRNO_SQL);

                        try {
                            ps1 = connection.prepareStatement(getProdVRNO_SQL);
                            rs1 = ps1.executeQuery();
                            if (rs1 != null && rs1.next()) {
                                generatedProdVRNO = rs1.getString(1);
                                System.out.println("generatedProdVRNO : " + generatedProdVRNO);
                                columnValue = generatedProdVRNO;
                                if (!generatedProdVRNO.isEmpty()) {
                                    appendProdVRNO_SQL = appendProdVRNO_SQL.replaceAll("GEN_VRNO", generatedProdVRNO);
                                    System.out.println("appendProdVRNO_SQL with VRNO: " + appendProdVRNO_SQL);
                                    try {
                                        ps1 = connection.prepareStatement(appendProdVRNO_SQL);
                                        ps1.executeUpdate();
                                    } catch (SQLException e) {
                                        System.out.println("appendProdVRNO_SQL NOT EXECUTED PROPERLY : " + appendProdVRNO_SQL);
                                    }
                                } else {
                                    System.out.println("getProdVRNO_SQL NOT EXECUTED PROPERLY : " + getProdVRNO_SQL);
                                }
                            } else {
                                System.out.println("getProdVRNO_SQL NOT EXECUTED PROPERLY : " + getProdVRNO_SQL);
                            }
                        } catch (Exception e) {
                            System.out.println("exeception ---> " + e.getMessage());
                        } finally {
                            if (ps1 != null) {
                                try {
                                    ps1.close();
                                } catch (Exception e) {
                                    System.out.println("exeception ---> " + e.getMessage());
                                }
                            }
                        }
                        System.out.println("SERIES : " + columnValue + "\n prodVRNO_SQL : " + prodVRNO_SQL);
                    }
                }

            }

            String executeAfterSQL = "select execute_after_update, EXECUTE_AFTER_INSERT from lhssys_portal_table_dsc_update where seq_no = " + seq_no;

//            System.out.println("GET EXECUTE_AFTER_UPDATE, EXECUTE_AFTER_INSERT SQL : " + executeAfterSQL);

            ps1 = connection.prepareStatement(executeAfterSQL);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                procedureOfUpadte = rs1.getString(1);
                procedureOfInsert = rs1.getString(2);
                procedureOfInsertNew = rs1.getString(2);
//                System.out.println(" execute_after_update procedure : " + procedureOfUpadte);
//                System.out.println(" EXECUTE_AFTER_INSERT procedure : " + procedureOfInsert);
            }
            if (procedureOfInsert != null && procedureOfInsert.length() > 2) {
                ps1 = connection.prepareStatement("select TO_CHAR(SYSDATE, 'DD-MM-YYYY  HH24:MI:SS') as systemdate from dual");
                rs1 = ps1.executeQuery();
                if (rs1 != null && rs1.next()) {
                    sysdate = rs1.getString(1);
                }
                U.log("System Date : " + sysdate);
//                JSONArray listJsonArray1 = new JSONArray();
//                System.out.println("jsonString : " + jsonString);
//                JSONParser json_parser1 = new JSONParser();
//
//                JSONObject listjson1 = (JSONObject) json_parser1.parse(jsonString);
//                listJsonArray1 = (JSONArray) listjson1.get("list");
//                int listArrLength1 = listJsonArray1.size();
//                for (int j = 0; j < listArrLength1; j++) {
//                    System.out.println(" EXECUTE_AFTER_INSERT procedure : " + procedureOfInsert);
//                    colName = new StringBuffer();
//                    colValue = new StringBuffer();
//                    //                StringBuffer stringBuffer = new StringBuffer();
//                    JSONObject json = (JSONObject) json_parser.parse(listJsonArray1.get(j).toString());
//                    

                JSONArray jsonArray1 = new JSONArray();
                JSONParser json_parser1 = new JSONParser();
                JSONObject json1 = (JSONObject) json_parser1.parse(jsonString);
                jsonArray1 = (JSONArray) json1.get("recordsInfo");
                for (int i = 0; i < 1; i++) {
                    JSONObject jSONObject = (JSONObject) jsonArray1.get(i);
                    for (int k = 0; k < jSONObject.size(); k++) {
                        Set<Map.Entry<String, Object>> entrySet = jSONObject.entrySet();
                        for (Map.Entry<String, Object> map : entrySet) {
                            if (map.getKey().equals("DYNAMIC_TABLE_SEQ_ID")) {
                                procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()) + "'");
                            } else if (map.getKey().equals("VRNO") && map.getValue().equals(null)) {
                                if (!generatedProdVRNO.isEmpty()) {
                                    procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + generatedProdVRNO + "'");
                                }
                            } else {
                                procedureOfInsert = procedureOfInsert.replace("'" + map.getKey()
                                        + "'", "'" + String.valueOf(map.getValue()).toUpperCase() + "'");
                            }
                        }
                    }
                    try {
                        System.out.println("FINAL REPLACED VALUE procedureOfInsert : " + procedureOfInsert);
                        ps1 = connection.prepareStatement(procedureOfInsert);
                        int n = ps1.executeUpdate();
                        if (n >= 0) {
                            String result = n + " row inserted.";
                            procedureOfInsert = procedureOfInsertNew;
                            fileUploadStatus.setStatus(returnREsult);
                            System.out.println(" execute_after_insert result : " + result);
                        } else {
                            String result = n + " row updated";
                            procedureOfInsert = procedureOfInsertNew;
                            fileUploadStatus.setStatus(result);
                            System.out.println(" execute_after_insert result : " + result);
                        }
                    } catch (SQLException e) {
                        System.out.println("exeception ---> " + e.getMessage());
                        /* String returnMessage = "";
                            String[] returnMessageArr;
                            returnMessage = e.getMessage();
                            System.out.println("returnMessage : " + returnMessage);
                            returnMessageArr = returnMessage.split(":");
                            returnMessage = returnMessageArr[1];
                            System.out.println("execute_after_update result  e.getMessage() : " + e.getMessage());
                            returnMessage = returnMessage.replaceAll("ORA-06512", "");
                            System.out.println("returnMessage : " + returnMessage);
                            return returnMessage;*/
                        //                        return "Error occoured sue to some internal reason.";
                        fileUploadStatus.setStatus("Error occoured due to some internal reason.");
                    }
                }
//                }
            } else {
                fileUploadStatus = addInsertEntry(jsonString, "");
                if (SS_TRAN_VRNO != null && !SS_TRAN_VRNO.isEmpty()) {
                    fileUploadStatus.setVRNO(SS_TRAN_VRNO);
                }
            }
        } catch (SQLException e) {
            System.out.println("exeception ---> " + e.getMessage());
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (SQLException e) {
                }
            }
        }
        return fileUploadStatus;
    }

    public FileUploadStatus addEntrySql(String jsonString, String sqlFlag) throws ParseException, Exception {
        U.log("jsonstring : " + jsonString);

        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        String returnREsult = "insert data";
        String procedureOfUpadte = "";
        String procedureOfInsert = "";
        String procedureOfInsertNew = "";
        PreparedStatement ps1 = null;
        ResultSet rs1 = null;

        String sqlData = "";
        connection.setAutoCommit(false);
        try {

            JSONArray jsonArray = new JSONArray();
            JSONParser json_parser = new JSONParser();
            JSONObject json = (JSONObject) json_parser.parse(jsonString);
            jsonArray = (JSONArray) json.get("recordsInfo");
            int jsonArrLength = jsonArray.size();
//            U.log("json length :  " + jsonArrLength);
            for (int i = 0; i < 1; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);
                seq_no = obj1.get("DYNAMIC_TABLE_SEQ_ID") + "";
            }
            U.log("dynamic_table_seq_id : " + seq_no);

            try {
                for (int i = 1; i < jsonArrLength; i++) {
                    JSONObject obj1 = (JSONObject) jsonArray.get(i);
                    if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
                        for (String key : imgfileID.keySet()) {
                            System.out.println(key + " " + imgfileID.get(key));
                            String replaceKey = imgfileID.get(key).replaceAll("(\\d+)(.\\d+)", seq_id + "\\.$2");
                            U.log("replaceKey : " + replaceKey);
                            imgfileID.put(key, replaceKey);
                        }
                        U.log("imageTime: " + obj1.get("imageTime").toString() + "\n fileName : " + obj1.get("fileName").toString() + "\n USER_CODE : "
                                + USER_CODE + "\n image desc : " + obj1.get("desc").toString() + " \n sysFileName : " + obj1.get("sysFileName").toString());
                        String fileId = obj1.get("fileId").toString();
                        is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
                        if (obj1.get("sysFileName").toString().contains("sysFileName")
                                || obj1.get("sysFileName").toString().indexOf("sysFileName") > -1
                                || obj1.get("sysFileName").toString().lastIndexOf("sysFileName") > -1) {
                            insertDocument(obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
                                    obj1.get("sysFileName").toString(), is, Float.parseFloat(imgfileID.get(fileId)));
                        } else {
                            U.log("IMAGE PATH : " + obj1.get("sysFileName"));
                            writeFile(is, obj1);
                        }
                    }
                    if (obj1.get("videofile") != null && obj1.get("videofile").toString().length() > 3) {
                        base64Image = obj1.get("videofile").toString().split(",")[1];
                        imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
                        is = new ByteArrayInputStream(imageBytes);
                        if (is == null) {
                            U.log("video file is null");
                        }
                        insertVideo(obj1.get("videoFileName").toString(), USER_CODE, obj1.get("videoDesc").toString(),
                                obj1.get("sysFileName").toString(), is,
                                Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                    }
                }
            } catch (Exception e) {

            }
            Object obj = json_parser.parse(json.toString());
            JSONObject json_obj = new JSONObject();
            json_obj = (JSONObject) obj;
            Set<Object> set = json_obj.keySet();
            Iterator<Object> iterator = set.iterator();
            while (iterator.hasNext()) {
                Object obj1 = iterator.next();
                String columnValue = "";
                try {
                    columnValue = json_obj.get(obj).toString();
//                    U.log("columnValue  :  " + columnValue);
                } catch (Exception e) {
                    if (f.isNumber(obj.toString())) {
                        columnValue = null;
                    } else {
                        columnValue = "";
                    }
                }

                if (obj1.toString().equals("VRNO") && columnValue.isEmpty()) {
                    String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE \n"
                            + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )\n"
                            + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
                    System.out.println("getAccYearSQL : " + getAccYearSQL);
                    String currentAccYear = "";

                    String prodVRNO_SQL = getReplacedprodVRNO_SQL(json_obj);
                    System.out.println("ReplacedprodVRNO_SQL : " + prodVRNO_SQL);

                    try {
                        sqlData = sqlData + "\n----------AccYearSQL----------\n" + getAccYearSQL;
                        ps1 = connection.prepareStatement(getAccYearSQL);
                        rs1 = ps1.executeQuery();
                        if (rs1 != null && rs1.next()) {
                            currentAccYear = rs1.getString(1);
                            System.out.println("currentAccYear : " + currentAccYear);
                            if (!currentAccYear.isEmpty()) {
                                prodVRNO_SQL = prodVRNO_SQL.replaceAll("ACC_YEAR", currentAccYear);
                            } else {
                                System.out.println("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                            }
                        } else {
                            System.out.println("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                        }
                    } catch (Exception e) {
                    } finally {
                        if (ps1 != null) {
                            try {
                                ps1.close();
                                rs1.close();
                            } catch (Exception e) {
                            }
                        }
                    }
                    String prodVRNO_SQLArr[] = prodVRNO_SQL.split("~");
                    String getProdVRNO_SQL = prodVRNO_SQLArr[0];
                    String appendProdVRNO_SQL = prodVRNO_SQLArr[1];
                    System.out.println("getProdVRNO_SQL : " + getProdVRNO_SQL);
                    System.out.println("appendProdVRNO_SQL : " + appendProdVRNO_SQL);

                    try {
                        sqlData = sqlData + "\n----------get Vrno Sql ----------\n" + getProdVRNO_SQL;
                        ps1 = connection.prepareStatement(getProdVRNO_SQL);
                        rs1 = ps1.executeQuery();
                        if (rs1 != null && rs1.next()) {
                            generatedProdVRNO = rs1.getString(1);
                            System.out.println("generatedProdVRNO : " + generatedProdVRNO);
                            columnValue = generatedProdVRNO;
                            if (!generatedProdVRNO.isEmpty()) {
                                appendProdVRNO_SQL = appendProdVRNO_SQL.replaceAll("GEN_VRNO", generatedProdVRNO);
                                System.out.println("appendProdVRNO_SQL with VRNO: " + appendProdVRNO_SQL);
                                try {
                                    sqlData = sqlData + "\n----------append Vrno Sql ----------\n" + appendProdVRNO_SQL;
                                    ps1 = connection.prepareStatement(appendProdVRNO_SQL);
                                    ps1.executeUpdate();
                                } catch (SQLException e) {
                                    System.out.println("appendProdVRNO_SQL NOT EXECUTED PROPERLY : " + appendProdVRNO_SQL);
                                }
                            } else {
                                System.out.println("getProdVRNO_SQL NOT EXECUTED PROPERLY : " + getProdVRNO_SQL);
                            }
                        } else {
                            System.out.println("getProdVRNO_SQL NOT EXECUTED PROPERLY : " + getProdVRNO_SQL);
                        }
                    } catch (Exception e) {
                        System.out.println("exeception ---> " + e.getMessage());
                    } finally {
                        if (ps1 != null) {
                            try {
                                ps1.close();
                            } catch (Exception e) {
                                System.out.println("exeception ---> " + e.getMessage());
                            }
                        }
                    }
                    System.out.println("SERIES : " + columnValue + "\n prodVRNO_SQL : " + prodVRNO_SQL);
                }
            }

            String executeAfterSQL = "select execute_after_update, EXECUTE_AFTER_INSERT from lhssys_portal_table_dsc_update where seq_no = " + seq_no;

            System.out.println("GET EXECUTE_AFTER_UPDATE, EXECUTE_AFTER_INSERT SQL : " + executeAfterSQL);
            sqlData = sqlData + "\n----------Execute After SQL Sql ----------\n" + executeAfterSQL;
            ps1 = connection.prepareStatement(executeAfterSQL);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                procedureOfUpadte = rs1.getString(1);
                procedureOfInsert = rs1.getString(2);
                procedureOfInsertNew = rs1.getString(2);
//                System.out.println(" execute_after_update procedure : " + procedureOfUpadte);
//                System.out.println(" EXECUTE_AFTER_INSERT procedure : " + procedureOfInsert);
            }
            if (procedureOfInsert != null && procedureOfInsert.length() > 2) {
                ps1 = connection.prepareStatement("select TO_CHAR(SYSDATE, 'DD-MM-YYYY  HH24:MI:SS') as systemdate from dual");
                rs1 = ps1.executeQuery();
                if (rs1 != null && rs1.next()) {
                    sysdate = rs1.getString(1);
                }
//                U.log("System Date : " + sysdate);
//                JSONArray listJsonArray1 = new JSONArray();
//                System.out.println("jsonString : " + jsonString);
//                JSONParser json_parser1 = new JSONParser();
//
//                JSONObject listjson1 = (JSONObject) json_parser1.parse(jsonString);
//                listJsonArray1 = (JSONArray) listjson1.get("list");
//                int listArrLength1 = listJsonArray1.size();
//                for (int j = 0; j < listArrLength1; j++) {
//                    System.out.println(" EXECUTE_AFTER_INSERT procedure : " + procedureOfInsert);
//                    colName = new StringBuffer();
//                    colValue = new StringBuffer();
//                    //                StringBuffer stringBuffer = new StringBuffer();
//                    JSONObject json = (JSONObject) json_parser.parse(listJsonArray1.get(j).toString());
//                    

                JSONArray jsonArray1 = new JSONArray();
                JSONParser json_parser1 = new JSONParser();
                JSONObject json1 = (JSONObject) json_parser1.parse(jsonString);
                jsonArray1 = (JSONArray) json1.get("recordsInfo");
                for (int i = 0; i < 1; i++) {
                    JSONObject jSONObject = (JSONObject) jsonArray1.get(i);
                    for (int k = 0; k < jSONObject.size(); k++) {
                        Set<Map.Entry<String, Object>> entrySet = jSONObject.entrySet();
                        for (Map.Entry<String, Object> map : entrySet) {
                            if (map.getKey().equals("DYNAMIC_TABLE_SEQ_ID")) {
                                procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()) + "'");
                            } else if (map.getKey().equals("VRNO") && map.getValue().equals(null)) {
                                if (!generatedProdVRNO.isEmpty()) {
                                    procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + generatedProdVRNO + "'");
                                }
                            } else {
                                procedureOfInsert = procedureOfInsert.replace("'" + map.getKey()
                                        + "'", "'" + String.valueOf(map.getValue()).toUpperCase() + "'");
                            }
                        }
                    }
                    try {
                        System.out.println("FINAL REPLACED VALUE procedureOfInsert : " + procedureOfInsert);
                        sqlData = sqlData + "\n----------Procedure Of Insert Sql ----------\n" + procedureOfInsert;
                        ps1 = connection.prepareStatement(procedureOfInsert);
                        int n = ps1.executeUpdate();
                        if (n >= 0) {
                            String result = n + " row inserted.";
                            procedureOfInsert = procedureOfInsertNew;
                            fileUploadStatus.setStatus(returnREsult);
                            System.out.println(" execute_after_insert result : " + result);
                        } else {
                            String result = n + " row updated";
                            procedureOfInsert = procedureOfInsertNew;
                            fileUploadStatus.setStatus(result);
                            System.out.println(" execute_after_insert result : " + result);
                        }
                    } catch (SQLException e) {
                        System.out.println("exeception ---> " + e.getMessage());
                        /* String returnMessage = "";
                            String[] returnMessageArr;
                            returnMessage = e.getMessage();
                            System.out.println("returnMessage : " + returnMessage);
                            returnMessageArr = returnMessage.split(":");
                            returnMessage = returnMessageArr[1];
                            System.out.println("execute_after_update result  e.getMessage() : " + e.getMessage());
                            returnMessage = returnMessage.replaceAll("ORA-06512", "");
                            System.out.println("returnMessage : " + returnMessage);
                            return returnMessage;*/
                        //                        return "Error occoured sue to some internal reason.";
                        fileUploadStatus.setStatus("Error occoured due to some internal reason.");
                    }
                }
//                }
                fileUploadStatus.setSqlData(sqlData);
            } else {
                fileUploadStatus = addInsertEntry(jsonString, sqlData);
            }
        } catch (SQLException e) {
            System.out.println("exeception ---> " + e.getMessage());
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (SQLException e) {
                }
            }
        }

        connection.rollback();
        return fileUploadStatus;
    }

    public FileUploadStatus addInsertEntry(String jsonString, String sqlData) throws ParseException, Exception {
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        PreparedStatement ps1 = null;
        try {
            ps1 = connection.prepareStatement("select TO_CHAR(sysdate, 'DD-MM-YYYY HH24:MI:SS') as systemdate from dual");
            ResultSet rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                sysdate = rs1.getString(1);
            }
            U.log("System Date : " + sysdate);
        } catch (Exception e) {
            System.out.println("exeception ---> " + e.getMessage());
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    System.out.println("exeception ---> " + e.getMessage());
                }
            }
        }
        StringBuffer stringBuffer = new StringBuffer();
        PreparedStatement ps = null;
//        U.log("JSON STRING TO ADD ENTRY :   " + jsonString);
//        LoggerWrite.logger.info(jsonString);
        JSONArray jsonArray = new JSONArray();
        JSONParser json_parser = new JSONParser();
        JSONObject json = (JSONObject) json_parser.parse(jsonString);
        jsonArray = (JSONArray) json.get("recordsInfo");
        int jsonArrLength = jsonArray.size();
        U.log("json length :  " + jsonArrLength);

        for (int i = 0; i < 1; i++) {
            JSONObject obj1 = (JSONObject) jsonArray.get(i);
            seq_no = obj1.get("DYNAMIC_TABLE_SEQ_ID") + "";
        }

        getDetailOfColumns();

        U.log("Table Name : " + table_name);
        if (seq_id == 0) {
            //MOST IMPORTANT 
            //select portal_app_tran_seq.nextval from dual
            seq_id = (getDocumentListCount(table_name) + 1);
        }
        U.log("sequence id :  " + seq_id);

        Object obj = json_parser.parse(json.toString());
        JSONObject json_obj = new JSONObject();
        json_obj = (JSONObject) obj;
        parseJson(json_obj);

        //false status fields
        for (String key : imgfileID.keySet()) {
            System.out.println(key + " " + imgfileID.get(key));
        }

        //append nonn display column
        for (Map.Entry m : nondisplayColList.entrySet()) {
            if (m.getValue() != null) {
//                System.out.println("::::" + m.getKey() + " " + m.getValue().toString().replace("'", "") + "\n" + defultValue.get("LASTUPDATE"));
                String predefinedVal = defultValue.get(m.getKey());
                if (predefinedVal == null) {
                    predefinedVal = m.getValue().toString();
                }
                if (m.getKey().toString().contains("LASTUPDATE")) {
                    predefinedVal = "to_date('" + sysdate + "','dd-MM-yyyy HH24:MI:SS')";
                }
                if (columnStatus.get(m.getKey()).equalsIgnoreCase("D")) {
                } else {
                    colName.append(m.getKey()).append(",");
                    colValue.append(predefinedVal).append(",");
                }
            }
        }

        int noOfAddEntry = 1;
        if (multipleEntryFlag == true) {
            noOfAddEntry = replicateColumnValue.split(",").length;
        }
        int priviousSeqId = seq_id;
        String priviousUserCode = USER_CODE;
        String currentUserCode = USER_CODE;
        for (int j = 0; j < noOfAddEntry; j++) {
            if (j > 0) {
                currentUserCode = replicateColumnValue.split(",")[j - 1];
                if (table_name.equals("LHSSYS_PORTAL_APP_TRAN")) {
                    seq_id = nextSeqID(table_name);
                } else {
                    seq_id = (getDocumentListCount(table_name) + 1);
                }
                for (String key : imgfileID.keySet()) {
                    System.out.println(key + " " + imgfileID.get(key));
                    String replaceKey = imgfileID.get(key).replaceAll("(\\d+)(.\\d+)", seq_id + "\\.$2");
                    U.log("replaceKey : " + replaceKey);
                    imgfileID.put(key, replaceKey);
                }
            }

            String columnName = colName.toString().substring(0, colName.toString().lastIndexOf(","));
            String columnValue = colValue.toString().substring(0, colValue.toString().lastIndexOf(","));
//            U.log("priviousSeqId : " + priviousSeqId + "\n    Obtained SEQ_ID : " + seq_id);
//            U.log("priviousUserCode : " + priviousUserCode + "\n   currentUserCode : " + currentUserCode);
            if (USER_CODE != null) {
                columnValue = columnValue.replace(priviousUserCode, currentUserCode);
            }
            columnValue = columnValue.replace(String.valueOf(priviousSeqId), String.valueOf(seq_id));
//            System.out.println("COLUMN NAME : " + colName + "\n    COLUMN VALUES : " + columnValue + "\n  IMAGE DATA : " + imgJSON.toString());
            stringBuffer = new StringBuffer();
            stringBuffer.append("Insert into " + table_name + "\n" + "     (" + columnName + ") values(" + columnValue + ")");
            try {
                sqlData = sqlData + "\n----------NEW ENTRY INSERT QUERY ----------\n" + stringBuffer.toString();
                ps = connection.prepareStatement(stringBuffer.toString());
                System.out.println("SYSDATE : " + sysdate + " NEW ENTRY INSERT QUERY :  " + stringBuffer.toString());
                fileUploadStatus.setSqlData(sqlData);
                ps.execute();
                String result = "insert data";
                fileUploadStatus.setStatus(result);
                fileUploadStatus.setVRNO(generatedProdVRNO);
                System.out.println("result==" + result);
            } catch (Exception e) {
                System.out.println("exeception ---> " + e.getMessage());
                System.out.println("ADD ENTRY EXCEPTION  : " + e);
                fileUploadStatus.setStatus("Something went wrong, please try again...");
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (Exception e) {
                        System.out.println("exeception ---> " + e.getMessage());
                    }
                }
            }

            {
                for (int i = 1; i < jsonArrLength; i++) {
                    JSONObject obj1 = (JSONObject) jsonArray.get(i);
                    if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
                        String fileId = obj1.get("fileId").toString();
                        is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
                        if (obj1.get("sysFileName").toString().contains("sysFileName")
                                || obj1.get("sysFileName").toString().indexOf("sysFileName") > -1
                                || obj1.get("sysFileName").toString().lastIndexOf("sysFileName") > -1) {
                            insertDocument(obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
                                    obj1.get("sysFileName").toString(), is, Float.parseFloat(imgfileID.get(fileId)));
                        } else {
                            U.log("IMAGE sysFileName : " + obj1.get("sysFileName"));
                            writeFile(is, obj1);
                        }
                    }
                    if (obj1.get("videofile") != null && obj1.get("videofile").toString().length() > 3) {
                        base64Image = obj1.get("videofile").toString().split(",")[1];
                        imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
                        is = new ByteArrayInputStream(imageBytes);
                        U.log(obj1.get("videoFileName").toString() + "=" + USER_CODE + "=" + obj1.get("videoDesc").toString()
                                + "=" + obj1.get("sysFileName").toString());
                        if (is == null) {
                            U.log("video file is null");
                        }
                        insertVideo(obj1.get("videoFileName").toString(), USER_CODE, obj1.get("videoDesc").toString(),
                                obj1.get("sysFileName").toString(), is,
                                Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                    }
                }
            }
        }
        fileUploadStatus.setSqlData(sqlData);
        return fileUploadStatus;
    }

    public void getArray(Object object2) throws ParseException {
        JSONArray jsonArr = (JSONArray) object2;
        for (int k = 0; k < jsonArr.size(); k++) {
            if (jsonArr.get(k) instanceof JSONObject) {
                parseJson((JSONObject) jsonArr.get(k));
            } else {
            }
        }
    }
    int setdata = 0;

    public String getReplacedprodVRNO_SQL(JSONObject jsonObject) throws ParseException {
        Set<Object> set = jsonObject.keySet();
        Iterator<Object> iterator = set.iterator();
        String prodVRNO_SQL
                = "DECLARE\n"
                + "  v_out VARCHAR2(50);\n"
                + "BEGIN\n"
                + "  v_out :=GET_VRNO('SERIES', to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy'), 'PAD',\n"
                + "                'ENTITY_CODE', 'DIV_CODE','ACC_YEAR','TCODE') ;\n"
                + "  DBMS_OUTPUT.put_line(v_out || SQLERRM);\n"
                + "  RAISE_APPLICATION_ERROR(-20000, v_out);\n"
                + "  return;\n"
                + "END;"
                + "~"
                + "BEGIN\n"
                + "  APPEND_VRNO('GEN_VRNO', 'ENTITY_CODE', 'DIV_CODE', 'ACC_YEAR', 'TCODE');\n"
                + "END;";

//        LHS_UTILITY.
        while (iterator.hasNext()) {
            Object obj = iterator.next();
            if (jsonObject.get(obj) instanceof JSONArray) {
                getArray(jsonObject.get(obj));
            } else if (!obj.toString().contains("imageTime") && !obj.toString().contains("video")
                    && !obj.toString().contains("file") && !obj.toString().contains("fileName")
                    && !obj.toString().contains("desc") && !obj.toString().contains("sysFileName")) {
                try {
                    if (obj.toString().equals(replicateColumn)) {
                        replicateColumnValue = jsonObject.get(obj).toString();
                    }
                    String columnValue = "";
                    try {
                        columnValue = jsonObject.get(obj).toString();
                    } catch (Exception e) {
                        if (f.isNumber(obj.toString())) {
                            columnValue = null;
                        } else {
                            columnValue = "";
                        }
                    }

                    if (obj.toString().equalsIgnoreCase("VRDATE")) {
                        prodVRNO_SQL = prodVRNO_SQL.replaceAll("VRDATE", columnValue);
                    }
                    if (obj.toString().equalsIgnoreCase("SERIES")) {
                        prodVRNO_SQL = prodVRNO_SQL.replaceAll("SERIES", columnValue);
                    }
                    if (obj.toString().equalsIgnoreCase("ENTITY_CODE")) {
                        prodVRNO_SQL = prodVRNO_SQL.replaceAll("ENTITY_CODE", columnValue);
                        System.out.println("ENTITY_CODE : " + columnValue);
                        if (columnValue.equals("VE")) {
                            prodVRNO_SQL = prodVRNO_SQL.replaceAll("'DIV_CODE'", "PO");
                            prodVRNO_SQL = prodVRNO_SQL.replaceAll("'PAD'", "3");
                            System.out.println("divCode VE : NULL");
                        } else {
                            prodVRNO_SQL = prodVRNO_SQL.replaceAll("'PAD'", "5");
                        }
                    }
                    if (obj.toString().equalsIgnoreCase("DIV_CODE")) {
                        prodVRNO_SQL = prodVRNO_SQL.replaceAll("DIV_CODE", columnValue);
                    }
                    if (obj.toString().equalsIgnoreCase("ACC_YEAR")) {
                        prodVRNO_SQL = prodVRNO_SQL.replaceAll("ACC_YEAR", columnValue);
                    }
                    if (obj.toString().equalsIgnoreCase("TCODE")) {
                        prodVRNO_SQL = prodVRNO_SQL.replaceAll("TCODE", columnValue);
                    }
                } catch (Exception ex) {
                }
            }
        }
        return prodVRNO_SQL;
    }

    public void parseJson(JSONObject jsonObject) throws ParseException {

        jsonObject = checkStartAndEndDate(jsonObject);

        PreparedStatement ps = null;
        ResultSet rs = null;
        Set<Object> set = jsonObject.keySet();
        Iterator<Object> iterator = set.iterator();

        while (iterator.hasNext()) {
            Object obj = iterator.next();
            if (jsonObject.get(obj) instanceof JSONArray) {
                getArray(jsonObject.get(obj));
            } else if (jsonObject.get(obj) instanceof JSONObject) {
                parseJson((JSONObject) jsonObject.get(obj));
            } else {
                if (setdata == 0) {
                    try {
                        setdata++;
                        setDatatype(seq_no);
                    } catch (Exception e) {
                        System.out.println("exeception ---> " + e.getMessage());
                    }
                }
                if (U.match(obj.toString().toLowerCase(), "col[2]{1}$", 0) != null
                        || obj.toString().toUpperCase().contains("USER_CODE")) // if (obj.toString().toLowerCase().contains("col2"))
                {
                    USER_CODE = jsonObject.get(obj).toString();
                    defultValue.put("USER_CODE", "'" + USER_CODE + "'");
                }

                if (!obj.toString().contains("imageTime") && !obj.toString().contains("video")
                        && !obj.toString().contains("file") && !obj.toString().contains("fileName")
                        && !obj.toString().contains("desc") && !obj.toString().contains("sysFileName")) {
                    try {
                        if (obj.toString().equals(replicateColumn)) {
                            replicateColumnValue = jsonObject.get(obj).toString();
                        }

                        if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                            if (columnStatus.get(obj).equalsIgnoreCase("D")) {
                            } else {
                                colName.append(obj.toString() + ",");
                            }
                        }

                        String columnValue = "";
                        try {
                            columnValue = jsonObject.get(obj).toString();
                        } catch (Exception e) {
                            if (f.isNumber(obj.toString())) {
                                columnValue = null;
                            } else {
                                columnValue = "";
                            }
                        }
                        if (obj.toString().contains("LASTUPDATE")) {
                            defultValue.put(obj.toString(), sysdate);
                        }

                        String VRDATEFORMAT_SQL = "SELECT V.VRDATEFORMAT, V.CHQDATE, V.APPROVEDDATE_FORMAT, V.CREATEDDATE_FORMAT, "
                                + " V.DUEDATE_FORMAT FROM VIEW_DEFAULT_USER_LINKS V";
                        String VRDATEFORMAT = "";
                        String CHQDATEFORMAT = "";
                        String APPROVEDDATE_FORMAT = "";
                        String CREATEDDATE_FORMAT = "";
                        String DUEDATE_FORMAT = "";
                        try {
                            ps = connection.prepareStatement(VRDATEFORMAT_SQL);
                            rs = ps.executeQuery();
                            if (rs != null && rs.next()) {
                                do {
                                    VRDATEFORMAT = rs.getString(1);
                                    CHQDATEFORMAT = rs.getString(2);
                                    APPROVEDDATE_FORMAT = rs.getString(3);
                                    CREATEDDATE_FORMAT = rs.getString(4);
                                    DUEDATE_FORMAT = rs.getString(5);
                                } while (rs.next());
                            }
                        } catch (Exception e) {
                            System.out.println("exeception ---> " + e.getMessage());
                        } finally {
                            if (ps != null) {
                                try {
                                    ps.close();
                                    rs.close();
                                } catch (Exception e) {
                                }
                            }
                        }

                        if (obj.toString().contains("APPROVEDDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + APPROVEDDATE_FORMAT + "')";
                        }
                        if (obj.toString().contains("VRDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                        }
                        if (obj.toString().contains("CHQDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + CHQDATEFORMAT + "')";
                        }

                        if (obj.toString().contains("CREATEDDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + CREATEDDATE_FORMAT + "')";
                        }
                        if (obj.toString().contains("DUEDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + DUEDATE_FORMAT + "')";
                        }
                        if (obj.toString().contains("START_DATE")) {
                            columnValue = "to_date('" + columnValue + "','" + DUEDATE_FORMAT + "')";
                        }
                        if (obj.toString().contains("LASTUPDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + DUEDATE_FORMAT + "')";
                        }
                        if (obj.toString().contains("LAST_UPDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + DUEDATE_FORMAT + "')";
                        }
                        if (obj.toString().contains("FROM_DATE")) {
                            columnValue = "to_date('" + columnValue + "','" + DUEDATE_FORMAT + "')";
                        }
                        if (obj.toString().contains("TO_DATE")) {
                            columnValue = "to_date('" + columnValue + "','" + DUEDATE_FORMAT + "')";
                        }
                        if (obj.toString().contains("TASK_DATE")) {
                            columnValue = "to_date('" + columnValue + "','" + DUEDATE_FORMAT + "')";
                        }
                        if (obj.toString().contains("REVIEWDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + DUEDATE_FORMAT + "')";
                        }

                        if (obj.toString().contains("TASK_SEQ_NO")) {
                            String taskSeqNoSql = "SELECT MAX(TASK_SEQ_NO) + 1 FROM TASK_TRAN";
                            int maxSeqNo = 0;
                            try {
                                PreparedStatement ps1 = connection.prepareStatement(taskSeqNoSql);
                                ResultSet rs1 = ps1.executeQuery();
                                if (rs1.next()) {
                                    maxSeqNo = rs1.getInt(1);
                                }
                            } catch (Exception e) {
                                System.out.println("exeception ---> " + e.getMessage());
                            }
                            columnValue = String.valueOf(maxSeqNo);
                        }

                        if (obj.toString().contains("TASK_CODE") && columnValue.isEmpty()) {
                            String taskCodeSql = "Select lhs_CRM.get_generate_code_TBL('CF', '', 'TASK_MAST', 'TASK_CODE', '') from dual t";
                            String taskCode = "";
                            try {
                                PreparedStatement ps1 = connection.prepareStatement(taskCodeSql);
                                ResultSet rs1 = ps1.executeQuery();
                                if (rs1.next()) {
                                    taskCode = rs1.getString(1);
                                }
                            } catch (Exception e) {
                                System.out.println("exeception ---> " + e.getMessage());
                            }
                            columnValue = taskCode;
                        }

                        if (obj.toString().equals("VRNO") && columnValue.isEmpty()) {

                            if (SS_TRAN_VRNO != null && !SS_TRAN_VRNO.isEmpty()) {
                                columnValue = SS_TRAN_VRNO;
                                System.out.println("columnValue = SS_TRAN_VRNO----> " + columnValue);
                            } else {
                                String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE \n"
                                        + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )\n"
                                        + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
                                System.out.println("getAccYearSQL : " + getAccYearSQL);
                                String currentAccYear = "";

                                String prodVRNO_SQL = getReplacedprodVRNO_SQL(jsonObject);
                                System.out.println("ReplacedprodVRNO_SQL : " + prodVRNO_SQL);

                                try {
                                    ps = connection.prepareStatement(getAccYearSQL);
                                    rs = ps.executeQuery();
                                    if (rs != null && rs.next()) {
                                        currentAccYear = rs.getString(1);
                                        System.out.println("currentAccYear : " + currentAccYear);
                                        if (!currentAccYear.isEmpty()) {
                                            prodVRNO_SQL = prodVRNO_SQL.replaceAll("ACC_YEAR", currentAccYear);
                                        } else {
                                            System.out.println("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                                        }
                                    } else {
                                        System.out.println("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                                    }
                                } catch (Exception e) {
                                } finally {
                                    if (ps != null) {
                                        try {
                                            ps.close();
                                            rs.close();
                                        } catch (Exception e) {
                                        }
                                    }
                                }
                                String prodVRNO_SQLArr[] = prodVRNO_SQL.split("~");
                                String getProdVRNO_SQL = prodVRNO_SQLArr[0];
                                String appendProdVRNO_SQL = prodVRNO_SQLArr[1];
                                System.out.println("getProdVRNO_SQL : " + getProdVRNO_SQL);
                                System.out.println("appendProdVRNO_SQL : " + appendProdVRNO_SQL);
                                try {
                                    ps = connection.prepareStatement(getProdVRNO_SQL);
                                    rs = ps.executeQuery();
                                    if (rs != null && rs.next()) {
                                        generatedProdVRNO = rs.getString(1);
                                        System.out.println("generatedProdVRNO : " + generatedProdVRNO);
                                        columnValue = generatedProdVRNO;
                                        if (!generatedProdVRNO.isEmpty()) {
                                            appendProdVRNO_SQL = appendProdVRNO_SQL.replaceAll("GEN_VRNO", generatedProdVRNO);
                                            System.out.println("appendProdVRNO_SQL with VRNO: " + appendProdVRNO_SQL);
                                            try {
                                                ps = connection.prepareStatement(appendProdVRNO_SQL);
                                                ps.executeUpdate();
                                            } catch (SQLException e) {
                                                System.out.println("appendProdVRNO_SQL NOT EXECUTED PROPERLY : " + appendProdVRNO_SQL);
                                                System.out.println("exeception ---> " + e.getMessage());
                                            }
                                        } else {
                                            System.out.println("getProdVRNO_SQL NOT EXECUTED PROPERLY : " + getProdVRNO_SQL);
                                        }
                                    } else {
                                        System.out.println("getProdVRNO_SQL NOT EXECUTED PROPERLY : " + getProdVRNO_SQL);
                                    }
                                } catch (Exception e) {
                                    generatedProdVRNO = e.getMessage();
                                    String prodVRNO_SQLArrr[] = generatedProdVRNO.split("ORA-20000:");
                                    generatedProdVRNO = prodVRNO_SQLArrr[1].trim();
                                    String prodVRNO_SQLArrrr[] = generatedProdVRNO.split("ORA-06512:");
                                    generatedProdVRNO = prodVRNO_SQLArrrr[0].trim();
                                    System.out.println("generatedProdVRNO : " + generatedProdVRNO);
                                    columnValue = generatedProdVRNO;
                                    if (!generatedProdVRNO.isEmpty()) {
                                        appendProdVRNO_SQL = appendProdVRNO_SQL.replaceAll("GEN_VRNO", generatedProdVRNO);
                                        System.out.println("appendProdVRNO_SQL with VRNO: " + appendProdVRNO_SQL);
                                        try {
                                            ps = connection.prepareStatement(appendProdVRNO_SQL);
                                            ps.executeUpdate();
                                        } catch (Exception ee) {
                                            System.out.println("appendProdVRNO_SQL NOT EXECUTED PROPERLY : " + appendProdVRNO_SQL);
                                        }
                                    } else {
                                        System.out.println("getProdVRNO_SQL NOT EXECUTED PROPERLY : " + getProdVRNO_SQL);
                                    }
                                } finally {
                                    if (ps != null) {
                                        try {
                                            ps.close();
                                            rs.close();
                                        } catch (Exception e) {
                                        }
                                    }
                                }
                            }
                        }
                        if (f.isNumber(obj.toString())) {
                            if (obj.toString().contains("SEQ_ID")) {
                                columnValue = String.valueOf(seq_id);
                            }
                            if (f.isImg(obj.toString())) {
                                columnValue = seq_id + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                            }
                            if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                                if (columnStatus.get(obj).equalsIgnoreCase("D")) {
                                } else {
                                    colValue.append(columnValue).append(",");
                                }
                            }
                        } else {
                            if (f.isImg(obj.toString())) {
                                columnValue = seq_id + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                                imgfileID.put(obj.toString(), columnValue);
                            }
                            if (f.isVideo(obj.toString())) {
                                columnValue = seq_id + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                                videofileId.put(obj.toString(), columnValue);
                            }
                            if (f.isSysDate(obj.toString())) {
                                columnValue = sysdate;
                            }
                            if (columnValue.toString().contains("to_date")) {
                                if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                                    if (columnStatus.get(obj).equalsIgnoreCase("D")) {
                                    } else {
                                        colValue.append(columnValue + ", ");
                                    }
                                }
                            } else if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                                if (columnStatus.get(obj).equalsIgnoreCase("D")) {
                                } else {
                                    colValue.append("'" + columnValue + "',");
                                }
                            }
                        }
                    } catch (Exception ex) {
                    }
                } else {
                    imgJSON.put(obj.toString(), jsonObject.get(obj));
                }
            }
        }
    }

    public String insertDocument(String fileName, String userCode, String discribtion,
            String systemFileName, InputStream fin, float fileId) throws Exception {
        String status = "";
        if (fin == null) {
        }
        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            sqlDocumentInsert = "insert into LHSSYS_portal_upload_file (FILE_ID,FILE_NAME,"
                    //                    + "UPLOADATE_DATE,LAST_UPDATED,DESCRIBTION,USER_CODE,FLAG,SYSTEM_FILE_NAME,STORE_FILE) "
                    + "UPLOADATE_DATE,LAST_UPDATED,DESCRIBTION,USER_CODE,FLAG,SYSTEM_FILE_NAME,STORE_FILE) "
                    + "values (?,?,sysdate,sysdate,?,?,'h',?,?)";

            System.out.println("fileID : " + fileId + "\n   IMAGE INSERT SQL : " + sqlDocumentInsert);
            System.out.println("IMAGE DATA : " + fin.toString());
            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setFloat(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());

            boolean i = false;
            i = pst.execute();
            if (i) {
                status = "add entry";
            } else {
                status = "IMAGE NOT INSERTED";
            }
            System.out.println("IMAGE INSERT STATUS : " + status);
        } catch (Exception e) {
            System.out.println("exeception ---> " + e.getMessage());
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }
        return status;
    }

    public int insertVideo(String fileName, String userCode, String discribtion,
            String systemFileName, InputStream fin, float fileId) throws Exception {
        String status = "";
        int i = 0;
        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            sqlDocumentInsert = "insert into LHSSYS_portal_upload_file (FILE_ID,FILE_NAME,UPLOADATE_DATE,"
                    + "LAST_UPDATED,DESCRIBTION,USER_CODE,FLAG,SYSTEM_FILE_NAME,store_file) "
                    + "values (?,?,sysdate,sysdate,?,?,'h',?,?)";

            System.out.println("fileID : " + fileId + "\n      compile qry == " + sqlDocumentInsert);

            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setFloat(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());
            i = pst.executeUpdate();
            if (i > 0) {
                status = "add entry";
            } else {
                status = "VIDEO NOT INSERTED";
            }
            System.out.println("VIDEO INSERT STATUS : " + status);
        } catch (Exception e) {
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }
        return i;
    }

    public int nextSeqID(String tableName) throws Exception {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int listCount = 0;
        try {
            String selectQry = "select portal_app_tran_seq.nextval from dual";
            U.log("Get SEQ_ID query :  " + selectQry);
            pst = connection.prepareStatement(selectQry);
            rs = pst.executeQuery();
            while (rs.next()) {
                listCount = rs.getInt(1);
            }
        } catch (SQLException ex) {
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                    rs.close();
                } catch (Exception e) {
                }
            }
        }
        U.log("OBTAINED SEQ_ID :  " + listCount);
        return listCount;
    }

    public int getDocumentListCount(String tableName) throws Exception {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int listCount = 0;
        try {
            String selectQry = "select max(ROWNUM) from " + tableName;
            U.log("GET SEQ_ID Query : " + selectQry);
            pst = connection.prepareStatement(selectQry);
            rs = pst.executeQuery();
            while (rs.next()) {
                listCount = rs.getInt(1);
            }
        } catch (SQLException ex) {
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                    rs.close();
                } catch (Exception e) {
                }
            }
        }
        U.log("OBTAINED SEQ_ID  :  " + listCount);
        return listCount;
    }

    public void setDatatype(String col1) throws SQLException {
        String sql = " select * from LHSSYS_PORTAL_DATA_DSC_UPDATE\n"
                + "where seq_no=" + col1 + "order by slno";
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                do {
                    table_name = rs.getString("TABLE_NAME");
                    f.addInmap(rs.getString("column_name"), rs.getString("column_type"));
                    f.addInmap(rs.getString("column_name"), rs.getString("column_default_value"));
                    f.addInmap(rs.getString("column_name"), rs.getString("Item_help_property"));
                    f.addInmap(rs.getString("column_name"), rs.getString("column_desc"));
                } while (rs.next());
            }
        } catch (Exception e) {
        } finally {
            rs.close();
            ps.close();
        }
        ListMultimap<String, String> map = f.map;
        List<String> list = map.get("COL6");
    }

    public InputStream writeOnImage(String image, String imgdate) {
        InputStream iss = null;
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
            Date date = formatter.parse(imgdate);
            String base64Img = image;//.split(",")[1];
            byte[] imageByts = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
            iss = new ByteArrayInputStream(imageByts);
            BufferedImage bi = ImageIO.read(iss);
            Graphics2D graphics = bi.createGraphics();
            Font font = new Font("ARIAL", Font.PLAIN, 20);
            graphics.setFont(font);
            graphics.drawString(formatter.format(date), 25, 25);
            bi.flush();
            byte[] imageInByte;
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bi, "jpg", baos);
            baos.flush();
            imageInByte = baos.toByteArray();
            baos.close();
            iss = new ByteArrayInputStream(imageInByte);
        } catch (Exception e) {
        }
        return iss;
    }

    public void writeFile(InputStream is, JSONObject obj) {
        String fileName = obj.get("sysFileName").toString();
        BufferedImage image = null;
        try {
            image = ImageIO.read(is);
            File file = new File(fileName);
            file.getParentFile().mkdirs();
            ImageIO.write(image, "jpg", file);

            String columnName = obj.get("fileId").toString();
            String jarLocation = "";
            String query = " SELECT T.tool_tip\n"
                    + " FROM LHSSYS_PORTAL_DATA_DSC_UPDATE T\n"
                    + " WHERE T.SEQ_NO = " + seq_no + "\n"
                    + " and T.Column_Name = '" + columnName + "'\n"
                    + " ORDER BY T.SEQ_NO, T.SLNO ";
            PreparedStatement ps = null;
            ResultSet rs = null;
            try {
                ps = connection.prepareStatement(query);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        jarLocation = rs.getString("tool_tip");
                    } while (rs.next());
                }
            } catch (Exception e) {
            } finally {
                rs.close();
                ps.close();
            }
            System.out.println("jarLocation == " + jarLocation);
            if (jarLocation != null && !jarLocation.equalsIgnoreCase("")) {
                String[] para = jarLocation.split(",");
                try {
                    ProcessBuilder pb = new ProcessBuilder("java", "-jar", para[0],
                            para[1], para[2], para[3], para[4]);
                    Process p = pb.start();
                    LogStreamReader lsr = new LogStreamReader(p.getInputStream());
                    Thread thread = new Thread(lsr, "LogStreamReader");
                    thread.start();
                } catch (Exception e) {
                }
            } else {
                System.out.println("Jar Location is not available.");
            }
        } catch (Exception e) {
        }
    }

    private JSONObject checkStartAndEndDate(JSONObject jsonObject) {

        Set<Object> set = jsonObject.keySet();
        String monthVal = "";
        String yearVal = "";

        Iterator<Object> iterator = set.iterator();
        try {
            while (iterator.hasNext()) {
                Object key = iterator.next();
                if (key.toString().equalsIgnoreCase("MONTH")) {
                    monthVal = jsonObject.get(key).toString();
                }
                if (key.toString().equalsIgnoreCase("YEAR")) {
                    yearVal = jsonObject.get(key).toString();
                }
            }
            String fromDate = "";
            String toDate = "";
            if (monthVal != null && !monthVal.isEmpty() && yearVal != null && !yearVal.isEmpty()) {

                Calendar calendar = Calendar.getInstance();
                int month = calendar.get(Calendar.MONTH) + 1;
                int year = calendar.get(Calendar.YEAR);
                String monthString = new DateFormatSymbols().getMonths()[month - 1];

                DateFormat formatter = new SimpleDateFormat("dd/MMM/yyyy");

                if (monthString.equalsIgnoreCase(monthVal.trim()) && yearVal.equalsIgnoreCase(Integer.toString(year))) {
                    System.out.println("current month and current year");
                    Calendar c = calendar;

                    int numOfDaysInMonth = c.getActualMaximum(Calendar.DAY_OF_MONTH);
                    System.out.println("First Day of month: " + c.getTime());
                    fromDate = formatter.format(c.getTime());
                    int day = 1;
                    c.set(year, month, day);
                    c.add(Calendar.DAY_OF_MONTH, numOfDaysInMonth - 1);
                    System.out.println("Last Day of month: " + c.getTime());
                    toDate = formatter.format(c.getTime());

                } else {
                    System.out.println("   nOt current month and current year");
                    Calendar c = Calendar.getInstance();

                    int day = 1;
                    Date date = new SimpleDateFormat("MMMM").parse(monthVal);
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(date);
                    c.set(Integer.parseInt(yearVal), cal.get(Calendar.MONTH), day);
                    int numOfDaysInMonth = c.getActualMaximum(Calendar.DAY_OF_MONTH);
                    System.out.println("First Day of month: " + c.getTime());
                    fromDate = formatter.format(c.getTime());
                    c.add(Calendar.DAY_OF_MONTH, numOfDaysInMonth - 1);
                    System.out.println("Last Day of month: " + c.getTime());
                    toDate = formatter.format(c.getTime());
                }
                System.out.println("Form Date -------> " + fromDate);
                System.out.println("to Date ---------> " + toDate);

                jsonObject.put("FROM_DATE", fromDate);
                jsonObject.put("TO_DATE", toDate);
            }

        } catch (Exception e) {
            System.out.println("exeception ---> " + e.getMessage());
        }
        return jsonObject;
    }

    public void getColumnStatus(String seq_No) {
        String sql = "select column_name, status from lhssys_portal_data_dsc_update where seq_no = " + seq_no;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    columnStatus.put(rs.getString("column_name"), rs.getString("status"));
                } while (rs.next());
            }
        } catch (Exception e) {
        }
    }
}
