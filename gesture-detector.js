// Gesture Detection Class
class GestureDetector {
    constructor() {
        this.model = null;
        this.isModelLoaded = false;
    }

    // Load the HandPose model
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

    // Detect hands in the video frame
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

    // Draw hand landmarks on canvas
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

            // Draw connections between points
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

    // Recognize gesture from hand landmarks (improved algorithm)
    recognizeGesture(predictions) {
        if (!predictions || predictions.length === 0) {
            return 'none';
        }

        const landmarks = predictions[0].landmarks;
        
        // Finger tip and base indices
        const thumbTip = 4, thumbBase = 2;
        const indexTip = 8, indexBase = 5;
        const middleTip = 12, middleBase = 9;
        const ringTip = 16, ringBase = 13;
        const pinkyTip = 20, pinkyBase = 17;
        const wrist = 0;

        // Calculate distances to determine if fingers are extended
        const fingerDistances = [
            { name: 'index', distance: this.getDistance(landmarks[indexTip], landmarks[wrist]) - this.getDistance(landmarks[indexBase], landmarks[wrist]) },
            { name: 'middle', distance: this.getDistance(landmarks[middleTip], landmarks[wrist]) - this.getDistance(landmarks[middleBase], landmarks[wrist]) },
            { name: 'ring', distance: this.getDistance(landmarks[ringTip], landmarks[wrist]) - this.getDistance(landmarks[ringBase], landmarks[wrist]) },
            { name: 'pinky', distance: this.getDistance(landmarks[pinkyTip], landmarks[wrist]) - this.getDistance(landmarks[pinkyBase], landmarks[wrist]) }
        ];

        // Count extended fingers (distance threshold lowered for better detection)
        const threshold = 40; // Lowered from implicit higher value
        let extendedFingers = fingerDistances.filter(f => f.distance > threshold).length;
        
        // Check which specific fingers are extended
        const indexExtended = fingerDistances[0].distance > threshold;
        const middleExtended = fingerDistances[1].distance > threshold;
        const ringExtended = fingerDistances[2].distance > threshold;
        const pinkyExtended = fingerDistances[3].distance > threshold;

        // Check thumb (horizontal distance from palm)
        const palmCenter = landmarks[0];
        const thumbDist = Math.abs(landmarks[thumbTip][0] - palmCenter[0]);
        const thumbBaseDist = Math.abs(landmarks[thumbBase][0] - palmCenter[0]);
        const thumbExtended = thumbDist > thumbBaseDist + 20;

        console.log(`Extended fingers: ${extendedFingers}, Thumb: ${thumbExtended}`);
        
        // ROCK: All fingers curled (0-1 extended fingers, thumb can be in or out)
        if (extendedFingers <= 1 && !thumbExtended) {
            return 'rock';
        }
        
        // PAPER: All or most fingers extended (4-5 fingers including thumb)
        if (extendedFingers >= 3 || (extendedFingers >= 2 && thumbExtended)) {
            return 'paper';
        }
        
        // SCISSORS: Specifically index and middle finger extended
        if ((indexExtended && middleExtended) && (!ringExtended && !pinkyExtended)) {
            return 'scissors';
        }
        
        // If 2 fingers but not the right ones, still might be scissors
        if (extendedFingers === 2 && (indexExtended || middleExtended)) {
            return 'scissors';
        }

        return 'unknown';
    }

    // Helper function to calculate Euclidean distance between two points
    getDistance(point1, point2) {
        const dx = point1[0] - point2[0];
        const dy = point1[1] - point2[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Get emoji for gesture (always yellow/default - using base emoji only)
    getGestureEmoji(gesture) {
        const emojis = {
            'rock': ['👊', '✊'],
            'paper': ['✋'],
            'scissors': ['✌️'],
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
            'none': 'Show your hand...',
            'unknown': 'Unknown gesture'
        };
        return names[gesture] || 'Unknown';
    }
}