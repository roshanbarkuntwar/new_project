/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.utility;

/**
 *
 * @author trainee
 */
import com.lhs.EMPDR.connection.RSconnectionProvider;
import java.lang.reflect.Field;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import com.lhs.EMPDR.utility.LhsStringUtility;

/**
 *
 * @author devendra.kushwaha
 */
public class GlobalDoWorkInterfaceExecuter {

    Connection connection;

    Long longFunctionOutput = 0l;
    int integerFunctionOutput = 0;
    String stringFunctionOutput = "";
    boolean crudFunctionOutput = false;
    ArrayList<ArrayList<String>> listOfListFunctionOutput = new ArrayList<ArrayList<String>>();
    HashMap<String, String> hashMapOfListFunctionOutput = new HashMap<String, String>();
    ArrayList<String> listFunctionOutput = new ArrayList<String>();
    String proc_out_parameter = "0";
    PreparedStatement pstmt = null;
    ResultSet rs = null;

    private LhsStringUtility stringUtility;

    public GlobalDoWorkInterfaceExecuter(Connection con) {
        connection = con;
    }

    public Long executeOracleFunctionAsLong(final String function_name_para_query) {
        try {
            try {
                pstmt = connection.prepareStatement(function_name_para_query);
                rs = pstmt.executeQuery(function_name_para_query);
                while (rs.next()) {
                    longFunctionOutput = rs.getLong(1);
                }
            } catch (SQLException ex) {
                longFunctionOutput = 0l;
            }

        } catch (Exception e) {
            longFunctionOutput = 0l;
        } finally {
        }
        try {
            closeConnectionAndStatement();
        } catch (Exception e) {
        }
        return longFunctionOutput;
    }//end method

    public int executeOracleFunctionAsInteger(final String function_name_para_query) {
        try {
            try {
                pstmt = connection.prepareStatement(function_name_para_query);
                rs = pstmt.executeQuery(function_name_para_query);
                while (rs.next()) {
                    integerFunctionOutput = rs.getInt(1);
                }
            } catch (SQLException ex) {
                integerFunctionOutput = 0;
            }

            // commented due to logic changes ...  HibernateUtil.commitTransaction();
        } catch (Exception e) {
            integerFunctionOutput = 0;
        } finally {
        }
        try {
            closeConnectionAndStatement();
        } catch (Exception e) {
        }
        return integerFunctionOutput;
    }//end method

    public String executeOracleFunctionAsString(final String function_name_para_query) {
        try {
            try {
                pstmt = connection.prepareStatement(function_name_para_query);
                rs = pstmt.executeQuery(function_name_para_query);
                while (rs.next()) {
                    stringFunctionOutput = rs.getString(1);
                }
            } catch (SQLException ex) {
                stringFunctionOutput = "";
            }

        } catch (Exception e) {
            stringFunctionOutput = "";
        } finally {
        }
        try {
            closeConnectionAndStatement();
        } catch (Exception e) {
        }

        return stringFunctionOutput;
    }//end method

    public boolean executeOracleCRUDFunction(final String function_name_para_query) {
        try {

            try {
                pstmt = connection.prepareStatement(function_name_para_query);
                int retvalue = pstmt.executeUpdate(function_name_para_query);
                if (retvalue > 0) {
                    crudFunctionOutput = true;

                } else {
                    crudFunctionOutput = false;
                }
            } catch (SQLException ex) {
                crudFunctionOutput = false;
            }

            // commented due to logic changes ...  HibernateUtil.commitTransaction();
        } catch (Exception e) {
            crudFunctionOutput = false;
        } finally {
        }
        try {
            closeConnectionAndStatement();
        } catch (Exception e) {
        }
        return crudFunctionOutput;
    }//end method

    public ArrayList<ArrayList<String>> executeOracleQueryAsListOfList(final String para_query) {
        try {

            try {
                pstmt = connection.prepareStatement(para_query);
                rs = pstmt.executeQuery(para_query);
                ResultSetMetaData rsmd = rs.getMetaData();
                int column_count = rsmd.getColumnCount();
                while (rs.next()) {
                    ArrayList<String> arr = new ArrayList<String>();
                    for (int i = 0; i < column_count; i++) {
                        String col_value = rs.getString(i + 1);
                        col_value = stringUtility.isNull(col_value) ? "" : col_value;
                        arr.add(col_value);
                    }
                    listOfListFunctionOutput.add(arr);
                }
            } catch (SQLException ex) {
                listOfListFunctionOutput = null;
                ex.printStackTrace();
            }

            // commented due to logic changes ...  HibernateUtil.commitTransaction();
        } catch (Exception e) {
            listOfListFunctionOutput = null;
            e.printStackTrace();
        } finally {
        }
        try {
            closeConnectionAndStatement();
        } catch (Exception e) {
        }

        return listOfListFunctionOutput;
    }//end method

