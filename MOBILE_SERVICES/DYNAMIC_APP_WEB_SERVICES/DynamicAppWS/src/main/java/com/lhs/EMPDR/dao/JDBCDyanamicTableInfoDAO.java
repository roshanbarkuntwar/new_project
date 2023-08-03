/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.TableDetailJSON;
import com.lhs.EMPDR.Model.TableDetailModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCDyanamicTableInfoDAO {

    Connection c;

    public JDBCDyanamicTableInfoDAO(Connection c) {
        this.c = c;
    }

    public TableDetailJSON TableDetail(String appType, String userCode) {
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String viewMode = "";
        TableDetailJSON json = new TableDetailJSON();
        List<TableDetailModel> list = new ArrayList<TableDetailModel>();
        try {

            StringBuilder sql = new StringBuilder();
            StringBuilder append = sql.append("select u.*,t.view_mode  from lhssys_portal_tab_mast t, "
                    + "lhssys_portal_table_dsc_update u where instr('#'||u.module||'#','").append("#")
                    .append(appType).append("#')>0  and t.tab_id='")
                    .append(appType).append("' and (u.status = 'T' or u.status = 'O') order by u.tab_ordering_slno");
            U.log("DASHBOARD TABS FETCHING SQL : " + sql.toString());
            preparedStatement = c.prepareStatement(sql.toString());
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    TableDetailModel model = new TableDetailModel();
                    viewMode = resultSet.getString("view_Mode");
                    model.setDATA_UPLOAD(resultSet.getString("DATA_UPLOAD"));
                    model.setDisplay_clause(resultSet.getString("Display_clause"));
                    model.setDuplicate_row_value_allow(resultSet.getString("Duplicate_row_value_allow"));
                    model.setExcel_template(resultSet.getString("Excel_template"));
                    model.setList_columns_order_by(resultSet.getString("List_columns_order_by"));
                    model.setList_columns_update(resultSet.getString("List_columns_update"));
                    model.setMandatory_to_start_portal(resultSet.getString("Mandatory_to_start_portal"));
                    model.setOrder_clause(resultSet.getString("Order_clause"));
                    model.setPortlet_Id(resultSet.getString("Portlet_Id"));
                    model.setReplicate_fields(resultSet.getString("Replicate_fields"));
                    model.setReplicate_rec(resultSet.getString("Replicate_rec"));
                    model.setStatus(resultSet.getString("Status"));
                    model.setTable_desc(resultSet.getString("Table_desc"));
                    model.setTable_name(resultSet.getString("Table_name"));
                    model.setUnique_clause(resultSet.getString("Unique_clause"));
                    model.setUnique_message(resultSet.getString("Unique_message"));
                    model.setUpdate_key(resultSet.getString("Update_key"));
                    model.setUpdation_process(resultSet.getString("Updation_process"));
                    model.setUpdation_typ(resultSet.getString("Updation_typ"));
                    model.setWhere_clause(resultSet.getString("Where_clause"));
                    model.setFirstScreen(resultSet.getString("first_screen"));
                    model.setSeqNo(resultSet.getString("seq_no"));
                    model.setAccess_contrl(resultSet.getString("access_control"));
                    model.setScreen_orientation_view(resultSet.getString("screen_orientation_view"));
                    model.setDefault_populate_data(resultSet.getString("default_populate_data"));
                    model.setOffline_flag_app_run(resultSet.getString("Offline_flag_app_run"));
                    model.setData_save_client_app(resultSet.getString("Data_save_client_app"));
                    model.setDependent_next_entry_seq(resultSet.getString("DEPENDENT_NEXT_ENTRY_SEQ"));
                    model.setReportCount(getCountOfReport(userCode, resultSet.getString("sql_text")));
                    model.setSelection_clause(resultSet.getString("selection_clause"));
                    InputStream imgstream = null;
                    if (resultSet.getBlob("icon_image") != null) {
                        imgstream = resultSet.getBlob("icon_image").getBinaryStream();
                        model.setImage(Util.getImgstreamToBytes(imgstream));
                    } else {
                        imgstream = getClass().getResourceAsStream("/defualtDp.png");
                        model.setImage(Util.getImgstreamToBytes(imgstream));
                    }
                    try {
                        System.out.println("view_sql-------> " + resultSet.getString("view_sql"));
                        model.setView_desc(resultSet.getString("view_desc"));
                        model.setView_type(resultSet.getString("view_type"));
                        model.setView_group(resultSet.getString("view_group"));
                        String view_sql = resultSet.getString("view_sql");
//                        System.out.println("view_sql-------> " + view_sql);
                        if (view_sql != null && !view_sql.isEmpty()) {
                            ArrayList<ArrayList<String>> arrList = new ArrayList<ArrayList<String>>();
                            ArrayList<String> columns = new ArrayList<String>();
                            try {

                                System.out.println("view_sql-------> " + view_sql);
                                preparedStatement = c.prepareStatement(sql.toString());
                                ResultSet rs = preparedStatement.executeQuery();
                                ResultSetMetaData rsmd = rs.getMetaData();
                                int count = 0;
                                if (rs != null && rs.next()) {
                                    do {
                                        ArrayList<String> arr = new ArrayList<String>();
                                        for (int i = 0; i <= rsmd.getColumnCount(); i++) {
                                            arr.add(rs.getString(i));
                                        }
                                        columns.add(rsmd.getColumnName(count));
                                        arrList.add(arr);
                                        count++;
                                    } while (rs.next());
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                            HashMap<String, Object> map = new HashMap<String, Object>();
                            map.put("data", arrList);
                            map.put("column_head", columns);
                            model.setView_data(columns);
                        }
                    } catch (Exception e) {
//                        e.printStackTrace();
                    }
                    list.add(model);
                } while (resultSet.next());
                json.setTable_Detail(list);
                json.setView_mode(viewMode);
                return json;
            }

        } catch (SQLException e) {
            System.out.println("exception ---> " + e.getMessage());
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                }
            }
        }
        return json;
    }

    public TableDetailJSON TableDetailForOffline(String appType, String userCode) {
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String viewMode = "";
        TableDetailJSON json = new TableDetailJSON();
        List<TableDetailModel> list = new ArrayList<TableDetailModel>();
        try {
            StringBuffer sql = new StringBuffer();
            sql.append("select u.*,t.view_mode  from lhssys_portal_tab_mast t, "
                    + "lhssys_portal_table_dsc_update u where"
                    //                    + " upper(u.module)='" + appType.toUpperCase()
                    + " instr(u.module,'" + appType.toUpperCase() + "')>0 "
                    + " and u.Offline_flag_app_run = 'T'  and upper(t.tab_id)='" + appType + "' order by u.seq_no");
            preparedStatement = c.prepareStatement(sql.toString());
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    TableDetailModel model = new TableDetailModel();
                    if (resultSet.getString("Offline_flag_app_run").contains("T")) {
                        viewMode = resultSet.getString("view_Mode");
                        model.setDATA_UPLOAD(resultSet.getString("DATA_UPLOAD"));
                        model.setDisplay_clause(resultSet.getString("Display_clause"));
                        model.setDuplicate_row_value_allow(resultSet.getString("Duplicate_row_value_allow"));
                        model.setExcel_template(resultSet.getString("Excel_template"));
                        model.setList_columns_order_by(resultSet.getString("List_columns_order_by"));
                        model.setList_columns_update(resultSet.getString("List_columns_update"));
                        model.setMandatory_to_start_portal(resultSet.getString("Mandatory_to_start_portal"));
                        model.setOrder_clause(resultSet.getString("Order_clause"));
                        model.setPortlet_Id(resultSet.getString("Portlet_Id"));
                        model.setReplicate_fields(resultSet.getString("Replicate_fields"));
                        model.setReplicate_rec(resultSet.getString("Replicate_rec"));
                        model.setStatus(resultSet.getString("Status"));
                        model.setTable_desc(resultSet.getString("Table_desc"));
                        model.setTable_name(resultSet.getString("Table_name"));
                        model.setUnique_clause(resultSet.getString("Unique_clause"));
                        model.setUnique_message(resultSet.getString("Unique_message"));
                        model.setUpdate_key(resultSet.getString("Update_key"));
                        model.setUpdation_process(resultSet.getString("Updation_process"));
                        model.setUpdation_typ(resultSet.getString("Updation_typ"));
                        model.setWhere_clause(resultSet.getString("Where_clause"));
                        model.setFirstScreen(resultSet.getString("first_screen"));
                        model.setSeqNo(resultSet.getString("seq_no"));
                        model.setAccess_contrl(resultSet.getString("access_control"));
                        model.setScreen_orientation_view(resultSet.getString("screen_orientation_view"));
                        model.setDefault_populate_data(resultSet.getString("default_populate_data"));
                        model.setOffline_flag_app_run(resultSet.getString("Offline_flag_app_run"));
                        model.setData_save_client_app(resultSet.getString("Data_save_client_app"));
                        model.setDependent_next_entry_seq(resultSet.getString("DEPENDENT_NEXT_ENTRY_SEQ"));
                        model.setReportCount(getCountOfReport(userCode, resultSet.getString("sql_text")));
                        InputStream imgstream = null;
                        if (resultSet.getBlob("icon_image") != null) {
                            imgstream = resultSet.getBlob("icon_image").getBinaryStream();
                            model.setImage(Util.getImgstreamToBytes(imgstream));
                        } else {
                            imgstream = getClass().getResourceAsStream("/defualtDp.png");
                            model.setImage(Util.getImgstreamToBytes(imgstream));
                        }
                        list.add(model);
                    }
                } while (resultSet.next());
                json.setTable_Detail(list);
                json.setView_mode(viewMode);
                return json;
            }
        } catch (SQLException e) {
            System.out.println("exception ---> " + e.getMessage());
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }
        return json;
    }

    public String getCountOfReport(String user_code, String sql_text) {
        PreparedStatement ps = null;
        ResultSet rs;
        String count = "0";

        try {
            sql_text = sql_text.replace("'USERCODE'", "'" + user_code + "'");
            System.out.println("sql_text--> " + sql_text);
            ps = c.prepareStatement(sql_text);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                count = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("exception in getCountOfReport ---> " + e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {

                }
            }
        }
        return count;
    }
}
