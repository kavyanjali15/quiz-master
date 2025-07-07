<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$conn = new mysqli('localhost', 'root', '', 'quiz_app');
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

$topic = isset($_GET['topic']) ? $conn->real_escape_string($_GET['topic']) : '';
if (empty($topic)) {
    echo json_encode([]);
    $conn->close();
    exit;
}

$stmt = $conn->prepare("SELECT q.id, q.question, q.option1, q.option2, q.option3, q.option4, q.correct_option 
                        FROM questions q 
                        JOIN topics t ON q.topic_id = t.id 
                        WHERE t.name = ?");
$stmt->bind_param("s", $topic);
$stmt->execute();
$result = $stmt->get_result();

$questions = [];
while ($row = $result->fetch_assoc()) {
    $questions[] = [
        'id' => $row['id'],
        'question' => $row['question'],
        'options' => [$row['option1'], $row['option2'], $row['option3'], $row['option4']],
        'correct_option' => (int)$row['correct_option']
    ];
}

echo json_encode($questions);
$stmt->close();
$conn->close();
?>