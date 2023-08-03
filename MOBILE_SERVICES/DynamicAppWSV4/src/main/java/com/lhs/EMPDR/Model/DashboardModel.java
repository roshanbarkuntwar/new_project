/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

/**
 *
 * @author anjali.bhendarkar
 */
public class DashboardModel {

    String name;
//    String address;
//    String message;
//    String client_count;
//    String deal_count;
//    String potential;
//    String target;
    String count;
    String depenDentNextentry;
    String seqNo;
    byte icon[];

    public String getSeqNo() {
        return seqNo;
    }

    public void setSeqNo(String SeqNo) {
        this.seqNo = SeqNo;
    }

    public String getDepenDentNextentry() {
        return depenDentNextentry;
    }

    public void setDepenDentNextentry(String depenDentNextentry) {
        this.depenDentNextentry = depenDentNextentry;
    }

//    HashMap<String, Object> graphdata;

    public String getCount() {
        return count;
    }

    public void setCount(String count) {
        this.count = count;
    }

    public byte[] getIcon() {
        return icon;
    }

    public void setIcon(byte[] icon) {
        this.icon = icon;
    }

    
    
//    public String getClient_name() {
//        return client_name;
//    }
//
//    public void setClient_name(String client_name) {
//        this.client_name = client_name;
//    }
//
//    public String getAddress() {
//        return address;
//    }
//
//    public void setAddress(String address) {
//        this.address = address;
//    }
//
//    public String getMessage() {
//        return message;
//    }
//
//    public void setMessage(String message) {
//        this.message = message;
//    }
//
//    public String getClient_count() {
//        return client_count;
//    }
//
//    public void setClient_count(String client_count) {
//        this.client_count = client_count;
//    }
//
//    public String getDeal_count() {
//        return deal_count;
//    }
//
//    public void setDeal_count(String deal_count) {
//        this.deal_count = deal_count;
//    }
//
//    public String getPotential() {
//        return potential;
//    }
//
//    public void setPotential(String potential) {
//        this.potential = potential;
//    }
//
//    public String getTarget() {
//        return target;
//    }
//
//    public void setTarget(String target) {
//        this.target = target;
//    }

//    public HashMap<String, Object> getGraphdata() {
//        return graphdata;
//    }
//
//    public void setGraphdata(HashMap<String, Object> graphdata) {
//        this.graphdata = graphdata;
//    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
