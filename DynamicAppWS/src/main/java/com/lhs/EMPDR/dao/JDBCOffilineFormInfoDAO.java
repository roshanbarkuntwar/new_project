/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.OfflineFormJSON;
import com.lhs.EMPDR.JSONResult.RecordInfoJSON;
import com.lhs.EMPDR.JSONResult.TableDetailJSON;
import com.lhs.EMPDR.Model.OfflineFormInfoModel;
import com.lhs.EMPDR.Model.TableDetailModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCOffilineFormInfoDAO {

    Connection c;

    public JDBCOffilineFormInfoDAO(Connection c) {
        this.c = c;
    }

    public OfflineFormJSON offlineTableDetail(String entity, String appType, String userCode, String accCode, String searchText, String sqlFlag) {
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String viewMode = "";
        HashSet<String> seqNoSet = new HashSet<String>();
        OfflineFormJSON json = new OfflineFormJSON();
        OfflineFormInfoModel OffFormmodel = new OfflineFormInfoModel();
        List<TableDetailModel> list = new ArrayList<TableDetailModel>();
        try {

            StringBuffer sql = new StringBuffer();
//            sql.append("select view_mode,default_populate_data,access_control,screen_orientation_view,sql_text,seq_no,table_name,table_desc,updation_typ,updation_process,Duplicate_row_value_allow,update_key,where_clause,order_clause,status,mandatory_to_start_portal,display_clause,unique_clause,unique_message,replicate_rec,");
//            sql.append("replicate_fields,portlet_Id,List_columns_update,list_columns_order_by,update_key,DATA_UPLOAD,excel_template,first_screen,icon_image,portlet_id from lhssys_portal_table_dsc_update u where upper(module)='" + appType.toUpperCase() + "' order by seq_no");
            sql.append("select u.*,t.view_mode  from lhssys_portal_tab_mast t, lhssys_portal_table_dsc_update u where "
                    //                    + " upper(u.module)='" + appType.toUpperCase() + "' "
                    + " instr(u.module,'" + appType.toUpperCase() + "')>0 "
                    + "and upper(t.tab_id)='" + appType + "'"
                            + "and u.Offline_flag_app_run = 'T' order by u.seq_no");

            preparedStatement = c.prepareStatement(sql.toString());
            resultSet = preparedStatement.executeQuery();
            U.log("executed1=" + sql.toString());
            JDBCDisplayNewEntryDAO dao = new JDBCDisplayNewEntryDAO(c);
            if (resultSet != null && resultSet.next()) {
                //  U.log("helll");
                do {
                    if (resultSet.getString("Offline_flag_app_run").contains("T")) {
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
                        seqNoSet.add(resultSet.getString("seq_no"));
                        model.setAccess_contrl(resultSet.getString("access_control"));
                        model.setScreen_orientation_view(resultSet.getString("screen_orientation_view"));
                        model.setDefault_populate_data(resultSet.getString("default_populate_data"));
                        model.setOffline_flag_app_run(resultSet.getString("Offline_flag_app_run"));
                        model.setData_save_client_app(resultSet.getString("Data_save_client_app"));
                        // model.setReportCount(dao.getCountReporingType(resultSet.getString("seq_no"),userCode));
                        model.setReportCount(getCountOfReport(userCode, resultSet.getString("sql_text")));
                        InputStream imgstream = null;
                        if (resultSet.getBlob("icon_image") != null) {
                            imgstream = resultSet.getBlob("icon_image").getBinaryStream();
                            model.setImage(Util.getImgstreamToBytes(imgstream));
                        } else {
                            imgstream = getClass().getResourceAsStream("/defualtDp.png");
                            model.setImage(Util.getImgstreamToBytes(imgstream));
                        }

                        //  model.setImage(resultSet.getBytes("image"));
                        list.add(model);
                    }
                } while (resultSet.next());

                OffFormmodel.setTable_Detail(list);
                OffFormmodel.setView_mode(viewMode);

            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        JDBCGetRecordDetailDAO record_obj = new JDBCGetRecordDetailDAO(c);
        List< RecordInfoJSON> addFormData = new ArrayList<RecordInfoJSON>();
        Iterator<String> itr = seqNoSet.iterator();
        U.log("Size of hashset===" + seqNoSet.size());
        while (itr.hasNext()) {
            String seqNo = itr.next();
            U.log("itr.next()====" + seqNo);
            RecordInfoJSON addForm = new RecordInfoJSON();
            try {
                addForm = record_obj.recordsDetail(entity, seqNo, userCode, accCode, searchText, sqlFlag);
            } catch (Exception e) {
                e.printStackTrace();
            }
            addFormData.add(addForm);
        }
        OffFormmodel.setAddFormData(addFormData);
        json.setOfflineFormInfo(OffFormmodel);

        return json;
    }

    public String getCountOfReport(String user_code, String sql_text) {
        PreparedStatement ps = null;
        ResultSet rs;
        String count = "0";
        try {
            sql_text = sql_text.replace("user_code", user_code);
            U.log("sql_text====" + sql_text);
            ps = c.prepareStatement(sql_text);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                count = rs.getString(1);
            }
        } catch (Exception e) {

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
