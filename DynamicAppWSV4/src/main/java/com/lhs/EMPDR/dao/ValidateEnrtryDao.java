/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author anjali.bhendarkar
 */
public class ValidateEnrtryDao {

    Connection connection;

    public ValidateEnrtryDao(Connection con) {
        this.connection = con;
        U u = new U(this.connection);
    }

    public HashMap<String, Object> validateEnrtry(String userCode, String seqNo, String filterParam, String userFlag) {
        HashMap<String, Object> returnObj = new HashMap<String, Object>();

        String sql = "SELECT execute_pre_insert_java FROM LHSSYS_PORTAL_TABLE_DSC_UPDATE U  where u.seq_no='" + seqNo + "' ";
        PreparedStatement ps = null;
        ResultSet resultSet = null;
        String plsqlText = "";
        String returnRes = "T#OK";
        System.out.println("SQL : " + sql);
        System.out.println("FILTER PARAM : " + filterParam);
        try {
            ps = connection.prepareStatement(sql);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                plsqlText = resultSet.getString("execute_pre_insert_java");

            }

            if (plsqlText != null && !plsqlText.isEmpty() && plsqlText != "") {
                String replaceValue = "";
                if (filterParam != null && !filterParam.isEmpty()) {

                    if (filterParam.contains("~~")) {
                        replaceValue = filterParam.split("~~")[1];
                        filterParam = filterParam.split("~~")[0];
                    }

                    String[] filterArr = filterParam.split("##");

                    for (int i = 0; i < filterArr.length; i++) {
                        plsqlText = plsqlText.replace("'COL" + i + "'", "'" + filterArr[i] + "'");
                        plsqlText = plsqlText.replace("'VALUE'", "'" + replaceValue + "'");
                    }

                }
                plsqlText = plsqlText.replaceAll("USER_FLAG", userFlag);

                try {
                    U.log("validateEnrtry plsqlText:--> " + plsqlText);
                    PreparedStatement ps1 = connection.prepareStatement(plsqlText);
                    int n = ps1.executeUpdate();
                    if (n >= 0) {
                        System.out.println(n + " row inserted.");
                    } else {
                    }
                } catch (SQLException e) {

                    System.out.println("exeception 3---> " + e.getMessage());
                    try {
                        String returnMessage = "";
                        String[] returnMessageArr;
                        returnMessage = e.getMessage();
                        System.out.println("returnMessage : " + returnMessage);
                        returnMessageArr = returnMessage.split(":");
                        returnMessage = returnMessageArr[1];
//                        System.out.println("execute_after_update result  e.getMessage() : " + e.getMessage());
                        returnMessage = returnMessage.replaceAll("ORA-06512", "");
//                        System.out.println("returnMessage : " + returnMessage);
                        returnRes = returnMessage.trim();
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                }
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        System.out.println("returnMessage--> " + returnRes);
        returnObj.put("status", returnRes.split("#")[0]);
        returnObj.put("msg", returnRes.split("#")[1]);
        returnObj.put("returnRes", returnRes);
        return returnObj;
    }
    
    public HashMap<String,String> validateExist(String validateQuery,String value){
        HashMap<String,String> status = new HashMap<String, String>();
        PreparedStatement ps = null;
        validateQuery = validateQuery.replaceAll("value", value.trim());
        System.out.println("validateQuery == >" + validateQuery);
        try {
             ps = this.connection.prepareStatement(validateQuery);
             ResultSet rset = ps.executeQuery();
             if(rset !=null && rset.next()){
                 status.put("status", "exist");
             }else{
                 status.put("status", "not exist");
             }
        } catch (SQLException ex) {
             status.put("status", "exception in executing query");
             ex.printStackTrace();
        }finally{
            if(ps !=null){
                try {
                    ps.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }
        
        
        return status;
    }

}
