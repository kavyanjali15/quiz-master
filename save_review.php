<?php
header('Content-Type: application/json');
session_start();

$conn = new mysqli('localhost', 'root', '', 'quiz_app');

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

// Get data from POST
$username = isset($_POST['username']) ? $conn->real_escape_string($_POST['username']) : '';
$topic = isset($_POST['topic']) ? $conn->real_escape_string($_POST['topic']) : '';
$rating = isset($_POST['rating']) ? (int)$_POST['rating'] : 0;
$feedback = isset($_POST['feedback']) ? $conn->real_escape_string($_POST['feedback']) : '';

// Validate input
if (empty($username) || empty($topic) || $rating < 1 || $rating > 5) {
    die(json_encode(['success' => false, 'message' => 'Invalid input data']));
}

// Check if user already reviewed this quiz
$check = $conn->prepare("SELECT id FROM quiz_reviews WHERE username = ? AND topic = ?");
$check->bind_param("ss", $username, $topic);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    die(json_encode(['success' => false, 'message' => 'You have already reviewed this quiz']));
}

// Insert review
$stmt = $conn->prepare("INSERT INTO quiz_reviews (username, topic, rating, feedback) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssis", $username, $topic, $rating, $feedback);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Review saved successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save review']);
}

$stmt->close();
$conn->close();
?>