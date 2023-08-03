/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.google.common.collect.ListMultimap;
import com.lhs.EMPDR.JSONResult.FileUploadStatus;
import com.lhs.EMPDR.entity.FileClass;
import com.lhs.EMPDR.entity.LoggerWrite;
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
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
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
public class JDBCMultipleAddEntryDAO {

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
    String refColName = "";
    String refKeyVal = "";
    JSONObject imgJSON = new JSONObject();
    FileClass f = new FileClass();
    String string_vrno = null;
    HashMap<String, String> nondisplayColList = new HashMap<String, String>();
    HashMap<String, String> imgfileID = new HashMap<String, String>();
    HashMap<String, String> videofileId = new HashMap<String, String>();
    HashMap<String, String> defultValue = new HashMap<String, String>();
    String USER_CODE;
    LoggerWrite log = new LoggerWrite();
    HashMap<String, String> displayColList = new HashMap<String, String>();
    String seq_no;
    String itemCode;
    String entityCode = null;
    String acc_year = null;
    String first_screen = null;
    PreparedStatement ps = null;
    ResultSet rs;
    HashMap<String, String> columnStatus = new HashMap<String, String>();
    HashMap<String, String> columnType = new HashMap<String, String>();
    HashMap<String, String> columnTableName = new HashMap<String, String>();
    HashMap<String, String> columnDefaultValue = new HashMap<String, String>();

    public JDBCMultipleAddEntryDAO(Connection connection) {
        this.connection = connection;
        getAccYear();
    }

    public void getAccYear() {
        String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE \n"
                + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )\n"
                + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
        System.out.println("getAccYearSQL : " + getAccYearSQL);

        try {
            ps = connection.prepareStatement(getAccYearSQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                acc_year = rs.getString(1);
                System.out.println("currentAccYear : " + acc_year);
            } else {
                System.out.println("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
            }
        } catch (Exception e) {
        }
    }

    public void getDetailOfColumns() {
        StringBuilder sql = new StringBuilder();

        sql.append("select u.*,t.first_screen,t.entity_code_str from lhssys_portal_data_dsc_update u,LHSSYS_PORTAL_TABLE_DSC_UPDATE t where ");
        sql.append("u.seq_no=").append(seq_no).append(" and t.seq_no=").append(seq_no).append(" order by slno");
        U.log("MultipleAddEntry SQL : " + sql.toString());
        try {
            ps = connection.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    table_name = rs.getString("table_name");
                    entityCode = rs.getString("entity_code_str");
                    if (rs.getString("status") != null && !rs.getString("status").contains("F")) {
                        displayColList.put(rs.getString("column_name"), rs.getString("column_default_value"));
                    } else {
                        String defaultVal = rs.getString("column_default_value");
                        if (defaultVal == null && rs.getString("column_name").equals("SEQ_ID")) {
                            seq_id = (getDocumentListCount(table_name) + 1);
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
                    rs.close();
                } catch (Exception e) {
                }
            }

        }
    }

