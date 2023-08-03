/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

//import com.lhs.EMPDR.Model.SavedLocationModel;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author avitosh.rakshe
 */
public class JDBCSavedLocationDao {

    Connection con = null;

    public JDBCSavedLocationDao(Connection c) {
        con = c;
    }

    public String getSavedLocation(String fence_id, String user_code) {

        ResultSet rs = null;
        PreparedStatement ps = null;
//        SavedLocationModel savedLocationModel = new SavedLocationModel();
        String query = "select t.col4 latlngarray from lhssys_portal_app_tran t where t.col3='" + fence_id + "' and t.col2='" + user_code + "'";

        try {
            ps = con.prepareStatement(query);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
//                savedLocationModel.setLocationArray(rs.getString("latlngarray"));
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        } finally {
            try {
                ps.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            ps = null;
        }

//        return savedLocationModel.getLocationArray();
        return "";
    }

}
