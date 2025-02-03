<?php

	$inData = getRequestInfo();

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else 
	{
		//delete calls from just the first/last names
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE FirstName=? AND LastName=? AND UserID=? AND ID=?");
		$stmt->bind_param("ssii", $firstName, $lastName, $userId, $inData["ID"]);
		$stmt->execute();

		if ($stmt->affected_rows > 0) 
		{
			returnWithSuccess("Contact deleted successfully");
		} 
		else 
		{
			returnWithError("No matching contact found for this user");
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
