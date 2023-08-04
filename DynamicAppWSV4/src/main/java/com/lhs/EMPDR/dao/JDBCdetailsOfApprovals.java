/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.ApprovalStatus;
import com.lhs.EMPDR.Model.DetailsOfApprovals;
import com.lhs.EMPDR.Model.DetailsOfApprovalsList;
import com.lhs.EMPDR.Model.ImageDetailsModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
import java.io.InputStream;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 *
 * @author kirti.misal
 */
public class JDBCdetailsOfApprovals {

    Connection con;
    HashMap<String, String> whereClauseValueMap = new HashMap<String, String>();

    public JDBCdetailsOfApprovals(Connection con) {
        this.con = con;
        U u = new U(this.con);
    }

    public DetailsOfApprovalsList getDetailsOfApprovals(String entity, String tnature, String tcode, String vrno, String vrDate, String accCode, String seqId, String rowIdSeq, String itemJson, String entityCode) {

        if (vrno != null) {
            vrno = vrno.split(" ")[0];
        }

        if (entityCode != null && !entityCode.isEmpty()) {
        } else {
            entityCode = entity;
        }

        System.out.println("entityCode--> " + entityCode);
        /*
          following condition not use in query bcz seq_id is a primary key 
        so i think it is sufficient for extracting data from table
        
        ------------------------------------------------
        ------------------------------------------------
        E.batch_file='"+ tnature + "' and
        -------------------------------------------------
        --------------------------------------------------
        
        I f u want to use this in query then first write valid reason for this in comment with your name
        otherwise dont dare to use this fields without my permision .
         */
        String query = " select * from LHSSYS_ALERT_DIRECT_EMAIL E where  E.seq_id like '" + seqId + ".%' and E.FLAG = 'T' ORDER BY SEQ_ID";//seq_ID like '%.%'
        String detailsQuery = "";
        String execPlsql = "";
        HashMap<Integer, String> descName = new HashMap<Integer, String>();
        HashMap<String, ArrayList<String>> headingName = new HashMap<String, ArrayList<String>>();
        ArrayList<DetailsOfApprovals> arr = new ArrayList<DetailsOfApprovals>();
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
        int count = 1;
        try {
            U.log("APPR DETAILS QUERY : " + query);
            ps = con.prepareStatement(query);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                do {

                    //find whereclause value dyanamically
                    if (itemJson != null) {
                        try {
                            setWhereClauseString(itemJson, rs);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                    //-----end------

                    String headingFlag = rs.getString("Filter_Flag");
                    String headingQuery = rs.getString("EMAIL_SQL_TEXT");
                    ArrayList<String> headingList = new ArrayList<String>();
                    if (headingFlag.equals("Q")) {
                        headingQuery = headingQuery.replaceAll("'TCODE'", "'" + tcode + "'")
                                .replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
                                .replaceAll("'ACCYEAR'", "'" + accYear + "'")
                                .replace(";", "").replaceAll("'VRNO'", "'" + vrno + "'");
                        U.log("headingQuery : " + headingQuery);
                        PreparedStatement ps1 = con.prepareStatement(headingQuery);
                        ResultSet rs1 = ps1.executeQuery();
                        if (rs1 != null && rs1.next()) {
                            String headingString = rs1.getString(1);
                            if (headingString != null || !"".equals(headingString)) {
                                headingList.addAll(Arrays.asList(headingString.split("#")));
                            }
                            U.log(rs.getString("alert_desc") + "===headingString---------> \n" + headingString);
                        }
                    } else {
                        headingList.add(rs.getString("heading1"));
                        headingList.add(rs.getString("heading2"));
                        headingList.add(rs.getString("heading3"));
                        headingList.add(rs.getString("heading4"));
                        headingList.add(rs.getString("heading5"));
                        headingList.add(rs.getString("heading6"));
                        headingList.add(rs.getString("heading7"));
                        headingList.add(rs.getString("heading8"));
                        headingList.add(rs.getString("heading9"));
                        headingList.add(rs.getString("heading10"));
                        headingList.add(rs.getString("heading11"));
                        headingList.add(rs.getString("heading12"));
                        headingList.add(rs.getString("heading13"));
                        headingList.add(rs.getString("heading14"));
                        headingList.add(rs.getString("heading15"));
                        headingList.add(rs.getString("heading16"));
                        headingList.add(rs.getString("heading17"));
                        headingList.add(rs.getString("heading18"));
                        headingList.add(rs.getString("heading19"));
                        headingList.add(rs.getString("heading20"));
                        headingList.add(rs.getString("heading21"));
                        headingList.add(rs.getString("heading22"));
                        headingList.add(rs.getString("heading23"));
                        headingList.add(rs.getString("heading24"));
                        headingList.add(rs.getString("heading25"));
                    }

                    detailsQuery = rs.getString("sql_text");
                    execPlsql = rs.getString("pl_sql_text") != null ? rs.getString("pl_sql_text") : "begin null; end;";
                    U.log("detailsQuery : " + detailsQuery);
                    headingName.put(rs.getString("alert_desc"), headingList);
                    descName.put(count - 1, rs.getString("alert_desc") + ":~:" + detailsQuery + ":~:" + rs.getString("seq_id") + ":~:" + execPlsql);

                    count++;
                } while (rs.next());
            }
            if (descName.size() > 0) {
                for (int i = 0; i < descName.size(); i++) {
                    ArrayList<ArrayList<LinkedHashMap<String, String>>> detailHeadingValArray = new ArrayList<ArrayList<LinkedHashMap<String, String>>>();
                    DetailsOfApprovals detail = new DetailsOfApprovals();
                    String cardName = descName.get(i);
                    String splitname[] = cardName.split(":~:");
                    System.out.println("length..."+ splitname.length);
                    String plsqlProc = splitname[3] ;
                    String queryString = splitname[1];
                    U.log("seq_id");
//                    U.log("GET DETAILS OF APPROVAL SQL UNREPLACED : " + splitname[1]);
                    queryString = queryString.replaceAll("'TCODE'", "'" + tcode + "'")
                            .replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
                            .replace(";", "")
                            .replaceAll("'ACCYEAR'", "'" + accYear + "'")
                            .replaceAll("'VRDATE'", "'" + vrDate + "'")
                            .replaceAll("'ACCCODE'", "'" + accCode + "'")
                            .replaceAll("'ACCYEARBEGDATE'", "'" + accYearBegDate + "'")
                            .replaceAll("'SEQ_ID'", rowIdSeq)
                            .replaceAll("'ACCYEARENDDATE'", "'" + accYearEndDate + "'")
                            .replaceAll("'VRNO'", "'" + vrno + "'");

                    for (Map.Entry<String, String> entry : whereClauseValueMap.entrySet()) {
                        U.log("WHERECLAUSE VALUE MAP=>>" + entry.getKey() + "===" + entry.getValue());
                        queryString = queryString.replaceAll("'" + entry.getKey().toString() + "'", "'" + entry.getValue().toString() + "'");
                    }

                    U.log("GET DETAILS OF APPROVAL SQL : .1" + i + " ii" + queryString);

                    if (queryString != null) {
                        ArrayList<String> resultlist = new ArrayList<String>();
                         try {
                                if (plsqlProc != null && !plsqlProc.equals("")) {
//                                    System.out.println("plsql procedure--> " + splitname[3]);
                                    String procQuery = plsqlProc;
                                    System.out.println("plsql procedure--> " + procQuery);
                                    CallableStatement pst = con.prepareCall(procQuery);
                                    boolean result = pst.execute(procQuery);
                                    if (result) {
                                        System.out.println("plsql executed successfully");
                                    }
                                }
                            } catch (Exception ex) {
                                ex.printStackTrace();
                            }
                        ps = con.prepareStatement(queryString);
                        rs = ps.executeQuery();
                        if (rs != null && rs.next()) {
                            do {
                                resultlist.add(rs.getString(1));
                            } while (rs.next());
                        }
                        for (String result : resultlist) {

                            String val[] = result.split("#");
                            U.log("heading name==" + splitname[0]);
                            U.log("heading name==1" + headingName.toString());
                            ArrayList<String> headingOfDetail = headingName.get(splitname[0]);
//                            U.log("HEADING DEATILS==>"+headingOfDetail.toString());

                            System.out.println("headingOfDetail ---size---> " + headingOfDetail.size());

                            ArrayList<LinkedHashMap<String, String>> arrayOfCardDetail = new ArrayList<LinkedHashMap<String, String>>();
                            U.log("Headingdeatil===" + headingOfDetail.toString());
                            U.log("length of value===" + val.length + "===" + Arrays.asList(result.split("#")));
                            for (int j = 0; j < val.length; j++) {
                                if (headingOfDetail.get(j) != null && !headingOfDetail.get(j).equals("NOT DEFINED")) {
                                    LinkedHashMap<String, String> demo = new LinkedHashMap<String, String>();

                                    demo.put("heading", headingOfDetail.get(j) != null ? headingOfDetail.get(j) : "heading" + j);
                                    demo.put("value", val[j]);
                                    if (headingOfDetail.get(j).equals("") || headingOfDetail.get(j) == null) {
                                    } else {
                                        arrayOfCardDetail.add(demo);
                                    }
                                }
                            }
                            detailHeadingValArray.add(arrayOfCardDetail);
                        }
                    }
                    detail.setHeading(splitname[0]);
                    detail.setSeqId(splitname[2]);
                    detail.setValues(detailHeadingValArray);
                    arr.add(detail);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                    con.close();
                    con = null;
                } catch (SQLException e) {
                }
            }
        }
        DetailsOfApprovalsList listobj = new DetailsOfApprovalsList();
        listobj.setApprovalDetails(arr);
        return listobj;
    }

    public DetailsOfApprovalsList gettDetailsOfApprovals(String entityCode, String tnature, String tcode, String vrno) {

        String query = " select * from LHSSYS_ALERT_DIRECT_EMAIL E where E.batch_file='" + tnature + "' and E.seq_id like '%.%' and E.FLAG = 'T' ORDER BY SEQ_ID";

        String detailsQuery = "";
        String breakAmountQuery = "";
        String termsConditionsQuery = "";
        String finalExecutQuery = "";

        HashMap<String, String> descName = new HashMap<String, String>();

        HashMap<String, ArrayList<String>> headingName = new HashMap<String, ArrayList<String>>();

        ArrayList<LinkedHashMap<String, String>> detailHeadingValArray = new ArrayList<LinkedHashMap<String, String>>();
        ArrayList<LinkedHashMap<String, String>> breakAmountValArray = new ArrayList<LinkedHashMap<String, String>>();
        ArrayList<LinkedHashMap<String, String>> termsConditionsArray = new ArrayList<LinkedHashMap<String, String>>();

        ArrayList<ArrayList<LinkedHashMap<String, String>>> commonArray = new ArrayList<ArrayList<LinkedHashMap<String, String>>>();

        PreparedStatement ps = null;
        U.log("query alert::" + query);
        int count = 0;
        try {
            ps = con.prepareStatement(query);

            ResultSet rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                do {
                    ArrayList<String> headingList = new ArrayList<String>();
                    headingList.add(rs.getString("heading1"));
                    headingList.add(rs.getString("heading2"));
                    headingList.add(rs.getString("heading3"));
                    headingList.add(rs.getString("heading4"));
                    headingList.add(rs.getString("heading5"));
                    headingList.add(rs.getString("heading6"));
                    headingList.add(rs.getString("heading7"));
                    headingList.add(rs.getString("heading8"));
                    headingList.add(rs.getString("heading9"));
                    headingList.add(rs.getString("heading10"));
                    headingList.add(rs.getString("heading11"));
                    headingList.add(rs.getString("heading12"));
                    headingList.add(rs.getString("heading13"));
                    headingList.add(rs.getString("heading14"));
                    headingList.add(rs.getString("heading15"));
                    headingList.add(rs.getString("heading16"));
                    headingList.add(rs.getString("heading17"));
                    headingList.add(rs.getString("heading18"));
                    headingList.add(rs.getString("heading19"));
                    headingList.add(rs.getString("heading20"));
                    headingList.add(rs.getString("heading21"));
                    headingList.add(rs.getString("heading22"));
                    headingList.add(rs.getString("heading23"));
                    headingList.add(rs.getString("heading24"));
                    headingList.add(rs.getString("heading25"));

                    if (count == 0) {
                        detailsQuery = rs.getString("sql_text");
//                        U.log("detailsQuery : " + detailsQuery);
                        headingName.put("details", headingList);
                        descName.put("details", rs.getString("alert_desc"));
                    }
                    if (count == 1) {
                        breakAmountQuery = rs.getString("sql_text");
//                        U.log("breakAmountQuery : " + breakAmountQuery);
                        headingName.put("breakAmount", headingList);
                        descName.put("breakAmount", rs.getString("alert_desc"));
                    }
                    if (count == 2) {
                        termsConditionsQuery = rs.getString("sql_text");
//                        U.log("termsConditionsQuery : " + termsConditionsQuery);
                        headingName.put("termsConditions", headingList);
                        descName.put("termsConditions", rs.getString("alert_desc"));
                    }

                    count++;
                } while (rs.next());
            }
            if (detailsQuery != null) {
                U.log("GET DETAILS OF APPROVAL SQL UNREPLACED : " + detailsQuery);
                detailsQuery = detailsQuery.replaceAll("'TCODE'", "'" + tcode + "'").replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
                        .replace(";", "").replaceAll("'VRNO'", "'" + vrno + "'");
                U.log("GET DETAILS OF APPROVAL SQL : " + detailsQuery);
//                ps = con.prepareStatement(detailsQuery);
//                rs = ps.executeQuery();
//                if (rs != null && rs.next()) {
//                    do {
//                        finalExecutQuery = rs.getString(1);
//                    } while (rs.next());
//                }
                if (detailsQuery != null) {
                    String result = "";
                    ps = con.prepareStatement(detailsQuery);
                    rs = ps.executeQuery();
                    if (rs != null && rs.next()) {
                        do {
                            result = rs.getString(1);
                        } while (rs.next());
                    }
                    String val[] = result.split("#");
                    ArrayList<String> headingOfDetail = headingName.get("details");
                    for (int i = 0; i < val.length; i++) {
                        LinkedHashMap<String, String> demo = new LinkedHashMap<String, String>();

//                        if (i == 0) {
//                            demo.put("heading", "DescHeading");
//                            demo.put("value", descName.get("details"));
//                            detailHeadingValArray.add(demo);
//                            demo = new LinkedHashMap<String, String>();
//                        }
                        demo.put("heading", headingOfDetail.get(i) != null ? headingOfDetail.get(i) : "heading" + i);
                        demo.put("value", val[i]);
                        detailHeadingValArray.add(demo);
                    }
                }
            }

            if (breakAmountQuery != null) {
                breakAmountQuery = breakAmountQuery.replaceAll("'TCODE'", "'" + tcode + "'").replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
                        .replace(";", "").replaceAll("'VRNO'", "'" + vrno + "'");
                U.log("GET DETAILS OF breakAmountQuery SQL : " + breakAmountQuery);
//                ps = con.prepareStatement(breakAmountQuery);
//                rs = ps.executeQuery();
//                if (rs != null && rs.next()) {
//                    do {
//                        finalExecutQuery = rs.getString(1);
//                    } while (rs.next());
//                }
                if (breakAmountQuery != null) {
                    String result = "";
                    ps = con.prepareStatement(breakAmountQuery);
                    rs = ps.executeQuery();
                    ResultSetMetaData rsm = rs.getMetaData();
                    ArrayList<String> val = new ArrayList<String>();
                    if (rs != null && rs.next()) {
                        do {
                            for (int i = 2; i <= rsm.getColumnCount(); i = i + 2) {
                                val.add(rs.getString(i));
                            }
                        } while (rs.next());
                    }

                    ArrayList<String> headingOfDetail = headingName.get("breakAmount");
                    for (int i = 0; i < val.size(); i++) {
                        LinkedHashMap<String, String> demo = new LinkedHashMap<String, String>();

//                        if (i == 0) {
//                            demo.put("heading", "DescHeading");
//                            demo.put("value", descName.get("breakAmount"));
//                            breakAmountValArray.add(demo);
//                            demo = new LinkedHashMap<String, String>();
//                        }
                        demo.put("heading", headingOfDetail.get(i) != null ? headingOfDetail.get(i) : "heading" + i);
                        demo.put("value", val.get(i));
                        breakAmountValArray.add(demo);
                    }
                }
            }

            if (termsConditionsQuery != null) {
                termsConditionsQuery = termsConditionsQuery.replaceAll("'TCODE'", "'" + tcode + "'").replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
                        .replace(";", "").replaceAll("'VRNO'", "'" + vrno + "'");
                U.log("GET DETAILS OF termsConditionsQuery SQL : " + termsConditionsQuery);
//                ps = con.prepareStatement(termsConditionsQuery);
//                rs = ps.executeQuery();
//                if (rs != null && rs.next()) {
//                    do {
//                        finalExecutQuery = rs.getString(1);
//                    } while (rs.next());
//                }
                if (termsConditionsQuery != null) {
                    ps = con.prepareStatement(termsConditionsQuery);
                    rs = ps.executeQuery();
                    ResultSetMetaData rsm = rs.getMetaData();
                    ArrayList<String> val = new ArrayList<String>();
                    if (rs != null && rs.next()) {
                        do {
                            for (int i = 1; i <= rsm.getColumnCount(); i++) {
                                if (rs.getString(i) != null) {
                                    val.add(rs.getString(i));
                                }
                            }
                        } while (rs.next());
                    }

                    ArrayList<String> headingOfDetail = headingName.get("termsConditions");
                    for (int i = 0; i < val.size(); i++) {
                        LinkedHashMap<String, String> demo = new LinkedHashMap<String, String>();

//                        if (i == 0) {
//                            demo.put("heading", "DescHeading");
//                            demo.put("value", descName.get("termsConditions"));
//                            termsConditionsArray.add(demo);
//                            demo = new LinkedHashMap<String, String>();
//                        }
                        demo.put("heading", headingOfDetail.get(i) != null ? headingOfDetail.get(i) : "heading" + i);
                        demo.put("value", val.get(i));
                        termsConditionsArray.add(demo);
                    }
                }
            }
        } catch (Exception e) {
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                    con.close();
                    con = null;
                } catch (SQLException e) {
                }
            }
        }
