// Improved Gesture Detection Class
class GestureDetector {
    constructor() {
        this.model = null;
        this.isModelLoaded = false;
    }

    async loadModel() {
        try {
            console.log('Loading HandPose model...');
            this.model = await handpose.load();
            this.isModelLoaded = true;
            console.log('HandPose model loaded successfully!');
            return true;
        } catch (error) {
            console.error('Error loading model:', error);
            return false;
        }
    }

    async detectHands(video) {
        if (!this.isModelLoaded || !this.model) {
            return null;
        }

        try {
            const predictions = await this.model.estimateHands(video);
            return predictions;
        } catch (error) {
            console.error('Error detecting hands:', error);
            return null;
        }
    }

    drawHand(predictions, ctx) {
        if (!predictions || predictions.length === 0) return;

        predictions.forEach(prediction => {
            const landmarks = prediction.landmarks;

            // Draw points
            for (let i = 0; i < landmarks.length; i++) {
                const [x, y] = landmarks[i];
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = '#00ff00';
                ctx.fill();
            }

            // Draw connections
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
                [0, 5], [5, 6], [6, 7], [7, 8], // Index
                [0, 9], [9, 10], [10, 11], [11, 12], // Middle
                [0, 13], [13, 14], [14, 15], [15, 16], // Ring
                [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
                [5, 9], [9, 13], [13, 17] // Palm
            ];

            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            connections.forEach(([start, end]) => {
                ctx.beginPath();
                ctx.moveTo(landmarks[start][0], landmarks[start][1]);
                ctx.lineTo(landmarks[end][0], landmarks[end][1]);
                ctx.stroke();
            });
        });
    }

    // IMPROVED: Recognize gesture with better accuracy INCLUDING THUMBS UP
    recognizeGesture(predictions) {
        if (!predictions || predictions.length === 0) {
            return 'none';
        }

        const prediction = predictions[0];
        const landmarks = prediction.landmarks;
        
        // Calculate palm size for relative measurements
        const palmSize = this.getDistance(landmarks[0], landmarks[9]);
        const relativeThreshold = palmSize * 0.5; // 50% of palm size
        
        // Finger indices
        const fingers = {
            thumb: { tip: 4, pip: 3, mcp: 2 },
            index: { tip: 8, pip: 7, mcp: 6 },
            middle: { tip: 12, pip: 11, mcp: 10 },
            ring: { tip: 16, pip: 15, mcp: 14 },
            pinky: { tip: 20, pip: 19, mcp: 18 }
        };
        
        const wrist = landmarks[0];
        
        // IMPROVED THUMBS UP DETECTION (Check first, more lenient)
        const thumbTip = landmarks[fingers.thumb.tip];
        const thumbMcp = landmarks[fingers.thumb.mcp];
        const indexMcp = landmarks[fingers.index.mcp];
        const middleMcp = landmarks[fingers.middle.mcp];
        const ringMcp = landmarks[fingers.ring.mcp];
        const pinkyMcp = landmarks[fingers.pinky.mcp];
        
        // Check if thumb tip is significantly above the other knuckles
        const thumbAboveIndex = thumbTip[1] < indexMcp[1] - palmSize * 0.2;
        const thumbAboveMiddle = thumbTip[1] < middleMcp[1] - palmSize * 0.2;
        const thumbAboveRing = thumbTip[1] < ringMcp[1] - palmSize * 0.2;
        
        // Check if other fingertips are NOT extended (curled down)
        const indexTip = landmarks[fingers.index.tip];
        const middleTip = landmarks[fingers.middle.tip];
        const ringTip = landmarks[fingers.ring.tip];
        const pinkyTip = landmarks[fingers.pinky.tip];
        
        const indexCurled = indexTip[1] > indexMcp[1] - palmSize * 0.1;
        const middleCurled = middleTip[1] > middleMcp[1] - palmSize * 0.1;
        const ringCurled = ringTip[1] > ringMcp[1] - palmSize * 0.1;
        const pinkyCurled = pinkyTip[1] > pinkyMcp[1] - palmSize * 0.1;
        
        // Thumbs up: thumb up, at least 2 other fingers curled
        const curledCount = [indexCurled, middleCurled, ringCurled, pinkyCurled].filter(Boolean).length;
        
        if ((thumbAboveIndex || thumbAboveMiddle || thumbAboveRing) && curledCount >= 2) {
            console.log('THUMBS UP DETECTED!', {
                thumbAboveIndex, thumbAboveMiddle, thumbAboveRing,
                curledCount, indexCurled, middleCurled, ringCurled, pinkyCurled
            });
            return 'thumbsup';
        }
        
        // Check each finger extension using improved method for game gestures
        const fingerStates = {
            thumb: this.isFingerExtended(landmarks, fingers.thumb, wrist, relativeThreshold, true),
            index: this.isFingerExtended(landmarks, fingers.index, wrist, relativeThreshold, false),
            middle: this.isFingerExtended(landmarks, fingers.middle, wrist, relativeThreshold, false),
            ring: this.isFingerExtended(landmarks, fingers.ring, wrist, relativeThreshold, false),
            pinky: this.isFingerExtended(landmarks, fingers.pinky, wrist, relativeThreshold, false)
        };
        
        const extendedCount = Object.values(fingerStates).filter(state => state).length;
        
        console.log('Finger states:', fingerStates, 'Extended:', extendedCount);
        
        // SCISSORS: Index and middle extended (most important check first!)
        if (fingerStates.index && fingerStates.middle) {
            // Allow scissors even if ring/pinky partially extended
            if (!fingerStates.ring || extendedCount <= 3) {
                return 'scissors';
            }
        }
        
        // ROCK: 0-1 fingers extended
        if (extendedCount <= 1 && !fingerStates.thumb) {
            return 'rock';
        }
        
        // PAPER: 3+ fingers extended (but not scissors)
        if (extendedCount >= 3) {
            return 'paper';
        }
        
        // 2 fingers, check which ones
        if (extendedCount === 2) {
            if (fingerStates.index || fingerStates.middle) {
                return 'scissors';
            }
        }
        
        return 'unknown';
    }
    