    public FileUploadStatus addMultipleEntry(String jsonString, String flag) throws ParseException, Exception {
        U.log("jsonstring : " + jsonString);
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        String returnREsult = "insert data";
        String procedureOfUpadte = "";
        String procedureOfInsert = "";
        String procedureOfInsertNew = "";
        PreparedStatement ps1 = null;
        ResultSet rs1 = null;
        try {
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
            U.log("dynamic_table_seq_id : " + seq_no);
            String executeAfterSQL = "select execute_after_update, EXECUTE_AFTER_INSERT from lhssys_portal_table_dsc_update where seq_no = " + seq_no;
//            System.out.println("GET EXECUTE_AFTER_UPDATE, EXECUTE_AFTER_INSERT SQL : " + executeAfterSQL);
            try {
                ps1 = connection.prepareStatement(executeAfterSQL);
                rs1 = ps1.executeQuery();
                if (rs1 != null && rs1.next()) {
                    procedureOfUpadte = rs1.getString(1);
                    procedureOfInsert = rs1.getString(2);
                    procedureOfInsertNew = rs1.getString(2);
                }
            } catch (Exception e) {
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
                System.out.println("jsonString : " + jsonString);
                JSONParser json_parser1 = new JSONParser();
                JSONObject listjson1 = (JSONObject) json_parser1.parse(jsonString);
                listJsonArray1 = (JSONArray) listjson1.get("list");
                int listArrLength1 = listJsonArray1.size();
                for (int j = 0; j < listArrLength1; j++) {
                    System.out.println(" EXECUTE_AFTER_INSERT procedure : " + procedureOfInsert);
                    colName = new StringBuffer();
                    colValue = new StringBuffer();
                    JSONObject json = (JSONObject) json_parser.parse(listJsonArray1.get(j).toString());
                    jsonArray = (JSONArray) json.get("recordsInfo");
                    for (int i = 0; i < 1; i++) {
                        JSONObject jSONObject = (JSONObject) jsonArray.get(i);
                        for (int k = 0; k < jSONObject.size(); k++) {
                            Set<Map.Entry<String, Object>> entrySet = jSONObject.entrySet();
                            for (Map.Entry<String, Object> map : entrySet) {
                                Object val = map.getValue();//String.valueOf(map.getValue()).toUpperCase() 
                                if (val == null) {
                                    val = "";
                                }
                                if (map.getKey().equals("DYNAMIC_TABLE_SEQ_ID") || map.getKey().equals("ROWID")) {
                                    procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + val + "'");
                                    String l = String.valueOf(map.getValue());
                                } else {
                                    procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + val + "'");
                                    String l = map.getKey();
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
                            fileUploadStatus.setStatus("Error occoured sue to some internal reason.");
                        } finally {
                            ps1.close();
                        }
                    }
                }
            } else {
                fileUploadStatus = addEntry(jsonString, flag);
            }
        } catch (SQLException e) {
            System.out.println("exeception ---> " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return fileUploadStatus;
    }
    String sysdate = "";
    String vrno = "";

    public FileUploadStatus addEntry(String jsonString, String flag) throws ParseException, Exception {
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        this.flag = flag;
        PreparedStatement ps1 = null;
        ResultSet rs1 = null;
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

                    JSONArray listJsonArray1 = new JSONArray();
//                    System.out.println("jsonString : " + jsonString);
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
                                        PRE_DATA_SAVE_EVENT = PRE_DATA_SAVE_EVENT.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()) + "'");
                                    } else {
                                        PRE_DATA_SAVE_EVENT = PRE_DATA_SAVE_EVENT.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()).toUpperCase() + "'");
                                    }
                                }
                            }
                        }
                    }
                    System.out.println("PRE_DATA_SAVE_EVENT AFTER REPLACING : " + PRE_DATA_SAVE_EVENT);
                    String appendVrnoSql = "";
                    if (PRE_DATA_SAVE_EVENT.contains("~~")) {
                        String vrnoPdseSql[] = PRE_DATA_SAVE_EVENT.split("~~");
                        PRE_DATA_SAVE_EVENT = vrnoPdseSql[0];
                        appendVrnoSql = vrnoPdseSql[1];
                    }
                    try {
                        ps = connection.prepareStatement(PRE_DATA_SAVE_EVENT);
                        ps.executeUpdate();
                    } catch (Exception e) {
                        System.out.println("exeception ---> " + e.getMessage());
                        SS_TRAN_VRNO = e.getMessage();
                        String ValidatedMsgArr[] = SS_TRAN_VRNO.split(":");
                        SS_TRAN_VRNO = ValidatedMsgArr[1].trim();
                        String ValidatedMsgArr1[] = SS_TRAN_VRNO.split("ORA-");
                        SS_TRAN_VRNO = ValidatedMsgArr1[0].trim();
                        System.out.println("SS_TRAN_VRNO : " + SS_TRAN_VRNO);
                    } finally {
                        ps.close();
                    }
                    if (appendVrnoSql.equalsIgnoreCase(null) || appendVrnoSql != "") {
                        try {
                            ps = connection.prepareStatement(appendVrnoSql);
                            ps.executeUpdate();
                        } catch (Exception e) {
                            System.out.println("exeception ---> " + e.getMessage());
                            SS_TRAN_VRNO = e.getMessage();
                            String ValidatedMsgArr[] = SS_TRAN_VRNO.split(":");
                            SS_TRAN_VRNO = ValidatedMsgArr[1].trim();
                            String ValidatedMsgArr1[] = SS_TRAN_VRNO.split("ORA-");
                            SS_TRAN_VRNO = ValidatedMsgArr1[0].trim();
                            System.out.println("SS_TRAN_VRNO : " + SS_TRAN_VRNO);
                        } finally {
                            ps.close();
                        }
                    }
                }
            }
        } catch (Exception e) {
        } finally {
            ps1.close();
            rs1.close();
        }
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
            }

            seq_id = (getDocumentListCount(table_name) + 1);
            Object obj = json_parser.parse(json.toString());
            JSONObject json_obj = new JSONObject();
            json_obj = (JSONObject) obj;
            getColumnDetails(seq_no);
            parseJson(json_obj);

            //append nonn display column
            System.out.println("<---------nondisplayColList-------->");
            for (Map.Entry m : nondisplayColList.entrySet()) {
                if (m.getValue() != null) {
//                    String predefinedVal = defultValue.get(m.getKey());
                    String predefinedVal = defultValue.get(m.getValue());
                    if (predefinedVal == null) {
                        predefinedVal = m.getValue().toString();
                    }
                    if (m.getKey().toString().contains("LASTUPDATE")) {
                        predefinedVal = "sysdate";
                    }
                    colName.append(m.getKey()).append(",");
                    colValue.append(predefinedVal).append(",");
                    System.out.println(m.getKey() + " ---> " + predefinedVal);
                }
            }
            {

                for (int i = 1; i < jsonArrLength; i++) {
                    U.log("i---->" + i);
                    JSONObject obj1 = (JSONObject) jsonArray.get(i);
                    String imgColumnTableName = columnTableName.get(obj1.get("fileId"));
                    U.log("columnTableName -- > " + columnTableName.get(obj1.get("fileId")));
                    if (imgColumnTableName.contains("LHSSYS_PORTAL_APP_TRAN") || imgColumnTableName.contains("LHSSYS_PORTAL_APP_LOC_TRAN")) {
                        if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
                            is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
                            insertDocument(obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
                                    obj1.get("sysFileName").toString(), is,
                                    Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())));
                        }
                        if (obj1.get("videofile") != null && obj1.get("videofile").toString().length() > 3) {
                            base64Image = obj1.get("videofile").toString().split(",")[1];
                            imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
                            is = new ByteArrayInputStream(imageBytes);
                            insertVideo(obj1.get("videoFileName").toString(),
                                    USER_CODE, obj1.get("videoDesc").toString(),
                                    obj1.get("sysFileName").toString(),
                                    is, Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                        }
                    } else if (imgColumnTableName.contains("DOC_TRAN")) {
                        if (obj1.get("file") != null && obj1.get("file").toString().length() > 4) {
                            insertImageIntoDocTran(imgColumnTableName, obj1, json, table_name);
                        }
                    }
                }
            }
            for (int i = 0; i < 1; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);

