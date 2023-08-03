/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.HotSeatDocImgModel;
import com.lhs.EMPDR.Model.HotSeatVRNOModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCHotSeatVRNODAO {

    public Connection connection = null;

    public JDBCHotSeatVRNODAO(Connection connection) {
        this.connection = connection;
    }

    public HotSeatVRNOModel getVRNOData(String userCode, String docRef) {
        HotSeatVRNOModel model = new HotSeatVRNOModel();
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String DOC_REF = "";
        String obtainedVRNO = "";

        try {
            String hotSeatVRNOSQL = "SELECT DOC_REF_KEY FROM USER_MAST WHERE USER_CODE = '" + userCode + "'";
            preparedStatement = connection.prepareStatement(hotSeatVRNOSQL);
            resultSet = preparedStatement.executeQuery();
            U.log("hotSeatVRNOSQL : " + hotSeatVRNOSQL);
            if (resultSet != null && resultSet.next()) {
                DOC_REF = resultSet.getString(1);
                if (DOC_REF != null) {
                    if (DOC_REF.contains("#")) {
                        String[] arrVRNO = DOC_REF.split("#VRNO - '");
                        String[] arr1VRNO = arrVRNO[1].split("'");
                        obtainedVRNO = arr1VRNO[0];
                        model.setVrno(obtainedVRNO);
                    } else {
                        model.setVrno(DOC_REF);
                    }
                    ArrayList<HotSeatDocImgModel> imgs = getImages(model.getVrno(), userCode);
                    model.setImgs(imgs);
                } else {
                    model.setVrno("Not Available");
                }
            } else {
                model.setVrno("Not Available");
            }
        } catch (SQLException e) {
            model.setVrno("Not Available");
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                }
            }
        }

        if (docRef != null && !docRef.isEmpty()) {
            ArrayList<HotSeatDocImgModel> imgs = getImages(docRef, userCode);
            model.setImgs(imgs);
        }
        return model;
    }

    public ArrayList<HotSeatDocImgModel> getImages(String doc_code, String user_code) {

        String sql = "SELECT DD.*, D.DOC_DESC FROM doc_tran D, doc_tran_image DD WHERE"
//                + " D.USER_CODE = '" + user_code + "' AND"
                + "  D.DOC_CODE = " + doc_code
                + " AND DD.DOC_CODE = D.DOC_CODE AND DD.DOC_SLNO = D.DOC_SLNO";
        System.out.println("doc_tran_image sql-->" + sql);
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        ArrayList<HotSeatDocImgModel> imgList = new ArrayList<HotSeatDocImgModel>();

        try {
            preparedStatement = connection.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    HotSeatDocImgModel model = new HotSeatDocImgModel();
                    InputStream imgStream = resultSet.getBinaryStream("DOC_IMAGE");
                    byte[] img = Util.getImgstreamToBytes(imgStream);
                    model.setDoc_img(Base64.encode(img));
                    model.setDoc_desc(resultSet.getString("DOC_DESC"));
                    model.setDoc_slno(resultSet.getString("DOC_SLNO"));
                    imgList.add(model);
                } while (resultSet.next());
            }
        } catch (SQLException ex) {
            System.out.println("exeception ---> " + ex.getMessage());
        }
        return imgList;
    }

}
