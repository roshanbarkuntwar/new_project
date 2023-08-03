/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.JSONResult.DependentImageJSON;
import com.lhs.EMPDR.JSONResult.ListOfApprovalsJSON;
import com.lhs.EMPDR.JSONResult.MessageJSON;
import com.lhs.EMPDR.JSONResult.PartyListJSON;
import com.lhs.EMPDR.JSONResult.TypeOfApprovalsJSON;
import com.lhs.EMPDR.Model.ApprovalStatus;

import com.lhs.EMPDR.Model.DetailsOfApprovalsList;
import com.lhs.EMPDR.Model.ImageDetailsModel;
import com.lhs.EMPDR.Model.ListOfApprovalsModel;
import com.lhs.EMPDR.Model.PartyListModel;
import com.lhs.EMPDR.Model.TypesOfApprovalsModel;
import com.lhs.EMPDR.connection.RSconnectionProvider;
import com.lhs.EMPDR.dao.JDBCApproveApprovalsDAO;
import com.lhs.EMPDR.dao.JDBCDependentImageDAO;
import com.lhs.EMPDR.dao.JDBCDownloadDocDAO;
import com.lhs.EMPDR.dao.JDBCListOfApprovalsDAO;
import com.lhs.EMPDR.dao.JDBCdetailsOfApprovals;
import com.lhs.EMPDR.dao.JDBCfindTypesOfApprovals;
import com.lhs.EMPDR.entity.DocumentDetails;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author kirti.misal
 */
