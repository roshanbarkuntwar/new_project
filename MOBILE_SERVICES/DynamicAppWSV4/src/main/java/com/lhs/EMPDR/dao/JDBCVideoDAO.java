/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import org.apache.commons.codec.binary.Base64;

import static com.google.common.base.CharMatcher.is;
import com.lhs.EMPDR.JSONResult.ExtractFileJSON;
import com.lhs.EMPDR.Model.ExtractFileModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
//import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.imageio.ImageIO;
import org.apache.commons.io.IOUtils;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCVideoDAO {

    Connection c;

    public JDBCVideoDAO(Connection c) {
        this.c = c;
        U u = new U(this.c);
    }

    public void addvideo(String fileid) {
        String sql = "select * from  lhssys_portal_upload_file where file_id=" + fileid;
        PreparedStatement ps = null;
        ResultSet rs;

        InputStream inputstream = null;

        try {
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                inputstream = rs.getBinaryStream("store_file_lraw");

            }
//String result = CharStreams.toString(new InputStreamReader(
//      inputstream, Charsets.UTF_8));
//U.log(inputstream.toString());
            byte[] decodedBytes = Util.getImgstreamToBytes(inputstream);
            File file2 = new File("d:/LHS/Converted.mp4");
            FileOutputStream os = new FileOutputStream(file2, true);
            os.write(decodedBytes);
            os.close();

        } catch (Exception e) {
            // TODO: handle exception
            U.log("Error=" + e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
    }

    public void overlayImage(String fileimg) throws IOException, Exception {
        Date date = new Date();
        File file = new File("D:\\photo\\lal.jpg");
        BufferedImage bi = ImageIO.read(file);
        Graphics2D graphics = bi.createGraphics();
        Font font = new Font("ARIAL", Font.PLAIN, 10);
        graphics.setFont(font);
        graphics.drawString(date.toString(), 0, 20);
        bi.flush();
        ImageIO.write(bi, "jpg", file);

//byte to bufferedImage
        String base64Image = fileimg;//.split(",")[1];
        byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
        InputStream is = new ByteArrayInputStream(imageBytes);
        bi = ImageIO.read(is);
        graphics = bi.createGraphics();
        font = new Font("ARIAL", Font.PLAIN, 10);
        graphics.setFont(font);
        graphics.drawString(date.toString(), 0, 25);
        bi.flush();

        byte[] imageInByte;
// convert BufferedImage to byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bi, "jpg", baos);
        baos.flush();
        imageInByte = baos.toByteArray();
        baos.close();
        is = new ByteArrayInputStream(imageInByte);

        insertDocument("aaa", "aaa", "aaa", "aaa", is);

    }

    public int insertDocument(String fileName, String userCode, String discribtion, String systemFileName, InputStream fin) throws Exception {
        int status = 0;
        U.log("insertDocument");

        PreparedStatement pst = null;
        String sqlDocumentInsert = new String();
        try {
            int fileId = 86;

            fileId = (fileId + 1) * (-1);

            U.log("file id _---" + fileId);
            sqlDocumentInsert = "insert into LHSSYS_portal_upload_file (FILE_ID,FILE_NAME,UPLOADATE_DATE,LAST_UPDATED,DESCRIBTION,USER_CODE,FLAG,SYSTEM_FILE_NAME,STORE_FILE) values (?,?,sysdate,sysdate,?,?,'h',?,?)";

            U.log("compile qry == " + sqlDocumentInsert);

            pst = c.prepareStatement(sqlDocumentInsert);
            pst.setInt(1, fileId);
            pst.setString(2, fileName);
            pst.setString(3, discribtion);
            pst.setString(4, userCode);
            pst.setString(5, systemFileName);
            pst.setBinaryStream(6, fin, fin.available());

            pst.executeQuery();
            U.log("result------" + status);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }
        return status;

    }

    public ExtractFileJSON extractFile(String fileid) {
        String sql = "select * from  lhssys_portal_upload_file where file_id=" + fileid;
        PreparedStatement ps = null;
        ResultSet rs;
        List<ExtractFileModel> list = new ArrayList<ExtractFileModel>();
        InputStream imgStream = null;
        ExtractFileModel model = new ExtractFileModel();

        try {
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {

                Blob b = rs.getBlob("store_file");
                imgStream = b.getBinaryStream();
                byte[] filebyte = IOUtils.toByteArray(imgStream);//Util.getImgstreamToBytes(imgStream);
                U.log(Base64.encodeBase64(filebyte));
                //  U.log(Base64.encode(filebyte));
                model.setFile(Base64.encodeBase64(filebyte));

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
        list.add(model);
        ExtractFileJSON json = new ExtractFileJSON();

        json.setFilelist(list);
        return json;
    }
}
