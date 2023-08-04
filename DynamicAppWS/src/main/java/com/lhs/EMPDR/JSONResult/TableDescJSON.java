/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.TableDescModel;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class TableDescJSON {

    List<TableDescModel> tableDesc;
    String para_desc;

    public List<TableDescModel> getTableDesc() {
        return tableDesc;
    }

    public String getPara_desc() {
        return para_desc;
    }

    public void setPara_desc(String para_desc) {
        this.para_desc = para_desc;
    }

    public void setTableDesc(List<TableDescModel> tableDesc) {
        this.tableDesc = tableDesc;
    }

}
