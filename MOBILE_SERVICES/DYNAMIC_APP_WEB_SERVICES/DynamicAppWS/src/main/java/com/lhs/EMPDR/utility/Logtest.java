/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.utility;

import com.lhs.EMPDR.utility.Util;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.FileHandler;
import java.util.logging.Handler;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

/**
 *
 * @author premkumar.agrawal
 */
public class Logtest {

    public static final int FILE_SIZE = 1024 * 1024;

    public static Logger getLogger(String path, String fileName) throws IOException {
        Util util = new Util();
        Logger logger = Logger.getLogger(fileName);
        logger.setUseParentHandlers(false);
        FileHandler fh;

        try {
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HHmmss");
            Date date = new Date();
            // This block configure the logger with handler and formatter  
//            util.generateLog("Log file path=", path + fileName + ".%u.%g_" + dateFormat.format(date) + ".log");
            fh = new FileHandler(path + fileName + "_" + dateFormat.format(date) + ".log", FILE_SIZE, 1, true);
            logger.addHandler(fh);
            SimpleFormatter formatter = new SimpleFormatter();
            fh.setFormatter(formatter);

            // the following statement is used to log any messages  
//        logger.info("My first log");  
        } catch (SecurityException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

//    logger.info("Hi How r u?");  
        return logger;
    }

    public static void closeLogger(Logger log) {
        for (Handler h : log.getHandlers()) {
            h.close();   //must call h.close or a .LCK file will remain.
        }
    }
}
