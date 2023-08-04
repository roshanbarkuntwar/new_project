/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.TableDetailForOfflineModel;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCgetTableAllRowsDAO {

    Connection c;

    public JDBCgetTableAllRowsDAO(Connection c) {
        this.c = c;
    }

    public TableDetailForOfflineModel tableRows(String tableName) {
        TableDetailForOfflineModel model = new TableDetailForOfflineModel();
        String sql = "";//select table_name from LHSSYS_PORTAL_TABLE_DSC_UPDATE where seq_no=" + tableName;
        ResultSet rs;
        PreparedStatement ps = null;
        List<String> tableHeading = new ArrayList<String>();
        List<ArrayList> tableRows = new ArrayList<ArrayList>();
        List<TableDetailForOfflineModel> list = new ArrayList<TableDetailForOfflineModel>();
        //  String tableName = null;
        try {
//            ps = c.prepareStatement(sql);
//            rs = ps.executeQuery();
            ArrayList<String> arr;
//            if (rs != null && rs.next()) {
//                tableName = rs.getString(1);
//            }

            if (tableName != null) {
                sql = "select * from " + tableName;
                ps = c.prepareStatement(sql);
                rs = ps.executeQuery();
                ResultSetMetaData rsmd = rs.getMetaData();

                int columnsNumber = rsmd.getColumnCount();
                U.log("columnsNumber=" + columnsNumber);
                String columnName = "";
                boolean flag = true;
                if (rs != null && rs.next()) {
                    do {
                        arr = new ArrayList<String>();
                        for (int i = 1; i <= columnsNumber; i++) {

                            if (rs.getString(i) != null) {
                                arr.add(rs.getString(i));

                            } else {
                                arr.add("NA");
                            }
                            columnName = rsmd.getColumnName(i);
                            if (flag == true) {
                                tableHeading.add(columnName);
                            }
                        }

                        tableRows.add(arr);
                        flag = false;
                    } while (rs.next());
                }

            }

            model.setTableHeading(tableHeading);
            model.setTableRows(tableRows);
            return model;
        } catch (Exception e) {

        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }
        }
        return model;
    }

}
