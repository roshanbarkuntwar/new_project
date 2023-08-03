/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.MessageJSON;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Iterator;
import java.util.Set;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 *
 * @author kirti.misal
 */
public class JDBCApproveApprovalsDAO {

    StringBuffer colName = new StringBuffer();
    StringBuffer colValue = new StringBuffer();
    Connection con;
    String indentItemUpdateSQL = "";
    String sysdate = "";

    public JDBCApproveApprovalsDAO(Connection con) {
        this.con = con;
    }

    public MessageJSON approveReject(final String entityCode, final String tCode, final String vrno, final String tnature,
            final String user_code, final String approval_flag, final String remark, String indentItemUpdate, final String slno) {
        String proc_out_parameter = "";
        PreparedStatement ps = null;
        ResultSet rs = null;
        String ValidatedMsg = "";
        MessageJSON json = new MessageJSON();
        System.out.println("Request for Approval vrno--> " + vrno);
        System.out.println("entityCode --> " + entityCode);
        System.out.println("tCode --> " + tCode);
        System.out.println("vrno --> " + vrno);
        System.out.println("tnature --> " + tnature);
        System.out.println("user_code--> " + user_code);
        System.out.println("approval_flag--> " + approval_flag);
        System.out.println("remark--> " + remark);
        System.out.println("slno--> " + slno);
        System.out.println("indentItemUpdate--> " + indentItemUpdate);
        try {
            ps = con.prepareStatement("select TO_CHAR(SYSDATE, 'DD-MM-YYYY  HH24:MI:SS') as systemdate from dual");
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                sysdate = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("exception ---> " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException ex) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException ex) {
                }
            }
        }

        try {
            if (tnature.equals("INDI")) {
                System.out.println(" TNATURE INDENT ");
                JSONParser json_parser = new JSONParser();
                Object obj = json_parser.parse(indentItemUpdate);
                JSONObject json_obj = new JSONObject();
                json_obj = (JSONObject) obj;
                JSONArray listJsonArray = new JSONArray();
                listJsonArray = (JSONArray) json_obj.get("indentItemUpdate");
                JSONArray jsonArray = new JSONArray();
                int listArrLength = listJsonArray.size();
                try {
                    for (int j = 0; j < listArrLength; j++) {
                        JSONObject jsonobj = (JSONObject) json_parser.parse(listJsonArray.get(j).toString());
                        parseJson(jsonobj);
                        indentItemUpdateSQL = indentItemUpdateSQL.replaceAll("'VRNO'", "'" + vrno + "'")
                                .replaceAll("'TCODE'", "'" + tCode + "'")
                                .replaceAll("'ENTITYCODE'", "'" + entityCode + "'")
                                .replaceAll("'USERCODE'", "'" + user_code + "'");
                        System.out.println("indentItemUpdateSQL : " + indentItemUpdateSQL);
                        ps = con.prepareStatement(indentItemUpdateSQL);
                        int i = ps.executeUpdate();
                        System.out.println("rows updated:-" + i);
                    }
                } catch (Exception e) {
                    System.out.println("EXCEPTION");
                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (SQLException e) {
                            System.out.println("exception ---> " + e.getMessage());
                        }
                    }
                }
            } else {
                System.out.println("OTHER TNATURE THEN INDENT");
            }
            CallableStatement clst;
            System.out.println("APPROVE REJECT APPROVAL PROCEDURE  :   lhs_auto_approval.auto_approval_process('" + entityCode + "','" + tCode + "','"
                    + vrno + "','" + tnature + "','" + user_code + "','" + approval_flag + "','" + remark + "'," + Types.VARCHAR + ")");

            clst = con.prepareCall("{ call lhs_auto_approval.auto_approval_process(?,?,?,?,?,?,?,?) }");
            clst.setString(1, entityCode);
            clst.setString(2, tCode);
            clst.setString(3, vrno);
            clst.setString(4, tnature);
            clst.setString(5, user_code);
            clst.setString(6, approval_flag);
            clst.setString(7, remark);
            clst.registerOutParameter(8, Types.VARCHAR);
            try {
                clst.executeUpdate();
                proc_out_parameter = clst.getString(8);
            } catch (Exception e) {
                System.out.println("Exception in auto_approval_process Procedure : " + e.getMessage());
            }
            System.out.println("APPROVE REJECT APPROVAL PROCEDURE RESULT : " + proc_out_parameter);
            if (proc_out_parameter == null || proc_out_parameter == "null" || proc_out_parameter.isEmpty()) {
                json.setResult(proc_out_parameter);
                json.setStatus("error");
            } else if (proc_out_parameter.contains("Error")) {
                String ValidatedMsgArr[] = proc_out_parameter.split("ORA-20343:");
                proc_out_parameter = ValidatedMsgArr[1];
                json.setResult(proc_out_parameter);
                json.setStatus("error");
            } else if (proc_out_parameter.toUpperCase().contains("SUCCESS")) {
                json.setResult(proc_out_parameter);
                json.setStatus("success");
                /*
                String updateStatusSQL = "UPDATE LHSSYS_PORTAL_APPR_STATUS H SET H.STATUS = '" + approval_flag + "' WHERE "
                        + "H.VRNO = '" + vrno + "' AND H.TCODE = '" + tCode + "' AND H.TNATURE = '" + tnature + "' AND H.ENTITY_CODE = '" + entityCode + "'"
                        + " AND H.APPROVAL_TYPE = 'U'";
                System.out.println("updateApprovalStatusSQL : " + updateStatusSQL);
                ps = con.prepareStatement(updateStatusSQL);
                int n = ps.executeUpdate();
                if (n > 0) {
                    System.out.println("updateStatusSQL APPROVAL_TYPE = 'U' UPDATED");
                } else {
                    System.out.println("updateStatusSQL APPROVAL_TYPE = 'U' NOTUPDATED");
                }
                 */
            } else {
                json.setResult(proc_out_parameter);
                json.setStatus("error");
            }
            try {
                clst.close();
            } catch (SQLException e) {
                System.out.println("Exception in auto_approval_process Procedure CallableStatement close : " + e.getMessage());
                proc_out_parameter = "-1";
            }

        } catch (Exception e) {//Handle Exception According to DB
            ValidatedMsg = e.getMessage();
            String ValidatedMsgArr[] = ValidatedMsg.split(":");
            ValidatedMsg = ValidatedMsgArr[1].trim();
            String ValidatedMsgArr1[] = ValidatedMsg.split("~");
            ValidatedMsg = ValidatedMsgArr1[0];
            proc_out_parameter = ValidatedMsg;
            json.setResult(proc_out_parameter);
            json.setStatus("success");
            System.out.println("ValidatedMsg : " + ValidatedMsg);
        } finally {
            if (con != null) {
                try {
                    con.close();
                    con = null;
                } catch (SQLException e) {
                }
            }
        }

        return json;//return 1 then no error 
    }//end method

    public void parseJson(JSONObject jsonObject) throws ParseException {
        System.out.println("INDENT ITEM JSON : " + jsonObject.toString());
        String status = jsonObject.get("rejectConfirmation") + "";
        if (status.equalsIgnoreCase("true")) {
            indentItemUpdateSQL = "update indent_body\n"
                    + "   set QTYCANCELLED     = indentQty,\n"
                    + "       cancelledBy      = 'USERCODE',\n"
                    + "       cancelledDate    = to_date(sysdate,'dd-MM-yyyy HH24:MI:SS'),\n"
                    + "       cancelled_remark = 'cancelledRemark'\n"
                    + " where vrno = 'VRNO'\n"
                    + "   and tcode = 'TCODE'\n"
                    + "   and entity_code = 'ENTITYCODE'\n"
                    + "   and slno = itemSlno";
        } else {
            indentItemUpdateSQL = "update indent_body\n"
                    + "   set qtyindent     = indentQty,\n"
                    + "       QTYCANCELLED      = NVL(QTYCANCELLED,0) + (indentQty - updatedQty),\n"
                    + "       approvedby      = 'USERCODE',\n"
                    + "       approveddate    = to_date(sysdate,'dd-MM-yyyy HH24:MI:SS')\n"
                    + " where vrno = 'VRNO'\n"
                    + "   and tcode = 'TCODE'\n"
                    + "   and entity_code = 'ENTITYCODE'\n"
                    + "   and slno = itemSlno";
        }
        Set<Object> set = jsonObject.keySet();
        Iterator<Object> iterator = set.iterator();
        while (iterator.hasNext()) {
            Object obj = iterator.next();
            if (jsonObject.get(obj) instanceof JSONArray) {
                getArray(jsonObject.get(obj));
            } else if (jsonObject.get(obj) instanceof JSONObject) {
                parseJson((JSONObject) jsonObject.get(obj));
            } else {
                try {
                    indentItemUpdateSQL = indentItemUpdateSQL.replaceAll(obj.toString().trim(), jsonObject.get(obj).toString());
                } catch (Exception e) {
                }
            }
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
}
