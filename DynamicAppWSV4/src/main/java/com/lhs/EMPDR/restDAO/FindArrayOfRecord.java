/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.restDAO;

import com.lhs.EMPDR.Model.MapOfKeyValueJSON;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

/**
 *
 * @author kirti.misal
 */
public class FindArrayOfRecord {

    Connection c;
    String table_name;
    String updtae_key;
     ArrayList< HashMap<String,String>> keyValue=new ArrayList<HashMap<String, String>>();

    public FindArrayOfRecord(Connection c) {
        this.c = c;
    }

    public void getArrayOfRecords(String PrimaryKeyVlaue, String seqNo, String isAddonTempTable) {
        PreparedStatement ps = null;
        ResultSet rs = null;

        /*-----------------------------------------------------------
        Find table name        
        ------------------------------------------------------------*/
        String tableQuery = "Select d.table_name,t.update_key from lhssys_portal_data_dsc_update d, lhssys_portal_table_dsc_update t where d.seq_no=" + seqNo+" and t.seq_no="+seqNo;

        try {
            ps = c.prepareStatement(tableQuery);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                table_name = rs.getString(1);
                updtae_key = rs.getString(2);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            //close all statement but not connection
            try {
                c.commit();
                ps.close();
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        /*
        ------end----------
         */
         /*-----------------------------------------------------
        find records from tabel
        --------------------------------------------------------*/
        if (isAddonTempTable != null) {
            //for temp_head_tran_web table
            updtae_key = "SEQ_ID";
            table_name=isAddonTempTable;
        }
        MapOfKeyValueJSON mapOfKeyValueJSON=new MapOfKeyValueJSON(); 
        String valueQuery = "select * from " + table_name + " where " + updtae_key + "='" + PrimaryKeyVlaue+"'";
        U.log("Query==>"+valueQuery);
        try {
            
            ps = c.prepareStatement(valueQuery);
            rs = ps.executeQuery();
            ResultSetMetaData rsmd=rs.getMetaData();
            int rsmdColCount=rsmd.getColumnCount();
            int i=1;
            if (rs != null && rs.next()) {
                do{
                    HashMap<String, String> map=new HashMap<String, String>();
                    
                    for(i=1;i<rsmdColCount;i++){
//                       U.log("key=>"+rsmd.getColumnName(i)+"\nvalue="+rs.getString(i));                    
                    map.put(rsmd.getColumnName(i), rs.getString(i));
                    }
                     keyValue.add(map);
                }while(rs.next());
                U.log("size of array>>"+keyValue.size());
               mapOfKeyValueJSON.setKeyValue(keyValue);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            //close all statement but not connection
            try {
                c.commit();
                ps.close();
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        /*
        end
         */
        
        U.log(">>>>"+mapOfKeyValueJSON.getKeyValue().toString());
    }
}
