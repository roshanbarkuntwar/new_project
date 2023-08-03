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
import java.util.Iterator;
import java.util.Set;
import org.json.simple.JSONArray;
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
        U u = new U(this.c);
    }

    public String callProcedureLastupdate(String seq_id, String userCode, String entityCode, String divCode, String accYear) {
        String result = "Report data is not updated";

        CallableStatement callableStatement = null;
        PreparedStatement ps = null;
        String pl_sql = null;
        String empCode = "";
        String getEmpCodeSQL = "SELECT EMP_CODE FROM USER_MAST WHERE USER_CODE = '" + userCode + "'";
//        U.log("getEmpCodeSQL : " + getEmpCodeSQL);
        try {
            ps = c.prepareStatement(getEmpCodeSQL);
            ResultSet rs = ps.executeQuery();
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
            U.log(e);
            return result;
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        try {
            String sql = "select pl_sql_text from lhssys_alert_direct_email where seq_id=" + seq_id;
            ps = c.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
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

                U.log("REPORT DATA REFRESH PLSQL   :   " + pl_sql);

                callableStatement = c.prepareCall(pl_sql);
                callableStatement.executeUpdate();
                result = "Report data is updated";
            }
        } catch (SQLException e) {
            U.log(e);
            return result;
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return result;
    }

    public String getPlaceOrderNetValue(String seq_no, String accCode, String totalAmt) {
        String result = "Error in Procedure";

        PreparedStatement ps = null;
        String totalValFunQry = "";
        String totalValFunSQL = "SELECT DATA_SAVE_SUCCESS_MESSAGE FROM LHSSYS_PORTAL_TABLE_DSC_UPDATE WHERE SEQ_NO ='" + seq_no + "'";
//        U.log("getEmpCodeSQL : " + getEmpCodeSQL);
        try {
            ps = c.prepareStatement(totalValFunSQL);
            ResultSet rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                if (rs.getString(1) != null) {
                    totalValFunQry = rs.getString(1);

                    totalValFunQry = totalValFunQry.replace("'ACC_CODE'", "'" + accCode + "'");
                    totalValFunQry = totalValFunQry.replace("'TOTAL_VALUE'", "'" + totalAmt + "'");

                    System.out.println("QRY  : " + totalValFunQry);
                    try {
                        CallableStatement proc = c.prepareCall("{ ? = call " + totalValFunQry + " }");
                        System.out.println("accCode===" + accCode);
                        System.out.println("totalAmt===" + totalAmt);
                        proc.registerOutParameter(1, java.sql.Types.VARCHAR);
                        proc.execute();
                        result = proc.getString(1);
                        U.log(result + "==resultset is null==" + (proc == null));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            } else {
                totalValFunQry = "";
            }
        } catch (SQLException e) {
            U.log(e);
            return result;
        }

        return result;
    }

    public String filterRefreshReportData(String seq_id, String userCode, String entityCode,
            String divCode, String accYear, String filterDataJSON, String accCode, String userFlag, String geoOrgCode) throws ParseException {
        String result = "Report data is not updated";
        CallableStatement callableStatement = null;
        PreparedStatement ps = null;
        String pl_sql = null;
        String empCode = "";
        ResultSet rs = null;
        String getEmpCodeSQL = "SELECT EMP_CODE FROM USER_MAST WHERE USER_CODE = '" + userCode + "'";
        U.log("getEmpCodeSQL : " + getEmpCodeSQL);
        if (userFlag != null && !userFlag.isEmpty()) {
            if (userFlag == "E" || userFlag.equalsIgnoreCase("E")) {
            } else {
                userCode = accCode;
            }
        }
        try {
            ps = c.prepareStatement(getEmpCodeSQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                empCode = rs.getString(1);
            }
        } catch (SQLException e) {
            U.log(e);
            return result;
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        String accYearBegDate = "";
        String accYearEndDate = "";
        String accYearSQL = "SELECT A.ACC_YEAR,TO_CHAR(A.YRBEGDATE,'dd-MON-yyyy'), TO_CHAR(A.YRENDDATE,'dd-MON-yyyy') FROM ACC_YEAR_MAST A WHERE to_char(to_date(SUBSTR(sysdate, 1, 10),"
                + " 'dd-mon-yyyy')) between A.YRBEGDATE AND A.YRENDDATE AND ROWNUM =1 ORDER BY ACC_YEAR DESC";
        System.out.println("date--" + accYearSQL);
        try {
            ps = c.prepareStatement(accYearSQL);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
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

//            U.log("REPORT DATA REFRESH PLSQL WITHOUT REPLACED VALUES   :   " + pl_sql);
            if (pl_sql != null && !pl_sql.equals(".")) {
                pl_sql = pl_sql.replaceAll("STR_ACC_CODE", userCode);
                pl_sql = pl_sql.replaceAll("STR_ENTITY_CODE", entityCode);
                pl_sql = pl_sql.replaceAll("STR_DIV_CODE", divCode);
                pl_sql = pl_sql.replaceAll("USERCODE", userCode);
                pl_sql = pl_sql.replaceAll("EMPCODE", empCode);
                pl_sql = pl_sql.replaceAll("STR_ACC_YEAR", accYear);
                pl_sql = pl_sql.replaceAll("GEOORGCODE", geoOrgCode);
                pl_sql = pl_sql.replaceAll("ACCYEARBEGDATE", accYearBegDate);
                pl_sql = pl_sql.replaceAll("ACCYEARENDDATE", accYearEndDate);

//                U.log("jsonString==" + filterDataJSON);
                JSONParser json_parser = new JSONParser();
                JSONObject listjson = (JSONObject) json_parser.parse(filterDataJSON);
                Set keys = listjson.keySet();
                Iterator a = keys.iterator();
                String updateQuery = "update lhssys_alert_direct_email_para set column_value= case ";
                StringBuilder whenString = new StringBuilder();
                whenString.append(updateQuery);
                while (a.hasNext()) {
                    String key = (String) a.next();
                    String value = (String) listjson.get(key);

                    U.log("key : " + key + " value :" + value);

                    whenString.append("when para_column='" + key + "' then '" + value + "' ");
                    if (pl_sql.contains("'" + key + "'")) {
                        if (value != null && !value.isEmpty() && !value.equalsIgnoreCase("null")) {
                            pl_sql = pl_sql.replace("'" + key + "'", "'" + value + "'");
                        } else {
                            pl_sql = pl_sql.replace("'" + key + "'", "null");
                        }
                    }
                }

                whenString.append(" else '' end where seq_id=" + seq_id);
                U.log("REPORT DATA REFRESH PLSQL WITH REPLACED VALUES   :   " + pl_sql);
                callableStatement = c.prepareCall(pl_sql);
                callableStatement.executeUpdate();
                result = "Report data is updated";

                ps = c.prepareStatement(whenString.toString());
                int rowCount = ps.executeUpdate();
                U.log("count=" + rowCount);

                String insertInUserQuery = " insert into LHSSYS_ALERT_DIRECT_EMAIL_USER ";
                String columns = "( seq_id,user_code,lastupdate, flag";
                String values = "('" + seq_id + "','" + userCode + "',sysdate,'" + userFlag + "'";

                String updateInUserQuery = " Update LHSSYS_ALERT_DIRECT_EMAIL_USER  set lastupdate = sysdate , flag= '" + userFlag + "'";

                String sqlQueryText = " SELECT U.SLNO,U.para_Column FROM LHSSYS_ALERT_DIRECT_EMAIL_PARA U WHERE U.SEQ_ID = '"
                        + seq_id + "' ORDER BY U.SEQ_ID, U.SLNO ";
                ps = c.prepareStatement(sqlQueryText.toString());
                rs = ps.executeQuery();

                if (rs != null && rs.next()) {
                    do {
                        String slno = rs.getString("SLNO");
                        String para_Column = rs.getString("para_Column");

                        Iterator b = keys.iterator();
                        while (b.hasNext()) {
                            String key = (String) b.next();
                            String value = (String) listjson.get(key);

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
                String userQueryText = " SELECT * FROM LHSSYS_ALERT_DIRECT_EMAIL_USER U WHERE U.SEQ_ID = '" + seq_id + "' AND U.USER_CODE = '" + userCode + "' and flag='" + userFlag + "' ORDER BY U.SEQ_ID ";
                ps = c.prepareStatement(userQueryText.toString());
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    inserFlag = false;
                } else {
                    inserFlag = true;
                }

                if (inserFlag) {
                    //insert in LHSSYS_ALERT_DIRECT_EMAIL_USER
                    insertInUserQuery = insertInUserQuery + columns + " values " + values;

                    U.log(insertInUserQuery);
                    ps = c.prepareStatement(insertInUserQuery.toString());
                    int insertResult = ps.executeUpdate();
                    if (insertResult > 0) {
                        U.log("Record inserted in LHSSYS_ALERT_DIRECT_EMAIL_USER ");
                    }

                } else {
                    //update in LHSSYS_ALERT_DIRECT_EMAIL_USER
                    updateInUserQuery = updateInUserQuery + "where seq_id = '" + seq_id + "' and user_code = '" + userCode + "' ";
                    U.log(("updateInUserQuery--> " + updateInUserQuery));
                    ps = c.prepareStatement(updateInUserQuery.toString());
                    int updateResult = ps.executeUpdate();
                    if (updateResult > 0) {
                        U.log("Record updated in LHSSYS_ALERT_DIRECT_EMAIL_USER ");
                    }
                }

            } else {
                result = "show report";
            }
        } catch (SQLException e) {
            U.log(e);
            return result;
        } catch (ParseException e) {
            U.log(e);
            return result;
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                try {
                    rs.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return result;
    }
}
