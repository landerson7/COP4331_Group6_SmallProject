<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
    $inData = getRequestInfo();
    //parse userID and firstName from input
    

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else 
    {
        //search contact from database
        if ($inData["lastName"] == "" && $inData["firstName"] != "") { 
            //if only one search term provided search first AND last names
            $userId = $inData["userId"];
            $searchTerm = $inData["firstName"] . "%"; // % search formatter
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID = ?");
            $stmt->bind_param("ssi", $searchTerm, $searchTerm, $userId);
        } else if ($inData["lastName"] != "" && $inData["firstName"] != "") {
            //if both first and last names provided search both
            $userId = $inData["userId"];
            $firstName = "%" . $inData["firstName"] . "%";
            $lastName  = "%" . $inData["lastName"] . "%";
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE FirstName LIKE ? AND LastName LIKE ? AND UserID = ?");
            $stmt->bind_param("ssi", $firstName, $lastName, $userId);
        } else {
            //if no search term provided give 10 random contacts
            $userId = $inData["userId"];
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID = ? LIMIT 10");
            $stmt->bind_param("i", $userId);
        }

        if ($stmt->execute()) //if success
        {
            $result = $stmt->get_result();
            $contacts = array();
            while ($row = $result->fetch_assoc()) // scan rows of results and add to contacts array
            {
                //
                $contacts[] = array("ID" => $row["ID"], "FirstName" => $row["FirstName"], "LastName" => $row["LastName"], "Phone" => $row["Phone"], "Email" => $row["Email"]);
            } 
            if (count($contacts) > 0)
            {
                $response = array("contacts" => $contacts);
                sendResultInfoAsJson(json_encode($response));
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
