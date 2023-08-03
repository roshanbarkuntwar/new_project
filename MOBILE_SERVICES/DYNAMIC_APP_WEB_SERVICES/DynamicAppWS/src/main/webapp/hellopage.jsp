<%-- 
    Document   : hellopage
    Created on : Jan 7, 2017, 3:21:42 PM
    Author     : premkumar.agrawal
--%>

<%@page contentType="text/html" pageEncoding="windows-1252"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>JSP Page</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <input type="text" id="message" value=${message} />
        Message is: ${message}  
    </body>
</html>
