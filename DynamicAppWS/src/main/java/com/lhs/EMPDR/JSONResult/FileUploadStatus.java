/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

/**
 *
 * @author premkumar.agrawal
 */
public class FileUploadStatus {

    String status;
    String VRNO;
    String sqlData;
    String vrnoColumnName;

    public String getVRNO() {
        return VRNO;
    }

    public void setVRNO(String VRNO) {
        this.VRNO = VRNO;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSqlData() {
        return sqlData;
    }

    public void setSqlData(String sqlData) {
        this.sqlData = sqlData;
    }

    public String getVrnoColumnName() {
        return vrnoColumnName;
    }

    public void setVrnoColumnName(String vrnoColumnName) {
        this.vrnoColumnName = vrnoColumnName;
    }
}
