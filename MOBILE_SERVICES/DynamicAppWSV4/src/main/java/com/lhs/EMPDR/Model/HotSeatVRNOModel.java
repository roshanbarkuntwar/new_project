/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.util.ArrayList;
/**
 *
 * @author premkumar.agrawal
 */
public class HotSeatVRNOModel {

    String tableName = "";
    String tCode = "";
    String vrno = "";
    String docType = "";
    ArrayList<HotSeatDocImgModel> imgs = new ArrayList<HotSeatDocImgModel>();

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String gettCode() {
        return tCode;
    }

    public void settCode(String tCode) {
        this.tCode = tCode;
    }

    public String getVrno() {
        return vrno;
    }

    public void setVrno(String vrno) {
        this.vrno = vrno;
    }

    public String getDocType() {
        return docType;
    }

    public void setDocType(String docType) {
        this.docType = docType;
    }

    public ArrayList<HotSeatDocImgModel> getImgs() {
        return imgs;
    }

    public void setImgs(ArrayList<HotSeatDocImgModel> imgs) {
        this.imgs = imgs;
    }
}
