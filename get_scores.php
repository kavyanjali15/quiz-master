<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Start session to get current user
session_start();

$conn = new mysqli('localhost', 'root', '', 'quiz_app');

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Get username from session or request
$username = isset($_SESSION['username']) ? $_SESSION['username'] : (isset($_GET['username']) ? $conn->real_escape_string($_GET['username']) : '');
$topic = isset($_GET['topic']) ? $conn->real_escape_string($_GET['topic']) : '';

if (empty($username)) {
    die(json_encode(['success' => false, 'message' => 'Username not provided']));
}

// Prepare the query based on whether topic is specified
if (!empty($topic)) {
    $stmt = $conn->prepare("SELECT s.score, s.total_questions, t.name AS topic, s.created_at 
                           FROM scores s 
                           JOIN topics t ON s.topic_id = t.id 
                           JOIN users u ON s.username = u.username
                           WHERE s.username = ? AND t.name = ?
                           ORDER BY s.created_at DESC");
    $stmt->bind_param("ss", $username, $topic);
} else {
    $stmt = $conn->prepare("SELECT s.score, s.total_questions, t.name AS topic, s.created_at 
                           FROM scores s 
                           JOIN topics t ON s.topic_id = t.id 
                           JOIN users u ON s.username = u.username
                           WHERE s.username = ?
                           ORDER BY s.created_at DESC");
    $stmt->bind_param("s", $username);
}

$stmt->execute();
$result = $stmt->get_result();

$scores = [];
while ($row = $result->fetch_assoc()) {
    $scores[] = [
        'score' => $row['score'],
        'total' => $row['total_questions'],
        'topic' => $row['topic'],
        'date' => $row['created_at'],
        'percentage' => round(($row['score'] / $row['total_questions']) * 100)
    ];
}

echo json_encode(['success' => true, 'scores' => $scores]);

$stmt->close();
$conn->close();
?>