<%-- 
    Document   : index.jsp
    Created on : Nov 21, 2018, 2:24:56 PM
    Author     : harsh.satfale
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAMKRVV2yXdjCcdWKYEadQcJW8B8-tcTxk&sensor=true&libraries=geometry&libraries=drawing"
        type="text/javascript"></script>
    </head>
    <body>

        <div id="hiddenInput"></div>


        <div id="a" style="display: block;"><%= request.getParameter("currentLocation")%></div>

        <div id="b" style="display: block;"><%= request.getParameter("latLngArray")%></div>

    </body>
    <script>
        var google;
        function checkLocation() {

            var latLng = JSON.parse(document.getElementById('a').innerHTML);

            var fencingArea = document.getElementById('b').innerHTML;

            var result;

            var bermudaTriangle = new google.maps.Polygon({paths: JSON.parse(fencingArea)});

            setTimeout(function () {
                result = google.maps.geometry.poly.containsLocation(new google.maps.LatLng(latLng[0].lat, latLng[0].lng), bermudaTriangle) ? 'T' : 'F';


                document.getElementById("hiddenInput").innerHTML = result;
            }, 500);

        }
    </script>
</html>