    public HashMap<String, String> executeOracleQueryAsHashMap(final String para_query) {
        try {
            try {
                pstmt = connection.prepareStatement(para_query);
                rs = pstmt.executeQuery(para_query);
                ResultSetMetaData rsmd = rs.getMetaData();
//                        int column_count = rsmd.getColumnCount();
                while (rs.next()) {
//                            HashMap<String, String> map = new HashMap<String, String>();
                    hashMapOfListFunctionOutput.put(rs.getString(1), rs.getString(2));
                }
            } catch (SQLException ex) {
                hashMapOfListFunctionOutput = null;
                ex.printStackTrace();
            }
            // commented due to logic changes ...  HibernateUtil.commitTransaction();
        } catch (Exception e) {
            hashMapOfListFunctionOutput = null;
            e.printStackTrace();
        } finally {

        }
        try {
            closeConnectionAndStatement();
        } catch (Exception e) {
        }
        return hashMapOfListFunctionOutput;
    }//end method

    public ArrayList<String> executeOraclFunctionAsList(final String para_query) {
        try {

            try {
                pstmt = connection.prepareStatement(para_query);
                rs = pstmt.executeQuery(para_query);
                ResultSetMetaData rsmd = rs.getMetaData();
                int column_count = rsmd.getColumnCount();
                while (rs.next()) {
                    for (int i = 0; i < column_count; i++) {
                        String col_value = rs.getString(i + 1);
                        col_value = stringUtility.isNull(col_value) ? "" : col_value;
                        listFunctionOutput.add(col_value);
                    }
                }
            } catch (SQLException ex) {
                listFunctionOutput = null;
            }
            // commented due to logic changes ...  HibernateUtil.commitTransaction();
        } catch (Exception e) {
            listFunctionOutput = null;
        } finally {

        }
        try {
            closeConnectionAndStatement();
        } catch (Exception e) {
        }
        return listFunctionOutput;
    }//end method

