/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.GraphTabListModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.InputStream;
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
public class JDBCGraphTabDAO {

    Connection c;
    Util utl;

    public JDBCGraphTabDAO(Connection c) {
        this.c = c;
        U u = new U(this.c);
        utl = new Util();
    }

    public List<GraphTabListModel> tableTabList(String portletId, String seqNo, String userCode) {

        String order_clause = "";
        String where_clause = "";
        String order_clause_sql = " select t.order_clause, t.where_clause from lhssys_portal_table_dsc_update t where t.portlet_id='" + portletId + "'";
        try {
            PreparedStatement ps = c.prepareStatement(order_clause_sql);
            ResultSet rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                order_clause = rs.getString(1);
                where_clause = rs.getString(2);
                if (order_clause == null || order_clause.isEmpty()) {
                    order_clause = "";
                }
                if (where_clause == null || where_clause.isEmpty()) {
                    where_clause = "";
                }
            }
        } catch (Exception e) {
        }

        String sql = "";
//        sql = "SELECT alert_desc,"
//                + "       seq_id,"
//                + "       rep_code,"
//                + "       Filter_Flag,Report_Format,"
//                + "       WM_CONCAT(LASTUPDATE) LASTUPDATE,"
//                + "       first_screen,"
//                + "       sql_text FROM (select DISTINCT e.alert_desc,"
//                + "       e.seq_id,"
//                + "       e.rep_code, E.Filter_Flag, E.Report_Format,"
//                + "       (CASE "
//                + "                  WHEN l.Lastupdate is null AND U.USER_CODE = '" + userCode + "'THEN "
//                + "                   'R#'||TO_CHAR(u.lastupdate, 'DD/MM/YYYY HH:MI') "
//                + "                  ELSE "
//                + "                   'G#'||TO_CHAR(l.lastupdate, 'DD/MM/YYYY HH:MI') "
//                + "                END) LASTUPDATE,"
//                //                + "      (select m.first_screen from LHSSYS_PORTAL_TABLE_DSC_UPDATE m where m.seq_no = e.seq_id) first_screen,"
//                + " E.first_screen,"
//                + "       e.sql_text"
//                + "  from LHSSYS_PORTAL_DASHBOARD_DATA   l,"
//                + "       LHSSYS_ALERT_DIRECT_EMAIL      e,"
//                + "       LHSSYS_PORTAL_TABLE_DSC_UPDATE t, LHSSYS_ALERT_DIRECT_EMAIL_USER U"
//                + " where e.seq_id = l.seq_id(+) AND e.seq_id = U.seq_id(+)"
//                + "   AND l.USER_CODE(+) = '" + userCode + "'"
//                + "   and upper(e.portlet_id) = upper('" + portletId + "')"
//                + "   and t.seq_no = " + seqNo
//                + "   and e.report_group = t.table_desc    " + order_clause + " ) A GROUP BY alert_desc,Report_Format, seq_id, rep_code, Filter_Flag, first_screen, sql_text";

        sql = " SELECT alert_desc,seq_id, rep_code, Filter_Flag, Report_Format, LASTUPDATE, first_screen, sql_text"
                + "  FROM (select e.alert_desc,e.seq_id,e.rep_code,E.Filter_Flag,E.Report_Format,(CASE WHEN l.Lastupdate is null AND U.USER_CODE = '" + userCode + "' THEN "
                + " 'R#' || TO_CHAR(u.lastupdate, 'DD/MM/YYYY HH:MI') ELSE 'G#' || TO_CHAR(l.lastupdate, 'DD/MM/YYYY HH:MI') END) LASTUPDATE,"
                + " E.first_screen, e.sql_text"
                + "          from (SELECT DISTINCT USER_CODE, L1.SEQ_ID, L1.LASTUPDATE FROM LHSSYS_PORTAL_DASHBOARD_DATA L1 WHERE l1.USER_CODE = '" + userCode + "' AND "
                + "               L1.LASTUPDATE = (SELECT MAX(L2.LASTUPDATE) FROM LHSSYS_PORTAL_DASHBOARD_DATA L2 WHERE l2.USER_CODE = '" + userCode + "' AND L1.SEQ_ID = L2.SEQ_ID))  l,"
                + " LHSSYS_ALERT_DIRECT_EMAIL      e, LHSSYS_PORTAL_TABLE_DSC_UPDATE t,"
                + "  (SELECT * FROM LHSSYS_ALERT_DIRECT_EMAIL_USER U1 WHERE U1.USER_CODE = '" + userCode + "') U  where e.seq_id = l.seq_id(+)"
                + " AND e.seq_id = U.seq_id(+) and upper(t.table_desc) = upper('MIS Reports') and t.portlet_id = e.portlet_id  SEARCHTEXT and t.seq_no = " + seqNo
                + " " + order_clause + ") A";
        if (where_clause == null) {
            sql.replaceAll("SEARCHTEXT", " AND 1=1 ");
        } else {
            sql = sql.replaceAll("SEARCHTEXT", where_clause);
        }
        sql = sql.replaceAll("'USER_CODE'", "'" + userCode + "'");

