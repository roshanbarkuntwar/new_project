/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.LatLongModel;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author harsh.satfale
 */
public class JDBCGetEmpGeofenceDAO {
    
    Map LatLang = new HashMap<String,String>();
    ArrayList<LatLongModel> al = new ArrayList<LatLongModel>();

    Connection c;
    
    public JDBCGetEmpGeofenceDAO(Connection c) {
        this.c = c;
    }
    
    
    
    public ArrayList<LatLongModel> getEmpGeofence(String userCode){
        PreparedStatement ps = null;
            ResultSet rs=null;
            String latLangarray=null;
        try {
            
            String query = "select latitude,longitude from geo_org_coordinate_mast  where user_code = '"+userCode+"'";
            U.log(query);
            ps = this.c.prepareStatement(query);
            rs = ps.executeQuery();
            
            if(rs!=null && rs.next()){
                do{
                    LatLongModel model = new LatLongModel();
                    model.setLatitude(rs.getString(1));
                    model.setLongitude(rs.getString(2));
                    al.add(model);
                }while(rs.next());
                
            }
            
            
        } catch (SQLException ex) {
            ex.printStackTrace();
        }finally{
            if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                        System.out.println("exception ---> " + e.getMessage());
                    }
                }
        }
        return al;
    }
    
    
    
}
