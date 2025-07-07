<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
error_log("Fetching topics at " . date('Y-m-d H:i:s'));

$conn = new mysqli('localhost', 'root', '', 'quiz_app');

if ($conn->connect_error) {
    error_log('Connection failed: ' . $conn->connect_error);
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

$result = $conn->query("SELECT name FROM topics ORDER BY name");
if (!$result) {
    error_log('Query failed: ' . $conn->error);
    echo json_encode([]);
    $conn->close();
    exit;
}

$topics = [];
while ($row = $result->fetch_assoc()) {
    $topics[] = $row['name'];
}

error_log('Topics fetched: ' . json_encode($topics));
echo json_encode($topics);

$conn->close();
?>