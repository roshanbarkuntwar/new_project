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
    
    String PDSE_VRNO;
    String ProdVRNO;
    String base64Image;
    byte[] imageBytes;
    String[] imageTime;
    InputStream is;
    String table_name;
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
    
    HashMap<String, String> columnStatus = new HashMap<String, String>();
    HashMap<String, String> columnType = new HashMap<String, String>();
    HashMap<String, String> columnTableName = new HashMap<String, String>();
    HashMap<String, String> columnDefaultValue = new HashMap<String, String>();
    
    String USER_CODE;
    LoggerWrite log = new LoggerWrite();
    HashMap<String, String> displayColList = new HashMap<String, String>();
    String seq_no;
    
    String isAddonTempEntry = null;
    String refColName = "";
    String refKeyVal = "";

    //Logger LOGGER=log.getLog();
    public JDBCAddEntryDyanamicallyDAO(Connection connection) {
        this.connection = connection;
        U u = new U(this.connection);
    }
    
    public void getDetailOfColumns() {
        PreparedStatement ps = null;
        ResultSet rs;
        PreparedStatement ps1 = null;
        ResultSet rs1;
        StringBuilder sql = new StringBuilder();
        
        sql.append("select u.* from lhssys_portal_data_dsc_update u where ");
        sql.append("seq_no = ").append(seq_no).append(" and status != 'F' ").append(" order by slno");
        
        U.log("SQL TO FETCH lhssys_portal_data_dsc_update for SEQ_NO : " + seq_no + " : " + sql.toString());
        try {
            ps = connection.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    table_name = rs.getString("table_name");
                    
                    if (isAddonTempEntry != null) {
                        table_name = isAddonTempEntry;
                    }
                    if (rs.getString("column_desc").equals("Invite Employee")) {
                        multipleEntryFlag = true;
                        replicateColumn = rs.getString("column_name");
                    }
                    if (rs.getString("status") != null && !rs.getString("status").contains("F")) {
//                        U.log(rs.getString("column_name"));
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
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
    String sysdate = "";
    String userEnteredDate = "";
    
    public FileUploadStatus addEntry(String jsonString, String isAddonTempEntry) throws ParseException, Exception {
        U.log("FIleUploadStatus");
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        String returnREsult = "insert data";
        String procedureOfUpadte = "";
        String procedureOfInsert = "";
        String procedureOfInsertNew = "";
        PreparedStatement ps1 = null;
        ResultSet rs1 = null;
        this.isAddonTempEntry = isAddonTempEntry;
        
        try {
            
            JSONArray jsonArray = new JSONArray();
            JSONParser json_parser = new JSONParser();
            JSONObject json = (JSONObject) json_parser.parse(jsonString);
            jsonArray = (JSONArray) json.get("recordsInfo");
//            U.log("jsonArray :" + jsonArray);
            int jsonArrLength = jsonArray.size();
            U.log("json length in addEntry :  " + jsonArrLength);
            for (int i = 0; i < 1; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);
                seq_no = obj1.get("DYNAMIC_TABLE_SEQ_ID") + "";
            }
//            U.log("dynamic_table_seq_id : " + seq_no);
            getColumnDetails(seq_no);
            try {
                for (int i = 1; i < jsonArrLength; i++) {
                    JSONObject obj1 = (JSONObject) jsonArray.get(i);
                    String imgColumnTableName = columnTableName.get(obj1.get("fileId"));
                    if (imgColumnTableName.contains("LHSSYS_PORTAL_APP_TRAN")) {
                        
                        if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
                            for (String key : imgfileID.keySet()) {
                                U.log(key + " " + imgfileID.get(key));
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
                    } else if (imgColumnTableName.contains("DOC_TRAN")) {
                        refKeyVal = insertImageIntoDocTran(imgColumnTableName, obj1, json);
                    } else {
                        insertImageIntoOtherTable(imgColumnTableName, obj1, json);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            
            Object obj = json_parser.parse(json.toString());
            JSONObject json_obj = new JSONObject();
            json_obj = (JSONObject) obj;
            json_obj.get("recordsInfo");
            Set<Object> set = json_obj.keySet();
            Iterator<Object> iterator = set.iterator();
            while (iterator.hasNext()) {
                Object obj1 = iterator.next();
                String columnValue = "";
                try {
                    columnValue = json_obj.get(obj1).toString();
                    U.log("column value" + columnValue);
                } catch (Exception e) {
                    U.errorLog("Exception in Json Column value");
                    if (f.isNumber(obj.toString())) {
                        columnValue = null;
                    } else {
                        columnValue = "";
                    }
                }
                U.log("isAddonTempEntry==>>>>" + isAddonTempEntry);
                if (obj1.toString().equals("VRNO") && columnValue.isEmpty() && isAddonTempEntry == null) {
                    String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE \n"
                            + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )\n"
                            + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
                    U.log("getAccYearSQL :::: " + getAccYearSQL);
                    
                    
                    String currentAccYear = "";
                    
                    String prodVRNO_SQL = getReplacedprodVRNO_SQL(json_obj);
                    U.log("ReplacedprodVRNO_SQL : " + prodVRNO_SQL);
                    
                    try {
                        ps1 = connection.prepareStatement(getAccYearSQL);
                        rs1 = ps1.executeQuery();
                        if (rs1 != null && rs1.next()) {
                            currentAccYear = rs1.getString(1);
                            U.log("currentAccYear : " + currentAccYear);
                            if (!currentAccYear.isEmpty()) {
                                prodVRNO_SQL = prodVRNO_SQL.replaceAll("ACC_YEAR", currentAccYear);
                            } else {
                                U.log("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                            }
                        } else {
                            U.log("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
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
                    U.log("getProdVRNO_SQL : " + getProdVRNO_SQL);
                    U.log("appendProdVRNO_SQL : " + appendProdVRNO_SQL);
                    
                    try {
                        ps1 = connection.prepareStatement(getProdVRNO_SQL);
                        rs1 = ps1.executeQuery();
                        if (rs1 != null && rs1.next()) {
                            generatedProdVRNO = rs1.getString(1);
                            U.log("generatedProdVRNO : " + generatedProdVRNO);
                            columnValue = generatedProdVRNO;
                            if (!generatedProdVRNO.isEmpty()) {
                                appendProdVRNO_SQL = appendProdVRNO_SQL.replaceAll("GEN_VRNO", generatedProdVRNO);
                                U.log("appendProdVRNO_SQL with VRNO: " + appendProdVRNO_SQL);
                                try {
                                    ps1 = connection.prepareStatement(appendProdVRNO_SQL);
                                    ps1.executeUpdate();
                                } catch (SQLException e) {
                                    U.log("appendProdVRNO_SQL NOT EXECUTED PROPERLY : " + appendProdVRNO_SQL);
                                }
                            } else {
                                U.log("getProdVRNO_SQL NOT EXECUTED PROPERLY : " + getProdVRNO_SQL);
                            }
                        } else {
                            U.log("getProdVRNO_SQL NOT EXECUTED PROPERLY : " + getProdVRNO_SQL);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        if (ps1 != null) {
                            try {
                                ps1.close();
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    }
                    U.log("SERIES : " + columnValue + "\n prodVRNO_SQL : " + prodVRNO_SQL);
                } else {
                    U.log("ELSE VRNO SECTION==================");
                }
            }
            
            String executeAfterSQL = "select execute_after_update, EXECUTE_AFTER_INSERT from lhssys_portal_table_dsc_update where seq_no = " + seq_no;
            
            U.log("GET EXECUTE_AFTER_UPDATE, EXECUTE_AFTER_INSERT SQL : " + executeAfterSQL);
            
            ps1 = connection.prepareStatement(executeAfterSQL);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                procedureOfUpadte = rs1.getString(1);
                procedureOfInsert = rs1.getString(2);
                procedureOfInsertNew = rs1.getString(2);
                U.log(" execute_after_update procedure : " + procedureOfUpadte);
                U.log(" EXECUTE_AFTER_INSERT procedure : " + procedureOfInsert);
            }
            if (procedureOfInsert != null && procedureOfInsert.length() > 2) {
                ps1 = connection.prepareStatement("select TO_CHAR(SYSDATE, 'DD-MM-YYYY  HH24:MI:SS') as systemdate from dual");
                rs1 = ps1.executeQuery();
                if (rs1 != null && rs1.next()) {
                    sysdate = rs1.getString(1);
                }
                U.log("System Date : " + sysdate);
                
                JSONArray jsonArray1 = new JSONArray();
                JSONParser json_parser1 = new JSONParser();
                JSONObject json1 = (JSONObject) json_parser1.parse(jsonString);
                jsonArray1 = (JSONArray) json1.get("recordsInfo");
                U.log("jsonArray1 :" + jsonArray1);
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
                        U.log("FINAL REPLACED VALUE procedureOfInsert : " + procedureOfInsert);
                        ps1 = connection.prepareStatement(procedureOfInsert);
                        int n = ps1.executeUpdate();
                        if (n >= 0) {
                            String result = n + " row inserted.";
                            procedureOfInsert = procedureOfInsertNew;
                            fileUploadStatus.setStatus(returnREsult);
                            U.log(" execute_after_insert result : " + result);
                        } else {
                            String result = n + " row updated";
                            procedureOfInsert = procedureOfInsertNew;
                            fileUploadStatus.setStatus(result);
                            U.log(" execute_after_insert result : " + result);
                        }
                    } catch (SQLException e) {
                        U.errorLog(e);
                        
                        fileUploadStatus.setStatus("Error occoured due to some internal reason.");
                    }
                }
//                }
            } else {
                
                if (isAddonTempEntry != null) {
                    table_name = isAddonTempEntry;
                    
                }
                fileUploadStatus = addInsertEntry(jsonString);
                
            }
        } catch (SQLException e) {
            U.errorLog(e);
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
    
    private void insertImageIntoOtherTable(String imgColumnTableName, JSONObject imgJson, JSONObject mainJson) {
        JSONArray jsonArray = new JSONArray();
        String[] tablearr = imgColumnTableName.split("~");
        String colName = "";
        String colVal = "";
        jsonArray = (JSONArray) mainJson.get("recordsInfo");
        InputStream iss = null;
        JSONObject jsobj = (JSONObject) jsonArray.get(0);
        for (int i = 2; i < tablearr.length; i++) {
            colName = colName + "," + tablearr[i];
            colVal = colVal + ", '" + (String) jsobj.get(tablearr[i]) + "'";
        }
        if (imgJson.get("file") != null && imgJson.get("file").toString().length() > 3) {
            String base64Img = imgJson.get("file").toString();
            byte[] imageByts = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
            iss = new ByteArrayInputStream(imageByts);
            
            PreparedStatement pst = null;
            String sqlDocumentInsert = "";
            String status;
            try {
                sqlDocumentInsert = "insert into " + tablearr[0] + "(" + tablearr[1] + colName + ",lastupdate ) values ( ? " + colVal + ",sysdate)";
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
    
    public String insertImageIntoDocTran(String tableName, JSONObject imgJson, JSONObject mainJson) {
        
        PreparedStatement ps = null;
        ResultSet rs = null;
        String docCode = "";
        int docSLNO = 0;
        String folderPath = null;
        InputStream iss = null;
        String doc_ref = "";
        String status;
        String refKeyVal = "";
        String docCodeVal = "";
        String entryDate = "";
        String[] tablearr = tableName.split("~");
        try {
            
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
                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (SQLException e) {
                        }
                    }
                }
                
                try {
                    
                    String refKeyQuery = "insert into lhssys_ref_key_tran  (ref_key,ref_for,ref_key_type,ref_table_name,ref_master_pkey,ref_master_code,ref_entity_code,ref_tcode,ref_vrno,ref_slno,lastupdate,flag) values(?,?,?,?,?,?,?,?,?,null,sysdate,'')";
                    
                    ps = connection.prepareStatement(refKeyQuery);
                    
                    ps.setString(1, refKeyVal);
                    ps.setString(2, "D");
                    ps.setString(3, "B");
                    ps.setString(4, tableName);
                    ps.setString(5, user_code);
                    ps.setString(6, refColName);
                    ps.setString(7, (String) jsobj.get("ENTITY_CODE") != null ? (String) jsobj.get("ENTITY_CODE") : "");
                    ps.setString(8, (String) jsobj.get("TCODE") != null ? (String) jsobj.get("TCODE") : "");
                    ps.setString(9, (String) jsobj.get("VRNO") != null ? (String) jsobj.get("VRNO") : "");
                    
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
                    U.errorLog("exeception 14---> " + e.getMessage());
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
                    
                    String docMastQuery = "insert into doc_mast (doc_code,doc_name,doc_date,flag,user_code,lastupdate,doc_type,doc_detail,ref_key,key_code,key_mast) "
                            + "values('" + docCodeVal + "','Image'," + "to_date('" + (String) jsobj.get("ON_DATE") + "','dd-MM-yyyy HH24:MI:SS'),'','" + user_code + "',sysdate,'COMP',''," + refKeyVal + ",'','')";
                    
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
                    U.errorLog("exeception 14---> " + e.getMessage());
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
                            + "values('" + docCodeVal + "',(SELECT count(doc_slno)+1 from doc_tran where doc_code='" + docCodeVal + "'),'" + (String) imgJson.get("desc") + "','','" + (String) imgJson.get("fileName") + "'," + "to_date('" + (String) imgJson.get("imageTime") + "','dd-MM-yyyy HH24:MI:SS'),'',''," + "to_date('" + (String) imgJson.get("imageTime") + "','dd-MM-yyyy HH24:MI:SS'),'','','" + entityCode + "'," + "to_date('" + entryDate + "','dd-MM-yyyy HH24:MI:SS'),'','')";
                    ps = connection.prepareStatement(docTranQuery);
                    int ii = 0;
                    ii = ps.executeUpdate();
                } catch (Exception e) {
                    
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
                    ps = connection.prepareStatement(docTranImgQuery);
                    ps.setString(1, docCodeVal);
                    ps.setBinaryStream(2, iss, iss.available());
                    int ii = 0;
                    ii = ps.executeUpdate();
                    
                } catch (Exception e) {
                    U.errorLog("exeception 14---> " + e.getMessage());
                    
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
            U.errorLog("exeception 15---> " + e.getMessage());
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
    
    public FileUploadStatus addInsertEntry(String jsonString) throws ParseException, Exception {
        U.log("Hello");
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
            e.printStackTrace();
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    e.printStackTrace();
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
//        U.log("json length : " + jsonArrLength);

        for (int i = 0; i < 1; i++) {
            JSONObject obj1 = (JSONObject) jsonArray.get(i);
//            U.log("Obj1 :" + obj1);
            seq_no = obj1.get("DYNAMIC_TABLE_SEQ_ID") + "";
            
            if (obj1.containsKey(refColName)) {
                obj1.replace(refColName, Integer.parseInt(refKeyVal));
            }
        }
        
        getDetailOfColumns();
        
        if (isAddonTempEntry != null) {
            table_name = isAddonTempEntry;
        }
        
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
            U.log(key + " " + imgfileID.get(key));
        }

        //append nonn display column
        for (Map.Entry m : nondisplayColList.entrySet()) {
            if (m.getValue() != null) {
//                U.log("::::" + m.getKey() + " " + m.getValue().toString().replace("'", "") + "\n" + defultValue.get("LASTUPDATE"));
                String predefinedVal = defultValue.get(m.getKey());
                if (predefinedVal == null) {
                    predefinedVal = m.getValue().toString();
                }
                if (m.getKey().toString().contains("LASTUPDATE")) {
                    predefinedVal = "to_date('" + sysdate + "','dd-MM-yyyy HH24:MI:SS')";
                }
                colName.append(m.getKey()).append(",");
                colValue.append(predefinedVal).append(",");
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
                    U.log(key + " " + imgfileID.get(key));
                    String replaceKey = imgfileID.get(key).replaceAll("(\\d+)(.\\d+)", seq_id + "\\.$2");
                    U.log("replaceKey : " + replaceKey);
                    imgfileID.put(key, replaceKey);
                }
            }
            
            if (isAddonTempEntry != null) {
                colName.append("seq_id,");
                colValue.append(seq_id + ",");
            }
            
            String columnName = colName.toString().substring(0, colName.toString().lastIndexOf(","));
            String columnValue = colValue.toString().substring(0, colValue.toString().lastIndexOf(","));
            
            if (USER_CODE != null) {
                columnValue = columnValue.replace(priviousUserCode, currentUserCode);
            }
            columnValue = columnValue.replace(String.valueOf(priviousSeqId), String.valueOf(seq_id));
            //            U.log("COLUMN NAME : " + colName + "\n    COLUMN VALUES : " + columnValue + "\n  IMAGE DATA : " + imgJSON.toString());

            if (isAddonTempEntry != null) {
                table_name = isAddonTempEntry;
            }
            stringBuffer = new StringBuffer();
            stringBuffer.append("Insert into " + table_name + "\n" + "     (" + columnName + ") values(" + columnValue + ")");
            try {
                ps = connection.prepareStatement(stringBuffer.toString());
                U.log("SYSDATE : " + sysdate + " NEW ENTRY INSERT QUERY :  " + stringBuffer.toString());
                ps.execute();
                String result = "insert data";
                fileUploadStatus.setStatus(result);
                fileUploadStatus.setVRNO(generatedProdVRNO);
                fileUploadStatus.setSeq_id(String.valueOf(seq_id));
                U.log("result==" + result);
                //------ For VRNO or code generated by Trigger in INSERT QUERY--------//
                PreparedStatement psz = connection.prepareStatement("SELECT LHS_CRM.GET_NEW_CODE FROM DUAL");
                ResultSet rsz = psz.executeQuery();
                String newVal = "";
                if (rsz.next()) {
                    newVal = rsz.getString(1);
                }
                U.log("New Val = " + newVal);
                
                fileUploadStatus.setRetailerCode(newVal);

//               if(generatedProdVRNO == ""){
//                   fileUploadStatus.setVRNO(newVal);
//               }
                //------ For VRNO or code generated by Trigger in INSERT QUERY--------//
            } catch (Exception e) {
                U.errorLog(e);
                U.errorLog("ADD ENTRY EXCEPTION  : " + e);
                fileUploadStatus.setStatus("Something went wrong, please try again...");
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (Exception e) {
                        e.printStackTrace();
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
        U.log("INSIDE getReplacedprodVRNO_SQL.....");
        Set<Object> set = jsonObject.keySet();
        Iterator<Object> iterator = set.iterator();
        String prodVRNO_SQL
                = "DECLARE\n"
                + "  v_out VARCHAR2(50);\n"
                + "BEGIN\n"
                + "  v_out := GET_VRNO('SERIES', to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy'), 'PAD',\n"
                + "                'ENTITY_CODE', 'DIV_CODE','ACC_YEAR','TCODE') ;\n"
                + "  DBMS_OUTPUT.put_line(v_out || SQLERRM);\n"
                + "  RAISE_APPLICATION_ERROR(-20000, v_out);\n"
                + "  return;\n"
                + "END;"
                + "~"
                + "BEGIN\n"
                + "  APPEND_VRNO('GEN_VRNO', 'ENTITY_CODE', 'DIV_CODE', 'ACC_YEAR', 'TCODE');\n"
                + "END;";
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
                        U.log("ENTITY_CODE : " + columnValue);
                        if (columnValue.equals("VE")) {
                            prodVRNO_SQL = prodVRNO_SQL.replaceAll("'DIV_CODE'", "NULL");
                            prodVRNO_SQL = prodVRNO_SQL.replaceAll("'PAD'", "3");
                            U.log("divCode VE : NULL");
                        }
                        if (columnValue.equals("JS") || columnValue.equals("MP")) {
                            prodVRNO_SQL = prodVRNO_SQL.replaceAll("'DIV_CODE'", "NULL");
                            prodVRNO_SQL = prodVRNO_SQL.replaceAll("'PAD'", "5");
                        } else {
                            prodVRNO_SQL = prodVRNO_SQL.replaceAll("'PAD'", "5");
                        }
//                          prodVRNO_SQL = prodVRNO_SQL.replaceAll("SERIES", columnValue);
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

        U.log("prodVRNO_SQL ----------->" + prodVRNO_SQL);

        return prodVRNO_SQL;
    }
    
    public void parseJson(JSONObject jsonObject) throws ParseException {
        PreparedStatement ps = null;
        ResultSet rs = null;
        U.log("parse jsonObject :" + jsonObject);
        Set<Object> set = jsonObject.keySet();
        Iterator<Object> iterator = set.iterator();
        while (iterator.hasNext()) {
            Object obj = iterator.next();
            if (jsonObject.get(obj) instanceof JSONArray) {
                U.log("inside jsonObject 1");
                getArray(jsonObject.get(obj));
            } else if (jsonObject.get(obj) instanceof JSONObject) {
//                U.log("inside jsonObject2");
                parseJson((JSONObject) jsonObject.get(obj));
            } else {

//                U.log("Else condition ");
                if (setdata == 0) {
                    try {
                        setdata++;
                        setDatatype(seq_no);
                    } catch (Exception e) {
                        U.errorLog(e);
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
                            colName.append(obj.toString() + ",");
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
//                            U.log("obj in last update :"+obj.toString());
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
                            e.printStackTrace();
                        } finally {
                            if (ps != null) {
                                try {
                                    ps.close();
                                    rs.close();
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                        if (obj.toString().contains("APPROVEDDATE") || obj.toString().contains("VRDATE") || obj.toString().contains("VALIDUPTO_DATE") || obj.toString().contains("AMENDDATE") || obj.toString().contains("CHQDATE") || obj.toString().contains("DOB")) {
                            if (obj.toString().contains("APPROVEDDATE")) {
                                columnValue = "to_date('" + columnValue + "','" + APPROVEDDATE_FORMAT + "')";
                            }
                            if (obj.toString().contains("VRDATE")) {
                                columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                            }
                            if (obj.toString().contains("VALIDUPTO_DATE")) {
                                columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                            }
                            if (obj.toString().contains("AMENDDATE")) {
                                columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                            }
                            if (obj.toString().contains("CHQDATE")) {
                                columnValue = "to_date('" + columnValue + "','" + CHQDATEFORMAT + "')";
                            }
                            if (obj.toString().contains("DOB")) {
                                columnValue = "to_date('" + columnValue + "','" + CHQDATEFORMAT + "')";
                            }
                        } else if (obj.toString().contains("DATE")) {
                            columnValue = "to_date('" + columnValue + "','DD-MM-YYYY HH24:MI:SS')";
                        }
                        U.log("isAddonTempEntry===>>>"+isAddonTempEntry);
                        if ((obj.toString().equals("VRNO")) && columnValue.isEmpty()&&isAddonTempEntry==null) {
                            String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE \n"
                                    + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )\n"
                                    + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
                            U.log("getAccYearSQL :>> " + getAccYearSQL);
                            String currentAccYear = "";
                            
                            String prodVRNO_SQL = getReplacedprodVRNO_SQL(jsonObject);
                            U.log("ReplacedprodVRNO_SQL : " + prodVRNO_SQL);
                            
                            try {
                                ps = connection.prepareStatement(getAccYearSQL);
                                rs = ps.executeQuery();
                                if (rs != null && rs.next()) {
                                    currentAccYear = rs.getString(1);
                                    U.log("currentAccYear : " + currentAccYear);
                                    if (!currentAccYear.isEmpty()) {
                                        prodVRNO_SQL = prodVRNO_SQL.replaceAll("ACC_YEAR", currentAccYear);
                                    } else {
                                        U.log("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                                    }
                                } else {
                                    U.log("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
                                }
                            } catch (Exception e) {
                                U.errorLog("exception==" + e.getMessage());
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
                            U.log("getProdVRNO_SQL : " + getProdVRNO_SQL);
                            U.log("appendProdVRNO_SQL : " + appendProdVRNO_SQL);
                            try {
                                ps = connection.prepareStatement(getProdVRNO_SQL);
                                rs = ps.executeQuery();
                                if (rs != null && rs.next()) {
                                    generatedProdVRNO = rs.getString(1);
                                    U.log("generatedProdVRNO : " + generatedProdVRNO);
                                    columnValue = generatedProdVRNO;
                                    if (!generatedProdVRNO.isEmpty()) {
                                        appendProdVRNO_SQL = appendProdVRNO_SQL.replaceAll("GEN_VRNO", generatedProdVRNO);
                                        U.log("appendProdVRNO_SQL with VRNO: " + appendProdVRNO_SQL);
                                        try {
                                            ps = connection.prepareStatement(appendProdVRNO_SQL);
                                            ps.executeUpdate();
                                        } catch (SQLException e) {
                                            U.errorLog("appendProdVRNO_SQL NOT EXECUTED PROPERLY : " + appendProdVRNO_SQL);
                                            U.errorLog(e);
                                        }
                                    } else {
                                        U.log("getProdVRNO_SQL NOT EXECUTED PROPERLY : " + getProdVRNO_SQL);
                                    }
                                } else {
                                    U.log("getProdVRNO_SQL NOT EXECUTED PROPERLY : " + getProdVRNO_SQL);
                                }
                            } catch (Exception e) {
                                generatedProdVRNO = e.getMessage();
                                String prodVRNO_SQLArrr[] = generatedProdVRNO.split("ORA-20000:");
                                generatedProdVRNO = prodVRNO_SQLArrr[1].trim();
                                String prodVRNO_SQLArrrr[] = generatedProdVRNO.split("ORA-06512:");
                                generatedProdVRNO = prodVRNO_SQLArrrr[0].trim();
                                U.errorLog("generatedProdVRNO : " + generatedProdVRNO);
                                columnValue = generatedProdVRNO;
                                if (!generatedProdVRNO.isEmpty()) {
                                    appendProdVRNO_SQL = appendProdVRNO_SQL.replaceAll("GEN_VRNO", generatedProdVRNO);
                                    U.errorLog("appendProdVRNO_SQL with VRNO: " + appendProdVRNO_SQL);
                                    try {
                                        ps = connection.prepareStatement(appendProdVRNO_SQL);
                                        ps.executeUpdate();
                                    } catch (Exception ee) {
                                        U.errorLog("appendProdVRNO_SQL NOT EXECUTED PROPERLY : " + appendProdVRNO_SQL);
                                    }
                                } else {
                                    U.log("getProdVRNO_SQL NOT EXECUTED PROPERLY : " + getProdVRNO_SQL);
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
                        
                        if (f.isNumber(obj.toString())) {
                            if (obj.toString().contains("SEQ_ID")) {
                                columnValue = String.valueOf(seq_id);
                            }
                            if (f.isImg(obj.toString())) {
                                columnValue = seq_id + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                            }
                            if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                                colValue.append(columnValue).append(",");
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
                                    colValue.append(columnValue + ", ");
                                }
                            } else if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                                colValue.append("'" + columnValue + "',");
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
                    + "UPLOADATE_DATE,LAST_UPDATED,DESCRIBTION,USER_CODE,FLAG,SYSTEM_FILE_NAME,STORE_FILE_LRAW) "
                    + "values (?,?,sysdate,sysdate,?,?,'h',?,?)";
            
            U.log("fileID : " + fileId + "\n   IMAGE INSERT SQL : " + sqlDocumentInsert);
            U.log("IMAGE DATA : " + fin.toString());
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
            U.log("IMAGE INSERT STATUS : " + status);
        } catch (Exception e) {
            U.errorLog(e);
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
            
            U.log("fileID : " + fileId + "\n      compile qry == " + sqlDocumentInsert);
            
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
            U.log("VIDEO INSERT STATUS : " + status);
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
        
        U.log("SetDataType :" + sql);
        
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
            Date date = Calendar.getInstance().getTime();
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
            String dateStr = formatter.format(date);
            System.out.println("datetime on image ==  "+ dateStr);
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
    
    public void getColumnDetails(String seq_No) {
        String sql = "select column_name, status,table_name,column_type,column_default_value from lhssys_portal_data_dsc_update where seq_no = " + seq_no;
        U.log("getColumnDetails--> " + sql);
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
            U.errorLog("exeception 10---> " + e.getMessage());
        }
    }
}
