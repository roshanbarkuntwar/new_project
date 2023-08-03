/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.PartyListJSON;
import com.lhs.EMPDR.JSONResult.TypeOfApprovalsJSON;
import com.lhs.EMPDR.Model.PartyListModel;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import com.lhs.EMPDR.utility.U;
import java.util.ArrayList;
import com.lhs.EMPDR.Model.TypesOfApprovalsModel;
import com.lhs.EMPDR.utility.Util;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.Blob;
import java.util.List;

/**
 *
 * @author kirti.misal
 */
public class JDBCfindTypesOfApprovals {

    Connection con;

    public JDBCfindTypesOfApprovals(Connection c) {
        this.con = c;
    }

    public TypeOfApprovalsJSON findTypesOfApprovals(int seqNo, String userCode, String entityCode) {
        TypeOfApprovalsJSON json = new TypeOfApprovalsJSON();
        List<TypesOfApprovalsModel> approvalsList;
        String query = "select sql_text,pl_sql_text from LHSSYS_PORTAL_TABLE_DSC_UPDATE where seq_no=" + seqNo;
        String approvalCountSQL = "select NVL(SUM(COUNT(*) ), 0)rec_count from lhssys_portal_appr_status T where entity_code "
                + "= nvl('RP', entity_code) AND (INSTR('CO  DG  PP  RM  RS  SC  SI  SM', DIV_CODE) <> 0 OR DIV_CODE IS NULL) "
                + "and INSTR('#' || T.USER_STR || ',', 'USERCODE' || ',') <> 0 AND T.STATUS = 'A' GROUP BY TNATURE";
        String unapprovedApprovalCountSQL = "select NVL(SUM(COUNT(*) ), 0)rec_count from lhssys_portal_appr_status T where entity_code "
                + "= nvl('RP', entity_code) AND (INSTR('CO  DG  PP  RM  RS  SC  SI  SM', DIV_CODE) <> 0 OR DIV_CODE IS NULL) "
                + "and INSTR('#' || T.USER_STR || ',', 'USERCODE' || ',') <> 0 AND T.STATUS = 'P' GROUP BY TNATURE";
        String unapprovedApprovalCount, approvalCount;
        String typeofApprovalQuery = "";
        String typesOfPreviousAppQuery = "";
        PreparedStatement ps = null;
        U.log(query);
        int count = 0;
        try {
            ps = con.prepareStatement(query);
            ResultSet rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                typeofApprovalQuery = rs.getString(1);
                typesOfPreviousAppQuery = rs.getString(2);
            }
            if (typeofApprovalQuery != null) {
                approvalsList = new ArrayList<TypesOfApprovalsModel>();
                typeofApprovalQuery = typeofApprovalQuery.replaceAll("USERCODE", userCode.toUpperCase());
                typeofApprovalQuery = typeofApprovalQuery.replaceAll("ENTITYCODE", entityCode);
                System.out.println("typeofApprovalQuery : " + typeofApprovalQuery);
                ps = con.prepareStatement(typeofApprovalQuery);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        TypesOfApprovalsModel model = new TypesOfApprovalsModel();
                        model.setTnatrure_Name(rs.getString("Tnatrure_Name"));
                        model.setTnature_code(rs.getString("Tnature_code"));
                        model.setRec_count(rs.getString("Rec_count"));
                        model.setSeqId(rs.getString("seq_id"));
                        Blob image = rs.getBlob("icon_image");
                        ByteArrayOutputStream baos = new ByteArrayOutputStream();
                        byte[] buf = new byte[1024];
                        if (image != null) {
                            InputStream in = image.getBinaryStream();
                            model.setImage(Util.getImgstreamToBytes(in));
                        }
                        approvalsList.add(model);
                        json.setTypeOfApprovalsList(approvalsList);
                    } while (rs.next());
                }
            }
            approvalsList = new ArrayList<TypesOfApprovalsModel>();
            if (typesOfPreviousAppQuery != null) {
                typesOfPreviousAppQuery = typesOfPreviousAppQuery.replaceAll("USERCODE", userCode.toUpperCase());
                typesOfPreviousAppQuery = typesOfPreviousAppQuery.replaceAll("ENTITYCODE", entityCode);
                System.out.println("typesOfPreviousAppQuery : " + typesOfPreviousAppQuery);
                ps = con.prepareStatement(typesOfPreviousAppQuery);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        TypesOfApprovalsModel model = new TypesOfApprovalsModel();
                        model.setTnatrure_Name(rs.getString("Tnatrure_Name"));
                        model.setTnature_code(rs.getString("Tnature_code"));
                        model.setRec_count(rs.getString("Rec_count"));
                        model.setSeqId(rs.getString("seq_id"));
                        Blob image = rs.getBlob("icon_image");
                        ByteArrayOutputStream baos = new ByteArrayOutputStream();
                        byte[] buf = new byte[1024];
                        if (image != null) {
                            InputStream in = image.getBinaryStream();
                            model.setImage(Util.getImgstreamToBytes(in));
                        }
                        approvalsList.add(model);
                    } while (rs.next());
                }
            }
            json.setTypeOfPervApprovalsList(approvalsList);

            unapprovedApprovalCountSQL = unapprovedApprovalCountSQL.replaceAll("USERCODE", userCode.toUpperCase());
            approvalCountSQL = approvalCountSQL.replaceAll("USERCODE", userCode.toUpperCase());
            ps = con.prepareStatement(unapprovedApprovalCountSQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                unapprovedApprovalCount = rs.getString(1);
                json.setUnapprovedApprovalCount(unapprovedApprovalCount);
            }

            ps = con.prepareStatement(approvalCountSQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                approvalCount = rs.getString(1);
                json.setApprovedApprovalCount(approvalCount);
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

}
