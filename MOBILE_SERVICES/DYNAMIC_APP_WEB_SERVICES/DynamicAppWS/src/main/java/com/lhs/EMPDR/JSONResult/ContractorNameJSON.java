/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.ContractorNameModel;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class ContractorNameJSON {

    List<ContractorNameModel> ContractorNameList;

    public List<ContractorNameModel> getContractorNameList() {
        return ContractorNameList;
    }

    public void setContractorNameList(List<ContractorNameModel> ContractorNameList) {
        this.ContractorNameList = ContractorNameList;
    }

}
