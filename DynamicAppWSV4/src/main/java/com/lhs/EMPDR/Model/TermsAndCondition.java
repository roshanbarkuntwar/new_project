/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.util.HashMap;
import java.util.LinkedHashMap;

/**
 *
 * @author kirti.misal
 */
public class TermsAndCondition {
    
       LinkedHashMap<String, String> termsList= new LinkedHashMap<String, String>();
       String pageLable;

    public LinkedHashMap<String, String> getTermsList() {
        return termsList;
    }

    public void setTermsList(LinkedHashMap<String, String> termsList) {
        this.termsList = termsList;
    }

    public String getPageLable() {
        return pageLable;
    }

    public void setPageLable(String pageLable) {
        this.pageLable = pageLable;
    }
 
 

  

   
    
    
}
