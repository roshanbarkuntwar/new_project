/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.TabularFormEntryDetailModel;

/**
 *
 * @author premkumar.agrawal
 */
public class TabularFormDataJSON {

    TabularFormEntryDetailModel recordInfo = new TabularFormEntryDetailModel();

    public TabularFormEntryDetailModel getRecordInfo() {
        return recordInfo;
    }

    public void setRecordInfo(TabularFormEntryDetailModel recordInfo) {
        this.recordInfo = recordInfo;
    }

}
