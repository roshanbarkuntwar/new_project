/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

/**
 *
 * @author premkumar.agrawal
 */
public class GraphTabListModel {

    String tab;
    String seq_no;
    String lastupdate;
    String first_screen_1_value;
    String Filter_Flag;
    String paginationFlag;
    byte[] dp;

    public String getPaginationFlag() {
        return paginationFlag;
    }

    public void setPaginationFlag(String paginationFlag) {
        this.paginationFlag = paginationFlag;
    }
    
    public String getFirst_screen_1_value() {
        return first_screen_1_value;
    }

    public void setFirst_screen_1_value(String first_screen_1_value) {
        this.first_screen_1_value = first_screen_1_value;
    }

    public byte[] getDp() {
        return dp;
    }

    public String getLastupdate() {
        return lastupdate;
    }

    public void setLastupdate(String lastupdate) {
        this.lastupdate = lastupdate;
    }

    public void setDp(byte[] dp) {
        this.dp = dp;
    }

    public String getSeq_no() {
        return seq_no;
    }

    public void setSeq_no(String seq_no) {
        this.seq_no = seq_no;
    }

    public String getTab() {
        return tab;
    }

    public void setTab(String tab) {
        this.tab = tab;
    }

    public String getFilter_Flag() {
        return Filter_Flag;
    }

    public void setFilter_Flag(String Filter_Flag) {
        this.Filter_Flag = Filter_Flag;
    }

}
