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
import java.util.ArrayList;
import java.util.HashMap;

/**
 *
 * @author anjali.bhendarkar
 */
public class DynamicDashboardDAO {

    Connection con;

    public DynamicDashboardDAO(Connection c) {
        this.con = c;
        U u = new U(this.con);
    }

    public HashMap<String, Object> getTextBandAttribute(String seqNo, String acc_code, String entity_code, String geo_org_code) {
        HashMap<String, Object> result = new HashMap<String, Object>();

        String sql = "SELECT * FROM LHSSYS_ALERT_DIRECT_EMAIL E where e.seq_id='" + seqNo + "' ORDER BY E.SEQ_ID  ";

        PreparedStatement ps;
        ResultSet rs;
        ArrayList<String> color = new ArrayList<String>();
        ArrayList<String> fontSize = new ArrayList<String>();
        ArrayList<String> alignment = new ArrayList<String>();
        ArrayList<String> textVal = new ArrayList<String>();

        String valsql = "";
        String color_code_format = "";
        try {

//            U.log("sql---> " + sql);
            ps = con.prepareStatement(sql);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                int colCount = rs.getInt("no_of_column");
                valsql = rs.getString("sql_text");
                color_code_format = rs.getString("color_code_format");

                try {
                    valsql = valsql.replaceAll("'ACC_CODE'", "'" + acc_code + "'");
                    valsql = valsql.replaceAll("'ACCCODE'", "'" + acc_code + "'");
                    valsql = valsql.replaceAll("'ENTITY_CODE'", "'" + entity_code + "'");
                    valsql = valsql.replaceAll("'GEOORGCODE'", "'" + geo_org_code + "'");
                    U.log("TextBand sql---> " + sql);
                    U.log("TextBand valsql---> " + valsql);
                    PreparedStatement ps1 = con.prepareStatement(valsql);
                    ResultSet rs1 = ps1.executeQuery();

                    if (rs1 != null && rs1.next()) {
                        do {
                            textVal.add(rs1.getString(1));
                        } while (rs1.next());
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }

                for (int i = 1; i <= colCount; i++) {
                    color.add(rs.getString("heading" + i));
                    fontSize.add(rs.getString("head_width" + i));
                    alignment.add(rs.getString("data_type" + i));
                }

            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        result.put("color", color);
        result.put("fontSize", fontSize);
        result.put("alignment", alignment);
        result.put("textVal", textVal);
        result.put("background_color", color_code_format);

//        heading1
        return result;
    }

    public HashMap<String, Object> getKpiAttribute(String seqNo, String acc_code, String entity_code, String geo_org_code, String user_code, String emp_code) {
        HashMap<String, Object> result = new HashMap<String, Object>();

        String sql = "SELECT * FROM LHSSYS_ALERT_DIRECT_EMAIL E where e.seq_id='" + seqNo + "' ORDER BY E.SEQ_ID  ";

        PreparedStatement ps;
        PreparedStatement prepS = null;
        ResultSet rs;
        ArrayList<String> color = new ArrayList<String>();
        ArrayList<String> fontSize = new ArrayList<String>();
        ArrayList<String> alignment = new ArrayList<String>();
        ArrayList<String> textVal = new ArrayList<String>();
        String KPI_LABEL = "";

        String valsql = "";
        String valsql2 = "";
        String color_code_format = "";
        try {

//            U.log("sql---> " + sql);
            ps = con.prepareStatement(sql);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                KPI_LABEL = rs.getString("alert_desc");
                System.out.println("KPI - " + KPI_LABEL);
                int colCount = rs.getInt("no_of_column");
                valsql = rs.getString("sql_text");
                valsql2 = (rs.getString("pl_sql_text") != null) ? rs.getString("pl_sql_text") : null;
                System.out.println("kpi prcedure==>"+valsql2);
                try {
                    if (valsql2 != null && (valsql2.contains("Begin") || valsql2.contains("begin") || valsql2.contains("BEGIN"))) {
                        valsql2 = valsql2.replaceAll("'ACC_CODE'", "'" + acc_code + "'");
                        valsql2 = valsql2.replaceAll("'ACCCODE'", "'" + acc_code + "'");
                        valsql2 = valsql2.replaceAll("'ENTITY_CODE'", "'" + entity_code + "'");
                        valsql2 = valsql2.replaceAll("'GEOORGCODE'", "'" + geo_org_code + "'");
                        valsql2 = valsql2.replaceAll("'USERCODE'", "'" + user_code + "'");
                        valsql2 = valsql2.replaceAll("'EMPCODE'", "'" + emp_code + "'");
                        System.out.println("kpi prcedure==>"+valsql2);
                         prepS = null;
                        prepS = con.prepareStatement(valsql2);
                        int i = prepS.executeUpdate();
                        if (i > 0) {
                            System.out.println("kpi procedure executed");
                        } else {
                            System.out.println("kpi procedure not executed");
                        }
                    }

                }catch(Exception ex){
                    ex.printStackTrace();
                }finally{
                    if(prepS!=null){
                        prepS.close();
                    }
                }

                color_code_format = rs.getString("color_code_format");

                try {
                    valsql = valsql.replaceAll("'ACC_CODE'", "'" + acc_code + "'");
                    valsql = valsql.replaceAll("'ACCCODE'", "'" + acc_code + "'");
                    valsql = valsql.replaceAll("'ENTITY_CODE'", "'" + entity_code + "'");
                    valsql = valsql.replaceAll("'GEOORGCODE'", "'" + geo_org_code + "'");
                    valsql = valsql.replaceAll("'USERCODE'", "'" + user_code + "'");
                    valsql = valsql.replaceAll("'EMPCODE'", "'" + emp_code + "'");
                    U.log("kpi sql---> " + sql);
                    U.log("kpi valsql---> " + valsql);
                    PreparedStatement ps1 = con.prepareStatement(valsql);
                    ResultSet rs1 = ps1.executeQuery();

                    if (rs1 != null && rs1.next()) {
                        do {
                            textVal.add(rs1.getString(1));
                        } while (rs1.next());
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }

                for (int i = 1; i <= colCount; i++) {
                    color.add(rs.getString("heading" + i));
                    fontSize.add(rs.getString("head_width" + i));
                    alignment.add(rs.getString("data_type" + i));
                }

            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        result.put("kpi_label", KPI_LABEL);
        result.put("color", color);
        result.put("fontSize", fontSize);
        result.put("alignment", alignment);
        result.put("textVal", textVal);
        result.put("background_color", color_code_format);

//        heading1
        return result;
    }

    public ArrayList<Object> getCollapseAttribute(String seqNo, String acc_code, String entity_code, String geo_org_code) {
        ArrayList result = new ArrayList<Object>();

        String sql = "SELECT * FROM LHSSYS_ALERT_DIRECT_EMAIL E where e.seq_id='" + seqNo + "' ORDER BY E.SEQ_ID  ";

        PreparedStatement ps;
        ResultSet rs;
//        ArrayList<String> color = new ArrayList<String>();
//        ArrayList<String> fontSize = new ArrayList<String>();
//        ArrayList<String> alignment = new ArrayList<String>();
//        ArrayList<String> textVal = new ArrayList<String>();

        String valsql = "";
        String color_code_format = "";
        try {

//            U.log("sql---> " + sql);
            ps = con.prepareStatement(sql);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                int colCount = rs.getInt("no_of_column");
                valsql = rs.getString("sql_text");
                color_code_format = rs.getString("color_code_format");

                try {
                    valsql = valsql.replaceAll("'ACC_CODE'", "'" + acc_code + "'");
                    valsql = valsql.replaceAll("'ACCCODE'", "'" + acc_code + "'");
                    valsql = valsql.replaceAll("'ENTITY_CODE'", "'" + entity_code + "'");
                    valsql = valsql.replaceAll("'GEOORGCODE'", "'" + geo_org_code + "'");
                    U.log("TextBand sql---> " + sql);
                    U.log("TextBand valsql---> " + valsql);
                    PreparedStatement ps1 = con.prepareStatement(valsql);
                    ResultSet rs1 = ps1.executeQuery();

                    if (rs1 != null && rs1.next()) {
                        do {
                            result.add(rs1.getString(1));
                        } while (rs1.next());
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }

//                for (int i = 1; i <= colCount; i++) {
//                    color.add(rs.getString("heading" + i));
//                    fontSize.add(rs.getString("head_width" + i));
//                    alignment.add(rs.getString("data_type" + i));
//                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

//        result.put("color", color);
//        result.put("fontSize", fontSize);
//        result.put("alignment", alignment);
//        result.put("textVal", textVal);
//        result.put("background_color", color_code_format);
//        heading1
        return result;
    }

}
