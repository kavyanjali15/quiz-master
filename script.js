// Global variables
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 300;
let questions = [];
let selectedTopic = '';
let currentUsername = '';
let hasRated = false;
let userRating = 0;


// DOM elements
const authSection = document.getElementById('auth-section');
const registerSection = document.getElementById('register-section');
const topicSection = document.getElementById('topic-section');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');
const addQuestionSection = document.getElementById('add-question-section');
const quizTitle = document.getElementById('quiz-title');
const timeDisplay = document.getElementById('time');
const questionDisplay = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const scoreDisplay = document.getElementById('score');
const scoresDisplay = document.getElementById('scores-display');

// Show a specific section and hide others
function showSection(sectionId) {
    const sections = [authSection, registerSection, topicSection, quizSection, resultSection, addQuestionSection];
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Start quiz for a specific topic
function startQuiz(topic) {
    
    selectedTopic = topic;
    resetQuiz();
    
    fetch(`get_questions.php?topic=${topic}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            questions = data;
            if (questions.length === 0) {
                throw new Error('No questions available for this topic');
            }
            showSection('quiz-section');
            quizTitle.textContent = `${topic} Quiz`;
            loadQuestion();
            startTimer();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error starting quiz: ${error.message}`);
        });
}

// Load the current question
function loadQuestion() {
    if (currentQuestion >= questions.length) return;
    
    const q = questions[currentQuestion];
    questionDisplay.innerHTML = `<div class="question-text">${q.question}</div>`;
    optionsContainer.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}.</span>
            <span class="option-text">${option}</span>
        `;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    nextButton.style.display = 'none';
    submitButton.style.display = 'none';
}

// Check if selected answer is correct
function checkAnswer(selectedIndex) {
    const q = questions[currentQuestion];
    const options = document.querySelectorAll('.option');
    
    // Disable all options
    options.forEach(btn => btn.disabled = true);
    
    // Mark selected option
    options[selectedIndex].classList.add('selected');
    
    // Check if answer is correct
    if (selectedIndex === q.correct_option - 1) {
        score++;
        options[selectedIndex].classList.add('correct');
    } else {
        options[selectedIndex].classList.add('wrong');
        // Highlight correct answer
        options[q.correct_option - 1].classList.add('correct');
    }
    
    nextButton.style.display = 'inline';
}

// Move to next question or end quiz
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

// Start the countdown timer
function startTimer() {
    timeLeft = 300;
    updateTimerDisplay();

    clearInterval(timer);
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay()
        
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000);
}
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    if (timeLeft <= 60) { // Last minute
        timeDisplay.style.color = '#e74c3c'; // Red color
        timeDisplay.style.fontWeight = 'bold';
    } else {
        timeDisplay.style.color = ''; // Default color
        timeDisplay.style.fontWeight = '';
    }
}

// End the quiz and show results
function endQuiz() {
    clearInterval(timer);
    quizSection.style.display = 'none';
    resultSection.style.display = 'block';
    
    const percentage = Math.round((score / questions.length) * 100);
    scoreDisplay.textContent = `Your score: ${score} out of ${questions.length} (${percentage}%)`;
    
    showScores(selectedTopic);
    saveScore();
}

// Save score to database
function saveScore() {
    const payload = {
        username: currentUsername,
        score: score,
        total: questions.length,
        topic: selectedTopic
    };

    console.log("Attempting to save score:", payload);

    fetch('save_score.php', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(currentUsername)}&score=${score}&total=${questions.length}&topic=${encodeURIComponent(selectedTopic)}`
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Save score response:", data);
        if (!data.success) {
            throw new Error(data.message || 'Failed to save score');
        }
        console.log("Score saved successfully:", data);
    })
    .catch(error => {
        console.error("Error saving score:", error);
        alert(`Error saving score: ${error.message}\nPlease check console for details.`);
    });
}

// Display user's scores
function showScores(topic = '') {
    fetch(`get_scores.php?username=${currentUsername}&topic=${topic}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) throw new Error(data.message || 'Failed to load scores');
            
            scoresDisplay.innerHTML = '<h3>Your Quiz Results</h3>';
            
            if (data.scores.length === 0) {
                scoresDisplay.innerHTML += '<p>No previous scores found</p>';
                return;
            }
            
            const table = document.createElement('table');
            table.innerHTML = `
                <tr>
                    <th>Topic</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date</th>
                </tr>
            `;
            
            data.scores.forEach(score => {
                const date = new Date(score.date);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${score.topic}</td>
                    <td>${score.score}/${score.total}</td>
                    <td>${score.percentage}%</td>
                    <td>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</td>
                `;
                table.appendChild(row);
            });
            
            scoresDisplay.appendChild(table);
        })
        .catch(error => {
            console.error('Error loading scores:', error);
            scoresDisplay.innerHTML += `<p>Error loading scores: ${error.message}</p>`;
        });
}

