/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.TableDetailJSON;
import com.lhs.EMPDR.Model.PartyListModel;
import com.lhs.EMPDR.Model.ReportCountModel;
import com.lhs.EMPDR.Model.TableDetailModel;
import com.lhs.EMPDR.Model.UserListModel;
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
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCDyanamicTableInfoDAO {

    Connection c;

    public JDBCDyanamicTableInfoDAO(Connection c) {
        this.c = c;
        U u = new U(this.c);
    }

    public TableDetailJSON TableDetail(String appType, String userCode, String empCode, String dbName, String geoOrgCode, String loginFlag, String loginId, String appKey) {
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String viewMode = "";
        TableDetailJSON json = new TableDetailJSON();
        List<HashMap<String, List<PartyListModel>>> sideMenuObjectList = new ArrayList<HashMap<String, List<PartyListModel>>>();
        List<TableDetailModel> list = new ArrayList<TableDetailModel>();
        HashMap<String, TableDetailModel> sideMenuListModel = new HashMap<String, TableDetailModel>();
        HashMap<String, TableDetailModel> userListModel = new HashMap<String, TableDetailModel>();
        HashMap<String, TableDetailModel> partyListModel = new HashMap<String, TableDetailModel>();
        try {

            StringBuffer sql = new StringBuffer();
//            sql.append("select u.*,t.view_mode  from lhssys_portal_tab_mast t, lhssys_portal_table_dsc_update u "
//                    + "where instr(upper(u.module),'#" + appType.toUpperCase() + "#')<>0 and upper(t.tab_id)='" + appType.toUpperCase() + "'"
//                    + "and u.status = 'T' order by u.tab_ordering_slno");
            sql.append("select u.*, t.view_mode"
                    + "  from lhssys_portal_tab_mast t,\n"
                    + "       lhssys_portal_table_dsc_update u,\n"
                    + "       (select v1.module\n"
                    + "          from lhssys_user_app_key_validation v1\n"
                    + "         where v1.user_code = '" +  loginId.toUpperCase() +"'\n"
                    + "           and (appkey = '"+ appKey.toUpperCase() +"' OR appkey='.') \n"
                    + "           and rownum = 1) v\n"
                    + " where instr(upper(u.module), '#' || v.module || '#') <> 0\n"
                    + "   and upper(t.tab_id) = v.module\n"
                    + "   and u.status = 'T'\n"
                    + " order by u.tab_ordering_slno");
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
                    model.setSqlText(resultSet.getString("sql_text"));
                    model.setPlSqlText(resultSet.getString("pl_sql_text"));
                    model.setAccess_contrl(resultSet.getString("access_control"));
                    model.setScreen_orientation_view(resultSet.getString("screen_orientation_view"));
                    model.setDefault_populate_data(resultSet.getString("default_populate_data"));
                    model.setOffline_flag_app_run(resultSet.getString("Offline_flag_app_run"));
                    model.setData_save_client_app(resultSet.getString("Data_save_client_app"));
                    model.setDependent_next_entry_seq(resultSet.getString("DEPENDENT_NEXT_ENTRY_SEQ"));
                    model.setReportCount(getCountOfReport(userCode, empCode, resultSet.getString("sql_text"), loginId));
                    model.setSelection_clause(resultSet.getString("selection_clause"));
                    model.setEmail_send_condition(resultSet.getString("EMAIL_SEND_CONDITION"));
                    model.setEmail_subject(resultSet.getString("EMAIL_SUBJECT"));
                    model.setShow_type_menu_flag(resultSet.getString("show_type_menu_flag"));
                    model.setTab_slno(resultSet.getString("TAB_ORDERING_SLNO"));
                    model.setEmail_id(resultSet.getString("email_id"));
                    model.setData_save_success_message(resultSet.getString("DATA_SAVE_SUCCESS_MESSAGE"));
                    InputStream imgstream = null;
                    if (resultSet.getBlob("icon_image") != null) {
                        imgstream = resultSet.getBlob("icon_image").getBinaryStream();
                        model.setImage(Util.getImgstreamToBytes(imgstream));
                    } else {
                        imgstream = getClass().getResourceAsStream("/defualtDp.png");
                        model.setImage(Util.getImgstreamToBytes(imgstream));
                    }

                    try {
                        model.setView_desc(resultSet.getString("view_desc"));
                        model.setView_type(resultSet.getString("view_type"));
                        model.setView_group(resultSet.getString("view_group"));

                        try {
                            model.setView_desc(resultSet.getString("view_desc"));
                            model.setView_type(resultSet.getString("view_type"));
                            model.setView_group(resultSet.getString("view_group"));
                            String view_sql = resultSet.getString("view_sql");
//                            U.log("view_sql-------> " + view_sql);
                            if (view_sql != null && !view_sql.isEmpty()) {
                                ArrayList<ArrayList<String>> arrList = new ArrayList<ArrayList<String>>();
                                ArrayList<String> columns = new ArrayList<String>();
                                try {
                                    preparedStatement = c.prepareStatement(view_sql.toString());
                                    ResultSet rs = preparedStatement.executeQuery();
                                    ResultSetMetaData rsmd = rs.getMetaData();
                                    int count = 1;
                                    if (rs != null && rs.next()) {
                                        do {
                                            ArrayList<String> arr = new ArrayList<String>();
                                            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                                                arr.add(rs.getString(i));
                                                if (i == count) {
                                                    U.log(count + "----> ");
                                                    U.log(rsmd.getColumnName(count));
                                                    columns.add(rsmd.getColumnName(count));
                                                    count++;
                                                }
                                            }

                                            arrList.add(arr);

                                        } while (rs.next());
                                    }
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                                HashMap<String, Object> map = new HashMap<String, Object>();
                                map.put("data", arrList);
                                map.put("column_head", columns);
                                model.setView_data(map);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    if (!model.getMandatory_to_start_portal().equalsIgnoreCase("SMOL") && !model.getMandatory_to_start_portal().equalsIgnoreCase("SMPL")
                            && !model.getMandatory_to_start_portal().equalsIgnoreCase("SMUL")) {
                        list.add(model);
                    } else {
                        if (!model.getMandatory_to_start_portal().equalsIgnoreCase("SMPL") && !model.getMandatory_to_start_portal().equalsIgnoreCase("SMOL")) {
                            userListModel.put(model.getTable_desc(), model);
                        } else if (!model.getMandatory_to_start_portal().equalsIgnoreCase("SMPL")) {
                            sideMenuListModel.put(model.getTable_desc(), model);
                        } else {
                            partyListModel.put(model.getTable_desc(), model);
                        }
                    }
                } while (resultSet.next());
                json.setTable_Detail(list);
                json.setView_mode(viewMode);

                //for party list
                List<PartyListModel> partyList = new ArrayList<PartyListModel>();
                List<UserListModel> userList = new ArrayList<UserListModel>();
                U.log("empCode : " + empCode);
//                if (empCode != null) 
                {

                    String partyListSql = "";
                    U.log("partyListModel length=>" + partyListModel.size());
                    for (Map.Entry<String, TableDetailModel> entry : partyListModel.entrySet()) {

                        TableDetailModel tableModel = entry.getValue();
                        String sqlText = tableModel.getSqlText();
                        String plsqlText = tableModel.getPlSqlText();
                        U.log("empCode=>" + empCode);
                        if (empCode == null) {
                            empCode = "";
                        }
                        if (empCode != null && empCode.contains("null")) {
                            empCode = "";
                        }

                        if (sqlText != null) {
                            sqlText = sqlText.replaceAll("EMPCODE", empCode).replaceAll("GEOORGCODE", geoOrgCode);
                        }
                        if (plsqlText != null) {
                            plsqlText = plsqlText.replaceAll("EMPCODE", empCode).replaceAll("GEOORGCODE", geoOrgCode);
                        }

                        if (!loginFlag.contains("E") && plsqlText != null) {
                            partyListSql = plsqlText;
                        } else {
                            partyListSql = sqlText;
                        }
                        if (loginFlag.contains("P")) {
                            partyListSql = "";
                        }

                    }
                    U.log(">>>>>>>>>>>>>>>>>>>"
                            + "\npartyListSql SQL : " + partyListSql);

                    U.log(">>>>>>>>>>>>>>>>>>>");
                    try {
                        preparedStatement = c.prepareStatement(partyListSql.toString());
                        resultSet = preparedStatement.executeQuery();
                        if (resultSet != null && resultSet.next()) {
                            do {
                                PartyListModel model = new PartyListModel();
                                model.setPartyName(resultSet.getString("name"));
                                model.setPartyCode(resultSet.getString("code"));
//                                model.setCity(resultSet.getString("city"));
                                model.setPartyType(resultSet.getString("party_type"));
                                partyList.add(model);
                            } while (resultSet.next());
                        }
                    } catch (Exception e) {
                        U.errorLog(e.getMessage());
                    }

                    //FOR side menu object list
                    for (Map.Entry<String, TableDetailModel> entry : sideMenuListModel.entrySet()) {
                        List<PartyListModel> partyListmodel = new ArrayList<PartyListModel>();
                        TableDetailModel tableModel = entry.getValue();
                        String sqlText = tableModel.getSqlText();
                        String plsqlText = tableModel.getPlSqlText();
                        if (sqlText != null) {
                            sqlText = sqlText.replaceAll("EMPCODE", empCode).replaceAll("GEOORGCODE", geoOrgCode);
                        }
                        if (plsqlText != null) {
                            plsqlText = plsqlText.replaceAll("EMPCODE", empCode).replaceAll("GEOORGCODE", geoOrgCode);
                        }

                        try {
                            String query = "";
                            if (!loginFlag.contains("E") && plsqlText != null) {
                                query = plsqlText;
                            } else {
                                query = sqlText;
                            }

                            U.log("SMOL QUERY==>>" + query);

                            preparedStatement = c.prepareStatement(query);
                            resultSet = preparedStatement.executeQuery();
                            if (resultSet != null && resultSet.next()) {
                                do {
                                    PartyListModel model = new PartyListModel();
                                    model.setPartyName(resultSet.getString("name"));
                                    model.setPartyCode(resultSet.getString("code"));
//                                model.setCity(resultSet.getString("city"));
                                    try {
                                        model.setPartyType(resultSet.getString("party_type"));
                                    } catch (Exception e) {
//                                          U.errorLog(e.getMessage());
                                    }
                                    partyListmodel.add(model);
                                } while (resultSet.next());
                            }
                            HashMap<String, List<PartyListModel>> mapOfList = new HashMap<String, List<PartyListModel>>();
                            mapOfList.put(entry.getKey(), partyListmodel);
                            U.log("key of smol=>>" + entry.getKey());
                            sideMenuObjectList.add(mapOfList);

                        } catch (Exception e) {
                            U.errorLog(e.getMessage());
                        }

                    }

                    String userListSql = "";
                    U.log("userListModel length=>" + userListModel.size());
                    try {
                        for (Map.Entry<String, TableDetailModel> entry : userListModel.entrySet()) {

                            TableDetailModel tableModel = entry.getValue();
                            String sqlText = tableModel.getSqlText();
                            String plsqlText = tableModel.getPlSqlText();

                            if (empCode == null) {
                                empCode = "";
                            }
                            if (empCode != null && empCode.contains("null")) {
                                empCode = "";
                            }

                            if (sqlText != null) {
                                sqlText = sqlText.replaceAll("EMPCODE", empCode).replaceAll("GEOORGCODE", geoOrgCode).replaceAll("LOGINID", loginId.toUpperCase());
                            }
                            if (plsqlText != null) {
                                plsqlText = plsqlText.replaceAll("EMPCODE", empCode).replaceAll("GEOORGCODE", geoOrgCode).replaceAll("LOGINID", loginId.toUpperCase());
                            }
                            U.log("SQL TEXT=>" + sqlText);
                            if (!loginFlag.contains("E") && plsqlText != null) {
                                userListSql = plsqlText;
                            } else {
                                userListSql = sqlText;
                            }

                        }
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }

                    try {
                        preparedStatement = c.prepareStatement(userListSql.toString());
                        resultSet = preparedStatement.executeQuery();
                        if (resultSet != null && resultSet.next()) {
                            do {
                                UserListModel model = new UserListModel();
                                model.setClient_name(resultSet.getString("name"));
                                model.setLoginId(resultSet.getString("code"));
//                                model.setCity(resultSet.getString("city"));
                                model.setParent_user(resultSet.getString("parent_user") != null ? resultSet.getString("parent_user") : "");
                                model.setPassword(resultSet.getString("password"));
                                System.out.println(model.getLoginId() + "--" + model.getClient_name() + "--" + model.getParent_user());
                                userList.add(model);
                            } while (resultSet.next());
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {

                    }

                }

                json.setUser_Detail(userList);
                json.setParty_Detail(partyList);
                json.setSideMenuObjectList(sideMenuObjectList);
                return json;
            }
        } catch (SQLException e) {
            U.errorLog(e.getMessage());
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    U.errorLog(e.getMessage());
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
                    + "lhssys_portal_table_dsc_update u where upper(u.module)='" + appType.toUpperCase()
                    + "' and upper(t.tab_id)='" + appType + "' order by u.seq_no");
            preparedStatement = c.prepareStatement(sql.toString());
            resultSet = preparedStatement.executeQuery();
            U.log("executed1=" + sql.toString());
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
                        model.setReportCount(getCountOfReport(userCode, userCode, resultSet.getString("sql_text"), ""));
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
            U.errorLog(e.getMessage());
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    U.errorLog(e.getMessage());
                }
            }
        }
        return json;
    }

    public String getCountOfReport(String user_code, String empCode, String sql_text, String loginId) {
        PreparedStatement ps = null;
        ResultSet rs;
        String count = "0";
        try {
            sql_text = sql_text.replace("USERCODE", user_code);
            sql_text = sql_text.replace("EMPCODE", empCode);
            sql_text = sql_text.replace("LOGINID", loginId);
//            U.log("getCountOf ENTRIES sql_tex : " + sql_text);
            System.out.println("getCount sql_text-----> " + sql_text);
            ps = c.prepareStatement(sql_text);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                count = rs.getString(1);
            }
        } catch (Exception e) {
            U.errorLog(e.getMessage());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    U.errorLog(e.getMessage());
                }
            }
        }
        return count;
    }

    public ArrayList<ReportCountModel> refreshRepCount(String user_code, String empCode, String loginId, String appType) {

        StringBuffer sql = new StringBuffer();
        sql.append("select u.*,t.view_mode  from lhssys_portal_tab_mast t, lhssys_portal_table_dsc_update u "
                + "where instr(upper(u.module),'#" + appType.toUpperCase() + "#')<>0 and upper(t.tab_id)='" + appType.toUpperCase() + "'"
                + "and u.status = 'T' order by u.tab_ordering_slno");
        System.out.println("refresh report count==" + sql);
        ArrayList<ReportCountModel> al = new ArrayList<ReportCountModel>();
        ResultSet rs = null;
        PreparedStatement ps = null;

        try {
            ps = c.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    ReportCountModel rp = new ReportCountModel();
                    rp.setRepCount(getCountOfReport(user_code, empCode, rs.getString("sql_text"), loginId));
                    rp.setSeq_no(rs.getString("seq_no"));
                    al.add(rp);
                } while (rs.next());
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }

        return al;
    }

}
