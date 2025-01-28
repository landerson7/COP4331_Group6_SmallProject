<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");

    // Parse the incoming JSON request body
    $inData = getRequestInfo();

    // Establish a connection to the MySQL database
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    // Check if the connection to the database failed
    if ($conn->connect_error) 
    {
        // If the connection failed, return an error response
        returnWithError($conn->connect_error);
    } 
    else 
    {
        // Extract userId and page number from the request data
        $userId = $inData["userId"];
        $page = isset($inData["page"]) ? $inData["page"] : 1; // Default to page 1 if not provided
        
        $limit = 5; // Number of contacts to retrieve per page
        $offset = ($page - 1) * $limit; // Calculate the starting point for the query

        // Prepare the SQL query to fetch the contacts
        $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID = ? LIMIT ? OFFSET ?");
        
        // Bind the userId, limit, and offset to the SQL query to prevent SQL injection
        $stmt->bind_param("iii", $userId, $limit, $offset);

        // Execute the prepared statement
        if ($stmt->execute()) 
        {
            // Get the result set from the query
            $result = $stmt->get_result();
            $contacts = array();

            // Loop through each row in the result set and build the contacts array
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

            // If contacts were found, send them as a JSON response
            if (count($contacts) > 0)
            {
                $response = array("contacts" => $contacts);
                sendResultInfoAsJson(json_encode($response));
            } 
            else 
            {
                // If no contacts were found, return an error message
                returnWithError("No more contacts to load");
            }
        } 
        else 
        {
            // If the query failed to execute, return an error message with details
            returnWithError("Error executing query: " . $stmt->error);
        }

        // Close the prepared statement and database connection
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
