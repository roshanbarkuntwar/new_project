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
import java.io.File;
import java.io.InputStream;
import java.sql.CallableStatement;
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
public class JDBCupdateEntryDyanmicDAO {

    String base64Image;
    byte[] imageBytes;
    InputStream is;
    String table_name;
    Connection connection;
    String seq_no;
    StringBuffer valueString = new StringBuffer();
    String dependent_next_entry_seq = null;
    JSONObject imgJSON = new JSONObject();
    FileClass f = new FileClass();
    HashMap<String, String> videofileId = new HashMap<String, String>();
    HashMap<String, String> nondisplayColList = new HashMap<String, String>();
    HashMap<String, String> imgfileID = new HashMap<String, String>();
    HashMap<String, String> defultValue = new HashMap<String, String>();
    String USER_CODE;
    LoggerWrite log = new LoggerWrite();
    String[] UPDATE_KEY;
    String[] UPDATE_KEY_VALUE;
    HashMap<String, String> columnStatus = new HashMap<String, String>();
    HashMap<String, String> columnType = new HashMap<String, String>();
    HashMap<String, String> columnTableName = new HashMap<String, String>();
    HashMap<String, String> columnDefaultValue = new HashMap<String, String>();

    public JDBCupdateEntryDyanmicDAO(Connection c) {
        this.connection = c;
    }

    public void getDetailOfColumns() {
        PreparedStatement ps = null;
        ResultSet rs;
        String dsql = "select seq_no from LHSSYS_PORTAL_TABLE_DSC_UPDATE where dependent_next_entry_seq = " + seq_no;
        System.out.println("Query to get dependent_next_entry_seq :  " + dsql);

        try {
            ps = connection.prepareStatement(dsql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                dependent_next_entry_seq = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("Exception in getDetailOfColumns of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    System.out.println("Exception in getDetailOfColumns of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
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
        System.out.println("sql--> " + sql);
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {
            ps = connection.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    table_name = rs.getString("table_name");
                    String Ukey = rs.getString("update_key");
                    if (Ukey != null && !Ukey.isEmpty()) {
                        UPDATE_KEY = Ukey.split("#");
                        UPDATE_KEY_VALUE = Ukey.split("#");
                    }
                    if (rs.getString("status") != null && rs.getString("status").contains("F")) {
                        nondisplayColList.put(rs.getString("column_name"), rs.getString("column_default_value"));
                    }
                } while (rs.next());
            }
        } catch (Exception e) {
            System.out.println("Exception in getDetailOfColumns of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    System.out.println("Exception in getDetailOfColumns of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
                }
            }
        }
    }
    String sysdate = "";

