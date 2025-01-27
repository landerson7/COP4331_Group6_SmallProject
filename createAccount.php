
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
		$stmt = $conn->prepare("SELECT * FROM Users WHERE Login=?"); //checking for unique username
		$stmt->bind_param("s", $inData["username"]); 
		$stmt->execute();
		$result = $stmt->get_result();

		if( $stmt->affected_rows > 0) //if user exists
		{
			returnWithError("User already exists");

		}
		else //user does not exist
		{
			
			$hashedPassword = hash('md5', $inData["password"]); //hash password with md5 hash func
			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES(?, ?, ?, ?)");       

			$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["username"], $hashedPassword);
			$stmt->execute();
			$result = $stmt->get_result();

			if( $stmt->affected_rows > 0) //if query successful
			{
				returnWithInfo( $inData["firstName"], $inData["lastName"], $conn->insert_id );

			}
			else //failed
			{
				returnWithError("Insertion error");
			}
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