//            seq_no = obj1.get("DYNAMIC_TABLE_SEQ_ID") + "";
                if (obj1.containsKey(refColName)) {
                    obj1.replace(refColName, Integer.parseInt(refKeyVal));
//                    colName.append(flag)
                }
//                U.log("Obj1 :" + obj1);
            }
            String columnNmae = colName.toString().substring(0, colName.toString().lastIndexOf(","));
            String columnValue = colValue.toString().substring(0, colValue.toString().lastIndexOf(","));
            stringBuffer.append("Insert into ").append(table_name).append("\n(").append(columnNmae).append(") values(").append(columnValue).append(")");
            System.out.println("Multiple Add Entry SQL : " + stringBuffer.toString());
            try {
                ps1 = connection.prepareStatement(stringBuffer.toString());
                ps1.execute();
                String result = "insert data";
                System.out.println("Multiple Add Entry result : " + result);
                fileUploadStatus.setStatus(result);
                System.out.println("Multiple Add Entry generatedProdVRNO : " + generatedProdVRNO);
                fileUploadStatus.setVRNO(generatedProdVRNO);
            } catch (SQLException e) {
                System.out.println("exeception ---> " + e.getMessage());
                fileUploadStatus.setStatus("Something went wrong, please try again...");
            }

        }
        return fileUploadStatus;
    }

    public String insertImageIntoDocTran(String imgTableName, JSONObject imgJson, JSONObject mainJson, String table_name) {

        PreparedStatement ps = null;
        ResultSet rs = null;
        String docCode = "";
        int docSLNO = 0;
        String folderPath = null;
        InputStream iss = null;
        String doc_ref = "";
        String status;

        String docCodeVal = "";
        String entryDate = "";
        U.log("table name==>" + imgTableName);
        String[] tablearr = imgTableName.split("~");
        try {
//            U.log("imgJson--->" + imgJson);
            String[] colSlnoArr = null;
            JSONArray jsonArray = new JSONArray();

            String entityCode = "";
            jsonArray = (JSONArray) mainJson.get("recordsInfo");
            int jsonArrLength = jsonArray.size();

            JSONObject jsobj = (JSONObject) jsonArray.get(0);
            if (tablearr.length > 1) {
                refColName = tablearr[1];
            }

            if (jsobj.containsKey(tablearr[1])) {
                doc_ref = (String) jsobj.get(tablearr[1]);
                docCode = doc_ref;
            } else {
                doc_ref = (String) jsobj.get("DOC_REF");

            }
            entryDate = (String) jsobj.get("ON_DATE");

            String user_code = (String) jsobj.get("USER_CODE");
            String desc[] = new String[5];
            desc[0] = (String) jsobj.get("REMARK");
            if (imgJson.get("file") != null && imgJson.get("file").toString().length() > 3) {
                try {
                    String refKey = "select LHSSYS_REF_KEY.NEXTVAL ref_key from dual";
                    ps = connection.prepareStatement(refKey);
                    rs = ps.executeQuery();
                    if (rs != null && rs.next()) {
                        do {
                            if (rs.getString(1) != null && !rs.getString(1).isEmpty()) {
                                refKeyVal = rs.getString(1);
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
                try {
                    String refKey = "select LHSSYS_DOC_CODE.NEXTVAL from dual";
                    ps = connection.prepareStatement(refKey);
                    rs = ps.executeQuery();
                    if (rs != null && rs.next()) {
                        do {
                            if (rs.getString(1) != null && !rs.getString(1).isEmpty()) {
                                docCodeVal = rs.getString(1);
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

                try {
                    String ref_key_val = imgJson.get("ref_key_type").toString();

                    if (ref_key_val.contains("#")) {

                        String[] ref_key_values = ref_key_val.split("#");
                        String ref_key_type = ref_key_values[0].trim();
                        String ref_mast_pkey = ref_key_values[1];
//                        String ref_mast_code = ref_key_values[2];
                        String refKeyQuery = "insert into lhssys_ref_key_tran  (ref_key,ref_for,ref_key_type,ref_table_name,ref_master_pkey,ref_master_code,lastupdate,flag) values(?,?,?,?,?,?,sysdate,'')";

                        ps = connection.prepareStatement(refKeyQuery);

                        ps.setString(1, refKeyVal);
                        ps.setString(2, "M");
                        ps.setString(3, ref_key_type);
                        ps.setString(4, table_name);
                        ps.setString(5, ref_mast_pkey);
                        ps.setString(6, jsobj.get(ref_mast_pkey).toString());
//                        ps.setString(7, (String) jsobj.get("ENTITY_CODE") != null ? (String) jsobj.get("ENTITY_CODE") : "");
//                        ps.setString(8, (String) jsobj.get("TCODE") != null ? (String) jsobj.get("TCODE") : "");
//                        ps.setString(9, (String) jsobj.get("VRNO") != null ? (String) jsobj.get("VRNO") : "");
                    } else if (ref_key_val.contains("B")) {

                        String refKeyQuery = "insert into lhssys_ref_key_tran  (ref_key,ref_for,ref_key_type,ref_table_name,ref_entity_code,ref_tcode,ref_vrno,ref_slno,lastupdate,flag) values(?,?,?,?,?,?,?,?,sysdate,'')";
                        String ref_key_type = imgJson.get("ref_key_type").toString().trim();
                        ps = connection.prepareStatement(refKeyQuery);

                        ps.setString(1, refKeyVal);
                        ps.setString(2, "D");
                        ps.setString(3, ref_key_type);
                        ps.setString(4, table_name);
//                        ps.setString(5, user_code);
//                        ps.setString(6, refColName);
                        ps.setString(5, (String) jsobj.get("ENTITY_CODE") != null ? (String) jsobj.get("ENTITY_CODE") : "");
                        ps.setString(6, (String) jsobj.get("TCODE") != null ? (String) jsobj.get("TCODE") : "");
                        ps.setString(7, (String) jsobj.get("VRNO") != null ? (String) jsobj.get("VRNO") : "");
                        U.log("slno===>" + jsobj.get("SLNO").toString());
                        ps.setInt(8, jsobj.get("SLNO") != null ? Integer.parseInt(jsobj.get("SLNO").toString()) : null);
                    } else {

                        String refKeyQuery = "insert into lhssys_ref_key_tran  (ref_key,ref_for,ref_key_type,ref_table_name,ref_entity_code,ref_tcode,ref_vrno,ref_slno,lastupdate,flag) values(?,?,?,?,?,?,?,null,sysdate,'')";
                        String ref_key_type = imgJson.get("ref_key_type").toString().trim();
                        ps = connection.prepareStatement(refKeyQuery);

                        ps.setString(1, refKeyVal);
                        ps.setString(2, "D");
                        ps.setString(3, ref_key_type);
                        ps.setString(4, table_name);
//                        ps.setString(5, user_code);
//                        ps.setString(6, refColName);
                        ps.setString(5, (String) jsobj.get("ENTITY_CODE") != null ? (String) jsobj.get("ENTITY_CODE") : "");
                        ps.setString(6, (String) jsobj.get("TCODE") != null ? (String) jsobj.get("TCODE") : "");
                        ps.setString(7, (String) jsobj.get("VRNO") != null ? (String) jsobj.get("VRNO") : "");
                    }
                    int ii = 0;
                    ii = ps.executeUpdate();
                    if (ii > 0) {
                        status = "insert data";
                        docSLNO++;
                    } else {
                        status = "IMAGE NOT INSERTED";
                    }
                    U.log("IMAGE INSERT STATUS : " + status);
                } catch (Exception e) {
//                    U.errorLog("exeception 14---> " + e.getMessage());
                    e.printStackTrace();
                    status = "IMAGE NOT INSERTED";
                }
//            finally {
//                if (ps != null) {
//                    try {
//                        ps.close();
//                    } catch (SQLException ex) {
//                        status = "IMAGE NOT INSERTED";
//                    }
//                }
//            }
                try {
//(String) jsobj.get("ON_DATE")
                    String docMastQuery = "insert into doc_mast (doc_code,doc_name,doc_date,flag,user_code,lastupdate,doc_type,doc_detail,ref_key,key_code,key_mast) "
                            + "values('" + docCodeVal + "','Image'," + "to_date(sysdate,'dd-MM-yyyy HH24:MI:SS'),'','" + user_code + "',sysdate,'COMP',''," + refKeyVal + ",'','')";
                    U.log("docMastQuery==>" + docMastQuery);
                    ps = connection.prepareStatement(docMastQuery);

                    int ii = 0;
                    ii = ps.executeUpdate();
                    if (ii > 0) {
                        status = "insert data";
                        docSLNO++;
                    } else {
                        status = "IMAGE NOT INSERTED";
                    }
                    U.log("IMAGE INSERT STATUS : " + status);
                } catch (Exception e) {
                    e.printStackTrace();
//                    U.errorLog("exeception 14---> " + e.getMessage());
                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (SQLException ex) {
                            status = "IMAGE NOT INSERTED";
                        }
                    }
                }
                try {
                    String docTranQuery = "insert into doc_tran(doc_code,doc_slno,doc_desc,file_path,file_name,review_date,file_code,user_code,lastupdate,review_by,file_date,physical_file_flag,doc_expiry_date,entity_code,entry_date) "
                            + "values('" + docCodeVal + "',(SELECT count(doc_slno)+1 from doc_tran where doc_code='" + docCodeVal + "'),'" + (String) imgJson.get("desc") + "','','" + (String) imgJson.get("fileName") + "'," + "to_date('" + (String) imgJson.get("imageTime") + "','dd-MM-yyyy HH24:MI:SS'),'',''," + "to_date('" + (String) imgJson.get("imageTime") + "','dd-MM-yyyy HH24:MI:SS'),'','','" + entityCode + "'," + "to_date(SYSDATE,'dd-MM-yyyy HH24:MI:SS'),'','')";
                    U.log("docTranQuery==>" + docTranQuery);
                    ps = connection.prepareStatement(docTranQuery);
                    int ii = 0;
                    ii = ps.executeUpdate();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (SQLException ex) {
                            status = "IMAGE NOT INSERTED";
                        }
                    }
                }

                String base64Img = imgJson.get("file").toString();
                byte[] imageByts = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
                iss = new ByteArrayInputStream(imageByts);

                BufferedImage buffImage = null;
                String folderPathReplaced = "";
                folderPathReplaced = folderPath;
                String sqlDocumentInsert = "";
                try {
                    String docTranImgQuery = "insert into doc_tran_image(doc_code,doc_slno,doc_image,file_id,entry_date,entity_code)"
                            + " values(?,(select count(doc_slno)+1 from doc_tran_image where doc_code='" + docCodeVal + "'),?,'',to_date('" + (String) imgJson.get("imageTime") + "','dd-MM-yyyy HH24:MI:SS'),'" + (String) jsobj.get("ENTITY_CODE") + "')";
                    U.log("docTranImgQuery==>" + docTranImgQuery);
                    ps = connection.prepareStatement(docTranImgQuery);
                    ps.setString(1, docCodeVal);
                    ps.setBinaryStream(2, iss, iss.available());
                    int ii = 0;
                    ii = ps.executeUpdate();

                } catch (Exception e) {
//                    U.errorLog("exeception 14---> " + e.getMessage());
                    e.printStackTrace();
                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (SQLException ex) {

                        }
                    }
                }

                if (folderPath != null) {
                    //C:\\SSELERP_IMAGES\\'ENTRY_TYPE'\\'ENTRY_VRNO'\\'DOC_NAME'_'SLNO'.jpg
                    folderPathReplaced = folderPathReplaced.replaceAll("'ENTRY_TYPE'", jsobj.get("ENTRY_TYPE").toString())
                            .replaceAll("'ENTRY_VRNO'", jsobj.get("ENTRY_VRNO").toString())
                            .replaceAll("'DOC_NAME'", jsobj.get("DOC_NAME").toString())
                            .replaceAll("'SLNO'", String.valueOf(docSLNO));
                    buffImage = ImageIO.read(iss);
                    File file = new File(folderPathReplaced);
                    file.getParentFile().mkdirs();
                    ImageIO.write(buffImage, "jpg", file);
                    status = "insert data";
                } else {
                    status = insertDocument(imgJson.get("fileName").toString(), user_code.toString(), desc[0].toString(), docCode, iss, docSLNO);

//                insertDocument(obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
//                                    obj1.get("sysFileName").toString(), is, Float.parseFloat(imgfileID.get(fileId)));
                }
            }
//            }

        } catch (Exception e) {
//            U.errorLog("exeception 15---> " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException ex) {
                    status = "IMAGE NOT INSERTED";
                }
            }
        }
        return refKeyVal;
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
    int setdata = 0;

    public void parseJson(JSONObject jsonObject) throws ParseException, SQLException {
        Set<Object> set = jsonObject.keySet();
        Iterator<Object> iterator = set.iterator();
        while (iterator.hasNext()) {
            Object obj = iterator.next();

            if (obj.toString() != null || obj.toString() != "") {
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
                            U.log("2222==" + e);
                        }
                    }
                    if (obj.toString().toLowerCase().contains("col2") || obj.toString().toUpperCase().contains("USER_CODE")) {
                        USER_CODE = jsonObject.get(obj).toString();
                        defultValue.put("USER_CODE", "'" + USER_CODE + "'");
                    }

                    boolean colStatus = true;
                    System.out.println("columnStatus.get(obj)--> " + columnStatus.get(obj));
                    if (columnStatus.get(obj) != null && !columnStatus.get(obj).isEmpty()) {
                        if (columnStatus.get(obj).equalsIgnoreCase("D") || columnStatus.get(obj).equalsIgnoreCase("F")) {
                            colStatus = false;
                        } else {
                            colStatus = true;
                        }
                    } else {
                        colStatus = false;
                    }

                    if (!obj.toString().contains("imageTime") && !obj.toString().contains("video")
                            && !obj.toString().contains("file") && !obj.toString().contains("fileName")
                            && !obj.toString().contains("desc") && !obj.toString().contains("sysFileName")) {
                        if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES") && colStatus) {
                            colName.append(obj.toString()).append(",");
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
                            defultValue.put(obj.toString(), "sysdate");
                        }
                        String VRDATEFORMAT_SQL = "SELECT V.VRDATEFORMAT, V.CHQDATE FROM VIEW_DEFAULT_USER_LINKS V";
                        String VRDATEFORMAT = "";
                        String CHQDATEFORMAT = "";
                        try {
                            ps = connection.prepareStatement(VRDATEFORMAT_SQL);
                            rs = ps.executeQuery();
                            if (rs != null && rs.next()) {
                                do {
                                    VRDATEFORMAT = rs.getString(1);
                                    CHQDATEFORMAT = rs.getString(2);
                                } while (rs.next());
                            }
                        } catch (Exception e) {
                        } finally {
                            ps.close();
                            rs.close();
                        }
                        if (obj.toString().contains("VRDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                        }
                        if (obj.toString().contains("CHQDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                        }
                        if (obj.toString().contains("CREATEDDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                        }
                        if (obj.toString().contains("LASTUPDATE")) {
                            columnValue = "sysdate";
                        }
                        if (obj.toString().contains("TASK_DATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                            System.out.println("TASK_DATE -------------> " + columnValue);
                        }
                        if (obj.toString().contains("AMENDDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                            System.out.println("TASK_DATE -------------> " + columnValue);
                        }
                        if (obj.toString().contains("ENTRY_DATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                            System.out.println("ENTRY_DATE -------------> " + columnValue);
                        }

                        if (obj.toString().contains("FROM_DATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                            System.out.println("ENTRY_DATE -------------> " + columnValue);
                        }

                        if (obj.toString().contains("ITEM_CODE")) {
                            itemCode = columnValue;
                            System.out.println("itemCode : " + itemCode);
                        }

                        if (obj.toString().contains("ITEM_CATG")) {
                            String itemCatgSQL = "SELECT ITEM_CATG FROM ITEM_MAST WHERE ITEM_CODE = '" + itemCode + "'";
                            System.out.println("itemCatgSQL : " + itemCatgSQL);
                            try {
                                ps = connection.prepareStatement(itemCatgSQL);
                                rs = ps.executeQuery();
                                if (rs != null && rs.next()) {
                                    do {
                                        columnValue = rs.getString(1);
                                    } while (rs.next());
                                }
                            } catch (Exception e) {
                            } finally {
                                ps.close();
                                rs.close();
                            }
                        }
                        if (obj.toString().contains("APPROVEDDATE")) {
                            columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                        }

                        if (obj.toString().equals("VRNO") && !(jsonObject.get(obj) != null && !jsonObject.get(obj).toString().isEmpty())) {
                            if (table_name.equals("SS_TRAN")) {
                                columnValue = SS_TRAN_VRNO;
                                generatedProdVRNO = SS_TRAN_VRNO;
                            } else {
                                generatedProdVRNO = columnValue;
                                System.out.println("VRNO : " + columnValue);
                            }
                        }

                        if (obj.toString().contains("SEQ_ID")) {
                            columnValue = seq_id + "";
                        }
                        if (f.isImg(obj.toString())) {
                            columnValue = seq_id * (-1) + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                        }
                        if (f.isVrno(obj.toString()) && flag.contains("off")) {
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
                                        U.log("ee" + e);
                                    } finally {
                                        procCall.close();
                                        stmt.close();
                                        ds.close();
                                        rs1.close();
                                    }
                                }
                            }
                        }
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
                        if (colStatus) {
                            if (columnValue != null && !columnValue.isEmpty()) {
                                if (columnValue.contains("to_date")) {
                                    if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                                        colValue.append(columnValue).append(", ");
                                        System.out.println(obj.toString() + " ---> " + columnValue);
                                    }
                                } else {
                                    if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                                        colValue.append("'").append(columnValue).append("',");
                                        System.out.println(obj.toString() + " ---> '" + columnValue + "'");
                                    }
                                }
                            } else {
                                colValue.append("'', ");
                                System.out.println(obj.toString() + " ---> ''");
                            }
                        } else {
                            System.out.println(obj.toString() + " colStatus---> ''");
                        }
                    } else {
                        imgJSON.put(obj.toString(), jsonObject.get(obj));
                    }
                }
            }

        }
    }

    public void getColumnDetails(String seq_No) {
        String sql = "select column_name, status,table_name,column_type,column_default_value from lhssys_portal_data_dsc_update where seq_no = " + seq_no;
        System.out.println("getColumnDetails--> " + sql);
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    columnStatus.put(rs.getString("column_name"), rs.getString("status"));
                    columnType.put(rs.getString("column_name"), rs.getString("column_type"));
                    columnTableName.put(rs.getString("column_name"), rs.getString("table_name"));
                    columnDefaultValue.put(rs.getString("column_name"), rs.getString("column_default_value"));
                    table_name = rs.getString("table_name");
                } while (rs.next());
            }
        } catch (Exception e) {
            System.out.println("exeception in getTaskByDate ---> " + e.getMessage());
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
            System.out.println("INSERT DOC/IMG SQL : " + sqlDocumentInsert);
            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setFloat(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());
            pst.execute();
            status = "add entry";
            System.out.println("Result : " + status);
        } catch (Exception e) {
            U.log("FILE UPDATE ERROR : " + e);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException ex) {
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
                    + "USER_CODE,FLAG,SYSTEM_FILE_NAME,STORE_FILE) values \n"
                    + "(?,?,sysdate,sysdate,?,?,'h',?,?)";
            System.out.println("INSERT VIDEO SQL : " + sqlDocumentInsert);
            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setFloat(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());
            status = pst.executeUpdate();
        } catch (IOException e) {
            U.log("FILE UPDATE ERROR===" + e);
        } catch (SQLException e) {
            U.log("FILE UPDATE ERROR===" + e);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException ex) {
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
            String selectQry = "select max(seq_id) from " + tablename;
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
            System.out.println("exeception ---> " + e.getMessage());
        } finally {
            rs1.close();
            ps1.close();
        }
        ListMultimap<String, String> map = FileClass.map;
    }

    public InputStream writeOnImage(String image, String imgdate) {
        InputStream iss = null;
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
            Date date = formatter.parse(imgdate);
            String base64Img = image;//.split(",")[1];
            byte[] imgBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
            iss = new ByteArrayInputStream(imgBytes);
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
        } catch (IOException e) {
            System.out.println("exeception ---> " + e.getMessage());
        } catch (java.text.ParseException e) {
            System.out.println("exeception ---> " + e.getMessage());
        }
        return iss;
    }
}
