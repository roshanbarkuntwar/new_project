/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import com.google.common.collect.Multimap;
import java.util.ArrayList;
import java.util.HashMap;

/**
 *
 * @author kirti.misal
 */
public class AddonModel {
    
    ArrayList<ArrayList<String>> addonparam=null;
    String pageLable;
    public ArrayList<ArrayList<String>> getAddonparam() {
        return addonparam;
    }

    public void setAddonparam(ArrayList<ArrayList<String>> addonparam) {
        this.addonparam = addonparam;
    }

    public String getPageLable() {
        return pageLable;
    }

    public void setPageLable(String pageLable) {
        this.pageLable = pageLable;
    }

    
  

  
    
    
}
