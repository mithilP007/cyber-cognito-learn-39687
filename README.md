# Welcome to Cyber Cognito Learn

## Project info

This is a web application project for learning and educational purposes.

## Features

### Webcam Emotion Analyzer

The application includes a real-time emotion detection feature using advanced AI models:

- **Live Webcam Feed**: Displays the webcam stream continuously and reliably
- **Real-time Emotion Detection**: Uses face-api.js (trained on FER2013 dataset) for accurate facial emotion recognition
- **Emotion to Color Mapping**:
  - **Sad/Depression**: Red (#ff4444)
  - **Happy**: Yellow (#ffeb3b)
  - **Neutral/Focus**: Green (#4caf50)
  - **Anxious**: Purple (#9c27b0)
- **Engagement & Attention Tracking**: Provides real-time metrics for user engagement and attention levels
- **Visual Feedback**: Background color changes dynamically based on detected emotion
- **Proper Cleanup**: Webcam resources are properly released when stopping the camera

#### Supported Emotions

The system can detect the following emotions:
- Happy
- Sad
- Angry
- Neutral
- Surprised
- Anxious/Fearful
- Disgusted

#### Technology Stack

- **face-api.js**: Lightweight face detection and emotion recognition
- **@vladmandic/face-api**: Enhanced version with better performance
- **React Hooks**: Custom hooks for emotion detection and speech feedback
- **TypeScript**: Type-safe implementation

#### Testing the Emotion Analyzer

1. Navigate to the emotion analyzer page in the application
2. Click "Start Camera" to begin webcam capture
3. Allow browser permissions for webcam access
4. The AI models will load (this may take a few seconds on first use)
5. Your emotion will be detected in real-time
6. Background color will change according to your detected emotion
7. View engagement and attention scores
8. Toggle AI detection or voice feedback using the switches
9. Click "Stop Camera" to end the session

#### Model Information

The emotion detection is powered by:
- **FER2013**: Facial Expression Recognition dataset
- **Face-api.js Models**: Pre-trained neural networks for face detection and expression analysis
- Models are loaded from CDN on first use
- Fallback mechanism available if models fail to load

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow the steps below:

```sh
git clone <your_git_url>
cd cyber-cognito-learn-39687
npm i
npm run dev
```

### Environment Setup

After cloning, the application will automatically:
1. Install dependencies including face-api.js
2. Configure Vite for optimal emotion detection model loading
3. Set up necessary paths and aliases

## How can I deploy this project?

### Deploy via [Vercel](https://vercel.com/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mithilP007/cyber-cognito-learn-39687)

## Key Files

- `src/components/CameraEmotionAnalyzer.tsx`: Main emotion analyzer component
- `src/hooks/useEmotionDetection.ts`: Custom hook for emotion detection using face-api.js
- `vite.config.ts`: Vite configuration optimized for AI model loading
- `package.json`: Dependencies including face-api.js and transformers

## Notes

- Webcam access requires HTTPS in production
- Models are loaded from CDN on first use
- Browser compatibility: Modern browsers with WebRTC support
- Recommended: Chrome, Firefox, Edge (latest versions)
