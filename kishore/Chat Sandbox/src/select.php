<?php
    //Specify the servername, username, password, and database name we are connecting to
    $server = "mysql_db";
    $username = "root";
    $password = "root";
    $dbname = "Chat Box";

    //connecting to the database
    $conn = mysqli_connect($server,$username,$password,$dbname);

    //selecting all messages that have been inserted to ChatData
    $sql = "SELECT * From ChatData";
    $result = mysqli_query($conn,$sql);

    //Check to see if there are any entries into table
    if(mysqli_num_rows($result) > 0){
        //if so loop through the rows and output the time and message
        while($row = mysqli_fetch_assoc($result)){
            echo "Time: ". $row["Time"]. " ". $row["Message"]."<br>";
        }

    }

    //if no entries, specify no messages
    else{
        echo "No messages yet!";
    }

    // Close connection
    mysqli_close($conn);
?>
