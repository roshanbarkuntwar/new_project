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
import com.lhs.EMPDR.utility.GenerateNotification;
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
 * @author ranjeet.kumar
 */
public class SaveEntryDao {

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
    String USER_CODE;
    LoggerWrite log = new LoggerWrite();
    HashMap<String, String> displayColList = new HashMap<String, String>();
    String seq_no;
    String isAddonTempEntry = null;
    String sysdate = "";
    String userEnteredDate = "";
    int setdata = 0;
    String currentAccYear = "";
    HashMap<String, String> columnStatus = new HashMap<String, String>();
    HashMap<String, String> columnType = new HashMap<String, String>();
    HashMap<String, String> columnTableName = new HashMap<String, String>();
    HashMap<String, String> columnDefaultValue = new HashMap<String, String>();
    String refColName = "";
    String refKeyVal = "";
    String series;
    String client_name = "";
    boolean isNotificationSend = false;
    boolean isSendMail = false;
    String flag = "";
    public SaveEntryDao(Connection connection) {
        this.connection = connection;
        U u = new U(this.connection);
    }

    public FileUploadStatus saveEntry(String jsonString, String isAddonTempEntry, String docType) throws ParseException, Exception {
        U.log("SAVE ENTRY DAO");
        this.isAddonTempEntry = isAddonTempEntry;
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        PreparedStatement ps9 = null;
        ResultSet rs9 = null;
        try {
            JSONArray jsonArray = new JSONArray();
            JSONParser json_parser = new JSONParser();
            JSONObject json = (JSONObject) json_parser.parse(jsonString);
            System.out.println("JSON STRING : " + jsonString);
            jsonArray = (JSONArray) json.get("recordsInfo");
            int jsonArrLength = jsonArray.size();
            String saveProcessFlag = "";
            U.log("json length in addEntry :  " + jsonArrLength);
            for (int i = 0; i < 1; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);
                seq_no = obj1.get("DYNAMIC_TABLE_SEQ_ID") + "";
                series = obj1.get("SERIES") + "";
                //Aniket 06-11-2019
//                 if(obj1.get("Flag").toString() !=null && !obj1.get("Flag").toString().isEmpty()) {                	 
//                	 flag = obj1.get("Flag").toString();   
//                 }
            }
            getDetailOfColumns();
            if (seq_id == 0) {
                if (table_name.equals("LHSSYS_PORTAL_APP_TRAN") || table_name.equals("ITEMTRAN_BODY") || table_name.equals("ITEMTRAN_HEAD") || table_name.equals("ORDER_HEAD") || table_name.equals("ORDER_BODY")) {
                    seq_id = nextSeqID(table_name);
                } else {
                    seq_id = (getDocumentListCount(table_name) + 1);
                }
                if (table_name.equalsIgnoreCase("LHSSYS_PORTAL_APP_TRAN")) {
                    nondisplayColList.put("SEQ_ID", Integer.toString(seq_id));
                }
            }

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
                    else if (imgColumnTableName.contains("DOC_TRAN")) {
                        if (obj1.get("file") != null && obj1.get("file").toString().length() > 4) {
                            insertImageIntoDocTran(imgColumnTableName, obj1, json, table_name);
                        }
                    } else {
                        insertImageIntoOtherTable(imgColumnTableName, obj1, json);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            /*---------------------
            generate vrno for entry
            -----------------------*/
            getVrno(jsonString);                                                                // This Method is used for VRNO Generation 

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
                    U.log("P============/========P");
                    fileUploadStatus = saveDataByProcedure(jsonString);
                } else if (saveProcessFlag.equalsIgnoreCase("T")) {
                    U.log("T=================== T");
                    fileUploadStatus = addInsertEntry(jsonString);
                } else if (saveProcessFlag.equalsIgnoreCase("B")) {
                    U.log("B====================== B");
                    fileUploadStatus = addInsertEntry(jsonString);
                    saveDataByProcedure(jsonString);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (fileUploadStatus.getStatus().equalsIgnoreCase("insert data")) {
                try {
                    System.out.println("vrno===1" + generatedProdVRNO);
                    if (isNotificationSend) {
                        GenerateNotification notifObj = new GenerateNotification(connection);
                        notifObj.sendNotification(json, seq_no, generatedProdVRNO);
                    }
                } catch (Exception e) {
                }

//                if (isSendMail) {
//                    System.out.println("vrno==="+generatedProdVRNO);
//                    JSONObject obj1 = (JSONObject) jsonArray.get(0);
//                    SendEmail emailObj = new SendEmail(connection);
//                    emailObj.sendEmail(generatedProdVRNO, obj1.get("TCODE").toString(), obj1.get("ENTITY_CODE").toString(), currentAccYear);
//                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileUploadStatus;
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

                    /*  For storing column info  */
                    columnStatus.put(rs.getString("column_name"), rs.getString("status"));
                    columnType.put(rs.getString("column_name"), rs.getString("column_type"));
                    columnTableName.put(rs.getString("column_name"), rs.getString("table_name"));
                    columnDefaultValue.put(rs.getString("column_name"), rs.getString("column_default_value"));
                    table_name = rs.getString("table_name");

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
            U.log(e);
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

    public int nextSeqID(String tableName) throws Exception {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int listCount = 0;
        try {
            String selectQry = "";
            if (isAddonTempEntry != null) {
                selectQry = "select TEMP_HEAD_TRAN_WEB_SEQ.nextval from dual";
            } else {
                selectQry = "select portal_app_tran_seq.nextval from dual";
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

// This is used for Save Entry by Collecting Table Name and Column Names from LHSSYS_PORTAL_DATA_DSC_UPDATE then Save into Table.
    public FileUploadStatus addInsertEntry(String jsonString) throws ParseException, Exception {

        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        PreparedStatement ps1 = null;
        try {
            //change
            ps1 = connection.prepareStatement("select TO_CHAR(sysdate, 'MM-dd-YYYY HH24:MI:SS') as systemdate from dual");
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
        }

        getDetailOfColumns();

        if (isAddonTempEntry != null) {
            table_name = isAddonTempEntry;
        }

        U.log("Table Name : " + table_name + "seq id---?" + seq_id);
        if (seq_id == 0) {
            if (isAddonTempEntry != null) {
                try {
                    ps = connection.prepareStatement("select TEMP_HEAD_TRAN_WEB_SEQ.NEXTVAL from dual");
                    U.log("seqId======> select TEMP_HEAD_TRAN_WEB_SEQ.NEXTVAL from dual");
                    ResultSet rs = ps.executeQuery();
                    if (rs != null && rs.next()) {
                        seq_id = Integer.parseInt(rs.getString(1));
                    }
                    U.log("seq_id---------->" + seq_id);
                } catch (Exception e) {
                    U.errorLog("Exception   " + e.getStackTrace());
                } finally {
                    ps.close();

                }
            } else {

                seq_id = (getDocumentListCount(table_name) + 1);
            }
            //MOST IMPORTANT 
            //select portal_app_tran_seq.nextval from dual
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
                    predefinedVal = "to_date('" + sysdate + "','MM-dd-yyyy HH24:MI:SS')";
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
        for (int j = 0; j < 1; j++) {
            if (j > 0) {
                currentUserCode = replicateColumnValue.split(",")[j - 1];
                if (isAddonTempEntry != null) {
                    seq_id = nextSeqID(isAddonTempEntry);
                } else if (table_name.equals("LHSSYS_PORTAL_APP_TRAN")) {
                    seq_id = nextSeqID(table_name);
                } else {
                    seq_id = (getDocumentListCount(table_name) + 1);
                }
                System.out.println("IMAGE_ID : " + imgfileID.keySet());
                for (String key : imgfileID.keySet()) {
                    U.log(key + " " + imgfileID.get(key));
                    String replaceKey = imgfileID.get(key).replaceAll("(\\d+)(.\\d+)", seq_id + "\\.$2");
                    U.log("replaceKey : " + replaceKey);
                    imgfileID.put(key, replaceKey);
                }
            }
            if (isAddonTempEntry != null) {
                String targetTable = "ORDER";
                try {
                    PreparedStatement ps2 = connection.prepareStatement("SELECT SHOW_TYPE_MENU_FLAG from LHSSYS_PORTAL_TABLE_DSC_UPDATE where seq_no =trunc( " + seq_no + ")");
                    ResultSet rs2 = ps2.executeQuery();
                    if (rs2 != null && rs2.next()) {
                        targetTable = rs2.getString(1) != null ? rs2.getString(1) : "ORDER";
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

                colName.append("seq_id,");
                colValue.append(seq_id + ",");
                colName.append("ENTRY_TABLE_TYPE,");
                colValue.append("'" + targetTable + "',");
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

                System.out.println("Json---Notif->" + json_obj);
//                if (isNotificationSend) {
////                    System.out.println("Notification Method called");
//                    sendNotification(json_obj, seq_no);
//                }
                fileUploadStatus.setStatus(result);
                fileUploadStatus.setVRNO(generatedProdVRNO);
                fileUploadStatus.setSeq_id(String.valueOf(seq_id));
                U.log("result==" + result);

                //------ For VRNO or code generated by Trigger in INSERT QUERY--------//
                getCodegeneratedByTriggerForBody(fileUploadStatus);
//                if (table_name.equalsIgnoreCase("retailer_mast")) {
//                    PreparedStatement psz = connection.prepareStatement("SELECT LHS_CRM.GET_NEW_CODE FROM DUAL");
//                    ResultSet rsz = psz.executeQuery();
//                    String newVal = "";
//                    if (rsz.next()) {
//                        newVal = rsz.getString(1);
//                    }
//                    U.log("New Val = " + newVal);
//                    fileUploadStatus.setRetailerCode(newVal);
//                }

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
                    try {
                        JSONObject obj1 = (JSONObject) jsonArray.get(i);
                        if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
                            String fileId = obj1.get("fileId").toString();
                            is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
                            System.out.println("IMAGE FILE : " + Float.parseFloat(imgfileID.get(fileId)));
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

                    } catch (Exception e) {

                    }

                }
            }
        }

        return fileUploadStatus;
    }
    // This Method Used for Parse JSON which is comes from Pages.

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

                if (obj.toString().equalsIgnoreCase("PUSH_NOTIFICATION")) {
                    isNotificationSend = true;
                }
                if (obj.toString().equalsIgnoreCase("SEND_EMAIL")) {
                    isSendMail = true;
                }

                if (!obj.toString().contains("imageTime") && !obj.toString().contains("video")
                        && !obj.toString().contains("file") && !obj.toString().contains("fileName") && !obj.toString().contains("ref_key_type")
                        && !obj.toString().contains("desc") && !obj.toString().contains("sysFileName")) {

                    if (columnStatus.get(obj) != null && columnStatus.get(obj).equalsIgnoreCase("D")) {
                    } else {
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
//                                e.printStackTrace();
                                System.out.println("Error --> " + e.getMessage());
                            }
                            if (obj.toString().contains("APPROVEDDATE") || obj.toString().contains("VRDATE") || obj.toString().contains("VALIDUPTO_DATE") || obj.toString().contains("AMENDDATE") || obj.toString().contains("CHQDATE") || obj.toString().contains("DOB")) {
                                if (obj.toString().contains("APPROVEDDATE")) {
                                    columnValue = "to_date('" + columnValue + "','" + APPROVEDDATE_FORMAT + "')";
                                }
                                if (obj.toString().contains("VRDATE")) {
                                    columnValue = "to_date('" + columnValue + "','DD-MM-YYYY HH24:MI:SS')";
                                }
                                if (obj.toString().contains("VALIDUPTO_DATE")) {
                                    columnValue = "to_date('" + columnValue + "','DD-MM-YYYY HH24:MI:SS')";
                                }
                                if (obj.toString().contains("AMENDDATE")) {
                                    columnValue = "to_date('" + columnValue + "','DD-MM-YYYY HH24:MI:SS')";
                                }
                                if (obj.toString().contains("CHQDATE")) {
                                    columnValue = "to_date('" + columnValue + "','" + CHQDATEFORMAT + "')";
                                }
                                if (obj.toString().contains("DOB")) {
                                    columnValue = "to_date('" + columnValue + "','" + CHQDATEFORMAT + "')";
                                }
                            } else if (obj.toString().toUpperCase().contains("DATE")) {
                                if (obj.toString().contains("LASTUPDATE")) {

                                    columnValue = "to_date('" + columnValue + "','DD-MM-YYYY HH24:MI:SS')";
                                } else {
                                    columnValue = "to_date('" + columnValue + "','DD-MM-YYYY HH24:MI:SS')";
                                }
                            }
                            if (obj.toString().equals("SERIES")) {
                                U.log("series value==>>" + jsonObject.get(obj).toString());
                                series = jsonObject.get(obj).toString();
                            }

                            if (obj.toString().contains("TASK_SEQ_NO")) {
                                String taskSeqNoSql = "SELECT NVL(MAX(TASK_SEQ_NO),0) + 1 FROM TASK_TRAN";
                                int maxSeqNo = 0;
                                try {
                                    PreparedStatement ps1 = connection.prepareStatement(taskSeqNoSql);
                                    ResultSet rs1 = ps1.executeQuery();
                                    if (rs1.next()) {
                                        maxSeqNo = rs1.getInt(1);
                                    }
                                } catch (Exception e) {
                                    U.errorLog("exeception 9---> " + e.getMessage());
                                }
                                columnValue = String.valueOf(maxSeqNo);
                            }
                            if ((obj.toString().equals("VRNO")) && columnValue.isEmpty() && isAddonTempEntry == null) {
                                String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE \n"
                                        + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )\n"
                                        + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
                                U.log("getAccYearSQL : " + getAccYearSQL);
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
                                        U.log("appendProdVRNO_SQL with VRNO: " + appendProdVRNO_SQL);
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
                                            e.printStackTrace();
                                        }
                                    }
                                }
                            }

                            if (obj.toString().equals("VRNO") && columnValue.isEmpty() && isAddonTempEntry != null) {
                                U.log("okkkkkkkkkkkkkkkkkkkkkkkkkkkkk===" + series);
                                columnValue = series;
                            }

                            if (f.isNumber(obj.toString())) {
                                if (obj.toString().contains("SEQ_ID")) {
                                    columnValue = String.valueOf(seq_id);
                                }
                                if (f.isImg(obj.toString())) {
                                    columnValue = seq_id + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                                }
                                if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                                    colValue.append("'" + columnValue.replace("'", "''") + "'").append(",");
                                }
                            } else {
//                            if (f.isImg(obj.toString())) {
//                                columnValue = seq_id + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
//                                imgfileID.put(obj.toString(), columnValue);
//                            }
//                            if (f.isVideo(obj.toString())) {
//                                columnValue = seq_id + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
//                                videofileId.put(obj.toString(), columnValue);
//                            }
                                if (f.isSysDate(obj.toString())) {
                                    columnValue = sysdate;
                                }
                                if (obj.toString().equals(refColName)) {
                                    columnValue = refKeyVal;
                                }
                                if (columnValue.toString().contains("to_date")) {
                                    if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                                        colValue.append(columnValue.trim() + ", ");
                                    }
                                } else if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                                    if (obj.toString().equals("VRNO")) {
                                        U.log("colvale====>" + columnValue);
                                    }
                                    colValue.append("'" + columnValue.trim().replace("'", "''") + "',");
                                }

                            }

                        } catch (Exception ex) {
                        }
                    }
                } else {
                    imgJSON.put(obj.toString(), jsonObject.get(obj));
                }
            }
        }
    }

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
                        series = columnValue;
                        U.log("vrno series==>?>" + columnValue);
                    }
                    if (obj.toString().equalsIgnoreCase("ENTITY_CODE")) {
                        prodVRNO_SQL = prodVRNO_SQL.replaceAll("ENTITY_CODE", columnValue);
                        U.log("ENTITY_CODE : " + columnValue);
                        prodVRNO_SQL = prodVRNO_SQL.replaceAll("'DIV_CODE'", "NULL");
                        if (columnValue.equals("VE")) {
                            prodVRNO_SQL = prodVRNO_SQL.replaceAll("'DIV_CODE'", "NULL");
                            prodVRNO_SQL = prodVRNO_SQL.replaceAll("'PAD'", "3");
                            U.log("divCode VE : NULL");
                        }
                        prodVRNO_SQL = prodVRNO_SQL.replaceAll("'DIV_CODE'", "NULL");
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

    public InputStream writeOnImage(String image, String imgdate) {
        InputStream iss = null;
        try {
            Date date = Calendar.getInstance().getTime();
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
            String dateStr = formatter.format(date);
            System.out.println("datetime on image ==  "+ dateStr);
//            Date date = formatter.parse(dateStr);
            String base64Img = image;//.split(",")[1];
            byte[] imageByts = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
            iss = new ByteArrayInputStream(imageByts);
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
        } catch (Exception e) {
        }
        System.out.println("ISS......................." + iss);
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

    public void getArray(Object object2) throws ParseException {
        JSONArray jsonArr = (JSONArray) object2;
        for (int k = 0; k < jsonArr.size(); k++) {
            if (jsonArr.get(k) instanceof JSONObject) {
                parseJson((JSONObject) jsonArr.get(k));
            } else {
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

    // This Method is used for Save Data By Procedure which is written inside EXECUTE_AFTER_INSERT And EXECUTE_AFTER_UPDATE
    public FileUploadStatus saveDataByProcedure(String jsonString) {
        U.log("SAVE BY PROCEDURE");
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        PreparedStatement ps1 = null;
        ResultSet rs1 = null;
        String returnREsult = "insert data";
        String procedureOfUpadte = "";
        String procedureOfInsert = "";
        String procedureOfInsertNew = "";
        String executeAfterSQL = "select execute_after_update, EXECUTE_AFTER_INSERT from lhssys_portal_table_dsc_update where seq_no = " + seq_no;

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

                try {
                    Set<Map.Entry<String, String>> entrySet = imgfileID.entrySet();
                    for (Map.Entry<String, String> map : entrySet) {
                        procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + map.getValue() + "'");
                    }
                } catch (Exception e) {
                    System.out.println("imgfileID keySetIterator ERROR ---> " + e.getMessage());
                }
                U.log("System Date : " + sysdate);
                JSONArray jsonArray1 = new JSONArray();
                JSONParser json_parser1 = new JSONParser();
                JSONObject json1 = (JSONObject) json_parser1.parse(jsonString);
                jsonArray1 = (JSONArray) json1.get("recordsInfo");
                U.log("jsonArray1 :" + jsonArray1);
                //Aniket
                  String vrdateFormat = "";
                  Date date =null;
                for (int i = 0; i < 1; i++) {
                    JSONObject jSONObject = (JSONObject) jsonArray1.get(i);
                    for (int k = 0; k < jSONObject.size(); k++) {
                        Set<Map.Entry<String, Object>> entrySet = jSONObject.entrySet();
                        for (Map.Entry<String, Object> map : entrySet) {
//                            U.log(map.getKey()+"---"+map.getValue());
//                            U.log("INSIDE VRNO GEN1"+map.getKey().toString()+" value=="+map.getValue().toString());
                            if (map.getKey().equals("DYNAMIC_TABLE_SEQ_ID")) {
                                procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()) + "'");

                            } else if (map.getKey().equals("VRNO") && (map.getValue() == null || map.getValue().equals("null") || map.getValue().equals(""))) {

                                if (!generatedProdVRNO.isEmpty()) {
                                    procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + generatedProdVRNO + "'");
                                }
                            } else {
                                Object obj = map.getValue();
                                String val = "";
                                if (obj == null) {
                                    val = "";
                                } else {
                                    val = map.getValue().toString();
                                }
                                procedureOfInsert = procedureOfInsert.replace("'" + map.getKey()
                                        + "'", "'" + val.replaceAll("'", "''") + "'");
                            }
                            if (map.getKey().equalsIgnoreCase("PUSH_NOTIFICATION")) {
                                isNotificationSend = true;
                            }
                            if (map.getKey().equalsIgnoreCase("SEND_EMAIL")) {
                                isSendMail = true;
                            }
                            //Aniket 06-11-2019
                            
//                            if(map.getKey().equalsIgnoreCase("Flag")){
//                            if (!flag.equals("B")) {
//                                 SimpleDateFormat dateFormat = new SimpleDateFormat("MM-dd-yyyy");
//                                SimpleDateFormat outputFormat = new SimpleDateFormat("dd-MM-yyyy");
//                                date = dateFormat.parse(map.getValue().toString());
//                                vrdateFormat = outputFormat.format(date);
//                                procedureOfInsert = procedureOfInsert.replaceAll(map.getValue().toString(), vrdateFormat);
//                              }
//                            }

                        }

                    }

                    for (Map.Entry m : nondisplayColList.entrySet()) {
                        if (m.getValue() != null) {
//                U.log("::::" + m.getKey() + " " + m.getValue().toString().replace("'", "") + "\n" + defultValue.get("LASTUPDATE"));
                            procedureOfInsert = procedureOfInsert.replace("'" + m.getKey()
                                    + "'", "'" + m.getValue() + "'");
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
                            U.log(" execute_after_insert result >=0: " + result);
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
                            if (returnMessage.contains("insert data")) {
                                returnMessage = "insert data";
                            }
                            fileUploadStatus.setStatus(returnMessage);
                        } catch (Exception ex) {
                            fileUploadStatus.setStatus("Error occoured due to some internal reason.");
                        }
//                        U.errorLog(e);
//                        fileUploadStatus.setStatus("Error occoured due to some internal reason.");
                    }
                }
            } else {
//                fileUploadStatus = addInsertEntry(jsonString);
                if (isAddonTempEntry != null) {
                    table_name = isAddonTempEntry;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileUploadStatus;
    }

    public void getVrno(String jsonString) throws ParseException, Exception {
        JSONParser json_parser = new JSONParser();
        PreparedStatement ps1 = null;
        ResultSet rs1 = null;
        JSONObject json = (JSONObject) json_parser.parse(jsonString);
        Object obj = json_parser.parse(json.toString());
        JSONObject json_obj = new JSONObject();
        json_obj = (JSONObject) obj;
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
                e.printStackTrace();
                if (f.isNumber(obj.toString())) {
                    columnValue = null;
                } else {
                    columnValue = "";
                }
            }

            System.out.println(obj1.toString() + "=====" + columnValue.isEmpty() + "===" + isAddonTempEntry);
            if (obj1.toString().equals("VRNO") && columnValue.isEmpty() && isAddonTempEntry == null) {
                String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE \n"
                        + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )\n"
                        + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
                U.log("getAccYearSQL : " + getAccYearSQL);
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
                                U.errorLog("appendProdVRNO_SQL NOT EXECUTED PROPERLY : " + appendProdVRNO_SQL);
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
                if (isAddonTempEntry != null) {
                    U.log("series===>>>" + series);
                    generatedProdVRNO = series;
                }
                U.log("ELSE VRNO SECTION==================");
            }
        }
    }

