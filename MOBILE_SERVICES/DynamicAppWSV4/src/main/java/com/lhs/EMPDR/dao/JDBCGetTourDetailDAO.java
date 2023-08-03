/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.EmpProfileModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author harsh.satfale
 */
public class JDBCGetTourDetailDAO {

    public Connection connection = null;

    public JDBCGetTourDetailDAO(Connection connection) {
        this.connection = connection;
        U u = new U(this.connection);
    }

    public EmpProfileModel getProfile(String user_code) {
        EmpProfileModel empProf = new EmpProfileModel();

        ResultSet resultSet = null;

        String empProfile = "select t.emp_name empName, lhs_utility.get_name('dept_code',t.dept_code) dept_name, (select y.desig_name from emp_desig_mast y where y.desig_code = t.desig_code)desig_name,\n"
                + "       to_char(t.birth_date,'dd-mm-rrrr')birth_date,\n"
                + "       to_char(t.join_date,'dd-mm-rrrr')join_date,\n"
                + "       lhs_utility.get_name('geo_org_code',k.geo_org_code)geo_org_name,lhs_utility.get_name('geo_org_code',k.geo_org_code)||' ('||k.geo_org_code||')' geo_org_code_name,\n"
                + "       to_char(k.from_date,'dd-mm-rrrr')from_date,decode(k.placement_type,'R','Regular','A','Additional','N/A')posting_type,\n"
                + "       t.mobile mobile,t.phone phone,t.email email,t.add1 address,t.pin pin,t.city city,lhs_utility.get_name('state_code',t.state_code)state_name\n"
                + "  from emp_mast t,view_emp_status_mast k where t.emp_code =k.emp_code\n"
                + "  and t.emp_code =(select u.emp_code from user_mast u where u.user_code='" + user_code + "')";

        U.log("query = " + empProfile);
        PreparedStatement preparedStatement = null;
        if (connection != null) {
            U.log("connection");
        }

        try {
            preparedStatement = connection.prepareStatement(empProfile);

            resultSet = preparedStatement.executeQuery();

            if (resultSet != null && resultSet.next()) {
                empProf.setEmpName(resultSet.getString("empName"));
                empProf.setDepName(resultSet.getString("dept_name"));
                empProf.setDesignName(resultSet.getString("desig_name"));
                empProf.setDOB(resultSet.getString("birth_date"));
                empProf.setJoin_Date(resultSet.getString("join_date"));
                empProf.setGeoOrgName(resultSet.getString("geo_org_name"));
                empProf.setGeoOrgName(resultSet.getString("geo_org_code_name"));
                empProf.setFrom_Date(resultSet.getString("from_date"));
                empProf.setPostingType(resultSet.getString("posting_type"));
                empProf.setMobile(resultSet.getLong("mobile"));
                empProf.setPhone(resultSet.getInt("phone"));
                empProf.setEmail(resultSet.getString("email"));
                empProf.setAddress(resultSet.getString("address"));
                empProf.setPin(resultSet.getInt("pin"));
                empProf.setCity(resultSet.getString("city"));
                empProf.setStateName(resultSet.getString("state_name"));
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        } finally {
            try {
                //resultSet.close();
                preparedStatement.close();
            } // Logger.getLogger(JDBCGetTourDetailDAO.class.getName()).log(Level.SEVERE, null, ex);
            catch (SQLException ex) {
                ex.printStackTrace();
            }
        }

        PreparedStatement preparedStatement2 = null;
        ResultSet resultSet2 = null;

        String EmpImg = "select t.photo photo from emp_photo_mast t where t.emp_code = (select u.emp_code from user_mast u where u.user_code='"+ user_code +"')";
        try {
            //(select u.emp_code from user_mast u where u.user_code='020')
            preparedStatement2 = connection.prepareStatement(EmpImg);

            resultSet2 = preparedStatement2.executeQuery();
            if (resultSet2 != null && resultSet2.next()) {
                U.log("fetching photo" + resultSet2.getRow());
                if (resultSet2.getBinaryStream("photo") != null) {
                    InputStream inputStream = resultSet2.getBinaryStream("photo");
                    empProf.setPhoto(Util.getImgstreamToBytes(inputStream));
                    U.log("photo" + Util.getImgstreamToBytes(inputStream).length);
                } else {
                    U.log("Error");
                }
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        } finally {

            try {
                preparedStatement2.close();
                connection.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }

        return empProf;
    }

}
