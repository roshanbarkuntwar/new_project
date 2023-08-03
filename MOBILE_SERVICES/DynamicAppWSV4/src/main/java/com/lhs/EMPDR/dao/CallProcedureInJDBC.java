/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.utility.GenerateNotification;
import com.lhs.EMPDR.utility.SendEmail;
import com.lhs.EMPDR.utility.U;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 *
 * @author kirti.misal
 */
public class CallProcedureInJDBC {

    Connection con;
    CallableStatement callableStatement = null;

    public CallProcedureInJDBC(Connection con) {
        this.con = con;
        U u = new U(this.con);
    }

    public String callProcedure(int headseqID, String accYear, boolean isSendMail, boolean isPushNotif, String seqNo, String json) {
        String vrno = "";
        PreparedStatement ps = null;
        ResultSet rs = null;
        JSONObject jsonObj = null;
        
        try {
            CallableStatement proc = con.prepareCall("{ ? = call insert_process_web_data(" + headseqID + ") }");
            System.out.println("headseqID===" + headseqID);
            proc.registerOutParameter(1, java.sql.Types.VARCHAR);
            proc.execute();
            String returnValue = proc.getString(1);
            U.log(returnValue + "==resultset is null==" + (proc == null));
            vrno = returnValue;
            System.out.println("order vrno json : = "+ json);
            try {
                JSONArray listJsonArray = new JSONArray();
                JSONParser json_parser = new JSONParser();
                JSONObject listjson = (JSONObject) json_parser.parse(json);
                listJsonArray = (JSONArray) listjson.get("list");
                jsonObj = (JSONObject) json_parser.parse(listJsonArray.get(0).toString());
//                JSONArray jsonArray = (JSONArray) jsonObj.get("recordsInfo");
//                jsonArray.add(new JSONObject().put("VRNO", vrno.split("#")[1]));
//               json_obj = (JSONObject) new JSONObject().put("recordsInfo", jsonArray);
////                json_obj = (JSONObject) jsonArray.get(0);
                U.log("json array===>"+jsonObj);
                
//                json_obj = (JSONObject)json_obj.put("VRNO", vrno.split("#")[1]);
//                U.log("json array2===>"+json_obj);
            } catch (Exception ex) {
                U.log("json object exception");
                ex.printStackTrace();
            }
            if (isPushNotif == true) {
                GenerateNotification genNotif = new GenerateNotification(con);
                genNotif.sendNotification(jsonObj, seqNo, vrno.split("#")[1]);
            }
            if (isSendMail == true) {

                SendEmail se = new SendEmail(con);

                String query = "select * from temp_head_tran_web t where t.SEQ_ID= '" + headseqID + "'";
                ps = con.prepareStatement(query);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    se.sendEmail(vrno.split("#")[1], rs.getString("tcode"), rs.getString("entity_code"), accYear);
                }
            }
//            System.out.println("");

        } catch (Exception e) {
            U.log("call procedure exception");
            e.getMessage();
        } finally {
            try {
                con.close();
                if (rs != null) {
                    rs.close();
                }

            } catch (Exception ex) {
                Logger.getLogger(CallProcedureInJDBC.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return vrno;
    }

    public String callAddonCalculationProcedure(int headseqID, String flag) {
        U.log("seqId==>>" + headseqID + "flag==" + flag);
        String getDBUSERByUserIdSql = "declare\n"
                + "v_out VARCHAR2(500);\n"
                + "begin v_out := update_addon_val_itemtran_web(" + headseqID + ",''," + flag + "); end;\n"
                + "";
        U.log(getDBUSERByUserIdSql + "===seqId==>>" + headseqID);
        String result = "";
        try {

            PreparedStatement ps = con.prepareStatement(getDBUSERByUserIdSql);
            ResultSet rs = ps.executeQuery();
            if (rs != null) {
                result = "success";
            }
            result = "success";
        } catch (Exception e) {
            e.printStackTrace();
            result = "error";
        } finally {
            try {
                con.close();
            } catch (SQLException ex) {
                Logger.getLogger(CallProcedureInJDBC.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        return result;
    }

}