//    public String insertImageIntoDocTran(String tableName, JSONObject imgJson, JSONObject mainJson, String docType) {
//
//        PreparedStatement ps = null;
//        ResultSet rs = null;
//        String docCode = "";
//        int docSLNO = 0;
//        String folderPath = null;
//        InputStream iss = null;
//        String doc_ref = "";
//        String status;
//
//        String docCodeVal = "";
//        String entryDate = "";
//        String[] tablearr = tableName.split("~");
//        try {
//
//            String[] colSlnoArr = null;
//            JSONArray jsonArray = new JSONArray();
//
//            String entityCode = "";
//            jsonArray = (JSONArray) mainJson.get("recordsInfo");
//            int jsonArrLength = jsonArray.size();
//
//            JSONObject jsobj = (JSONObject) jsonArray.get(0);
//            if (tablearr.length > 1) {
//                refColName = tablearr[1];
//            }
//
//            if (jsobj.containsKey(tablearr[1])) {
//                doc_ref = (String) jsobj.get(tablearr[1]);
//                docCode = doc_ref;
//            } else {
//                doc_ref = (String) jsobj.get("DOC_REF");
//
//            }
////            if (docType != null && docType != "undefined") {
////                docType = (String) jsobj.get("TRANTYPE");
////            }
//            entryDate = (String) jsobj.get("ON_DATE");
//
//            String user_code = (String) jsobj.get("USER_CODE");
//            String desc[] = new String[5];
//            desc[0] = (String) jsobj.get("REMARK");
//            if (imgJson.get("file") != null && imgJson.get("file").toString().length() > 3) {
//                /**
//                 * Getting REFKEY from Sequence
//                 */
//                try {
//                    String refKey = "select LHSSYS_REF_KEY.NEXTVAL ref_key from dual";
//                    ps = connection.prepareStatement(refKey);
//                    rs = ps.executeQuery();
//                    if (rs != null && rs.next()) {
//                        do {
//                            if (rs.getString(1) != null && !rs.getString(1).isEmpty()) {
//                                refKeyVal = rs.getString(1);
//                            }
//                        } while (rs.next());
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                } finally {
//                    if (ps != null) {
//                        try {
//                            ps.close();
//                        } catch (SQLException e) {
//                        }
//                    }
//                }
//                /**
//                 * *Getting Doc Code from Sequence**
//                 */
//                try {
//                    String refKey = "select LHSSYS_DOC_CODE.NEXTVAL from dual";
//                    ps = connection.prepareStatement(refKey);
//                    rs = ps.executeQuery();
//                    if (rs != null && rs.next()) {
//                        do {
//                            if (rs.getString(1) != null && !rs.getString(1).isEmpty()) {
//                                docCodeVal = rs.getString(1);
//                            }
//                        } while (rs.next());
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                } finally {
//                    if (ps != null) {
//                        try {
//                            ps.close();
//                        } catch (SQLException e) {
//                        }
//                    }
//                }
//
//                try {
//                    String refKeyQuery = "insert into lhssys_ref_key_tran (ref_key,ref_for,ref_key_type,ref_table_name,ref_master_pkey,ref_master_code,ref_entity_code,ref_tcode,ref_vrno,ref_slno,lastupdate,flag) values(?,?,?,?,?,?,?,?,?,null,sysdate,'')";
//                    ps = connection.prepareStatement(refKeyQuery);
//                    ps.setString(1, refKeyVal);
//                    ps.setString(2, "D");
//                    ps.setString(3, "B");
//                    ps.setString(4, tableName);
//                    ps.setString(5, user_code);
//                    ps.setString(6, refColName);
//                    ps.setString(7, (String) jsobj.get("ENTITY_CODE") != null ? (String) jsobj.get("ENTITY_CODE") : "");
//                    ps.setString(8, (String) jsobj.get("TCODE") != null ? (String) jsobj.get("TCODE") : "");
//                    ps.setString(9, (String) jsobj.get("VRNO") != null ? (String) jsobj.get("VRNO") : "");
//                    int ii = 0;
//                    ii = ps.executeUpdate();
//                    if (ii > 0) {
//                        U.log("Data inserted in  lhssys_ref_key_tran refKeyVal---->" + refKeyVal);
//                        docSLNO++;
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                    System.out.println("exeception lhssys_ref_key_tran---> " + e.getMessage());
//                    U.errorLog("exeception lhssys_ref_key_tran---> " + e.getMessage());
//                } finally {
//                    if (ps != null) {
//                        try {
//                            ps.close();
//                        } catch (SQLException ex) {
//                        }
//                    }
//                }
//                try {
//                    String date = (String) jsobj.get("ON_DATE") != null ? "to_date('" + (String) jsobj.get("ON_DATE") + "','dd-MM-yyyy HH24:MI:SS')" : "sysdate";
//                    String docMastQuery = "insert into doc_mast (doc_code,doc_name,doc_date,flag,user_code,lastupdate,doc_type,doc_detail,ref_key,key_code,key_mast) "
//                            + "values('" + docCodeVal + "','Image'," + date + ",'','" + user_code + "',sysdate,'" + docType + "',''," + refKeyVal + ",'','')";
//                    U.log("doc mast query ---> " + docMastQuery);
//                    ps = connection.prepareStatement(docMastQuery);
//
//                    int ii = 0;
//                    ii = ps.executeUpdate();
//                    if (ii > 0) {
//                        U.log("Data inserted in  doc_mast docCodeVal---->" + docCodeVal);
//                        docSLNO++;
//                    }
//
//                } catch (Exception e) {
//                    e.printStackTrace();
//                    U.errorLog("exeception docCodeVal---> " + e.getMessage());
//
//                } finally {
//                    if (ps != null) {
//                        try {
//                            ps.close();
//                        } catch (SQLException ex) {
//
//                        }
//                    }
//                }
//                try {
//                    String date = entryDate != null ? "to_date('" + entryDate + "','dd-MM-yyyy HH24:MI:SS')" : "sysdate";
//
//                    String docTranQuery = "insert into doc_tran(doc_code,doc_slno,doc_desc,file_path,file_name,review_date,file_code,user_code,lastupdate,review_by,file_date,physical_file_flag,doc_expiry_date,entity_code,entry_date) "
//                            + "values('" + docCodeVal + "',(SELECT count(doc_slno)+1 from doc_tran where doc_code='" + docCodeVal + "'),'" + (String) imgJson.get("desc") + "','','" + (String) imgJson.get("fileName") + "'," + "to_date('" + (String) imgJson.get("imageTime") + "','dd-MM-yyyy HH24:MI:SS'),'',''," + "to_date('" + (String) imgJson.get("imageTime") + "','dd-MM-yyyy HH24:MI:SS'),'','','" + entityCode + "'," + date + ",'','')";
//
//                    System.out.println("DocTran-------->" + docTranQuery);
//                    ps = connection.prepareStatement(docTranQuery);
//                    int ii = 0;
//                    ii = ps.executeUpdate();
//                    if (ii > 0) {
//                        U.log("Data inserted in  doc_tran docCodeVal---->" + docCodeVal);
//                    }
//                } catch (Exception e) {
//
//                } finally {
//                    if (ps != null) {
//                        try {
//                            ps.close();
//                        } catch (SQLException ex) {
//                            status = "IMAGE NOT INSERTED";
//                        }
//                    }
//                }
//
//                String base64Img = imgJson.get("file").toString();
//                byte[] imageByts = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
//                iss = new ByteArrayInputStream(imageByts);
//
//                BufferedImage buffImage = null;
//                String folderPathReplaced = "";
//                folderPathReplaced = folderPath;
//                String sqlDocumentInsert = "";
//                try {
//                    String date = (String) imgJson.get("imageTime") != null ? "to_date('" + (String) imgJson.get("imageTime") + "','dd-MM-yyyy HH24:MI:SS')" : "sysdate";
//
//                    String docTranImgQuery = "insert into doc_tran_image(doc_code,doc_slno,doc_image,file_id,entry_date,entity_code)"
//                            + " values(?,(select count(doc_slno)+1 from doc_tran_image where doc_code='" + docCodeVal + "'),?,''," + date + ",'" + (String) jsobj.get("ENTITY_CODE") + "')";
//                    ps = connection.prepareStatement(docTranImgQuery);
//                    System.out.println("docTranImgQuery------>" + docTranImgQuery);
//                    ps.setString(1, docCodeVal);
//                    ps.setBinaryStream(2, iss, iss.available());
//                    int ii = 0;
//                    ii = ps.executeUpdate();
//                    if (ii > 0) {
//                        U.log("Data inserted in  doc_tran_image docCodeVal---->" + docCodeVal);
//                    }
//                } catch (Exception e) {
//                    U.errorLog("exeception doc_tran_image---> " + e.getMessage());
//
//                } finally {
//                    if (ps != null) {
//                        try {
//                            ps.close();
//                        } catch (SQLException ex) {
//
//                        }
//                    }
//                }
//
//            }
//
//        } catch (Exception e) {
//            U.errorLog("exeception 15---> " + e.getMessage());
//        } finally {
//            if (ps != null) {
//                try {
//                    ps.close();
//                } catch (SQLException ex) {
//                    status = "IMAGE NOT INSERTED";
//                }
//            }
//        }
//        return refKeyVal;
//    }
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

    public void getCodegeneratedByTriggerForBody(FileUploadStatus fileUploadStatus) {
        try {
            PreparedStatement psz = connection.prepareStatement("SELECT LHS_CRM.GET_NEW_CODE FROM DUAL");
            ResultSet rsz = psz.executeQuery();
            String newVal = "";
            if (rsz.next()) {
                newVal = rsz.getString(1);
            }
            System.out.println("Code generated By Trigger while insert= " + newVal);
            if (table_name.equalsIgnoreCase("RETAILER_MAST")) {
                fileUploadStatus.setRetailerCode(newVal);
            }
            if (table_name.equalsIgnoreCase("CRM_CLIENT_MAST")) {
                fileUploadStatus.setClientCode(newVal);
            }
        } catch (Exception e) {

        }
    }

//   public void getCodegeneratedByTriggerForBody (FileUploadStatus fileUploadStatus)
//    {
//    try{
//          PreparedStatement psz = connection.prepareStatement("SELECT LHS_CRM.GET_NEW_CODE FROM DUAL");
//                    ResultSet rsz = psz.executeQuery();
//                    String newVal = "";
//                    if (rsz.next()) {
//                        newVal = rsz.getString(1);
//                    }
//                    U.log("Code generated By Trigger while insert= " + newVal);
//                    if(table_name.equalsIgnoreCase("RETAILER_MAST")){
//                    fileUploadStatus.setRetailerCode(newVal);
//                    }
//                     if(table_name.equalsIgnoreCase("CRM_CLIENT_MAST")){
//                    fileUploadStatus.setClientCode(newVal);
//                    }
//    }  catch(Exception e)
//    {
//        
//    }
//    }
//    public void sendNotification(JSONObject jsonobj, String seq_no) {
//
//        String user_str = "";
//        String notification_data_all = "";
//        String AUTH_KEY_FCM = "AAAAqTPM8z8:APA91bGVIagFqqDqxKRmp_8iq8VdxPX3yzkUIyp0URXoe6anWMgltTzX2QEyZ9klRYb1Y3jfGwUfb_S8prvVvJkYjLrU7fyGlbVJ07WlEWOp21cu3cW-M-dg8_1rQeSNygGe3WKzhoxL";
//        String API_URL_FCM = "https://fcm.googleapis.com/fcm/send";
////        String message = "";
//        String ref_lov_whr_clause = "";
////        String taskName = "";
//        JSONArray jsonArray = (JSONArray) jsonobj.get("recordsInfo");
//        JSONObject json_obj = (JSONObject) jsonArray.get(0);
//
//        System.out.println("json_obj--->" + json_obj);
//        System.out.println("VRNO------> " + generatedProdVRNO);
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
//
//                    if (ref_lov_whr_clause != null && !ref_lov_whr_clause.isEmpty()) {
//
//                        if (map.getKey().contains("VRNO")) {
//                            //System.out.println("Replaced VRNO");
//                            ref_lov_whr_clause = ref_lov_whr_clause.replace("'#VRNO#'", generatedProdVRNO != null ? "'" + generatedProdVRNO + "'" : "");
//                        }
//
//                        if (ref_lov_whr_clause.contains(map.getKey())) {
//                            ref_lov_whr_clause = ref_lov_whr_clause.replace("'#" + map.getKey() + "#'", map.getValue() != null ? "'" + map.getValue().toString() + "'" : "");
//                        }
//
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
//
//            String notifQuery = ref_lov_whr_clause;
//            System.out.println("notifQuery--------->" + notifQuery);
//            Statement stmt = connection.createStatement();
//            ResultSet rs = stmt.executeQuery(notifQuery);
//            System.out.println("resultset---" + rs.isBeforeFirst());
//            while (rs.next()) {
//                String user_token_no = rs.getString(1);
//                String message = rs.getString(2);
//                String notification_data = notification_data_all;
//                System.out.println("user_token_no----> " + user_token_no);
//                if (user_token_no != null && !user_token_no.isEmpty()) {
//                    if (notification_data.contains("TokenNo")) {
//                        notification_data = notification_data.replaceAll("TokenNo", user_token_no);
//                    }
//
//                    if (notification_data.contains("msgdata")) {
//                        notification_data = notification_data.replaceAll("'~msgdata'", message);
//                    }
//
//                    System.out.println("TokenNo-----> " + user_token_no);
//                    System.out.println("Notification Data----> " + notification_data);
//
//                    try {
//                        String authKey = AUTH_KEY_FCM; // You FCM AUTH key
//                        String FMCurl = API_URL_FCM;
//                        URL url = new URL(FMCurl);
//                        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//                        conn.setUseCaches(false);
//                        conn.setDoInput(true);
//                        conn.setDoOutput(true);
//                        conn.setRequestMethod("POST");
//                        conn.setRequestProperty("Authorization", "key=" + authKey);
//                        conn.setRequestProperty("Content-Type", "application/json");
//
//                        OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
//                        wr.write(notification_data);
//                        wr.flush();
//                        conn.getInputStream();
//                        int code = conn.getResponseCode();
//                        System.out.println("Response Code For Notif---->" + code);
//                    } catch (Exception e) {
//                        e.printStackTrace();
//                    }
//                }
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//    }
    public String insertImageIntoDocTran(String imgTableName, JSONObject imgJson, JSONObject mainJson, String table_name) {
        System.out.println("IMG JSON : " + imgJson);
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
            String docType = jsobj.get("DOC_TYPE") != null ? (String) jsobj.get("DOC_TYPE") : "";

            System.out.println("JSON_OBJ : " + jsobj);
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
//                        U.log("slno===>" + jsobj.get("SLNO").toString());
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
                    e.printStackTrace();
                    status = "IMAGE NOT INSERTED";
                }
                try {
                    String docMastQuery = "insert into doc_mast (doc_code,doc_name,doc_date,flag,user_code,lastupdate,doc_type,doc_detail,ref_key,key_code,key_mast) "
                            + "values('" + docCodeVal + "','Image'," + "to_date(sysdate,'dd-MM-yyyy HH24:MI:SS'),'','" + user_code + "',sysdate,'" + docType + "',''," + refKeyVal + ",'','')";
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
}
