<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

$conn = new mysqli('localhost', 'root', '', 'quiz_app');


if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

$username = isset($_POST['username']) ? $conn->real_escape_string($_POST['username']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';


// Clear the CAPTCHA after validation
unset($_SESSION['captcha']);
if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    $conn->close();
    exit;
}

$stmt = $conn->prepare("SELECT username, password, is_admin FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    $stmt->close();
    $conn->close();
    exit;
}

$row = $result->fetch_assoc();
if (password_verify($password, $row['password'])) {
    $_SESSION['username'] = $row['username'];
    $_SESSION['is_admin'] = $row['is_admin'];
    echo json_encode(['success' => true, 'message' => 'Login successful', 'is_admin' => $row['is_admin']]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}

$stmt->close();
$conn->close();
?>