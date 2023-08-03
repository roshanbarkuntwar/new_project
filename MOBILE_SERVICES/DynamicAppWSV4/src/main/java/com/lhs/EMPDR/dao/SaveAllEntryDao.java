
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.google.common.collect.ListMultimap;
import com.lhs.EMPDR.JSONResult.FileUploadStatus;
import com.lhs.EMPDR.entity.FileClass;
import com.lhs.EMPDR.utility.GenerateNotification;
import com.lhs.EMPDR.utility.LogStreamReader;
import com.lhs.EMPDR.utility.SendEmail;
import com.lhs.EMPDR.utility.SqlUtil;
import com.lhs.EMPDR.utility.U;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 *
 * @author ranjeet.kumar
 */
public class SaveAllEntryDao {

    String flag = null;
    String base64Image;
    byte[] imageBytes;
    InputStream is;
    String table_name;
    String SS_TRAN_VRNO;
    Connection connection;
    String generatedProdVRNO = "";
    StringBuffer colName = new StringBuffer();
    StringBuffer colValue = new StringBuffer();
    int seq_id = 0;
    JSONObject imgJSON = new JSONObject();
    FileClass f = new FileClass();
    String string_vrno = null;
    HashMap<String, String> nondisplayColList = new HashMap<String, String>();
    HashMap<String, String> imgfileID = new HashMap<String, String>();
    HashMap<String, String> videofileId = new HashMap<String, String>();
    HashMap<String, String> defultValue = new HashMap<String, String>();
    HashMap<String, String> columnStatus = new HashMap<String, String>();

    HashMap<String, String> columnTableName = new HashMap<String, String>();

    HashMap<String, String> columnType = new HashMap<String, String>();

    String USER_CODE;
//    LoggerWrite log = new LoggerWrite();
    HashMap<String, String> displayColList = new HashMap<String, String>();
    String seq_no;
    String itemCode;
    String entityCode = null;
    String acc_year = null;
    String first_screen = null;
    PreparedStatement ps = null;
    ResultSet rs;
    String saveProcessFlag = "";
    int setdata = 0;
    String sysdate = "";
    String vrno = "";
    String isAddonTempEntry = null;
    String headSeqId = null;
    String series;
    String saveFlag = "";
    boolean isNotificationSend = false;
    boolean isSendMail = false;

    public SaveAllEntryDao(Connection connection) {
        this.connection = connection;
        U u = new U(this.connection);
    }

