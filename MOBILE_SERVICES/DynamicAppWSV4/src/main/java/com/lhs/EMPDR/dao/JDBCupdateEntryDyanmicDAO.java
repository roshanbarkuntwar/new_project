/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.FileUploadStatus;
import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
import com.lhs.EMPDR.entity.FileClass;
import com.lhs.EMPDR.entity.LoggerWrite;
import com.lhs.EMPDR.utility.GenerateNotification;
import com.lhs.EMPDR.utility.U;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
public class JDBCupdateEntryDyanmicDAO {

    String base64Image;
    byte[] imageBytes;
    InputStream is;
    String table_name;
    Connection connection;
    String seq_no;
    String ref_key;
    StringBuffer valueString = new StringBuffer();
//    int seq_id;
    String dependent_next_entry_seq = null;
    JSONObject imgJSON = new JSONObject();
    FileClass f = new FileClass();
    HashMap<String, String> videofileId = new HashMap<String, String>();
    HashMap<String, String> nondisplayColList = new HashMap<String, String>();
    HashMap<String, String> imgfileID = new HashMap<String, String>();
    HashMap<String, String> defultValue = new HashMap<String, String>();
    HashMap<String, String> columnTableName = new HashMap<String, String>();
    HashMap<String, String> columnStatus = new HashMap<String, String>();
    String USER_CODE;
    LoggerWrite log = new LoggerWrite();
    String UPDATE_KEY;
    String UPDATE_KEY_VALUE;
    String isAddonTempEntry = null;
    String headSeqId = null;
    String refKeyVal = "";
    String imgColumnTableName;
    boolean isNotificationSend = false;

    public JDBCupdateEntryDyanmicDAO(Connection c) {
        this.connection = c;
        U u = new U(this.connection);
    }

