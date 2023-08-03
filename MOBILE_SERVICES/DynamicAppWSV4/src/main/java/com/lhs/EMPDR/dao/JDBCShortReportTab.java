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
public class JDBCShortReportTab {

    Connection c;

    public JDBCShortReportTab(Connection c) {
        this.c = c;
        U u = new U(this.c);
    }

    public List<GraphTabListModel> getShortReportTab(String seqNo) {
        String sql = "select e.seq_id,e.alert_desc,e.icon_image from LHSSYS_ALERT_DIRECT_EMAIL e,\n"
                + "LHSSYS_PORTAL_TABLE_DSC_UPDATE t where t.seq_no=" + seqNo
                + " \nand t.table_desc=e.report_group and e.report_delivery_type='A'";
        PreparedStatement ps = null;
        ResultSet rs;
        List<GraphTabListModel> list = new ArrayList<GraphTabListModel>();
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
                    list.add(model);
                } while (rs.next());
            }
        } catch (SQLException e) {
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return list;
    }
}
