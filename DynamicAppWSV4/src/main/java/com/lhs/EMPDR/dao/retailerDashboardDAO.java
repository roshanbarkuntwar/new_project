/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.TableDetailJSON;
import com.lhs.EMPDR.Model.HeadingValueOfTable;
import com.lhs.EMPDR.Model.ListOfApprovalsModel;
import com.lhs.EMPDR.Model.PartyListModel;
import com.lhs.EMPDR.Model.TableDetailModel;
import com.lhs.EMPDR.Model.ValueClassModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.time.temporal.TemporalQueries;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author kirti.misal
 */
public class retailerDashboardDAO {

    Connection con;

    public retailerDashboardDAO(Connection con) {
        this.con = con;
        U u = new U(this.con);
    }

    public TableDetailJSON getRetailerDashboardInfo(String seqNo, String accCode, String empCode, String userCode) {
        String defualtPopulateData = "";
        String displayClause = "";
        TableDetailJSON allTab = new TableDetailJSON();
        List<TableDetailModel> list = new ArrayList<TableDetailModel>();
        String viewMode = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        String listOfApprovalsQuery = "";
        List<ListOfApprovalsModel> approvalsList = new ArrayList<ListOfApprovalsModel>();

        String parentSql = "select * from lhssys_portal_table_dsc_update where seq_no=" + seqNo + " or seq_no like '%" + seqNo + ".%' order by seq_no";
        U.log("parentsql=" + parentSql);
        try {
            ps = con.prepareStatement(parentSql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    U.log("seqN0" + rs.getString("seq_no"));
                    if (!rs.getString("seq_no").contains(".")) {
                        defualtPopulateData = rs.getString("default_populate_data");
                        displayClause = rs.getString("display_clause");
                    } else {
                        TableDetailModel model = new TableDetailModel();
//                        viewMode = rs.getString("view_Mode");
                        model.setDATA_UPLOAD(rs.getString("DATA_UPLOAD"));
                        model.setDisplay_clause(rs.getString("Display_clause"));
                        model.setDuplicate_row_value_allow(rs.getString("Duplicate_row_value_allow"));
                        model.setExcel_template(rs.getString("Excel_template"));
                        model.setList_columns_order_by(rs.getString("List_columns_order_by"));
                        model.setList_columns_update(rs.getString("List_columns_update"));
                        model.setMandatory_to_start_portal(rs.getString("Mandatory_to_start_portal"));
                        model.setOrder_clause(rs.getString("Order_clause"));
                        model.setPortlet_Id(rs.getString("Portlet_Id"));
                        model.setReplicate_fields(rs.getString("Replicate_fields"));
                        model.setReplicate_rec(rs.getString("Replicate_rec"));
                        model.setStatus(rs.getString("Status"));
                        model.setTable_desc(rs.getString("Table_desc"));
                        model.setTable_name(rs.getString("Table_name"));
                        model.setUnique_clause(rs.getString("Unique_clause"));
                        model.setUnique_message(rs.getString("Unique_message"));
                        model.setUpdate_key(rs.getString("Update_key"));
                        model.setUpdation_process(rs.getString("Updation_process"));
                        model.setUpdation_typ(rs.getString("Updation_typ"));
                        model.setWhere_clause(rs.getString("Where_clause"));
                        model.setFirstScreen(rs.getString("first_screen"));
                        model.setSeqNo(rs.getString("seq_no"));
                        model.setAccess_contrl(rs.getString("access_control"));
                        model.setScreen_orientation_view(rs.getString("screen_orientation_view"));
                        model.setDefault_populate_data(rs.getString("default_populate_data"));
                        model.setOffline_flag_app_run(rs.getString("Offline_flag_app_run"));
                        model.setData_save_client_app(rs.getString("Data_save_client_app"));
                        model.setDependent_next_entry_seq(rs.getString("DEPENDENT_NEXT_ENTRY_SEQ"));
                        model.setEmail_send_condition(rs.getString("EMAIL_SEND_CONDITION"));
                        model.setEmail_subject(rs.getString("EMAIL_SUBJECT"));
                        model.setReportCount(getCountOfReport(userCode, rs.getString("sql_text")));
                        InputStream imgstream = null;
                        if (rs.getBlob("icon_image") != null) {
                            imgstream = rs.getBlob("icon_image").getBinaryStream();
                            model.setImage(Util.getImgstreamToBytes(imgstream));
                        } else {
                            imgstream = getClass().getResourceAsStream("/defualtDp.png");
                            model.setImage(Util.getImgstreamToBytes(imgstream));
                        }
                        list.add(model);
                    }

                } while (rs.next());
                allTab.setTable_Detail(list);
                allTab.setView_mode(viewMode);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {

        }

        //for party list
        List<PartyListModel> partyList = new ArrayList<PartyListModel>();
        U.log("empCode : " + empCode);
        if (empCode != null) {
            String partyListSql = "select acc_code, DECODE(A.ACC_TYPE, 'O', 'B', 'P') PARTY_TYPE, acc_name||DECODE(A.city, null, null,' (')||city||DECODE(A.city, null, null, ')') party  from acc_mast A where emp_code='" + empCode + "' or broker_code='" + empCode + "' order by acc_name";
            U.log("partyListSql SQL : " + partyListSql);
            try {
                PreparedStatement preparedStatement = con.prepareStatement(partyListSql.toString());
                ResultSet resultSet = preparedStatement.executeQuery();
                if (resultSet != null && resultSet.next()) {
                    do {
                        PartyListModel model = new PartyListModel();
                        model.setPartyName(resultSet.getString("party"));
                        model.setPartyCode(resultSet.getString("acc_code"));
                        model.setPartyType(resultSet.getString("party_type"));
                        partyList.add(model);
                    } while (resultSet.next());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        allTab.setParty_Detail(partyList);

        /*
        for defualtVlaue display on dashboard
         */
        if (displayClause != null) {
            try {
                ps = con.prepareStatement(displayClause);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    allTab.setDisplayValue(rs.getString(1));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        /*
        defualt list populated on dashboard
         */
        if (defualtPopulateData != null) {
            try {
                listOfApprovalsQuery = defualtPopulateData;
                if (listOfApprovalsQuery != null) {
                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("'ACCCODE'", "'" + accCode + "'").replace(";", "");

                    listOfApprovalsQuery = listOfApprovalsQuery.replaceAll("EMPCODE", empCode);
                    SimpleDateFormat formatter = new SimpleDateFormat("MM-dd-yyyy");
                    U.log("listOfApprovalsQuery : " + listOfApprovalsQuery);
                    ps = con.prepareStatement(listOfApprovalsQuery);
                    rs = ps.executeQuery();
                    if (rs != null && rs.next()) {
                        do {
                            ListOfApprovalsModel model = new ListOfApprovalsModel();
                            try {
                                model.setTotalqty(rs.getString("totalqty"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setExecutedqty(rs.getString("Executedqty"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setBalancedqty(rs.getString("Balancedqty"));
                            } catch (Exception e) {

                            }

                            try {
                                model.setDueDate(rs.getString("validupto_date"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setQty(rs.getString("AqtyORDER"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setAccCode(rs.getString("Acc_Code"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setAccName(rs.getString("acc_name"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setAmendno(rs.getString("amendno"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setAmount(rs.getString("amount"));
                            } catch (Exception e) {

                            }

                            try {
                                model.setDivCode(rs.getString("div_code"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setEntityCode(rs.getString("entity_code"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setRefNo(rs.getString("refno"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setTnature(rs.getString("tnature"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setUserCode(rs.getString("user_code"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setVrDate(rs.getString("vrdate"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setVRNO(rs.getString("vrno"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setbHeadings(rs.getString("bheading"));
                            } catch (Exception e) {

                            }
                            try {
                                model.settCode(rs.getString("tcode"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setTruckNo(rs.getString("truckno"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setDriverName(rs.getString("driverName"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setMobNo(rs.getString("mobileNo"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setQtyIssued(rs.getString("qtyissued"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setListFor(rs.getString("listfor"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setAddress(rs.getString("address"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setPartyType(rs.getString("party_type"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setCity(rs.getString("city"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setAction(rs.getString("action"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setRemark(rs.getString("remark"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setStatus(rs.getString("status"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setActionDate(rs.getString("actionDate"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setActionBy(rs.getString("actionBy"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setActionRemark(rs.getString("actionRemark"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setCategory(rs.getString("category"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setContact_person(rs.getString("contact_person"));
                            } catch (Exception e) {

                            }
                            try {
                                model.setRowid_seq(rs.getString("rowid_seq"));
                            } catch (Exception e) {

                            }

                            approvalsList.add(model);
                        } while (rs.next());
                    } else {
                    }
                }
            } catch (Exception e) {
                U.errorLog(e);
            } finally {

            }
        }
        allTab.setApprovalsList(approvalsList);

        /*
        for today date
         */
        String sysdate = "";
        String sqldate = "select sysdate from dual";
        try {
            ps = con.prepareStatement(sqldate);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                sysdate = rs.getString(1);
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                    con.close();
                    con = null;
                } catch (SQLException e) {
                    U.errorLog(e);
                }
            }
        }
        allTab.setTodayDate(sysdate);
        return allTab;
    }

    public String getCountOfReport(String user_code, String sql_text) {
        PreparedStatement ps = null;
        ResultSet rs;
        String count = "0";
        try {
            sql_text = sql_text.replace("user_code", user_code);
//            U.log("getCountOf ENTRIES sql_tex : " + sql_text);
            ps = con.prepareStatement(sql_text);
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
                    U.errorLog(e);
                }
            }
        }
        return count;
    }


//    public int dateBookCheck(String entityCode, String seqId, String accCode, String selDate) {
//
//        int count = 0;
//        String sql = "Select * from LHSSYS_PORTAL_DATA_DSC_UPDATE where SEQ_NO=" + seqId;
//        U.log("sql=>" + sql);
//        PreparedStatement ps = null;
//        ResultSet rs = null;
//        String table_name = "";
//        String columnValidate="";
//        try {
//            ps = con.prepareStatement(sql);
//            rs = ps.executeQuery();
//            if (rs != null && rs.next()) {
//                do {
//                    table_name = rs.getString("TABLE_NAME");
//                    columnValidate = rs.getString("Column_Validate");
//                } while (rs.next());
//            }
//            columnValidate.replace("REPLACEDATE", selDate);
//            columnValidate.replace("REPLACEUSERCODE", accCode);
//            columnValidate.replace("REPLACEENTITYCODE", entityCode);
//            U.log("Replace Query---->"+columnValidate);
//        } catch (Exception e) {
//            U.log("EXception  " + e);
//        } finally {
//            if (ps != null) {
//                try {
//                    ps.close();
//                } catch (SQLException e) {
//                    U.log(e);
//                }
//            }
//        }
//        try {
//            
//        } catch (Exception e) {
//
//        } finally {
//            if (ps != null) {
//                try {
//                    ps.close();
//                } catch (SQLException e) {
//                    U.log(e);
//                }
//            }
//        }
//        return count;
//    }


    public String getNextSeqId(String seqNo, String column_name) {
       
       PreparedStatement pst=null;
       ResultSet rs = null;
        String result=null;
       String query ="select column_default_value  from lhssys_portal_data_dsc_update t where t.seq_no='"+seqNo+"' and t.column_name='"+column_name+"'";
       ValueClassModel valueModel = new ValueClassModel();
       try{
           pst = con.prepareStatement(query);
           rs =pst.executeQuery();
           if(rs!=null&&rs.next()){
             valueModel.setValue(rs.getString("column_default_value"));
           }
         result= getSeqNo(valueModel.getValue());
           
       }catch(Exception e){
           e.printStackTrace();
       }
        return result;
        
    }
    
    
    public String getSeqNo(String q)
    {
        PreparedStatement ps = null;
        ResultSet rs = null;
          String result =null;  
        String query="select " +q+ " from dual";
//        U.log("query :"+query);
        try{
           ps = con.prepareStatement(query);
           rs = ps.executeQuery();
           if(rs.next()&& rs!=null)
           {
              result = rs.getString("nextval");
           }
        }catch(Exception e){
            e.printStackTrace();
        } 
      return result;  
    }

}
