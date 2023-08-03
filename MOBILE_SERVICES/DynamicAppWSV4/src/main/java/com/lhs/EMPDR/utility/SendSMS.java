/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.utility;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

/**
 *
 * @author abhijeet.joshi
 */
public class SendSMS {

    public boolean sendSMS(String smsUrl) throws UnsupportedEncodingException, MalformedURLException, IOException {
//        System.out.println("sms url : \n"+smsUrl);
        boolean status = false;
        String str;
        try {
            URL url = new URL(smsUrl);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            try {
                urlConnection.connect();
                urlConnection.setDoOutput(true);
                OutputStreamWriter out = new OutputStreamWriter(urlConnection.getOutputStream());
                out.write(smsUrl);
                BufferedReader in = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                while ((str = in.readLine()) != null) {
                    String responseStr = str;
                    status = responseStr != null && responseStr.contains("success");
                }
                in.close();
            } catch (Exception e) {
//                e.printStackTrace();
            }
            String response = urlConnection.getResponseMessage();
            if (response != null && !response.equalsIgnoreCase("") && !response.equalsIgnoreCase("null")) {
                if (response.equalsIgnoreCase("OK")) {
                    status = true;
                }
            }
            urlConnection.disconnect();
        } catch (Exception ex) {
//            ex.printStackTrace();
        }

        return status;
    }// End Method

}// End Class
