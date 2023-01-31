<!DOCTYPE html>
    <?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    ?>
<html>

    <head>
        <title> Increment the Value </title>
    </head>

    <body>

    <?php
        echo "Do YOU have what it takes to increment the value??";
        echo "";
    ?>

    <br>

    <?php
    // credentials for accessing MySQL database
    $servername = "localhost";
    $username = "capstone";
    $password = "LgBhtYxg7jY4AG3iucr3";
    $dbname = "testDB";
    $tablename = "testTable";

    // Connect to the database server
    $conn = mysqli_connect($servername, $username, $password);

    // Check the connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Create database if it does not already exist
    $sql = "CREATE DATABASE IF NOT EXISTS $dbname";
    if ($conn->query($sql) === TRUE) {
        /*
        echo "Database created successfully or already exist";
        */
    } else {
        echo "Error creating database: " . $conn->error;
    }

    $select_db = mysqli_select_db($conn, $dbname);

    // Check the selection
    if (!$select_db) {
        die("Selection failed: " . mysqli_error($conn));
    }

    // Check if the table exists
    $result = mysqli_query($conn, "SHOW TABLES LIKE '$tablename'");

    if (mysqli_num_rows($result) === 0) {
        // Create the table
        $sql = "CREATE TABLE $tablename (
        id INT AUTO_INCREMENT PRIMARY KEY,
        number Int(6) NOT NULL
    )";

        /*
        if (mysqli_query($conn, $sql)) {
            echo "Table created successfully";
        } else {
            echo "Error creating table: " . mysqli_error($conn);
        }
        */
    } else {
        /*
        echo "Table already exists";
        */
    }

    // Check if the form has been submitted to increment
    if (isset($_POST['increment'])) {
        // Get the current value
        $sql = "SELECT * FROM $tablename WHERE id = 1";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $currentValue = $row['number'];

        // Increment the value
        $newValue = $currentValue + 1;

        // Update the value in the table
        $sql = "UPDATE $tablename SET number = $newValue WHERE id = 1";

        // Initialize the value of the column to 0 or increment it by 1
        //$sql = "UPDATE $dbname SET 'value' = COALESCE('value', 0) + 1 WHERE id = 1";
        if ($conn->query($sql) === TRUE) {
            /*
            echo "Value updated successfully";
            */
        } else {
            echo "Error updating value: " . $conn->error;
        }
    }

    // Check if the form has been submitted to increment
    if (isset($_POST['double'])) {
        // Get the current value
        $sql = "SELECT * FROM $tablename WHERE id = 1";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $currentValue = $row['number'];

        // Increment the value
        $newValue = $currentValue + $currentValue;

        // Update the value in the table
        $sql = "UPDATE $tablename SET number = $newValue WHERE id = 1";

        // Initialize the value of the column to 0 or increment it by 1
        //$sql = "UPDATE $dbname SET 'value' = COALESCE('value', 0) + 1 WHERE id = 1";
        if ($conn->query($sql) === TRUE) {
            /*
            echo "Value updated successfully";
            */
        } else {
            echo "Error updating value: " . $conn->error;
        }
    }

    // Check if the form has been submitted to increment
    if (isset($_POST['reset'])) {
        // Get the current value
        $sql = "SELECT * FROM $tablename WHERE id = 1";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $currentValue = $row['number'];

        // Update the value in the table
        $sql = "UPDATE $tablename SET number = 0 WHERE id = 1";
        $conn->query($sql);
    }

    ?>

    <form method="post">
        <input type="submit" name="increment" value="Increment">
    </form>

    <br>

    <form method="post">
        <input type="submit" name="double" value="Double">
    </form>

    <br>

    <form method="post">
        <input type="submit" name="reset" value="Reset">
    </form>

    <br>

    <?php

    $sql = "SELECT * FROM $tablename WHERE id = 1";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $currentValue = $row['number'];

    echo "Value: " . $currentValue;

    // Close the connection
    $conn->close();
    ?>

    </body>
</html>
