<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");

    //Parse incoming JSON
    $inData = getRequestInfo();

    //Establish connection to database
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    //Error checking database connection
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else 
    {
        //Extract userId and page number from data
        $userId = $inData["userId"];
        $page = isset($inData["page"]) ? $inData["page"] : 1; //Default to page 1 if page number not given
        
        $limit = 5; //Retreives 5 contacts per page
        $offset = ($page - 1) * $limit; //Calculate offset based on page number

        //Prepare SQL fetch query
        $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID = ? LIMIT ? OFFSET ?");
        
        //Bind parameters to SQL query to prevent SQL injection
        $stmt->bind_param("iii", $userId, $limit, $offset);

        //Execute prepared statement
        if ($stmt->execute()) 
        {
            //Get the result set from the query
            $result = $stmt->get_result();
            $contacts = array();

            //Loop through rows and build contacts array
            while ($row = $result->fetch_assoc()) 
            {
                $contacts[] = array(
                    "ID" => $row["ID"],
                    "FirstName" => $row["FirstName"],
                    "LastName" => $row["LastName"],
                    "Phone" => $row["Phone"],
                    "Email" => $row["Email"]
                );
            }

            //If contacts found send as JSON
            if (count($contacts) > 0)
            {
                $response = array("contacts" => $contacts);
                sendResultInfoAsJson(json_encode($response));
            } 
            else 
            {
                //If no contacts found return error
                returnWithError("No more contacts to load");
            }
        } 
        else 
        {
            //If query failed return error
            returnWithError("Error executing query: " . $stmt->error);
        }

        //Close prepared statement and database connection
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
?>
