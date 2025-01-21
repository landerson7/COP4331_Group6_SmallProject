
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	// Host, user, password, database name
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{	 //prepare statements are better for security, no worries of injections
        $hashedPassword = hash('md5', $inData["password"]);
		$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password)
            SELECT data.FirstName, data.LastName, data.Login, data.Password
            FROM
            (
                SELECT ? AS FirstName, ? AS LastName, ? AS Login, ? AS Password
                UNION ALL
                SELECT ? AS FirstName, ? AS LastName, ? AS Login, ? AS Password
            ) AS data
            WHERE NOT EXISTS 
            (
                SELECT 1 
                FROM Users u 
                WHERE u.Login = data.login
            )
                                ");

        $stmt->bind_param(
            "ssssssss", $inData["firstName"], $inData["lastName"], $inData["username"], $inData["password"], 
                        $inData["firstName"], $inData["lastName"], $inData["username"], $hashedPassword
        );
		$stmt->execute();
		$result = $stmt->get_result();

		if( $stmt->affected_rows > 0)
		{
			returnWithInfo( $inData["firstName"], $inData["lastName"], $conn->insert_id );

		}
		else
		{
			returnWithError("User already exists or insertion error");
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