//        commonArray.add(detailHeadingValArray);
//        commonArray.add(breakAmountValArray);
//        commonArray.add(termsConditionsArray);
        DetailsOfApprovalsList listobj = new DetailsOfApprovalsList();
//        listobj.setDetailsOfApprovals(commonArray);

        ArrayList<DetailsOfApprovals> arr = new ArrayList<DetailsOfApprovals>();

        DetailsOfApprovals detail = new DetailsOfApprovals();

//        detail.setHeading("Details");
//        detail.setDetails(detailHeadingValArray);
//        arr.add(detail);
//        detail = new DetailsOfApprovals();
//        detail.setHeading("Break Amount");
//        detail.setDetails(breakAmountValArray);
//        arr.add(detail);
//        detail = new DetailsOfApprovals();
//        detail.setHeading("Terms Conditions");
//        detail.setDetails(termsConditionsArray);
//        arr.add(detail);
//        detail = new DetailsOfApprovals();
//        detail.setHeading("Item Details");
//        detail.setDetails(termsConditionsArray);
//        arr.add(detail);
//        listobj.setApprovalDetails(arr);
        return listobj;
    }

    public String execute_procedure(final String entityCode, final String tCode, final String vrno, final String tnature, final String sessionId) throws SQLException {
        String proc_out_parameter = "";
        try {
            CallableStatement clst;
//                        String executeProc = "{call lhs_tds_imp_corr.proc_tds_corr_insert(?,?,?,?,?,?,?,?,?,?,?,?,?)}";
            U.log("call lhs_utility.push_alert_message('" + entityCode + "','" + tCode + "','" + vrno + "','" + tnature + "',null,null,null,null,'','EMAIL','I',null,'" + sessionId + "')");
            clst = con.prepareCall("{ ? = call lhs_utility.push_alert_message(?,?,?,?,null,null,null,null,?,'EMAIL','I',null,?) }");
//                        clst = cnctn.prepareCall("{ ? = call lhs_utility.push_alert_message(?,?,?,?,null,null,null,null,?,'EMAIL','A',null,?) }");
//                        clst = cnctn.prepareCall("{ ? = call lhs_utility.push_alert_message(?,?,?,?,null,null,null,null,?,'EMAIL','A',null) }");
            clst.registerOutParameter(1, Types.LONGVARCHAR);
            clst.setString(2, entityCode);
            clst.setString(3, tCode);
            clst.setString(4, vrno);
            clst.setString(5, tnature);
            clst.setString(6, "");
            clst.setString(7, sessionId);
            clst.executeUpdate();
            proc_out_parameter = clst.getString(1);
            U.log("proc_out_parameter-----" + proc_out_parameter);
            try {
                clst.close();
            } catch (SQLException e) {
                proc_out_parameter = "-1";
            }
        } catch (SQLException ex) {//Handle Exception According to DB
            proc_out_parameter = "-1";
        } finally {
            con.close();
            con = null;
        }
        return proc_out_parameter;
    }

    public DetailsOfApprovalsList getDetailsOfParty(String seqNo, String accCode, String entityCode, String empCode, String usercode) {

        String query = " select * from LHSSYS_ALERT_DIRECT_EMAIL E where E.seq_id like '"
                + seqNo + ".%' and E.FLAG = 'T' ORDER BY SEQ_ID";
        String detailsQuery = "";
        HashMap<Integer, String> descName = new HashMap<Integer, String>();
        HashMap<Integer, String> firstScreenArr = new HashMap<Integer, String>();
        HashMap<String, ArrayList<String>> headingName = new HashMap<String, ArrayList<String>>();
        ArrayList<DetailsOfApprovals> arr = new ArrayList<DetailsOfApprovals>();
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
        int count = 1;
        try {
            U.log("GET DETAILS OF SQL : " + query);
            ps = con.prepareStatement(query);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                do {
                    String headingFlag = rs.getString("Filter_Flag");
                    String headingQuery = rs.getString("EMAIL_SQL_TEXT");
                    ArrayList<String> headingList = new ArrayList<String>();
//                    if (headingFlag.equals("Q")) {
//                        headingQuery = headingQuery.replaceAll("'TCODE'", "'" + tcode + "'")
//                                .replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
//                                .replaceAll("'ACCYEAR'", "'" + accYear + "'")
//                                .replace(";", "").replaceAll("'VRNO'", "'" + vrno + "'");
//                        U.log("headingQuery : " + headingQuery);
//                        PreparedStatement ps1 = con.prepareStatement(headingQuery);
//                        ResultSet rs1 = ps1.executeQuery();
//                        if (rs1 != null && rs1.next()) {
//                            String headingString = rs1.getString(1);
//                            if (headingString != null || !"".equals(headingString)) {
//                                headingList.addAll(Arrays.asList(headingString.split("#")));
//                            }
////                            U.log("headingString---------> \n" + headingString);
//                        }
//                    } else {
                    headingList.add(rs.getString("heading1"));
                    headingList.add(rs.getString("heading2"));
                    headingList.add(rs.getString("heading3"));
                    headingList.add(rs.getString("heading4"));
                    headingList.add(rs.getString("heading5"));
                    headingList.add(rs.getString("heading6"));
                    headingList.add(rs.getString("heading7"));
                    headingList.add(rs.getString("heading8"));
                    headingList.add(rs.getString("heading9"));
                    headingList.add(rs.getString("heading10"));
                    headingList.add(rs.getString("heading11"));
                    headingList.add(rs.getString("heading12"));
                    headingList.add(rs.getString("heading13"));
                    headingList.add(rs.getString("heading14"));
                    headingList.add(rs.getString("heading15"));
                    headingList.add(rs.getString("heading16"));
                    headingList.add(rs.getString("heading17"));
                    headingList.add(rs.getString("heading18"));
                    headingList.add(rs.getString("heading19"));
                    headingList.add(rs.getString("heading20"));
                    headingList.add(rs.getString("heading21"));
                    headingList.add(rs.getString("heading22"));
                    headingList.add(rs.getString("heading23"));
                    headingList.add(rs.getString("heading24"));
                    headingList.add(rs.getString("heading25"));
//                    }

                    detailsQuery = rs.getString("sql_text");
//                        U.log("detailsQuery : " + detailsQuery);
                    headingName.put(rs.getString("alert_desc"), headingList);
                    descName.put(count - 1, rs.getString("alert_desc") + ":~:" + detailsQuery + ":~:" + rs.getString("seq_id"));
                    firstScreenArr.put(count - 1, rs.getString("first_screen"));
                    count++;
                } while (rs.next());
            }
            if (descName.size() > 0) {
                for (int i = 0; i < descName.size(); i++) {
                    ArrayList<ArrayList<LinkedHashMap<String, String>>> detailHeadingValArray = new ArrayList<ArrayList<LinkedHashMap<String, String>>>();
                    DetailsOfApprovals detail = new DetailsOfApprovals();
                    String cardName = descName.get(i);
                    String splitname[] = cardName.split(":~:");
                    String queryString = splitname[1];

//                    U.log("GET DETAILS OF APPROVAL SQL UNREPLACED : " + splitname[1]);
                    queryString = queryString/*.replaceAll("'TCODE'", "'" + tcode + "'")*/
                            .replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
                            .replace(";", "")
                            .replaceAll("'ACCYEAR'", "'" + accYear + "'")
                            //                            .replaceAll("'VRDATE'", "'" + vrDate + "'")
                            .replaceAll("'ACCCODE'", "'" + accCode + "'")
                            .replaceAll("'ACCYEARBEGDATE'", "'" + accYearBegDate + "'")
                            .replaceAll("'EMPCODE'", "'" + empCode + "'")
                            .replaceAll("'USERCODE'", "'" + usercode + "'")
                            .replaceAll("'ACCYEARENDDATE'", "'" + accYearEndDate + "'");

                    /*.replaceAll("'VRNO'", "'" + vrno + "'");*/
                    U.log("GET DETAILS OF APPROVAL SQL :--> " + queryString);

                    if (queryString != null) {
                        ArrayList<String> resultlist = new ArrayList<String>();
                        ps = con.prepareStatement(queryString);
                        rs = ps.executeQuery();
                        if (rs != null && rs.next()) {
                            do {
                                resultlist.add(rs.getString(1));
                            } while (rs.next());
                        }
                        for (String result : resultlist) {

                            String val[] = result.split("#");
                            ArrayList<String> headingOfDetail = headingName.get(splitname[0]);
                            ArrayList<LinkedHashMap<String, String>> arrayOfCardDetail = new ArrayList<LinkedHashMap<String, String>>();

                            for (int j = 0; j < val.length; j++) {
                                LinkedHashMap<String, String> demo = new LinkedHashMap<String, String>();

                                demo.put("heading", headingOfDetail.get(j) != null ? headingOfDetail.get(j) : "heading" + j);
                                demo.put("value", val[j]);
                                if (headingOfDetail.get(j) == null || headingOfDetail.get(j).equals("")) {
                                } else {
                                    arrayOfCardDetail.add(demo);
                                }
                            }
                            detailHeadingValArray.add(arrayOfCardDetail);
                        }
                    }
                    detail.setFirstScreen(firstScreenArr.get(i));
                    detail.setHeading(splitname[0]);
                    detail.setSeqId(splitname[2]);
                    detail.setValues(detailHeadingValArray);
                    arr.add(detail);
                }
            }
        } catch (Exception e) {
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                    con.close();
                    con = null;
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        DetailsOfApprovalsList listobj = new DetailsOfApprovalsList();
        listobj.setApprovalDetails(arr);
        return listobj;
    }

    public DetailsOfApprovalsList getPartyFilters(String seqNo) {

        String query = "SELECT U.SLNO, U.PARA_DESC FROM LHSSYS_ALERT_DIRECT_EMAIL_PARA U WHERE U.SEQ_ID = '" + seqNo + "' ORDER BY U.SLNO";
        ArrayList<DetailsOfApprovals> arr = new ArrayList<DetailsOfApprovals>();
        DetailsOfApprovalsList listobj = new DetailsOfApprovalsList();
        DetailsOfApprovals obj = new DetailsOfApprovals();

        PreparedStatement ps = null;
        ResultSet rs = null;

        int count = 1;
        try {
            U.log("GET DETAILS OF SQL : " + query);
            ps = con.prepareStatement(query);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                do {
                    DetailsOfApprovals detail = new DetailsOfApprovals();
                    detail.setSeqId(rs.getString("SLNO"));
                    detail.setHeading(rs.getString("PARA_DESC"));
                    arr.add(detail);
                    count++;
                } while (rs.next());
            }
        } catch (Exception e) {
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                    con.close();
                    con = null;
                } catch (SQLException e) {
                }
            }
        }

        listobj.setApprovalDetails(arr);
        return listobj;
    }

    public void setWhereClauseString(String jsonString, ResultSet rs) throws ParseException {

        JSONParser json_parser = new JSONParser();
        JSONObject json = (JSONObject) json_parser.parse(jsonString);
        int jsonArrLength = json.size();
        String saveProcessFlag = "";
        U.log("====>" + json.get("client_Code") + "");

        try {
            //find whereclause string
            for (int i = 1; i <= 4; i++) {
                String columnName = "sub_where_clause_replace_val" + i;

                String val = rs.getString(columnName);

                if (val != null) {
                    U.log("val==>" + val);
                    String replaceTo = json.get(val).toString();
                    whereClauseValueMap.put(val, replaceTo);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public ArrayList<ApprovalStatus> getApprovalStatus(String entityCode, String userCode, String tCode, String vrno) {

        String query = "select T.APPROVEDBY,\n"
                + "       LHS_UTILITY.get_name('USER_CODE', T.APPROVEDBY) APPROVEDBY_USER,\n"
                + "       TO_CHAR(T.APPROVEDDATE,'DD-MM-YYYY HH:MM:SS AM') APPROVEDDATE,\n"
                + "       T.REMARK,\n"
                + "       T.USER_LEVEL,\n"
                + "       T.AMENDNO\n"
                + "  from lhssys_appr_tran t\n"
                + " where t.vrno = '" + vrno + "'\n"
                + "   and tcode = '" + tCode + "'\n"
                + "   and t.entity_code = '" + entityCode + "'\n"
                + "   and t.user_level>0 \n"
                + "   AND (T.AMENDNO = (SELECT MAX(AMENDNO)\n"
                + "                      FROM lhssys_appr_tran L\n"
                + "                     WHERE L.ENTITY_CODE = T.ENTITY_CODE\n"
                + "                       AND T.VRNO = L.VRNO\n"
                + "                       AND T.TCODE = L.TCODE )or AMENDNO is null)\n"
                + " ORDER BY T.USER_LEVEL DESC";

        ArrayList<ApprovalStatus> statusList = new ArrayList<ApprovalStatus>();

        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            U.log(" Approval Status query : " + query);
            ps = con.prepareStatement(query);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                do {
                    ApprovalStatus status = new ApprovalStatus();
                    status.setApproved_by(rs.getString("APPROVEDBY"));
                    status.setAmedno(rs.getString("AMENDNO"));
                    status.setApproved_by_user(rs.getString("APPROVEDBY_USER"));
                    status.setRemark(rs.getString("REMARK"));
                    status.setApproved_date(rs.getString("APPROVEDDATE"));
                    status.setUser_level(rs.getString("USER_LEVEL"));
                    statusList.add(status);
                } while (rs.next());
            }
        } catch (Exception e) {
            U.errorLog(e);
        }

        return statusList;

    }

    public ArrayList<ImageDetailsModel> getImageDetails(String imgQuery) {
        ArrayList<ImageDetailsModel> al = new ArrayList<ImageDetailsModel>();
        try {
            PreparedStatement ps = null;
            ResultSet rs = null;
            ImageDetailsModel model = new ImageDetailsModel();

//            String query = "SELECT store_file from crm_client_tran_attachment where seq_no='"+ seq_no +"'";
            System.out.println(" Image details query : " + imgQuery);
            ps = con.prepareStatement(imgQuery);
            rs = ps.executeQuery();
            ResultSetMetaData metaData = rs.getMetaData();
            InputStream ins;
            if (rs != null && rs.next()) {

                if (metaData.getColumnTypeName(1).equalsIgnoreCase("long raw")) {
                    byte[] longx = Util.getImgstreamToBytes(rs.getBinaryStream(1));
                    model.setImage(longx);
                }
                if (metaData.getColumnTypeName(1).equalsIgnoreCase("blob")) {
                    model.setImage(Base64.encode(Util.getImgstreamToBytes(rs.getBlob(1).getBinaryStream())));
                }

            }
            al.add(model);
        } catch (SQLException se) {
            se.printStackTrace();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return al;
    }
    
    
}