    // IMPROVED: Better finger extension detection
    isFingerExtended(landmarks, finger, wrist, threshold, isThumb) {
        const tip = landmarks[finger.tip];
        const pip = landmarks[finger.pip];
        const mcp = landmarks[finger.mcp];
        
        if (isThumb) {
            // Thumb: Check horizontal distance from palm center
            const palmCenter = landmarks[9]; // Middle finger base
            const tipDist = Math.abs(tip[0] - palmCenter[0]);
            const mcpDist = Math.abs(mcp[0] - palmCenter[0]);
            return tipDist > mcpDist + threshold * 0.4;
        } else {
            // Other fingers: Compare distances from wrist
            const tipToWrist = this.getDistance(tip, wrist);
            const mcpToWrist = this.getDistance(mcp, wrist);
            
            // Check if tip is "above" (lower Y value) the MCP joint (more lenient)
            const tipAboveMCP = tip[1] < mcp[1];
            
            // More lenient threshold for finger extension
            return (tipToWrist > mcpToWrist + threshold * 0.8) || tipAboveMCP;
        }
    }

    // Helper: Euclidean distance
    getDistance(point1, point2) {
        const dx = point1[0] - point2[0];
        const dy = point1[1] - point2[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Get emoji for gesture (always yellow/default)
    getGestureEmoji(gesture) {
        const emojis = {
            'rock': ['👊', '✊'],
            'paper': ['✋'],
            'scissors': ['✌️'],
            'thumbsup': ['👍'],
            'none': ['👋'],
            'unknown': ['❓']
        };
        
        const gestureEmojis = emojis[gesture] || ['❓'];
        const randomEmoji = gestureEmojis[Math.floor(Math.random() * gestureEmojis.length)];
        
        return randomEmoji;
    }

    // Get display name for gesture (text only, no emoji)
    getGestureName(gesture) {
        const names = {
            'rock': 'Rock',
            'paper': 'Paper',
            'scissors': 'Scissors',
            'thumbsup': 'Thumbs Up - Play!',
            'none': 'Show your hand...',
            'unknown': 'Unknown gesture'
        };
        return names[gesture] || 'Unknown';
    }
}