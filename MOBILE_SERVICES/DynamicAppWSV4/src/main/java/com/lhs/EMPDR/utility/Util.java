/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.utility;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 *
 * @author premkumar.agrawal
 */
public class Util {

    public static String formatedDate(String DOB) throws ParseException {
        Date date = new Date();
        DOB = DOB.replace("GMT ", "GMT+");
        java.util.Date tempDate = new java.util.Date(DOB);
        SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy");
        DateFormat formatter = new SimpleDateFormat("E MMM dd HH:mm:ss Z yyyy");
        date = (Date) formatter.parse(tempDate.toString());
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        String formatedDate = cal.get(Calendar.DATE) + "/" + (cal.get(Calendar.MONTH) + 1) + "/" + cal.get(Calendar.YEAR);
        return formatedDate;
    }

    public static byte[] getImgstreamToBytes(InputStream imgstream) {
        byte[] bytes = null;
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buf = new byte[1024];
            InputStream in = imgstream;
            if (in != null) {
                int n = 0;
                while ((n = in.read(buf)) > 0) {
                    baos.write(buf, 0, n);
                }
                in.close();
            }
            bytes = baos.toByteArray();
        } catch (IOException e) {
        }
        return bytes;
    }
    
      /**
     * This method is used to check whether a given String is null or not
     *
     * @param comparionValue String value to check if it is null
     * @return <code>true</code> if comparionValue is null and
     * <code>false</code> if comparionValue is not null
     */
    public boolean isNull(String comparionValue) {
        boolean nullValue = true;
        try {
            if (comparionValue != null && !"".equals(comparionValue) && !"null".equalsIgnoreCase(comparionValue) && comparionValue.length() > 0) {
                nullValue = false;
            }
        } catch (NullPointerException npe) {
        } catch (Exception ex) {
        }
        return nullValue;
    }// end method
}
