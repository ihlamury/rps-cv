# Rock Paper Scissors CV 🤖✋

An interactive Rock Paper Scissors game that uses your webcam and hand gesture recognition to play against the computer. Built with TensorFlow.js HandPose for real-time computer vision.

## 🎮 Play Online

**Play Now →https://ihlamury.github.io/rps-cv

## ✨ Features

- **Real-time hand detection** using TensorFlow.js HandPose model
- **Hands-free control** - Use thumbs up 👍 to start the game (no clicking required!)
- **Four gesture recognition**:
  - 👍 **Thumbs Up** - Start/play a round
  - ✊ **Rock** - Closed fist
  - ✋ **Paper** - Open hand
  - ✌️ **Scissors** - Two fingers extended
- **Visual feedback** with hand skeleton overlay
- **Multi-sample detection** for improved accuracy
- **Score tracking** across multiple rounds
- **Responsive design** that works on desktop and mobile
- **Modern, minimal UI** inspired by Anthropic's design system

## 🎯 How to Play

1. **Allow camera access** when prompted
2. **Show thumbs up 👍** to start a round (or click "Play Round")
3. **Follow the countdown** (3-2-1)
4. **Show your gesture** when prompted (rock, paper, or scissors)
5. **See the result** - who wins?
6. **Repeat** - Show thumbs up again to play another round!

## 🛠️ Technologies

- **HTML5 Canvas** for video rendering
- **TensorFlow.js** with HandPose model for hand detection
- **Vanilla JavaScript** (no framework dependencies)
- **CSS3** with modern design principles
- **MediaDevices API** for webcam access

## 💻 Local Development

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari 14+, Edge)
- Python 3 or Node.js (for local server)

### Setup

```bash
# Clone the repository
git clone https://github.com/ihlamury/rps-cv.git
cd rps-cv

# Run a local server (choose one):

# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx serve

# Open in browser
# Navigate to http://localhost:8000
```

## 🧠 How It Works

### Computer Vision Pipeline

1. **Camera Input** → Captures video stream from webcam
2. **HandPose Model** → Detects 21 3D landmarks on your hand
3. **Gesture Recognition** → Custom algorithm analyzes finger positions
4. **Game Logic** → Compares your gesture vs computer's random choice

### Gesture Detection Algorithm

- **Relative Thresholds** - Adapts to hand size and distance from camera
- **Multi-point Analysis** - Checks finger extension using distance and position
- **Confidence Filtering** - Rejects low-confidence detections
- **Temporal Smoothing** - Takes 5 samples over 500ms for accuracy

### Key Improvements

- ✅ Works with all skin tones (landmark-based, not color-based)
- ✅ Handles partial finger curls naturally
- ✅ Robust to different lighting conditions
- ✅ No server required - runs entirely in browser

## 🎨 Design

Inspired by Anthropic's design system with:
- Warm beige/tan color palette
- Clean typography with appropriate hierarchy
- Subtle shadows and borders
- Minimal, professional aesthetic

## 🔧 Project Structure

```
rps-cv/
├── index.html              # Main HTML structure
├── style.css               # Styling and layout
├── app.js                  # Game logic and flow
├── gesture-detector.js     # Hand detection & recognition
└── README.md              # Documentation
```

## 📋 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari 14+
- ⚠️ Requires HTTPS or localhost for camera access

## 🐛 Troubleshooting

**Camera not working?**
- Ensure you've granted camera permissions
- Check that no other app is using the camera
- Try refreshing the page

**Hand not detected?**
- Ensure good lighting
- Position your hand clearly in view (1-2 feet from camera)
- Keep your hand at a reasonable distance

**Gestures not recognized accurately?**
- Make clear, distinct gestures
- Keep fingers fully extended for paper
- Curl all fingers tightly for rock
- Extend only index and middle fingers for scissors
- Check browser console (F12) for detection logs

**Model loading slowly?**
- The HandPose model (~12MB) downloads on first load
- Subsequent visits will be faster due to browser caching

## 🚀 Deployment

Deployed on **GitHub Pages** for free hosting:

1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Deploy from `main` branch, root folder
4. Site automatically updates on push (1-3 minutes)

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🤝 Contributing

This is a learning project, but suggestions and improvements are welcome!

- 🐛 **Report bugs** via GitHub Issues
- 💡 **Suggest features** via GitHub Issues
- 🔧 **Submit pull requests** with improvements
- ⭐ **Star the repo** if you find it useful!

## 👨‍💻 Author
- X (Twitter): [@yagizihlamur](https://x.com/yagizihlamur)
- GitHub: [@ihlamury](https://github.com/ihlamury)

---

**Status:** ✅ Live and fully functional

Built with ❤️ using computer vision and machine learning

**[Try it now](https://ihlamury.github.io/rps-cv/)**
