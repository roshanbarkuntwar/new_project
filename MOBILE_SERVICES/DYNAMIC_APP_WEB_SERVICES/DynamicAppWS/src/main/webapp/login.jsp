<%-- 
    Document   : login
    Created on : Jan 9, 2017, 11:44:26 AM
    Author     : premkumar.agrawal
--%>

<%@page contentType="text/html" pageEncoding="windows-1252"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>JSP Page</title>
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    </head>

    <body>
        <form name="loginForm"  method="POST" action="/DynamicAppWS/webService/CP/doLogin">
            <table border="0">
                <tr>
                    <td>User Name</td>
                    <td><input type="text" name="userName" /></td>
                </tr>
                <tr>
                    <td>Password</td>
                    <td><input type="password" name="password" /></td>
                </tr>
            </table>

            <!-- reCAPTCHA -->
            <div class="g-recaptcha"
                 data-sitekey="6Lea6xAUAAAAALXcYwEJ5QWvaL29Zzy1ex5trphR"></div>

            <input type="submit" value="Submit" />
            <input type="text" id="message" value=${message} />
            Message is: ${message} 
            <!--<a href="/DynamicAppWS/webService/CP/doLogin.html">click</a>-->  
        </form>
    </body>
</html>
