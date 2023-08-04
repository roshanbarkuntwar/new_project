package com.lhs.EMPDR.utility;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class U {

    static String log_generate_flag = "";

    static Connection c = null;

    public U(Connection c) {
        this.c = c;
    }

    static void findLogGenerateFlag() {
        Connection con = c;
        PreparedStatement ps = null;
        ResultSet res = null;

        try {
            if (log_generate_flag == "") {

//            String query="select parameter_value from lhssys_parameters where parameter_name='LOG_GENERATE_FLAG'";
                String query = "select mobile_app_server_log from view_default_user_links";
                ps = con.prepareStatement(query);
                res = ps.executeQuery();
                if (res != null && res.next()) {
//                    if (res.getString(1).equalsIgnoreCase("Y")) {

                    log_generate_flag = res.getString(1);
//                    }
                } else {
                    log_generate_flag = "F";
                }
            }
        } catch (Exception ex) {

        }
    }

    static public void log(Object s) {

        findLogGenerateFlag();
        if (log_generate_flag.equalsIgnoreCase("T")) {
            System.out.println(s);
        }
    }

    static public void errorLog(Object s) {
//        findLogGenerateFlag();
//        if(log_generate_flag=="Y"){
        System.out.println((char) 27 + "[31m" + "ERROR message=>>" + s);
//        }
    }

    static public String matchString(String string, String regex, int group) {
        String value = "";

        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(string);

        List<String> listMatches = new ArrayList<String>();

        while (matcher.find()) {
            listMatches.add(matcher.group(group));
        }

        for (String s : listMatches) {
            value = value + s + " ";
            System.out.println(s);
        }
        return value;
    }

    public static String match(String html, String expression, int groupNum) {

        Matcher m = Pattern.compile(expression, Pattern.CASE_INSENSITIVE).matcher(html);

        if (groupNum <= 0) {
            if (m.find()) {
                return m.group();
            } else {
                return null;
            }
        }

        if (m.find()) {
            return m.group(groupNum).trim();
        } else {
            return null;
        }
    }

    public static int getDocumentListCount(String tableName, Connection connection) throws Exception {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int listCount = 0;

        try {

            String selectQry = "select max(seq_id) from " + tableName;
            U.log("sq id query==" + selectQry);
            pst = connection.prepareStatement(selectQry);

            rs = pst.executeQuery();
            while (rs.next()) {
                listCount = rs.getInt(1);
            }
        } catch (SQLException ex) {
            System.out.println("Exception-" + ex);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException e) {
                }
            }
        }
        U.log("listCount===" + listCount);
        return listCount;
    }

    static public int nextSeqID(String tableName, Connection connection) throws Exception {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int listCount = 0;
        try {
            String selectQry = "select portal_app_tran_seq.nextval from dual";
            U.log("Get SEQ_ID query :  " + selectQry);
            pst = connection.prepareStatement(selectQry);
            rs = pst.executeQuery();
            while (rs.next()) {
                listCount = rs.getInt(1);
            }
        } catch (SQLException ex) {
            System.out.println("Exception-" + ex);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException e) {
                }
            }
        }
        U.log("OBTAINED SEQ_ID :  " + listCount);
        return listCount;
    }

    /**
     * Required Functions for Getting Table Response with Column Headers *
     */
    public List<HashMap<String, String>> getQueryResponse(String qry) {
        List<HashMap<String, String>> responseDataList = new ArrayList<HashMap<String, String>>();
        HashMap<String, String> responseData;
        try {
            PreparedStatement ps = c.prepareStatement(qry);
            ResultSet rs = ps.executeQuery();
            ResultSetMetaData rsmd = rs.getMetaData();
            ArrayList<String> rsmdList = new ArrayList<String>();
            int columnCout = rsmd.getColumnCount();
            for (int i = 1; i <= columnCout; i++) {
                rsmdList.add(rsmd.getColumnName(i));
            }
            if (rs != null) {
                while (rs.next()) {
                    responseData = new HashMap<String, String>();
                    for (String columnName : rsmdList) {
                        responseData.put(columnName, rs.getString(columnName));
                    }
                    responseDataList.add(responseData);
                }
            }
        } catch (SQLException e) {
            e.getMessage();
        }
        return responseDataList;
    }

}
