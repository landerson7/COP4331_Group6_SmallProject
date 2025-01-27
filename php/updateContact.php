<?php

    $inData = getRequestInfo();
    //parse userId from data
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else 
    {
        //update contact in database
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID =?");
        $stmt->bind_param("ssssii", $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["ID"], $userId);

        if ($stmt->execute()) //success
        {
            returnWithSuccess("Contact updated successfully");
        } 
        else //fail
        {
            returnWithError("Error updating contact: " . $stmt->error);
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithSuccess($msg)
    {
        $retValue = '{"message":"' . $msg . '"}';
        sendResultInfoAsJson($retValue);
    }

?>
