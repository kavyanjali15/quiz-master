<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Start session for admin verification
session_start();

$conn = new mysqli('localhost', 'root', '', 'quiz_app');

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Verify admin status (uncomment when ready)
// if (!isset($_SESSION['is_admin']) {
//     die(json_encode(['success' => false, 'message' => 'Admin access required']));
// }

$topic = isset($_POST['topic']) ? $conn->real_escape_string($_POST['topic']) : '';
$question = isset($_POST['question']) ? $conn->real_escape_string($_POST['question']) : '';
$option1 = isset($_POST['option1']) ? $conn->real_escape_string($_POST['option1']) : '';
$option2 = isset($_POST['option2']) ? $conn->real_escape_string($_POST['option2']) : '';
$option3 = isset($_POST['option3']) ? $conn->real_escape_string($_POST['option3']) : '';
$option4 = isset($_POST['option4']) ? $conn->real_escape_string($_POST['option4']) : '';
$correct_option = isset($_POST['correct_option']) ? (int)$_POST['correct_option'] : 0;

if (empty($topic) || empty($question) || empty($option1) || empty($option2) || 
    empty($option3) || empty($option4) || $correct_option < 1 || $correct_option > 4) {
    die(json_encode(['success' => false, 'message' => 'All fields are required and correct option must be between 1-4']));
}

// Get or create topic
$stmt = $conn->prepare("SELECT id FROM topics WHERE name = ?");
$stmt->bind_param("s", $topic);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $stmt->close();
    $stmt = $conn->prepare("INSERT INTO topics (name) VALUES (?)");
    $stmt->bind_param("s", $topic);
    if (!$stmt->execute()) {
        die(json_encode(['success' => false, 'message' => 'Failed to create topic']));
    }
    $topic_id = $conn->insert_id;
} else {
    $topic_id = $result->fetch_assoc()['id'];
}
$stmt->close();

// Insert question
$stmt = $conn->prepare("INSERT INTO questions (topic_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isssssi", $topic_id, $question, $option1, $option2, $option3, $option4, $correct_option);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Question added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to add question: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>