// Reset quiz variables
function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    clearInterval(timer);
    timeLeft = 60;
    questions = [];
}

// Logout user
function logout() {
    fetch('logout.php')
        .then(() => {
            currentUsername = '';
            resetQuiz();
            showSection('auth-section');
        })
        .catch(error => console.error('Error logging out:', error));
}

// Event Listeners
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    currentUsername = formData.get('username');
    
    fetch('login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSection('topic-section');
        } else {
            throw new Error(data.message || 'Login failed');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert(error.message);
    });
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    fetch('register.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful! Please login.');
            this.reset();
            showSection('auth-section');
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        alert(error.message);
    });
});

document.getElementById('add-question-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    formData.append('username', currentUsername);
    
    fetch('add_question.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Question added successfully!');
            this.reset();
        } else {
            throw new Error(data.message || 'Failed to add question');
        }
    })
    .catch(error => {
        console.error('Add question error:', error);
        alert(error.message);
    });
});

// Initialize the app
showSection('auth-section');
function endQuiz() {
    clearInterval(timer);
    quizSection.style.display = 'none';
    resultSection.style.display = 'block';
    
    const percentage = Math.round((score / questions.length) * 100);
    let message, scoreClass;
    
    if (percentage >= 80) {
        message = "🌟 Outstanding! You're a quiz master! 🌟";
        scoreClass = "high-score";
    } else if (percentage >= 60) {
        message = "👍 Great job! You've got solid knowledge!";
        scoreClass = "medium-score";
    } else if (percentage >= 40) {
        message = "💪 Good effort! Keep learning!";
        scoreClass = "medium-score";
    } else {
        message = "📚 Nice try! You'll do better next time!";
        scoreClass = "low-score";
    }
    
    scoreDisplay.innerHTML = `
        <h2>Quiz Completed!</h2>
        <div class="score-result">
            <p>Your score: <span class="score-value">${score}</span> out of <span class="score-value">${questions.length}</span></p>
            <p>Percentage: <span class="percentage">${percentage}%</span></p>
        </div>
        <div class="appreciation-message ${scoreClass}">
            ${message}
        </div>
        <!-- Rating Section -->
        <div id="rating-section" style="margin: 30px 0;">
            <h3>Rate this quiz:</h3>
            <div class="star-rating">
                ${[1, 2, 3, 4, 5].map(i => `
                    <span class="star" data-rating="${i}">☆</span>
                `).join('')}
            </div>
            <button id="submit-rating" class="submit-rating" disabled>Submit Rating</button>
        </div>
        
        <button class="generate-certificate" onclick="showCertificate()">
            Generate Certificate
        </button>
        
        <div id="certificate-display" style="display: none;"></div>
        
        <div class="action-buttons">
            <button onclick="showSection('topic-section')">Take Another Quiz</button>
            <button onclick="logout()">Logout</button>
        </div>
        
    `;
    // Initialize star rating functionality
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            userRating = rating;
            
            // Update star display
            stars.forEach((s, i) => {
                s.textContent = i < rating ? '★' : '☆';
                s.style.color = i < rating ? '#ffc107' : '#ccc';
            });
            
            // Enable submit button
            document.getElementById('submit-rating').disabled = false;
        });
        
        // Hover effects
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.style.color = '#ffc107';
                    s.style.transform = 'scale(1.2)';
                }
            });
        });
        
        star.addEventListener('mouseout', () => {
            stars.forEach((s, i) => {
                if (!userRating || i >= userRating) {
                    s.style.color = '#ccc';
                    s.style.transform = 'scale(1)';
                }
            });
        });
    });
    
    // Handle rating submission
    document.getElementById('submit-rating').addEventListener('click', () => {
        if (userRating > 0) {
            saveRating();
        }
    });

    
    
    showScores(selectedTopic);
    saveScore();
}
function showCertificate() {
    const percentage = Math.round((score / questions.length) * 100);
    let certificateTitle;
    
    if (percentage >= 80) {
        certificateTitle = "CERTIFICATE OF EXCELLENCE";
    } else if (percentage >= 60) {
        certificateTitle = "CERTIFICATE OF ACHIEVEMENT";
    } else {
        certificateTitle = "CERTIFICATE OF PARTICIPATION";
    }
    
    document.getElementById('certificate-display').innerHTML = `
        <div class="certificate-container">
            <h1 class="certificate-title">${certificateTitle}</h1>
            <h2 class="certificate-subtitle">OF APPRECIATION</h2>
            
            <div class="certificate-text">
                THIS CERTIFICATE IS PROUDLY PRESENTED TO:
            </div>
            
            <div class="recipient-name">${currentUsername}</div>
            
            <div class="certificate-text">
                For completing the ${selectedTopic} Quiz with a score of:
            </div>
            
            <div class="certificate-score ${percentage >= 80 ? 'high-score' : percentage >= 60 ? 'medium-score' : 'low-score'}">
                ${score}/${questions.length} (${percentage}%)
            </div>
            
            <div class="certificate-footer">
                <div class="coordinator-name">
                    Quiz Coordinator: T. Kavyanjali
                </div>
                <div class="certificate-date">
                    Date: ${new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
        
        <button class="download-certificate" onclick="downloadCertificate()">
            Download Certificate
        </button>
    `;
    
    document.getElementById('certificate-display').style.display = 'block';
    document.querySelector('.generate-certificate').style.display = 'none';
}

