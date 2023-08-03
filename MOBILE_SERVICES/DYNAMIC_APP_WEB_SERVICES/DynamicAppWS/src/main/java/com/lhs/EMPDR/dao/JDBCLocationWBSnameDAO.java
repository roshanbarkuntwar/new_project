/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.GenericCodeNameModel;
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
public class JDBCLocationWBSnameDAO {

    Connection c;

    public JDBCLocationWBSnameDAO(Connection c) {
        this.c = c;
    }

    public List<GenericCodeNameModel> getLocationWBSname(String costCode) {
        List<GenericCodeNameModel> list = new ArrayList<GenericCodeNameModel>();
        String query = "SELECT DISTINCT B.rowId,B.WBS_Name, H.COST_CODE From Project_WBS_body B, PROJECT_WBS_HEAD H\n"
                + "WHERE B.ENTITY_CODE = H.ENTITY_CODE\n"
                + "AND B.TCODE = H.TCODE\n"
                + "AND B.VRNO = H.VRNO and H.trantype='G'\n"
                + "AND H.COST_CODE = '" + costCode + "'ORDER BY B.WBS_NAME";
        PreparedStatement ps = null;
        ResultSet rs = null;
        U.log(query);
        try {
            ps = c.prepareStatement(query);
            rs = ps.executeQuery();
            U.log("executed1");
            if (rs != null && rs.next()) {
                do {
                    GenericCodeNameModel m = new GenericCodeNameModel();
                    m.setCode(rs.getString("cost_code"));
                    m.setName(rs.getString("WBS_name"));
                    m.setRowId(rs.getString("rowid"));
                    list.add(m);
                } while (rs.next());
            }
        } catch (SQLException e) {
            U.log(e);
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
