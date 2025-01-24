<?php

    $inData = getRequestInfo();

    $userId = $inData["userId"];
    $inData["firstName"] = $inData["firstName"] . '%';

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else 
    {
        //insert contact into database
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE FirstName LIKE ? AND UserID =?");
        $stmt->bind_param("si", $inData["firstName"], $userId);

        if ($stmt->execute()) 
        {
            $result = $stmt->get_result();
            $contacts = array();
            while ($row = $result->fetch_assoc()) 
            {
                $contacts[] = array("ID" => $row["ID"], "FirstName" => $row["FirstName"], "LastName" => $row["LastName"], "Phone" => $row["Phone"], "Email" => $row["Email"]);
            } 
            if (count($contacts) > 0)
            {
                sendResultInfoAsJson(json_encode($contacts));
            }
            else
            {
                returnWithError("No matching contacts found");
            }
            
        } 
        else 
        {
            returnWithError("Error searching contacts: " . $stmt->error);
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
