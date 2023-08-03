/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.Model.EmpProfileModel;
import com.lhs.EMPDR.Model.GraphLabelDetailModel;
import com.lhs.EMPDR.connection.RSconnectionProvider;
import com.lhs.EMPDR.dao.JDBCGetEmpProfileDAO;
import com.lhs.EMPDR.dao.JDBCTableLableDetailDAO;
import com.lhs.EMPDR.dao.TaskManagmentDAO;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author anjali.bhendarkar
 */
@Controller
public class TaskManagmentController {

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getTaskTabs")
    public @ResponseBody
    HashMap<String, Object> getTaskTabs(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
            @RequestParam("userCode") String userCode, @RequestParam("filterParam") String filterParam) throws Exception {
        HashMap<String, Object> taskTabs = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            TaskManagmentDAO obj = new TaskManagmentDAO(c);
            taskTabs = obj.getTaskTabs(userCode, seqNo, filterParam);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return taskTabs;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getTaskList")
    public @ResponseBody
    ArrayList<HashMap<String, Object>> getTaskList(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqId") String seqId,
            @RequestParam("userCode") String userCode, @RequestParam("taskPriority") String taskPriority,
            @RequestParam("filterParam") String filterParam) throws Exception {
        ArrayList<HashMap<String, Object>> taskTabs = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            TaskManagmentDAO obj = new TaskManagmentDAO(c);
            taskTabs = obj.getTaskList(userCode, seqId, taskPriority, filterParam);
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
        return taskTabs;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getTaskStatusList")
    public @ResponseBody
    ArrayList<HashMap<String, Object>> getTaskStatusList(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("taskSeqNo") String taskSeqNo,
            @RequestParam("userCode") String userCode) throws Exception {
        ArrayList<HashMap<String, Object>> taskTabs = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            TaskManagmentDAO obj = new TaskManagmentDAO(c);
            taskTabs = obj.getTaskStatusList(userCode, taskSeqNo);
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
        return taskTabs;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/updateTaskStatus")
    public @ResponseBody
    HashMap<String, String> updateTaskStatus(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("userCode") String userCode,
            @RequestParam("taskSeqNo") String taskSeqNo,
            @RequestParam("taskStatus") String taskStatus,
            @RequestParam("taskPersent") String taskPersent,
            @RequestParam("taskCode") String taskCode,
            @RequestParam("remark") String remark
    ) throws Exception {
        HashMap<String, String> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            TaskManagmentDAO obj = new TaskManagmentDAO(c);
            resStatus = obj.updateTaskStatus(userCode, taskSeqNo, taskStatus, remark, taskPersent, taskCode);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/updateTaskStatusRemark")
    public @ResponseBody
    HashMap<String, String> updateTaskStatusRemark(@PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword,
            @RequestParam("userCode") String userCode,
            @RequestParam("taskSeqNo") String taskSeqNo,
            @RequestParam("taskSlno") String taskSlno,
            @RequestParam("remark") String remark
    ) throws Exception {
        HashMap<String, String> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            TaskManagmentDAO obj = new TaskManagmentDAO(c);
            resStatus = obj.updateTaskStatusRemark(userCode, remark, taskSeqNo, taskSlno);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getVLCDashbordData")
    public @ResponseBody
    HashMap<String, Object> getVLCDashbordData(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("userCode") String userCode
    ) throws Exception {
        HashMap<String, Object> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            TaskManagmentDAO obj = new TaskManagmentDAO(c);
            resStatus = obj.getVLCDashbordData(userCode);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getStaffDashbordData")
    public @ResponseBody
    HashMap<String, Object> getStaffDashbordData(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("userCode") String userCode,
            @RequestParam("entityCode") String entityCode, @RequestParam("empCode") String empCode,
            @RequestParam("fromDate") String fromDate, @RequestParam("toDate") String toDate
    ) throws Exception {
        HashMap<String, Object> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            TaskManagmentDAO obj = new TaskManagmentDAO(c);
            resStatus = obj.getStaffDashbordData(userCode, entityCode, empCode, fromDate, toDate);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getTaskEntryDates")
    public @ResponseBody
    HashMap<String, Object> getTaskEntryDate(@PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword,
            @RequestParam("seqNo") String seqNo, @RequestParam("userCode") String userCode,
            @RequestParam("empCode") String empCode
    ) throws Exception {
        HashMap<String, Object> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            TaskManagmentDAO obj = new TaskManagmentDAO(c);
            resStatus = obj.getTaskEntryDates(seqNo, userCode, empCode);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getTaskByDate")
    public @ResponseBody
    HashMap<String, Object> getTaskByDate(@PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword,
            @RequestParam("userCode") String userCode, @RequestParam("empCode") String empCode,
            @RequestParam("taskDate") String taskDate,
            @RequestParam("seqNo") String seqNo
    ) throws Exception {
        HashMap<String, Object> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            TaskManagmentDAO obj = new TaskManagmentDAO(c);
            resStatus = obj.getTaskByDate(userCode, taskDate, seqNo, empCode);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getEmpLocation")
    public @ResponseBody
    HashMap<String, Object> getEmpLocation(@PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword,
            @RequestParam("userCode") String userCode, @RequestParam("empCode") String empCode,
            @RequestParam("visitDate") String visitDate,
            @RequestParam("seqNo") String seqNo
    ) throws Exception {
        HashMap<String, Object> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            TaskManagmentDAO obj = new TaskManagmentDAO(c);
            resStatus = obj.getEmpLocation(userCode, seqNo, empCode, visitDate);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getEmpProfile")
    public @ResponseBody
    EmpProfileModel getProfile(@PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword,
            @RequestParam("user_code") String user_code) throws Exception {
        Connection c = null;

        EmpProfileModel empProf = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);

            JDBCGetEmpProfileDAO empProfileDao = new JDBCGetEmpProfileDAO(c);

            empProf = empProfileDao.getProfile(user_code);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (c != null) {
                c.close();
            }
        }
        System.out.println("emp code : " + user_code + "empProf.empName : " + empProf.getEmpName());

        return empProf;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getMapDashbordData")
    public @ResponseBody
    ArrayList<HashMap<String, Object>> getMapDashbordData(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("userCode") String userCode, @RequestParam("filterParam") String filterParam
    ) throws Exception {
        ArrayList<HashMap<String, Object>> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            TaskManagmentDAO obj = new TaskManagmentDAO(c);
            resStatus = obj.getMapDashboardData(userCode, filterParam);
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
    
    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/cardListDetail")
    public @ResponseBody
    GraphLabelDetailModel cardListDetail( @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam(value = "vrno", required = false) String vrno,
            @RequestParam("entityCode") String entityCode, @RequestParam(value = "accCode", required = false) String accCode,
            @RequestParam(value = "valueFormat", required = false) String valueFormat
    ) {
        Connection c = null;
        GraphLabelDetailModel model = new GraphLabelDetailModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCTableLableDetailDAO dao = new JDBCTableLableDetailDAO(c);
//            List<GraphLabelDetailModel> model = (List<GraphLabelDetailModel>) dao.getPagedGraphDetailData(seqNo, userCode, pageNo, valueFormat);
            int pageNo = 0;
            model = dao.getCardListDetailData(seqNo, userCode, pageNo, valueFormat, entityCode, accCode, vrno);

        } catch (Exception e) {
            U.log(e);
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                    Logger.getLogger(DyanamicPageCreationController.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return model;
    }
}