@Controller
public class ERPapprovalController {

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/typesOfApprovals", method = RequestMethod.GET)
    public @ResponseBody
    TypeOfApprovalsJSON typesOfApprovals(@PathVariable("dbName") String dbName, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") int seqNo, @RequestParam("userCode") String userCode, @RequestParam(value = "entityCode", required = false) String entityCode) throws SQLException {
        List<TypesOfApprovalsModel> approvalsList = new ArrayList<TypesOfApprovalsModel>();
        Connection connection = null;
        TypeOfApprovalsJSON json = new TypeOfApprovalsJSON();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCfindTypesOfApprovals jdbcDao = new JDBCfindTypesOfApprovals(connection);
            json = jdbcDao.findTypesOfApprovals(seqNo, userCode, entityCode);
//            json.setTypeOfApprovalsList(approvalsList);
        } catch (Exception e) {
            System.out.println("error==" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return json;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/listOfApprovals", method = RequestMethod.GET)
    public @ResponseBody
    ListOfApprovalsJSON listOfApprovals(@PathVariable("dbName") String dbName, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("entityCode") String entityCode, @RequestParam("userCode") String userCode,
            @RequestParam(value = "empCode", required = false) String empcode,
            @RequestParam("tnature") String tnature, @RequestParam("type") String type, @RequestParam(value = "searchText", required = false) String searchText, @RequestParam(value = "isOrderBookingList", required = false) String isOrderBookingList, @RequestParam(value = "seqId", required = false) String seqId, @RequestParam(value = "accode", required = false) String accode, @RequestParam(value = "pageNo", required = false) String pageNo,
            @RequestParam(value = "selectMonth", required = false) String selectMonth, @RequestParam(value = "defaultSearchText", required = false) String defaultSearchText,
            @RequestParam(value = "loginUserFlag", required = false) String loginUserFlag, @RequestParam(value = "geoOrgCode", required = false) String geoOrgCode)
            throws SQLException {

        Connection connection = null;
        ListOfApprovalsJSON json = new ListOfApprovalsJSON();
        try {

            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(connection);
            U.log("userCode :" + userCode);
            U.log("pageNo===>" + pageNo);
            U.log("defaultSearchText===>" + defaultSearchText);
            JDBCListOfApprovalsDAO jdbcDao = new JDBCListOfApprovalsDAO(connection);

            json = jdbcDao.findListOfApprovals(entityCode, tnature, userCode, type, isOrderBookingList, seqId, accode, pageNo, searchText, empcode, selectMonth, geoOrgCode, loginUserFlag, defaultSearchText);

        } catch (Exception e) {
            System.out.println("error==" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return json;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/detailsOfApprovals", method = RequestMethod.GET)
    public @ResponseBody
    DetailsOfApprovalsList detailsOfApprovals(@PathVariable("dbName") String dbName, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "tCode", required = false) String tCode,
            @RequestParam("userCode") String userCode,
            @RequestParam("tnature") String tnature,
            @RequestParam("vrDate") String vrDate,
            @RequestParam("accCode") String accCode,
            @RequestParam("vrno") String vrno,
            @RequestParam(value = "entityCode", required = false) String entityCode,
            @RequestParam(value = "seqId", required = false) String seqId,
            @RequestParam(value = "roIdSeq", required = false) String rowIdSeq, @RequestParam(value = "itemJson", required = false) String itemJson) throws SQLException {
        Connection connection = null;
        DetailsOfApprovalsList listobj = new DetailsOfApprovalsList();

        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(connection);
            JDBCdetailsOfApprovals jdbcDao = new JDBCdetailsOfApprovals(connection);
            listobj = jdbcDao.getDetailsOfApprovals(entity, tnature, tCode, vrno, vrDate, accCode, seqId, rowIdSeq, itemJson, entityCode);
        } catch (Exception e) {
            U.errorLog("error==" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return listobj;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/detailsOfApprovals", method = RequestMethod.POST)
    public @ResponseBody
    DetailsOfApprovalsList detailsOfApprovalsPost(@PathVariable("dbName") String dbName, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("tCode") String tCode,
            @RequestParam("userCode") String userCode,
            @RequestParam("tnature") String tnature,
            @RequestParam("vrDate") String vrDate,
            @RequestParam("accCode") String accCode,
            @RequestParam("vrno") String vrno,
            @RequestParam(value = "entityCode", required = false) String entityCode,
            @RequestParam(value = "seqId", required = false) String seqId,
            @RequestParam(value = "roIdSeq", required = false) String rowIdSeq, @RequestParam(value = "itemJson", required = false) String itemJson) throws SQLException {
        Connection connection = null;
        DetailsOfApprovalsList listobj = new DetailsOfApprovalsList();

        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(connection);
            JDBCdetailsOfApprovals jdbcDao = new JDBCdetailsOfApprovals(connection);
            listobj = jdbcDao.getDetailsOfApprovals(entity, tnature, tCode, vrno, vrDate, accCode, seqId, rowIdSeq, itemJson, entityCode);
        } catch (Exception e) {
            U.errorLog("error==" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return listobj;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/displayImage", method = RequestMethod.GET)
    public @ResponseBody
    ArrayList<ImageDetailsModel> displayImage(@PathVariable("dbName") String dbName, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "imgQuery", required = false) String imgQuery) {
        Connection connection = null;
        ArrayList<ImageDetailsModel> al = new ArrayList<ImageDetailsModel>();

        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCdetailsOfApprovals jdbcDao = new JDBCdetailsOfApprovals(connection);
            al = jdbcDao.getImageDetails(imgQuery);
        } catch (Exception e) {
            e.getMessage();
        } finally {
            try {
//                c.commit();
                connection.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        return al;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/updateApprovalStatus", method = RequestMethod.POST)
    public @ResponseBody
    MessageJSON ApproveApprovals(@PathVariable("dbName") String dbName, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("tCode") String tCode,
            @RequestParam("userCode") String userCode,
            @RequestParam("tnature") String tnature,
            @RequestParam("vrno") String vrno,
            @RequestParam("approveFlag") String approveFlag,
            @RequestParam("remark") String remark, @RequestParam("indentItemUpdate") String indentItemUpdate, @RequestParam("slno") String slno) throws SQLException {

        Connection connection = null;
        MessageJSON json = new MessageJSON();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(connection);
            JDBCApproveApprovalsDAO jdbcDao = new JDBCApproveApprovalsDAO(connection);
            json = jdbcDao.approveReject(entity, tCode, vrno, tnature, userCode, approveFlag, remark, indentItemUpdate, slno);
        } catch (Exception e) {
            U.errorLog("error==" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return json;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/paraDetailsOfApproval", method = RequestMethod.GET)
    public @ResponseBody
    ArrayList<ArrayList> paraDetailsOfApproval(@PathVariable("dbName") String dbName, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("entityCode") String entityCode,
            @RequestParam("userCode") String userCode,
            @RequestParam("tCode") String tCode,
            @RequestParam("vrno") String vrno,
            @RequestParam("vrDate") String vrDate,
            @RequestParam("value") String value,
            @RequestParam("seqId") String seqId,
            @RequestParam("slno") String slno,
            @RequestParam("tnature") String tnature) throws SQLException {
//        ArrayList<LinkedHashMap<String, String>> approvalsList = new ArrayList<LinkedHashMap<String, String>>();
        ArrayList<ArrayList> approvalsList = new ArrayList<ArrayList>();
        Connection connection = null;
        ListOfApprovalsJSON json = new ListOfApprovalsJSON();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(connection);
            JDBCListOfApprovalsDAO jdbcDao = new JDBCListOfApprovalsDAO(connection);
            approvalsList = jdbcDao.paraDetailsOfApproval(entityCode, tnature, userCode, tCode, vrno, value, seqId, slno, vrDate);
//            json.setListOfApprovals(approvalsList);
        } catch (Exception e) {
            U.errorLog("error==" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return approvalsList;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getDependentImage", method = RequestMethod.GET)
    public @ResponseBody
    DependentImageJSON getDependentImage(@PathVariable("dbName") String dbName, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam("replaceParameter") String replaceParameter) throws SQLException {
        Connection connection = null;
        DependentImageJSON json = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(connection);
            JDBCDependentImageDAO dao = new JDBCDependentImageDAO(connection);
            json = dao.getImages(seqNo, replaceParameter);
        } catch (Exception e) {
            U.errorLog("error==" + e);
        } finally {
            try {
                if (connection != null) {
                    connection.close();
                }
            } catch (Exception err) {
                System.out.println("error==>" + err);
            }
            connection = null;
        }
        return json;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getDependentDoc", method = RequestMethod.GET)
    public String download(@PathVariable("dbName") String dbName, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("rowId") String rowId, HttpServletResponse response) {

        Connection connection = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCDownloadDocDAO dao = new JDBCDownloadDocDAO(connection);
            DocumentDetails documentDetails = dao.getDocumentDetails(rowId);
            if (documentDetails != null) {
                byte[] bytes = documentDetails.getDocInputStream();
                if (bytes != null && bytes.length > 0) {
                    if (documentDetails.getDocType().equalsIgnoreCase("JPEG") || documentDetails.getDocType().equalsIgnoreCase("JPG") || documentDetails.getDocType().equalsIgnoreCase("PNG")) {
                        response.setContentType("image/JPG");
                    } else {
                        response.setContentType("application/octet-stream");
                        response.setHeader("Content-Disposition", "attachment;filename=temp." + documentDetails.getDocType());
                    }
                    response.getOutputStream().write(bytes);
                    response.getOutputStream().flush();
                    response.getOutputStream().close();
                }
            }
        } catch (Exception ex) {
        }
        return null;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/partyList", method = RequestMethod.GET)
    public @ResponseBody
    PartyListJSON partyList(@PathVariable("dbName") String dbName, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "searchText", required = false) String searchText,
            @RequestParam("pageNo") int pageNo, @RequestParam(value = "slno", required = false) String slno,
            @RequestParam("seqNo") int seqNo, @RequestParam("userCode") String userCode) throws SQLException {
        List<PartyListModel> approvalsList = new ArrayList<PartyListModel>();
        Connection connection = null;
        PartyListJSON json = new PartyListJSON();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(connection);
            JDBCfindTypesOfApprovals jdbcDao = new JDBCfindTypesOfApprovals(connection);
            json = jdbcDao.partyList(seqNo, userCode, pageNo, slno, searchText);
        } catch (Exception e) {
        } finally {
            connection.close();
            connection = null;
        }
        return json;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getDetailsOfParty", method = RequestMethod.GET)
    public @ResponseBody
    DetailsOfApprovalsList getDetailsOfParty(@PathVariable("dbName") String dbName, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo,
            @RequestParam("userCode") String userCode, @RequestParam("empCode") String empCode,
            @RequestParam(value = "entityCode", required = false) String entityCode,
            @RequestParam("accCode") String accCode) throws SQLException {
        Connection connection = null;
        DetailsOfApprovalsList listobj = new DetailsOfApprovalsList();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(connection);
            JDBCdetailsOfApprovals jdbcDao = new JDBCdetailsOfApprovals(connection);
            listobj = jdbcDao.getDetailsOfParty(seqNo, accCode, entityCode, empCode,userCode);
        } catch (Exception e) {
            U.errorLog("error==" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return listobj;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getPartyFilters", method = RequestMethod.GET)
    public @ResponseBody
    DetailsOfApprovalsList getPartyFilters(@PathVariable("dbName") String dbName, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo) throws SQLException {
        Connection connection = null;
        DetailsOfApprovalsList listobj = new DetailsOfApprovalsList();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(connection);
            JDBCdetailsOfApprovals jdbcDao = new JDBCdetailsOfApprovals(connection);
            listobj = jdbcDao.getPartyFilters(seqNo);
        } catch (Exception e) {
            U.errorLog("error==" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return listobj;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getApprovalStatus", method = RequestMethod.GET)
    public @ResponseBody
    ArrayList<ApprovalStatus> getApprovalStatus(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("entityCode") String entityCode, @RequestParam("tCode") String tCode,
            @RequestParam("VRNO") String vrno, @RequestParam("userCode") String userCode) throws SQLException {
        Connection connection = null;
        ArrayList<ApprovalStatus> status = new ArrayList<ApprovalStatus>();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(connection);
            JDBCdetailsOfApprovals jdbcDao = new JDBCdetailsOfApprovals(connection);
            status = jdbcDao.getApprovalStatus(entityCode, userCode, tCode, vrno);
//            json.setListOfApprovals(approvalsList);
        } catch (Exception e) {
            U.errorLog("error==" + e);
        } finally {
            connection.close();
            connection = null;
        }

        return status;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/updateStatusForapprovals", method = RequestMethod.POST)
    public @ResponseBody
    MessageJSON updateApprovals(@PathVariable("dbName") String dbName, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "tCode", required = false) String tCode,
            @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam(value = "tnature", required = false) String tnature,
            @RequestParam("vrno") String vrno,
            @RequestParam("entityCode") String entityCode,
            @RequestParam("series") String series,
            @RequestParam("seqNo") String seqNo,
            @RequestParam("geoorgcode") String geoorgcode,
            @RequestParam("approveFlag") String approveFlag,
            @RequestParam("user_level") String userLevel,
            @RequestParam("remark") String remark, @RequestParam("approvedBy") String approvedBy) throws SQLException {

        Connection connection = null;
        MessageJSON json = new MessageJSON();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(connection);
            U.log("controller====user_level===" + userLevel);
            JDBCApproveApprovalsDAO jdbcDao = new JDBCApproveApprovalsDAO(connection);
            json = jdbcDao.updateApprovals(seqNo, remark, approveFlag, vrno, tnature, userCode, tCode, approvedBy, series, entityCode, geoorgcode, userLevel);
        } catch (Exception e) {
            U.errorLog("error==" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return json;
    }
}
