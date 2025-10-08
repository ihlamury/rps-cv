// Game State
let playerScore = 0;
let computerScore = 0;
let isPlaying = false;
let detectionInterval = null;

// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const playBtn = document.getElementById('play-btn');
const resetBtn = document.getElementById('reset-btn');
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const playerChoiceEl = document.getElementById('player-choice');
const computerChoiceEl = document.getElementById('computer-choice');
const statusEl = document.getElementById('status');
const detectedGestureEl = document.getElementById('detected-gesture');

// Initialize Gesture Detector
const detector = new GestureDetector();

// Initialize the application
async function init() {
    try {
        // Request camera access
        statusEl.textContent = 'Requesting camera access...';
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: 640, 
                height: 480 
            } 
        });
        
        video.srcObject = stream;
        
        // Wait for video to be ready
        video.addEventListener('loadeddata', async () => {
            // Set canvas size to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Load the HandPose model
            statusEl.textContent = 'Loading hand detection model...';
            const modelLoaded = await detector.loadModel();
            
            if (modelLoaded) {
                statusEl.textContent = 'Ready to play! Click "Play Round" to start.';
                playBtn.textContent = 'Play Round';
                playBtn.disabled = false;
                
                // Start continuous hand detection for preview
                startContinuousDetection();
            } else {
                statusEl.textContent = 'Error loading model. Please refresh the page.';
            }
        });
        
    } catch (error) {
        console.error('Error initializing:', error);
        statusEl.textContent = 'Error: Could not access camera. Please allow camera access.';
    }
}

// Continuous hand detection for visual feedback
function startContinuousDetection() {
    detectionInterval = setInterval(async () => {
        if (!isPlaying) {
            const predictions = await detector.detectHands(video);
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw hand landmarks
            detector.drawHand(predictions, ctx);
            
            // Show detected gesture
            if (predictions && predictions.length > 0) {
                const gesture = detector.recognizeGesture(predictions);
                const name = detector.getGestureName(gesture);
                detectedGestureEl.textContent = name;
            } else {
                detectedGestureEl.textContent = 'Show your hand...';
            }
        }
    }, 100); // Update 10 times per second
}

// Play a round
async function playRound() {
    isPlaying = true;
    playBtn.disabled = true;
    
    // Countdown
    for (let i = 3; i > 0; i--) {
        statusEl.textContent = `Get ready... ${i}`;
        detectedGestureEl.textContent = 'Prepare your gesture';
        playerChoiceEl.textContent = '?';
        computerChoiceEl.textContent = '?';
        await sleep(1000);
    }
    
    // Give player time to show gesture and system time to detect
    statusEl.textContent = '📸 SHOW YOUR GESTURE NOW!';
    detectedGestureEl.textContent = 'Detecting...';
    statusEl.className = 'status detecting';
    
    // Wait a bit for player to position hand
    await sleep(500);
    
    // Detect multiple times and take the most common gesture (more reliable)
    const detections = [];
    for (let i = 0; i < 5; i++) {
        const predictions = await detector.detectHands(video);
        const gesture = detector.recognizeGesture(predictions);
        if (gesture !== 'none' && gesture !== 'unknown') {
            detections.push(gesture);
        }
        await sleep(100); // 100ms between detections
    }
    
    // Get most common detection (mode)
    let playerGesture = 'unknown';
    if (detections.length > 0) {
        playerGesture = detections.sort((a,b) =>
            detections.filter(v => v===a).length - detections.filter(v => v===b).length
        ).pop();
    }
    
    // Final detection and visual
    const predictions = await detector.detectHands(video);
    
    // Update detected gesture display to show what was captured
    const gestureName = detector.getGestureName(playerGesture);
    detectedGestureEl.textContent = gestureName;
    
    // Clear canvas and draw final hand position
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    detector.drawHand(predictions, ctx);
    
    // Check if valid gesture was detected
    if (playerGesture === 'none' || playerGesture === 'unknown') {
        statusEl.textContent = '❌ No valid gesture detected! Try again.';
        statusEl.className = 'status';
        playerChoiceEl.textContent = '❌';
        computerChoiceEl.textContent = '-';
        playBtn.disabled = false;
        isPlaying = false;
        return;
    }
    
    // Computer makes random choice
    const choices = ['rock', 'paper', 'scissors'];
    const computerGesture = choices[Math.floor(Math.random() * choices.length)];
    
    // Display choices
    playerChoiceEl.textContent = detector.getGestureEmoji(playerGesture);
    computerChoiceEl.textContent = detector.getGestureEmoji(computerGesture);
    
    // Determine winner
    const result = determineWinner(playerGesture, computerGesture);
    
    // Update scores
    if (result === 'win') {
        playerScore++;
        playerScoreEl.textContent = playerScore;
        statusEl.textContent = '🎉 You win!';
        statusEl.className = 'status win';
    } else if (result === 'lose') {
        computerScore++;
        computerScoreEl.textContent = computerScore;
        statusEl.textContent = '😔 Computer wins!';
        statusEl.className = 'status lose';
    } else {
        statusEl.textContent = '🤝 It\'s a tie!';
        statusEl.className = 'status tie';
    }
    
    // Re-enable play button
    await sleep(2000);
    playBtn.disabled = false;
    isPlaying = false;
    statusEl.className = 'status';
}

// Determine winner
function determineWinner(player, computer) {
    if (player === computer) return 'tie';
    
    if (
        (player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')
    ) {
        return 'win';
    }
    
    return 'lose';
}

// Reset scores
function resetScores() {
    playerScore = 0;
    computerScore = 0;
    playerScoreEl.textContent = '0';
    computerScoreEl.textContent = '0';
    playerChoiceEl.textContent = '-';
    computerChoiceEl.textContent = '-';
    statusEl.textContent = 'Scores reset! Ready to play.';
    statusEl.className = 'status';
}

// Helper function to sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Event Listeners
playBtn.addEventListener('click', playRound);
resetBtn.addEventListener('click', resetScores);

// Start the application
init();