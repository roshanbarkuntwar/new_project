/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.OTPResponseModel;
import com.lhs.EMPDR.utility.SendEmail;
import com.lhs.EMPDR.utility.SendSMS;
import com.lhs.EMPDR.utility.Util;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Random;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

/**
 *
 * @author abhijeet.joshi
 */
public class JDBCSendOTPDAO {

    private Connection connection = null;
    private Util utl = null;

    public JDBCSendOTPDAO(Connection conn) {
        this.connection = conn;
        utl = new Util();
    }

    public OTPResponseModel sendOTP(String loginId) {
        OTPResponseModel output = new OTPResponseModel();
        String generatedOTP = null;
        String user = null;
        String emailId = null;
        String mobileNo = null;
        Boolean emailOTPStatus = false;
        Boolean mobileOTPStatus = false;
        try {
            PreparedStatement psmt = null;
            ResultSet rs = null;
            
            String otpDetailsQuery = "select v.client_name username, v.email emailid, v.mobile_notification mobileno from view_client_login_mast v where v.login_id = '" + loginId + "'";
            System.out.println("otpDetailsQuery --> \n"+otpDetailsQuery);
            try {
                psmt = connection.prepareStatement(otpDetailsQuery);
                rs = psmt.executeQuery();
                if (rs != null && rs.next()) {
                    user = rs.getString("username");
                    user = utl.isNull(user) ? "user" : user;
                    emailId = rs.getString("emailid");
                    mobileNo = rs.getString("mobileno");
                }
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(rs != null) {
                    rs.close();
                }
                if(psmt != null) {
                    psmt.close();
                }
            }
            
            if (!utl.isNull(emailId) || !utl.isNull(mobileNo)) {
                generatedOTP = getGeneratedRandomOTP(4);
                if(!utl.isNull(generatedOTP)) {
                    if (!utl.isNull(emailId)) {
                        if (validateEmail(emailId)) {
                            emailOTPStatus = sendOTPOnEmail(user, emailId, generatedOTP);
                        } else {
                            emailOTPStatus = false;
                            System.out.println("Invalid Email Id : " + emailId);
                        }
                    } else {
                        emailOTPStatus = false;
                        System.out.println("Email Id not found");
                    }
                    if (!utl.isNull(mobileNo)) {
                        if (validatePhoneNumber(mobileNo)) {
                            mobileOTPStatus = sendOTPOnMobile(user, mobileNo, generatedOTP);
                        } else {
                            mobileOTPStatus = false;
                            System.out.println("Invalid Mobile no. : " + mobileNo);
                        }
                    } else {
                        mobileOTPStatus = false;
                        System.out.println("Mobile no. not found");
                    }
                }
            } else {
                emailOTPStatus = false;
                mobileOTPStatus = false;
                System.out.println("Both Email Id and Mobile No. not found");
            }
            
            if(!emailOTPStatus && !mobileOTPStatus) {
                output.setOtpStatus(false);
                output.setOtpSuccessMessage(null);
                output.setOtpErrorMessage("Unable to send OTP on email as well as mobile.");
                output.setOtp(null);
            } else if(emailOTPStatus && !mobileOTPStatus) {
                output.setOtpStatus(true);
                output.setOtpSuccessMessage("OTP sent successfully on email.");
                output.setOtpErrorMessage("Unable to send OTP on mobile.");
                output.setOtp(generatedOTP);
            } else if(mobileOTPStatus && !emailOTPStatus) {
                output.setOtpStatus(true);
                output.setOtpSuccessMessage("OTP sent successfully on mobile.");
                output.setOtpErrorMessage("Unable to send OTP on email.");
                output.setOtp(generatedOTP);
            } else {
                output.setOtpStatus(true);
                output.setOtpSuccessMessage("OTP sent successfully on email as well as mobile.");
                output.setOtpErrorMessage(null);
                output.setOtp(generatedOTP);
            }
            
        } catch (Exception ex) {
            output.setOtpStatus(false);
            ex.printStackTrace();
        }

        return output;
    }// End Method

