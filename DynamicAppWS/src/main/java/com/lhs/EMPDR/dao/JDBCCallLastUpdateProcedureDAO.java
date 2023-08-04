/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.utility.U;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.Set;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCCallLastUpdateProcedureDAO {

    Connection c;

    public JDBCCallLastUpdateProcedureDAO(Connection c) {
        this.c = c;
    }

    public String callProcedureLastupdate(String seq_id, String userCode, String entityCode, String divCode, String accYear) {
        String result = "Report data is not updated";

        CallableStatement callableStatement = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        String pl_sql = null;
        String empCode = "";
        String getEmpCodeSQL = "SELECT EMP_CODE FROM USER_MAST WHERE USER_CODE = '" + userCode + "'";
        try {
            ps = c.prepareStatement(getEmpCodeSQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                if (rs.getString(1) != null) {
                    empCode = rs.getString(1);
                } else {
                    empCode = "";
                }
            } else {
                empCode = "";
            }
        } catch (SQLException e) {
            System.out.println("exception ---> " + e.getMessage());
            return result;
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }

        String accYearBegDate = "";
        String accYearEndDate = "";
        String accYearSQL = "SELECT A.ACC_YEAR, TO_CHAR(A.YRBEGDATE), TO_CHAR(A.YRENDDATE) FROM ACC_YEAR_MAST A WHERE to_char(to_date(SUBSTR(sysdate, 1, 10),"
                + " 'dd-mm-yyyy')) between A.YRBEGDATE AND A.YRENDDATE AND ROWNUM =1 ORDER BY ACC_YEAR DESC";
        try {
            ps = c.prepareStatement(accYearSQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                accYear = rs.getString(1);
                accYearBegDate = rs.getString(2);
                accYearEndDate = rs.getString(3);
            }
        } catch (Exception e) {
        } finally {
            try {
                rs.close();
                ps.close();
            } catch (Exception e) {
            }
        }

        try {
            String sql = "select pl_sql_text from lhssys_alert_direct_email where seq_id=" + seq_id;
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                pl_sql = rs.getString("pl_sql_text");
            }

            if (pl_sql != null) {
                pl_sql = pl_sql.replaceAll("STR_ACC_CODE", userCode);
                pl_sql = pl_sql.replaceAll("STR_ENTITY_CODE", entityCode);
                pl_sql = pl_sql.replaceAll("STR_DIV_CODE", divCode);
                pl_sql = pl_sql.replaceAll("USERCODE", userCode);
                pl_sql = pl_sql.replaceAll("EMPCODE", empCode);
                pl_sql = pl_sql.replaceAll("STR_ACC_YEAR", accYear);
                pl_sql = pl_sql.replaceAll("YRBEGDATE", accYearBegDate);
                pl_sql = pl_sql.replaceAll("YRENDDATE", accYearEndDate);

                U.log("REPORT DATA REFRESH PLSQL   :   " + pl_sql);

                callableStatement = c.prepareCall(pl_sql);
                callableStatement.executeUpdate();
                result = "Report data is updated";
            }
        } catch (SQLException e) {
            System.out.println("exception ---> " + e.getMessage());
            return result;
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }
        return result;
    }

    public String filterRefreshReportData(String seq_id, String userCode, String entityCode,
            String divCode, String accYear, String filterDataJSON) throws ParseException {
        String result = "Report data is not updated";
        CallableStatement callableStatement = null;
        PreparedStatement ps = null;
        String pl_sql = null;
        String empCode = "";
        ResultSet rs = null;
        String getEmpCodeSQL = "SELECT EMP_CODE FROM USER_MAST WHERE USER_CODE = '" + userCode + "'";
        try {
            ps = c.prepareStatement(getEmpCodeSQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                empCode = rs.getString(1);
            }
        } catch (SQLException e) {
            System.out.println("exception ---> " + e.getMessage());
            return result;
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }

        String accYearBegDate = "";
        String accYearEndDate = "";
        String accYearSQL = "SELECT A.ACC_YEAR, TO_CHAR(A.YRBEGDATE), TO_CHAR(A.YRENDDATE) FROM ACC_YEAR_MAST A WHERE to_char(to_date(SUBSTR(sysdate, 1, 10),"
                + " 'dd-mm-yyyy')) between A.YRBEGDATE AND A.YRENDDATE AND ROWNUM =1 ORDER BY ACC_YEAR DESC";
        try {
            ps = c.prepareStatement(accYearSQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                accYear = rs.getString(1);
                accYearBegDate = rs.getString(2);
                accYearEndDate = rs.getString(3);
            }
        } catch (Exception e) {
        } finally {
            try {
                rs.close();
                ps.close();
            } catch (Exception e) {
            }
        }

        try {
            String sql = "select pl_sql_text from lhssys_alert_direct_email where seq_id=" + seq_id;
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                pl_sql = rs.getString("pl_sql_text");
            }

            if (pl_sql != null && !pl_sql.equals(".")) {
                pl_sql = pl_sql.replaceAll("STR_ACC_CODE", userCode);
                pl_sql = pl_sql.replaceAll("STR_ENTITY_CODE", entityCode);
                pl_sql = pl_sql.replaceAll("STR_DIV_CODE", divCode);
                pl_sql = pl_sql.replaceAll("USERCODE", userCode);
                pl_sql = pl_sql.replaceAll("EMPCODE", empCode);
                pl_sql = pl_sql.replaceAll("STR_ACC_YEAR", accYear);
                pl_sql = pl_sql.replaceAll("YRBEGDATE", accYearBegDate);
                pl_sql = pl_sql.replaceAll("YRENDDATE", accYearEndDate);

//                System.out.println("jsonString==" + filterDataJSON);
                JSONParser json_parser = new JSONParser();
                JSONObject listjson = (JSONObject) json_parser.parse(filterDataJSON);
                Set keys = listjson.keySet();
                Iterator a = keys.iterator();
                String updateQuery = "update lhssys_alert_direct_email_para set column_value= case ";
                StringBuilder whenString = new StringBuilder();
                whenString.append(updateQuery);
                while (a.hasNext()) {
                    String key = (String) a.next();
                    String value = "";
                    if (listjson.get(key) != null) {
                        value = (String) listjson.get(key);
                    }

                    if (key.equalsIgnoreCase("ENTITY_CODE") && value.equalsIgnoreCase("All")) {
                        value = "";
                    }
                    whenString.append("when para_column='" + key + "' then '" + value + "' ");
                    if (pl_sql.contains("'" + key + "'")) {
                        pl_sql = pl_sql.replace("'" + key + "'", "'" + value + "'");
                    }
                }

                whenString.append(" else '' end where seq_id=" + seq_id);
                U.log("REPORT DATA REFRESH PLSQL WITH REPLACED VALUES   :   " + pl_sql);
                callableStatement = c.prepareCall(pl_sql);
                callableStatement.executeUpdate();
                result = "Report data is updated";

                ps = c.prepareStatement(whenString.toString());
//                int rowCount = ps.executeUpdate();

                String insertInUserQuery = " insert into LHSSYS_ALERT_DIRECT_EMAIL_USER ";
                String columns = "( seq_id,user_code,lastupdate";
                String values = "('" + seq_id + "','" + userCode + "',sysdate";

                String updateInUserQuery = " Update LHSSYS_ALERT_DIRECT_EMAIL_USER  set lastupdate = sysdate ";

                String sqlQueryText = " SELECT U.SLNO,U.para_Column FROM LHSSYS_ALERT_DIRECT_EMAIL_PARA U WHERE U.SEQ_ID = '"
                        + seq_id + "' ORDER BY U.SEQ_ID, U.SLNO ";
                ps = c.prepareStatement(sqlQueryText);
                rs = ps.executeQuery();

                if (rs != null && rs.next()) {
                    do {
                        String slno = rs.getString("SLNO");
                        String para_Column = rs.getString("para_Column");

                        Iterator b = keys.iterator();
                        while (b.hasNext()) {
                            String key = (String) b.next();
                            String value = "";
                            if (listjson.get(key) != null) {
                                value = (String) listjson.get(key);
                            }

                            if (para_Column.equalsIgnoreCase(key)) {

                                columns = columns + "," + " para_default_value" + slno;
                                values = values + "," + "'" + value + "' ";

                                updateInUserQuery = updateInUserQuery + ", " + " para_default_value" + slno + " = '" + value + "'";
                            }
                        }
                    } while (rs.next());
                }

                columns = columns + ")";
                values = values + ")";

                boolean inserFlag = false;
                String userQueryText = " SELECT * FROM LHSSYS_ALERT_DIRECT_EMAIL_USER U WHERE U.SEQ_ID = '" + seq_id + "' AND U.USER_CODE = '" + userCode + "' ORDER BY U.SEQ_ID ";
                ps = c.prepareStatement(userQueryText);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    inserFlag = false;
                } else {
                    inserFlag = true;
                }

                if (inserFlag) {
                    //insert in LHSSYS_ALERT_DIRECT_EMAIL_USER
                    insertInUserQuery = insertInUserQuery + columns + " values " + values;
                    ps = c.prepareStatement(insertInUserQuery.toString());
                    int insertResult = ps.executeUpdate();
                    if (insertResult > 0) {
                        System.out.println("Record inserted in LHSSYS_ALERT_DIRECT_EMAIL_USER ");
                    }

                } else {
                    //update in LHSSYS_ALERT_DIRECT_EMAIL_USER
                    updateInUserQuery = updateInUserQuery + "where seq_id = '" + seq_id + "' and user_code = '" + userCode + "' ";
                    ps = c.prepareStatement(updateInUserQuery);
                    int updateResult = ps.executeUpdate();
                    if (updateResult > 0) {
                        System.out.println("Record updated in LHSSYS_ALERT_DIRECT_EMAIL_USER ");
                    }
                }

            } else {
                result = "show report";
            }
        } catch (SQLException e) {
            System.out.println("exception ---> " + e.getMessage());
            return result;
        } catch (ParseException e) {
            System.out.println("exception ---> " + e.getMessage());
            return result;
        } finally {
            if (ps != null) {
                try {
                    rs.close();
                    ps.close();
                } catch (Exception e) {
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }
        return result;
    }
}
