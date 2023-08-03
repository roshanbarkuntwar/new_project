/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.ExtractFileModel;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class ExtractFileJSON {

    List<ExtractFileModel> filelist;

    public List<ExtractFileModel> getFilelist() {
        return filelist;
    }

    public void setFilelist(List<ExtractFileModel> filelist) {
        this.filelist = filelist;
    }

}
