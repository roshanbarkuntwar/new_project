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
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
public class JDBCupdateHotSeatEntryDyanmicDAO {

    String base64Image;
    byte[] imageBytes;
    InputStream is;
    String table_name;
    Connection connection;
    String seq_no;
    StringBuffer valueString = new StringBuffer();
//    int seq_id;
    String dependent_next_entry_seq = null;
    JSONObject imgJSON = new JSONObject();
    FileClass f = new FileClass();
    HashMap<String, String> videofileId = new HashMap<String, String>();
    HashMap<String, String> nondisplayColList = new HashMap<String, String>();
    HashMap<String, String> imgfileID = new HashMap<String, String>();
    HashMap<String, String> defultValue = new HashMap<String, String>();
    String USER_CODE;
    LoggerWrite log = new LoggerWrite();
    String UPDATE_KEY;
    String UPDATE_KEY_VALUE;

    public JDBCupdateHotSeatEntryDyanmicDAO(Connection c) {
        this.connection = c;
    }

    public void getDetailOfColumns() {
        PreparedStatement ps = null;
        ResultSet rs;
        String dsql = "select seq_no from LHSSYS_PORTAL_TABLE_DSC_UPDATE where dependent_next_entry_seq = " + seq_no;

        System.out.println("Query to get dependent_next_entry_seq :  " + dsql);

        try {
            ps = connection.prepareStatement(dsql.toString());

            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                dependent_next_entry_seq = rs.getString(1);

            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }

        }

        StringBuffer sql = new StringBuffer();
        sql.append("select u.*,t.update_key from lhssys_portal_data_dsc_update u,lhssys_portal_table_dsc_update t where ");
        sql.append("u.seq_no=");

