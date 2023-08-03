/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
import com.lhs.EMPDR.entity.FileClass;
import com.lhs.EMPDR.entity.LoggerWrite;
import com.lhs.EMPDR.utility.U;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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
public class JDBCUpdateMultipleEntryDAO {

    String UPDATE_KEY;
    String UPDATE_KEY_VALUE;
    String base64Image;
    byte[] imageBytes;
    InputStream is;
    String table_name;
    Connection connection;
    String seq_no;
    StringBuffer valueString = new StringBuffer();
    Double seq_id;
    JSONObject imgJSON = new JSONObject();
    FileClass f = new FileClass();
    HashMap<String, String> videofileId = new HashMap<String, String>();
    HashMap<String, String> nondisplayColList = new HashMap<String, String>();
    HashMap<String, String> imgfileID = new HashMap<String, String>();
    HashMap<String, String> defultValue = new HashMap<String, String>();
    HashMap<String, String> columnStatus = new HashMap<String, String>();
    String USER_CODE;
    LoggerWrite log = new LoggerWrite();
    String isAddonTempEntry = null;
    String UNIQUE_KEY = null;

    public JDBCUpdateMultipleEntryDAO(Connection c) {
        this.connection = c;
        U u = new U(this.connection);
    }

    public void getDetailOfColumns() {
        PreparedStatement ps = null;
        ResultSet rs;
        StringBuffer sql = new StringBuffer();
        String seq_id1 = "";
        sql.append("select u.*,t.update_key,t.unique_clause from lhssys_portal_data_dsc_update u,lhssys_portal_table_dsc_update t where ");
        sql.append("u.seq_no=" + seq_no + " and t.seq_no=" + seq_no + " order by u.slno");
        U.log(sql.toString());
//        sql.append("select u.* from lhssys_portal_data_dsc_update u where ");
//        sql.append("seq_no=" + seq_no + "order by slno");
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
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
                    UPDATE_KEY = rs.getString("update_key");
                    UNIQUE_KEY = rs.getString("unique_clause");
                    columnStatus.put(rs.getString("column_name"), rs.getString("status"));
                } while (rs.next());
            }
        } catch (Exception e) {
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
    }
    String sysdate = "";

    public String UpdateEntry(String jsonString, String isAddonTempEntry, String headseqId, String updateKey) throws ParseException, Exception {

        //  jsonString = "{\"recordsInfo\":[{\"col1\":\"2\",\"col2\":\"SHASHANK\",\"col3\":\"BGCL5\",\"col4\":\"09-21-2016\",\"col5\":\"STRIN\",\"col6\":\"\",\"col7\":\"HM102\",\"col8\":\"remark22\",\"col9\":\"dsfgh\",\"col10\":\"\",\"col11\":\"\",\"col12\":\"\",\"USER_CODE\":\"SHASHANK\",\"seq_id\":102},{\"file\":null,\"fileName\":\"fileName1\",\"desc\":\"desc1\",\"sysFileName\":\"sysFileName1\"}]}";
//        Date date = new Date();
//        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
//         sysdate = formatter.format(date);
        String arr[] = null;
        if (updateKey != null) {
            arr = updateKey.split("#");
        }

        if (isAddonTempEntry != null) {
            this.isAddonTempEntry = isAddonTempEntry;
        }
        PreparedStatement ps1 = null;
        try {
            ps1 = connection.prepareStatement("select TO_CHAR(SYSDATE, 'DD-MM-YYYY HH24:MI:SS') as systemdate from dual");
            ResultSet rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                sysdate = rs1.getString(1);
            }
            defultValue.put("sysdate", sysdate);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (SQLException e) {
                }
            }
        }
        PreparedStatement ps = null;
        ResultSet rs;

        try {
//            U.log(jsonString);
//            LoggerWrite.logger.info(jsonString);

            JSONArray jsonArray = new JSONArray();
            //  U.log("jsonString==" + jsonString);
            JSONParser json_parser = new JSONParser();

            JSONArray listJsonArray = new JSONArray();

            JSONObject listjson = (JSONObject) json_parser.parse(jsonString);
            listJsonArray = (JSONArray) listjson.get("list");
            int listArrLength = listJsonArray.size();
//                    U.log("json length=" + listJsonArray.get(1).toString());
            for (int j = 0; j < listArrLength; j++) {
                String whereCond = "";

                valueString = new StringBuffer();
                StringBuffer stringBuffer = new StringBuffer();
                JSONObject json = (JSONObject) json_parser.parse(listJsonArray.get(j).toString());
                jsonArray = (JSONArray) json.get("recordsInfo");
                int jsonArrLength = jsonArray.size();

                //        JSONObject json = (JSONObject) json_parser.parse(jsonString);
                //        jsonArray = (JSONArray) json.get("recordsInfo");
                //        int jsonArrLength = jsonArray.size();
                U.log("json length=" + jsonArrLength);

                //     seq_id = (getDocumentListCount() + 1);
                for (int i = 0; i < 1; i++) {

                    JSONObject obj1 = (JSONObject) jsonArray.get(i);
                    seq_no = (obj1.get("dynamic_table_seq_id".toUpperCase()).toString());
                    if (obj1.get("SEQ_ID") != null) {
                        String seqId = (obj1.get("SEQ_ID")).toString();
                        try {
                            seq_id = Double.parseDouble(seqId.trim());
                        } catch (Exception e) {

                        }

                        U.log("*******seq_id exception ****" + seq_id + "   " + i);
                    }

                    getDetailOfColumns();

                    if (arr == null) {
                        if (UNIQUE_KEY != null) {
                            arr = UNIQUE_KEY.split("#");

                        }
                    }
                    if (arr != null) {
                        for (String s : arr) {
                            U.log("where clause string==>" + s);
                            try {
                                if (obj1.get(s).toString() != null) {
                                    if (whereCond.length() > 1) {

                                        whereCond = whereCond + " AND " + s + "='" + obj1.get(s).toString() + "'";
//                                        obj1.remove(s);
                                    } else {
                                        whereCond = whereCond + s + "='" + obj1.get(s).toString() + "'";
//                                        obj1.remove(s);
                                    }
                                }

                                U.log("where clause string==>" + whereCond);
                            } catch (Exception e) {
                                U.errorLog(e + "Exception in where cond");
                            }

                        }
                    }
                    U.log("nondisplay count=" + nondisplayColList.size());

                }

                Object obj = json_parser.parse(json.toString());
                JSONObject json_obj = new JSONObject();
                json_obj = (JSONObject) obj;
                parseJson(json_obj);
                //   Thread.sleep(1000);

                U.log("*******HASHMAP****");
//                for (String key : imgfileID.keySet()) {
//                    U.log(key.toString() + " " + imgfileID.get(key).toString());
//                }

                {
                    for (int i = 1; i < jsonArrLength; i++) {
                        JSONObject obj1 = (JSONObject) jsonArray.get(i);

                        if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
                            U.log("pppp *********");
                            /* base64Image = obj1.get("file").toString();
                        imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
                        is = new ByteArrayInputStream(imageBytes);*/
                            is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
                            //(int) Float.parseFloat(imgfileID.get(obj1.get("fileId")))
                            U.log(obj1.get("fileName").toString() + "=" + USER_CODE + "=" + obj1.get("desc").toString() + "=" + obj1.get("sysFileName").toString());
                            if (obj1.get("fileId").toString().equalsIgnoreCase("ATTACHMENT")) {
                                updateTBAttachment(jsonArray, obj1.get("file").toString(), whereCond);
                            } else {
                                updateDocument(Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())), obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(), obj1.get("sysFileName").toString(), is);
                            }
                        }
                        if (obj1.get("videofile") != null && obj1.get("videofile").toString().length() > 3) {
                            // U.log("pppp *********"+obj1.get("videofile") );
                            base64Image = obj1.get("videofile").toString().split(",")[1];
                            imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
                            is = new ByteArrayInputStream(imageBytes);
                            //(int) Float.parseFloat(imgfileID.get(obj1.get("fileId")))
                            U.log(obj1.get("videoFileName").toString() + "=" + USER_CODE + "=" + obj1.get("videoDesc").toString() + "=" + obj1.get("sysFileName").toString());
                            U.log(Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                            if (is == null) {
                                U.log("video file is null");
                            }
                            updateVideo(obj1.get("videoFileName").toString(), USER_CODE, obj1.get("videoDesc").toString(), obj1.get("sysFileName").toString(), is, Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                        }
                        // U.log("&&&&&&&&&&&&&&&&&&&\n"+obj1.get("fileName1").toString()+"=="+  USER_CODE+"=="+  obj1.get("fileName1").toString()+"=="+ "obj1.get(4).toString()");
                    }

                    //  U.log("===" + colName + "\n====" + colValue + "\n===" + imgJSON.toString());
                    //apend default value
                    for (Map.Entry m : nondisplayColList.entrySet()) {
                        if (m.getValue() != null) {

                            String predefinedVal = defultValue.get(m.getKey());
                            if (predefinedVal == null) {
                                predefinedVal = m.getValue().toString();
                            }

                            U.log("nondisplay key=" + m.getKey().toString());
                            if (m.getKey().toString().contains("LASTUPDATE")) {
                                predefinedVal = "to_date('" + sysdate + "','dd-MM-yyyy HH24:MI:SS')";
                            } else {
                                predefinedVal = "'" + predefinedVal + "'";
                            }
                            U.log(m.getKey() + " " + m.getValue().toString().replace("'", ""));
                            System.out.println("TABLE : " + table_name);
                            if (m.getKey().toString().equalsIgnoreCase("ATTACHMENT")) {
                            } else {
                                valueString.append(m.getKey() + "=" + predefinedVal + ",");
                            }

                        }
                    }
                    if (isAddonTempEntry != null) {
                        table_name = isAddonTempEntry;
                        if (headseqId != null) {
                            seq_id = Double.parseDouble(headseqId);
                        }
                    }

                    String vaString = valueString.toString().substring(0, valueString.toString().lastIndexOf(","));

                    vaString = vaString.toString().replace("dispatch_item", "item_code");
                    U.log("unique key---" + UNIQUE_KEY + "---updatekey---" + updateKey);
                    if (UNIQUE_KEY != null) {

                        stringBuffer.append("update " + table_name + "\n"
                                + " set " + vaString + " where 1=1 And " + whereCond);
                    } else {
                        if (whereCond.length() > 1) {
                            stringBuffer.append("update " + table_name + "\n"
                                    + " set " + vaString + " where " + whereCond);
                        } else {
                            stringBuffer.append("update " + table_name + "\n"
                                    + " set " + vaString + " where seq_id=" + seq_id);
                        }

                    }

                    U.log("query===" + stringBuffer.toString());
                    try {
                        ps = connection.prepareStatement(stringBuffer.toString());

                        // ps.setString(1, remark);
                        int n = ps.executeUpdate();
                        String result = n + "=rows are updated";
                        U.log("result==" + result);
                    } catch (Exception e) {
                        U.errorLog(e);
                        return "Error occoured due to some internal reason";
                    } finally {
                        connection.commit();
                    }
                }
            }
            return "updated data";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error occoured due to some internal reason";

        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    return "Error occoured due to some internal reason";
                }
            }
        }

    }

    public String DeleteEntry(String jsonString, String isAddonTempEntry, String headseqId, String updateKey) throws ParseException, Exception {

        String arr[] = null;
        if (updateKey != null) {
            arr = updateKey.split("#");
        }
        if (isAddonTempEntry != null) {
            this.isAddonTempEntry = isAddonTempEntry;
        }
        PreparedStatement ps1 = null;
        try {
            ps1 = connection.prepareStatement("select TO_CHAR(SYSDATE, 'DD-MM-YYYY HH24:MI:SS') as systemdate from dual");
            ResultSet rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                sysdate = rs1.getString(1);
            }
            defultValue.put("sysdate", sysdate);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (SQLException e) {
                }
            }
        }
        PreparedStatement ps = null;
        ResultSet rs;

        try {

            JSONArray jsonArray = new JSONArray();
            JSONParser json_parser = new JSONParser();

            JSONArray listJsonArray = new JSONArray();

            JSONObject listjson = (JSONObject) json_parser.parse(jsonString);
            U.log("jsonString==" + (JSONArray) listjson.get("list"));
            listJsonArray = (JSONArray) listjson.get("list");
            int listArrLength = listJsonArray.size();
            for (int j = 0; j < listArrLength; j++) {
                String whereCond = "";
                valueString = new StringBuffer();
                StringBuffer stringBuffer = new StringBuffer();
                JSONObject json = (JSONObject) json_parser.parse(listJsonArray.get(j).toString());
                jsonArray = (JSONArray) json.get("recordsInfo");
                int jsonArrLength = jsonArray.size();
                U.log("json length=" + jsonArrLength);
                for (int i = 0; i < 1; i++) {
                    JSONObject obj1 = (JSONObject) jsonArray.get(i);
                    seq_no = (obj1.get("dynamic_table_seq_id".toUpperCase()).toString());
                    if (obj1.get("dynamic_table_seq_id") != null) {
                        obj1.remove("dynamic_table_seq_id");
                    }
                    if (obj1.get("SEQ_ID") != null) {
                        String seqId = (obj1.get("SEQ_ID")).toString();
                        seq_id = Double.parseDouble(seqId.trim());
//                        whereCond=whereCond+" seq_id='"+seq_id+"'";
                        U.log("*******seq_id exception ****" + seq_id + "   " + i);
                    }

                    getDetailOfColumns();
                    if (arr == null) {
                        if (UNIQUE_KEY != null) {
                            arr = UNIQUE_KEY.split("#");

                        }
                    }

                    if (arr != null) {
                        for (String s : arr) {
                            try {
                                if (obj1.get(s).toString() != null) {
                                    if (whereCond.length() > 1) {

                                        whereCond = whereCond + " AND " + s + "='" + obj1.get(s).toString() + "'";
                                        obj1.remove(s);
                                    } else {
                                        whereCond = whereCond + s + "='" + obj1.get(s).toString() + "'";
                                        obj1.remove(s);
                                    }
                                }
                            } catch (Exception e) {
                                U.errorLog("Exception in where cond");
                            }

                        }
                    }

                }

                Object obj = json_parser.parse(json.toString());
                JSONObject json_obj = new JSONObject();
                json_obj = (JSONObject) obj;
                parseJson(json_obj);

                for (String key : imgfileID.keySet()) {
                    U.log(key.toString() + " " + imgfileID.get(key).toString());
                }
                {
                    for (int i = 1; i < jsonArrLength; i++) {
                        JSONObject obj1 = (JSONObject) jsonArray.get(i);

                    }

                    if (isAddonTempEntry != null) {
                        table_name = isAddonTempEntry;
                        if (headseqId != null) {
                            seq_id = Double.parseDouble(headseqId);
                        }
                    }

                    stringBuffer.append("delete from  " + table_name + "\n"
                            + " where " + whereCond);

                    U.log("query===" + stringBuffer.toString());
                    try {
                        ps = connection.prepareStatement(stringBuffer.toString());
                        int n = ps.executeUpdate();
                        String result = n + "=rows are deleted";
                        U.log("result==" + result);
                    } catch (Exception e) {
                        U.errorLog(e);
                        return "Error occoured due to some internal reason";
                    } finally {
                        connection.commit();
                    }
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
        return "deleted data";
    }

    public int updateDocument(float fileId, String fileName, String userCode, String discribtion, String systemFileName, InputStream fin) throws Exception {
        int status = 0;
        U.log("updateDocument");

        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
//            int fileId = getDocumentListCount();
//
//            fileId = (fileId+1) * (-1);

            U.log(userCode + "=file id =" + fileId);
            sqlDocumentInsert = "update LHSSYS_portal_upload_file set FILE_ID=?,FILE_NAME=?,UPLOADATE_DATE=sysdate,LAST_UPDATED=sysdate,DESCRIBTION=?,USER_CODE=?,FLAG='h',SYSTEM_FILE_NAME=?,STORE_FILE_LRAW=? where file_id=" + fileId;

            U.log("compile qry == " + sqlDocumentInsert);

            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setFloat(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());

            status = pst.executeUpdate();
            U.log("result------" + status);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException e) {
                }
            }
        }
        return status;

    }

    public void getArray(Object object2) throws ParseException {

        JSONArray jsonArr = (JSONArray) object2;

        for (int k = 0; k < jsonArr.size(); k++) {

            if (jsonArr.get(k) instanceof JSONObject) {
                // U.log("kk==" + jsonArr.get(k));
                parseJson((JSONObject) jsonArr.get(k));
            } else {

                //U.log("k=" + jsonArr.get(k));
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
                U.log("==" + obj.toString());
                getArray(jsonObject.get(obj));
            } else if (jsonObject.get(obj) instanceof JSONObject) {
                // U.log("1="+obj.toString());
                parseJson((JSONObject) jsonObject.get(obj));
            } else {

                U.log(obj.toString() + "\t"
                        + jsonObject.get(obj));

                if (setdataCount == 0) {
                    try {

                        setDatatype(seq_no);
                        setdataCount++;
                    } catch (Exception e) {
                        U.errorLog(e);
                    }
                }
                //multimap
                if (obj.toString().toLowerCase().contains("col2")) {
                    USER_CODE = jsonObject.get(obj).toString();
                    defultValue.put("USER_CODE", USER_CODE);
                }

                if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES") && !obj.toString().contains("imageTime")
                        && !obj.toString().contains("video") && !obj.toString().contains("file") && !obj.toString().contains("fileName")
                        && !obj.toString().contains("desc") && !obj.toString().contains("sysFileName") && !obj.toString().equals("SAVE_FLAG")) {

                    if (columnStatus.get(obj) != null && columnStatus.get(obj).equalsIgnoreCase("D") || columnStatus.get(obj).equalsIgnoreCase("I")) {
                    } else {
                        valueString.append(obj.toString() + "=");
                        String columnValue = "";
                        try {
                            columnValue = jsonObject.get(obj).toString();
                            U.log("columnValue===" + columnValue);
                        } catch (Exception e) {
                            // U.log(e);
                            columnValue = "";
                        }
                        //  if (obj.toString().contains("SEQ_ID") || obj.toString().contains("LASTUPDATE")) {

                        if (f.isNumber(obj.toString())) {
                            if (obj.toString().toUpperCase().contains("SEQ_ID")) {
                                //colValue.append(seq_id + ",");
                                U.log((f.isNumber(obj.toString())) + "==sequence id=" + Double.parseDouble(jsonObject.get(obj).toString()));
                                seq_id = Double.parseDouble(jsonObject.get(obj).toString());
                                columnValue = seq_id + "";
                            }

                            if (jsonObject.get(obj) == null) {
                                columnValue = null;
                            }
//                        if(f.isImg(obj.toString())){
//                            U.log("*&*&*lllll&*&*&*&&*"+obj.toString().replaceAll("col", ""));
//                            //colValue.append(seq_id * (-1) + "."+obj.toString().replaceAll("[a-z A-Z]+", ""));
//                      columnValue=seq_id * (-1) + "."+obj.toString().replaceAll("[a-z A-Z]+", "");
//                        }
                            valueString.append(columnValue + ",");

                        } else {

                            if (f.isImg(obj.toString()) && seq_id != null) {
//                                U.log(seq_id + "*&*&*&*&*&*&&*" + obj.toString());
                                columnValue = seq_id * (-1) + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                                imgfileID.put(obj.toString(), columnValue);
                                // colValue.append(seq_id * (-1) + "."+obj.toString().replaceAll("[a-z A-Z]+", ""));
                            }
                            if (f.isVideo(obj.toString())) {
                                U.log("*&*&*&*&*&*&&*" + obj.toString());
                                columnValue = seq_id * (-1) + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                                videofileId.put(obj.toString(), columnValue);
                                // colValue.append(seq_id * (-1) + "."+obj.toString().replaceAll("[a-z A-Z]+", ""));
                            }
                            if (f.isSysDate(obj.toString())) {
                                U.log("*&*&*&*&*&*&&*" + obj.toString());
                                columnValue = "to_date('" + sysdate + "','dd-MM-yyyy HH24:MI:SS')";

                                // colValue.append(seq_id * (-1) + "."+obj.toString().replaceAll("[a-z A-Z]+", ""));
                            }
                            if (obj.toString().contains("DATE") || obj.toString().contains("date")) {
                                valueString.append("to_date('" + columnValue + "','dd-mm-yyyy HH24:MI:SS'),");
                            } else {
                                valueString.append("'" + columnValue + "',");
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

        U.log("set data type=" + col1);
        //  int  col1=1;
        String sql = " select * from LHSSYS_PORTAL_DATA_DSC_UPDATE \n"
                + " where seq_no=" + col1 + " order by to_number (slno)";
        U.log("sql i=" + sql);
//              " select f.store_file,seq_no,Table_name,column_name,column_desc,column_type,column_size,column_catg,column_default_value,nullable,status,entry_by_user,updation_process , dependent_row,Dependent_row_logic,item_help_property,REF_LOV_TABLE_COL,REF_LOV_WHERE_CLAUSE,column_select_list_value,nullable from  LHSSYS_PORTAL_UPLOAD_FILE f,LHSSYS_PORTAL_DATA_DSC_UPDATE\n"
//                    + "where seq_no="+seqNo+" and f.file_id="+fileId;

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
                    //U.log("table_name i=" + rs.getString("column_name"));
                    f.addInmap(rs.getString("column_name"), rs.getString("column_type"));
                    f.addInmap(rs.getString("column_name"), rs.getString("column_default_value"));
                    f.addInmap(rs.getString("column_name"), rs.getString("Item_help_property"));

                } while (rs.next());
            }
        } catch (Exception e) {
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
    }

    public int updateVideo(String fileName, String userCode, String discribtion, String systemFileName, InputStream fin, float fileId) throws Exception {
        int status = 0;
        U.log("updateDocument");

        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
//            int fileId = getDocumentListCount();
//
//            fileId = (fileId+1) * (-1);

            U.log(userCode + "=file id =" + fileId);
            sqlDocumentInsert = "update LHSSYS_portal_upload_file set FILE_ID=?,FILE_NAME=?,UPLOADATE_DATE=sysdate,LAST_UPDATED=sysdate,DESCRIBTION=?,USER_CODE=?,FLAG='h',SYSTEM_FILE_NAME=?,STORE_FILE_LRAW=? where file_id=" + fileId;

            U.log("compile qry == " + sqlDocumentInsert);

            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setFloat(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());

            status = pst.executeUpdate();
            U.log("result------" + status);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException e) {
                }
            }
        }
        return status;
    }

    public InputStream writeOnImage(String image, String imgdate) {
        U.log("ready to write on image");
        U.log("Image Date received from app with update flag : " + imgdate);
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
            String base64Image = image;//.split(",")[1];
            byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
            iss = new ByteArrayInputStream(imageBytes);
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
            graphics.drawString(formatter.format(date), 25, 25);
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

    public void updateTBAttachment(JSONArray json, String img, String whereString) {
        System.out.println("JSON DATA: " + json);

        JSONObject obj1 = (JSONObject) json.get(0);
        String VRNO = obj1.get("VRNO").toString();
        String ENTITY_CODE = obj1.get("ENTITY_CODE").toString();
        String TCODE = obj1.get("TCODE").toString();
        String SLNO = obj1.get("SLNO").toString();
        try {
            String deleteQry = "delete from EMP_TB_ATTACHMENT where VRNO='" + VRNO + "' and ENTITY_CODE='" + ENTITY_CODE
                    + "' and TCODE='" + TCODE + "' and SLNO_TB_BODY='" + SLNO + "' and SEND_INFORMATION_ID = '0' and SLNO = '1'";
            System.out.println("DELETE QRY : " + deleteQry);
            PreparedStatement deletePrepare = connection.prepareStatement(deleteQry);
            int c = deletePrepare.executeUpdate();
            System.out.println("" + c + "  Records Deleted..!!");
        } catch (Exception e) {
        }

        InputStream iss = null;
        String base64Img = img;
        byte[] imageByts = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
        iss = new ByteArrayInputStream(imageByts);
        String updateAttach = "INSERT INTO EMP_TB_ATTACHMENT (entity_code, \n"
                + "tcode, \n"
                + "vrno, \n"
                + "slno, \n"
                + "slno_tb_body, \n"
                + "attachment, \n"
                + "remark, \n"
                + "send_information_id, \n"
                + "file_name, \n"
                + "send_informationid_slno, \n"
                + "doc_type, \n"
                + "lastupdate) values(?,?,?,?,?,?,?,?,?,?,?, sysdate)";
        System.out.println("QRY : " + updateAttach);
        try {
            PreparedStatement pst = connection.prepareStatement(updateAttach);
            pst.setString(1, ENTITY_CODE);
            pst.setString(2, TCODE);
            pst.setString(3, VRNO);
            pst.setString(4, "1");
            pst.setString(5, SLNO);
            pst.setBinaryStream(6, iss, iss.available());
            pst.setString(7, "");
            pst.setString(8, "0");
            pst.setString(9, "");
            pst.setString(10, "");
            pst.setString(11, "");
            int t = pst.executeUpdate();
            if (t > 0) {
                System.out.println(t + " Record Inserted Successfully..");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
