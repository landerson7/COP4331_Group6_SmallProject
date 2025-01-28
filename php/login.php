
<?php
	header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
	$inData = getRequestInfo();
	//define variables
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
		$stmt = $conn->prepare("SELECT ID,FirstName,LastName,Password FROM Users WHERE Login=?");
		$stmt->bind_param("s", $inData["login"]); //password being hashed on javascript side
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  ) //if query successful
		{
			if (hash('md5', $inData["password"]) === $row['Password'])
			{
				returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
			}
			else
			{
				returnWithError("Invalid username or password");
			}
		}
		else //no login found
		{
			returnWithError("No Records Found");
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
