/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.utility.U;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.imageio.ImageIO;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 *
 * @author kirti.misal
 */
public class JDBCdocumentMngdaoIMPL implements JDBCdocumentMngdao {

    Connection connection;
    String status = "IMAGE NOT INSERTED";

    public JDBCdocumentMngdaoIMPL(Connection connection) {
        this.connection = connection;
    }

    @Override
    public String manageDoc(String jsonString) {

        PreparedStatement ps = null;
        ResultSet rs = null;
        String docCode = null;
        int docSLNO = 0;
        String folderPath = null;
        InputStream iss = null;
        String doc_ref;
                
        try {

            JSONArray jsonArray = new JSONArray();
            JSONParser json_parser = new JSONParser();
            JSONObject json = (JSONObject) json_parser.parse(jsonString);
            jsonArray = (JSONArray) json.get("recordsInfo");
            int jsonArrLength = jsonArray.size();

            JSONObject jsobj = (JSONObject) jsonArray.get(0);

            if (jsobj.containsKey("TASK_SEQ_NO")) {
                doc_ref = (String) jsobj.get("TASK_SEQ_NO");
                docCode=doc_ref;
            } else {
                doc_ref = (String) jsobj.get("DOC_REF");
                
            }
            String user_code = (String) jsobj.get("USER_CODE");
            String desc[] = new String[5];
            desc[0] = (String) jsobj.get("DOC_DESC1");
            desc[1] = (String) jsobj.get("DOC_DESC2");
            desc[2] = (String) jsobj.get("DOC_DESC3");
            desc[3] = (String) jsobj.get("DOC_DESC4");
            desc[4] = (String) jsobj.get("DOC_DESC5");

            String query = "SELECT T.DOC_CODE, D.FOLDER_PATH FROM DOC_MAST T, DOC_TYPE_MAST D WHERE D.DOC_TYPE = T.DOC_TYPE AND T.DOC_CODE =" + doc_ref;
            String slnoSQL = "SELECT NVL(MAX(D.DOC_SLNO), 0) DOC_SLNO FROM doc_tran D WHERE D.USER_CODE = '" + user_code + "' AND D.DOC_CODE = " + doc_ref;
            System.out.println("query----- > "+ query);
            System.out.println("slnoSQL----- > "+ slnoSQL);
            try {
                ps = connection.prepareStatement(query);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
//                        docCode = rs.getString(1);
                        if (rs.getString(1) != null && !rs.getString(1).isEmpty()) {
                            docCode = rs.getString(1);
                        } else {
                            docCode = doc_ref;
                        }

                        folderPath = rs.getString(2);
                    } while (rs.next());
                }
            } catch (Exception e) {
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                    }
                }
            }

            try {
                ps = connection.prepareStatement(slnoSQL);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        docSLNO = rs.getInt(1);
                    } while (rs.next());
                }
            } catch (Exception e) {
            } finally {
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (SQLException e) {
                    }
                }
            }

            if (docSLNO > 0) {
                String deleteData = "DELETE FROM doc_tran D WHERE D.USER_CODE = '" + user_code + "' AND D.DOC_CODE = " + doc_ref;
                String deleteData1 = "DELETE FROM doc_tran_image D WHERE  D.DOC_CODE = " + doc_ref;
                int n = 0;
                try {
                    ps = connection.prepareStatement(deleteData);
                    n = ps.executeUpdate();
                    if (n > 0) {
                        try {
                            ps = connection.prepareStatement(deleteData1);
                            n = ps.executeUpdate();
                            if (n > 0) {
                                docSLNO = 0;
                            }
                        } catch (SQLException e) {
                        } finally {
                            if (ps != null) {
                                try {
                                    ps.close();
                                } catch (Exception e) {
                                }
                            }
                        }
                    }
                } catch (SQLException e) {
                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (Exception e) {
                        }
                    }
                }
            } else {

            }
            for (int i = 1; i < jsonArrLength; i++) {
                JSONObject obj1 = (JSONObject) jsonArray.get(i);
                if (obj1.get("file") != null && obj1.get("file").toString().length() > 3) {
                    String base64Img = obj1.get("file").toString();
                    byte[] imageByts = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
                    iss = new ByteArrayInputStream(imageByts);

                    BufferedImage buffImage = null;
                    String folderPathReplaced = "";
                    folderPathReplaced = folderPath;
                    String sqlDocumentInsert = "";
                    try {
                        sqlDocumentInsert = "insert into doc_tran (doc_code,doc_slno,doc_desc,user_code,file_name, MOBILE_FLAG,LASTUPDATE, FILE_DATE)values(?,?,?,?,?,'M', sysdate, sysdate) ";

                        ps = connection.prepareStatement(sqlDocumentInsert);
                        ps.setString(1, docCode);
                        ps.setString(2, String.valueOf(docSLNO + 1));
                        ps.setString(3, desc[i - 1]);
                        ps.setString(4, user_code);
                        ps.setString(5, doc_ref + "_" + String.valueOf(docSLNO + 1) + ".jpg");
                        int ii = 0;
                        ii = ps.executeUpdate();
                        if (ii > 0) {
                            status = "insert data";
                            docSLNO++;
                        } else {
                            status = "IMAGE NOT INSERTED";
                        }
                        System.out.println("IMAGE INSERT STATUS : " + status);
                    } catch (Exception e) {
                        U.log(e);
                        status = "IMAGE NOT INSERTED";
                    } finally {
                        if (ps != null) {
                            try {
                                ps.close();
                            } catch (SQLException ex) {
                                status = "IMAGE NOT INSERTED";
                            }
                        }
                    }

                    if (folderPath != null) {
                        //C:\\SSELERP_IMAGES\\'ENTRY_TYPE'\\'ENTRY_VRNO'\\'DOC_NAME'_'SLNO'.jpg
                        folderPathReplaced = folderPathReplaced.replaceAll("'ENTRY_TYPE'", jsobj.get("ENTRY_TYPE").toString())
                                .replaceAll("'ENTRY_VRNO'", jsobj.get("ENTRY_VRNO").toString())
                                .replaceAll("'DOC_NAME'", jsobj.get("DOC_NAME").toString())
                                .replaceAll("'SLNO'", String.valueOf(i));
                        buffImage = ImageIO.read(iss);
                        File file = new File(folderPathReplaced);
                        file.getParentFile().mkdirs();
                        ImageIO.write(buffImage, "jpg", file);
                        status = "insert data";
                    } else {
                        status = insertDocument(obj1.get("fileName").toString(), user_code, desc[i - 1],
                                iss, docCode, String.valueOf(docSLNO));
                    }
                }
            }

        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException ex) {
                    status = "IMAGE NOT INSERTED";
                }
            }
        }
        return status;
    }

    public String insertDocument(String fileName, String userCode, String desc,
            InputStream fin, String doc_code, String docSlno) throws Exception {
        PreparedStatement pst = null;
        String sqlDocumentInsert = "";

        try {
            sqlDocumentInsert = "insert into doc_tran_image (doc_code,doc_slno,doc_image)values(?,?,?)";
            pst = connection.prepareStatement(sqlDocumentInsert);
            pst.setString(1, doc_code);
            pst.setString(2, docSlno);
            pst.setBinaryStream(3, fin, fin.available());

            int i = 0;
            i = pst.executeUpdate();
            if (i > 0) {
                status = "insert data";
            } else {
                status = "IMAGE NOT INSERTED";
            }
//            System.out.println("IMAGE INSERT STATUS : " + status);
        } catch (Exception e) {
            status = "IMAGE NOT INSERTED";
            U.log(e);
        } finally {
            if (pst != null) {
                try {
                    pst.close();
                } catch (SQLException ex) {
                    status = "IMAGE NOT INSERTED";
                }
            }
        }
        return status;
    }
}
