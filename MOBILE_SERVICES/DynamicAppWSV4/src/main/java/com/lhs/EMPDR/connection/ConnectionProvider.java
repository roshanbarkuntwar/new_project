package com.lhs.EMPDR.connection;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 * @author dhanshri.paradkar
 */
public class ConnectionProvider {

    public static String domain_name = "192.168.100.10:1521";
    public static String db_user_name = "packperp";
    public static String db_password = "packperp";

    public static void main(String args[]) throws SQLException {
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddhhmmss aa");
        Connection con = getConnection();
        String sql = "update user_reg_mast set PASSWORD_GUID=?,password_guid_valid_upto=to_date(" + formatter.format(date) + ", 'YYYYMMDD HH24MISS')"
                + " where EMAIL=?";
        PreparedStatement ps = con.prepareStatement(sql);
        ps.setString(1, "36547");
        ps.setString(2, "tanu15@gmail.com");  // <==== this line 
        ps.executeUpdate();
        closeConnection(con);
    }
    // initialize DB connection

    public static Connection getConnection() {
        Connection connection = null;
        try {

            String url = "jdbc:oracle:thin:@" + domain_name + ":ORA10G";
            String username = db_user_name;
            String password = db_password;
            Class.forName("oracle.jdbc.driver.OracleDriver");
            connection = DriverManager.getConnection(url, username, password);
        } catch (ClassNotFoundException e) {
            System.out.println(e);
        } catch (SQLException e) {
            System.out.println(e);
        }
        return connection;
    }

    // close DB connection
    public static void closeConnection(Connection connection) {
        try {
            if (connection != null) {
                connection.close();
                System.out.println("\n connection closed ====" + connection + "\n");
            }
        } catch (SQLException e) {
        }
    }
}