    public <T> T getGenericWorkInterfaceExecuter(final T entity, final String para_query) {
        try {
            try {
                pstmt = connection.prepareStatement(para_query);
                rs = pstmt.executeQuery(para_query);
                while (rs.next()) {
                    Field[] all_dtls = entity.getClass().getDeclaredFields();
                    for (Field dtl : all_dtls) {
                        try {
                            String detail_name = dtl.getName();
                            String detail_value = rs.getString(detail_name);
                            detail_value = stringUtility.isNull(detail_value) ? "" : detail_value;
                            dtl.set(entity, detail_value);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }//end for
                }
            } catch (SQLException ex) {
            }

            // commented due to logic changes ...  HibernateUtil.commitTransaction();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {

        }
        try {
            closeConnectionAndStatement();
        } catch (Exception e) {
        }
        return (T) entity;
    }//end method

    public void closeConnectionAndStatement() {
        try {
            if (pstmt != null) {
                pstmt.close();
            }
        } catch (Exception e) {
        }
        try {
            if (rs != null) {
                rs.close();
            }
        } catch (Exception e) {
        }
    }//end method
    //
//                    public Long getIdBySequence(final String sequenceName) {
//                        final List<Long> ids = new ArrayList<Long>();
//                        try {
//    
//                            Work work = new Work() {
//                                @Override
//                                public void execute(Connection connection) throws SQLException {
//    
//                                    DialectResolver dialectResolver = new StandardDialectResolver();
//                                    Dialect dialect = dialectResolver.resolveDialect(
//                                            new DatabaseMetaDataDialectResolutionInfoAdapter(connection.getMetaData()));
//    
//                                    //Dialect dialect = dialectResolver.resolveDialect((DialectResolutionInfo) connection.getMetaData());
//                                    PreparedStatement preparedStatement = null;
//    
//                                    ResultSet resultSet = null;
//                                    try {
//    
//                                        preparedStatement = connection.prepareStatement(dialect.getSequenceNextValString(sequenceName));
//                                        resultSet = preparedStatement.executeQuery();
//                                        resultSet.next();
//                                        try {
//    
//                                        } catch (Exception e) {
//    
//                                        }
//                                        ids.add(resultSet.getLong(1));
//    
//                                    } catch (SQLException e) {
//                                        e.printStackTrace();
//                                    } finally {
//                                        if (preparedStatement != null) {
//                                            preparedStatement.close();
//                                        }
//                                        if (resultSet != null) {
//                                            resultSet.close();
//                                        }
//                                    }
//                                }
//                            };
//                            ssn.doWork(work);
//                            // commented due to logic changes ...  HibernateUtil.commitTransaction();
//                        } catch (Exception e) {
//                            e.printStackTrace();
//                        } finally {
//                            HibernateUtil.commitOrRollbackTransaction();
//                            HibernateUtil.closeSession();
//                        }
//                        return ids.get(0);
//                    }
    //
    //                public Long getBySequence(final String sequenceName) {
    //                    final List<Long> ids = new ArrayList<Long>();
    //                    try {
    //
    //                        Work work = new Work() {
    //                            @Override
    //                            public void execute(Connection connection) throws SQLException {
    //
    //                                DialectResolver dialectResolver = new StandardDialectResolver();
    //
    //                                Dialect dialect = dialectResolver.resolveDialect((DialectResolutionInfo) connection.getMetaData());
    //
    //                                PreparedStatement preparedStatement = null;
    //
    //                                ResultSet resultSet = null;
    //                                try {
    //
    //            //                    preparedStatement = connection.prepareStatement(dialect.getSequenceNextValString(sequenceName));
    //                                    preparedStatement = connection.prepareStatement(dialect.transformSelectString(sequenceName));
    //                                    resultSet = preparedStatement.executeQuery();
    //                                    resultSet.next();
    //                                    try {
    //
    //                                    } catch (Exception e) {
    //
    //                                    }
    //                                    ids.add(resultSet.getLong(1));
    //
    //                                } catch (SQLException e) {
    //                                    e.printStackTrace();
    //                                } finally {
    //                                    if (preparedStatement != null) {
    //                                        preparedStatement.close();
    //                                    }
    //                                    if (resultSet != null) {
    //                                        resultSet.close();
    //                                    }
    //                                }
    //                            }
    //                        };
    //                        ssn.doWork(work);
    //                        // commented due to logic changes ...  HibernateUtil.commitTransaction();
    //                    } catch (Exception e) {
    //                        e.printStackTrace();
    //                    } finally {
    //                        HibernateUtil.commitOrRollbackTransaction();
    //                        HibernateUtil.closeSession();
    //                    }
    //                    return ids.get(0);
    //                }

//    public String getIndentVrno_procedure(final String acc_code,final Long rowIdSeq,  final Date vrdate, final String acc_year, final LhsStringUtility utl) {
//        Session ssn = getSessionFactory().openSession();
//        try {
//            Work work = new Work() {
//                @Override
//                public void execute(Connection connection) throws SQLException {
//                    try {
//                        CallableStatement clst;
////                        String vrQuery = "select generate_VRNO('INDNT', '" + vr + "', '', '" + sessionAccCode + "', '" + acc_year + "', 'I') from dual";
//                        String executeProc = "{call generate_VRNO(?,?,?,?,?,?)}";
//                        clst = connection.prepareCall(executeProc);
//                        clst.setString(1, entity_code);//entity_code
//                        clst.setString(2, Client_code);//client code
//                        clst.setString(3, acc_year);//acc_year
//                        clst.setString(4, Assessment_acc_year);//assessment year
//                        clst.setInt(5, quarter_no);//quarter no.
//                        clst.setNull(6, java.sql.Types.CHAR);//month
//                        clst.setDate(7, (java.sql.Date) from_date);//from date
//                        clst.setDate(8, (java.sql.Date) To_date);//to date
//                        clst.setString(9, tds_type);//tds type
//                        clst.setString(10, justification_type);//tds type
//                        clst.registerOutParameter(11, java.sql.Types.VARCHAR);//register output parameter
//                        clst.executeUpdate();
//                        stringFunctionOutput = clst.getString(11);
//                        
////                        System.out.println("Return_Eesult_Value_By_Procedure->" + proc_out_parameter);
//                        try {
//                            clst.close();
//                        } catch (Exception e) {
//                            e.printStackTrace();
//                        }
//                    } catch (Exception ex) {//Handle Exception According to DB
//                        ex.printStackTrace();
//                    }
//                }
//            };
//            ssn.beginTransaction();
//            ssn.doWork(work);
//            ssn.getTransaction().commit();
//        } catch (JDBCException e) {
//            e.printStackTrace();
//        } finally {
//            ssn.close();
//        }
//        
//        return stringFunctionOutput;
//    }//end method
    public String execute_procedure_generate_vrno(final String tranType, final String entityCode, final String accCode, final String accYear, final String tCode) {
        try {
            try {

                CallableStatement clst;

//                        System.out.println("----------------execute_procedure_generate_vrno----------------------");
                clst = connection.prepareCall("{ call PROC_generate_vrno(?,?,?,?,?,?,?) }");

                java.sql.Date date = new java.sql.Date(new Date().getTime());
                clst.setString(1, tranType);
                clst.setDate(2, date);
                clst.setString(3, entityCode);
                clst.setString(4, accCode);
                clst.setString(5, accYear);
                clst.setString(6, tCode);
                clst.registerOutParameter(7, Types.VARCHAR);

                clst.executeUpdate();
                proc_out_parameter = clst.getString(7);

                clst = connection.prepareCall("{ call append_vrno(?,?,?,?,?) }");
                clst.setString(1, proc_out_parameter);
                clst.setString(2, entityCode);
                clst.setString(3, accCode);
                clst.setString(4, accYear);
                clst.setString(5, tCode);
                clst.executeUpdate();
                try {
                    clst.close();
                } catch (SQLException e) {
                    proc_out_parameter = "-1";
                }
            } catch (SQLException ex) {//Handle Exception According to DB
                ex.printStackTrace();
                proc_out_parameter = "-1";
            }
            // commented due to logic changes ...  HibernateUtil.commitTransaction();
        } catch (Exception e) {
            proc_out_parameter = "-1";
            e.printStackTrace();
        } finally {
        }
//        System.out.println("proc_out_parameter......" + proc_out_parameter);
        return proc_out_parameter;//return 1 then no error 
    }//end method

}//end class

