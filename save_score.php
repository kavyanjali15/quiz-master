<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

// Database connection with error reporting
$conn = new mysqli('localhost', 'root', '', 'quiz_app');
if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed. Please try again later.'
    ]));
}

// Get and validate input data
$username = isset($_POST['username']) ? $conn->real_escape_string($_POST['username']) : '';
$score = isset($_POST['score']) ? (int)$_POST['score'] : 0;
$total = isset($_POST['total']) ? (int)$_POST['total'] : 0;
$topic = isset($_POST['topic']) ? $conn->real_escape_string($_POST['topic']) : '';

// Debug logging
error_log("Attempting to save score: username=$username, score=$score, total=$total, topic=$topic");

if (empty($username) || empty($topic) || $total <= 0) {
    error_log("Validation failed: username=".strlen($username).", topic=".strlen($topic).", total=$total");
    die(json_encode([
        'success' => false,
        'message' => 'Invalid input data. All fields are required.'
    ]));
}

// Transaction for atomic operations
$conn->begin_transaction();

try {
    // 1. Get topic ID (create if doesn't exist)
    $stmt = $conn->prepare("SELECT id FROM topics WHERE name = ?");
    $stmt->bind_param("s", $topic);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $stmt = $conn->prepare("INSERT INTO topics (name) VALUES (?)");
        $stmt->bind_param("s", $topic);
        if (!$stmt->execute()) {
            throw new Exception("Failed to create topic: " . $stmt->error);
        }
        $topic_id = $conn->insert_id;
    } else {
        $topic_id = $result->fetch_assoc()['id'];
    }
    
    // 2. Save the score
    $stmt = $conn->prepare("INSERT INTO scores (username, topic_id, score, total_questions) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("siii", $username, $topic_id, $score, $total);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to save score: " . $stmt->error);
    }
    
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Score saved successfully',
        'score_id' => $conn->insert_id
    ]);
    
} catch (Exception $e) {
    $conn->rollback();
    error_log("Error saving score: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error saving score: ' . $e->getMessage()
    ]);
}

$conn->close();
?>