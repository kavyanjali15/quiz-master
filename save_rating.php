<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

// Create connection
$conn = new mysqli('localhost', 'root', '', 'quiz_app');

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]));
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

// Validate input
if (empty($input['rating']) || !isset($_SESSION['username']) || empty($input['topic'])) {
    die(json_encode([
        'success' => false,
        'message' => 'Missing required fields',
        'received' => $input,
        'session' => $_SESSION
    ]));
}

$username = $_SESSION['username'];
$topic = $conn->real_escape_string($input['topic']);
$rating = (int)$input['rating'];

if ($rating < 1 || $rating > 5) {
    die(json_encode([
        'success' => false,
        'message' => 'Rating must be 1-5'
    ]));
}

// Start transaction
$conn->begin_transaction();

try {
    // 1. Get topic ID
    $stmt = $conn->prepare("SELECT id FROM topics WHERE name = ?");
    if (!$stmt) throw new Exception("Prepare failed: " . $conn->error);
    
    $stmt->bind_param("s", $topic);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("Topic '$topic' not found");
    }
    
    $topic_id = $result->fetch_assoc()['id'];
    $stmt->close();
    
    // 2. Find the most recent score for this user+topic
    $stmt = $conn->prepare("SELECT id FROM scores 
                          WHERE username = ? AND topic_id = ?
                          ORDER BY created_at DESC LIMIT 1");
    if (!$stmt) throw new Exception("Prepare failed: " . $conn->error);
    
    $stmt->bind_param("si", $username, $topic_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("No quiz record found for user '$username' and topic '$topic'");
    }
    
    $score_id = $result->fetch_assoc()['id'];
    $stmt->close();
    
    // 3. Update the rating
    $stmt = $conn->prepare("UPDATE scores SET rating = ? WHERE id = ?");
    if (!$stmt) throw new Exception("Prepare failed: " . $conn->error);
    
    $stmt->bind_param("ii", $rating, $score_id);
    $stmt->execute();
    
    if ($stmt->affected_rows === 0) {
        throw new Exception("No rows affected - rating not updated");
    }
    
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Rating saved successfully'
    ]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>