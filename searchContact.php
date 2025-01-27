<?php

    $inData = getRequestInfo();
    //parse userID and firstName from input
    $userId = $inData["userId"];
    $inData["firstName"] = $inData["firstName"] . '%'; // <-- this character is used to format the search query

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else 
    {
        //search contact from database
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE FirstName LIKE ? AND UserID =?");
        $stmt->bind_param("si", $inData["firstName"], $userId);

        if ($stmt->execute()) //if success
        {
            $result = $stmt->get_result();
            $contacts = array();
            while ($row = $result->fetch_assoc()) // scan rows of results and add to contacts array
            {
                $contacts[] = array("ID" => $row["ID"], "FirstName" => $row["FirstName"], "LastName" => $row["LastName"], "Phone" => $row["Phone"], "Email" => $row["Email"]);
            } 
            if (count($contacts) > 0)
            {
                sendResultInfoAsJson(json_encode($contacts));
            }
            else //no contacts found, rows = 0
            {
                returnWithError("No matching contacts found");
            }
            
        } 
        else //error searching
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
