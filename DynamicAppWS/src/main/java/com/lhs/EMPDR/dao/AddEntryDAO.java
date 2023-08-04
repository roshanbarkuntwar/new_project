/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.FileUploadStatus;
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
import java.util.ArrayList;
import java.util.Calendar;
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
 * @author anjali.bhendarkar
 */
public class AddEntryDAO {

    Connection connection;
    String acc_year;
    StringBuffer colName = new StringBuffer();
    StringBuffer colValue = new StringBuffer();
    HashMap<String, String> table_desc_data = new HashMap<String, String>();
//    ArrayList<DyanamicRecordsListModel> data_desc_data = new ArrayList<DyanamicRecordsListModel>();
    String seq_no;
    int seq_id;
    String PDSE_VRNO;
    String ProdVRNO;
    PreparedStatement ps = null;
    ResultSet rs = null;
    String sysdate = "sysdate";
    String table_name;
    String USER_CODE;
    HashMap<String, String> columnStatus = new HashMap<String, String>();
    HashMap<String, String> columnType = new HashMap<String, String>();
    HashMap<String, String> columnTableName = new HashMap<String, String>();
    HashMap<String, String> columnDefaultValue = new HashMap<String, String>();
    HashMap<String, String> imgfileID = new HashMap<String, String>();
    HashMap<String, String> videofileId = new HashMap<String, String>();

    public AddEntryDAO(Connection connection) {
        this.connection = connection;
        getAccYear();
    }

