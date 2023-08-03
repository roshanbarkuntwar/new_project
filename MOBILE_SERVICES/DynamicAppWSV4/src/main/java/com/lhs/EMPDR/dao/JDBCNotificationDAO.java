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
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCNotificationDAO {

    Connection c;

    public JDBCNotificationDAO(Connection c) {
        this.c = c;
        U u = new U(this.c);
    }

    public ArrayList<HashMap<String, String>> getCrmNotification(String userCode, String seqNo, String login_user_flag, String acc_code, String geoOrgCode) {

//        String sql = "SELECT N.NEWS,"
//                + "               to_char(N.TO_DATE) TO_DATE,"
//                + "               to_char(N.FROM_DATE) FROM_DATE,"
//                + "               N.CREATEDBY, "
//                + "               n.topic, "
//                + "               N.NEWS_ID,N.category, "
//                + "               n.from_date, "
//                + "               n.to_date, "
//                + "               N.LASTUPDATE, "
//                + "               N.USER_CODE, "
//                + "               N.FLAG,N.scorll_flag, "
//                + "               N.ACTION_TYPE, "
//                + "               N.ACTION_PARAM, "
//                + "               N.VRNO, "
//                + "               N.TCODE, "
//                + "               N.TNATURE, "
//                + "               N.Emp_Code_Str, "
//                + "               N.APPR_TYPE, "
//                + "               N.TNATURE_NAME, "
//                + "               N.STATUS "
//                + "          FROM LHSSYS_PORTAL_NEWS N  "
//                + " WHERE (instr(nvl(emp_code_STR,(select emp_code from user_mast where user_code = '" + userCode + "')),"
//                + " (select emp_code from user_mast where user_code = '" + userCode + "')) <> 0  or "
//                + " instr(nvl(ACC_code_STR, "
//                + "                (select ACC_CODE from ACC_MAST where ACC_code = '" + userCode + "')), "
//                + "            '" + userCode + "') <> 0)"
//                + "   AND sysdate between from_date and nvl(to_date, sysdate) "
//                + "   AND STATUS = 'A' "
//                + " ORDER BY LASTUPDATE DESC";
        String sql = null;
        String sql_text = null;
        String pl_sql_text = null;
        String body_text = null;
        String email_sql_text = null;
        ResultSet rset = null;
        PreparedStatement pstm = null;
        String query = "select * from lhssys_alert_direct_email e where e.seq_id=900";
        try {
            pstm = c.prepareStatement(query);
            rset = pstm.executeQuery();
            if (rset != null && rset.next()) {
                sql_text = rset.getString("sql_text") != null ? rset.getString("sql_text") : "";
                pl_sql_text = rset.getString("pl_sql_text") != null ? rset.getString("pl_sql_text") : "";
                email_sql_text = rset.getString("email_sql_text") != null ? rset.getString("email_sql_text") : "";
                body_text = rset.getString("body_text") != null ? rset.getString("body_text") : "";
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }

//        if (login_user_flag != null && !login_user_flag.isEmpty()) {
            if (login_user_flag.equalsIgnoreCase("P") || login_user_flag.equalsIgnoreCase("B")) {
//                sql = "SELECT N.NEWS,"
//                        + "               to_char(N.TO_DATE) TO_DATE, to_char(N.FROM_DATE) FROM_DATE,"
//                        + "               N.CREATEDBY,    n.topic,   N.NEWS_ID,N.category, "
//                        + "               n.from_date,     n.to_date,   N.LASTUPDATE, "
//                        + "               N.USER_CODE,     N.FLAG,N.scorll_flag,  N.ACTION_TYPE,  N.ACTION_PARAM, "
//                        + "               N.VRNO,     N.TCODE,   N.TNATURE,  N.Emp_Code_Str,  N.APPR_TYPE,  N.TNATURE_NAME, N.STATUS "
//                        + "          FROM LHSSYS_PORTAL_NEWS N  "
//                        + " WHERE  instr(nvl(ACC_code_STR, "
//                        + "                (select ACC_CODE from ACC_MAST where ACC_code = '" + acc_code + "')), "
//                        + "            '" + acc_code + "') <> 0"
//                        + "   AND sysdate between from_date and nvl(to_date, sysdate) "
//                        + "   AND STATUS = 'A' "
//                        + "   AND Flag='P'"
//                        + " ORDER BY LASTUPDATE DESC";

                // commented : 20/02/2020
//                sql = "SELECT N.NEWS,  "
//                        + "       to_char(N.TO_DATE) TO_DATE,   to_char(N.FROM_DATE) FROM_DATE,     N.CREATEDBY,      n.topic,      N.NEWS_ID,    LHS_UTILITY.get_name('news_category',N.category) category,  "
//                        + "       n.from_date,     n.to_date,  N.LASTUPDATE,  "
//                        + "       N.USER_CODE,     N.FLAG,   N.scorll_flag,  "
//                        + "       N.ACTION_TYPE,   N.ACTION_PARAM,  "
//                        + "       N.VRNO,   N.TCODE,      N.TNATURE,   N.Emp_Code_Str,  N.APPR_TYPE,     N.TNATURE_NAME,  "
//                        + "       N.STATUS  "
//                        + "  FROM LHSSYS_PORTAL_NEWS N  "
//                        + " WHERE ((instr(n.Acc_Code_Str, '" + acc_code + "') <> 0 or instr(n.geo_org_str, '" + geoOrgCode + "') <> 0) OR (n.Acc_Code_Str IS NULL AND n.geo_org_str IS NULL))  "
//                        + "   AND sysdate between from_date and nvl(to_date, sysdate)  "
//                        + "   AND STATUS = 'A'  "
//                        + "   AND (Flag = 'P' or Flag = 'B' or Flag = 'R')  "
//                        //  + "   and n.canceldate is null  "
//                        + " ORDER BY LASTUPDATE DESC  ";
                sql = pl_sql_text;

            } else if (login_user_flag.equalsIgnoreCase("R")) {
//                sql = "SELECT N.NEWS,"
//                        + "               to_char(N.TO_DATE) TO_DATE,"
//                        + "               to_char(N.FROM_DATE) FROM_DATE,"
//                        + "               N.CREATEDBY, "
//                        + "               n.topic, N.NEWS_ID,N.category, "
//                        + "               n.from_date,   n.to_date,  N.LASTUPDATE, "
//                        + "               N.USER_CODE,  N.FLAG,N.scorll_flag, "
//                        + "               N.ACTION_TYPE, N.ACTION_PARAM, "
//                        + "               N.VRNO,N.TCODE, N.TNATURE, N.Emp_Code_Str,  N.APPR_TYPE,  N.TNATURE_NAME,    N.STATUS "
//                        + "          FROM LHSSYS_PORTAL_NEWS N  "
//                        + " WHERE instr(nvl(emp_code_STR,(select emp_code from user_mast where user_code = '" + userCode + "')),"
//                        + " (select emp_code from user_mast where user_code = '" + userCode + "')) <> 0 "
//                        + "   AND sysdate between from_date and nvl(to_date, sysdate) "
//                        + "   AND STATUS = 'A' "
//                        + "   AND Flag='E'"
//                        + " ORDER BY LASTUPDATE DESC";

                // commented : 20/02/2020
//                sql = "SELECT N.NEWS, "
//                        + "       to_char(N.TO_DATE) TO_DATE,to_char(N.FROM_DATE) FROM_DATE, "
//                        + "       N.CREATEDBY, n.topic,  N.NEWS_ID, LHS_UTILITY.get_name('news_category',N.category) category, "
//                        + "       n.from_date,  n.to_date,   N.LASTUPDATE, "
//                        + "       N.USER_CODE,  N.FLAG,    N.scorll_flag,   N.ACTION_TYPE,  N.ACTION_PARAM, "
//                        + "       N.VRNO, N.TCODE,N.TNATURE,N.Emp_Code_Str, "
//                        + "       N.APPR_TYPE,  N.TNATURE_NAME,  N.STATUS "
//                        + "  FROM LHSSYS_PORTAL_NEWS N "
//                        + " WHERE ((instr(n.user_code_str, '" + userCode + "') <> 0 or instr(n.geo_org_str, '" + geoOrgCode + "') <> 0) OR (n.user_code_str IS NULL AND n.geo_org_str IS NULL)) "
//                        + "   AND sysdate between from_date and nvl(to_date, sysdate) "
//                        + "   AND STATUS = 'A' "
//                        + "   AND Flag = 'E' "
//                        // + "   and n.canceldate is null "
//                        + " ORDER BY LASTUPDATE DESC ";
                sql = email_sql_text;
            } else if(login_user_flag.equalsIgnoreCase("E")) {
                sql = sql_text;
            }else{
                sql = body_text;
            }
//        }
        if(sql!=null && sql!=""){
            sql = sql.replaceAll("'USERCODE'", "'"+ userCode +"'").replaceAll("'ACCCODE'", "'"+ acc_code +"'").replaceAll("'GEOORGCODE'", "'"+ geoOrgCode +"'");
        }
        ArrayList<HashMap<String, String>> modelList = new ArrayList<HashMap<String, String>>();
        PreparedStatement ps = null;
        U.log("GET NOTIFICATION SQL :  " + sql);
        try {

            ps = c.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            if (rs != null & rs.next()) {
                do {
                    HashMap<String, String> model = new HashMap<String, String>();
                    try{
                    model.put("news_id", rs.getString("news_id"));
                    }catch(Exception e){}
                    try{
                    model.put("topic", rs.getString("topic"));
                    }catch(Exception e){}
                    try{
                    model.put("category", rs.getString("category"));
                    }catch(Exception e){}
                    try{
                    model.put("news", rs.getString("news"));
                    }catch(Exception e){}
                    try{
                    model.put("scorll_flag", rs.getString("scorll_flag"));
                    }catch(Exception e){}
                    try{
                    model.put("flag", rs.getString("flag"));
                    }catch(Exception e){}
                    try{
                    model.put("user_code", rs.getString("user_code"));
                    }catch(Exception e){}
                    try{
                    model.put("fromDate", rs.getString("from_date"));
                    }catch(Exception e){}
                    try{
                    model.put("toDate", rs.getString("to_date"));
                    }catch(Exception e){}
                   
//                     try{
//                    model.put("fromDate", rs.getString("from_date"));
//                    }catch(Exception e){}
//                    try{
//                    model.put("toDate", rs.getString("to_date"));
//                    }catch(Exception e){}

                    modelList.add(model);
                } while (rs.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return modelList;
    }

    public List<NotificationModel> getNotifications(String userCode, String seqNo) {
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
                + "       VRNO	, "
                + "       TCODE	, "
                + "       TNATURE	, "
                + "       EMP_CODE	, "
                + "       APPR_TYPE	, "
                + "       TNATURE_NAME,	 "
                + "       STATUS  	 "
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
                + "               ' ' VRNO, "
                + "               ' ' TCODE, "
                + "               ' ' TNATURE, "
                + "               ' ' EMP_CODE, "
                + "               ' ' APPR_TYPE, "
                + "               ' ' TNATURE_NAME,"
                + "               ' ' STATUS  "
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
                + "               N.VRNO, "
                + "               N.TCODE, "
                + "               N.TNATURE, "
                + "               N.EMP_CODE, "
                + "               N.APPR_TYPE, "
                + "               N.TNATURE_NAME,"
                + "               N.STATUS "
                + "          FROM LHSSYS_PORTAL_NEWS N) "
                + " WHERE DYNAMIC_TABLE_SEQ_ID = " + seqNo
                + "   AND USER_CODE ='" + userCode + "'"
                //                + "   AND LASTUPDATE LIKE to_char(to_date(sysdate, 'dd-mm-yyyy HH24:MI:SS')) "
                + "   AND STATUS='A'  "
                //                + "   AND COL60 is null "
                + " ORDER BY LASTUPDATE DESC";

        List<NotificationModel> modelList = new ArrayList<NotificationModel>();

        ArrayList<String> seq_id = new ArrayList<String>();
        PreparedStatement ps = null;
        U.log("GET NOTIFICATION SQL :  " + sql);
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

                U.log("updateSql==" + updateSql);

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
                U.log("updateSql==" + updateSql);
                ps = c.prepareStatement(updateSql.toString());
                updateResult = ps.executeUpdate();
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
                //                + "   AND LASTUPDATE LIKE to_char(to_date(sysdate, 'dd-mm-yyyy HH24:MI:SS')) "
                //                + "   AND COL60 is null "
                + " ORDER BY LASTUPDATE DESC";

        List<NotificationModel> modelList = new ArrayList<NotificationModel>();

        ArrayList<String> seq_id = new ArrayList<String>();
        PreparedStatement ps = null;
//        U.log("GET NOTIFICATION SQL :  " + sql);
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
