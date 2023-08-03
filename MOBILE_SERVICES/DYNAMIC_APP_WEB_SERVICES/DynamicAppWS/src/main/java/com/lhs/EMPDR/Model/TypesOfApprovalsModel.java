/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

/**
 *
 * @author kirti.misal
 */
public class TypesOfApprovalsModel {

    String tnatrure_Name;
    String tnature_code;
    String rec_count;
    String seqId;
    byte[] image;

    public String getSeqId() {
        return seqId;
    }

    public void setSeqId(String seqId) {
        this.seqId = seqId;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getTnatrure_Name() {
        return tnatrure_Name;
    }

    public void setTnatrure_Name(String tnatrure_Name) {
        this.tnatrure_Name = tnatrure_Name;
    }

    public String getTnature_code() {
        return tnature_code;
    }

    public void setTnature_code(String tnature_code) {
        this.tnature_code = tnature_code;
    }

    public String getRec_count() {
        return rec_count;
    }

    public void setRec_count(String rec_count) {
        this.rec_count = rec_count;
    }

}