function downloadCertificate() {
    const percentage = Math.round((score / questions.length) * 100);
    let certificateTitle;
    
    if (percentage >= 80) {
        certificateTitle = "CERTIFICATE OF EXCELLENCE";
    } else if (percentage >= 60) {
        certificateTitle = "CERTIFICATE OF ACHIEVEMENT";
    } else {
        certificateTitle = "CERTIFICATE OF PARTICIPATION";
    }
    
    const certificateHTML = `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; }
            .certificate { 
                width: 800px; 
                min-height: 600px; 
                background-color: #f0f8ff; 
                border: 15px solid #1e90ff; 
                padding: 40px; 
                text-align: center; 
                margin: 0 auto;
                position: relative;
            }
            .certificate-title { 
                color: #1e90ff; 
                font-size: 2.5em; 
                text-transform: uppercase; 
                letter-spacing: 5px;
                margin-bottom: 10px;
            }
            .certificate-subtitle { 
                color: #1e90ff; 
                font-size: 1.8em; 
                border-bottom: 2px solid #1e90ff; 
                padding-bottom: 10px; 
                display: inline-block;
                margin-bottom: 30px;
            }
            .recipient-name { 
                font-size: 1.8em; 
                margin: 30px 0; 
                color: #333; 
                font-weight: bold; 
                text-transform: uppercase;
            }
            .certificate-text { font-size: 1.2em; margin: 20px 0; }
            .certificate-score { 
                font-size: 1.5em; 
                font-weight: bold; 
                margin: 20px 0;
            }
            .high-score { color: #27ae60; }
            .medium-score { color: #f39c12; }
            .low-score { color: #e74c3c; }
            .certificate-footer { 
                margin-top: 50px; 
                display: flex; 
                justify-content: space-between;
                position: absolute;
                bottom: 40px;
                left: 40px;
                right: 40px;
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="certificate-title">${certificateTitle}</div>
            <div class="certificate-subtitle">OF APPRECIATION</div>
            <div class="certificate-text">THIS CERTIFICATE IS PROUDLY PRESENTED TO:</div>
            <div class="recipient-name">${currentUsername}</div>
            <div class="certificate-text">For completing the ${selectedTopic} Quiz with a score of:</div>
            <div class="certificate-score ${percentage >= 80 ? 'high-score' : percentage >= 60 ? 'medium-score' : 'low-score'}">
                ${score}/${questions.length} (${percentage}%)
            </div>
            <div class="certificate-footer">
                <div class="coordinator-name">Quiz Coordinator: T. Kavyanjali</div>
                <div class="certificate-date">Date: ${new Date().toLocaleDateString()}</div>
            </div>
        </div>
    </body>
    </html>`;
    
    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUsername}_${selectedTopic}_Quiz_Certificate.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
async function saveRating() {
    const submitBtn = document.getElementById('submit-rating');
    const ratingSection = document.getElementById('rating-section');
    
    // Create error display if it doesn't exist
    if (!document.getElementById('rating-error')) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'rating-error';
        errorDiv.style.display = 'none';
        ratingSection.appendChild(errorDiv);
    }
    const errorDiv = document.getElementById('rating-error');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    errorDiv.style.display = 'none';

    try {
        const response = await fetch('save_rating.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: selectedTopic,
                rating: userRating
            })
        });

        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to save rating');
        }

        // Success case
        ratingSection.innerHTML = `
            <div class="rating-success">
                <p>Thank you for your ${userRating} star rating!</p>
                <div class="stars">${'★'.repeat(userRating)}${'☆'.repeat(5 - userRating)}</div>
            </div>
        `;

    } catch (error) {
        console.error("Rating submission error:", error);
        errorDiv.textContent = `Error: ${error.message}`;
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Rating';
    }
}