    private Boolean sendOTPOnEmail(String user, String emailId, String generatedOTP) {
        Boolean status = false;
        String fromEmailAddr = null;
        String fromEmailAddrPwd = null;
        String fromEmailAddrHost = null;
        String fromEmailAddrPort = null;
        
        try {
            PreparedStatement psmt = null;
            ResultSet rs = null;
            
            String fromEmailAddrQuery = "select p.parameter_value from lhssys_parameters p where p.parameter_name = 'MAIL_FROM_ADDR_CRM'";
            try {
                psmt = connection.prepareStatement(fromEmailAddrQuery);
                rs = psmt.executeQuery();
                if(rs != null && rs.next()) {
                    fromEmailAddr = rs.getString(1);
                }
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(rs != null) {
                    rs.close();
                }
                if(psmt != null) {
                    psmt.close();
                }
            }
            
            String fromEmailAddrPwdQuery = "select p.parameter_value from lhssys_parameters p where p.parameter_name = 'MAIL_FROM_ADDR_PWD_CRM'";
            try {
                psmt = connection.prepareStatement(fromEmailAddrPwdQuery);
                rs = psmt.executeQuery();
                if(rs != null && rs.next()) {
                    fromEmailAddrPwd = rs.getString(1);
                }
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(rs != null) {
                    rs.close();
                }
                if(psmt != null) {
                    psmt.close();
                }
            }
            
            String fromEmailAddrHostQuery = "select p.parameter_value from lhssys_parameters p where p.parameter_name = 'MAIL_HOST_CRM'";
            try {
                psmt = connection.prepareStatement(fromEmailAddrHostQuery);
                rs = psmt.executeQuery();
                if(rs != null && rs.next()) {
                    fromEmailAddrHost = rs.getString(1);
                }
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(rs != null) {
                    rs.close();
                }
                if(psmt != null) {
                    psmt.close();
                }
            }
            
            String fromEmailAddrPortQuery = "select p.parameter_value from lhssys_parameters p where p.parameter_name = 'MAIL_PORT_CRM'";
            try {
                psmt = connection.prepareStatement(fromEmailAddrPortQuery);
                rs = psmt.executeQuery();
                if(rs != null && rs.next()) {
                    fromEmailAddrPort = rs.getString(1);
                }
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(rs != null) {
                    rs.close();
                }
                if(psmt != null) {
                    psmt.close();
                }
            }
            
            String emailOTPSubject = emailOTPSubject = "OTP for login.";
            
            StringBuilder sb = new StringBuilder();
            sb.append("<p>Dear ").append(user).append(",</p>");
            sb.append("<p>Your OTP for one time login is &nbsp;<strong>").append(generatedOTP).append("</strong>&nbsp;. Do not share this OTP with anyone.</p>");
            sb.append("<p>&nbsp;</p>");
            sb.append("<p><small><span style=\"color:gray\"><strong>Note:&nbsp;*** This is an auto-generated email, please do not reply ***</strong></span></small></p>");
            String emailOTPMessage = sb.toString();
            
            status = new SendEmail().sendEMail(fromEmailAddr, fromEmailAddrPwd, emailId, "", "", emailOTPSubject, emailOTPMessage, "", fromEmailAddrHost, fromEmailAddrPort);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return status;
    }// End Method
    
    private Boolean sendOTPOnMobile(String user, String mobileNo, String generatedOTP) {
        Boolean status = false;
        String smsUrl = null;
        try {
            PreparedStatement psmt = null;
            ResultSet rs = null;
            
            String smsUrlQuery = "select p.parameter_value from lhssys_parameters p where p.parameter_name = 'SMS_URL_CRM'";
            try {
                psmt = connection.prepareStatement(smsUrlQuery);
                rs = psmt.executeQuery();
                if(rs != null && rs.next()) {
                    smsUrl = rs.getString(1);
                }
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(rs != null) {
                    rs.close();
                }
                if(psmt != null) {
                    psmt.close();
                }
            }
            
            if(!utl.isNull(smsUrl)) {
                StringBuilder sb = new StringBuilder();
                sb.append("Dear ").append(user).append(", \n");
                sb.append("Your OTP for one time login is ").append(generatedOTP).append(". Do not share this OTP with anyone.");
                String mobileOTPMessage = sb.toString();
                
                String STR_TO_NUMBER = URLEncoder.encode(mobileNo, "UTF-8");
		String STR_TO_MESSAGE = URLEncoder.encode(mobileOTPMessage, "UTF-8");
                                                
                smsUrl = smsUrl.replaceAll("STR_TO_NUMBER", STR_TO_NUMBER);
                smsUrl = smsUrl.replaceAll("STR_TO_MESSAGE", STR_TO_MESSAGE);
                
                status = new SendSMS().sendSMS(smsUrl);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return status;
    }// End Method

    private Boolean validateEmail(String emailId) {
        Boolean result = true;
        try {
            InternetAddress emailAddress = new InternetAddress(emailId);
            emailAddress.validate();
        } catch (AddressException ex) {
            result = false;
        }

        return result;
    }// End Method

    private Boolean validatePhoneNumber(String mobileNo) {
        Boolean result;
        if (mobileNo.matches("\\d{10}")) {
            result = true;
        } else {
            result = false;
        }

        return result;
    }// End Method

    private String getGeneratedRandomOTP(int len) {
        StringBuilder sb = new StringBuilder();
        try {
            // Using numeric values
            String numbers = "0123456789";
            // Using random method
            Random rndm_method = new Random();
            for (int i = 0; i < len; i++) {
                // Use of charAt() method : to get character value
                // Use of nextInt() as it is scanning the value as int
                sb.append(numbers.charAt(rndm_method.nextInt(numbers.length())));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("Your OTP is : " + sb.toString());

        return sb.toString();
    }// End Method

}// End Class
