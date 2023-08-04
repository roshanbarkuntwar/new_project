/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.entity.DocumentDetails;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.IOUtils;

/**
 *
 * @author kirti.misal
 */
public class JDBCDownloadDocDAO {

    Connection con;
    public static String type = "";

    public JDBCDownloadDocDAO(Connection con) {
        this.con = con;
        U u = new U(this.con);
    }

    public InputStream getdocument(String rowid) {

        InputStream in = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        byte[] doc = new byte[1024];

        try {
            String query = "SELECT ANNEXURE,ANNEXURE_TYPE FROM ORDER_ANNEXURE  WHERE ROWID = '" + rowid + "'";
            ps = con.prepareStatement(query);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                in = rs.getBinaryStream("ANNEXURE");
                type = rs.getString("ANNEXURE_TYPE").toLowerCase();
                doc = Util.getImgstreamToBytes(in);

                doc = new byte[in.available()];
                in.read(doc);
                U.log("length==" + doc.length);
            }
        } catch (Exception e) {
            U.errorLog("error==>" + e);
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
            } catch (Exception err) {
                U.errorLog("error==>" + err);
            }
            try {
                if (ps != null) {
                    ps.close();
                }
            } catch (Exception err) {
                U.errorLog("error==>" + err);
            }
            try {
                if (con != null) {
                    con.close();
                }
            } catch (Exception err) {
                U.errorLog("error==>" + err);
            }
        }
        return in;
    }

    public DocumentDetails getDocumentDetails(String rowid) {
        DocumentDetails documentDetails = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            String query = "SELECT ANNEXURE,ANNEXURE_TYPE FROM ORDER_ANNEXURE  WHERE ROWID = '" + rowid + "'";
            ps = con.prepareStatement(query);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {

                documentDetails = new DocumentDetails();
                documentDetails.setDocInputStream(rs.getBytes("ANNEXURE"));
                documentDetails.setDocType(rs.getString("ANNEXURE_TYPE").toLowerCase());

            }
        } catch (Exception e) {
            U.errorLog("error==>" + e);
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
            } catch (Exception err) {
                U.errorLog("error==>" + err);
            }
            try {
                if (ps != null) {
                    ps.close();
                }
            } catch (Exception err) {
                U.errorLog("error==>" + err);
            }
            try {
                if (con != null) {
                    con.close();
                }
            } catch (Exception err) {
                U.errorLog("error==>" + err);
            }
        }

        return documentDetails;
    }
}
