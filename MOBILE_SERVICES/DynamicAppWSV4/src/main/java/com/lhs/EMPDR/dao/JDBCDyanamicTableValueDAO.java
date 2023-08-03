/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.HeadingValueOfTable;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 *
 * @author kirti.misal
 */
public class JDBCDyanamicTableValueDAO {

    Connection con;
    Util utl = new Util();

    public JDBCDyanamicTableValueDAO(Connection con) {
        this.con = con;
        U u = new U(this.con);
    }

    public HeadingValueOfTable getdyanamicTableHV(String entityCode, String seqId, String accCode, String isChildSeq, String consigneeCode, String divCode) {
        ArrayList<String> heading = new ArrayList<String>();
        ArrayList<ArrayList<String>> value = new ArrayList<ArrayList<String>>();
        Map<String, BigDecimal> totalIndex = new LinkedHashMap<String, BigDecimal>();
        Map<String, String> totalIndexFormatted = new LinkedHashMap<String, String>();

        String acc_year = "";
        String yrbegdate = "";
        String yrenddate = "";

        HeadingValueOfTable HT = new HeadingValueOfTable();
//        if (isChildSeq.equalsIgnoreCase("true")) {
//            seqId = seqId + ".1";
//        }
        entityCode = !utl.isNull(entityCode) ? entityCode : "";
        accCode = !utl.isNull(accCode) ? accCode : "";
        try {
            PreparedStatement ps1 = con.prepareStatement("SELECT acc_year,to_char(a.yrbegdate,'dd-MON-rrrr') ,to_char(a.yrenddate,'dd-MON-rrrr') FROM ACC_YEAR_MAST A "
                    + " WHERE to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') ) between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ");
            ResultSet rs = ps1.executeQuery();
            if (rs != null && rs.next()) {
                acc_year = rs.getString(1);
                yrbegdate = rs.getString(2);
                yrenddate = rs.getString(3);
            }
        } catch (Exception e) {
        }

        String sql = "Select * from lhssys_alert_direct_email where seq_Id=" + seqId;
        U.log("sql=>" + sql);
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            ps = con.prepareStatement(sql);
            rs = ps.executeQuery();

            int count = 0;
            if (rs != null && rs.next()) {

                String sqlText = rs.getString("SQL_TEXT");
                HT.setPageHeading(rs.getString("alert_desc"));

                sqlText = sqlText.replaceAll("ACCCODE", accCode).replaceAll("ENTITYCODE", entityCode);
                sqlText = sqlText.replaceAll("'CONSIGNEE_CODE'", "'" + consigneeCode + "'").replaceAll("'DIV_CODE'", "'" + divCode + "'");
                sqlText = sqlText.replaceAll("ACCYEAR", acc_year).replaceAll("YRBEGDATE", yrbegdate).replaceAll("YRENDDATE", yrenddate);

                U.log("sqlText=>" + sqlText);
                String pl_sql_text = "";
                String sql_text = "";
                if (sqlText.contains("~") && !sqlText.isEmpty() && !sqlText.equals("")) {
                    String[] sqlArray = sqlText.split("~");
                    pl_sql_text = sqlArray[0];
                    sql_text = sqlArray[1];
                } else {
                    sql_text = sqlText;
                }

                if (pl_sql_text != null && !pl_sql_text.equals("")) {
                    System.out.println("PL_SQL_TEXT: " + pl_sql_text);
                    PreparedStatement ps1 = con.prepareStatement(pl_sql_text);
                    int rs1 = ps1.executeUpdate();
                }

                if (sql_text != null) {
                    System.out.println("SQL_TEXT: " + sql_text);
                    ps = con.prepareStatement(sql_text);
                    rs = ps.executeQuery();
                    ResultSetMetaData rsmd = ps.getMetaData();
                    int columncount = 0;
                    columncount = rsmd.getColumnCount();
                    U.log("columncount=>" + columncount);
                    if (rs != null && rs.next()) {
                        do {
                            if (count == 0) {
                                for (int clmnCount = 1; clmnCount <= columncount; clmnCount++) {
                                    U.log("heading=>" + rs.getString(clmnCount));
                                    if (rs.getString(clmnCount).equalsIgnoreCase("0")) {
                                        heading.add("Sr No.#R#100#F");
                                    } else {
                                        String headingArr[] = rs.getString(clmnCount).split("#");
                                        if (headingArr[3].contains("T")) {
                                            totalIndex.put(Integer.toString(clmnCount), new BigDecimal(0));
                                        }
                                        heading.add(rs.getString(clmnCount));
                                    }
                                }
                            } else {
                                ArrayList<String> rowValue = new ArrayList<String>();
                                for (int clmnCount = 1; clmnCount <= columncount; clmnCount++) {
                                    for (Map.Entry<String, BigDecimal> e : totalIndex.entrySet()) {
                                        String key1 = e.getKey();
                                        BigDecimal value1 = e.getValue();
                                        if (key1.equals(Integer.toString(clmnCount))) {
                                            U.log("  aa  " + rs.getString(clmnCount).trim().replace(",", ""));
                                            String val1 = rs.getString(clmnCount).trim().replace(",", "");
                                            value1 = value1.add(new BigDecimal(val1));
                                            totalIndex.put(key1, value1);
                                        }
                                    }
//                                    U.log("value=>" + rs.getString(clmnCount));
                                    rowValue.add(rs.getString(clmnCount));
                                }
                                value.add(rowValue);
                            }
                            count++;
                        } while (rs.next());
                    }
                }
            }
            for (Map.Entry<String, BigDecimal> e : totalIndex.entrySet()) {
                String key1 = e.getKey();
                BigDecimal value1 = e.getValue();
                DecimalFormat decimalFormat = new DecimalFormat("#,###");
                String formatedValue = decimalFormat.format(value1);
                totalIndexFormatted.put(key1, formatedValue);
            }
        } catch (Exception e) {
            e.printStackTrace();
            U.errorLog("EXception  " + e);
        }

        HT.setHeading(heading);
        HT.setValue(value);
        HT.setTotalValue(totalIndexFormatted);
        return HT;
    }

}
