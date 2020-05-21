<%--<%@ page contentType="text/html;charset=UTF-8" %>--%>

<!DOCTYPE html>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<html>
<head>
    <meta charset="UTF-8">
    <title>Submit Score</title>
</head>
<body>
    <h1>Your score was ${score}!</h1>
    Username
    <br>
    <input type="text" id="nameText" value="" />
    <br>
    <br>
    <button type="button" onclick="sendScore()">Submit</button>
    <script>
        function sendScore() {
            let request = new XMLHttpRequest();
            request.open('PUT', "http://localhost:8080/leaderboard", false);
            request.setRequestHeader("username", document.getElementById("nameText").value);
            request.setRequestHeader("score", ${score});
            request.send();
            window.location.replace("http://localhost:8080/leaderboard");
        }
    </script>
</body>
</html>
