/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;

/**
 *
 * @author anjali.bhendarkar
 */
public class SendSMSDAO {

    public static Boolean sendSMS(String rest_credentials) throws UnsupportedEncodingException, MalformedURLException, IOException {
        Boolean otpStatus = false;
        try {
            String decodedString;
//            String rest_credentials = URL2;

            String message = URLEncoder.encode(rest_credentials, "UTF-8");
//            rest_credentials = rest_credentials.replace("#1", number);
//            rest_credentials = rest_credentials.replace("#2", message);
            String value_to_call = rest_credentials;

            URL url = new URL(value_to_call);
//            System.out.println("\n\nurl..." + url);
            System.out.println("----------------------------------------------------------------------");

            HttpURLConnection uc = (HttpURLConnection) url.openConnection();

            try {
                uc.connect();
                //uc.setDoOutput(true);
                OutputStreamWriter out = new OutputStreamWriter(uc.getOutputStream());
//                System.out.println("\n 3....");
                out.write(value_to_call);

                BufferedReader in = new BufferedReader(new InputStreamReader(uc.getInputStream()));
                while ((decodedString = in.readLine()) != null) {
                    String ack_text = decodedString;
                    otpStatus = ack_text != null && ack_text.contains("success");
                }
                in.close();
            } catch (Exception e) {
            }

            String respon = uc.getResponseMessage();
            if (respon != null && !respon.equalsIgnoreCase("") && !respon.equalsIgnoreCase("null")) {
                if (respon.equalsIgnoreCase("OK")) {
                    otpStatus = true;
                }
            }
            uc.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }
        return otpStatus;
    }// end method

}
