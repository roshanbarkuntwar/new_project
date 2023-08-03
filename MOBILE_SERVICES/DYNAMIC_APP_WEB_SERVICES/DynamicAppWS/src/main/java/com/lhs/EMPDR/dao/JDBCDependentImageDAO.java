/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.DependentImageJSON;
import com.lhs.EMPDR.Model.ImageModal;
import com.lhs.EMPDR.utility.Util;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

/**
 *
 * @author kirti.misal
 */
public class JDBCDependentImageDAO {

    Connection con;

    public JDBCDependentImageDAO(Connection connection) {
        this.con = connection;
    }

    public DependentImageJSON getImages(String seqNo, String replaceParameter) {
        DependentImageJSON json = new DependentImageJSON();
        PreparedStatement ps = null;
        ResultSet rs = null;
        ArrayList<ImageModal> imagemodal = new ArrayList<ImageModal>();
        try {
            String sqlTextQuery = null;
            String q = "select sql_text from lhssys_portal_table_dsc_update where seq_no=" + seqNo;
            ps = con.prepareStatement(q);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                sqlTextQuery = rs.getString(1);
            }
            if (sqlTextQuery != null) {
//                String marknoArr[] = markno.split("#");
//                String arrString = getCommaSepratedString(marknoArr);
//                System.out.println("ImageQuery====" + sqlTextQuery.replaceAll("markno", arrString));
                ps = con.prepareStatement(sqlTextQuery.replaceAll("'markno'", "'" + replaceParameter + "'").replaceAll("%20", " "));
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        ImageModal imgobj = new ImageModal();
                        //set image
//                        Byte image = rs.getByte("markno_image");
                        InputStream in = rs.getBinaryStream("markno_image");
                        if (in != null) {
                            imgobj.setImage(Util.getImgstreamToBytes(in));
                        }
                        //set name
                        imgobj.setImageName(rs.getString("markno"));

                        imagemodal.add(imgobj);
                    } while (rs.next());
                }
            }

            json.setDependentImages(imagemodal);
        } catch (Exception err) {
            System.out.println("error==>" + err);
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
            } catch (Exception err) {
                System.out.println("error==>" + err);
            }
            try {
                if (ps != null) {
                    ps.close();
                }
            } catch (Exception err) {
                System.out.println("error==>" + err);
            }
            try {
                if (con != null) {
                    con.close();
                }
            } catch (Exception err) {
                System.out.println("error==>" + err);
            }
        }
        return json;
    }

    public String getCommaSepratedString(String name[]) {
        if (name.length > 0) {
            StringBuilder nameBuilder = new StringBuilder();

            for (String n : name) {
                nameBuilder.append(n + ",");
                // nameBuilder.append("'").append(n.replace("'", "\\'")).append("',");
                // can also do the following
                // nameBuilder.append("'").append(n.replace("'", "''")).append("',");
            }

            nameBuilder.deleteCharAt(nameBuilder.length() - 1);

            return nameBuilder.toString();
        } else {
            return "";
        }
    }
}
