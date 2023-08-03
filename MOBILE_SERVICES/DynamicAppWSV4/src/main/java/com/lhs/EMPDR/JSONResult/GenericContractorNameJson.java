/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.GenericCodeNameModel;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class GenericContractorNameJson {

    List<GenericCodeNameModel> contractorName;

    public List<GenericCodeNameModel> getContractorName() {
        return contractorName;
    }

    public void setContractorName(List<GenericCodeNameModel> contractorName) {
        this.contractorName = contractorName;
    }

}
