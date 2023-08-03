/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.ResetPasswordJSON;
import com.lhs.EMPDR.mail.MailMail;
import com.lhs.EMPDR.mail.MailOfpassfKey;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.mail.MailParseException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCForgotpassword {

    Connection connection;
    Util utl = null;

    public JDBCForgotpassword(Connection con) {
        this.connection = con;
        U u = new U(this.connection);
        this.utl = new Util();
    }

    MailOfpassfKey mail = new MailOfpassfKey();
    private JavaMailSender mailSender = mail.getMailSender();

    public void sendMail(String from, String to, String subject, String msg, String name) throws IOException, MessagingException {
        //Using MailOfpassfKey class
        mailSender = mail.getMailSender();
        ApplicationContext context = new ClassPathXmlApplicationContext("Spring-Mail.xml");
        MailMail mm = (MailMail) context.getBean("mailMail");
        mailSender = mm.getMailSender();
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("quizAppTeam@gmail.com");
            helper.setTo(to);
            helper.setSubject("QuizApp verification Code");
            helper.setText("<b> LHS<b>");
        } catch (MessagingException e) {
            throw new MailParseException(e);
        }
        Date sendDate = new Date();
        message.setContent("<font color=\"#4d88ff\"><h5>Hi " + name + ",\n"
                + "<br><br>On " + sendDate.toString() + ", you made a request to reset your password.\n"
                + "<br>If you made this change, your reset key :" + msg + "\n"
                + "<br><br>Thanks,<br>\n"
                + "The LHS Team </font></h5>", "text/html");
        mailSender.send(message);

        /*
        SimpleMailMessage message = new SimpleMailMessage();
//		
        message.setFrom("quizAppTeam@gmail.com");
        message.setTo(to);
        message.setSubject("QuizApp vaerification Code");
        //  message.setText("Key=" + msg);
        
        message.setText("<b>We heard that you lost your QuizApp password. Sorry about that!<b>\n"
                + "\n"
                + "But don’t worry! You can use the following PASSWORD RESET KEY within 3 hours to reset your password:\n"
                + "\n"
                + "PASSWORD RESET KEY :" + msg + " \n"
                + "\n"
                + "If you don’t use this link within 3 hours, it will expire. To get a new password reset link, visit  app and resend request for new password reset key.\n"
                + "\n"
                + "Thanks,\n"
                + "Your friend QuizApp");

        try {
            mailSender.send(message);
          
                    } catch (Exception e) {
            //U.log("mail sendig error==" + e.getMessage());

        }*/
        //U.log(" mail has send");
    }

    public String getGUIkey(String emailId) throws SQLException {
        int key = 0;
        PreparedStatement ps = null;
        String sql;
        //validation of gmailid
        String validSql = "select * from user_mast where email='" + emailId + "'";
        U.log(validSql);
        PreparedStatement val = null;
        String name = "";
        try {
            val = connection.prepareStatement(validSql);
            //val.setString(1, emailId);
            //val.setString(2,userRegNo);
            ResultSet test = val.executeQuery();
            if (test != null && test.next()) {

                try {

                    key = 100000 + (int) (Math.random() * ((999999 - 100000) + 1));
                    U.log("key==" + key);

                    /*     DateFormat outputformat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                     //system date
                      //DateFormat dateFormat = new SimpleDateFormat("d/M/yyyy HH:mm:ss a");
                    Date date = new Date();
                    U.log(outputformat.format(date));
                    //up to valid
                    Date oldDate = date; // oldDate == current time
                    final long hoursInMillis = 60L * 60L * 1000L;
                    Date newDate = new Date(oldDate.getTime()
                            + (3L * hoursInMillis));
                    U.log("oldDate=" + oldDate + "newDate==" + newDate);
                    //convert date
                    java.sql.Date sqlDate = new java.sql.Date(oldDate.getTime());
                    //**************************
                    SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddhhmmss");
                    U.log("DAtE IS----" + outputformat.format(newDate));
                     */
//                    sql = "update user_mast set machine_host = '" + key + "' where EMAIL ='" + emailId + "'";
//
//                    ps = null;
//                    ps = connection.prepareStatement(sql);
//                    //ps.setString(1, emailId);
//                    U.log("sql----" + sql);
//                    try {
//                        Long startTime = System.currentTimeMillis();
//                        int result = ps.executeUpdate();
//                        Long endTime = System.currentTimeMillis();
//                        //U.log("****\nTime for Execute query of forgot Password");
//                        //U.log("startTime="+startTime);
//                        //U.log("endTime="+endTime);
//                        //U.log("finalTime="+(endTime-startTime));
//                        ps.close();
//                        // //U.log("resulttttt====" + result);
//                    } catch (SQLException e) {
//                    }
                    try {
                        sendMail("", emailId, "", key + "", name);
                        val.close();
                        return "Please check your email ,We have send you a unique key,Use this to reset your password";
                    } catch (IOException e) {
                        val.close();
                        return "Might be emailId is Wrong ,Please enter valid email ID.";
                    } catch (SQLException e) {
                    } catch (MessagingException e) {
                        val.close();
                        return "Might be emailId is Wrong ,Please enter valid email ID.";
                    } finally {
                    }

                } catch (SQLException e) {
                    val.close();
                    return "0";
                }
            } else {
                val.close();
                return "Not valid emailId";
            }
        } catch (SQLException sq) {
        }
        val.close();
        return "Fail";
    }

    public ResetPasswordJSON setGUIkey(String emailId, String key, String password) throws ParseException, SQLException {
        ResetPasswordJSON json = new ResetPasswordJSON();
        PreparedStatement ps = null;
        String sql;
        String result = "fail";

        String validSql = "select m.*,v.module from user_mast m , LHSSYS_USER_APP_KEY_VALIDATION v  where m.user_code=v.user_code and email=? and machine_host='" + key + "'";
        U.log(validSql);
        PreparedStatement val = null;
        String name = "";
        try {
            val = connection.prepareStatement(validSql);
            val.setString(1, emailId);
            ResultSet test = val.executeQuery();
            if (test != null && test.next()) {
                json.setUserCode(test.getString("user_code"));
                json.setUserName(test.getString("user_name"));
                json.setApptype(test.getString("module"));
                result = "success";
                json.setResult(result);
            }
            U.log("emailId : " + emailId);

            sql = "update user_mast set machine_host=?,PASSWORD=?"
                    + " where EMAIL=? and machine_host=?";
            ps = null;
            ps = connection.prepareStatement(sql);
            ps.setString(1, "");
            ps.setString(2, password);
            ps.setString(3, emailId);
            ps.setString(4, key);
            ps.executeUpdate();

        } catch (SQLException ex) {
            U.errorLog(ex);
            //  ps.close();
            json.setResult(result);
            return json;
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    U.errorLog(e);
                }
            }
            if (val != null) {
                try {
                    val.close();
                } catch (SQLException e) {
                    U.errorLog(e);
                }
            }
        }
        json.setResult(result);
        return json;
    }

    public String resetPassword(String loginId,String password) {
        String result = "error";
        
        String loginFlag = null;
        String updateQuery = null;
        
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        String Query = "select * from view_client_login_mast v where v.login_id='" + loginId + "'";
        try {
            ps = connection.prepareStatement(Query);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
               loginFlag = rs.getString("LOGIN_USER_FLAG");
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        } finally {
            if(ps!=null){
                try {
                    ps.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }
        
        if(!utl.isNull(loginFlag) && loginFlag.equalsIgnoreCase("E")){
            updateQuery = "update user_mast u set u.password = '"+ password +"' where u.user_code = '"+ loginId.toUpperCase() +"'";
        }else if(!utl.isNull(loginFlag) && loginFlag.equalsIgnoreCase("P")){
            updateQuery = "update acc_mast u set u.portal_pwd = '"+ password +"' where u.acc_code = '"+ loginId.toUpperCase() +"'";
        }else if(!utl.isNull(loginFlag) && loginFlag.equalsIgnoreCase("R")){
            updateQuery = "update retailer_mast u set u.portal_pwd = '"+ password +"' where u.retailer_code = '"+ loginId.toUpperCase() +"'";
        }
        
        
        try {
            ps = connection.prepareStatement(updateQuery);
            int i = ps.executeUpdate();
            if(i>0){
                result = "success";
            } else {
                result = "error";
            }
        } catch (SQLException ex) {
            result = "error";
            ex.printStackTrace();
        } finally {
            if(ps!=null){
                try {
                    ps.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }
        
        System.out.println("update result==>"+result);

        return result;
    }

}