    public void getDetailOfColumns() {
        PreparedStatement ps = null;
        ResultSet rs;
        U.log("seq no ==>" + seq_no);
        String dsql = "select seq_no from LHSSYS_PORTAL_TABLE_DSC_UPDATE where dependent_next_entry_seq = " + seq_no + " ORDER BY SEQ_NO DeSC";

        U.log("Query to get dependent_next_entry_seq :  " + dsql);

        try {
            ps = connection.prepareStatement(dsql);

            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                dependent_next_entry_seq = rs.getString(1);
                U.log("dependent roq seq ==" + dependent_next_entry_seq);
            }
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

        StringBuffer sql = new StringBuffer();
        sql.append("select u.*,t.update_key from lhssys_portal_data_dsc_update u,lhssys_portal_table_dsc_update t where ");
        sql.append("u.seq_no=");

        if (dependent_next_entry_seq != null) {
            sql.append(dependent_next_entry_seq).append("and t.seq_no=").append(dependent_next_entry_seq).append(" order by slno");
        } else {
            sql.append(seq_no).append("and t.seq_no=").append(seq_no).append("order by slno");
        }
        U.log("");
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {
            U.log("sql for seq no" + sql.toString());
            ps = connection.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    table_name = rs.getString("table_name");
                    columnTableName.put(rs.getString("column_name"), rs.getString("table_name"));
                    columnStatus.put(rs.getString("column_name"), rs.getString("status"));
                    // System.out.println("ColumnStatus--------->"+columnStatus);
                    if (isAddonTempEntry != null) {
                        table_name = isAddonTempEntry;
                    }
                    UPDATE_KEY = rs.getString("update_key");
                    if (rs.getString("status") != null && rs.getString("status").contains("F")) {
                        // if (rs.getString("status").contains("F")) {
//                        nondisplayColList.put(rs.getString("column_name"), rs.getString("column_default_value"));
                        // }
                    }

//                    columnStatus.put(rs.getString("column_name"), rs.getString("status"));
                } while (rs.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
//                    U.errorLog(e);
                }
            }

        }
    }
    String sysdate = "";

    public String UpdateGivenEntry(String jsonString, String isAddonTempEntry, String headSeqID, String docType, String user_level, String appr_status, String usercode) throws ParseException, Exception {
        if (isAddonTempEntry != null) {
            this.isAddonTempEntry = isAddonTempEntry;
        }
        this.headSeqId = headSeqID;
        U.log("jsonstring UPDATE: " + jsonString);
        String returnREsult = "updated data";
        String procedureOfUpadte = "";
        String procedureOfInsert = "";
        PreparedStatement ps = null;
        PreparedStatement ps1 = null;
        JSONArray jsonArray = new JSONArray();
        JSONParser json_parser = new JSONParser();
        JSONObject json = (JSONObject) json_parser.parse(jsonString);
        jsonArray = (JSONArray) json.get("recordsInfo");
        int jsonArrLength = jsonArray.size();
        U.log("jsonArrLength====" + jsonArrLength);
        JSONObject obj2 = (JSONObject) jsonArray.get(0);
        boolean isPushNotf = obj2.containsKey("PUSH_NOTIFICATION");
        try {
            ref_key = (obj2.get("ref_key".toUpperCase()).toString());
        } catch (Exception ex) {
//            ex.printStackTrace();
        }
        U.log("jsonArrLength1====" + jsonArrLength);
        seq_no = (obj2.get("dynamic_table_seq_id".toUpperCase()).toString());
        U.log("jsonArrLength2====" + jsonArrLength);
        U.log("dynamic_table_seq_id : " + seq_no);
        try {
            imgColumnTableName = columnTableName.get(obj2.get("fileId"));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        U.log("jsonArrLength3====" + jsonArrLength);

        try {
            for (int i = 1; i < jsonArrLength; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);
                if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
                    U.log("inside file condition");
                    is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
                    U.log("fileName : " + obj1.get("fileName").toString() + "  USER_CODE :  " + USER_CODE + "  desc  :  " + obj1.get("desc").toString()
                            + "   sysFileName  :  " + obj1.get("sysFileName").toString());
                    U.log("imgfileID : " + imgfileID.get(obj1.get("fileId").toString()) + "   FileID : " + obj1.get("fileId").toString());
//                U.log("imgfileID : " + Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())));
                    if (dependent_next_entry_seq != null) {
                        insertDocument(obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(), obj1.get("sysFileName").toString(), is, Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())));
                    } else if (obj1.get("sysFileName").toString().contains("sysFileName")
                            || obj1.get("sysFileName").toString().indexOf("sysFileName") > -1
                            || obj1.get("sysFileName").toString().lastIndexOf("sysFileName") > -1) {
                        if (imgColumnTableName.contains("DOC_TRAN")) {
                            refKeyVal = insertImageIntoDocTran(imgColumnTableName, obj1, json, docType);
                            if (refKeyVal != null) {
                                refKeyVal = updateImageIntoDocTran(imgColumnTableName, obj1, json, docType, ref_key);
                            }
                        } else {
                            updateDocument(Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())),
                                    obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
                                    obj1.get("sysFileName").toString(), is);
                        }

                    } else {
                        U.log("IMAGE PATH : " + obj1.get("sysFileName"));
                        writeFile(is, obj1);
                    }
                }
                if (obj1.get("videofile") != null && obj1.get("videofile").toString().length() > 3) {
                    base64Image = obj1.get("videofile").toString().split(",")[1];
                    imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
                    is = new ByteArrayInputStream(imageBytes);
                    U.log("videoFileName : " + obj1.get("videoFileName").toString() + "\n      USER_CODE : " + USER_CODE
                            + "\n    videoDesc :  " + obj1.get("videoDesc").toString() + "\n      sysFileName :  " + obj1.get("sysFileName").toString());
                    U.log("videoFileId :  " + obj1.get("videoFileId").toString());
                    U.log("videoFileId :  " + Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                    if (is == null) {
                        U.log("video file is null");
                    }
                    updateVideo(obj1.get("videoFileName").toString(), USER_CODE, obj1.get("videoDesc").toString(), obj1.get("sysFileName").toString(), is, Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                }
            }
        } catch (Exception e) {

        }

        String executeAfterSQL = "select execute_after_update, EXECUTE_AFTER_INSERT from lhssys_portal_table_dsc_update where seq_no = " + seq_no;

        U.log("GET EXECUTE_AFTER_UPDATE SQL : " + executeAfterSQL);

        try {

            ps1 = connection.prepareStatement(executeAfterSQL);
            ResultSet rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                procedureOfUpadte = rs1.getString(1);
                procedureOfInsert = rs1.getString(2);
                U.log(" execute_after_update procedure : " + procedureOfUpadte);
                U.log(" EXECUTE_AFTER_INSERT procedure : " + procedureOfInsert);
            }
            if (procedureOfUpadte != null && procedureOfUpadte.length() > 2) {
                ResultSet rs;
                String barcodeValue = "";
                String caseNoValue = "";
                String VRNOforBARCODE_CASE_TEXT = "";
                String TCODEforBARCODE_CASE_TEXT = "";
                String ADV_B_VRNOforBARCODE_CASE_TEXT = "";
                String wtPerPiece = "";
                JSONParser jSONParser = new JSONParser();
                try {
                    JSONObject jSONObject = (JSONObject) jSONParser.parse(jsonString);
                    for (int i = 0; i < jSONObject.size(); i++) {
                        Set<Map.Entry<String, Object>> entrySet = jSONObject.entrySet();
                        for (Map.Entry<String, Object> map : entrySet) {
                            String keys = map.getKey();
                            JSONArray jSONArray = (JSONArray) map.getValue();
                            for (int j = 0; j < jSONArray.size(); j++) {
                                JSONObject jSONObj = (JSONObject) jSONArray.get(j);
                                Set<Map.Entry<String, String>> key = jSONObj.entrySet();
                                for (Map.Entry<String, String> innermap : key) {
                                    if (innermap.getKey().equals("DYNAMIC_TABLE_SEQ_ID")) {
                                        procedureOfUpadte = procedureOfUpadte.replace("'" + innermap.getKey() + "'", "'" + String.valueOf(innermap.getValue()) + "'");
                                    } else if (innermap.getKey().equals("SLNO")) {
                                        procedureOfUpadte = procedureOfUpadte.replace("'" + innermap.getKey() + "'", "'" + String.valueOf(innermap.getValue()) + "'");
                                    } else if (innermap.getKey().equals("QTYISSUED")) {
                                        procedureOfUpadte = procedureOfUpadte.replace("'" + innermap.getKey() + "'", "'" + String.valueOf(innermap.getValue()) + "'");
                                    } else {
                                        if (String.valueOf(innermap.getValue()) != null) {
                                            procedureOfUpadte = procedureOfUpadte.replace("'" + innermap.getKey() + "'", "'" + String.valueOf(innermap.getValue()) + "'");
                                        } else {
                                            procedureOfUpadte = procedureOfUpadte.replace("'" + innermap.getKey() + "'", "''");
                                        }
                                    }
                                }
                            }
                        }
                    }
                    try {
                        U.log("procedureOfUpadte : " + procedureOfUpadte);
                        ps = connection.prepareStatement(procedureOfUpadte);
                        int n = ps.executeUpdate();
                        if (n >= 0) {
                            String result = n + " row updated";
                            U.log(" execute_after_update result : " + result);
                        } else {
                            String result = n + " row updated";
                            U.log(" execute_after_update result : " + result);
                        }
                    } catch (SQLException e) {
                        U.errorLog(e);
                        String returnMessage = "";
                        String[] returnMessageArr;
                        returnMessage = e.getMessage();
                        U.errorLog("returnMessage : " + returnMessage);
                        returnMessageArr = returnMessage.split(":");
                        returnMessage = returnMessageArr[1];
                        U.errorLog("execute_after_update result  e.getMessage() : " + e.getMessage());
                        returnMessage = returnMessage.replaceAll("ORA-06512", "");
                        U.errorLog("returnMessage : " + returnMessage);
                        return returnMessage;
                    }
                } catch (ParseException e) {
                    U.errorLog("Exception = " + e);
                    e.printStackTrace();
                    returnREsult = "Entry not updated...";
                }
            } else {
                if (procedureOfInsert != null && procedureOfInsert.length() > 2) {
                    U.log("executing procedure");
                    saveDataByProcedure(jsonString, user_level, appr_status, usercode);
                } else {
                    U.log("executing update");
                    returnREsult = UpdateEntry(jsonString);
                }
                    
                if (returnREsult.equalsIgnoreCase("updated data") && isPushNotf) {
                   
                    GenerateNotification notifObj = new GenerateNotification(connection);
                    
                    notifObj.sendNotification(json, seq_no, (obj2.get("vrno".toUpperCase()) != null ) ? (obj2.get("vrno".toUpperCase()).toString().trim()):null);
                }
            }
        } catch (Exception e) {
            U.errorLog(e);
            e.printStackTrace();
            returnREsult = "Entry not updated...";
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
        }
        return returnREsult;
    }

    public String UpdateEntry(String jsonString) throws ParseException, Exception {
        PreparedStatement ps1 = null;
        U.log("update entry json string==>" + jsonString);
        try {
            ps1 = connection.prepareStatement("select TO_CHAR(sysdate, 'DD-MM-YYYY HH24:MI:SS') as systemdate from dual");
            ResultSet rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                sysdate = rs1.getString(1);
            }
        } catch (SQLException e) {
            U.errorLog(e);
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
        }
        defultValue.put("sysdate", sysdate);

        StringBuffer stringBuff = new StringBuffer();
        PreparedStatement ps = null;
        ResultSet rs;
        String result = "updated data";
        JSONArray jsonArray = new JSONArray();
        JSONParser json_parser = new JSONParser();

        JSONObject json = (JSONObject) json_parser.parse(jsonString);
        jsonArray = (JSONArray) json.get("recordsInfo");
        int jsonArrLength = jsonArray.size();
        try {
            for (int i = 0; i < 1; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);
                seq_no = (obj1.get("dynamic_table_seq_id".toUpperCase()).toString());
                getDetailOfColumns();
                U.log("update key::==>" + obj1.get(UPDATE_KEY).toString());

                if (obj1.get(i) != null && obj1.get(i).toString().equalsIgnoreCase("PUSH_NOTIFICATION")) {
                    isNotificationSend = true;
                    // System.out.println("Notfication Called.");
                }

                if (obj1.get(UPDATE_KEY) != null) {
                    String seqId = (obj1.get(UPDATE_KEY)).toString();
                    UPDATE_KEY_VALUE = seqId.trim();
                }
                if (isAddonTempEntry != null) {
                    UPDATE_KEY = "seq_id";
                    UPDATE_KEY_VALUE = headSeqId;
                }
            }
        } catch (Exception ne) {
            ne.printStackTrace();
        }

        Object obj = json_parser.parse(json.toString());
        JSONObject json_obj = new JSONObject();
        json_obj = (JSONObject) obj;
        parseJson(json_obj);
        for (String key : imgfileID.keySet()) {
            U.log(key.toString() + "==> " + imgfileID.get(key).toString());
        }
        {
            for (int i = 1; i < jsonArrLength; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);
                if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
                    is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
                    if (dependent_next_entry_seq != null) {
                        insertDocument(obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
                                obj1.get("sysFileName").toString(), is,
                                Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())));
                    } else if (obj1.get("sysFileName").toString().contains("sysFileName")
                            || obj1.get("sysFileName").toString().lastIndexOf("sysFileName") > -1) {
                        updateDocument(Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())),
                                obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
                                obj1.get("sysFileName").toString(), is);
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
                    updateVideo(obj1.get("videoFileName").toString(), USER_CODE,
                            obj1.get("videoDesc").toString(), obj1.get("sysFileName").toString(),
                            is, Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                }
            }
            //apend default value

            for (Map.Entry m : nondisplayColList.entrySet()) {
                //U.log("predefinedVal==>"+m.getKey());
                if (m.getValue() != null) {
                    String predefinedVal = defultValue.get(m.getKey());

                    if (predefinedVal == null) {
                        predefinedVal = m.getValue().toString();
                    }
                    if (m.getKey().toString().contains("LASTUPDATE")) {
                        predefinedVal = "to_date('" + sysdate + "','dd-MM-yyyy HH24:MI:SS')";
                    } else {
                        predefinedVal = "'" + predefinedVal + "'";
                    }
                    valueString.append(m.getKey()).append("=").append(predefinedVal).append(",");
                }
            }

            if (isAddonTempEntry != null) {
                table_name = isAddonTempEntry;
            }
            U.log("table name  ::  " + table_name);
            String vaString = valueString.toString().substring(0, valueString.toString().lastIndexOf(","));