    public String UpdateGivenEntry(String jsonString) throws ParseException, Exception {
        U.log("jsonstring : " + jsonString);
        String returnREsult = "updated data";
        String procedureOfUpadte = "";
        PreparedStatement ps = null;
        PreparedStatement ps1 = null;
        JSONArray jsonArray = new JSONArray();
        JSONParser json_parser = new JSONParser();
        JSONObject json = (JSONObject) json_parser.parse(jsonString);
        jsonArray = (JSONArray) json.get("recordsInfo");
        int jsonArrLength = jsonArray.size();
        JSONObject obj2 = (JSONObject) jsonArray.get(0);
        seq_no = (obj2.get("dynamic_table_seq_id".toUpperCase()).toString());
        getColumnDetails(seq_no);
        try {
            for (int i = 1; i < jsonArrLength; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);
                String imgColumnTableName = columnTableName.get(obj1.get("fileId"));
                if (imgColumnTableName != null && !imgColumnTableName.isEmpty()) {
                    if (imgColumnTableName.contains("LHSSYS_PORTAL_APP_TRAN") || imgColumnTableName.contains("LHSSYS_PORTAL_APP_LOC_TRAN")) {
                        if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
                            is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
//                            U.log("fileName : " + obj1.get("fileName").toString() + "  USER_CODE :  " + USER_CODE + "  desc  :  " + obj1.get("desc").toString()
//                                    + "   sysFileName  :  " + obj1.get("sysFileName").toString());
//                            U.log("imgfileID : " + imgfileID.get(obj1.get("fileId").toString()) + "   FileID : " + obj1.get("fileId").toString());
                            if (dependent_next_entry_seq != null) {
                                insertDocument(obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(), obj1.get("sysFileName").toString(), is, Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())));
                            } else if (obj1.get("sysFileName").toString().contains("sysFileName")
                                    || obj1.get("sysFileName").toString().indexOf("sysFileName") > -1
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
//                            U.log("videoFileName : " + obj1.get("videoFileName").toString() + "\n      USER_CODE : " + USER_CODE
//                                    + "\n    videoDesc :  " + obj1.get("videoDesc").toString() + "\n      sysFileName :  " + obj1.get("sysFileName").toString());
//                            U.log("videoFileId :  " + obj1.get("videoFileId").toString());
//                            U.log("videoFileId :  " + Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                            if (is == null) {
                                U.log("video file is null");
                            }
                            updateVideo(obj1.get("videoFileName").toString(), USER_CODE, obj1.get("videoDesc").toString(), obj1.get("sysFileName").toString(), is, Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                        }
                    } else if (imgColumnTableName.contains("DOC_TRAN")) {
                        insertImageIntoDocTran(imgColumnTableName, obj1, json);
                    } else {
//                        insertImageIntoOtherTable(imgColumnTableName, obj1, json);
                    }
                }
            }
        } catch (Exception e) {
        }

        String executeAfterSQL = "select execute_after_update from lhssys_portal_table_dsc_update where seq_no = " + seq_no;
        try {
            ps1 = connection.prepareStatement(executeAfterSQL);
            ResultSet rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                procedureOfUpadte = rs1.getString(1);
            }
            if (procedureOfUpadte != null && procedureOfUpadte.length() > 2) {
                ResultSet rs;
                String returnMessage = "";
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
                                        if (innermap.getValue() != null) {
                                            procedureOfUpadte = procedureOfUpadte.replace("'" + innermap.getKey() + "'", "'" + String.valueOf(innermap.getValue()).replaceAll("'", "''") + "'");
                                        } else {
                                            procedureOfUpadte = procedureOfUpadte.replace("'" + innermap.getKey() + "'", "''");
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (procedureOfUpadte.contains("BEGIN") || procedureOfUpadte.contains("Begin") || procedureOfUpadte.contains("begin")) {
                        try {
                            System.out.println("execute_after_update procedure AFTER REPLACING VALUE : " + procedureOfUpadte);
                            ps = connection.prepareStatement(procedureOfUpadte);
                            int n = ps.executeUpdate();
                            if (n >= 0) {
                                String result = n + " row updated";
                                System.out.println(" execute_after_update result : " + result);
                            } else {
                                String result = n + " row updated";
                                System.out.println(" execute_after_update result : " + result);
                            }
                        } catch (SQLException e) {
                            System.out.println("Exception in JDBCupdateEntryDyanmicDAO : " + e.getMessage());
                            String[] returnMessageArr;
                            returnMessage = e.getMessage();
                            System.out.println("returnMessage : " + returnMessage);
                            returnMessageArr = returnMessage.split(":");
                            returnMessage = returnMessageArr[1];
                            System.out.println("execute_after_update result  e.getMessage() : : " + e.getMessage());
                            returnMessage = returnMessage.replaceAll("ORA-06512", "");
                            System.out.println("returnMessage : " + returnMessage);
                            //                        return "Error occoured sue to some internal reason.";
                            returnREsult = returnMessage;
                        }
                    } else {
                        CallableStatement statement;
                        try {
                            procedureOfUpadte = "{ ? = call " + procedureOfUpadte + " }";
                            System.out.println("execute_after_update procedure AFTER REPLACING VALUE : " + procedureOfUpadte);
                            statement = connection.prepareCall(procedureOfUpadte);
                            statement.registerOutParameter(1, java.sql.Types.VARCHAR);
                            statement.execute();
                            returnMessage = statement.getString(1);
                            returnREsult = returnREsult + "#" + returnMessage;
                            System.out.println("OUTPUT : " + returnREsult);
                        } catch (SQLException e) {
                            returnREsult = "Process not completed, Please check";
                            System.out.println("Exception in JDBCupdateEntryDyanmicDAO : " + e.getMessage());
                            String[] returnMessageArr;
                            returnMessage = e.getMessage();
                            System.out.println("returnMessage : " + returnMessage);
                            returnMessageArr = returnMessage.split(":");
                            returnMessage = returnMessageArr[1];
                            System.out.println("execute_after_update result  e.getMessage() : : " + e.getMessage());
                            returnMessage = returnMessage.replaceAll("ORA-06512", "");
                            System.out.println("returnMessage : " + returnMessage);
                            //                        return "Error occoured sue to some internal reason.";
                            returnREsult = returnMessage;
                        }
                    }
                } catch (ParseException e) {
                    System.out.println("Exception in JDBCupdateEntryDyanmicDAO : " + e.getMessage());
                    returnREsult = "Entry not updated...";
                }

            } else {
                returnREsult = UpdateEntry(jsonString);
            }
        } catch (Exception e) {
            System.out.println("Exception in JDBCupdateEntryDyanmicDAO : " + e.getMessage());
            returnREsult = "Entry not updated...";
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                }
            }
        }
        return returnREsult;
    }

    public String UpdateGivenEntrySql(String jsonString, String sqlFlag) throws ParseException, Exception {
//        U.log("jsonstring : " + jsonString);
        String returnREsult = "updated data";
        String procedureOfUpadte = "";
        PreparedStatement ps = null;
        PreparedStatement ps1 = null;
        JSONArray jsonArray = new JSONArray();
        JSONParser json_parser = new JSONParser();
        JSONObject json = (JSONObject) json_parser.parse(jsonString);
        jsonArray = (JSONArray) json.get("recordsInfo");
        int jsonArrLength = jsonArray.size();
        JSONObject obj2 = (JSONObject) jsonArray.get(0);
        String sqlData = "";

        connection.setAutoCommit(false);
        seq_no = (obj2.get("dynamic_table_seq_id".toUpperCase()).toString());
        try {
            for (int i = 1; i < jsonArrLength; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);
                if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
                    is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
//                    U.log("fileName : " + obj1.get("fileName").toString() + "  USER_CODE :  " + USER_CODE + "  desc  :  " + obj1.get("desc").toString()
//                            + "   sysFileName  :  " + obj1.get("sysFileName").toString());
//                    U.log("imgfileID : " + imgfileID.get(obj1.get("fileId").toString()) + "   FileID : " + obj1.get("fileId").toString());
//                U.log("imgfileID : " + Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())));
                    if (dependent_next_entry_seq != null) {
                        insertDocument(obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(), obj1.get("sysFileName").toString(), is, Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())));
                    } else if (obj1.get("sysFileName").toString().contains("sysFileName")
                            || obj1.get("sysFileName").toString().indexOf("sysFileName") > -1
                            || obj1.get("sysFileName").toString().lastIndexOf("sysFileName") > -1) {
                        updateDocument(Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())),
                                obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
                                obj1.get("sysFileName").toString(), is);
                    } else {
//                        U.log("IMAGE PATH : " + obj1.get("sysFileName"));
                        writeFile(is, obj1);
                    }
                }
                if (obj1.get("videofile") != null && obj1.get("videofile").toString().length() > 3) {
                    base64Image = obj1.get("videofile").toString().split(",")[1];
                    imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
                    is = new ByteArrayInputStream(imageBytes);
//                    U.log("videoFileName : " + obj1.get("videoFileName").toString() + "\n      USER_CODE : " + USER_CODE
//                            + "\n    videoDesc :  " + obj1.get("videoDesc").toString() + "\n      sysFileName :  " + obj1.get("sysFileName").toString());
//                    U.log("videoFileId :  " + obj1.get("videoFileId").toString());
//                    U.log("videoFileId :  " + Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                    if (is == null) {
                        U.log("video file is null");
                    }
                    updateVideo(obj1.get("videoFileName").toString(), USER_CODE, obj1.get("videoDesc").toString(), obj1.get("sysFileName").toString(), is, Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                }
            }
        } catch (Exception e) {
        }

        String executeAfterSQL = "select execute_after_update from lhssys_portal_table_dsc_update where seq_no = " + seq_no;
        System.out.println("GET EXECUTE_AFTER_UPDATE SQL : " + executeAfterSQL);

        try {
            sqlData = sqlData + "\n----------execute After SQL----------\n" + executeAfterSQL;
            ps1 = connection.prepareStatement(executeAfterSQL);
            ResultSet rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                procedureOfUpadte = rs1.getString(1);
                System.out.println(" execute_after_update procedure : " + procedureOfUpadte);
            }

        } catch (Exception e) {
            U.log(e);
            returnREsult = "Entry not updated...";
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    System.out.println("Exception in JDBCupdateEntryDyanmicDAO : " + e.getMessage());
                }
            }
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    System.out.println("Exception in JDBCupdateEntryDyanmicDAO : " + e.getMessage());
                }
            }
        }
        returnREsult = returnREsult + "\n" + sqlData;
        return returnREsult;
    }

    public String UpdateEntry(String jsonString) throws ParseException, Exception {
        PreparedStatement ps1 = null;
        try {
            ps1 = connection.prepareStatement("select TO_CHAR(sysdate, 'DD-MM-YYYY HH24:MI:SS') as systemdate from dual");
            ResultSet rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                sysdate = rs1.getString(1);
            }
        } catch (SQLException e) {
            System.out.println("Exception in UpdateEntry of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    System.out.println("Exception in UpdateEntry of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
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
        for (int i = 0; i < 1; i++) {
            JSONObject obj1 = (JSONObject) jsonArray.get(i);
            seq_no = (obj1.get("dynamic_table_seq_id".toUpperCase()).toString());
            getDetailOfColumns();
            System.out.println("UPDATE_KEY--> " + UPDATE_KEY);
            for (int j = 0; j < UPDATE_KEY.length; j++) {
                String updateKey = UPDATE_KEY[j];
                if (obj1.get(updateKey) != null) {
                    String uKey = (obj1.get(updateKey)).toString();
                    UPDATE_KEY_VALUE[j] = uKey.trim();
                }
            }
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
                    try {
                        String imgColumnTableName = columnTableName.get(obj1.get("fileId"));
//                        System.out.println("columnTableName -- > " + columnTableName.get(obj1.get("fileId")));
                        if (imgColumnTableName != null && !imgColumnTableName.isEmpty()) {
                            if (imgColumnTableName.contains("LHSSYS_PORTAL_APP_TRAN") || imgColumnTableName.contains("LHSSYS_PORTAL_APP_LOC_TRAN")) {
                                is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
                                if (dependent_next_entry_seq != null) {
                                    insertDocument(obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
                                            obj1.get("sysFileName").toString(), is,
                                            Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())));
                                } else if (obj1.get("sysFileName").toString().contains("sysFileName")
                                        || obj1.get("sysFileName").toString().lastIndexOf("sysFileName") > -1) {

                                    System.out.println("imgfileID---> " + imgfileID.get(obj1.get("fileId").toString()));
                                    updateDocument(Float.parseFloat(imgfileID.get(obj1.get("fileId").toString())),
                                            obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
                                            obj1.get("sysFileName").toString(), is);
                                } else {
                                    U.log("IMAGE PATH : " + obj1.get("sysFileName"));
                                    writeFile(is, obj1);
                                }
                            } else if (imgColumnTableName.contains("DOC_TRAN")) {
                                insertImageIntoDocTran(imgColumnTableName, obj1, json);
                            } else {
                                insertImageIntoOtherTable(imgColumnTableName, obj1, json);
                            }
                        }
                    } catch (Exception e) {
                        System.out.println("Exception in UpdateEntry of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
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
                if (m.getValue() != null) {
                    String predefinedVal = defultValue.get(m.getValue());
                    if (predefinedVal == null) {
                        predefinedVal = m.getValue().toString();
                    }
                    if (m.getKey().toString().contains("LASTUPDATE")) {
                        predefinedVal = "to_date('" + sysdate + "','dd-MM-yyyy HH24:MI:SS')";
                    } else if (m.getKey().toString().contains("DATE")) {
//                        predefinedVal = "'" + predefinedVal + "'";
                        predefinedVal = "to_date('" + predefinedVal + "','dd-MM-yyyy HH24:MI:SS')";;
                    } else {
                        predefinedVal = "'" + predefinedVal + "'";
                    }
                    valueString.append(m.getKey()).append("=").append(predefinedVal).append(",");
                }
            }

            String vaString = valueString.toString().substring(0, valueString.toString().lastIndexOf(","));
            stringBuff.append("update ").append(table_name).append("\n set ").append(vaString)
                    .append(" where 1=1 ");

            for (int j = 0; j < UPDATE_KEY.length; j++) {
                try {
                    String val = UPDATE_KEY_VALUE[j];
                    String colType = columnType.get(UPDATE_KEY[j]);
//                    System.out.println("UPDATE_KEY--> " + UPDATE_KEY[j] + " columnType--> " + colType + " val---> " + val);
                    if (colType != null && !colType.isEmpty()) {
                        if (colType.equalsIgnoreCase("DATE") && !table_name.equalsIgnoreCase("LHSSYS_PORTAL_APP_TRAN")) {
                            stringBuff.append("and ").append(UPDATE_KEY[j]).append("=to_date('" + val + "','dd-MM-yyyy HH24:MI:SS')");
                        } else {
                            stringBuff.append("and ").append(UPDATE_KEY[j]).append("='").append(val).append("'");
                        }
                    } else {
                        stringBuff.append("and ").append(UPDATE_KEY[j]).append("='").append(val).append("'");
                    }
                    System.out.println("WhereCaluse --> and " + UPDATE_KEY[j] + "=" + val);
                } catch (Exception e) {
                    System.out.println("Exception in UpdateEntry of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
                }
            }

            System.out.println("ENTRY UPDATE SQL : " + stringBuff.toString());
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
                System.out.println("Update entry result : " + result1);
            } catch (Exception e) {
                System.out.println("Exception in UpdateEntry of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
                result = n + " Record not update";
                System.out.println("Update entry result :: " + result);
                return "Error occoured due to some internal reason.";
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (Exception e) {
                        System.out.println("Exception in UpdateEntry of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
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
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (Exception e) {
                    System.out.println("Exception in updateDocument of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
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
                    } catch (Exception e) {
                        System.out.println("Exception in parseJson of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
                    }
                }
                if (U.match(obj.toString().toLowerCase(), "col[2]{1}$", 0) != null) {
                    USER_CODE = jsonObject.get(obj).toString();
                    defultValue.put("USER_CODE", USER_CODE);
                }

                if (!obj.toString().contains("imageTime") && !obj.toString().contains("video")
                        && !obj.toString().contains("file") && !obj.toString().contains("fileName")
                        && !obj.toString().contains("desc") && !obj.toString().contains("sysFileName")) {

//                    System.out.println("Status -->" + columnStatus.get(obj) + "  Type -->" + columnType.get(obj) + "  Name --> " + obj.toString() + " Val --> " + jsonObject.get(obj).toString());
                    if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID")) {
                        try {
                            if (columnStatus.get(obj).equalsIgnoreCase("D") || columnType.get(obj).contains("IMG")) {
                            } else {
                                valueString.append(obj.toString() + "=");
                            }
                        } catch (Exception e) {
                            valueString.append(obj.toString() + "=");
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
                    if (f.isNumber(obj.toString())) {
                        if (obj.toString().toUpperCase().contains("SEQ_ID")) {
                            UPDATE_KEY_VALUE[0] = jsonObject.get(obj).toString();
                            columnValue = UPDATE_KEY_VALUE[0] + "";
                        }
                        if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID")) {
                            valueString.append(columnValue + ",");
                        }

                    } else {

                        if (f.isImg(obj.toString())) {
                            columnValue = jsonObject.get(obj).toString();

                            System.out.println("columnValue-------> " + columnValue);
                            System.out.println("obj-------> " + obj);
                            imgfileID.put(obj.toString(), columnValue);
                        }
                        if (f.isVideo(obj.toString())) {
                            columnValue = UPDATE_KEY_VALUE + "." + obj.toString().replaceAll("[a-z A-Z]+", "");
                            videofileId.put(obj.toString(), columnValue);
                        }
                        if (f.isSysDate(obj.toString())) {
                            columnValue = sysdate;
                        }
                        if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID")) {
                            if (obj.toString().contains("DATE")) {
//                                columnValue="to_date('" + columnValue + "','dd-MM-yyyy HH24:MI:SS')";
                                valueString.append("to_date('" + columnValue + "','dd-MM-yyyy HH24:MI:SS')" + ",");

                            } else {
                                try {
                                    if (columnStatus.get(obj).equalsIgnoreCase("D") || columnType.get(obj).contains("IMG")) {
                                    } else {
                                        valueString.append("'" + columnValue + "',");
                                    }
                                } catch (Exception ee) {
                                    valueString.append("'" + columnValue + "',");
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
                    f.addInmap(rs.getString("column_name"), rs.getString("column_default_value"));
                    f.addInmap(rs.getString("column_name"), rs.getString("Item_help_property"));

                } while (rs.next());
            }
        } catch (Exception e) {
            System.out.println("Exception in setDatatype of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    System.out.println("Exception in setDatatype of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
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
        } catch (Exception e) {
            System.out.println("Exception in updateVideo of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (Exception e) {
                    System.out.println("Exception in updateVideo of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
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
            String base64Img = image;//.split(",")[1];
            byte[] imageByts = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
            iss = new ByteArrayInputStream(imageByts);
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

    public void writeFile(InputStream is, JSONObject obj) {
        String fileName = obj.get("sysFileName").toString();
        System.out.println("IMAGE FILE PATH fileName--> " + fileName);
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
            System.out.println("file id :  " + fileId);
            sqlDocumentInsert = "insert into LHSSYS_portal_upload_file (FILE_ID,FILE_NAME,UPLOADATE_DATE,"
                    + "LAST_UPDATED,DESCRIBTION,USER_CODE,FLAG,SYSTEM_FILE_NAME,STORE_FILE)"
                    + " values (?,?,sysdate,sysdate,?,?,'h',?,?)";
            System.out.println("fileID : " + fileId + "\n INSERT IMAGE SQL :  " + sqlDocumentInsert);
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
            System.out.println("IMAGE INSERTION STATUS : " + status);
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
            System.out.println("Exception in getColumnDetails of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
        }
    }

    public void insertImageIntoDocTran(String tableName, JSONObject imgJson, JSONObject mainJson) {

        PreparedStatement ps = null;
        ResultSet rs = null;
        String docCode = null;
        int docSLNO = 0;
        String folderPath = null;
        InputStream iss = null;
        String doc_ref;
        String status;
        String[] tablearr = tableName.split("~");
        try {

            JSONArray jsonArray = new JSONArray();
            jsonArray = (JSONArray) mainJson.get("recordsInfo");
            JSONObject jsobj = (JSONObject) jsonArray.get(0);
            if (jsobj.containsKey(tablearr[1])) {
                doc_ref = (String) jsobj.get(tablearr[1]);
                docCode = doc_ref;
            } else {
                doc_ref = (String) jsobj.get("DOC_REF");

            }
            String user_code = (String) jsobj.get("USER_CODE");
            String desc[] = new String[5];
            desc[0] = (String) jsobj.get("REMARK");
            String query = "SELECT T.DOC_CODE, D.FOLDER_PATH FROM DOC_MAST T, DOC_TYPE_MAST D WHERE D.DOC_TYPE = T.DOC_TYPE AND T.DOC_CODE =" + doc_ref;
            String slnoSQL = "SELECT NVL(MAX(D.DOC_SLNO), 0) DOC_SLNO FROM doc_tran D WHERE D.USER_CODE = '" + user_code + "' AND D.DOC_CODE = " + doc_ref;
            System.out.println("query----- > " + query);
            System.out.println("slnoSQL----- > " + slnoSQL);
            try {
                ps = connection.prepareStatement(query);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
//                        docCode = rs.getString(1);
                        if (rs.getString(1) != null && !rs.getString(1).isEmpty()) {
                            docCode = rs.getString(1);
                        } else {
                            docCode = doc_ref;
                        }

                        folderPath = rs.getString(2);
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
                ps = connection.prepareStatement(slnoSQL);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        docSLNO = rs.getInt(1);
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

            if (docSLNO > 0) {
                String deleteData = "DELETE FROM doc_tran D WHERE D.USER_CODE = '" + user_code + "' AND D.DOC_CODE = " + doc_ref;
                String deleteData1 = "DELETE FROM doc_tran_image D WHERE  D.DOC_CODE = " + doc_ref;
                int n = 0;
                try {
                    ps = connection.prepareStatement(deleteData);
                    n = ps.executeUpdate();
                    if (n > 0) {
                        try {
                            ps = connection.prepareStatement(deleteData1);
                            n = ps.executeUpdate();
                            if (n > 0) {
                                docSLNO = 0;
                            }
                        } catch (SQLException e) {
                        } finally {
                            if (ps != null) {
                                try {
                                    ps.close();
                                } catch (Exception e) {
                                }
                            }
                        }
                    }
                } catch (SQLException e) {
                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (Exception e) {
                        }
                    }
                }
            } else {

            }

            if (imgJson.get("file") != null && imgJson.get("file").toString().length() > 3) {
                String base64Img = imgJson.get("file").toString();
                byte[] imageByts = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
                iss = new ByteArrayInputStream(imageByts);

                BufferedImage buffImage = null;
                String folderPathReplaced = "";
                folderPathReplaced = folderPath;
                String sqlDocumentInsert = "";
                try {
                    sqlDocumentInsert = "insert into doc_tran (doc_code,doc_slno,doc_desc,user_code,file_name, MOBILE_FLAG,LASTUPDATE, FILE_DATE)values(?,?,?,?,?,'M', sysdate, sysdate) ";

                    ps = connection.prepareStatement(sqlDocumentInsert);
                    ps.setString(1, docCode);
                    ps.setString(2, String.valueOf(docSLNO + 1));
                    ps.setString(3, desc[0]);
                    ps.setString(4, user_code);
                    ps.setString(5, doc_ref + "_" + String.valueOf(docSLNO + 1) + ".jpg");
                    int ii = 0;
                    ii = ps.executeUpdate();
                    if (ii > 0) {
                        status = "insert data";
                        docSLNO++;
                    } else {
                        status = "IMAGE NOT INSERTED";
                    }
                    System.out.println("IMAGE INSERT STATUS : " + status);
                } catch (Exception e) {
                    U.log(e);
                    status = "IMAGE NOT INSERTED";
                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (SQLException ex) {
                            status = "IMAGE NOT INSERTED";
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
                    status = insertDocument(imgJson.get("fileName").toString(), user_code, desc[0],
                            iss, docCode, String.valueOf(docSLNO));
                }
            }
//            }

        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException ex) {
                    status = "IMAGE NOT INSERTED";
                }
            }
        }
//        return status;
    }

    public String insertDocument(String fileName, String userCode, String desc,
            InputStream fin, String doc_code, String docSlno) throws Exception {
        PreparedStatement pst = null;
        String sqlDocumentInsert = "";
        String status;
        try {
            sqlDocumentInsert = "insert into doc_tran_image (doc_code,doc_slno,doc_image)values(?,?,?)";
            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setString(1, doc_code);
            pst.setString(2, docSlno);
            pst.setBinaryStream(3, fin, fin.available());

            int i = 0;
            i = pst.executeUpdate();
            if (i > 0) {
                status = "insert data";
            } else {
                status = "IMAGE NOT INSERTED";
            }
//            System.out.println("IMAGE INSERT STATUS : " + status);
        } catch (Exception e) {
            status = "IMAGE NOT INSERTED";
            U.log(e);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException ex) {
                    status = "IMAGE NOT INSERTED";
                }
            }
        }
        return status;
    }

    private void insertImageIntoOtherTable(String imgColumnTableName, JSONObject imgJson, JSONObject mainJson) {
        JSONArray jsonArray = new JSONArray();
        String[] tablearr = imgColumnTableName.split("~");
        String updateKeyVal = "";
        jsonArray = (JSONArray) mainJson.get("recordsInfo");
        InputStream iss = null;
        JSONObject jsobj = (JSONObject) jsonArray.get(0);
        for (int i = 2; i < tablearr.length; i++) {
            updateKeyVal = tablearr[i] + "= '" + (String) jsobj.get(tablearr[i]) + "'";
        }
        updateKeyVal = updateKeyVal + " and lastupdate = sydate ";
        if (imgJson.get("file") != null && imgJson.get("file").toString().length() > 3) {
            String base64Img = imgJson.get("file").toString();
            byte[] imageByts = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
            iss = new ByteArrayInputStream(imageByts);
        }
        PreparedStatement pst = null;
        String sqlDocumentUpdate = "";
        String status;
        try {

            sqlDocumentUpdate = "update " + tablearr[0] + " set " + tablearr[1] + "= ? " + " where " + updateKeyVal;
            System.out.println("sqlDocumentUpdate---> " + sqlDocumentUpdate);
            pst = connection.prepareStatement(sqlDocumentUpdate);
            pst.setBinaryStream(1, iss, iss.available());

            int i = 0;
            i = pst.executeUpdate();
            if (i > 0) {
                status = "insert data";
            } else {
                status = "IMAGE NOT INSERTED";
            }
            System.out.println("IMAGE INSERT STATUS : " + status);
        } catch (Exception e) {
            status = "IMAGE NOT INSERTED";
            System.out.println("Exception in insertImageIntoOtherTable of JDBCupdateEntryDyanmicDAO : " + e.getMessage());
        }
    }
}
