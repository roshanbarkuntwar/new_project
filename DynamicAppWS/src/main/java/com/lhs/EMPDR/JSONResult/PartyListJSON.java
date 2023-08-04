/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.PartyListModel;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class PartyListJSON {
    
    List<PartyListModel> partyList;

    public List<PartyListModel> getPartyList() {
        return partyList;
    }

    public void setPartyList(List<PartyListModel> partyList) {
        this.partyList = partyList;
    }
    
}
