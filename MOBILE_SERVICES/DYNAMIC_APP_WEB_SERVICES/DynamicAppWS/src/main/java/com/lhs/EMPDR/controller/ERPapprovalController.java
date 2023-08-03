/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.JSONResult.DataInfoListJSON;
import com.lhs.EMPDR.JSONResult.DependentImageJSON;
import com.lhs.EMPDR.JSONResult.ListOfApprovalsJSON;
import com.lhs.EMPDR.JSONResult.MessageJSON;
import com.lhs.EMPDR.JSONResult.PartyListJSON;
import com.lhs.EMPDR.JSONResult.TypeOfApprovalsJSON;
import com.lhs.EMPDR.Model.ApprovalStatus;

import com.lhs.EMPDR.Model.DetailsOfApprovalsList;
import com.lhs.EMPDR.Model.GenericCodeNameModel;
import com.lhs.EMPDR.Model.ImageDetailsModel;
import com.lhs.EMPDR.Model.ListOfApprovalsModel;
import com.lhs.EMPDR.Model.PartyListFilterModel;
import com.lhs.EMPDR.Model.PartyListModel;
import com.lhs.EMPDR.Model.TypesOfApprovalsModel;
import com.lhs.EMPDR.connection.RSconnectionProvider;
import com.lhs.EMPDR.dao.FindDataInfoArrayDAO;
import com.lhs.EMPDR.dao.JDBCApproveApprovalsDAO;
import com.lhs.EMPDR.dao.JDBCDependentImageDAO;
import com.lhs.EMPDR.dao.JDBCDownloadDocDAO;
import com.lhs.EMPDR.dao.JDBCListOfApprovalsDAO;
import com.lhs.EMPDR.dao.JDBCdetailsOfApprovals;
import com.lhs.EMPDR.dao.JDBCfindTypesOfApprovals;
import com.lhs.EMPDR.entity.DocumentDetails;
import com.lhs.EMPDR.dao.JDBCParyListDAO;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletResponse;
import org.json.simple.parser.ParseException;
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/typesOfApprovals", method = RequestMethod.GET)
    public @ResponseBody
    TypeOfApprovalsJSON typesOfApprovals(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") int seqNo, @RequestParam("userCode") String userCode, @RequestParam("entityCode") String entityCode) throws SQLException {
        List<TypesOfApprovalsModel> approvalsList = new ArrayList<TypesOfApprovalsModel>();
        Connection connection = null;
        TypeOfApprovalsJSON json = new TypeOfApprovalsJSON();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCfindTypesOfApprovals jdbcDao = new JDBCfindTypesOfApprovals(connection);
            json = jdbcDao.findTypesOfApprovals(seqNo, userCode, entityCode);
//            json.setTypeOfApprovalsList(approvalsList);
        } catch (Exception e) {
            System.out.println("error==1" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return json;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/listOfApprovals", method = RequestMethod.GET)
    public @ResponseBody
    ListOfApprovalsJSON listOfApprovals(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("entityCode") String entityCode, @RequestParam("userCode") String userCode,
            @RequestParam("tnature") String tnature, @RequestParam("type") String type,
            @RequestParam(value = "seq_no", required = false) String seq_no,
            @RequestParam(value = "selectMonth", required = false) String selectMonth,
            @RequestParam(value = "slno", required = false) String slno,
            @RequestParam(value = "filterJson", required = false) String filterJson,
            @RequestParam(value = "pageNo", required = false) String pageNo)
            throws SQLException, ParseException {
        List<ListOfApprovalsModel> approvalsList = new ArrayList<ListOfApprovalsModel>();
        Connection connection = null;
        ListOfApprovalsJSON json = new ListOfApprovalsJSON();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCListOfApprovalsDAO jdbcDao = new JDBCListOfApprovalsDAO(connection);
            json = jdbcDao.findListOfApprovals(entityCode, tnature, userCode, type, slno, seq_no, selectMonth, pageNo, filterJson);
        } catch (Exception e) {
            System.out.println("error==2" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return json;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/detailsOfApprovals", method = RequestMethod.GET)
    public @ResponseBody
    DetailsOfApprovalsList detailsOfApprovals(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("tCode") String tCode,
            @RequestParam("userCode") String userCode,
            @RequestParam("tnature") String tnature,
            @RequestParam("vrDate") String vrDate,
            @RequestParam("accCode") String accCode,
            @RequestParam("vrno") String vrno,
            @RequestParam(value = "entityCode", required = false) String entityCode) throws SQLException {
        Connection connection = null;
        DetailsOfApprovalsList listobj = new DetailsOfApprovalsList();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCdetailsOfApprovals jdbcDao = new JDBCdetailsOfApprovals(connection);
            if (entityCode != null && !entityCode.isEmpty()) {
                entity = entityCode;
            }
            listobj = jdbcDao.getDetailsOfApprovals(entity, tnature, tCode, vrno, vrDate, accCode);
        } catch (Exception e) {
            System.out.println("error==3" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return listobj;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/updateApprovalStatus", method = RequestMethod.GET)
    public @ResponseBody
    MessageJSON ApproveApprovals(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("tCode") String tCode,
            @RequestParam("userCode") String userCode,
            @RequestParam("tnature") String tnature,
            @RequestParam("vrno") String vrno,
            @RequestParam("approveFlag") String approveFlag,
            @RequestParam("remark") String remark,
            @RequestParam("indentItemUpdate") String indentItemUpdate,
            @RequestParam("slno") String slno,
            @RequestParam("entityCode") String entityCode) throws SQLException {

        Connection connection = null;
        MessageJSON json = new MessageJSON();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCApproveApprovalsDAO jdbcDao = new JDBCApproveApprovalsDAO(connection);
            json = jdbcDao.approveReject(entityCode, tCode, vrno, tnature, userCode, approveFlag, remark, indentItemUpdate, slno);
        } catch (Exception e) {
            System.out.println("error In updateApprovalStatus--> " + e);
        } finally {
            connection.close();
            connection = null;
        }
        return json;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/paraDetailsOfApproval", method = RequestMethod.GET)
    public @ResponseBody
    ArrayList<LinkedHashMap<String, String>> paraDetailsOfApproval(@PathVariable("dbName") String dbName,
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
        ArrayList<LinkedHashMap<String, String>> approvalsList = new ArrayList<LinkedHashMap<String, String>>();
        Connection connection = null;
        ListOfApprovalsJSON json = new ListOfApprovalsJSON();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCListOfApprovalsDAO jdbcDao = new JDBCListOfApprovalsDAO(connection);
            approvalsList = jdbcDao.paraDetailsOfApproval(entityCode, tnature, userCode, tCode, vrno, value, seqId, slno, vrDate);
//            json.setListOfApprovals(approvalsList);
        } catch (Exception e) {
            System.out.println("error==4" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return approvalsList;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/getApprovalStatus", method = RequestMethod.GET)
    public @ResponseBody
    ArrayList<ApprovalStatus> getApprovalStatus(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("entityCode") String entityCode, @RequestParam("tCode") String tCode,
            @RequestParam("VRNO") String vrno, @RequestParam("userCode") String userCode) throws SQLException {
        Connection connection = null;
        ArrayList<ApprovalStatus> status = new ArrayList<ApprovalStatus>();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCdetailsOfApprovals jdbcDao = new JDBCdetailsOfApprovals(connection);
            status = jdbcDao.getApprovalStatus(entityCode, userCode, tCode, vrno);
//            json.setListOfApprovals(approvalsList);
        } catch (Exception e) {
            System.out.println("error==5" + e);
        } finally {
            connection.close();
            connection = null;
        }

        return status;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/getDependentImage", method = RequestMethod.GET)
    public @ResponseBody
    DependentImageJSON getDependentImage(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam("replaceParameter") String replaceParameter) throws SQLException {
        Connection connection = null;
        DependentImageJSON json = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCDependentImageDAO dao = new JDBCDependentImageDAO(connection);
            json = dao.getImages(seqNo, replaceParameter);
        } catch (Exception e) {
            System.out.println("error==6" + e);
        } finally {
            try {
                if (connection != null) {
                    connection.close();
                }
            } catch (Exception err) {
                System.out.println("error==>7" + err);
            }
            connection = null;
        }
        return json;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/getDependentDoc", method = RequestMethod.GET)
    public String download(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("rowId") String rowId, HttpServletResponse response) {

        Connection connection = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/partyList", method = RequestMethod.GET)
    public @ResponseBody
    PartyListJSON partyList(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "searchText", required = false) String searchText,
            @RequestParam("pageNo") int pageNo, @RequestParam(value = "slno", required = false) String slno,
            @RequestParam("seqNo") int seqNo, @RequestParam("userCode") String userCode) throws SQLException {
        List<PartyListModel> approvalsList = new ArrayList<PartyListModel>();
        Connection connection = null;
        PartyListJSON json = new PartyListJSON();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCParyListDAO jdbcDao = new JDBCParyListDAO(connection);
            json = jdbcDao.partyList(seqNo, userCode, pageNo, slno, searchText);
        } catch (Exception e) {
        } finally {
            connection.close();
            connection = null;
        }
        return json;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/getDetailsOfParty", method = RequestMethod.GET)
    public @ResponseBody
    DetailsOfApprovalsList getDetailsOfParty(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo,
            @RequestParam("userCode") String userCode,
            @RequestParam(value = "entityCode", required = false) String entityCode,
            @RequestParam("accCode") String accCode) throws SQLException {
        Connection connection = null;
        DetailsOfApprovalsList listobj = new DetailsOfApprovalsList();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCdetailsOfApprovals jdbcDao = new JDBCdetailsOfApprovals(connection);
            listobj = jdbcDao.getDetailsOfParty(seqNo, accCode, entityCode);
        } catch (Exception e) {
            System.out.println("error==8" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return listobj;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/getPartyFilters", method = RequestMethod.GET)
    public @ResponseBody
    ArrayList<PartyListFilterModel> getPartyFilters(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo) throws SQLException {
        Connection connection = null;
        ArrayList<PartyListFilterModel> listobj = new ArrayList<PartyListFilterModel>();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCParyListDAO jdbcDao = new JDBCParyListDAO(connection);
            listobj = jdbcDao.getPartyFilters(seqNo);
        } catch (Exception e) {
            System.out.println("error==9" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return listobj;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/getPartyFiltersLOV", method = RequestMethod.GET)
    public @ResponseBody
    ArrayList<GenericCodeNameModel> getPartyFiltersLOV(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam("slno") String slno, @RequestParam("userCode") String userCode) throws SQLException {
        Connection connection = null;
        ArrayList<GenericCodeNameModel> listobj = new ArrayList<GenericCodeNameModel>();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCParyListDAO jdbcDao = new JDBCParyListDAO(connection);
            listobj = jdbcDao.getPartyFiltersLOV(userCode, seqNo, slno);
        } catch (Exception e) {
            System.out.println("error==10" + e);
        } finally {
            connection.close();
            connection = null;
        }
        return listobj;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/findDataInfoArray", method = RequestMethod.GET)
    public @ResponseBody
    DataInfoListJSON findDataInfoArray(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
            @RequestParam("primeryKeyValue") String primeryKeyValue, @RequestParam("userCode") String userCode, @RequestParam("accCode") String accCode,
            @RequestParam(value = "isAddonTempEntry", required = false) String isAddonTempEntry) {
        Connection c = null;
        DataInfoListJSON dataInfoListJSON = new DataInfoListJSON();

        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            FindDataInfoArrayDAO dataInfoDao = new FindDataInfoArrayDAO(c);
            dataInfoListJSON = dataInfoDao.getDataInfoList(primeryKeyValue, seqNo, isAddonTempEntry, userCode, accCode);
        } catch (Exception e) {
            e.getMessage();
        } finally {
            try {
//                c.commit();
                c.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        return dataInfoListJSON;
    }
    
    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/displayImage", method = RequestMethod.GET)
    public @ResponseBody
    ArrayList <ImageDetailsModel> displayImage(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, 
            @RequestParam("entityCode") String entityCode, @RequestParam("vrno") String vrno, @RequestParam(value="slno",required = false) String slno,
            @RequestParam(value = "tcode", required = false) String tcode) {
        Connection c = null;
        ArrayList <ImageDetailsModel> al = new ArrayList<ImageDetailsModel>();

        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCdetailsOfApprovals dataInfoDao = new JDBCdetailsOfApprovals(c);
            al = dataInfoDao.getImageDetails(entityCode,slno,tcode,vrno);
        } catch (Exception e) {
            e.getMessage();
        } finally {
            try {
//                c.commit();
                c.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        return al;
    }
    
}