//            U.log("valueString=====>" + valueString.toString());
            stringBuff.append("update ").append(table_name).append("\n set ").append(vaString)
                    .append(" where ").append(UPDATE_KEY).append("='").append(UPDATE_KEY_VALUE).append("'");

            U.log("ENTRY UPDATE SQL : " + stringBuff.toString());
            int n = 0;
            try {
                ps = connection.prepareStatement(stringBuff.toString());
                n = ps.executeUpdate();
                String result1 = "";
                if (n > 0) {
                    result1 = n + " rows are updated";
                } else {
                    result = n + " Record not found to update";
                    result1 = n + " Record not found to update";
                }
                U.log("Update entry result : " + result1);
            } catch (Exception e) {
                U.errorLog(e);
                result = n + " Record not update";
                U.errorLog("Update entry result :: " + result);
                return "Error occoured sue to some internal reason.";
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
        return result;
    }

    public int updateDocument(float fileId, String fileName, String userCode, String discribtion, String systemFileName, InputStream fin) {
        int status = 0;
        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            sqlDocumentInsert = "update LHSSYS_portal_upload_file set FILE_ID=?,FILE_NAME=?,"
                    + "UPLOADATE_DATE=sysdate,LAST_UPDATED=sysdate,DESCRIBTION=?,USER_CODE=?,"
                    + "FLAG='h',SYSTEM_FILE_NAME=?,STORE_FILE_LRAW=? where file_id=" + fileId;

            U.log("Update Image Query :  " + sqlDocumentInsert);

            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setFloat(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());

            status = pst.executeUpdate();
            U.log("Update Image Result  :  " + status);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
        }
        return status;
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
    int setdataCount = 0;

    public void parseJson(JSONObject jsonObject) throws ParseException {
        Set<Object> set = jsonObject.keySet();
        Iterator<Object> iterator = set.iterator();
        while (iterator.hasNext()) {
            Object obj = iterator.next();

            if (jsonObject.get(obj) instanceof JSONArray) {
                getArray(jsonObject.get(obj));
            } else if (jsonObject.get(obj) instanceof JSONObject) {
                parseJson((JSONObject) jsonObject.get(obj));
            } else {
//                U.log("obj==>" + obj.toString());
                if (setdataCount == 0) {
                    try {
                        if (dependent_next_entry_seq != null) {
                            setDatatype(dependent_next_entry_seq);
                        } else {
                            setDatatype(seq_no);
                        }
                        setdataCount++;
                    } catch (Exception e) {
                        U.errorLog(e);
                    }
                }
                if (U.match(obj.toString().toLowerCase(), "col[2]{1}$", 0) != null) {
                    USER_CODE = jsonObject.get(obj).toString();
                    defultValue.put("USER_CODE", USER_CODE);
                }

//                System.out.println(obj.toString() + " -->columnStatus--> " + columnStatus.get(obj));
                if (!obj.toString().contains("imageTime") && !obj.toString().contains("video")
                        && !obj.toString().contains("file") && !obj.toString().contains("fileName")
                        && !obj.toString().contains("desc") && !obj.toString().contains("sysFileName")) {
                    if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                        if (columnTableName != null && !columnTableName.isEmpty()) {
                            if (columnStatus.get(obj) != null && columnStatus.get(obj).equalsIgnoreCase("D")) {
                            } else {
                                if (columnTableName.get(obj) != null && columnTableName.get(obj).contains("DOC_TRAN")) {
                                } else {
                                    valueString.append(obj.toString() + "=");
                                }
                            }
                        }
                    }
                    String columnValue = "";
                    try {
                        columnValue = jsonObject.get(obj).toString();
                    } catch (Exception e) {
                        if (f.isNumber(obj.toString())) {
                            columnValue = "";
                        } else {
                            columnValue = "";
                        }
                    }
                    if (f.isNumber(obj.toString())) {
                        U.log("line 695");
                        if (obj.toString().toUpperCase().contains("SEQ_ID")) {
                            UPDATE_KEY_VALUE = jsonObject.get(obj).toString();
                            columnValue = UPDATE_KEY_VALUE + "";
                        }

                        if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {

                            if (columnStatus.get(obj) != null && columnStatus.get(obj).equalsIgnoreCase("D")) {
                            } else {
                                if (obj.toString().contains("DATE")) {
                                    valueString.append("to_date('" + columnValue + "','dd-MM-yyyy HH24:MI:SS'),");
                                } else {
                                    valueString.append("'" + columnValue + "',");
                                }
                            }
                        }

                    } else {

                        if (f.isImg(obj.toString())) {
                            U.log("is img");

                            columnValue = UPDATE_KEY_VALUE + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                            //columnValue = columnValue.replaceAll("", UPDATE_KEY)
                            imgfileID.put(obj.toString(), columnValue);
                        }
                        if (f.isVideo(obj.toString())) {
                            columnValue = UPDATE_KEY_VALUE + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                            videofileId.put(obj.toString(), columnValue);
                        }
                        if (f.isSysDate(obj.toString())) {
                            columnValue = sysdate;
                        }
                        if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                            if (columnStatus.get(obj) != null && columnStatus.get(obj).equalsIgnoreCase("D")) {
                            } else {
                                System.out.println("column name-->" + obj.toString() + " column status-->" + columnStatus.get(obj));
                                if (obj.toString().contains("DATE")) {
                                    //U.log("column type===>"+f.getvalFromMap(obj.toString())+"::  columnValue "+columnValue);

                                    valueString.append("to_date('" + columnValue + "','dd-MM-yyyy HH24:MI:SS'),");

                                } else {
//                                U.log("f===>"+f.getvalFromMap(obj.toString()));
                                    if (columnTableName.get(obj) != null && columnTableName.get(obj).contains("DOC_TRAN")) {
                                    } else {
                                        valueString.append("'" + columnValue + "',");
                                    }
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

    public void setDatatype(String col1) throws SQLException {
        String sql = " select * from LHSSYS_PORTAL_DATA_DSC_UPDATE where seq_no = " + col1 + " order by slno";
        U.log("Query to get details of LHSSYS_PORTAL_DATA_DSC_UPDATE : " + sql);
        PreparedStatement ps = null;
        ResultSet rs;
        if (connection == null) {
            U.log("connection is null");
        }
        try {
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                do {

                    table_name = rs.getString("TABLE_NAME");
                    f.addInmap(rs.getString("column_name"), rs.getString("column_type"));
//                    System.out.println(rs.getString("column_name") + " ::: " + rs.getString("status"));
                    columnStatus.put(rs.getString("column_name"), rs.getString("status"));
                } while (rs.next());
            }
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

    public int updateVideo(String fileName, String userCode, String discribtion, String systemFileName, InputStream fin, float fileId) throws Exception {
        int status = 0;
        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            sqlDocumentInsert = "update LHSSYS_portal_upload_file set FILE_ID=?,FILE_NAME=?,"
                    + "UPLOADATE_DATE=sysdate,LAST_UPDATED=sysdate,DESCRIBTION=?,USER_CODE=?,"
                    + "FLAG='h',SYSTEM_FILE_NAME=?,STORE_FILE_LRAW=? where file_id=" + fileId;

            U.log("VIDEO UPDATE QUERY  :   " + sqlDocumentInsert);

            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setFloat(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());

            status = pst.executeUpdate();
            U.log("VIDEO UPDATE RESULT  : " + status);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
        }
        return status;
    }

    public InputStream writeOnImage(String image, String imgdate) {
        String appImageUpdateFlag = "T";
        String appImageDate = imgdate;
        if (imgdate.contains("~")) {
            String imgdateArray[] = imgdate.split("~~");
            U.log("Image Date received from app : " + imgdateArray[0]);
            U.log("Image update flag received from app : " + imgdateArray[1]);
            appImageDate = imgdateArray[0];
            appImageUpdateFlag = imgdateArray[1];
        }

        InputStream iss = null;
        try {
            Date date = Calendar.getInstance().getTime();
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
            String dateStr = formatter.format(date);
            System.out.println("datetime on image ==  "+ dateStr);
            //byte to bufferedImage
            String base64Img = image;//.split(",")[1];
            byte[] imageByts = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
            iss = new ByteArrayInputStream(imageByts);
            BufferedImage bi = ImageIO.read(iss);
            Graphics2D graphics = bi.createGraphics();
            Font font = new Font("ARIAL", Font.PLAIN, 20);
            graphics.setFont(font);
            graphics.setColor(Color.WHITE);
            String overlapString = dateStr;
            U.log("overlapString : " + overlapString);
            if (appImageUpdateFlag.equals("F")) {
                graphics.drawString("", 25, 25);
            } else {
                graphics.drawString(overlapString, 25, 25);
            }
//            graphics.drawString(formatter.format(date), 25, 25);
            bi.flush();
            byte[] imageInByte;
// convert BufferedImage to byte array
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bi, "jpg", baos);
            baos.flush();
            imageInByte = baos.toByteArray();
            baos.close();
            iss = new ByteArrayInputStream(imageInByte);
        } catch (Exception e) {
            U.errorLog(e);
        }
        return iss;
    }

    public void writeFile(InputStream is, JSONObject obj) {
        String fileName = obj.get("sysFileName").toString();
        U.log("IMAGE FILE PATH fileName--> " + fileName);
        BufferedImage image = null;
        try {
            image = ImageIO.read(is);
            File file = new File(fileName);
            file.getParentFile().mkdirs();
            ImageIO.write(image, "jpg", file);
        } catch (Exception e) {
        }
    }

    public String insertDocument(String fileName, String userCode, String discribtion, String systemFileName, InputStream fin, float fileId) throws Exception {
        String status = "";
        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            U.log("file id :  " + fileId);
            sqlDocumentInsert = "insert into LHSSYS_portal_upload_file (FILE_ID,FILE_NAME,UPLOADATE_DATE,"
                    + "LAST_UPDATED,DESCRIBTION,USER_CODE,FLAG,SYSTEM_FILE_NAME,STORE_FILE_LRAW)"
                    + " values (?,?,sysdate,sysdate,?,?,'h',?,?)";
            U.log("fileID : " + fileId + "\n INSERT IMAGE SQL :  " + sqlDocumentInsert);
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
            U.log("IMAGE INSERTION STATUS : " + status);
        } catch (Exception e) {
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

    String refColName = "";

    public String updateImageIntoDocTran(String tableName, JSONObject imgJson, JSONObject mainJson, String docType, String ref_Key) {

        U.log("ref_key====" + ref_Key);

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
                /**
                 * Getting docCode from REFKEY
                 */
                try {
                    String refKey = "select doc_code from doc_mast where ref_key =" + ref_Key;
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
                    String docTranQuery = "update doc_tran set doc_code='" + docCodeVal + "',doc_slno,doc_desc,file_path,file_name,review_date,file_code,user_code,lastupdate,review_by,file_date,physical_file_flag,doc_expiry_date,entity_code,entry_date) "
                            + "values('" + docCodeVal + "',(SELECT count(doc_slno)+1 from doc_tran where doc_code='" + docCodeVal + "'),'" + (String) imgJson.get("desc") + "','','" + (String) imgJson.get("fileName") + "'," + "to_date('" + (String) imgJson.get("imageTime") + "','dd-MM-yyyy HH24:MI:SS'),'',''," + "to_date('" + (String) imgJson.get("imageTime") + "','dd-MM-yyyy HH24:MI:SS'),'','','" + entityCode + "'," + "to_date('" + entryDate + "','dd-MM-yyyy HH24:MI:SS'),'','')";
                    ps = connection.prepareStatement(docTranQuery);
                    int ii = 0;
                    ii = ps.executeUpdate();
                    if (ii > 0) {
                        U.log("Data inserted in  doc_tran docCodeVal---->" + docCodeVal);
                    }
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
                    if (ii > 0) {
                        U.log("Data inserted in  doc_tran_image docCodeVal---->" + docCodeVal);
                    }
                } catch (Exception e) {
                    U.errorLog("exeception doc_tran_image---> " + e.getMessage());

                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (SQLException ex) {

                        }
                    }
                }

            }

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

    public String insertImageIntoDocTran(String tableName, JSONObject imgJson, JSONObject mainJson, String docType) {

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
                /**
                 * Getting REFKEY from Sequence
                 */
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
                /**
                 * *Getting Doc Code from Sequence**
                 */
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
                        U.log("Data inserted in  lhssys_ref_key_tran refKeyVal---->" + refKeyVal);
                        docSLNO++;
                    }
                } catch (Exception e) {
                    U.errorLog("exeception lhssys_ref_key_tran---> " + e.getMessage());
                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (SQLException ex) {
                        }
                    }
                }
                try {
                    String docMastQuery = "insert into doc_mast (doc_code,doc_name,doc_date,flag,user_code,lastupdate,doc_type,doc_detail,ref_key,key_code,key_mast) "
                            + "values('" + docCodeVal + "','Image'," + "to_date('" + (String) jsobj.get("ON_DATE") + "','dd-MM-yyyy HH24:MI:SS'),'','" + user_code + "',sysdate,'" + docType + "',''," + refKeyVal + ",'','')";
                    ps = connection.prepareStatement(docMastQuery);

                    int ii = 0;
                    ii = ps.executeUpdate();
                    if (ii > 0) {
                        U.log("Data inserted in  doc_mast docCodeVal---->" + docCodeVal);
                        docSLNO++;
                    }

                } catch (Exception e) {
                    U.errorLog("exeception docCodeVal---> " + e.getMessage());
                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (SQLException ex) {

                        }
                    }
                }
                try {
                    String docTranQuery = "insert into doc_tran(doc_code,doc_slno,doc_desc,file_path,file_name,review_date,file_code,user_code,lastupdate,review_by,file_date,physical_file_flag,doc_expiry_date,entity_code,entry_date) "
                            + "values('" + docCodeVal + "',(SELECT count(doc_slno)+1 from doc_tran where doc_code='" + docCodeVal + "'),'" + (String) imgJson.get("desc") + "','','" + (String) imgJson.get("fileName") + "'," + "to_date('" + (String) imgJson.get("imageTime") + "','dd-MM-yyyy HH24:MI:SS'),'',''," + "to_date('" + (String) imgJson.get("imageTime") + "','dd-MM-yyyy HH24:MI:SS'),'','','" + entityCode + "'," + "to_date('" + entryDate + "','dd-MM-yyyy HH24:MI:SS'),'','')";
                    ps = connection.prepareStatement(docTranQuery);
                    int ii = 0;
                    ii = ps.executeUpdate();
                    if (ii > 0) {
                        U.log("Data inserted in  doc_tran docCodeVal---->" + docCodeVal);
                    }
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
                    if (ii > 0) {
                        U.log("Data inserted in  doc_tran_image docCodeVal---->" + docCodeVal);
                    }
                } catch (Exception e) {
                    U.errorLog("exeception doc_tran_image---> " + e.getMessage());

                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (SQLException ex) {

                        }
                    }
                }

            }

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

    public FileUploadStatus saveDataByProcedure(String jsonString, String user_level, String appr_status, String usercode) {
        U.log("SAVE BY PROCEDURE==" + seq_no);
        Double seqNo = Double.parseDouble(seq_no) - (0.1);

        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        PreparedStatement ps1 = null;
        ResultSet rs1 = null;
        String returnREsult = "insert data";
        String procedureOfUpadte = "";
        String procedureOfInsert = "";
        String procedureOfInsertNew = "";
        String executeAfterSQL = "select execute_after_update, EXECUTE_AFTER_INSERT from lhssys_portal_table_dsc_update where seq_no = " + seq_no.split("\\.")[0];

        U.log("GET EXECUTE_AFTER_UPDATE, EXECUTE_AFTER_INSERT SQL : " + executeAfterSQL);
        try {
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
                            } else if (map.getKey().equals("VRNO")) {
                                if (map.getValue() != null) {
                                    procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + map.getValue() + "'");
                                }
                            } else {
                                procedureOfInsert = procedureOfInsert.replace("'" + map.getKey()
                                        + "'", "'" + String.valueOf(map.getValue()) + "'");
                            }

                            if (map.getKey().contains("PUSH_NOTIFICATION")) {
                                isNotificationSend = true;

                            }

                        }
                        if (procedureOfInsert.contains("USER_LEVEL")) {
                            procedureOfInsert = procedureOfInsert.replace("USER_LEVEL", user_level);
                        }
                        if (procedureOfInsert.contains("APPROVAL_FLAG")) {
                            procedureOfInsert = procedureOfInsert.replace("'APPROVAL_FLAG'", "'" + appr_status + "'");
                        }
                        if (procedureOfInsert.contains("USERCODE")) {
                            procedureOfInsert = procedureOfInsert.replace("'USERCODE'", "'" + usercode + "'");
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
                            if (returnMessage.contains("insert data") || returnMessage.contains("updated data")) {
                                returnMessage = "updated data";
                            }
                            fileUploadStatus.setStatus(returnMessage);
                        } catch (Exception ex) {
                            fileUploadStatus.setStatus("Error occoured due to some internal reason.");
                        }
                    }
                }
            } else {
//                fileUploadStatus = addInsertEntry(jsonString);
                if (isAddonTempEntry != null) {
                    table_name = isAddonTempEntry;
                }
            }
        } catch (Exception e) {
            System.out.println("EXCEPTION iN UPDATE ENTRY Execute_After_Insert : " + e.getMessage());
        }
        return fileUploadStatus;
    }

//      public void sendNotification(JSONObject jsonobj, String seq_no) {
//
//        String user_str = "";
//        // String user_code = "";
////        String user_token_no = "";
//        String notification_data_all = "";
//        String AUTH_KEY_FCM = "AAAAqTPM8z8:APA91bGVIagFqqDqxKRmp_8iq8VdxPX3yzkUIyp0URXoe6anWMgltTzX2QEyZ9klRYb1Y3jfGwUfb_S8prvVvJkYjLrU7fyGlbVJ07WlEWOp21cu3cW-M-dg8_1rQeSNygGe3WKzhoxL";
//        String API_URL_FCM = "https://fcm.googleapis.com/fcm/send";
////        String message = "";
//        String ref_lov_whr_clause = "";
//        JSONArray jsonArray = (JSONArray) jsonobj.get("recordsInfo");
//        JSONObject json_obj = (JSONObject) jsonArray.get(0);
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
}
