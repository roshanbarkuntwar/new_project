/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.utility;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.NoSuchProviderException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

/**
 *
 * @author harsh.satfale
 */
public class SendEmail {

    Connection connection;

    public SendEmail(Connection connection) {
        this.connection = connection;
    }
    
    public SendEmail() {
        
    }

    public void sendEmail(String vrno, String tcode, String entityCode, String accYear) throws InterruptedException, IOException {
//        public static void main(String[] args) {
        try {
            System.out.println("sendmail==" + vrno + "-" + tcode + "-" + entityCode + "-" + accYear);

            //  Process proc = Runtime.getRuntime().exec("java -jar C:\\UTILITY\\Quotation_Report.jar " + vrno + " " + tcode + " " + entityCode + " " + accYear + " " + " ");
//            ProcessBuilder pb = new ProcessBuilder("cmd", "/c", "C:\\UTILITY\\Quotation_Report.jar " + vrno + " " + tcode + " " + entityCode + " " + accYear + " " + " ");
            String text = "java -jar C:\\UTILITY\\Quotation_Report.jar " + vrno + " " + tcode + " " + entityCode + " " + accYear + " " + " ";

            String pathToExecute = "cmd /c start " + text;
            System.out.println("pathToExecute----" + pathToExecute);
            Runtime runtime = Runtime.getRuntime();
            Process p1 = runtime.exec(pathToExecute);
            InputStream is = p1.getInputStream();

//         Process proc = Runtime.getRuntime().exec("java -jar C:\\UTILITY\\Quotation_Report.jar SC19704-014 0 UI 19-20");
            //calling jar using cmd
//         ProcessBuilder pb = new ProcessBuilder("cmd", "/c", "C:\\UTILITY\\Quotation_Report.jar SC19704-014 0 UI 19-20");
//        proc.waitFor();
//        // Then retreive the process output
//        InputStream in = proc.getInputStream();
//        InputStream err = proc.getErrorStream();
//
//        byte b[] = new byte[in.available()];
//        in.read(b, 0, b.length);
//        System.out.println(new String(b));
//
//        byte c[] = new byte[err.available()];
//        err.read(c, 0, c.length);
//        System.out.println(new String(c));
        } catch (Exception ex) {
            Logger.getLogger(SendEmail.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    public void sendEmailItemDetails(String vrno, String tcode, String entityCode, String accYear, String accCode, String itemCode) {

        try {
            System.out.println("sendmail==" + vrno + "-" + tcode + "-" + entityCode + "-" + accYear + "-" + accCode + "-" + itemCode);

            Process proc = Runtime.getRuntime().exec("java -jar C:\\Quotation_Report\\Quotation_Report.jar" + vrno + " " + tcode + " " + entityCode + " " + accYear + " " + accCode + " " + itemCode);
        } catch (Exception e) {
            Logger.getLogger(SendEmail.class.getName()).log(Level.SEVERE, null, e);
            e.printStackTrace();
        }

    }

    public boolean sendEMail(String fromAddress, String password, String toAddress_str, String cc, String bcc, String subject, String message, String attachmentLocationString, String host, String port) throws NoSuchProviderException, MessagingException {
        boolean result = false;

        try {
            String fileDelim = "\\;";
            String delimiter = "\\,";

            System.out.println("setting up mail properties....");
            Properties props = new Properties();
            props.setProperty("mail.transport.protocol", "smtps");
            props.setProperty("mail.smtps.auth", "true");
            props.setProperty("mail.host", host);
            props.setProperty("mail.port", port);
            props.setProperty("mail.user", fromAddress);
            props.setProperty("mail.password", password);

            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.ssl.trust", host);

            props.put("mail.smtp.auth", "true");

//            System.out.println("email id : " + fromAddress);
//            System.out.println("password : " + password);
//            System.out.println("host : " + host);
//            System.out.println("port :" + port);
            Session session = Session.getDefaultInstance(props);
            Transport transport = session.getTransport("smtp");
            MimeMessage mimeMessage = new MimeMessage(session);
            Multipart multiPart = new MimeMultipart();
            mimeMessage.setSubject(subject);

            if ((toAddress_str != null) && (!toAddress_str.equals(""))) {
                String[] toAddress = toAddress_str.split(delimiter);
                for (String toAddres : toAddress) {
                    try {
                        String tmp_to_add = toAddres.trim();
                        mimeMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(tmp_to_add));
                    } catch (MessagingException ex) {
                        System.out.println(ex.getMessage());
                    }
                }
            } else {
                System.out.println("To address not provided, can not sent mail");
            }

            if ((cc != null) && (!cc.equals(""))) {
                String[] ccMailid = cc.split(delimiter);
                for (String ccMailid1 : ccMailid) {
                    try {
                        String tmp_cc_add = ccMailid1.trim();
                        mimeMessage.addRecipient(Message.RecipientType.CC, new InternetAddress(tmp_cc_add));
                    } catch (MessagingException ex) {
                        System.out.println(ex.getMessage());
                    }
                }
            }

            if ((bcc != null) && (!bcc.equals(""))) {
                String[] bccMailid = bcc.split(delimiter);
                for (String bccMailid1 : bccMailid) {
                    try {
                        String tmp_bcc_add = bccMailid1.trim();
                        mimeMessage.addRecipient(Message.RecipientType.BCC, new InternetAddress(tmp_bcc_add));
                    } catch (MessagingException ex) {
                        System.out.println(ex.getMessage());
                    }
                }
            }

            MimeBodyPart textBodyPart = new MimeBodyPart();
            textBodyPart.setContent(message, "text/HTML");

            multiPart.addBodyPart(textBodyPart);
            mimeMessage.setContent(multiPart);
            mimeMessage.setFrom(new InternetAddress(fromAddress));

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(textBodyPart);

            if ((attachmentLocationString != null) && (!attachmentLocationString.equals("")) && (!attachmentLocationString.equals("###")) && (attachmentLocationString.length() > 0)) {
                System.out.println("Processing attachment(s)...");
                String[] AllFilePaths;
                try {
                    AllFilePaths = attachmentLocationString.split(fileDelim);
                } catch (Exception e) {
                    AllFilePaths = null;
                }
                if (AllFilePaths != null) {
                    for (String filepath : AllFilePaths) {
                        String attachement_file_name;
                        try {
                            filepath = filepath.trim();
                            attachement_file_name = filepath.substring(filepath.lastIndexOf(File.separator) + 1, filepath.length());
                        } catch (Exception e) {
                            attachement_file_name = "";
                        }
                        System.out.println("attaching file : " + attachement_file_name);
                        if ((attachement_file_name != null) && (!attachement_file_name.equalsIgnoreCase("")) && (attachement_file_name.length() > 1)) {
                            boolean fileattached = true;
                            MimeBodyPart attachmentPart = new MimeBodyPart();
                            try {
                                attachmentPart.attachFile(new File(filepath));
                            } catch (Exception e) {
                                fileattached = false;
                            }
                            if (!fileattached) {
                                System.out.println("Retrying Attachment..");
                                try {
                                    DataSource fileDataSource = new FileDataSource(filepath);
                                    attachmentPart.setDataHandler(new DataHandler(fileDataSource));
                                    attachmentPart.setFileName(attachement_file_name);
                                } catch (Exception e) {
                                    fileattached = false;
                                    System.out.println(e.getMessage());
                                }
                            }

                            if (attachement_file_name.toLowerCase().endsWith("pdf")) {
                                attachmentPart.setHeader("Content-Type", "application/pdf");
                            } else if ((attachement_file_name.toLowerCase().endsWith("jpg")) || (attachement_file_name.toLowerCase().endsWith("bmp")) || (attachement_file_name.toLowerCase().endsWith("gif")) || (attachement_file_name.toLowerCase().endsWith("png")) || (attachement_file_name.toLowerCase().endsWith("tif")) || (attachement_file_name.toLowerCase().endsWith("jpeg"))) {
                                attachmentPart.setHeader("Content-Type", "image/gif");
                            } else if ((attachement_file_name.toLowerCase().endsWith("txt")) || (attachement_file_name.toLowerCase().endsWith("csv"))) {
                                attachmentPart.setHeader("Content-Type", "text/plain");
                            } else if ((attachement_file_name.toLowerCase().endsWith("doc")) || (attachement_file_name.toLowerCase().endsWith("docx"))) {
                                attachmentPart.setHeader("Content-Type", "application/msword");
                            } else if ((attachement_file_name.toLowerCase().endsWith("xls")) || (attachement_file_name.toLowerCase().endsWith("xlsx"))) {
                                attachmentPart.setHeader("Content-Type", "application/vnd.ms-excel");
                            } else if ((attachement_file_name.toLowerCase().endsWith("ppt")) || (attachement_file_name.toLowerCase().endsWith("pptx"))) {
                                attachmentPart.setHeader("Content-Type", "application/ppt");
                            } else {
                                attachmentPart.setHeader("Content-Type", "application/octet-stream");
                            }
                            attachmentPart.setHeader("Content-Transfer-Encoding", "base64");

                            multipart.addBodyPart(attachmentPart);

                            if (fileattached) {
                                System.out.println("file(" + attachement_file_name + ") attached");
                            }
                        } else {
                            System.out.println("Could not attche file : " + attachement_file_name);
                        }
                    }
                }
            }
            mimeMessage.setContent(multipart);
            System.out.println("connecting with mail server...");
            transport.connect(host, fromAddress, password);
            System.out.println("sending mail...");
            transport.sendMessage(mimeMessage, mimeMessage.getAllRecipients());
            System.out.println("mail sent successfully...");
            transport.close();
            System.out.println("connection closed with mail server...");
            result = true;
        } catch (MessagingException ex) {
            System.err.println("Error in sending mail");
            System.out.println("\n\n\n\n-----------Error Details------------");
            ex.printStackTrace();
            result = false;
        }

        return result;
    }// End Method

}
