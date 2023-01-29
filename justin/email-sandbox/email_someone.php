<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/phpmailer/phpmailer/src/Exception.php';
require 'vendor/phpmailer/phpmailer/src/PHPMailer.php';
require 'vendor/phpmailer/phpmailer/src/SMTP.php';

$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = 2;                                       // Enable debug output
    $mail->isSMTP();                                            // Set mailer to use SMTP
    $mail->Host = 'smtp.gmail.com';                       // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                                   // Enable SMTP authentication
    $mail->Username = 'TESTING EMAIL HERE';                 // SMTP username (your gmail email address)
    $mail->Password = 'APP PASSWORD HERE';                  // SMTP password (your gmail password)
    $mail->SMTPSecure = 'ssl';                                  // Enable SSL encryption
    $mail->Port = 465;                                    // SSL port to connect to

    //Recipients
    $mail->setFrom('TESTING EMAIL HERE', 'Tester');
    $mail->addAddress('example@email.com', 'Name');     // Add a recipient

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Test subject';
    $mail->Body = 'Test body! Next text is <b>in bold!</b>';
    $mail->AltBody = 'Plain text for non-HTML email platforms';

    //Add this code to handle the form submission
    if (isset($_POST['send_email'])) {
        $mail->send();
        echo "Email sent!";
    }

} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}

?>
<form method="post">
    <input type="submit" name="send_email" value="Send Email">
</form>
