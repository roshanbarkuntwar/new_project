/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.GraphTabListModel;
import com.lhs.EMPDR.Model.SubTabOfReportModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCsubTypeOfReport {

    Connection c;

    public JDBCsubTypeOfReport(Connection c) {
        this.c = c;
        U u = new U(this.c);
    }

    public List<SubTabOfReportModel> getSubTabList(String seqID) {
        String sql = "SELECT P.SEQ_ID, P.SLNO, P.PARA_DESC FROM LHSSYS_ALERT_DIRECT_EMAIL_PARA P WHERE P.SEQ_ID = '" + seqID + "'";
        PreparedStatement ps = null;
        List<SubTabOfReportModel> list = new ArrayList<SubTabOfReportModel>();
        ResultSet rs;
        try {
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    SubTabOfReportModel model = new SubTabOfReportModel();
                    model.setSeqNo(rs.getString("seq_id"));
                    model.setDesc(rs.getString("para_desc"));
                    model.setSlno(rs.getString("slno"));

                    list.add(model);
                } while (rs.next());
            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }

        }
        return list;

    }

}
