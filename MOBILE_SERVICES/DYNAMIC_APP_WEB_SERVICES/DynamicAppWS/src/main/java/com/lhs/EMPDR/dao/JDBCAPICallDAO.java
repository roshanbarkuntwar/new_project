/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import java.sql.CallableStatement;
import java.sql.Connection;
import oracle.jdbc.OracleTypes;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCAPICallDAO {

    Connection c;

    public JDBCAPICallDAO(Connection c) {
        this.c = c;
    }

    public String setAPICall(String clientID, String data_Type, String attachedData) {
        String str = "";
        try {
            String command = "{call SALDOS(?,?)}";
            CallableStatement cstmt = c.prepareCall(command);
            cstmt.registerOutParameter(2, OracleTypes.CHAR);
            cstmt.execute();
            str = cstmt.getString(2);
            cstmt.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return str;
    }
}
