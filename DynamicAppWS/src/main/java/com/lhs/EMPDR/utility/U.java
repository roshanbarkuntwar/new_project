package com.lhs.EMPDR.utility;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author premkumar.agrawal
 */
public class U {

    static public void log(Object s) {
        System.out.println(s);
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
}