    public FileUploadStatus saveAllEntry(String jsonString, String flag, String isAddonTempEntry, String headSeqId) throws ParseException, Exception {
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        PreparedStatement ps9 = null;
        ResultSet rs9 = null;
        this.isAddonTempEntry = isAddonTempEntry;
        this.headSeqId = headSeqId;
        System.out.println("JSON STRING: " + jsonString);
        JSONArray jsonArray = new JSONArray();
        JSONArray listJsonArray = new JSONArray();
        JSONParser json_parser = new JSONParser();

        try {
            JSONObject listjson = (JSONObject) json_parser.parse(jsonString);
            listJsonArray = (JSONArray) listjson.get("list");
            int listArrLength = listJsonArray.size();
            U.log("listArrLength" + listArrLength);
            for (int j = 0; j < listArrLength; j++) {
                colName = new StringBuffer();
                colValue = new StringBuffer();
                JSONObject json = (JSONObject) json_parser.parse(listJsonArray.get(j).toString());
                jsonArray = (JSONArray) json.get("recordsInfo");

                for (int i = 0; i < 1; i++) {
                    JSONObject obj1 = (JSONObject) jsonArray.get(i);
                    seq_no = obj1.get("DYNAMIC_TABLE_SEQ_ID") + "";
//                    System.out.println("SAVE FLAG==" + obj1.get("SAVE_FLAG")!=null.toString());
                    saveFlag = (obj1.get("SAVE_FLAG") != null ? obj1.get("SAVE_FLAG").toString() : "");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            String sql9 = "SELECT DATA_SAVE_PROCESS_FLAG FROM LHSSYS_PORTAL_TABLE_DSC_UPDATE WHERE SEQ_NO= " + seq_no;
            U.log("SQL 9 = " + sql9);
            ps9 = connection.prepareStatement(sql9);
            rs9 = ps9.executeQuery();
            if (rs9.next() && rs9 != null) {
                saveProcessFlag = rs9.getString(1);
            }
            U.log("SAVE PROCESS FLAG =" + saveProcessFlag);
            if (saveProcessFlag.equalsIgnoreCase("P")) {
                U.log("P=======ALL=============P");
                fileUploadStatus = saveDataByProcedure(jsonString);
            } else if (saveProcessFlag.equalsIgnoreCase("T")) {
                U.log("T==========ALL========= T");
                fileUploadStatus = addEntry(jsonString, flag);
            } else if (saveProcessFlag.equalsIgnoreCase("B")) {
                U.log("B=============ALL========= B");
                fileUploadStatus = addEntry(jsonString, flag);
                fileUploadStatus = saveDataByProcedure(jsonString);
//                fileUploadStatus = approveByProcedure(jsonString);
            }
            if (!saveFlag.isEmpty() && saveFlag != null && !"".equals(saveFlag)) {
                if (saveFlag.equalsIgnoreCase("A")) {
                    fileUploadStatus = approveByProcedure(jsonString);
                }
            }
            if (fileUploadStatus.getStatus().equalsIgnoreCase("insert data")) {
                try {
                    JSONObject listjson = (JSONObject) json_parser.parse(jsonString);
                    listJsonArray = (JSONArray) listjson.get("list");
                    JSONObject json = (JSONObject) json_parser.parse(listJsonArray.get(0).toString());
                    jsonArray = (JSONArray) json.get("recordsInfo");
                    JSONObject obj1 = (JSONObject) jsonArray.get(0);
                    if (obj1.containsKey("PUSH_NOTIFICATION")) {
                        isNotificationSend = true;
                    }

                    if (isNotificationSend) {
                        GenerateNotification notifObj = new GenerateNotification(connection);
                        if(seq_no.contains(".")){
                         String splitVal = seq_no.split(".")[1];
                         seq_no = seq_no + splitVal.replace(splitVal, ".2");
                        }else{
                            seq_no = seq_no + ".2";
                        }
                        notifObj.sendNotification(json, seq_no, generatedProdVRNO);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return fileUploadStatus;
    }

    public void getDetailOfColumns() {
        StringBuilder sql = new StringBuilder();

        sql.append("select u.*,t.first_screen,t.entity_code_str,y.acc_year from lhssys_portal_data_dsc_update u,LHSSYS_PORTAL_TABLE_DSC_UPDATE t,acc_year_mast y where ");
        sql.append("u.seq_no=").append(seq_no).append(" and t.seq_no=").append(seq_no).append(" and  sysdate between y.yrbegdate and y.yrenddate and y.entity_code=t.entity_code_str order by slno");
        U.log("MultipleAddEntry SQL : " + sql.toString());
        try {
            ps = connection.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    table_name = rs.getString("table_name");
                    columnType.put(rs.getString("column_name"), rs.getString("column_type"));
                    columnTableName.put(rs.getString("column_name"), rs.getString("table_name"));
                    if (isAddonTempEntry != null) {
                        table_name = isAddonTempEntry;
                    }
                    entityCode = rs.getString("entity_code_str");
                    acc_year = rs.getString("acc_year");
                    if (rs.getString("status") != null && !rs.getString("status").contains("F")) {
                        displayColList.put(rs.getString("column_name"), rs.getString("column_default_value"));
                    } else {
                        String defaultVal = rs.getString("column_default_value");
                        if (defaultVal == null && rs.getString("column_name").equals("SEQ_ID")) {
                            seq_id = (getDocumentListCount(table_name) + 1);
                            defaultVal = seq_id + "";
                        }
                        nondisplayColList.put(rs.getString("column_name"), defaultVal);
                        System.out.println("nondisplayColList ---> " + nondisplayColList.toString());
                    }
                    columnStatus.put(rs.getString("column_name"), rs.getString("status"));
                } while (rs.next());
            }
        } catch (Exception e) {
            U.errorLog(e);
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

    // This Method is used for save Entry With Table Name and Column Names
    public FileUploadStatus addEntry(String jsonString, String flag) throws ParseException, Exception {
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        this.flag = flag;
        PreparedStatement ps1 = null;
        ResultSet rs1 = null;

        U.log("AddEntry JSON :" + jsonString);
        try {
            ps1 = connection.prepareStatement("select TO_CHAR(SYSDATE, 'DD-MM-YYYY  HH24:MI:SS') as systemdate from dual");
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                sysdate = rs1.getString(1);
            }
        } catch (Exception e) {
        } finally {
            ps1.close();
            rs1.close();
        }

        JSONArray jsonArray = new JSONArray();
        JSONArray listJsonArray = new JSONArray();
        JSONParser json_parser = new JSONParser();
        JSONObject listjson = (JSONObject) json_parser.parse(jsonString);
        listJsonArray = (JSONArray) listjson.get("list");
        int listArrLength = listJsonArray.size();

        for (int j = 0; j < listArrLength; j++) {
            colName = new StringBuffer();
            colValue = new StringBuffer();
            JSONObject json = (JSONObject) json_parser.parse(listJsonArray.get(j).toString());
            jsonArray = (JSONArray) json.get("recordsInfo");
            for (int i = 0; i < 1; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);
                seq_no = obj1.get("DYNAMIC_TABLE_SEQ_ID") + "";
            }
        }

        getDetailOfColumns();

        String getSS_TRAN_VRNO_SQL = "SELECT U.PRE_DATA_SAVE_EVENT FROM LHSSYS_PORTAL_TABLE_DSC_UPDATE U WHERE U.SEQ_NO = '" + seq_no + "'";
        String PRE_DATA_SAVE_EVENT = "";
        U.log("getSS_TRAN_VRNO_SQL : " + getSS_TRAN_VRNO_SQL);
        try {
            ps1 = connection.prepareStatement(getSS_TRAN_VRNO_SQL);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                PRE_DATA_SAVE_EVENT = rs1.getString(1);
                U.log("PRE_DATA_SAVE_EVENT : " + PRE_DATA_SAVE_EVENT);

                if (PRE_DATA_SAVE_EVENT != null) {

                    if (PRE_DATA_SAVE_EVENT.contains("'ACC_CODE'")) {
                        PRE_DATA_SAVE_EVENT = PRE_DATA_SAVE_EVENT.replaceAll("'ACC_CODE'", "'" + acc_year + "'");
                    }

                    JSONArray listJsonArray1 = new JSONArray();
//                    U.log("jsonString : " + jsonString);
                    JSONParser json_parser1 = new JSONParser();

                    JSONObject listjson1 = (JSONObject) json_parser1.parse(jsonString);
                    listJsonArray1 = (JSONArray) listjson1.get("list");
                    int listArrLength1 = listJsonArray1.size();
                    for (int j = 0; j < listArrLength1; j++) {
                        colName = new StringBuffer();
                        colValue = new StringBuffer();
                        JSONObject json = (JSONObject) json_parser.parse(listJsonArray1.get(j).toString());
                        jsonArray = (JSONArray) json.get("recordsInfo");
                        for (int i = 0; i < 1; i++) {
                            JSONObject jSONObject = (JSONObject) jsonArray.get(i);
                            for (int k = 0; k < jSONObject.size(); k++) {
                                Set<Map.Entry<String, Object>> entrySet = jSONObject.entrySet();
                                for (Map.Entry<String, Object> map : entrySet) {
                                    if (map.getKey().equals("DYNAMIC_TABLE_SEQ_ID")) {
                                        PRE_DATA_SAVE_EVENT = PRE_DATA_SAVE_EVENT.replaceAll("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()) + "'");
                                    } else {
                                        PRE_DATA_SAVE_EVENT = PRE_DATA_SAVE_EVENT.replaceAll("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()).toUpperCase() + "'");

                                    }
                                }
                            }
                        }
                    }
                    U.log("PRE_DATA_SAVE_EVENT AFTER REPLACING : " + PRE_DATA_SAVE_EVENT);

                    String prodVRNO_SQLArr[] = PRE_DATA_SAVE_EVENT.split("~");
                    String getProdVRNO_SQL = prodVRNO_SQLArr[0];
                    String appendProdVRNO_SQL = prodVRNO_SQLArr[1];
                    U.log("getProdVRNO_SQL : " + getProdVRNO_SQL);
                    U.log("appendProdVRNO_SQL : " + appendProdVRNO_SQL);

                    try {
                        ps = connection.prepareStatement(getProdVRNO_SQL);
                        rs1 = ps.executeQuery();
                        if (rs1 != null && rs1.next()) {
                            generatedProdVRNO = rs1.getString(1);
                            U.log("generatedProdVRNO : " + generatedProdVRNO);
                        }
                    } catch (Exception e) {
                        U.log(e.getMessage());
                        SS_TRAN_VRNO = e.getMessage();
                        String ValidatedMsgArr[] = SS_TRAN_VRNO.split(":");
                        SS_TRAN_VRNO = ValidatedMsgArr[1].trim();
                        String ValidatedMsgArr1[] = SS_TRAN_VRNO.split("ORA-");
                        SS_TRAN_VRNO = ValidatedMsgArr1[0].trim();
                        U.log("SS_TRAN_VRNO : " + SS_TRAN_VRNO);
                        if (!SS_TRAN_VRNO.isEmpty()) {
                            appendProdVRNO_SQL = appendProdVRNO_SQL.replaceAll("GEN_VRNO", SS_TRAN_VRNO);
                            U.log("appendProdVRNO_SQL with VRNO: " + appendProdVRNO_SQL);
                            try {
                                ps1 = connection.prepareStatement(appendProdVRNO_SQL);
                                ps1.executeUpdate();
                            } catch (SQLException p) {
                                U.errorLog("appendProdVRNO_SQL NOT EXECUTED PROPERLY : " + appendProdVRNO_SQL);
                            }
                        } else {
                            U.log("getProdVRNO_SQL NOT EXECUTED PROPERLY : " + getProdVRNO_SQL);
                        }

                    } finally {
                        ps.close();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            ps1.close();
            rs1.close();
        }
        System.out.println("RECORD INFO......");
        for (int j = 0; j < listArrLength; j++) {
            colName = new StringBuffer();
            colValue = new StringBuffer();
            StringBuilder stringBuffer = new StringBuilder();
            JSONObject json = (JSONObject) json_parser.parse(listJsonArray.get(j).toString());
            jsonArray = (JSONArray) json.get("recordsInfo");
            int jsonArrLength = jsonArray.size();
            for (int i = 0; i < 1; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);
                seq_no = obj1.get("DYNAMIC_TABLE_SEQ_ID") + "";
                String genSlno = null;
                for (Map.Entry m : displayColList.entrySet()) {
//                    U.log("Map Values :" + m.getValue());
//                    if (m.getKey().equals("SLNO")) {
//                        if (m.getValue() != null) {
//                            try {
//                                String query = "select " + m.getValue() + " from dual";
//                                ps1 = connection.prepareStatement(query);
//                                rs1 = ps1.executeQuery();
//                                if (rs1 != null && rs1.next()) {
//                                    genSlno = rs1.getString(1);
//                                }
//                            } catch (Exception e) {
//                            } finally {
//                                ps1.close();
//                                rs1.close();
//                            }
//                        }
//                    }
                }
//                if (genSlno != null) {
//                    if (genSlno != null || genSlno.length() > 0) {
//                        obj1.replace("SLNO", genSlno);
//                    }
//                }
            }
            if (table_name.contains("~")) {
                table_name = table_name.split("~")[0];
            }
            seq_id = (getDocumentListCount(table_name) + 1);
            if (isAddonTempEntry != null) {
                seq_id = Integer.parseInt(headSeqId);
            }
            U.log("seq_idiii" + seq_id);
            Object obj = json_parser.parse(json.toString());
            JSONObject json_obj = new JSONObject();
            json_obj = (JSONObject) obj;
            parseJson(json_obj);

            //append nonn display column
            System.out.println("nondisplayColList-------1    ---- " + nondisplayColList.toString());
            for (Map.Entry m : nondisplayColList.entrySet()) {
//                U.log("Map Values :" + m.getValue());
                U.log("Map Key :" + m.getKey());
                if (m.getValue() != null) {
                    String predefinedVal = defultValue.get(m.getKey());
                    if (predefinedVal == null) {
                        System.out.println("predefined val------>" + predefinedVal);
                        predefinedVal = "'" + m.getValue().toString() + "'";
                    }
                    if (m.getKey().toString().contains("LASTUPDATE")) {
                        predefinedVal = "to_date('" + sysdate + "','dd-MM-yyyy HH24:MI:SS')";
                    }
                    colName.append(m.getKey()).append(",");
                    colValue.append(predefinedVal).append(",");
                }
            }
            System.out.println("colName----> " + colName);
            if (isAddonTempEntry != null) {
                colName.append("seq_id,");
                colValue.append(seq_id + ",");
            }

            String columnNmae = colName.toString().substring(0, colName.toString().lastIndexOf(","));
            if (isAddonTempEntry != null) {
                table_name = isAddonTempEntry;
            }
            System.out.println("columnName---> " + columnNmae);
            columnNmae = columnNmae.replace("dispatch_item", "item_code");
            String columnValue = colValue.toString().substring(0, colValue.toString().lastIndexOf(","));
            stringBuffer.append("Insert into ").append(table_name).append("\n(").append(columnNmae).append(") values(").append(columnValue).append(")");
            U.log("Multiple Add Entry SQL : " + stringBuffer.toString());
            try {
                ps1 = connection.prepareStatement(stringBuffer.toString());
                ps1.execute();
                String result = "insert data";
//                 if (isNotificationSend) {
//                    sendNotification(json_obj, seq_no);
//                }
                U.log("Multiple Add Entry result : " + result);
                fileUploadStatus.setStatus(result);
                U.log("Multiple Add Entry generatedProdVRNO : " + generatedProdVRNO);
                fileUploadStatus.setVRNO(generatedProdVRNO);
            } catch (SQLException e) {
                fileUploadStatus.setStatus("Something went wrong, please try again...");
            }

//            {
//                for (int i = 1; i < jsonArrLength; i++) {
//                    JSONObject obj1 = (JSONObject) jsonArray.get(i);
//                    if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
//                        is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
//                        insertDocument(obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
//                                obj1.get("sysFileName").toString(), is,
//                                Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())));
//                    }
//                    if (obj1.get("videofile") != null && obj1.get("videofile").toString().length() > 3) {
//                        base64Image = obj1.get("videofile").toString().split(",")[1];
//                        imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
//                        is = new ByteArrayInputStream(imageBytes);
//                        insertVideo(obj1.get("videoFileName").toString(),
//                                USER_CODE, obj1.get("videoDesc").toString(),
//                                obj1.get("sysFileName").toString(),
//                                is, Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
//                    }
//                }
//            }
            {
                try {
                    for (int i = 1; i < jsonArrLength; i++) {
//                    JSONObject obj1 = (JSONObject) jsonArray.get(i);
                        JSONObject obj1 = (JSONObject) jsonArray.get(i);
                        String imgColumnTableName = columnTableName.get(obj1.get("fileId"));
                        System.out.println("COLUMN TABLE NAME  :" + imgColumnTableName);
                        imgfileID.put(obj1.get("fileId").toString(), seq_id + "." + i);
                        if (imgColumnTableName.contains("LHSSYS_PORTAL_APP_TRAN")) {
                            if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
//                            for (String key : imgfileID.keySet()) {
//                                U.log(key + " " + imgfileID.get(key));
//                                String replaceKey = imgfileID.get(key).replaceAll("(\\d+)(.\\d+)", seq_id + "\\.$2");
//                                U.log("replaceKey   111111 : " + replaceKey);
//                                imgfileID.put(key, replaceKey);
//                            }
//                            U.log("imageTime: " + obj1.get("imageTime").toString() + "\n fileName : " + obj1.get("fileName").toString() + "\n USER_CODE : "
//                                    + USER_CODE + "\n image desc : " + obj1.get("desc").toString() + " \n sysFileName : " + obj1.get("sysFileName").toString());
                                System.out.println("IMAGE FILE : " + obj1.get("fileId").toString());
                                String fileId = obj1.get("fileId").toString();
                                System.out.println("IMAGE FILE : " + Float.parseFloat(imgfileID.get(fileId)));
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
                        } //                    else if (imgColumnTableName.contains("DOC_TRAN")) {
                        //                        refKeyVal = insertImageIntoDocTran(imgColumnTableName, obj1, json, docType);
                        //                    } 
                        else {
                            insertImageIntoOtherTable(imgColumnTableName, obj1, json);
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        if (fileUploadStatus.getStatus().equalsIgnoreCase("insert data") && generatedProdVRNO.contains("-")) {
            if (isNotificationSend) {
                JSONObject json = (JSONObject) json_parser.parse(listJsonArray.get(0).toString());
                GenerateNotification notifObj = new GenerateNotification(connection);
                notifObj.sendNotification(json, seq_no, generatedProdVRNO);
            }
            if (isSendMail) {
                SendEmail sendMail = new SendEmail(connection);
                JSONObject json = (JSONObject) json_parser.parse(listJsonArray.get(0).toString());
                jsonArray = (JSONArray) json.get("recordsInfo");
                JSONObject obj1 = (JSONObject) jsonArray.get(0);
                sendMail.sendEmailItemDetails(generatedProdVRNO, obj1.get("TCODE") != null ? obj1.get("TCODE").toString() : null,
                        obj1.get("ENTITY_CODE") != null ? obj1.get("ENTITY_CODE").toString() : null,
                        acc_year,
                        obj1.get("ACC_CODE") != null ? obj1.get("ACC_CODE").toString() : null,
                        obj1.get("ITEM_CODE") != null ? obj1.get("ITEM_CODE").toString() : null
                );

            }
        }

        return fileUploadStatus;
    }

    public FileUploadStatus saveDataByProcedure(String jsonString) {
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        String returnREsult = "insert data";
        String procedureOfUpadte = "";
        String procedureOfInsert = "";
//        String procedureOfInsertNew = "";
        PreparedStatement ps1 = null;
        ResultSet rs1 = null;
        JSONArray jsonArray = new JSONArray();
        String executeAfterSQL = "select execute_after_update, EXECUTE_AFTER_INSERT from lhssys_portal_table_dsc_update where seq_no = " + seq_no;
        U.log("GET EXECUTE_AFTER_UPDATE, EXECUTE_AFTER_INSERT SQL IN MULTIPLE ADD ENTRY : " + executeAfterSQL);
        try {
            try {
                ps1 = connection.prepareStatement(executeAfterSQL);
                rs1 = ps1.executeQuery();
                if (rs1 != null && rs1.next()) {
                    procedureOfUpadte = rs1.getString(1);
                    procedureOfInsert = rs1.getString(2);
//                    procedureOfInsertNew = rs1.getString(2);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                ps1.close();
                rs1.close();
            }
            if (procedureOfInsert != null && procedureOfInsert.length() > 2) {
                this.flag = flag;
                try {
                    ps1 = connection.prepareStatement("select TO_CHAR(SYSDATE, 'DD-MM-YYYY  HH24:MI:SS') as systemdate from dual");
                    rs1 = ps1.executeQuery();
                    if (rs1 != null && rs1.next()) {
                        sysdate = rs1.getString(1);
                    }
                } catch (Exception e) {
                } finally {
                    ps1.close();
                    rs1.close();
                }
                JSONArray listJsonArray1 = new JSONArray();
                U.log("jsonString : " + jsonString);
                JSONParser json_parser1 = new JSONParser();
                JSONObject listjson1 = (JSONObject) json_parser1.parse(jsonString);
                listJsonArray1 = (JSONArray) listjson1.get("list");
                int listArrLength1 = listJsonArray1.size();
//                if (saveProcessFlag != "P") {
//                    listArrLength1 = 1;
//                }

                U.log(" EXECUTE_AFTER_INSERT procedure : " + procedureOfInsert);
                for (int j = 0; j < listArrLength1; j++) {
                    String procedureOfInsertNew = procedureOfInsert;
                    colName = new StringBuffer();
                    colValue = new StringBuffer();
                    JSONObject json = (JSONObject) json_parser1.parse(listJsonArray1.get(j).toString());
                    jsonArray = (JSONArray) json.get("recordsInfo");
                    for (int i = 0; i < jsonArray.size(); i++) {
                        JSONObject jSONObject = (JSONObject) jsonArray.get(i);
                        for (int k = 0; k < jSONObject.size(); k++) {
                            Set<Map.Entry<String, Object>> entrySet = jSONObject.entrySet();
                            for (Map.Entry<String, Object> map : entrySet) {
                                if (map.getKey().equals("DYNAMIC_TABLE_SEQ_ID")) {
                                    procedureOfInsertNew = procedureOfInsertNew.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()) + "'");
                                    String l = String.valueOf(map.getValue());
                                } else {
                                    procedureOfInsertNew = procedureOfInsertNew.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()).toUpperCase() + "'");
                                    String l = map.getKey();
                                }
                            }
                        }
                        try {
                            U.log("FINAL REPLACED VALUE procedureOfInsert : " + procedureOfInsertNew);
                            ps1 = connection.prepareStatement(procedureOfInsertNew);
                            int n = ps1.executeUpdate();
                            if (n >= 0) {
                                String result = n + " row inserted.";
                                fileUploadStatus.setStatus(returnREsult);
                                U.log(" execute_after_insert result : " + result);
                            } else {
                                String result = n + " row updated";
                                fileUploadStatus.setStatus(result);
                                U.log(" execute_after_insert result : " + result);
                            }
                        } catch (SQLException e) {
//                            U.errorLog(e);
//                            fileUploadStatus.setStatus(e.getMessage());
                            System.out.println("exeception 3---> " + e.getMessage());
                            try {
                                String returnMessage = "";
                                String[] returnMessageArr;
                                returnMessage = e.getMessage();
                                System.out.println("returnMessage : " + returnMessage);
                                returnMessageArr = returnMessage.split(":");
                                returnMessage = returnMessageArr[1];
                                System.out.println("execute_after_update result  e.getMessage() : " + e.getMessage());
                                returnMessage = returnMessage.replaceAll("ORA-06512", "");
                                System.out.println("returnMessage : " + returnMessage);
                                if (returnMessage.contains("insert data")) {
                                    returnMessage = "insert data";
                                }
                                fileUploadStatus.setStatus(returnMessage);
                            } catch (Exception ex) {
                                fileUploadStatus.setStatus("Error occoured due to some internal reason.");
                            }
                        } finally {
                            ps1.close();
                        }
                    }
                }
            } else {
//            fileUploadStatus = addEntry(jsonString, flag);
            }
        } catch (Exception e) {
        }
        return fileUploadStatus;
    }

    public FileUploadStatus approveByProcedure(String jsonString) {
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        String returnREsult = "insert data";
        String procedureOfApproval = "";
        PreparedStatement ps1 = null;
        ResultSet rs1 = null;
        JSONArray jsonArray = new JSONArray();
        String executeAfterSQL = "select execute_on_approval from lhssys_portal_table_dsc_update where seq_no = " + seq_no;
        U.log("GET execute_on_approval SQL IN MULTIPLE ADD ENTRY : " + executeAfterSQL);
        try {
            try {
                ps1 = connection.prepareStatement(executeAfterSQL);
                rs1 = ps1.executeQuery();
                if (rs1 != null && rs1.next()) {
                    procedureOfApproval = rs1.getString(1);
//                    procedureOfInsertNew = rs1.getString(2);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                ps1.close();
                rs1.close();
            }
            if (procedureOfApproval != null && procedureOfApproval.length() > 2) {
                this.flag = flag;
                try {
                    ps1 = connection.prepareStatement("select TO_CHAR(SYSDATE, 'DD-MM-YYYY  HH24:MI:SS') as systemdate from dual");
                    rs1 = ps1.executeQuery();
                    if (rs1 != null && rs1.next()) {
                        sysdate = rs1.getString(1);
                    }
                } catch (Exception e) {
                } finally {
                    ps1.close();
                    rs1.close();
                }
                JSONArray listJsonArray1 = new JSONArray();
                U.log("jsonString : " + jsonString);
                JSONParser json_parser1 = new JSONParser();
                JSONObject listjson1 = (JSONObject) json_parser1.parse(jsonString);
                listJsonArray1 = (JSONArray) listjson1.get("list");
                int listArrLength1 = listJsonArray1.size();
                U.log(" EXECUTE_ON_Approve procedure : " + procedureOfApproval);
                for (int j = 0; j < 1; j++) {
                    String procedureOfInsertNew = procedureOfApproval;
                    colName = new StringBuffer();
                    colValue = new StringBuffer();
                    JSONObject json = (JSONObject) json_parser1.parse(listJsonArray1.get(j).toString());
                    jsonArray = (JSONArray) json.get("recordsInfo");
                    System.out.println("json array size()==>"+ jsonArray.size());
                    for (int i = 0; i < jsonArray.size(); i++) {
                        JSONObject jSONObject = (JSONObject) jsonArray.get(i);
                        System.out.println("json string==> "+ jSONObject.toJSONString());
                        for (int k = 0; k < jSONObject.size(); k++) {
                            Set<Map.Entry<String, Object>> entrySet = jSONObject.entrySet();
                            for (Map.Entry<String, Object> map : entrySet) {
                                if (map.getKey().equals("DYNAMIC_TABLE_SEQ_ID")) {
                                    procedureOfInsertNew = procedureOfInsertNew.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()) + "'");
                                    String l = String.valueOf(map.getValue());
                                } else {
                                    procedureOfInsertNew = procedureOfInsertNew.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()).toUpperCase() + "'");
                                    String l = map.getKey();
                                }
                            }
                        }
                        try {
                            U.log("FINAL REPLACED VALUE procedureOfApproval : " + procedureOfInsertNew);
                            ps1 = connection.prepareStatement(procedureOfInsertNew);
                            int n = ps1.executeUpdate();
                            if (n >= 0) {
                                String result = n + " row inserted.";
                                fileUploadStatus.setStatus(returnREsult);
                                U.log(" execute_on_approve result : " + result);
                            } else {
                                String result = n + " row updated";
                                fileUploadStatus.setStatus(result);
                                U.log(" execute_on_approve result : " + result);
                            }
                        } catch (SQLException e) {
                            U.errorLog(e);
                            fileUploadStatus.setStatus("Error occoured sue to some internal reason.");

                        } finally {
                            ps1.close();
                        }
                    }
                }
            } else {
            }
        } catch (Exception e) {
        }
        return fileUploadStatus;
    }

    public int nextSeqID(String tableName) throws Exception {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int listCount = 0;
        try {
            String selectQry = "select portal_app_tran_seq.nextval from dual";
            if (tableName.equalsIgnoreCase("lhssys_calender_scheduler")) {
                selectQry = "select tourplan_slno_seq.nextval from dual";
            }

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

    public void getArray(Object object2) throws ParseException, SQLException {
        JSONArray jsonArr = (JSONArray) object2;
        for (int k = 0; k < jsonArr.size(); k++) {
            if (jsonArr.get(k) instanceof JSONObject) {
                parseJson((JSONObject) jsonArr.get(k));
            } else {
            }
        }
    }

    public void parseJson(JSONObject jsonObject) throws ParseException, SQLException {
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
                    } catch (SQLException e) {
                        U.errorLog("Exception 9" + e);
                    }
                }
                if (obj.toString().toLowerCase().contains("col2")) {
                    USER_CODE = jsonObject.get(obj).toString();
                    defultValue.put("USER_CODE", "'" + USER_CODE + "'");
                }

                if (obj.toString().equalsIgnoreCase("PUSH_NOTIFICATION")) {
                    isNotificationSend = true;
                }
                if (obj.toString().equalsIgnoreCase("SEND_EMAIL")) {
                    isSendMail = true;
                }

                if (!obj.toString().contains("imageTime") && !obj.toString().contains("video")
                        && !obj.toString().contains("file") && !obj.toString().contains("fileName")
                        && !obj.toString().contains("desc") && !obj.toString().contains("sysFileName")) {
//                    System.out.println(obj.toString() + "----> " + columnStatus.get(obj));
                    if (columnStatus.get(obj) != null && (columnStatus.get(obj).equalsIgnoreCase("D") || columnStatus.get(obj).equalsIgnoreCase("I"))) {
                    } else {

                        if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES") && !obj.toString().equals("SAVE_FLAG")) {
                            colName.append(obj.toString()).append(",");
                        }
                        String columnValue = "";
                        try {
                            columnValue = jsonObject.get(obj).toString();
                        } catch (Exception e) {
                            U.errorLog("Exception 10=" + e);
                            if (f.isNumber(obj.toString())) {
                                columnValue = null;
                            } else {
                                columnValue = "";
                            }
                        }
                        if (obj.toString().contains("LASTUPDATE")) {
                            defultValue.put(obj.toString(), sysdate);
                        }
                        String VRDATEFORMAT_SQL = "SELECT V.VRDATEFORMAT, V.CHQDATE, V.APPROVEDDATE_FORMAT FROM VIEW_DEFAULT_USER_LINKS V";
                        String VRDATEFORMAT = "";
                        String CHQDATEFORMAT = "";
                        String APPROVEDDATE_FORMAT = "";
                        try {
                            ps = connection.prepareStatement(VRDATEFORMAT_SQL);
                            rs = ps.executeQuery();
                            if (rs != null && rs.next()) {
                                do {
                                    VRDATEFORMAT = rs.getString(1);
                                    CHQDATEFORMAT = rs.getString(2);
                                    APPROVEDDATE_FORMAT = rs.getString(3);
                                } while (rs.next());
                            }
                        } catch (Exception e) {
                            U.errorLog("Exception 1" + e);
                        } finally {
                            ps.close();
                            rs.close();
                        }
                        if (obj.toString().contains("ENTRY_DATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                        }
                        if (obj.toString().contains("expense_date") || obj.toString().contains("EXPENSE_DATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                        }
                        if (obj.toString().contains("TASK_DATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                        }
                        if (obj.toString().contains("AMENDDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                        }

//                        if (obj.toString().contains("DATE") && !obj.toString().equalsIgnoreCase("LASTUPDATE")) {
//                            columnValue = jsonObject.get(obj).toString();
//                            if (columnValue != null && !columnValue.isEmpty() && !columnValue.equals("")) {
//                                if (columnType.get(obj).equals("DATE")) {
//                                    columnValue = "to_date('" + columnValue + "','dd-mm-yyyy')";
//                                } else {
//                                    if (columnType.get(obj).equals("DATETIME")) {
//                                        columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
//                                    }
//                                }
//                            } else {
//                            }
//                        }
                        if (obj.toString().contains("ACC_SLNO")) {
                            PreparedStatement pst = null;
                            ResultSet rs = null;
                            String query = "select max(acc_slno) slno from Acc_Contact_Mast";
                            int maxSno = 0;
                            try {
                                pst = connection.prepareStatement(query);
                                rs = pst.executeQuery();
                                if (rs.next() && rs != null) {
                                    maxSno = Integer.parseInt(rs.getString("slno")) + 1;
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                            columnValue = String.valueOf(maxSno);
                        }

                        if (obj.toString().contains("VRDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                        }
                        if (obj.toString().contains("CHQDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + CHQDATEFORMAT + "')";
                        }
                        if (obj.toString().contains("ITEM_CODE")) {
                            itemCode = columnValue;
                            U.log("itemCode : " + itemCode);
                        }
                        if (obj.toString().contains("ITEM_CATG")) {
                            String itemCatgSQL = "SELECT ITEM_CATG FROM ITEM_MAST WHERE ITEM_CODE = '" + itemCode + "'";
                            U.log("itemCatgSQL : " + itemCatgSQL);
                            try {
                                ps = connection.prepareStatement(itemCatgSQL);
                                rs = ps.executeQuery();
                                if (rs != null && rs.next()) {
                                    do {
                                        columnValue = rs.getString(1);
                                    } while (rs.next());
                                }
                            } catch (Exception e) {
                                U.errorLog("Exception 2" + e);
                            } finally {
                                ps.close();
                                rs.close();
                            }
                        }
                        if (obj.toString().contains("APPROVEDDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + APPROVEDDATE_FORMAT + "')";
                        }

                        if ((obj.toString().equals("VRNO")) && columnValue.isEmpty() && isAddonTempEntry == null) {
                            if (table_name.equals("SS_TRAN") || table_name.equals("ORDER_BODY")) {
                                columnValue = SS_TRAN_VRNO;
                                generatedProdVRNO = SS_TRAN_VRNO;
                            } else {
                                generatedProdVRNO = columnValue;
                                U.log("VRNO : " + columnValue);
                            }
                        } else {
                            if (isAddonTempEntry != null) {
                                generatedProdVRNO = columnValue;
                                columnValue = columnValue;
                            }
                        }

                        if (f.isNumber(obj.toString())) {
                            if (obj.toString().contains("SEQ_ID")) {
                                if (columnValue == null || columnValue == "") {

                                    columnValue = seq_id + "";
                                }
                            }
                            if (f.isImg(obj.toString())) {
                                columnValue = seq_id * (-1) + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                            }
                            if (f.isVrno(obj.toString()) && flag.contains("off") && isAddonTempEntry == null) {
                                if (table_name.equals("SS_TRAN")) {
                                    columnValue = SS_TRAN_VRNO;
                                    generatedProdVRNO = SS_TRAN_VRNO;
                                } else {
                                    if (string_vrno != null) {
                                        String svVoucherSeries = null;
                                        String svVoucherPad = null;
                                        String svVoucherCode = null;
                                        String svVoucherDefaultDivCode = null;
                                        String getdefultuserLinkValue = "select * from view_default_user_links";
                                        PreparedStatement procCall = null;
                                        Statement stmt = null;
                                        ResultSet rs1 = null;
                                        PreparedStatement ds = null;
                                        try {
                                            ds = connection.prepareStatement(getdefultuserLinkValue);
                                            rs1 = ds.executeQuery();
                                            if (rs1 != null && rs1.next()) {
                                                if (first_screen.contains("S")) {
                                                    svVoucherCode = rs1.getString("sv_Voucher_TCode");
                                                    svVoucherSeries = rs1.getString("sv_Voucher_series");
                                                    svVoucherPad = rs1.getString("sv_Voucher_pad");
                                                    svVoucherDefaultDivCode = rs1.getString("sv_voucher_default_div_code");
                                                }
                                                if (first_screen.contains("O")) {
                                                    svVoucherCode = rs1.getString("order_TCode");
                                                    svVoucherSeries = rs1.getString("order_series");
                                                    svVoucherPad = rs1.getString("order_pad");
                                                    svVoucherDefaultDivCode = rs1.getString("order_default_div_code");
                                                } else {
                                                    svVoucherCode = rs1.getString("sv_Voucher_TCode");
                                                    svVoucherSeries = rs1.getString("sv_Voucher_series");
                                                    svVoucherPad = rs1.getString("sv_Voucher_pad");
                                                    svVoucherDefaultDivCode = rs1.getString("sv_voucher_default_div_code");
                                                }
                                            }

                                            String executeProc = "{call lhs_crm.generate_VRNO(?,TO_DATE(sysdate,'DD-MM-RRRR'),?,?,?,?,?)}";
                                            procCall = connection.prepareCall(executeProc);
                                            procCall.setString(1, svVoucherSeries);// series----EQ
                                            procCall.setString(2, svVoucherPad);//pad-----3
                                            procCall.setString(3, entityCode);
                                            procCall.setString(4, svVoucherDefaultDivCode);
                                            procCall.setString(5, acc_year);
                                            procCall.setString(6, svVoucherCode);// tcode----E
                                            procCall.executeUpdate();
                                            stmt = connection.createStatement();
                                            String strSLNoQuery = "select lhs_crm.return_new_vrno from dual";
                                            rs1 = stmt.executeQuery(strSLNoQuery);
                                            if (rs1 != null && rs1.next()) {
                                                string_vrno = rs1.getString(1);
                                                columnValue = string_vrno;
                                                generatedProdVRNO = string_vrno;
                                            }
                                            SqlUtil.appendVRNO(connection, string_vrno, entityCode, svVoucherDefaultDivCode, acc_year, svVoucherCode);
                                        } catch (Exception e) {
                                            U.errorLog("Exception 3" + e);
                                        } finally {
                                            procCall.close();
                                            stmt.close();
                                            ds.close();
                                            rs1.close();
                                        }
                                    }
                                }
                            }
                            if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES") && !obj.toString().equals("SAVE_FLAG")) {

                                System.out.println("COL_VALUE : " + columnValue);
                                if (columnValue != null && columnValue != "") {
                                    colValue.append("'").append(columnValue).append("',");
                                } else {
                                    colValue.append("''").append(",");
                                }
                            }
                        } else {
                            if (f.isImg(obj.toString())) {
                                columnValue = seq_id * (-1) + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                                imgfileID.put(obj.toString(), columnValue);
                            }
                            if (f.isVideo(obj.toString())) {
                                columnValue = seq_id * (-1) + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                                videofileId.put(obj.toString(), columnValue);
                            }
                            if (f.isSysDate(obj.toString())) {
                                columnValue = sysdate;
                            }
                            if (columnValue != null && columnValue.contains("to_date")) {
                                if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                                    colValue.append(columnValue).append(", ");
                                }
                            } else {
                                if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES") && !obj.toString().equals("SAVE_FLAG")) {
                                    colValue.append("'").append(columnValue).append("',");
                                }
                            }
                        }
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
        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            sqlDocumentInsert = "insert into LHSSYS_portal_upload_file (FILE_ID,FILE_NAME,\n"
                    + "UPLOADATE_DATE,LAST_UPDATED,DESCRIBTION,USER_CODE,FLAG,SYSTEM_FILE_NAME,\n"
                    + "STORE_FILE) values (?,?,sysdate,sysdate,?,?,'h',?,?)";
            U.log("INSERT DOC/IMG SQL : " + sqlDocumentInsert);
            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setFloat(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());
            pst.execute();
            status = "add entry";
            U.log("Result : " + status);
        } catch (Exception e) {
            U.errorLog("FILE UPDATE ERROR : " + e);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException ex) {
                    U.errorLog("Exception 4" + ex);
                }
            }
        }
        return status;
    }

    public int insertVideo(String fileName, String userCode, String discribtion, String systemFileName, InputStream fin, float fileId) throws Exception {
        int status = 0;
        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            sqlDocumentInsert = "insert into LHSSYS_portal_upload_file \n"
                    + "(FILE_ID,FILE_NAME,UPLOADATE_DATE,LAST_UPDATED,DESCRIBTION,\n"
                    + "USER_CODE,FLAG,SYSTEM_FILE_NAME,store_file_LRAW) values \n"
                    + "(?,?,sysdate,sysdate,?,?,'h',?,?)";
            U.log("INSERT VIDEO SQL : " + sqlDocumentInsert);
            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setFloat(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());
            status = pst.executeUpdate();
        } catch (IOException e) {
            U.errorLog("FILE UPDATE ERROR===" + e);
        } catch (SQLException e) {
            U.errorLog("FILE UPDATE ERROR===" + e);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException ex) {
                    U.errorLog("Exception 5" + ex);
                }
            }
        }
        return status;
    }

    public int getDocumentListCount(String tablename) throws Exception {
        PreparedStatement pst = null;
        ResultSet rs1 = null;
        int listCount = 0;
        try {
            String selectQry = "select max(slno) from " + tablename;
            U.log("GET MAX SEQ_ID : " + selectQry);
            pst = connection.prepareStatement(selectQry);
            rs1 = pst.executeQuery();
            if (rs1 != null && rs1.next()) {
                listCount = rs1.getInt(1);
            }
        } catch (SQLException e) {
        } finally {
            if (pst != null && rs1 != null) {
                try {
                    pst.close();
                    rs1.close();
                } catch (SQLException e) {
                    U.errorLog("Exception 6" + e);
                }
            }
        }
        return listCount;
    }

    public void setDatatype(String col1) throws SQLException {
        String sql = " select * from LHSSYS_PORTAL_DATA_DSC_UPDATE\n"
                + "where seq_no=" + col1 + "order by slno";
        PreparedStatement ps1 = null;
        ResultSet rs1 = null;
        try {
            ps1 = connection.prepareStatement(sql);
            rs1 = ps1.executeQuery();

            if (rs1 != null && rs1.next()) {
                do {
                    table_name = rs1.getString("TABLE_NAME");
                    f.addInmap(rs1.getString("column_name"), rs1.getString("column_type"));
                    f.addInmap(rs1.getString("column_name"), rs1.getString("column_default_value"));
                    f.addInmap(rs1.getString("column_name"), rs1.getString("Item_help_property"));
                    f.addInmap(rs1.getString("column_name"), rs1.getString("column_desc"));
                } while (rs1.next());
            }
        } catch (SQLException e) {
            U.errorLog("Exception 7" + e);
        } finally {
            rs1.close();
            ps1.close();
        }
        ListMultimap<String, String> map = FileClass.map;
    }

    public InputStream writeOnImage(String image, String imgdate) {
        InputStream iss = null;
        try {
            Date date = Calendar.getInstance().getTime();
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
            String dateStr = formatter.format(date);
            System.out.println("datetime on image ==  "+ dateStr);
            String base64Img = image;//.split(",")[1];
            byte[] imgBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
            iss = new ByteArrayInputStream(imgBytes);
            BufferedImage bi = ImageIO.read(iss);
            Graphics2D graphics = bi.createGraphics();
            Font font = new Font("ARIAL", Font.PLAIN, 20);
            graphics.setFont(font);
            graphics.drawString(dateStr, 25, 25);
            bi.flush();
            byte[] imageInByte;
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bi, "jpg", baos);
            baos.flush();
            imageInByte = baos.toByteArray();
            baos.close();
            iss = new ByteArrayInputStream(imageInByte);
        } catch (IOException e) {
            U.errorLog("Exception 8" + e);
        }
        return iss;
    }

    private void insertImageIntoOtherTable(String imgColumnTableName, JSONObject imgJson, JSONObject mainJson) {
        JSONArray jsonArray = new JSONArray();
        String[] tablearr = imgColumnTableName.split("~");
        System.out.println("TABLE_ARR : " + tablearr.length);

        String colName = "";
        String colVal = "";
        jsonArray = (JSONArray) mainJson.get("recordsInfo");
        InputStream iss = null;
        JSONObject jsobj = (JSONObject) jsonArray.get(0);
        for (int i = 2; i < tablearr.length; i++) {
            colName = colName + "," + tablearr[i];
            colVal = colVal + ", '" + jsobj.get(tablearr[i]) + "'";

            System.out.println("COL_NAME  " + colName + " : " + colVal);
        }
        if (imgJson.get("file") != null && imgJson.get("file").toString().length() > 3) {
            String base64Img = imgJson.get("file").toString();
            byte[] imageByts = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
            iss = new ByteArrayInputStream(imageByts);

            PreparedStatement pst = null;
            String sqlDocumentInsert = "";
            String status;
            try {
                sqlDocumentInsert = "insert into " + tablearr[0] + "(" + tablearr[1] + colName + ",lastupdate ) values ( ? " + colVal.toString() + ",sysdate)";
                U.log("sqlDocumentInsert---> " + sqlDocumentInsert);
                pst = connection.prepareStatement(sqlDocumentInsert);
                pst.setBinaryStream(1, iss, iss.available());

                int i = 0;
                i = pst.executeUpdate();
                if (i > 0) {
                    status = "insert data";
                } else {
                    status = "IMAGE NOT INSERTED";
                }
                U.log("IMAGE INSERT STATUS : " + status);
            } catch (Exception e) {
                status = "IMAGE NOT INSERTED";
                U.errorLog("exeception 17---> " + e.getMessage());
            }
        }
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
            U.log("jarLocation == " + jarLocation);
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
                U.log("Jar Location is not available.");
            }
        } catch (Exception e) {
        }
    }
}

//    public void sendNotification(JSONObject jsonobj, String seq_no) {
//
//        String user_str = "";
//        // String user_code = "";
////        String user_token_no = "";
//        String notification_data_all = "";
//        String AUTH_KEY_FCM = "AAAAqTPM8z8:APA91bGVIagFqqDqxKRmp_8iq8VdxPX3yzkUIyp0URXoe6anWMgltTzX2QEyZ9klRYb1Y3jfGwUfb_S8prvVvJkYjLrU7fyGlbVJ07WlEWOp21cu3cW-M-dg8_1rQeSNygGe3WKzhoxL";
//        String API_URL_FCM = "https://fcm.googleapis.com/fcm/send";
////        String message = "";
//        String ref_lov_whr_clause = "";
////        String taskName = "";
//        JSONArray jsonArray = (JSONArray) jsonobj.get("recordsInfo");
//        JSONObject json_obj = (JSONObject) jsonArray.get(0);
////        System.out.println("SaveAllEntryDAO");
////        System.out.println("json_obj--->" + json_obj);
//
//        try {
//            String query = "SELECT * FROM LHSSYS_PORTAL_DATA_DSC_UPDATE t where t.column_name= 'PUSH_NOTIFICATION' and seq_no=" + seq_no;
//            System.out.println("Query----->" + query);
//            PreparedStatement pst = connection.prepareStatement(query);
//            ResultSet rs = pst.executeQuery();
//            while (rs.next()) {
//                notification_data_all = rs.getString("validate_dependent_columns");
//                ref_lov_whr_clause = rs.getString("ref_lov_where_clause");
//            }
//            for (int i = 0; i < json_obj.size(); i++) {
//                Set<Map.Entry<String, Object>> entrySet = json_obj.entrySet();
//                for (Map.Entry<String, Object> map : entrySet) {
//                    if (ref_lov_whr_clause != null && !ref_lov_whr_clause.isEmpty()) {
//                        if (ref_lov_whr_clause.contains(map.getKey())) {
//                            ref_lov_whr_clause = ref_lov_whr_clause.replace("'#" + map.getKey() + "#'", map.getValue() != null ? "'" + map.getValue().toString() + "'" : "''");
//                        }
//                    }
//                }
//            }
//
//            System.out.println("ref_lov_whr_clause--------->" + ref_lov_whr_clause);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        try {
//            String notifQuery = ref_lov_whr_clause;
//            PreparedStatement pst2 = connection.prepareStatement(notifQuery);
//            ResultSet rs = pst2.executeQuery();
//
//            if (rs != null && rs.next()) {
//                do {
//                    String user_token_no = rs.getString(1);
//                    String message = rs.getString(2);
//                    String notification_data = notification_data_all;
//                    if (user_token_no != null && !user_token_no.isEmpty()) {
//                        if (notification_data.contains("TokenNo")) {
//                            notification_data = notification_data.replaceAll("TokenNo", user_token_no);
//                        }
//
//                        if (notification_data.contains("msgdata")) {
//                            notification_data = notification_data.replaceAll("'~msgdata'", message);
//                        }
//
//                        System.out.println("TokenNo-----> " + user_token_no);
//                        System.out.println("Notification Data----> " + notification_data);
//
//                        try {
//                            String authKey = AUTH_KEY_FCM; // You FCM AUTH key
//                            String FMCurl = API_URL_FCM;
//                            URL url = new URL(FMCurl);
//                            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//                            conn.setUseCaches(false);
//                            conn.setDoInput(true);
//                            conn.setDoOutput(true);
//                            conn.setRequestMethod("POST");
//                            conn.setRequestProperty("Authorization", "key=" + authKey);
//                            conn.setRequestProperty("Content-Type", "application/json");
//
//                            OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
//                            wr.write(notification_data);
//                            wr.flush();
//                            conn.getInputStream();
//                            int code = conn.getResponseCode();
//                            System.out.println("Response Code For Notif---->" + code);
//
//                        } catch (Exception e) {
//                            e.printStackTrace();
//                        }
//
//                    }
//                } while (rs.next());
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//    }
//
//}
