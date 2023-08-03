/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.ListOfApprovalsJSON;
import com.lhs.EMPDR.Model.ListOfApprovalsModel;
import com.lhs.EMPDR.Model.TypesOfApprovalsModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.regex.Pattern;
import javax.mail.internet.MailDateFormat;

/**
 *
 * @author kirti.misal
 */
public class JDBCListOfApprovalsDAO {

    Connection con;
    String cardButtonName = "";
    String statusFlag = "";
    String statusColorBand = "";

    public JDBCListOfApprovalsDAO(Connection c) {
        this.con = c;
        U u = new U(this.con);
    }

    public ListOfApprovalsJSON findListOfApprovals(String entityCode, String tnature,
            String userCode, String type, String isOrderBookingList, String seqId, String acccode,
            String pageNo, String searchText, String empCode, String selectMonth, String geoOrgCode, String loginUserFlag,String defaultSearchtext) {    
        U.log("select mon :" + selectMonth);
        U.log("geo org :" + geoOrgCode);
        
        U.log("defaultSearchtext :" + defaultSearchtext);
//        if(searchText == null || searchText.equals("null")){
//         searchText = null;
//         }
         if(defaultSearchtext!=null && defaultSearchtext!="" && !defaultSearchtext.equals("null")){
             
            searchText = defaultSearchtext != null ? defaultSearchtext : null;
        }
         U.log("searchtext :" + searchText);
         
        int recordPerPage = 10;
        ListOfApprovalsJSON json = new ListOfApprovalsJSON();
        List<ListOfApprovalsModel> approvalsList = new ArrayList<ListOfApprovalsModel>();
        StringBuffer buildedSearchText = new StringBuffer();
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

        String query = "select e.sql_text,e.pl_sql_text, e.report_delivery_type, e.to_email_sub_clause,e.TOTAL_COLUMN from LHSSYS_ALERT_DIRECT_EMAIL e"
                + " where  e.seq_id = '" + seqId + "'";

//                " select sql_text,pl_sql_text from LHSSYS_ALERT_DIRECT_EMAIL where batch_file='" + tnature + "' and seq_id ='" + seqId + "'";//seq_id not like '%.%'
        U.log("is booking==" + isOrderBookingList + "::==" + seqId);
        if (isOrderBookingList.equalsIgnoreCase("true")) {
            U.log("inside of orderbookinglist");
//            query = " select sql_text,pl_sql_text from LHSSYS_ALERT_DIRECT_EMAIL where batch_file='" + tnature + "' and seq_id = '" + seqId + "'";
            query = "select e.sql_text,e.pl_sql_text,t.replicate_fields cardbuttonname,email_sql_text, e.report_delivery_type, e.to_email_sub_clause,e.TOTAL_COLUMN from LHSSYS_ALERT_DIRECT_EMAIL e,"
                    + "lhssys_portal_table_dsc_update t where e.seq_id = '" + seqId + "' and t.seq_no='" + seqId + "'";

        }
        if (searchText != null) {

            U.log("searchtext==" + searchText);
//            query = "select e.body_text, e.pl_sql_text,t.replicate_fields cardbuttonname from LHSSYS_ALERT_DIRECT_EMAIL e,"
//                    + "lhssys_portal_table_dsc_update t where e.batch_file='" + tnature + "' and e.seq_id = '" + seqId + "' and t.seq_no='" + seqId + "'";
             query = "select e.body_text, e.pl_sql_text,t.replicate_fields cardbuttonname,email_sql_text, e.report_delivery_type, e.to_email_sub_clause,e.TOTAL_COLUMN from LHSSYS_ALERT_DIRECT_EMAIL e,"
                    + "lhssys_portal_table_dsc_update t where  e.seq_id = '" + seqId + "' and t.seq_no='" + seqId + "'";

            if (searchText != "") {
                if (searchText.contains("#")) {
                    String splitedSearchText[] = searchText.split("#");
                    int splitedSearchTextCount = splitedSearchText.length;
                    for (int i = 0; i < splitedSearchTextCount; i++) {
                        if (i == splitedSearchTextCount - 1) {
                            buildedSearchText.append(splitedSearchText[i]);
                            U.log("inside  searchtext if" + buildedSearchText);
                        } else {
                            U.log("inside  searchtext else");
                            //buildedSearchText.append(" to_date(SUBSTR(vrdate, 8, 12), 'DD-MM-YYYY') between ");
                            buildedSearchText.append(splitedSearchText[i] + " AND ");
                        }
                    }
                }
            } else {
                buildedSearchText.append("1=1");
            }

        }
        String listOfApprovalsQuery = "";
        int fromRowNum = 1;
        int toRowNum = 10;
        PreparedStatement ps = null;
//        if(query.contains("SEARCHTEXT")){
//            query = query.replace("SEARCHTEXT", defaultSearchtext);
//        }
        U.log(query);
        int count = 0;
        try {
            ps = con.prepareStatement(query);
            System.out.println("Query---- >" +query);
            ResultSet rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                try {
                    U.log("cardButtonName====" + rs.getString("cardbuttonname"));
                    cardButtonName = rs.getString("cardbuttonname");
                } catch (Exception e) {
                    e.getMessage();
                }

                try {
                    statusFlag = rs.getString("report_delivery_type");
                } catch (Exception e) {
                    e.getMessage();
                }
                try {
                    statusColorBand = rs.getString("to_email_sub_clause");
                } catch (Exception e) {
                    e.getMessage();
                }
                            
                

               
                
                try {
                    System.out.println("TOTAL_COLUMN--> " + rs.getString("TOTAL_COLUMN"));
                    if (rs.getString("TOTAL_COLUMN") != null && !rs.getString("TOTAL_COLUMN").isEmpty()) {
                        recordPerPage = Integer.parseInt(rs.getString("TOTAL_COLUMN"));
                    }
                } catch (Exception e) {
//                    e.getMessage();
                }
                U.log("type==" + type);
                if (type != null) {
                    if (type.equalsIgnoreCase("pending") || searchText != null || searchText != "") {
                        listOfApprovalsQuery = rs.getString(1);
                    } else {
                        listOfApprovalsQuery = rs.getString(2);
                    }
                } else {
                    listOfApprovalsQuery = rs.getString(1);
                }
            }


            U.log("loginuserflag==>" + loginUserFlag);
            if (loginUserFlag != null && (loginUserFlag.contains("B") || loginUserFlag.contains("P"))) {
                if (searchText != null && !searchText.isEmpty()) {
                    listOfApprovalsQuery = rs.getString("email_sql_text");
                } else {
                    listOfApprovalsQuery = rs.getString("pl_sql_text");
                }
            }

            U.log("loginuserflag==>" + loginUserFlag);
            U.log("listOfApprovalsQuery==>" + listOfApprovalsQuery);
            if (loginUserFlag != null && (loginUserFlag.contains("B") || loginUserFlag.contains("P"))) {
                if (searchText != null && !searchText.isEmpty()) {
                    U.log("email_sql_text");
                    listOfApprovalsQuery = rs.getString("email_sql_text");
                } else {
                    U.log("pl_sql_text");
                    listOfApprovalsQuery = rs.getString("pl_sql_text");
                }
            }

            System.out.println("recordPerPage--> " + recordPerPage);
            if (pageNo != null && !pageNo.isEmpty()) {
                fromRowNum = (Integer.parseInt(pageNo) * recordPerPage) + 1;
                toRowNum = (Integer.parseInt(pageNo) + 1) * recordPerPage;
            }
            if (entityCode == null || entityCode.trim().contains("null")) {
                entityCode = "";
            }
            if (listOfApprovalsQuery != null) {

                String acc = "";
                if (userCode != null) {
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("'USERCODE'", "'" + userCode.toUpperCase() + "'");
                }

                try {
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("ROWFROM", Integer.toString(fromRowNum));
                } catch (Exception e) {

                }
                try {
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("ROWTO", Integer.toString(toRowNum));
                } catch (Exception e) {

                }
                try {
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("SEARCHTEXT", buildedSearchText.toString());
                } catch (Exception e) {

                }
//                System.out.println("ACCcode--==>>"+acccode);
//                if(acccode==null||acccode==""){
//                 listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("'ACCCODE'", "'" + userCode.toUpperCase() + "'");
//                }
                System.out.println("ACCcode--==>>" + acccode);
                if (acccode.equalsIgnoreCase("null")) {
//                    U.log("NOT NULL");
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("'TNATURE'", "'" + tnature + "'")
                            .replaceAll("'ENTITYCODE'", "'" + entityCode + "'").replaceAll("'ACCCODE'", "'" + acc + "'").replace(";", "");
                } else {
                    U.log("NULL");
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("'TNATURE'", "'" + tnature + "'")
                            .replaceAll("'ENTITYCODE'", "'" + entityCode + "'").replaceAll("'ACCCODE'", "'" + acccode + "'").replace(";", "");
                }

                try {
                    if (empCode == null) {
                        empCode = "";
                    }
                    if (empCode.equalsIgnoreCase("null")) {
                        empCode = "";
                    }
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("EMPCODE", empCode);
                } catch (Exception e) {

                }
                try {
//                    U.log("geoOrgCode====>>" + geoOrgCode);
                    if (geoOrgCode == null || geoOrgCode.contains("null")) {
                        U.log("geoOrgCode123====>>" + geoOrgCode);
                        geoOrgCode = "";
                    }
                    U.log("geoOrgCode====>>" + geoOrgCode);
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("GEOORGCODE", geoOrgCode);
                } catch (Exception e) {

                }

                if (selectMonth != null) {
                    U.log("selectMonth :" + selectMonth);
//                    U.log("listOfApprovalsQuery1 :"+listOfApprovalsQuery);
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("MONTH", selectMonth);
                } else {
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("MONTH", "to_char(sysdate,'mm')");
                }

                SimpleDateFormat formatter = new SimpleDateFormat("MM-dd-yyyy");
                U.log("listOfApprovalsQuery : " + listOfApprovalsQuery);

                ps = con.prepareStatement(listOfApprovalsQuery);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        ListOfApprovalsModel model = new ListOfApprovalsModel();
                        try {
                            model.setCompetitor_code(rs.getString("COMPETITOR_CODE"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setFromDate(rs.getString("from_date"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setApproval_status_flag(rs.getString("Approval_status_flag"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setToDate(rs.getString("to_date"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setFlag(rs.getString("flag"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setTotalqty(rs.getString("totalqty"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setExecutedqty(rs.getString("Executedqty"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setBalancedqty(rs.getString("Balancedqty"));
                        } catch (Exception e) {

                        }

                        try {
                            model.setDueDate(rs.getString("validupto_date"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setQty(rs.getString("AqtyORDER"));
                        } catch (Exception e) {

                        }
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
                            model.setTnature(rs.getString("tnature"));
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
                            model.setVRNO(rs.getString("vrno"));
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
                            model.setTruckNo(rs.getString("truckno"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setDriverName(rs.getString("driverName"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setMobNo(rs.getString("mobileNo"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setQtyIssued(rs.getString("qtyissued"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setListFor(rs.getString("listfor"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setAddress(rs.getString("address"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setPartyType(rs.getString("party_type"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setCity(rs.getString("city"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setAction(rs.getString("action"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setRemark(rs.getString("remark"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setStatus(rs.getString("status"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setActionDate(rs.getString("actionDate"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setActionBy(rs.getString("actionBy"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setActionRemark(rs.getString("actionRemark"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setCategory(rs.getString("category"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setContact_person(rs.getString("contact_person"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setRowid_seq(rs.getString("rowid_seq"));
                        } catch (Exception e) {

                        }

                        try {

                            model.setClient_Code(rs.getString("client_code"));

                        } catch (Exception e) {

                        }
                        try {

                            model.setRetailer_code(rs.getString("retailer_code"));

                        } catch (Exception e) {

                        }
                        try {

                            model.setClient_name(rs.getString("client_name"));

                        } catch (Exception e) {

                        }

                        try {

                            model.setGeolocation(rs.getString("geo_location"));

                        } catch (Exception e) {

                        }
                        try {

                            model.setGeo_org_location(rs.getString("geo_org_location"));

                        } catch (Exception e) {

                        }

                        try {

                            model.setCreatedby(rs.getString("createdby"));
                        } catch (Exception e) {

                        }

                        try {

                            model.setLeadSource(rs.getString("lead_source"));
                        } catch (Exception e) {

                        }

                        try {

                            model.setWinPossibility(rs.getString("win_possibility"));
                        } catch (Exception e) {

                        }

                        try {

                            model.setPriority(rs.getString("priority"));
                        } catch (Exception e) {

                        }
                        try {

                            model.setAccName(rs.getString("party"));
                        } catch (Exception e) {

                        }
                        try {

                            model.setMobNo(rs.getString("mobile"));
                        } catch (Exception e) {

                        }
                        try {

                            model.setEmail(rs.getString("email"));
                        } catch (Exception e) {

                        }
                        try {

                            model.setGstInNo(rs.getString("gstinno"));
                        } catch (Exception e) {

                        }
                        try {

                            model.setLocation(rs.getString("location"));
                        } catch (Exception e) {

                        }
                        try {
                            model.setApproval_status_class(rs.getString("status_class"));
                        } catch (Exception e) {
                            e.getMessage();
                        }
                        try {
                            model.setItemList(rs.getString("item_details"));
                        } catch (Exception e) {
                            e.getMessage();
                        }
                        try {
                            model.setConsigneeCode(rs.getString("consignee_code"));
                        } catch (Exception e) {
                            e.getMessage();
                        }
                        try {
                            model.setSeq_no(rs.getString("seq_no"));
                        } catch (Exception e) {
                            e.getMessage();
                        }
                        try{
                            model.setImg(Util.getImgstreamToBytes(rs.getBlob("image").getBinaryStream()));
                        }catch(Exception e){
                            e.getMessage();
                        }
                        approvalsList.add(model);
                    } while (rs.next());
                } else {
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
                    U.errorLog(e);
                }
            }
        }
        json.setListOfApprovals(approvalsList);
        json.setCardButtonName(cardButtonName);
        json.setStatusFlag(statusFlag);
        json.setStatusColorBand(statusColorBand);
        return json;
    }

    public ArrayList<ArrayList> paraDetailsOfApproval(String entityCode, String tnature, String userCode,
            String tCode, String vrno, String value, String seqId, String slno, String vrDate) {
//        List<ListOfApprovalsModel> approvalsList = new ArrayList<ListOfApprovalsModel>();
        if (vrDate != null && vrDate.contains(":")) {
            vrDate = vrDate.split(":")[1];
        }
        String query = " select SQL_TEXT, COLUMN_VALUE from LHSSYS_ALERT_DIRECT_EMAIL_PARA where seq_id = '" + seqId + "' AND SLNO ='" + slno + "'";
        U.log("Obtain paraDetailsOfApprovalSQL : " + query);
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
        ArrayList<ArrayList> cardDetailList = new ArrayList<ArrayList>();
        ArrayList<LinkedHashMap<String, String>> arrayOfCardDetail;

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
                    if (entityCode == null || entityCode.trim().contains("null")) {
                        entityCode = "";
                    }
                    U.log("ENTITYCODE===>>>" + entityCode);
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("'USERCODE'", "'" + userCode.toUpperCase() + "'")
                            .replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
                            .replaceAll("'VALUE'", "'" + rpclValue.trim() + "'")
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
                            .replaceAll("'VALUE'", "'" + value.trim() + "'")
                            .replaceAll("'TNATURE'", "'" + tnature.toUpperCase() + "'")
                            .replaceAll("'VRNO'", "'" + vrno + "'")
                            .replaceAll("'TCODE'", "'" + tCode + "'")
                            .replaceAll("'VRDATE'", "'" + vrDate + "'")
                            .replaceAll("'ACCYEAR'", "'" + accYear + "'")
                            .replaceAll("'ACCYEARBEGDATE'", "'" + accYearBegDate + "'")
                            .replaceAll("'ACCYEARENDDATE'", "'" + accYearEndDate + "'")
                            .replace(";", "");
                }

                U.log("paraDetailsOfApprovalSQL : " + listOfApprovalsQuery);
                ps = con.prepareStatement(listOfApprovalsQuery);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        arrayOfCardDetail = new ArrayList<LinkedHashMap<String, String>>();
                        String paraValue = rs.getString(1);
                        String[] headingArray = columnValue.split("#");
                        String[] valueArray = paraValue.split("#");

                        for (int i = 0; i < headingArray.length; i++) {
                            LinkedHashMap<String, String> jsonOutput = new LinkedHashMap<String, String>();
                            jsonOutput.put("heading", headingArray[i]);
                            jsonOutput.put("value", valueArray[i]);
                            arrayOfCardDetail.add(jsonOutput);
                        }
                        cardDetailList.add(arrayOfCardDetail);
//                        approvalsList.add(arrayOfCardDetail);
                    } while (rs.next());
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
                    U.errorLog(e);
                }
            }
        }
        return cardDetailList;
    }

//    public static void main(String[] args) {
//        String s = "SELECT A.ACC_YEAR, TO_CHAR(A.YRBEGDATE), TO_CHAR(A.YRENDDATE) FROM ACC_YEAR_MAST A WHERE to_char(to_date(SUBSTR(sysdate, 1, 10),"
//                + " 'dd-mm-yyyy')) between A.YRBEGDATE AND A.YRENDDATE AND ROWNUM =1 ORDER BY ACC_YEAR DESC";
//        char[] c = s.toCharArray();
//        for (int i = 0; i < c.length; i++) {
//            System.out.println("c--" + c[i]);
//        }
//    }

}
