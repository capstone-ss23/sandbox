<!DOCTYPE html>
<html>
    <head>
        <title>My Website</title>
    </head>
    <body>
        <h1>Welcome to a basic chat box </h1>
        <p>Enter your message: </p>
        <!-- Form to enter thd message: upon submission of form go to insert.php
        and insert message into database-->
        <form action = "insert.php" method="post" target = "insert-frame">
            <label for="message">Message:</label><br>
            <input type="text" id="message" name="message"><br>
            <input type="submit" value="Submit">
        </form>

        <!--Display the message echo'd in insert.php on the same page as message submission form-->
        <iframe name = "insert-frame" id = "insert-frame"></iframe>

        <!--Display the contents echo'd by select.php(Selecting and displaying all messages pushed to database-->
        <iframe src = "./select.php"></iframe>

    </body>
</html>
