# Rock Paper Scissors CV 🤖✋

An interactive Rock Paper Scissors game that uses your webcam and hand gesture recognition to play against the computer. Built with TensorFlow.js HandPose for real-time computer vision.

## 🎮 How to Play

1. Allow camera access when prompted
2. Show rock (👊), paper (🫲), or scissors (✌️) gesture to your webcam
3. Click "Play Round" and follow the countdown
4. The computer will make its choice
5. See who wins!

## ✨ Features

- **Real-time hand detection** using TensorFlow.js HandPose model
- **Visual feedback** with hand skeleton overlay
- **Score tracking** across multiple rounds
- **Responsive design** that works on desktop and mobile
- **Inclusive representation** with diverse skin tone emojis
- **Works with all skin tones** - the computer vision model is trained on diverse hands

## 🛠️ Technologies

- HTML5 Canvas for video rendering
- TensorFlow.js with HandPose model for hand detection
- Vanilla JavaScript (no framework dependencies)
- CSS3 with modern gradients and animations
- MediaDevices API for webcam access

## 🚀 Play Online

[Coming Soon - Will be hosted on GitHub Pages]

## 💻 Local Development

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

## 🎯 Gesture Recognition

The app recognizes three gestures:

| Gesture | Description | How it works |
|---------|-------------|--------------|
| **Rock** 👊 | Closed fist | All fingers curled in |
| **Paper** 🫲 | Open hand | All fingers extended |
| **Scissors** ✌️ | Peace sign | Index and middle fingers extended |

## 🌈 Inclusive Design

- Emojis display with diverse skin tones to represent all users
- The TensorFlow.js HandPose model works reliably across all skin tones
- Hand detection uses landmark tracking, not color-based detection

## 📋 Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari 14+
- Requires HTTPS or localhost for camera access

## 🔧 Troubleshooting

**Camera not working?**
- Ensure you've granted camera permissions
- Check that no other app is using the camera
- Try refreshing the page

**Hand not detected?**
- Ensure good lighting
- Position your hand clearly in view
- Keep your hand at a reasonable distance from the camera

**Model loading slowly?**
- The HandPose model (~12MB) downloads on first load
- Subsequent visits will be faster due to browser caching

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🤝 Contributing

This is a learning project, but suggestions and improvements are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests
- Fork and create your own version

## 🙏 Acknowledgments

- TensorFlow.js team for the HandPose model
- Inspired by the classic Rock Paper Scissors game

---

**Status:** 🚧 Work in Progress

Built with ❤️ using computer vision and machine learning