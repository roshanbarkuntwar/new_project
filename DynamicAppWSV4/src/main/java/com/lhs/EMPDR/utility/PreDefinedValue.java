/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.utility;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class PreDefinedValue {

    public List<String> EngMonth = new ArrayList<String>();

    public PreDefinedValue(String val) {
        if (val.contains("period")) {
            EngMonth.add("Jan");
            EngMonth.add("Feb");
            EngMonth.add("March");
            EngMonth.add("April");
            EngMonth.add("May");
            EngMonth.add("June");
            EngMonth.add("July");
            EngMonth.add("Aug");
            EngMonth.add("Sept");
            EngMonth.add("Oct");
            EngMonth.add("Nov");
            EngMonth.add("Dec");
        }
    }
}