    public FileUploadStatus addEntry(String jsonString) {
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        String returnResult = "insert data";
        JSONArray jsonArray = new JSONArray();
        JSONParser json_parser = new JSONParser();
        ArrayList<String> seqIdList = new ArrayList<String>();
        try {
            System.out.println("jsonString---> " + jsonString);
            JSONObject json = (JSONObject) json_parser.parse(jsonString);
            jsonArray = (JSONArray) json.get("recordsInfo");
            JSONObject entryDataJson = (JSONObject) jsonArray.get(0);
            seq_no = entryDataJson.get("DYNAMIC_TABLE_SEQ_ID") + "";

            table_desc_data = getTableDescData(seq_no);
            getColumnDetails(seq_no);

            if (seq_id == 0) {
                System.out.println("IMAGE USED TABLE : " + table_name);
                if (table_name.equals("LHSSYS_PORTAL_APP_TRAN") || table_name.equals("ITEMTRAN_BODY") || table_name.equals("ITEMTRAN_HEAD") || table_name.equals("LHSSYS_PORTAL_APP_LOC_TRAN")) {
                    seq_id = nextSeqID(table_name);
                }
            }
            if (table_desc_data.get("pre_data_save_event") != null && !table_desc_data.get("pre_data_save_event").isEmpty()) {
                String pre_data_save_event_sql = table_desc_data.get("pre_data_save_event");
                if (pre_data_save_event_sql.contains("'ACC_CODE'")) {
                    pre_data_save_event_sql = pre_data_save_event_sql.replaceAll("'ACC_CODE'", "'" + acc_year + "'");
                }
                for (int k = 0; k < entryDataJson.size(); k++) {
                    Set<Map.Entry<String, Object>> entrySet = entryDataJson.entrySet();
                    for (Map.Entry<String, Object> map : entrySet) {
                        if (map.getKey().equals("DYNAMIC_TABLE_SEQ_ID")) {
                            pre_data_save_event_sql = pre_data_save_event_sql.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()) + "'");
                        } else {
                            pre_data_save_event_sql = pre_data_save_event_sql.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()).toUpperCase() + "'");
                        }
                    }
                }
                String[] vrnoSQL_appendSQL = pre_data_save_event_sql.split("~~");
                System.out.println("VRNO SQL AFTER REPLACING :-->  " + vrnoSQL_appendSQL[0]);
                try {
                    PreparedStatement ps = connection.prepareStatement(vrnoSQL_appendSQL[0]);
                    ps.executeUpdate();
                } catch (Exception e) {
                    try {
                        String ValidatedMsgArr[] = e.getMessage().split(":");
                        String ValidatedMsgArr1[] = ValidatedMsgArr[1].trim().split("ORA-");
                        PDSE_VRNO = ValidatedMsgArr1[0].trim();
                        System.out.println("PDSE_VRNO : " + PDSE_VRNO);
                    } catch (Exception ex) {
                        System.out.println("ERROR In PDSE_VRNO");
                    }
                }
                if (vrnoSQL_appendSQL.length > 1) {
                    if (PDSE_VRNO != null && !PDSE_VRNO.isEmpty() && vrnoSQL_appendSQL[1] != null && !vrnoSQL_appendSQL[1].isEmpty()) {
                        vrnoSQL_appendSQL[1] = vrnoSQL_appendSQL[1].replaceAll("GEN_VRNO", PDSE_VRNO);
                        System.out.println("APPEND VRNO SQL AFTER REPLACING :-->  " + vrnoSQL_appendSQL[1]);
                        try {
                            PreparedStatement ps = connection.prepareStatement(vrnoSQL_appendSQL[1]);
                            ps.executeUpdate();
                        } catch (Exception e) {
                            System.out.println("ERORR IN APPEND VRNO--> " + e.getMessage());
                            System.out.println(e.getCause());
                        }
                    }
                }
            }

            if (jsonArray.size() > 1) {
                //image save logic

                try {
                    InputStream is;
                    for (int i = 1; i < jsonArray.size(); i++) {
                        JSONObject obj1 = (JSONObject) jsonArray.get(i);
//                        imgfileID = new HashMap<String, String>();
                        System.out.println("fileId -- > " + obj1.get("fileId"));
                        System.out.println("columnTableName -- > " + columnTableName.get(obj1.get("fileId")));
                        String imgColumnTableName = columnTableName.get(obj1.get("fileId"));
//                        System.out.println("columnTableName -- > " + columnTableName.get(obj1.get("fileId")));
                        imgfileID.put(obj1.get("fileId").toString(), seq_id + "." + i);
                        seqIdList.add(seq_id + "." + i);
                        if (imgColumnTableName != null && !imgColumnTableName.isEmpty()) {
                            if (imgColumnTableName.contains("LHSSYS_PORTAL_APP_TRAN") || imgColumnTableName.contains("LHSSYS_PORTAL_APP_LOC_TRAN")) {
                                try {
                                    if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {

//                                        for (String key : imgfileID.keySet()) {
//                                            System.out.println(key + " " + imgfileID.get(key));
//                                            String replaceKey = imgfileID.get(key).replaceAll("(\\d+)(.\\d+)", seq_id + "\\.$2");
//                                            U.log("replaceKey : " + replaceKey);
//                                            imgfileID.put(key, seq_id + "." + i);
//                                        }
                                        U.log("imageTime: " + obj1.get("imageTime").toString()
                                                + "\n fileName : " + obj1.get("fileName").toString()
                                                + "\n USER_CODE : " + USER_CODE
                                                + "\n image desc : " + obj1.get("desc").toString()
                                                + " \n sysFileName : " + obj1.get("sysFileName").toString());

                                        System.out.println("imgfileID.get(fileId) : " + imgfileID.get(obj1.get("fileId").toString()));
                                        String fileId = obj1.get("fileId").toString();
                                        is = writeOnImage(obj1.get("file").toString(), obj1.get("imageTime").toString());
                                        if (obj1.get("sysFileName").toString().contains("sysFileName")
                                                || obj1.get("sysFileName").toString().indexOf("sysFileName") > -1
                                                || obj1.get("sysFileName").toString().lastIndexOf("sysFileName") > -1) {
                                            insertDocument(obj1.get("fileName").toString(), USER_CODE, obj1.get("desc").toString(),
                                                    obj1.get("sysFileName").toString(), is, Double.parseDouble(imgfileID.get(fileId)), imgColumnTableName);
                                        } else {
                                            U.log("IMAGE PATH : " + obj1.get("sysFileName"));
                                            writeFile(is, obj1);
                                        }
                                    }

                                    if (obj1.get("videofile") != null && obj1.get("videofile").toString().length() > 3) {
                                        String base64Image = obj1.get("videofile").toString().split(",")[1];
                                        byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
                                        is = new ByteArrayInputStream(imageBytes);
                                        if (is == null) {
                                            U.log("video file is null");
                                        }
                                        insertVideo(obj1.get("videoFileName").toString(), USER_CODE, obj1.get("videoDesc").toString(),
                                                obj1.get("sysFileName").toString(), is,
                                                Float.parseFloat(videofileId.get(obj1.get("videoFileId").toString())));
                                    }
                                } catch (Exception e) {
                                    System.out.println("exeception 1---> " + e.getMessage());
                                }

                            } else if (imgColumnTableName.contains("DOC_TRAN")) {

                                insertImageIntoDocTran(imgColumnTableName, obj1, json);

                            } else {
                                insertImageIntoOtherTable(imgColumnTableName, obj1, json);
                            }
                        } else {
                            System.out.println("img Column Table Name Not found");
                        }
                    }
                } catch (Exception e) {
                    System.out.println("exeception 2---> " + e.getMessage());
                }

            }
            if (PDSE_VRNO != null && !PDSE_VRNO.isEmpty()) {
            } else {
                generateProdTranVrno(entryDataJson);
            }

            if (table_desc_data.get("execute_after_insert") != null && table_desc_data.get("execute_after_insert").length() > 2) {
                String procedureOfInsert = table_desc_data.get("execute_after_insert");
                try {
                    Set<Map.Entry<String, String>> entrySet = imgfileID.entrySet();
                    for (Map.Entry<String, String> map : entrySet) {
                        procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + map.getValue() + "'");
                    }
                } catch (Exception e) {
                    System.out.println("imgfileID keySetIterator ERROR ---> " + e.getMessage());
                }

                for (int k = 0; k < entryDataJson.size(); k++) {
                    Set<Map.Entry<String, Object>> entrySet = entryDataJson.entrySet();
                    for (Map.Entry<String, Object> map : entrySet) {
                        int imgFileIDCount = seqIdList.size();
                        if (imgFileIDCount > 0) {
                            for (int i = 0; i < imgFileIDCount; i++) {
                                procedureOfInsert = procedureOfInsert.replace("'IMG" + i + "'", "'" + seqIdList.get(i) + "'");
                            }
                        }
//                        System.out.println("MAP KEY : " + map.getKey());
//                        System.out.println("MAP VALUE : " + map.getValue());
                        if (map.getKey().equals("DYNAMIC_TABLE_SEQ_ID")) {
                            procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + String.valueOf(map.getValue()) + "'");
//                        } else if (map.getKey().equals("VRNO") && map.getValue().equals(null)) {
                        } else if (map.getKey().equals("VRNO") && map.getValue() == null) {
                            if (PDSE_VRNO != null && !PDSE_VRNO.isEmpty()) {
                                procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + PDSE_VRNO + "'");
                            }
                            if (ProdVRNO != null && !ProdVRNO.isEmpty()) {
                                procedureOfInsert = procedureOfInsert.replace("'" + map.getKey() + "'", "'" + ProdVRNO + "'");
                            }
                        } else {
                            Object val = map.getValue();//String.valueOf(map.getValue()).toUpperCase() 
                            if (val == null) {
                                val = "";
                            }
                            procedureOfInsert = procedureOfInsert.replace("'" + map.getKey()
                                    + "'", "'" + val + "'");
                        }
                    }
                }
                procedureOfInsert = procedureOfInsert.replace("'SEQ_ID'", "'" + seq_id + "'");
                try {
                    System.out.println("FINAL REPLACED VALUE procedureOfInsert : " + procedureOfInsert);
                    ps = connection.prepareStatement(procedureOfInsert);
                    int n = ps.executeUpdate();
                    if (n >= 0) {
                        String result = n + " row inserted.";
                        fileUploadStatus.setStatus(returnResult);
                        System.out.println(" execute_after_insert result : " + result);
                    } else {
                        String result = n + " row updated";
                        fileUploadStatus.setStatus(result);
                        System.out.println(" execute_after_insert result : " + result);
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
//                            return returnMessage;
                    //                        return "Error occoured sue to some internal reason.";

                }
//                }
            } else {
                fileUploadStatus = addInsertEntry(entryDataJson);
            }

            if (PDSE_VRNO != null && !PDSE_VRNO.isEmpty()) {
                fileUploadStatus.setVRNO(PDSE_VRNO);
            }
            if (ProdVRNO != null && !ProdVRNO.isEmpty()) {
                fileUploadStatus.setVRNO(ProdVRNO);
            }

            fileUploadStatus.setVrnoColumnName(table_desc_data.get("pdse_column_name"));

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("exeception 4---> " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                    connection.close();
                } catch (SQLException e) {
                }
            }
        }

        return fileUploadStatus;
    }

    public void getAccYear() {
        String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE "
                + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )"
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

    public FileUploadStatus addEntrySql(String jsonString, String sqlFlag) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    private HashMap<String, String> getTableDescData(String seq_no) {
        HashMap<String, String> tableDesc = new HashMap<String, String>();
        String getAccYearSQL = "SELECT * FROM LHSSYS_PORTAL_TABLE_DSC_UPDATE U WHERE U.SEQ_NO = '" + seq_no + "'";
        try {
            ps = connection.prepareStatement(getAccYearSQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                tableDesc.put("pre_data_save_event", rs.getString("pre_data_save_event"));
                tableDesc.put("execute_after_update", rs.getString("execute_after_update"));
                tableDesc.put("execute_after_insert", rs.getString("execute_after_insert"));
                tableDesc.put("pdse_column_name", rs.getString("entry_save_redirect_link"));
            } else {
                System.out.println("DIDN'T GOT CURRENT ACC YEAR : " + getAccYearSQL);
            }
        } catch (Exception e) {
        }
        return tableDesc;
    }

    private void generateProdTranVrno(JSONObject json_obj) {
        try {
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
                ps = connection.prepareStatement(getProdVRNO_SQL);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    ProdVRNO = rs.getString(1);
                    System.out.println("generatedProdVRNO : " + ProdVRNO);

                    if (!ProdVRNO.isEmpty()) {
                        appendProdVRNO_SQL = appendProdVRNO_SQL.replaceAll("GEN_VRNO", ProdVRNO);
                        System.out.println("appendProdVRNO_SQL with VRNO: " + appendProdVRNO_SQL);
                        try {
                            ps = connection.prepareStatement(appendProdVRNO_SQL);
                            ps.executeUpdate();
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
                try {
                    System.out.println("ERORR--> " + e.getMessage());
//            System.out.println(e.getCause());
                    String temp_vrno = e.getMessage();
                    String prodVRNO_SQLArrr[] = temp_vrno.split("ORA-20000:");
                    temp_vrno = prodVRNO_SQLArrr[1].trim();
                    String prodVRNO_SQLArrrr[] = temp_vrno.split("ORA-06512:");
                    ProdVRNO = prodVRNO_SQLArrrr[0].trim();
                    System.out.println("generatedProdVRNO : " + ProdVRNO);
//                columnValue = generatedProdVRNO;
                    if (!ProdVRNO.isEmpty()) {
                        appendProdVRNO_SQL = appendProdVRNO_SQL.replaceAll("GEN_VRNO", ProdVRNO);
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
                } catch (Exception ex) {
                    System.out.println("ERORR--> " + e.getMessage());
                    ProdVRNO = null;
                }
            }
        } catch (Exception e) {
            System.out.println("exeception 5---> " + e.getMessage());
        }
    }

    public String getReplacedprodVRNO_SQL(JSONObject jsonObject) throws ParseException {
        Set<Object> set = jsonObject.keySet();
        Iterator<Object> iterator = set.iterator();
        String prodVRNO_SQL
                = "DECLARE  v_out VARCHAR2(50); BEGIN"
                + "  v_out :=GET_VRNO('SERIES', to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy'), 'PAD',"
                + "                'ENTITY_CODE', 'DIV_CODE','ACC_YEAR','TCODE') ;"
                + "  DBMS_OUTPUT.put_line(v_out || SQLERRM);"
                + "  RAISE_APPLICATION_ERROR(-20000, v_out);"
                + "  return;"
                + "END;"
                + "~"
                + "BEGIN"
                + "  APPEND_VRNO('GEN_VRNO', 'ENTITY_CODE', 'DIV_CODE', 'ACC_YEAR', 'TCODE');"
                + "END;";

//        LHS_UTILITY.
        while (iterator.hasNext()) {
            Object obj = iterator.next();

            try {

                String columnValue = "";
                try {
                    columnValue = jsonObject.get(obj).toString();
                } catch (Exception e) {
//                    if (f.isNumber(obj.toString())) {
//                        columnValue = null;
//                    } else {
//                        columnValue = "";
//                    }
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
        return prodVRNO_SQL;
    }

    private FileUploadStatus addInsertEntry(JSONObject entryDataJson) {
        FileUploadStatus fileUploadStatus = new FileUploadStatus();

        U.log("Table Name : " + table_name);

        parseJson(entryDataJson);

//        System.out.println("columnName--> " + colName.toString());
//        System.out.println("colValue--> " + colValue.toString());
        try {
            String lastupadte = columnDefaultValue.get("LASTUPDATE");
            if (lastupadte != null && !lastupadte.isEmpty()) {
                if (lastupadte.contains("sysdate")) {
                    colName.append("LASTUPDATE ,");
                    colValue.append("sysdate" + ",");
                }
            }
        } catch (Exception e) {
        }
        if (table_name.equals("LHSSYS_PORTAL_APP_TRAN") || table_name.equals("LHSSYS_PORTAL_APP_LOC_TRAN")) {
            try {
                colName.append("COL1 ,");
                colValue.append(seq_no + ",");
                colName.append("DYNAMIC_TABLE_SEQ_ID ,");
                colValue.append(seq_no + ",");
                colName.append("seq_id ,");
                colValue.append(seq_id + ",");
                if (!colName.toString().contains("USER_CODE")) {
                    colName.append("USER_CODE ,");
                    colValue.append("'" + USER_CODE + "',");
                }
            } catch (Exception e) {
            }
        }
        String columnName = colName.toString().substring(0, colName.toString().lastIndexOf(","));
        String columnValue = colValue.toString().substring(0, colValue.toString().lastIndexOf(","));
        String insertSql = "Insert into " + table_name + "\n" + "     (" + columnName + ") values(" + columnValue + ")";

        try {
//            sqlData = sqlData + "\n----------NEW ENTRY INSERT QUERY ----------\n" + stringBuffer.toString();
            ps = connection.prepareStatement(insertSql);
            System.out.println("SYSDATE : " + sysdate + " NEW ENTRY INSERT QUERY :  " + insertSql);
//            fileUploadStatus.setSqlData(sqlData);
            ps.execute();
            String result = "insert data";
            fileUploadStatus.setStatus(result);
            System.out.println("result==" + result);
        } catch (Exception e) {
            System.out.println("ADD ENTRY EXCEPTION  : " + e.getMessage());
            fileUploadStatus.setStatus("Something went wrong, please try again...");
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    System.out.println("exeception 7---> " + e.getMessage());
                }
            }
        }

        return fileUploadStatus;
    }

    private void parseJson(JSONObject jsonObject) {
        jsonObject = checkStartAndEndDate(jsonObject);
        HashMap<String, String> defultValue = new HashMap<String, String>();

//        StringBuffer colName = new StringBuffer();
//        StringBuffer colValue = new StringBuffer();
        Set<Object> set = jsonObject.keySet();
        Iterator<Object> iterator = set.iterator();

        while (iterator.hasNext()) {
            Object obj = iterator.next();
            if (U.match(obj.toString().toLowerCase(), "col[2]{1}$", 0) != null
                    || obj.toString().toUpperCase().contains("USER_CODE")) {
                USER_CODE = jsonObject.get(obj).toString();
                defultValue.put("USER_CODE", "'" + USER_CODE + "'");
            }
//            System.out.print("Name --> " + obj.toString() + " Status -->" + columnStatus.get(obj) + "  Type -->" + columnType.get(obj));
            if (!obj.toString().contains("DYNAMIC_TABLE_SEQ_ID") && !obj.toString().equals("SERIES")) {
                if (columnStatus.get(obj).equalsIgnoreCase("D")) {
                } else {
                    String columnValue = "";

                    if (columnType.get(obj).contains("IMG") && columnTableName.get(obj).equalsIgnoreCase("LHSSYS_PORTAL_APP_TRAN")) {
                        columnValue = imgfileID.get(obj.toString());
                    }
//                    if (obj.toString().contains("LASTUPDATE") || obj.toString().contains("LAST_UPDATE")) {
//                        columnValue = sysdate;
//                    }
                    String VRDATEFORMAT_SQL = "SELECT V.VRDATEFORMAT, V.CHQDATE, V.APPROVEDDATE_FORMAT "
                            + " FROM VIEW_DEFAULT_USER_LINKS V";
                    String VRDATEFORMAT = "";
                    try {
                        ps = connection.prepareStatement(VRDATEFORMAT_SQL);
                        rs = ps.executeQuery();
                        if (rs != null && rs.next()) {
                            do {
                                VRDATEFORMAT = rs.getString(1);
                            } while (rs.next());
                        }
                    } catch (Exception e) {
                        System.out.println("exeception 8---> " + e.getMessage());
                    } finally {
                        if (ps != null) {
                            try {
                                ps.close();
                                rs.close();
                            } catch (Exception e) {
                            }
                        }
                    }
                    if (columnType.get(obj).toString().contains("DATE") && !obj.toString().equalsIgnoreCase("LASTUPDATE")) {
                        columnValue = jsonObject.get(obj).toString();
                        if (columnValue != null && !columnValue.isEmpty() && !columnValue.equals("")) {
                            if (columnType.get(obj).equals("DATE")) {
                                columnValue = "to_date('" + columnValue + "','dd-mm-yyyy')";
                            } else {
                                if (columnType.get(obj).equals("DATETIME")) {
                                    columnValue = "to_date('" + columnValue + "','" + VRDATEFORMAT + "')";
                                }
                            }
                        } else {
                        }
                    }

                    if (obj.toString().contains("TASK_SEQ_NO")) {
                        String taskSeqNoSql = "SELECT MAX(TASK_SEQ_NO) + 1 FROM TASK_TRAN";
                        int maxSeqNo = 0;
                        try {
                            PreparedStatement ps1 = connection.prepareStatement(taskSeqNoSql);
                            ResultSet rs1 = ps1.executeQuery();
                            if (rs1.next()) {
                                maxSeqNo = rs1.getInt(1);
                            } else {
                                ps1 = connection.prepareStatement("SELECT COUNT(*) + 1 FROM TASK_TRAN");
                                rs1 = ps1.executeQuery();
                                if (rs1.next()) {
                                    maxSeqNo = rs1.getInt(1);
                                }
                            }
                        } catch (Exception e) {
                            System.out.println("exeception 9---> " + e.getMessage());
                        }
                        columnValue = String.valueOf(maxSeqNo);
                    }

                    if (obj.toString().equalsIgnoreCase(table_desc_data.get("pdse_column_name"))) {
                        columnValue = "'" + PDSE_VRNO + "'";
                    }
                    if (obj.toString().equals("VRNO") && columnValue.isEmpty()) {
                        if (PDSE_VRNO != null && !PDSE_VRNO.isEmpty()) {
                            columnValue = "'" + PDSE_VRNO + "'";
                        }
                        if (ProdVRNO != null && !ProdVRNO.isEmpty()) {
                            columnValue = "'" + ProdVRNO + "'";
                        }
                    }

                    if (obj.toString().contains("SEQ_ID")) {
                        if (table_name.equals("LHSSYS_PORTAL_APP_TRAN") || table_name.equals("LHSSYS_PORTAL_APP_LOC_TRAN")) {
                            columnValue = "'" + seq_id + "'";
                        }
                    }
//                    if (columnValue == null || columnValue.isEmpty() || columnValue == "") {
                    try {
                        if (columnDefaultValue.get(obj).equalsIgnoreCase("sysdate") || columnDefaultValue.get(obj).equalsIgnoreCase("'sysdate'")) {
                            if (columnType.get(obj).equalsIgnoreCase("DATE")) {
                                columnValue = "TRUNC(" + sysdate + ")";
                            } else if (columnType.get(obj).equalsIgnoreCase("DATEC")) {
                                columnValue = "TO_CHAR(" + sysdate + ", 'DD-MM-RRRR')";
                            } else {
                                columnValue = sysdate;
                            }
                        }
                    } catch (Exception e) {
                    }
//                    }

                    if (columnValue == null || columnValue.isEmpty() || columnValue == "") {
                        try {
                            columnValue = "'" + jsonObject.get(obj).toString() + "'";
                        } catch (Exception e) {
                            if (columnType.get(obj).equals("NUMBER")) {
                                columnValue = null;
                            } else {
                                columnValue = "''";
                            }
                        }
                    }
                    System.out.println(obj.toString() + " --> " + columnValue);

                    colName.append(obj.toString() + ",");
                    colValue.append(columnValue + ", ");
                }
            }
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
                    c.set(year, month - 1, day);
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
            System.out.println("exeception 10---> " + e.getMessage());
        }
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

    public String insertDocument(String fileName, String userCode, String discribtion,
            String systemFileName, InputStream fin, double fileId, String tableName) throws Exception {
        String status = "";
        if (fin == null) {
        }
        String imageUploadTable = "";
        if (tableName.equalsIgnoreCase("LHSSYS_PORTAL_APP_LOC_TRAN")) {
            imageUploadTable = "LHSSYS_PORTAL_APP_LOC_ATTH";
        } else {
            imageUploadTable = "LHSSYS_PORTAL_UPLOAD_FILE";
        }
        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            sqlDocumentInsert = "insert into " + imageUploadTable + " (FILE_ID,FILE_NAME,"
                    //                    + "UPLOADATE_DATE,LAST_UPDATED,DESCRIBTION,USER_CODE,FLAG,SYSTEM_FILE_NAME,STORE_FILE) "
                    + "UPLOADATE_DATE,LAST_UPDATED,DESCRIBTION,USER_CODE,FLAG,SYSTEM_FILE_NAME,STORE_FILE) "
                    + "values (?,?,sysdate,sysdate,?,?,'h',?,?)";

            System.out.println("fileID : " + fileId + "\n   IMAGE INSERT SQL : " + sqlDocumentInsert);
            System.out.println("IMAGE DATA : " + fin.toString());
            pst = connection.prepareStatement(sqlDocumentInsert);
            System.out.println(" insertDocument userCode : " + userCode);
            if (userCode == null) {
                userCode = fileId + "";
            }
            System.out.println(" insertDocument userCode 1 : " + userCode);
            pst.setDouble(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());
//            pst.setBinaryStream(7, fin, fin.available());

            boolean i = false;
            i = pst.execute();
            if (i) {
                status = "add entry";
            } else {
                status = "IMAGE NOT INSERTED";
            }
            System.out.println("IMAGE INSERT STATUS : " + status);
        } catch (Exception e) {
            System.out.println("exeception 11---> " + e.getMessage());
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException ex) {
                    System.out.println("exeception 12---> " + ex.getMessage());
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
                    System.out.println("exeception 13---> " + ex.getMessage());
                }
            }
        }
        return i;
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
            String query = " SELECT T.tool_tip"
                    + " FROM LHSSYS_PORTAL_DATA_DSC_UPDATE T"
                    + " WHERE T.SEQ_NO = " + seq_no + " and T.Column_Name = '" + columnName + "'"
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
            int jsonArrLength = jsonArray.size();

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
//            for (int i = 1; i < jsonArrLength; i++) {
//                JSONObject obj1 = (JSONObject) jsonArray.get(i);
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
                    System.out.println("exeception 14---> " + e.getMessage());
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
            System.out.println("exeception 15---> " + e.getMessage());
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
            System.out.println("doc_tran_image ---> " + "insert into doc_tran_image (doc_code,doc_slno,doc_image)values(" + doc_code + "," + docSlno + ",?)");
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
            System.out.println("exeception 16---> " + e.getMessage());
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
                System.out.println("sqlDocumentInsert---> " + sqlDocumentInsert);
                pst = connection.prepareStatement(sqlDocumentInsert);
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
                System.out.println("exeception 17---> " + e.getMessage());
            }
        }
    }

    public int nextSeqID(String tableName) {
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

}
