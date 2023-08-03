/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.ListOfApprovalsJSON;
import com.lhs.EMPDR.Model.ListOfApprovalsModel;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 *
 * @author kirti.misal
 */
public class JDBCListOfApprovalsDAO {

    Connection con;

    public JDBCListOfApprovalsDAO(Connection c) {
        this.con = c;
    }

    public ListOfApprovalsJSON findListOfApprovals(String entityCode, String tnature, String userCode, String type, String slno,
            String seq_no, String selectMonth, String pageNumber, String filterJson) throws ParseException {
        String paginationFlag = "";
        ListOfApprovalsJSON json = new ListOfApprovalsJSON();
        List<ListOfApprovalsModel> approvalsList = new ArrayList<ListOfApprovalsModel>();
        String query = " select sql_text,pl_sql_text,report_format from LHSSYS_ALERT_DIRECT_EMAIL "
                + " where batch_file='" + tnature + "' and seq_id not like '%.%'";

        if (slno != null && !slno.isEmpty() && slno != null && !seq_no.isEmpty()) {
            query = "SELECT sql_text,report_format FROM Lhssys_Alert_Direct_Email_Para\n"
                    + " where seq_id = '" + seq_no + "'  and slno =" + slno;
        }
        
        String listOfApprovalsQuery = "";
        PreparedStatement ps = null;
        U.log(query);

        int pageNo = 0;
        if (pageNumber != null && !pageNumber.isEmpty()) {
            pageNo = Integer.parseInt(pageNumber);
        }
        int fromRowNum = (pageNo * 15) + 1;
        int toRowNum = (pageNo + 1) * 15;

        int count = 0;
        try {
            ps = con.prepareStatement(query);

            ResultSet rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                if (type != null) {
                    if (type.equalsIgnoreCase("pending")) {
                        listOfApprovalsQuery = rs.getString(1);
                    } else {
                        listOfApprovalsQuery = rs.getString(2);
                    }
                } else {
                    listOfApprovalsQuery = rs.getString(1);
                }
                paginationFlag = rs.getString("report_format");
            }

            System.out.println("listOfApprovalsQuery--> " + listOfApprovalsQuery);
            if (listOfApprovalsQuery != null && !listOfApprovalsQuery.isEmpty()) {
                listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("'USERCODE'", "'" + userCode.toUpperCase() + "'")
                        .replaceAll("'TNATURE'", "'" + tnature + "'")
                        .replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
                        .replaceAll("ROWFROM", Integer.toString(fromRowNum)).replaceAll("ROWTO", Integer.toString(toRowNum)).replace(";", "");
                try {
                    //System.out.println("TRY CATCH");
                    JSONParser json_parser = new JSONParser();
                    JSONObject listjson = (JSONObject) json_parser.parse(filterJson);
                    JSONArray jsonArray = (JSONArray) listjson.get("filterJson");
                    for (int i = 0; i < jsonArray.size(); i++) {
                        System.out.println("INSIDE FOR LOOP");
                        JSONObject entryDataJson = (JSONObject) jsonArray.get(i);
                        String key = entryDataJson.get("column_name") + "";
//                        System.out.println("KEY: "+ key);
                        String keyValue = "";
                        String seq_no2 = entryDataJson.get("value") + "";
//                        System.out.println("SEQ 2 "+ seq_no2);
                        String seq_no3 = entryDataJson.get("codeOfValue") + "";
//                        System.out.println("SEQ 3 "+ seq_no3);
//                        if (seq_no3 != null || seq_no3 != "null" || !seq_no3.equals(null)) {
//                            keyValue = seq_no3;
//                        } else {
                        keyValue = seq_no2;
//                        }
                        listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("'" + key + "'", "'" + keyValue + "'");
                    }
                } catch (Exception e) {
//                    e.printStackTrace();
                    System.out.println("INSIDE filterJson CATCH BLOCK");
                }

                if (selectMonth != null) {
                    System.out.println("selectMonth :" + selectMonth);
//                    System.out.println("listOfApprovalsQuery1 :"+listOfApprovalsQuery);
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("MONTH", selectMonth);
                } else {
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("MONTH", "to_char(sysdate,'mm')");
                }
                System.out.println("listOfApprovalsQuery : " + listOfApprovalsQuery);
                ps = con.prepareStatement(listOfApprovalsQuery);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        ListOfApprovalsModel model = new ListOfApprovalsModel();
                        try {
                            model.setAccCode(rs.getString("Acc_Code"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setAccName(rs.getString("acc_name"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setAmendno(rs.getString("amendno"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setAmount(rs.getString("amount"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setUserCode(rs.getString("user_code"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setVrDate(rs.getString("vrdate"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setVrno(rs.getString("vrno"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setbHeadings(rs.getString("bheading"));
                        } catch (Exception e) {
                        }
                        try {
                            model.settCode(rs.getString("tcode"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setDivCode(rs.getString("div_code"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setEntityCode(rs.getString("entity_code"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setRefNo(rs.getString("refno"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setEntityCode(rs.getString("entity_code"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setDueDate(rs.getString("duedate"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setTnature(rs.getString("tnature"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setFrom_date(rs.getString("from_date"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setTo_date(rs.getString("to_date"));
                        } catch (Exception e) {
                        }
                        try {
                            model.setRemark(rs.getString("remark"));
                        } catch (Exception e) {
                        }

                        approvalsList.add(model);
                    } while (rs.next());
                } else {
                }
            }
        } catch (Exception e) {
            System.out.println("exeception ---> " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                    con.close();
                    con = null;
                } catch (SQLException e) {
                    System.out.println("exeception ---> " + e.getMessage());
                }
            }
        }
        json.setListOfApprovals(approvalsList);
        json.setPaginationFlag(paginationFlag);
        return json;
    }

    public ListOfApprovalsJSON findListOfApprovals1(String entityCode, String tnature, String userCode, String type, String slno,
            String seq_no, String selectMonth, String pageNumber, String filterJson) throws ParseException {
        String paginationFlag = "";
        String textColor = "";
        int noOfColumns = 0;
        ListOfApprovalsJSON json = new ListOfApprovalsJSON();
        List<ListOfApprovalsModel> approvalsList = new ArrayList<ListOfApprovalsModel>();
        ArrayList<HashMap<String, String>> dataRow = new ArrayList<HashMap<String, String>>();
        String query = " select sql_text,pl_sql_text,report_format,color_code_format, no_of_column from LHSSYS_ALERT_DIRECT_EMAIL "
                + " where batch_file='" + tnature + "' and seq_id not like '%.%'";

        if (slno != null && !slno.isEmpty() && slno != null && !seq_no.isEmpty()) {
            query = "SELECT sql_text,report_format FROM Lhssys_Alert_Direct_Email_Para\n"
                    + " where seq_id = '" + seq_no + "'  and slno =" + slno;
        }

        String listOfApprovalsQuery = "";
        PreparedStatement ps = null;
        U.log(query);

        int pageNo = 0;
        if (pageNumber != null && !pageNumber.isEmpty()) {
            pageNo = Integer.parseInt(pageNumber);
        }
        int fromRowNum = (pageNo * 15) + 1;
        int toRowNum = (pageNo + 1) * 15;

        int count = 0;
        try {
            ps = con.prepareStatement(query);

            ResultSet rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                if (type != null) {
                    if (type.equalsIgnoreCase("pending")) {
                        listOfApprovalsQuery = rs.getString(1);
                    } else {
                        listOfApprovalsQuery = rs.getString(2);
                    }
                } else {
                    listOfApprovalsQuery = rs.getString(1);
                }
                paginationFlag = rs.getString("report_format");
                textColor = rs.getString("color_code_format");
                noOfColumns = rs.getInt("no_of_column");
            }

            System.out.println("listOfApprovalsQuery--> " + listOfApprovalsQuery);
            if (listOfApprovalsQuery != null && !listOfApprovalsQuery.isEmpty()) {
                listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("'USERCODE'", "'" + userCode.toUpperCase() + "'")
                        .replaceAll("'TNATURE'", "'" + tnature + "'")
                        .replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
                        .replaceAll("ROWFROM", Integer.toString(fromRowNum)).replaceAll("ROWTO", Integer.toString(toRowNum)).replace(";", "");
                try {
                    JSONParser json_parser = new JSONParser();
                    JSONObject listjson = (JSONObject) json_parser.parse(filterJson);
                    JSONArray jsonArray = (JSONArray) listjson.get("filterJson");
                    for (int i = 0; i < jsonArray.size(); i++) {
                        JSONObject entryDataJson = (JSONObject) jsonArray.get(i);
                        String key = entryDataJson.get("column_name") + "";
                        String keyValue = "";
                        String seq_no2 = entryDataJson.get("value") + "";
                        String seq_no3 = entryDataJson.get("codeOfValue") + "";
                        keyValue = seq_no2;
                        listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("'" + key + "'", "'" + keyValue + "'");
                    }
                } catch (Exception e) {
                    System.out.println("INSIDE filterJson CATCH BLOCK");
                }

                ArrayList<String> rsMetaList = new ArrayList<String>();
                if (selectMonth != null) {
                    System.out.println("selectMonth :" + selectMonth);
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("MONTH", selectMonth);
                } else {
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("MONTH", "to_char(sysdate,'mm')");
                }
                System.out.println("listOfApprovalsQuery : " + listOfApprovalsQuery);
                ps = con.prepareStatement(listOfApprovalsQuery);
                rs = ps.executeQuery();
                ResultSetMetaData resultSetMetaData = rs.getMetaData();
                int rsMetadataCount = resultSetMetaData.getColumnCount();
                System.out.println("RS META DATA COUNT: " + rsMetadataCount);
                for (int i = 1; i <= rsMetadataCount; i++) {
                    System.out.println("RS META DATA: " + resultSetMetaData.getColumnName(i));
                    rsMetaList.add(resultSetMetaData.getColumnName(i));
                }

                System.out.println("RS META DATA LIST: " + rsMetaList.toString());

                if (rs != null && rs.next()) {
                    do {
                        HashMap<String, String> localList = new HashMap<String, String>();
                        for (int k = 0; k < rsMetaList.size(); k++) {
                            localList.put(rsMetaList.get(k), rs.getString(rsMetaList.get(k)));
                        }

                        dataRow.add(localList);
                    } while (rs.next());
                }
            }
        } catch (Exception e) {
            System.out.println("exeception ---> " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                    con.close();
                    con = null;
                } catch (SQLException e) {
                    System.out.println("exeception ---> " + e.getMessage());
                }
            }
        }

        json.setDynamicList(dataRow);
        json.setListOfApprovals(approvalsList);
        json.setPaginationFlag(paginationFlag);
        json.setNoOfColumns(noOfColumns);
        json.setTextColor(textColor);
        return json;
    }

    public ArrayList<LinkedHashMap<String, String>> paraDetailsOfApproval(String entityCode, String tnature, String userCode,
            String tCode, String vrno, String value, String seqId, String slno, String vrDate) {
//        List<ListOfApprovalsModel> approvalsList = new ArrayList<ListOfApprovalsModel>();
        System.out.println("VALUE------->    " + value);
        String query = " select * from LHSSYS_ALERT_DIRECT_EMAIL_PARA where seq_id = '" + seqId + "' AND SLNO ='" + slno + "'";
        System.out.println("Obtain paraDetailsOfApprovalSQL : " + query);
        String listOfApprovalsQuery = "";
        String columnValue = "";
        PreparedStatement ps = null;

        ResultSet rs = null;
        String accYear = "";
        String accYearBegDate = "";
        String accYearEndDate = "";
        String accYearSQL = "SELECT A.ACC_YEAR, TO_CHAR(A.YRBEGDATE), TO_CHAR(A.YRENDDATE) FROM ACC_YEAR_MAST A WHERE to_char(to_date(SUBSTR(sysdate, 1, 10),"
                + " 'dd-mm-yyyy')) between A.YRBEGDATE AND A.YRENDDATE AND ROWNUM =1 ORDER BY ACC_YEAR DESC";
        try {
            ps = con.prepareStatement(accYearSQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                accYear = rs.getString(1);
                accYearBegDate = rs.getString(2);
                accYearEndDate = rs.getString(3);
            }
        } catch (Exception e) {
        } finally {
            try {
                rs.close();
                ps.close();
            } catch (Exception e) {
            }
        }
        U.log(query);
        int count = 0;

        ArrayList<LinkedHashMap<String, String>> arrayOfCardDetail = new ArrayList<LinkedHashMap<String, String>>();

        try {
            ps = con.prepareStatement(query);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                listOfApprovalsQuery = rs.getString("SQL_TEXT");
                columnValue = rs.getString("COLUMN_VALUE");
            }
            if (listOfApprovalsQuery != null) {
                if (listOfApprovalsQuery.contains("~")) {
                    String[] replaceValue = value.split("~");
                    String rpclValue = replaceValue[0];
                    String rpclVal = replaceValue[1];
                    String[] replaceValueE = rpclVal.split("@");
                    for (int i = 0; i < replaceValueE.length; i++) {
                        listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("~VAL" + i, replaceValueE[i]);
                    }
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("'USERCODE'", "'" + userCode.toUpperCase() + "'")
                            .replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
                            .replaceAll("'VALUE'", "'" + rpclValue + "'")
                            .replaceAll("'TNATURE'", "'" + tnature.toUpperCase() + "'")
                            .replaceAll("'VRNO'", "'" + vrno + "'")
                            .replaceAll("'TCODE'", "'" + tCode + "'")
                            .replaceAll("'VRDATE'", "'" + vrDate + "'")
                            .replaceAll("'ACCYEAR'", "'" + accYear + "'")
                            .replaceAll("'ACCYEARBEGDATE'", "'" + accYearBegDate + "'")
                            .replaceAll("'ACCYEARENDDATE'", "'" + accYearEndDate + "'")
                            .replace(";", "");
                } else {
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("'USERCODE'", "'" + userCode.toUpperCase() + "'")
                            .replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
                            .replaceAll("'VALUE'", "'" + value + "'")
                            .replaceAll("'TNATURE'", "'" + tnature.toUpperCase() + "'")
                            .replaceAll("'VRNO'", "'" + vrno + "'")
                            .replaceAll("'TCODE'", "'" + tCode + "'")
                            .replaceAll("'VRDATE'", "'" + vrDate + "'")
                            .replaceAll("'ACCYEAR'", "'" + accYear + "'")
                            .replaceAll("'ACCYEARBEGDATE'", "'" + accYearBegDate + "'")
                            .replaceAll("'ACCYEARENDDATE'", "'" + accYearEndDate + "'")
                            .replace(";", "");
                }

                System.out.println("paraDetailsOfApprovalSQL : " + listOfApprovalsQuery);
                ps = con.prepareStatement(listOfApprovalsQuery);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        String paraValue = rs.getString(1);
                        String[] headingArray = columnValue.split("#");
                        String[] valueArray = paraValue.split("#");

                        for (int i = 0; i < headingArray.length; i++) {
                            LinkedHashMap<String, String> jsonOutput = new LinkedHashMap<String, String>();
                            jsonOutput.put("heading", headingArray[i]);
                            jsonOutput.put("value", valueArray[i]);
                            arrayOfCardDetail.add(jsonOutput);
                        }

//                        approvalsList.add(arrayOfCardDetail);
                    } while (rs.next());
                }
            }
        } catch (Exception e) {
            System.out.println("exeception ---> " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                    con.close();
                    con = null;
                } catch (SQLException e) {
                    System.out.println("exeception ---> " + e.getMessage());
                }
            }
        }
        return arrayOfCardDetail;
    }

}
