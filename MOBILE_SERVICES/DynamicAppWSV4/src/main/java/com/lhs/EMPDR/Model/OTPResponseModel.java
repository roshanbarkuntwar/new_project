/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

/**
 *
 * @author abhijeet.joshi
 */
public class OTPResponseModel {
    
    private Boolean otpStatus;
    private String otpSuccessMessage;
    private String otpErrorMessage;
    private String otp;

    public Boolean getOtpStatus() {
        return otpStatus;
    }

    public void setOtpStatus(Boolean otpStatus) {
        this.otpStatus = otpStatus;
    }

    public String getOtpSuccessMessage() {
        return otpSuccessMessage;
    }

    public void setOtpSuccessMessage(String otpSuccessMessage) {
        this.otpSuccessMessage = otpSuccessMessage;
    }

    public String getOtpErrorMessage() {
        return otpErrorMessage;
    }

    public void setOtpErrorMessage(String otpErrorMessage) {
        this.otpErrorMessage = otpErrorMessage;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

}// End Class