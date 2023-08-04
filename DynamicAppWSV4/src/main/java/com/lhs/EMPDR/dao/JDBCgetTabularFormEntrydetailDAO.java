/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.RecordInfoJSON;
import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
import com.lhs.EMPDR.Model.EntryDetailDynamicModel;
import com.lhs.EMPDR.Model.TabularFormEntryDetailModel;
import com.lhs.EMPDR.utility.SqlUtil;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCgetTabularFormEntrydetailDAO {

    Connection connection;
    String USER_CODE = "";

    public JDBCgetTabularFormEntrydetailDAO(Connection c) {
        this.connection = c;
        U u = new U(this.connection);
    }

    LinkedHashMap<String, String> displayColList = new LinkedHashMap<String, String>();
    LinkedHashMap<String, String> codeValueLOV = new LinkedHashMap<String, String>();
    HashMap<String, String> nondisplayColList = new HashMap<String, String>();
    List<String> tableHeader = new ArrayList<String>();
    String table_name = "";
    String vrnocolName = "";
    String seq_no;

    public void getDetailOfColumns() {
        PreparedStatement ps = null;
        ResultSet rs;
        StringBuffer sql = new StringBuffer();

        sql.append("select u.* from lhssys_portal_data_dsc_update u where ");
        sql.append("seq_no=" + seq_no + "order by column_slno");
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {
            ps = connection.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();
                    table_name = rs.getString("table_name");
                    if (rs.getString("column_desc").contains("VRNO")) {
                        vrnocolName = rs.getString("column_name");
                    }
                    if (rs.getString("column_desc").contains("SEQ_ID")) {
                        displayColList.put(rs.getString("column_desc"), rs.getString("status"));
                    }
                    if (rs.getString("status") != null && !rs.getString("entry_by_user").contains("F") || rs.getString("entry_by_user").contains("R")) {
                        U.log(rs.getString("entry_by_user") + "==display in form=" + rs.getString("column_name") + "   " + rs.getString("status"));
                        displayColList.put(rs.getString("column_name"), rs.getString("status"));
                        codeValueLOV.put(rs.getString("column_name"), rs.getString("ref_lov_table_col"));
                    } else {
                        String defaultVal = rs.getString("column_default_value");
                        nondisplayColList.put(rs.getString("column_name"), defaultVal);
                    }
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
    }

    public TabularFormEntryDetailModel getDetailOfEntry(String entity, String seq_no, String vrNo,
            String userCode, String accCode, String searchText) throws SQLException {
        //getValueOfEntry(seq_id);
        TabularFormEntryDetailModel tabmodel = new TabularFormEntryDetailModel();
        this.seq_no = seq_no;
        List<EntryDetailDynamicModel> list = new ArrayList<EntryDetailDynamicModel>();
        PreparedStatement ps = null;
        ResultSet rs = null;
        StringBuffer sql = new StringBuffer();  

        try {
            JDBCGetRecordDetailDAO dao = new JDBCGetRecordDetailDAO(connection);
            RecordInfoJSON json = new RecordInfoJSON();
            try {

                json = dao.recordsDetail(entity, seq_no, userCode, accCode, searchText,"","");

                tabmodel.setTableHeader(json);
                tabmodel.setVRNO(vrNo);
            } catch (Exception e) {
                e.printStackTrace();    
            }
            getDetailOfColumns();
            //vrnocolName="col4";
            U.log(displayColList.size() + "==vrno===" + vrNo);
            //entry List
            List<ArrayList> entryList = new ArrayList<ArrayList>();
            String elSql = "select * from " + table_name + " where dynamic_table_seq_id=" + seq_no + " and " + vrnocolName + "='" + vrNo + "'";
            U.log("TabularFormEntryDetail SQL : " + elSql);
            ps = connection.prepareStatement(elSql);
            rs = ps.executeQuery();
            ResultSetMetaData md = rs.getMetaData();
            int columnCount = md.getColumnCount();
            Set<String> keys = displayColList.keySet();
            U.log("colCount : " + columnCount);
            ArrayList<String> arr;
            if (rs != null && rs.next()) {
                do {
                    arr = new ArrayList<String>();
                    //  U.log("&&&&&&&&" + displayColList.get("COL7"));
                    // for (int i = 1; i <= columnCount; i++)

                    for (String key : keys) {

                        U.log("key : " + key);

                        String colmnName = key;//md.getColumnName(i).trim();
                        if (colmnName.contains("USER_CODE")) {
                            USER_CODE = rs.getString(colmnName);
                        }
                        //  U.log("colmnName:::::" + colmnName);
                        if (displayColList.get(colmnName) != null) {
                            U.log("colmnName : " + colmnName);//+"  "+rs.getString(colmnName));
                            if (!displayColList.get(colmnName).contains("IMG")) {
                                U.log("colmnName : " + colmnName + " ColumnValue :  " + rs.getString(colmnName));
                                String valueOfColumn = rs.getString(colmnName);
                                if (codeValueLOV.get(colmnName) != null) {
                                    U.log(valueOfColumn + "   codevalueLOv : " + colmnName);
                                    //                    String refLocSql = " SELECT 'SELECT DISTINCT ' || DISPLAY_VALUE || ' FROM ' || TABLE_NAME || ' WHERE 1=1 ' || 'AND '|| column_name||' = '\n"
                                    String refLocSql = " SELECT 'SELECT DISTINCT '|| column_name ||' || ' || '''~''' || ' || ' || 'trim(' || DISPLAY_VALUE ||')' || \n"
                                            + "' FROM ' || TABLE_NAME || ' WHERE 1=1 ' || 'AND '|| column_name||' = '\n"
                                            + "        FROM VIEW_PORTAL_UPLOAD_TBL_LOV_GEN\n"
                                            + " WHERE UPPER(TRIM(TABLE_NAME || '.' || COLUMN_NAME)) = \n"
                                            + "       UPPER('" + codeValueLOV.get(colmnName) + "')";
                                    U.log("refLocSql :   " + refLocSql);
                                    String codeSql = "";
                                    ps = connection.prepareStatement(refLocSql);
                                    ResultSet rs1 = ps.executeQuery();
                                    String whereclause = "";
                                    String whereclause1 = "";
                                    if (rs1 != null && rs1.next()) {
                                        U.log("before append codeSQL==" + rs1.getString(1));
                                        // whereclause1 = values.get(model.getColumn_name());
                                        whereclause = valueOfColumn;
                                        U.log(colmnName + "=whereclause=" + valueOfColumn);
                                        if (whereclause != null && whereclause.contains("#")) {
                                            whereclause = whereclause.split("#")[0];
                                        }
                                        codeSql = rs1.getString(1) + "'" + whereclause + "'";
                                    }
                                    U.log("codeSql=" + codeSql);
                                    valueOfColumn = SqlUtil.findLovValue(codeSql, whereclause, connection);
                                }
                                arr.add(valueOfColumn);
                            } else {
//                                U.log("colmnName::::" + colmnName + "  " + rs.getString(colmnName));
                            }
                        }
                    }
                    entryList.add(arr);
                } while (rs.next());
            }

            tabmodel.setTableData(entryList);
            
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.log(e);
                }
            }

        }
        
        return tabmodel;
    }
    
    
}
