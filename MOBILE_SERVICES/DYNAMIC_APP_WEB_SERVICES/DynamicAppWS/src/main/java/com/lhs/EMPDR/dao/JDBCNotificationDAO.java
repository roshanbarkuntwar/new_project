/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.NotificationModel;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCNotificationDAO {

    Connection c;

    public JDBCNotificationDAO(Connection c) {
        this.c = c;
    }

    public List<NotificationModel> getNotifications(String userCode, String seqNo) {
        String sql = "SELECT N.NEWS,to_char(N.TO_DATE) TO_DATE,to_char(N.FROM_DATE) FROM_DATE,N.CREATEDBY, n.topic, N.NEWS_ID, n.from_date, n.to_date, "
                + " N.LASTUPDATE, N.USER_CODE, N.FLAG,N.scorll_flag, N.ACTION_TYPE, N.ACTION_PARAM, N.VRNO, N.TCODE, N.TNATURE, N.Emp_Code_Str, "
                + "N.APPR_TYPE, N.TNATURE_NAME, N.STATUS FROM LHSSYS_PORTAL_NEWS N WHERE instr(nvl(emp_code_STR, '" + userCode + "'), '" + userCode + "') <> 0 "
                + "   AND sysdate between from_date and nvl(to_date, sysdate) AND STATUS = 'A' ORDER BY LASTUPDATE DESC";

        List<NotificationModel> modelList = new ArrayList<NotificationModel>();

        ArrayList<String> seq_id = new ArrayList<String>();
        PreparedStatement ps = null;
        System.out.println("GET NOTIFICATION SQL :  " + sql);
        try {
            try {
                ps = c.prepareStatement(sql, ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
                ResultSet rs = ps.executeQuery();
                if (rs != null & rs.next()) {
                    do {
                        NotificationModel model = new NotificationModel();
                        model.setCol5(rs.getString("NEWS"));
                        model.setCol6(rs.getString("topic"));
                        model.setCol9(rs.getString("CREATEDBY"));
                        model.setFromDate(rs.getString("FROM_DATE"));
                        model.setToDate(rs.getString("TO_DATE"));
                        model.setScrollFalg(rs.getString("scorll_flag"));
//                    model.setDyanamic_table_seq_id(rs.getString("Dynamic_table_seq_id"));
                        model.setLastupdate(rs.getString("Lastupdate"));
                        model.setUser_code(rs.getString("User_code"));
                        model.setSeq_id(rs.getString("news_id"));
                        model.setActionType(rs.getString("ACTION_TYPE"));
                        model.setActionParam(rs.getString("ACTION_PARAM"));
                        model.setVRNO(rs.getString("VRNO"));
                        model.setTCODE(rs.getString("TCODE"));
                        model.setTNATURE(rs.getString("TNATURE"));
                        model.setAPPR_TYPE(rs.getString("APPR_TYPE"));
                        model.setTNATURE_NAME(rs.getString("TNATURE_NAME"));
                        modelList.add(model);
                    } while (rs.next());
                }
            } catch (Exception e) {
                System.out.println("Exception in getNotifications of JDBCNotificationDAO: " + e.getMessage());
            }

            if (seq_id.size() >= 1) {
                StringBuffer updateSql = new StringBuffer();
                updateSql.append("update LHSSYS_PORTAL_APP_TRAN set col60='F' where seq_id in(");
                for (int i = 0; i < seq_id.size(); i++) {
                    updateSql.append(seq_id.get(i));
                    if (i != seq_id.size() - 1) {
                        updateSql.append(",");
                    }
                    if (i == seq_id.size() - 1) {
                        updateSql.append(")");
                    }
                }

                ps = c.prepareStatement(updateSql.toString());
                int updateResult = ps.executeUpdate();

                updateSql = new StringBuffer();
                updateSql.append("update LHSSYS_PORTAL_NEWS n set n.status='R' where n.user_code='").append(userCode).append("' and n.news_id in(");
                for (int i = 0; i < seq_id.size(); i++) {
                    updateSql.append(seq_id.get(i));
                    if (i != seq_id.size() - 1) {
                        updateSql.append(",");
                    }
                    if (i == seq_id.size() - 1) {
                        updateSql.append(")");
                    }
                }
                ps = c.prepareStatement(updateSql.toString());
                updateResult = ps.executeUpdate();
            }

        } catch (Exception e) {
            System.out.println("Exception in getNotifications of JDBCNotificationDAO: " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return modelList;
    }

    public List<NotificationModel> getForceNotifications(String userCode, String seqNo) {
        String sql = "SELECT COL5, "
                + "       COL6, "
                + "       COL9, "
                + "       SEQ_ID, "
                + "       DYNAMIC_TABLE_SEQ_ID, "
                + "       LASTUPDATE, "
                + "       USER_CODE, "
                + "       COL60, "
                + "       ACTION_TYPE, "
                + "       ACTION_PARAM, "
                + "       VRNO, "
                + "       TCODE, "
                + "       TNATURE, "
                + "       EMP_CODE, "
                + "       APPR_TYPE, "
                + "       TNATURE_NAME "
                + "  FROM (SELECT L.COL5, "
                + "               L.COL6, "
                + "               L.COl9, "
                + "               L.SEQ_ID, "
                + "               L.DYNAMIC_TABLE_SEQ_ID, "
                + "               L.LASTUPDATE, "
                + "               L.USER_CODE, "
                + "               L.COL60, "
                + "               ' ' ACTION_TYPE, "
                + "               ' ' ACTION_PARAM, "
                + "               ' ' FORCE_FLAG, "
                + "               ' ' VRNO, "
                + "               ' ' TCODE, "
                + "               ' ' TNATURE, "
                + "               ' ' EMP_CODE, "
                + "               ' ' APPR_TYPE, "
                + "               ' ' TNATURE_NAME"
                + "          FROM LHSSYS_PORTAL_APP_TRAN L "
                + "        union "
                + "        SELECT N.NEWS, "
                + "               to_char(N.FROM_DATE), "
                + "               N.CREATEDBY, "
                + "               N.NEWS_ID,                "
                + "               55 DYNAMIC_TABLE_SEQ_ID, "
                + "               N.LASTUPDATE, "
                + "               N.USER_CODE, "
                + "               N.FLAG, "
                + "               N.ACTION_TYPE, "
                + "               N.ACTION_PARAM, "
                + "               N.FORCE_FLAG, "
                + "               N.VRNO, "
                + "               N.TCODE, "
                + "               N.TNATURE, "
                + "               N.EMP_CODE, "
                + "               N.APPR_TYPE, "
                + "               N.TNATURE_NAME"
                + "          FROM LHSSYS_PORTAL_NEWS N WHERE FORCE_FLAG = 'T') "
                + " WHERE  DYNAMIC_TABLE_SEQ_ID = " + seqNo
                + "   AND USER_CODE ='" + userCode + "'"
                + " ORDER BY LASTUPDATE DESC";

        List<NotificationModel> modelList = new ArrayList<NotificationModel>();

        ArrayList<String> seq_id = new ArrayList<String>();
        PreparedStatement ps = null;
        try {
            ps = c.prepareStatement(sql, ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
            ResultSet rs = ps.executeQuery();
            if (rs != null & rs.next()) {
                do {
                    NotificationModel model = new NotificationModel();
                    model.setCol5(rs.getString("col5"));
                    model.setCol6(rs.getString("col6"));
                    model.setCol9(rs.getString("col9"));
                    model.setDyanamic_table_seq_id(rs.getString("Dynamic_table_seq_id"));
                    model.setLastupdate(rs.getString("Lastupdate"));
                    model.setUser_code(rs.getString("User_code"));
                    model.setSeq_id(rs.getString("SEQ_ID"));
                    model.setActionType(rs.getString("ACTION_TYPE"));
                    model.setActionParam(rs.getString("ACTION_PARAM"));
                    model.setVRNO(rs.getString("VRNO"));
                    model.setTCODE(rs.getString("TCODE"));
                    model.setTNATURE(rs.getString("TNATURE"));
                    model.setEMP_CODE(rs.getString("EMP_CODE"));
                    model.setAPPR_TYPE(rs.getString("APPR_TYPE"));
                    model.setTNATURE_NAME(rs.getString("TNATURE_NAME"));
                    seq_id.add(rs.getString("SEQ_ID"));
                    modelList.add(model);
                } while (rs.next());
            }

            if (seq_id.size() > 1) {
                StringBuffer updateSql = new StringBuffer();
                updateSql.append("update LHSSYS_PORTAL_APP_TRAN set col60='F' where seq_id in(");
                for (int i = 0; i < seq_id.size(); i++) {
                    updateSql.append(seq_id.get(i));
                    if (i != seq_id.size() - 1) {
                        updateSql.append(",");
                    }
                    if (i == seq_id.size() - 1) {
                        updateSql.append(")");
                    }
                }
                U.log("updateSql==" + updateSql);
                ps = c.prepareStatement(updateSql.toString());
                int updateResult = ps.executeUpdate();
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
        return modelList;
    }
}
