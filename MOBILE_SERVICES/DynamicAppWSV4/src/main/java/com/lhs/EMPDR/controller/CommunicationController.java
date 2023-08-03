/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.connection.RSconnectionProvider;
import com.lhs.EMPDR.dao.CommunicationDAO;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author ranjeet.kumar
 */
@Controller
public class CommunicationController {

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getCommunicationUserList")
    public @ResponseBody
    List<HashMap<String, String>> getCommunicationUserList(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword,
            @RequestParam("seqNo") String seqNo, @RequestParam("userParam") String userParam) throws Exception {
        List<HashMap<String, String>> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            CommunicationDAO communicationDAO = new CommunicationDAO(c);
            resStatus = communicationDAO.getCommunicationUserList(seqNo, userParam);
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return resStatus;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/composeMessage")
    public @ResponseBody
    HashMap<String, String> composeMessage(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword,
            @RequestParam("composeData") String composeData, @RequestParam("communicationChannelData") String communicationChannelData,
            @RequestParam("userDetails") String userDetails) throws Exception {
        HashMap<String, String> resStatus = null;
        Connection c = null;
        try {
            System.out.println("communicationChannelData --- > " + communicationChannelData);
            System.out.println("Compose --- > " + composeData);
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            CommunicationDAO communicationDAO = new CommunicationDAO(c);
            resStatus = communicationDAO.composeMessage(composeData, communicationChannelData, userDetails);
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return resStatus;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getChattingMsgList")
    public @ResponseBody
    List<HashMap<String, String>> getChattingMsgList(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword,
            @RequestParam("seqNo") String seqNo, @RequestParam("communicationChannelData") String communicationChannelData,
            @RequestParam("userDetails") String userDetails) throws Exception {
        List<HashMap<String, String>> resStatus = null;
        Connection c = null;
        try {
            System.out.println("communicationChannelData --- > " + communicationChannelData);
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            CommunicationDAO communicationDAO = new CommunicationDAO(c);
            resStatus = communicationDAO.getChattingMsgList(seqNo, communicationChannelData, userDetails);
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return resStatus;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/updateMsgStatus")
    public @ResponseBody
    HashMap<String, String> updateMsgStatus(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword,
            @RequestParam("communicationChannelData") String communicationChannelData,
            @RequestParam("userDetails") String userDetails) throws Exception {
        HashMap<String, String> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            CommunicationDAO communicationDAO = new CommunicationDAO(c);
            resStatus = communicationDAO.updateMsgStatus(communicationChannelData, userDetails);
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return resStatus;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/saveReplyMsg")
    public @ResponseBody
    HashMap<String, String> saveReplyMsg(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword, @RequestParam("replyMsg") String replyMsg,
            @RequestParam("msgData") String msgData, @RequestParam("communicationChannelData") String communicationChannelData,
            @RequestParam("userDetails") String userDetails) throws Exception {
        HashMap<String, String> resStatus = null;
        Connection c = null;
        try {
            System.out.println("communicationChannelData --- > " + communicationChannelData);
            System.out.println("Compose --- > " + msgData);
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            CommunicationDAO communicationDAO = new CommunicationDAO(c);
            resStatus = communicationDAO.saveReplyMsg(replyMsg, msgData, communicationChannelData, userDetails);
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return resStatus;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getAttachedImage")
    public @ResponseBody
    HashMap<String, Object> getAttachedImage(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword,
            @RequestParam("msgId") String msgId, @RequestParam("slno") String slno) throws Exception {
        HashMap<String, Object> resStatus = null;
        Connection c = null;
        try {
            System.out.println("msgId --- > " + msgId);
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            CommunicationDAO communicationDAO = new CommunicationDAO(c);
            resStatus = communicationDAO.getAttachedImage(msgId, slno);
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return resStatus;
    }

}
