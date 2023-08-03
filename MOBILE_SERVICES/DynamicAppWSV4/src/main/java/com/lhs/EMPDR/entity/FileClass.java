/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.entity;

import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.ListMultimap;
import com.lhs.EMPDR.utility.U;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class FileClass {
    // Create a map to ArrayList values.

    public static ListMultimap<String, String> map = ArrayListMultimap.create();

    public FileClass() {
        map = ArrayListMultimap.create();
    }

    public void addInmap(String key, String val) {
//        U.log(key + "    " + val);
        map.put(key, val);
    }

    public String getvalFromMap(String key) {
        String value = "";
        List<String> list = map.get(key);
        for (String val : list) {
            value = val;
//            System.out.println(val);
        }
        return value;
    }

    public boolean isNumber(String key) {
        List<String> list = map.get(key.toUpperCase());
        for (String val : list) {
            if (val.toUpperCase().contains("NUMBER")) {
                return true;
            }
            return false;
        }
        return false;
    }

    public boolean isImg(String key) {
        List<String> list = map.get(key);
        for (String val : list) {
            if (val.contains("IMG")) {
                return true;
            }
            return false;
        }
        return false;
    }

    public boolean isVideo(String key) {
        List<String> list = map.get(key);
        for (String val : list) {
            if (val.contains("VIDEO")) {
                return true;
            }
            return false;
        }
        return false;
    }

    public boolean isDate(String key) {
        List<String> list = map.get(key);
        for (String val : list) {
            if (val.trim().contains("DATETIME")) {
                return true;
            }
            return false;
        }
        return false;
    }

    public boolean isSysDate(String key) {
        List<String> list = map.get(key);
        for (String val : list) {
            if (val.trim().contains("sysdate")) {
                return true;
            }
            return false;
        }
        return false;
    }

    public boolean isVrno(String key) {
        List<String> list = map.get(key);
        for (String val : list) {
            if (val.contains("VRNO")) {
                return true;
            }
            return false;
        }
        return false;
    }
    
     public boolean isVrdate(String key) {
        List<String> list = map.get(key);
        for (String val : list) {
            if (val.contains("VRDATE")) {
                return true;
            }
            return false;
        }
        return false;
    }
}
