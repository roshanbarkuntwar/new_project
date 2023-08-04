/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.entity.LoggerWrite;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.FieldPosition;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCWelcomeMsgDAO {

    Connection c;
    LoggerWrite log = new LoggerWrite();

    public JDBCWelcomeMsgDAO(Connection c) {
        this.c = c;
        U u = new U(this.c);
    }

    public String getMsg(String tabId, String userName) {
        String sql = "select TO_CHAR(sysdate, 'dd-mm-yyyy') currentDate, TO_CHAR(SYSDATE,'HH24:MI AM') currentTime,welcome_message from lhssys_portal_tab_mast where tab_id='" + tabId + "'";
//        log.logger.info("JDBCWelcomeMsgDAO : " + sql);
        U.log("GET WelcomeMsg SQL : " + sql);
        String msg = "";
        PreparedStatement ps = null;
        ResultSet rs;
        String currentDate = "";
        String currentTime = "";
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("dd.MM.yy", Locale.ENGLISH);
        SimpleDateFormat formatter2 = new SimpleDateFormat("h:mm a", Locale.ENGLISH);

        try {
            if (c == null) {
                U.log("CONNECT IS NULL");
            }
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    msg = rs.getString("welcome_message");
                    currentDate = rs.getString("currentDate");
                    currentTime = rs.getString("currentTime");
                    msg = msg.replace("'user_name'", userName).replace("'sysdate'",
                            /*formatter.format(date)*/currentDate).replace("'systime'", /*formatter2.format(date)*/currentTime).replace("\\n", "");

                } while (rs.next());
            }
        } catch (Exception e) {
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return msg;
    }
}
