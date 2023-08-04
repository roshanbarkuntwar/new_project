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
public class JDBCContractorNameDAO {

    Connection c;

    public JDBCContractorNameDAO(Connection c) {
        this.c = c;
    }

    public List<GenericCodeNameModel> getContractorName(String supplierType) {
        List<GenericCodeNameModel> list = new ArrayList<GenericCodeNameModel>();

        String query = "SELECT A.ACC_CODE, A.ACC_NAME FROM Acc_Mast A WHERE A.SUPPLIER_TYPE = '" + supplierType + "'ORDER BY A.ACC_NAME";
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            ps = c.prepareStatement(query);
            rs = ps.executeQuery();
            U.log("executed1");
            if (rs != null && rs.next()) {

                do {
                    GenericCodeNameModel m = new GenericCodeNameModel();
                    m.setCode(rs.getString("acc_code"));
                    m.setName(rs.getString("acc_name"));
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
