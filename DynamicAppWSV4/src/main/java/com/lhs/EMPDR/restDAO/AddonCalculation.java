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
public class AddonCalculation {

    Connection c;
    String table_name;
    String updtae_key;
    ArrayList< HashMap<String, String>> keyValue = new ArrayList<HashMap<String, String>>();

    public AddonCalculation(Connection con) {
        this.c = con;
    }

    public MapOfKeyValueJSON addoncalculation(String PrimaryKeyVlaue, String seqNo, String isAddonTempTable) {
        MapOfKeyValueJSON mapOfKeyValueJSON = new MapOfKeyValueJSON();
        PreparedStatement ps = null;
        ResultSet rs = null;

        /*-----------------------------------------------------------
        Find table name        
        ------------------------------------------------------------*/
        String tableQuery = "Select d.table_name,t.update_key from lhssys_portal_data_dsc_update d, lhssys_portal_table_dsc_update t where d.seq_no=" + seqNo + " and t.seq_no=" + seqNo;

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
            table_name = isAddonTempTable;
        }

        String valueQuery = "select sum(nvl(AFIELD1,0))AFIELD1, "
                + "sum(nvl(AFIELD2,0))AFIELD2, "
                + "sum(nvl(AFIELD3,0))AFIELD3, "
                + "sum(nvl(AFIELD4,0))AFIELD4, "
                + "sum(nvl(AFIELD5,0))AFIELD5, "
                + "sum(nvl(AFIELD6,0))AFIELD6, "
                + "sum(nvl(AFIELD7,0))AFIELD7, "
                + "sum(nvl(AFIELD8,0))AFIELD8, "
                + "sum(nvl(AFIELD9,0))AFIELD9, "
                + "sum(nvl(AFIELD10,0))AFIELD10, "
                + "sum(nvl(AFIELD11,0))AFIELD11, "
                + "sum(nvl(AFIELD12,0))AFIELD12, "
                + "sum(nvl(AFIELD13,0))AFIELD13, "
                + "sum(nvl(AFIELD14,0))AFIELD14, "
                + "sum(nvl(AFIELD15,0))AFIELD15, "
                + "sum(nvl(AFIELD16,0))AFIELD16, "
                + "sum(nvl(AFIELD17,0))AFIELD17, "
                + "sum(nvl(AFIELD18,0))AFIELD18 from temp_body_tran_web where " + updtae_key + "='" + PrimaryKeyVlaue + "' group by " + updtae_key;

        HashMap<String, String> map = new HashMap<String, String>();
        U.log("Query==>" + valueQuery);
        try {

            ps = c.prepareStatement(valueQuery);
            rs = ps.executeQuery();
            ResultSetMetaData rsmd = rs.getMetaData();
            int rsmdColCount = rsmd.getColumnCount();
            int i = 1;
            if (rs != null && rs.next()) {
                do {

                    for (i = 1; i < rsmdColCount; i++) {
//                       U.log("key=>"+rsmd.getColumnName(i)+" value="+rs.getString(i));                    
                        map.put(rsmd.getColumnName(i), rs.getString(i));
                    }

                } while (rs.next());
                U.log("size of array>>" + keyValue.size());

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
 /*-----------------------------------------------------------
        Find DRAMT       
        ------------------------------------------------------------*/
//        String dramtQuery = "Select DRAMT from " + table_name + " where " + updtae_key + "=" + PrimaryKeyVlaue;
        String dramtQuery = "select   "
                + "  SUM(nvl(afield1,0)+ "
                + "  nvl(afield2,0)+ "
                + "  nvl(afield3,0)+ "
                + "  nvl(afield4,0)+ "
                + "  nvl(afield5,0)+ "
                + "  nvl(afield6,0)+ "
                + "  nvl(afield7,0)+ "
                + "  nvl(afield8,0)+ "
                + "  nvl(afield9,0)+ "
                + "  nvl(afield10,0)+ "
                + "  nvl(afield11,0)+ "
                + "  nvl(afield12,0)+ "
                + "  nvl(afield13,0)+ "
                + "  nvl(afield14,0)+ "
                + "  nvl(afield15,0)+ "
                + "  nvl(afield16,0)+ "
                + "  nvl(afield17,0)+ "
                + "  nvl(afield18,0))  "
                + "from temp_body_tran_web t " + " where " + updtae_key + "=" + PrimaryKeyVlaue;
//                where t.seq_id = 1154" "
        U.log("" + dramtQuery);
        String DRAMT = "";
        try {
            ps = c.prepareStatement(dramtQuery);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                DRAMT = rs.getString(1);

                System.out.println("DRAMT--> " + DRAMT);
                map.put("DRAMT", DRAMT);
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
        keyValue.add(map);
        mapOfKeyValueJSON.setKeyValue(keyValue);

        U.log(">>>>" + mapOfKeyValueJSON.getKeyValue().toString());

        return mapOfKeyValueJSON;
    }

}
