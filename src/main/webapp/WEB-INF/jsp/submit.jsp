
<!DOCTYPE html>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="submit.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <title>Submit Score</title>
</head>
<body>
    <div id="score">Your score was ${score}!</div>
    <div id="label">Username</div>
    <input type="text" id="usernameField" value="" maxlength="3" />
    <button type="button" onclick="sendScore()">Submit</button>
    <script>
        function sendScore() {
            let request = new XMLHttpRequest();
            request.open('PUT', "http://localhost:8080/leaderboard", false);
            request.setRequestHeader("username", document.getElementById("usernameField").value);
            request.setRequestHeader("score", ${score});
            request.send();
            window.location.replace("http://localhost:8080/leaderboard");
        }
    </script>
</body>
</html>