        ArrayList<String> alert_descList = new ArrayList<String>();
        U.log("SQL TO FETCH REPORT TABS : " + sql.trim());
        InputStream imgstream = null;
        PreparedStatement ps = null;
        PreparedStatement ps1 = null;
        ResultSet rs1;
        List<GraphTabListModel> list = new ArrayList<GraphTabListModel>();
        ResultSet rs;
        try {
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
//                    U.log("First_screen===" + rs.getString("first_screen"));
                    GraphTabListModel model = new GraphTabListModel();
                    model.setSeq_no(rs.getString("seq_id"));
                    model.setTab(rs.getString("alert_desc"));
                    model.setFilter_Flag(rs.getString("Filter_Flag"));
                    model.setPaginationFlag(rs.getString("Report_Format"));
                    alert_descList.add(rs.getString("alert_desc"));
                    if (rs.getString("rep_code").contains("PROCESSED")) {
                        String lastUpdate = rs.getString("LASTUPDATE");
                        if (lastUpdate.contains("G#, ")) {
                            lastUpdate = lastUpdate.split("G#, ")[1];
                        } else {
                            lastUpdate = lastUpdate;
                        }
                        model.setLastupdate(lastUpdate);
                    }
                    if (rs.getString("first_screen").contains("1")) {
                        ps1 = c.prepareStatement(rs.getString("sql_text").replaceAll("USERCODE", userCode));
                        U.log("Query : " + rs.getString("sql_text").replaceAll("USERCODE", userCode));
                        rs1 = ps1.executeQuery();
                        int count = 0;
                        if (rs1 != null && rs1.next()) {
                            count++;
                            model.setFirst_screen_1_value(rs1.getString(count));
                        }
                    } else {
                    }
                    list.add(model);
                } while (rs.next());
            }
            if (alert_descList.size() > 0) {
                String alertDescList = "";
                for (int i = 0; i < alert_descList.size(); i++) {
                    alertDescList = alertDescList + "'" + alert_descList.get(i) + "'";
                    if (i != alert_descList.size() - 1) {
                        alertDescList = alertDescList + ",";
                    }
                }
                String iconImgSql = "select e.Icon_Image, e.seq_id from LHSSYS_ALERT_DIRECT_EMAIL e where  e.alert_desc in(?) ORDER BY E.SEQ_ID";
                U.log("Icon_Image SQL : " + iconImgSql);
                ps = c.prepareStatement(iconImgSql);
                ps.setObject(1, alertDescList);
                rs = ps.executeQuery();
                GraphTabListModel model = new GraphTabListModel();
                int j = 0;
                if (rs != null && rs.next()) {
                    do {
                        model = list.get(j);
                        if (rs.getBlob("Icon_Image") != null) {
                            imgstream = rs.getBlob("Icon_Image").getBinaryStream();
                        } else {
                            imgstream = getClass().getResourceAsStream("/defualtDp.png");
                        }
                        if (rs.getBlob("Icon_Image") != null) {
                            model.setDp(Util.getImgstreamToBytes(imgstream));
                        }
                        j++;
                    } while (rs.next());
                }
            }
        } catch (SQLException e) {
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
        }
        return list;
    }

    public List<GraphTabListModel> graphTabList(String portletId, String seqNo, String userCode) {
        String sql = "select e.alert_desc,e.seq_id,e.Icon_Image,e.rep_code,t.first_screen,e.sql_text "
                + "from LHSSYS_ALERT_DIRECT_EMAIL e,LHSSYS_PORTAL_TABLE_DSC_UPDATE t where  upper(e.portlet_id) =upper('"
                + portletId + "') and t.seq_no=" + seqNo + " and e.report_group=t.table_desc";
        PreparedStatement ps = null;
        PreparedStatement ps1 = null;
        ResultSet rs1;
        List<GraphTabListModel> list = new ArrayList<GraphTabListModel>();
        ResultSet rs;
        try {
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {

                    GraphTabListModel model = new GraphTabListModel();
                    model.setSeq_no(rs.getString("seq_id"));
                    model.setTab(rs.getString("alert_desc"));
                    InputStream imgstream = null;
                    if (rs.getBlob("Icon_Image") != null) {
                        imgstream = rs.getBlob("Icon_Image").getBinaryStream();
                    } else {
                        imgstream = getClass().getResourceAsStream("/defualtDp.png");
                    }
                    if (rs.getBlob("Icon_Image") != null) {
                        model.setDp(Util.getImgstreamToBytes(imgstream));
                    }
                    if (rs.getString("first_screen").contains("1")) {
                        ps1 = c.prepareStatement(rs.getString("sql_text").replaceAll("USERCODE", userCode));
                        rs1 = ps1.executeQuery();
                        int count = 0;
                        if (rs1 != null && rs1.next()) {
                            count++;
                            model.setFirst_screen_1_value(rs1.getString(count));
                        }
                    }
                    list.add(model);
                } while (rs.next());
            }
        } catch (SQLException e) {
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
        }
        return list;
    }
}