        if (dependent_next_entry_seq != null) {
            sql.append(dependent_next_entry_seq + "and t.seq_no=" + dependent_next_entry_seq + " order by slno");
        } else {
            sql.append(seq_no + "and t.seq_no=" + seq_no + "order by slno");
        }

        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {

            ps = connection.prepareStatement(sql.toString());

            rs = ps.executeQuery();

            if (rs != null && rs.next()) {

                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    table_name = rs.getString("table_name");
                    UPDATE_KEY = rs.getString("update_key");
                    if (rs.getString("status") != null && rs.getString("status").contains("F")) {
                        // if (rs.getString("status").contains("F")) {
                        nondisplayColList.put(rs.getString("column_name"), rs.getString("column_default_value"));
                        // }
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
                    U.log(e);
                }
            }

        }
    }
    String sysdate = "";

    public String UpdateGivenEntry(String jsonString, String entity) throws ParseException, Exception {
        U.log("jsonstring***==" + jsonString);

        insrtRefKeyDocMast(entity);

        String returnREsult = "updated data";
        String procedureOfUpadte = "";

        JSONArray jsonArray = new JSONArray();

        JSONParser json_parser = new JSONParser();

        JSONObject json = (JSONObject) json_parser.parse(jsonString);
        jsonArray = (JSONArray) json.get("recordsInfo");
        JSONObject obj1 = (JSONObject) jsonArray.get(0);

        U.log("dynamic_table_seq_id===" + seq_no);

        String chkupdateFlag = "select execute_after_update from lhssys_portal_table_dsc_update where seq_no=" + seq_no;
        PreparedStatement ps1 = null;
        try {
            ps1 = connection.prepareStatement(chkupdateFlag);
            ResultSet rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                procedureOfUpadte = rs1.getString(1);
                System.out.println("procedure==" + procedureOfUpadte);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
        }
        if (procedureOfUpadte != null && procedureOfUpadte.length() > 2) {

            seq_no = (obj1.get("dynamic_table_seq_id".toUpperCase()).toString());
            String statusFlag = (obj1.get("status_flag").toString());
            procedureOfUpadte = procedureOfUpadte.replace("'status_flag'", "'" + statusFlag + "'");
            procedureOfUpadte = procedureOfUpadte.replace("seq_no", seq_no);
            PreparedStatement ps = null;
            ResultSet rs;

            try {
                ps = connection.prepareStatement(procedureOfUpadte);
//                connection.setAutoCommit(true);

                // ps.setString(1, remark);
                int n = ps.executeUpdate();
                String result = n + "=rows are updated";

                System.out.println("result==" + result);
            } catch (Exception e) {

                U.log(e);
                return "Error occoured sue to some internal reason.";
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (Exception e) {
                        U.log(e);
                    }
                }
            }
        } else {
            UpdateEntry(jsonString, entity);
        }
        return returnREsult;

    }

    public String UpdateEntry(String jsonString, String entity) throws ParseException, Exception {
        PreparedStatement ps1 = null;
        try {
            ps1 = connection.prepareStatement("select TO_CHAR(sysdate, 'DD-MM-YYYY HH24:MI:SS') as systemdate from dual");
            ResultSet rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                sysdate = rs1.getString(1);
            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
        }
        defultValue.put("sysdate", sysdate);

        StringBuffer stringBuffer = new StringBuffer();
        PreparedStatement ps = null;
        ResultSet rs;
        LoggerWrite.logger.info(jsonString);

        try {

            JSONArray jsonArray = new JSONArray();
            JSONParser json_parser = new JSONParser();

            JSONObject json = (JSONObject) json_parser.parse(jsonString);
            jsonArray = (JSONArray) json.get("recordsInfo");
            int jsonArrLength = jsonArray.size();
            U.log("json length :   " + jsonArrLength);

            for (int i = 0; i < 1; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);
                seq_no = (obj1.get("dynamic_table_seq_id".toUpperCase()).toString());
                U.log("dynamic_table_seq_id : " + seq_no);

                getDetailOfColumns();

                if (obj1.get(UPDATE_KEY) != null) {
                    String seqId = (obj1.get(UPDATE_KEY)).toString();
                    UPDATE_KEY_VALUE = seqId.trim();
                    U.log("UPDATE_KEY_VALUE :  " + UPDATE_KEY_VALUE + " | FOR LOOP INSTANCE :  " + i);
                }

                U.log("COUNT OF CONTROLS HAVING STATUS FALSE :  " + nondisplayColList.size());
            }

            Object obj = json_parser.parse(json.toString());
            JSONObject json_obj = new JSONObject();
            json_obj = (JSONObject) obj;
            parseJson(json_obj);
            for (String key : imgfileID.keySet()) {
                System.out.println(key.toString() + " " + imgfileID.get(key).toString());
            }
            {
                for (int i = 1; i < jsonArrLength; i++) {
                    JSONObject obj1 = (JSONObject) jsonArray.get(i);
                    if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
                        is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
                        U.log("fileName : " + obj1.get("fileName").toString() + "  USER_CODE :  " + USER_CODE + "  desc  :  " + obj1.get("desc").toString()
                                + "   sysFileName  :  " + obj1.get("sysFileName").toString());
                        U.log("imgfileID : " + imgfileID.get(obj1.get("fileId").toString()) + "   FileID : " + obj1.get("fileId").toString());
                        U.log("imgfileID : " + Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())));
                        if (dependent_next_entry_seq != null) {
                            insertDocument(obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(), obj1.get("sysFileName").toString(), is, Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())), entity);
                        } else {
                            updateDocument(Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())),
                                    obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
                                    obj1.get("sysFileName").toString(), is);
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
                        System.out.println(predefinedVal + " ***********  " + m.getKey() + " " + m.getValue().toString().replace("'", ""));
                        valueString.append(m.getKey() + "=" + predefinedVal + ",");

                    }
                }

                String vaString = valueString.toString().substring(0, valueString.toString().lastIndexOf(","));
                stringBuffer.append("update " + table_name + "\n"
                        + " set " + vaString + " where " + UPDATE_KEY + "='" + UPDATE_KEY_VALUE + "'");

                System.out.println("query::===" + stringBuffer.toString());
                try {
                    ps = connection.prepareStatement(stringBuffer.toString());
                    int n = ps.executeUpdate();
                    String result = n + "=rows are updated";

                    System.out.println("result==" + result);
                } catch (SQLException e) {
                    U.log(e);
                    return "Error occoured sue to some internal reason.";
                }
            }
        } catch (SQLException e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
        }
        U.log(":::updated data");
        return "updated data";
    }

    public int updateDocument(float fileId, String fileName, String userCode, String discribtion, String systemFileName, InputStream fin) {
        int status = 0;
        System.out.println("updateDocument");

        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            System.out.println("userCode : " + userCode + "    file id :  " + fileId);
            sqlDocumentInsert = "update LHSSYS_portal_upload_file set FILE_ID=?,FILE_NAME=?,"
                    + "UPLOADATE_DATE=sysdate,LAST_UPDATED=sysdate,DESCRIBTION=?,USER_CODE=?,"
                    + "FLAG='h',SYSTEM_FILE_NAME=?,STORE_FILE=? where file_id=" + fileId;

            System.out.println("Update Image Query :  " + sqlDocumentInsert);

            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setFloat(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());

            status = pst.executeUpdate();
            System.out.println("Update Image Result  :  " + status);
        } catch (IOException e) {
            U.log(e);
        } catch (SQLException e) {
            U.log(e);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (Exception e) {
                    U.log(e);
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
                if (setdataCount == 0) {
                    try {
                        if (dependent_next_entry_seq != null) {
                            setDatatype(dependent_next_entry_seq);
                        } else {
                            setDatatype(seq_no);
                        }
                        setdataCount++;
                    } catch (SQLException e) {
                        U.log(e);
                    }
                }
                if (U.match(obj.toString().toLowerCase(), "col[2]{1}$", 0) != null) {
                    USER_CODE = jsonObject.get(obj).toString();
                    defultValue.put("USER_CODE", USER_CODE);
                }

                if (!obj.toString().contains("imageTime") && !obj.toString().contains("video")
                        && !obj.toString().contains("file") && !obj.toString().contains("fileName")
                        && !obj.toString().contains("desc") && !obj.toString().contains("sysFileName")) {
                    if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID")) {
                        valueString.append(obj.toString() + "=");
                    }
                    String columnValue = "";
                    try {
                        columnValue = jsonObject.get(obj).toString();
                    } catch (Exception e) {
                        columnValue = "";
                    }
                    if (f.isNumber(obj.toString())) {
                        if (obj.toString().toUpperCase().contains("SEQ_ID")) {
                            U.log((f.isNumber("sequence id  :  " + obj.toString())) + "\t    sequence id value : "
                                    + Integer.parseInt(jsonObject.get(obj).toString()));
                            UPDATE_KEY_VALUE = jsonObject.get(obj).toString();
                            columnValue = UPDATE_KEY_VALUE + "";
                        }
                        if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID")) {
                            valueString.append(columnValue + ",");
                        }

                    } else {

                        if (f.isImg(obj.toString())) {
                            U.log("UPDATE_KEY_VALUE :  " + UPDATE_KEY_VALUE + "\t COLUMN : " + obj.toString());
//                            columnValue = -1 + UPDATE_KEY_VALUE + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                            columnValue = "-" + UPDATE_KEY_VALUE + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                            System.out.println("GENERATED IMG FILE ID : " + columnValue);
                            imgfileID.put(obj.toString(), columnValue);
                        }
                        if (f.isVideo(obj.toString())) {
                            U.log("*&*&*&*&*&*&&*" + obj.toString());
//                            columnValue = -1 + UPDATE_KEY_VALUE + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                            columnValue = "-" + UPDATE_KEY_VALUE + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                            System.out.println("GENERATED VIDEO FILE ID : " + columnValue);
                            videofileId.put(obj.toString(), columnValue);
                        }
                        if (f.isSysDate(obj.toString())) {
                            columnValue = sysdate;
                        }
                        if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID")) {
                            valueString.append("'" + columnValue + "',");
                        }
                    }
                } else {
                    imgJSON.put(obj.toString(), jsonObject.get(obj));
                }
            }
        }

    }

    public void setDatatype(String col1) throws SQLException {

        U.log("set data type : " + col1);
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
                    U.log("COLUMN DATATYPE : " + rs.getString("column_type") + "| CLOUMN NAME :  " + rs.getString("column_name"));
                    f.addInmap(rs.getString("column_name"), rs.getString("column_type"));
                    f.addInmap(rs.getString("column_name"), rs.getString("column_default_value"));
                    f.addInmap(rs.getString("column_name"), rs.getString("Item_help_property"));

                } while (rs.next());
            }
        } catch (SQLException e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
        }
    }

    public int updateVideo(String fileName, String userCode, String discribtion, String systemFileName, InputStream fin, float fileId) throws Exception {
        int status = 0;
        System.out.println("UPDATE VIDEO");

        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            sqlDocumentInsert = "update LHSSYS_portal_upload_file set FILE_ID=?,FILE_NAME=?,"
                    + "UPLOADATE_DATE=sysdate,LAST_UPDATED=sysdate,DESCRIBTION=?,USER_CODE=?,"
                    + "FLAG='h',SYSTEM_FILE_NAME=?,STORE_FILE=? where file_id=" + fileId;

            System.out.println("VIDEO UPDATE QUERY  :   " + sqlDocumentInsert);

            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setFloat(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());

            status = pst.executeUpdate();
            System.out.println("VIDEO UPDATE RESULT  : " + status);
        } catch (IOException e) {
            U.log(e);
        } catch (SQLException e) {
            U.log(e);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
        }
        return status;
    }

    public InputStream writeOnImage(String image, String imgdate) {
        U.log("ready to write on image");
        String appImageUpdateFlag = "T";
        String appImageDate = imgdate;
        if (imgdate.contains("~")) {
            String imgdateArray[] = imgdate.split("~~");
            System.out.println("Image Date received from app : " + imgdateArray[0]);
            System.out.println("Image update flag received from app : " + imgdateArray[1]);

            appImageDate = imgdateArray[0];
            appImageUpdateFlag = imgdateArray[1];
        }

        InputStream iss = null;
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
//            Date date = formatter.parse(appImageDate);
            Date date = formatter.parse(imgdate);
            //byte to bufferedImage
            String base64Imagee = image;//.split(",")[1];
            byte[] imageBytess = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Imagee);
            iss = new ByteArrayInputStream(imageBytess);
            BufferedImage bi = ImageIO.read(iss);
            Graphics2D graphics = bi.createGraphics();
            Font font = new Font("ARIAL", Font.PLAIN, 20);
            graphics.setFont(font);
            graphics.setColor(Color.WHITE);
            String overlapString = formatter.format(date);
            System.out.println("overlapString : " + overlapString);
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
            U.log(e);
        }
        return iss;
    }

    public int nextRefKey() throws Exception {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int listCount = 0;
        try {
            String selectQry = "select LHSSYS_REF_KEY.nextval from dual";
            U.log("Get LHSSYS_REF_KEY query :  " + selectQry);
            pst = connection.prepareStatement(selectQry);
            rs = pst.executeQuery();
            while (rs.next()) {
                listCount = rs.getInt(1);
            }
        } catch (SQLException ex) {
            System.out.println("Exception-" + ex);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException e) {
                    U.log(e);
                }
            }
        }
        U.log("OBTAINED REF_KEY :  " + listCount);
        return listCount;
    }

    public int nextDocCode() throws Exception {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int listCount = 0;
        try {
            String selectQry = "select LHSSYS_DOC_CODE.nextval from dual";
            U.log("Get LHSSYS_DOC_CODE query :  " + selectQry);
            pst = connection.prepareStatement(selectQry);
            rs = pst.executeQuery();
            while (rs.next()) {
                listCount = rs.getInt(1);
            }
        } catch (SQLException ex) {
            System.out.println("Exception-" + ex);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException e) {
                    U.log(e);
                }
            }
        }
        U.log("OBTAINED DOC_CODE :  " + listCount);
        return listCount;
    }

    // 
    public int maxDocCode() throws Exception {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int listCount = 0;
        try {
            String selectQry = "select MAX(t.doc_code) from doc_mast t;";
            U.log("Get MAX LHSSYS_DOC_CODE query :  " + selectQry);
            pst = connection.prepareStatement(selectQry);
            rs = pst.executeQuery();
            while (rs.next()) {
                listCount = rs.getInt(1);
            }
        } catch (SQLException ex) {
            System.out.println("Exception-" + ex);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException e) {
                    U.log(e);
                }
            }
        }
        U.log("OBTAINED MAX DOC_CODE :  " + listCount);
        return listCount;
    }

    public int maxDocSLNO() throws Exception {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int listCount = 0;
        try {
            String selectQry = "select MAX(t.doc_slno) from doc_tran t;";
            U.log("Get MAX doc_slno query :  " + selectQry);
            pst = connection.prepareStatement(selectQry);
            rs = pst.executeQuery();
            while (rs.next()) {
                listCount = rs.getInt(1);
            }
        } catch (SQLException ex) {
            System.out.println("Exception-" + ex);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException e) {
                    U.log(e);
                }
            }
        }
        U.log("OBTAINED MAX doc_slno :  " + listCount);
        return listCount;
    }

    public int maxRefSLNO() throws Exception {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int listCount = 0;
        try {
            String selectQry = "select MAX(t.ref_slno) from lhssys_ref_key_tran t;";
            U.log("Get MAX ref_slno query :  " + selectQry);
            pst = connection.prepareStatement(selectQry);
            rs = pst.executeQuery();
            while (rs.next()) {
                listCount = rs.getInt(1);
            }
        } catch (SQLException ex) {
            System.out.println("Exception-" + ex);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException e) {
                    U.log(e);
                }
            }
        }
        U.log("OBTAINED MAX ref_slno :  " + listCount);
        return listCount;
    }

    public String insertDocument(String fileName, String userCode, String discribtion,
            String systemFileName, InputStream fin, float fileId, String entity) throws Exception {

        PreparedStatement pst = null;
        ResultSet resultSet = null;
        String status = "";

        String refKEyTranSQL = "";
        String docMastSQL = "";
        String docTranSQL = "";
        String docTranImageSQL = "";
        int refKey = nextRefKey();
        int docCode = maxDocCode();
        int maxDocSLNO = maxDocSLNO();

//        String tableName = refTableName;
//        String refFor = "";
//        String refKeyType = "";
//        String refMasterPkey = "";
//        String refMasterCode = "";
//        String refEntityCode = "";
//        String refTCode_N = "";
//        String refVRNO_N = "";
//        String refSLNO_N = "";
//
//        if (tableName.contains("TRAN") || tableName.contains("tran")) {
//            refFor = "D";
//            refKeyType = "H";
//            refMasterPkey = "";
//            refMasterCode = "";
//            refEntityCode = entity;
//            refTCode_N = refTCode;
//            refVRNO_N = refVRNO;
//            refSLNO_N = "";
//        } else if (tableName.contains("HEAD") || tableName.contains("head")) {
//            refFor = "M";
//            refKeyType = "M";
//            refMasterPkey = "";
//            refMasterCode = "";
//            refEntityCode = "";
//            refTCode_N = "";
//            refVRNO_N = "";
//            refSLNO_N = "";
//        } else if (tableName.contains("BODY") || tableName.contains("body")) {
//            refFor = "M";
//            refKeyType = "B";
//            refMasterPkey = "";
//            refMasterCode = "";
//            refEntityCode = entity;
//            refTCode_N = refTCode;
//            refVRNO_N = refVRNO;
//            refSLNO_N = refSLNO;
//        } else {
//            refFor = "";
//            refKeyType = "";
//            refMasterPkey = "";
//            refMasterCode = "";
//            refEntityCode = "";
//            refTCode_N = "";
//            refVRNO_N = "";
//            refSLNO_N = "";
//        }
        if (fin == null) {
            U.log("*******image is null**********");
        }

//        String sqlDocumentInsert = new String();
        try {
            System.out.println("file id :  " + fileId);

            docTranSQL = "INSERT INTO DOC_TRAN\n"
                    + "(\n"
                    + "  DOC_CODE,\n"
                    + "  DOC_SLNO,\n"
                    + "  DOC_DESC,\n"
                    + "  FILE_PATH,\n"
                    + "  FILE_NAME,\n"
                    + "  REVIEW_DATE,\n"
                    + "  FILE_CODE,\n"
                    + "  USER_CODE,\n"
                    + "  LASTUPDATE,\n"
                    + "  ENTRY_DATE,\n"
                    + "  ENTITY_CODE\n"
                    + ") values (?, ?, ?, ?, ?, ?, ?, ?, sysdate, sysdate, ?)";

            System.out.println("docTranSQL : " + docTranSQL);
            pst = connection.prepareStatement(docTranSQL);
            pst.setInt(1, docCode);
            pst.setInt(2, maxDocSLNO);
            pst.setString(3, "");//DOC_DESC
            pst.setString(4, "");//FILE_PATH
            pst.setString(5, "");//FILE_NAME
            pst.setString(6, "");//REVIEW_DATE
            pst.setString(7, "");
            pst.setString(8, USER_CODE);
            pst.setString(9, entity);
            int result = pst.executeUpdate();
            if (result > 0) {

                docTranImageSQL = "INSERT INTO DOC_TRAN_IMAGE\n"
                        + "(\n"
                        + "  DOC_CODE,\n"
                        + "  DOC_SLNO,\n"
                        + "  DOC_IMAGE,\n"
                        + "  FILE_ID,\n"
                        + "  ENTRY_DATE,\n"
                        + "  ENTITY_CODE\n"
                        + ") values (?, ?, ?, ?, sysdate, ?)";
                System.out.println("docTranImageSQL : " + docTranImageSQL);
                pst = connection.prepareStatement(docTranImageSQL);
                pst.setInt(1, docCode);
                pst.setInt(2, maxDocSLNO);
                pst.setBinaryStream(3, fin, fin.available());
                pst.setFloat(4, fileId);//FLAG
                pst.setString(5, entity);
                int result1 = pst.executeUpdate();
                if (result1 > 0) {
                    status = "Document inserted successfully";
                } else {
                    status = "Document not inserted";
                }
            } else {
                status = "Document not inserted";
            }
            /*            sqlDocumentInsert = "insert into LHSSYS_portal_upload_file (FILE_ID,FILE_NAME,UPLOADATE_DATE,"
                    + "LAST_UPDATED,DESCRIBTION,USER_CODE,FLAG,SYSTEM_FILE_NAME,STORE_FILE)"
                    + " values (?,?,sysdate,sysdate,?,?,'h',?,?)";
            System.out.println("fileID : " + fileId + " compile qry :  " + sqlDocumentInsert);
            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setFloat(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());
            pst.execute();
             */
            System.out.println("Insert Document status : " + status);
        } catch (IOException e) {
            U.log("FILE UPDATE ERROR  :  " + e);
        } catch (SQLException e) {
            U.log("FILE UPDATE ERROR  :  " + e);
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

    String obtainedVRNO = "";
    String obtainedTableName = "";
    String obtainedTCode = "";
    String obtainedDocType = "";

    public String insrtRefKeyDocMast(String entity) throws Exception {

        PreparedStatement pst = null;
        ResultSet resultSet = null;
        String status = "";
        String DOC_REF = "";

        try {
            String hotSeatVRNOSQL = "SELECT DOC_REF FROM USER_MAST WHERE USER_CODE = '" + USER_CODE + "'";
            pst = connection.prepareStatement(hotSeatVRNOSQL);
            resultSet = pst.executeQuery();
            U.log("hotSeatVRNOSQL : " + hotSeatVRNOSQL);
            if (resultSet != null && resultSet.next()) {
                DOC_REF = resultSet.getString("DOC_REF");

                String[] arrVRNO = DOC_REF.split("#VRNO - '");
                String[] arr1VRNO = arrVRNO[1].split("'");
                obtainedVRNO = arr1VRNO[0];

                String[] arrTableName = DOC_REF.split(" TABLE_NAME - ");
                String[] arrTableName1 = arrTableName[0].split("#\n"
                        + "#PKY");
                obtainedTableName = arrTableName1[0];

                String[] arrTcode = DOC_REF.split("#T_CODE - '");
                String[] arrTcode1 = arrTcode[1].split("'#VRNO - '");
                obtainedTCode = arrTcode1[0];

                String[] arrDocType = DOC_REF.split("#VRNO - '");
                String[] arrDocType1 = arrDocType[1].split("'");
                obtainedDocType = arrDocType1[0];

                System.out.println("obtainedVRNO : " + obtainedVRNO);
            } else {
                System.out.println("Values not obtained ");
            }
        } catch (SQLException e) {
            U.log(e);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException e) {
                }
            }
        }

        String refKEyTranSQL = "";
        String docMastSQL = "";
        int refKey = nextRefKey();
        int docCode = nextDocCode();
        int maxRefSLNO = maxRefSLNO();
        String tableName = obtainedTableName;
        String refFor = "";
        String refKeyType = "";
        String refMasterPkey = "";
        String refMasterCode = "";
        String refEntityCode = "";
        String refTCode_N = "";
        String refVRNO_N = "";
        int refSLNO_N = 0;
        if (tableName.contains("TRAN") || tableName.contains("tran")) {
            refFor = "D";
            refKeyType = "H";
            refMasterPkey = "";
            refMasterCode = "";
            refEntityCode = entity;
            refTCode_N = obtainedTCode;
            refVRNO_N = obtainedVRNO;
            refSLNO_N = 0;
        } else if (tableName.contains("HEAD") || tableName.contains("head")) {
            refFor = "M";
            refKeyType = "M";
            refMasterPkey = "";
            refMasterCode = "";
            refEntityCode = "";
            refTCode_N = "";
            refVRNO_N = "";
            refSLNO_N = 0;
        } else if (tableName.contains("BODY") || tableName.contains("body")) {
            refFor = "M";
            refKeyType = "B";
            refMasterPkey = "";
            refMasterCode = "";
            refEntityCode = entity;
            refTCode_N = obtainedTCode;
            refVRNO_N = obtainedVRNO;
            refSLNO_N = maxRefSLNO;
        } else {
            refFor = "";
            refKeyType = "";
            refMasterPkey = "";
            refMasterCode = "";
            refEntityCode = "";
            refTCode_N = "";
            refVRNO_N = "";
            refSLNO_N = 0;
        }

        try {
            refKEyTranSQL = "INSERT INTO LHSSYS_REF_KEY_TRAN\n"
                    + "(\n"
                    + "  REF_KEY,\n"
                    + "  REF_FOR,\n"
                    + "  REF_KEY_TYPE,\n"
                    + "  REF_TABLE_NAME,\n"
                    + "  REF_MASTER_PKEY,\n"
                    + "  REF_MASTER_CODE,\n"
                    + "  REF_ENTITY_CODE,\n"
                    + "  REF_TCODE,\n"
                    + "  REF_VRNO,\n"
                    + "  REF_SLNO,\n"
                    + "  LASTUPDATE,\n"
                    + "  FLAG,\n"
                    + "  CREATEDDATE\n"
                    + ") values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, sysdate, ?, sysdate)";
            System.out.println("refKEyTranSQL : " + refKEyTranSQL);
            pst = connection.prepareStatement(refKEyTranSQL);
            pst.setInt(1, refKey);
            pst.setString(2, refFor);
            pst.setString(3, refKeyType);
            pst.setString(4, tableName);
            pst.setString(5, refMasterPkey);
            pst.setString(6, refMasterCode);
            pst.setString(7, refEntityCode);
            pst.setString(8, refTCode_N);
            pst.setString(9, refVRNO_N);
            pst.setInt(10, refSLNO_N);
            pst.setString(11, "");
            int result = pst.executeUpdate();
            if (result > 0) {

                docMastSQL = "INSERT INTO DOC_MAST\n"
                        + "(\n"
                        + "  DOC_CODE,\n"
                        + "  DOC_NAME,\n"
                        + "  DOC_DATE,\n"
                        + "  FLAG,\n"
                        + "  USER_CODE,\n"
                        + "  LASTUPDATE,\n"
                        + "  DOC_TYPE,\n"
                        + "  DOC_DETAIL,\n"
                        + "  REF_KEY,\n"
                        + "  KEY_CODE,\n"
                        + "  KEY_MAST\n"
                        + ") values (?, ?, sysdate, ?, ?, sysdate, ?, ?, ?, ?, ?)";
                System.out.println("docMastSQL : " + docMastSQL);
                pst = connection.prepareStatement(docMastSQL);
                pst.setFloat(1, docCode);
                pst.setString(2, obtainedDocType);
                pst.setString(3, "");//FLAG
                pst.setString(4, USER_CODE);
                pst.setString(5, obtainedDocType);
                pst.setString(6, "");//DOC_DETAIL
                pst.setInt(7, refKey);
                pst.setString(8, refMasterPkey);
                pst.setString(9, refMasterCode);
                int result1 = pst.executeUpdate();
                if (result1 > 0) {
                    status = "Document inserted successfully";
                } else {
                    status = "Document not inserted";
                }
            } else {
                status = "Document not inserted";
            }
            System.out.println("result------" + status);
        } catch (SQLException e) {
            U.log("FILE UPDATE ERROR  :  " + e);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException ex) {
                    U.log(ex);
                }
            }
        }
        return status;
    }
}
