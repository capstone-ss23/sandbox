<?php
    //specify server, username, password and database name for table
    $server = "mysql_db";
    $username = "root";
    $password = "root";
    $dbname = "Chat Box";

    //connect to the sql database
    $conn = mysqli_connect($server,$username,$password,$dbname);

    //echo "Connection Successfull";

    $id = 1;
    //getting the message that was posted from the form
    $message = $_POST['message'];
    //getting the time of message submission
    $t = date('Y-m-d H:i:s');

    //insert the values into the ChatData Table
    $sql = "INSERT INTO ChatData VALUES ($id,'$message', '$t')";

    if(mysqli_query($conn, $sql)){
        //if the connection and query succesful output sucess message
        echo "the data has been stored";
    } else{
        echo "The data couldn't be stored";
    }

    // Close connection
    mysqli_close($conn);



?>