/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.PartyListJSON;
import com.lhs.EMPDR.Model.DetailsOfApprovals;
import com.lhs.EMPDR.Model.DetailsOfApprovalsList;
import com.lhs.EMPDR.Model.GenericCodeNameModel;
import com.lhs.EMPDR.Model.PartyListFilterModel;
import com.lhs.EMPDR.Model.PartyListModel;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

/**
 *
 * @author anjali.bhendarkar
 */
public class JDBCParyListDAO {

    Connection con;

    public JDBCParyListDAO(Connection con) {
        this.con = con;
    }

    public PartyListJSON partyList(int seqNo, String userCode, int pageNo, String slno, String searchText) {
        PartyListJSON json = new PartyListJSON();
        List<PartyListModel> approvalsList = new ArrayList<PartyListModel>();
        String query = "";
        System.out.println("slno : " + slno);
        if (slno.isEmpty()) {
            query = "select sql_text from LHSSYS_PORTAL_TABLE_DSC_UPDATE where seq_no=" + seqNo;
        } else {
            query = "SELECT U.SQL_TEXT FROM LHSSYS_ALERT_DIRECT_EMAIL_PARA U WHERE U.SEQ_ID = '" + seqNo + "' AND U.SLNO = " + slno;
        }
        String typeofApprovalQuery = "";
        int fromRowNum = (pageNo * 30) + 1;
        int toRowNum = (pageNo + 1) * 30;

        PreparedStatement ps = null;
        U.log("partyListSQL : " + query);
        try {
            ps = con.prepareStatement(query);
            ResultSet rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                typeofApprovalQuery = rs.getString(1);
            }
            if (typeofApprovalQuery != null) {
                typeofApprovalQuery = typeofApprovalQuery.replaceAll("USERCODE", userCode.toUpperCase());
                typeofApprovalQuery = typeofApprovalQuery.replaceAll("ROWFROM", Integer.toString(fromRowNum));
                typeofApprovalQuery = typeofApprovalQuery.replaceAll("ROWTO", Integer.toString(toRowNum));
                typeofApprovalQuery = typeofApprovalQuery.replaceAll("SEARCHTEXT", searchText);
                System.out.println("typeofApprovalQuery : " + typeofApprovalQuery);
                ps = con.prepareStatement(typeofApprovalQuery);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        PartyListModel model = new PartyListModel();
                        model.setPartyCode(rs.getString("ACC_CODE"));
                        model.setPartyName(rs.getString("ACC_NAME"));
                        model.setCity(rs.getString("City"));
                        approvalsList.add(model);
                        json.setPartyList(approvalsList);
                    } while (rs.next());
                }
            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                    con.close();
                    con = null;
                } catch (SQLException e) {
                    U.log(e);
                }
            }
        }
        return json;
    }

    public DetailsOfApprovalsList getDetailsOfParty(String seqNo, String accCode, String entityCode) {

        String query = " select * from LHSSYS_ALERT_DIRECT_EMAIL E where E.seq_id like '"
                + seqNo + ".%' and E.FLAG = 'T' ORDER BY SEQ_ID";
        String detailsQuery = "";
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
            System.out.println("GET DETAILS OF SQL : " + query);
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
//                        System.out.println("headingQuery : " + headingQuery);
//                        PreparedStatement ps1 = con.prepareStatement(headingQuery);
//                        ResultSet rs1 = ps1.executeQuery();
//                        if (rs1 != null && rs1.next()) {
//                            String headingString = rs1.getString(1);
//                            if (headingString != null || !"".equals(headingString)) {
//                                headingList.addAll(Arrays.asList(headingString.split("#")));
//                            }
////                            System.out.println("headingString---------> \n" + headingString);
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
//                        System.out.println("detailsQuery : " + detailsQuery);
                    headingName.put(rs.getString("alert_desc"), headingList);
                    descName.put(count - 1, rs.getString("alert_desc") + ":~:" + detailsQuery + ":~:" + rs.getString("seq_id"));

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

//                    System.out.println("GET DETAILS OF APPROVAL SQL UNREPLACED : " + splitname[1]);
                    queryString = queryString/*.replaceAll("'TCODE'", "'" + tcode + "'")*/
                            .replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
                            .replace(";", "")
                            .replaceAll("'ACCYEAR'", "'" + accYear + "'")
                            //                            .replaceAll("'VRDATE'", "'" + vrDate + "'")
                            .replaceAll("'ACCCODE'", "'" + accCode + "'")
                            .replaceAll("'ACCYEARBEGDATE'", "'" + accYearBegDate + "'")
                            .replaceAll("'ACCYEARENDDATE'", "'" + accYearEndDate + "'");
                    /*.replaceAll("'VRNO'", "'" + vrno + "'");*/
                    System.out.println("GET DETAILS OF APPROVAL SQL : " + queryString);

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
                                if (headingOfDetail.get(j).equals("") || headingOfDetail.get(j) == null) {
                                } else {
                                    arrayOfCardDetail.add(demo);
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
            U.log(e);
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

    public DetailsOfApprovalsList getPartyFilters11(String seqNo) {

        String query = "SELECT U.SLNO, U.PARA_DESC, FROM LHSSYS_ALERT_DIRECT_EMAIL_PARA U WHERE U.SEQ_ID = '" + seqNo + "' ORDER BY U.SLNO";
        ArrayList<DetailsOfApprovals> arr = new ArrayList<DetailsOfApprovals>();
        DetailsOfApprovalsList listobj = new DetailsOfApprovalsList();
        DetailsOfApprovals obj = new DetailsOfApprovals();

        PreparedStatement ps = null;
        ResultSet rs = null;

        int count = 1;
        try {
            System.out.println("GET DETAILS OF SQL : " + query);
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
            U.log(e);
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

    public ArrayList<PartyListFilterModel> getPartyFilters(String seqNo) {

        String query = "SELECT * FROM LHSSYS_ALERT_DIRECT_EMAIL_PARA U WHERE U.SEQ_ID = '" + seqNo + "' ORDER BY U.SLNO";
       
        ArrayList<PartyListFilterModel> filterArray = new ArrayList<PartyListFilterModel>();
       
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            System.out.println("GET DETAILS OF SQL : " + query);
            ps = con.prepareStatement(query);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                do {
                    PartyListFilterModel detail = new PartyListFilterModel();
                    detail.setSlno(rs.getString("SLNO"));
                    detail.setPara_desc(rs.getString("PARA_DESC"));
                    detail.setPara_column(rs.getString("Para_column"));
                    detail.setItem_help_property(rs.getString("Item_help_property"));
                    filterArray.add(detail);

                } while (rs.next());
            }
        } catch (Exception e) {
            U.log(e);
        }

       
        return filterArray;
    }

    public ArrayList<GenericCodeNameModel> getPartyFiltersLOV(String userCode, String seqNo, String slno) {

        String query = "SELECT U.COLUMN_VALUE FROM LHSSYS_ALERT_DIRECT_EMAIL_PARA U WHERE U.SLNO= '" + slno + "' AND U.SEQ_ID = '" + seqNo + "'";
        ArrayList<GenericCodeNameModel> list = new ArrayList<GenericCodeNameModel>();

        String lovSql = null;
        ResultSet rs = null;
        PreparedStatement ps = null;
        
        try {
            ps = con.prepareStatement(query);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                lovSql = rs.getString("COLUMN_VALUE");
            }
            
             } catch (Exception e) {
            U.log(e);
        } finally {

        }

            try {
            System.out.println("lovSql--> " + lovSql);
            if (lovSql != null && !lovSql.isEmpty()) {
                lovSql = lovSql.replaceAll("USERCODE", userCode);
                ps = con.prepareStatement(lovSql);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {

                        GenericCodeNameModel model = new GenericCodeNameModel();
                        model.setCode(rs.getString(1));
                        model.setName(rs.getString(2));
                        list.add(model);
                    } while (rs.next());
                }

            }
        } catch (Exception e) {
            U.log(e);
        } finally {

        }

        return list;
    }

}
