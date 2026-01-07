# 🧠 Cyber Cognito Learn
## Mental Health Support Platform

An advanced AI-powered mental health support platform that leverages multimodal emotion detection, real-time EEG simulation, facial expression analysis, voice emotion recognition, and adaptive interventions to provide comprehensive mental wellness monitoring and personalized therapeutic support.

## 🎯 Overview

Cyber Cognito Learn is an innovative mental health support platform designed for the STC Hackathon that combines neuroscience, artificial intelligence, and modern web technologies to address mental wellness challenges. The system continuously monitors emotional states and cognitive patterns through multiple modalities, providing real-time insights, personalized interventions, and therapeutic support to help users maintain mental well-being and manage stress, anxiety, and depression.

## ✨ Main Functionalities

### 1. **Mental State Monitoring (EEG Simulation)**
- Real-time brain activity monitoring to detect stress, anxiety, and relaxation levels
- Tracks attention, relaxation, drowsiness, and engagement metrics
- Dynamic mental state detection: Focused, Drowsy, Calm, Engaged, Anxious, Stressed
- Personalized wellness recommendations based on detected cognitive states
- Privacy-first approach with explicit user consent for data collection

### 2. **Multimodal Emotion Detection & Analysis**
- **Facial Expression Analysis**: Real-time detection of emotions (happy, sad, angry, anxious, neutral, surprised, disgusted) using face-api.js
- **Voice Emotion Recognition**: Audio-based sentiment analysis to detect emotional distress
- Continuous emotion tracking across multiple modalities for comprehensive mental state assessment
- Color-coded visual feedback system:
  - Red: Sadness/Depression indicators
  - Yellow: Happiness/Positive emotions
  - Green: Neutral/Focused state
  - Purple: Anxiety/Stress indicators
- Engagement and attention scoring to identify mental fatigue

### 3. **AI-Powered Therapeutic Chat Assistant**
- Empathetic conversational AI for mental health support and emotional guidance
- Context-aware therapeutic responses
- Crisis detection and supportive interventions
- Integration with Hugging Face Transformers for natural language understanding
- 24/7 availability for emotional support

### 4. **Compassionate Robot Assistant**
- Animated companion providing emotional support and encouragement
- Voice-activated interaction with wake word detection
- Natural, empathetic conversation capabilities
- Reduces feelings of isolation through interactive companionship

### 5. **Wellness & Therapeutic Tools**
- **Brain-training games**: Cognitive exercises to reduce anxiety and improve focus
- **Mood Tracker**: Visual mood journaling and pattern recognition
- **VR Experience**: Immersive relaxation and meditation environments
- **Mindfulness Exercises**: Guided breathing and stress-reduction techniques
- **Progress Visualization**: Track mental wellness journey over time

### 6. **Comprehensive Wellness Dashboard**
- Real-time mental health monitoring and analytics
- Command center for tracking emotional patterns and triggers
- Visual analytics with charts showing mood trends, stress levels, and progress
- Early warning system for mental health concerns
- Personalized intervention recommendations
- Multiple dashboard views for different user needs (self-monitoring, therapist view)

## 🛠️ Tech Stack

### **Frontend Framework**
- **React 19.2.0** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server

### **Styling & UI Components**
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI components
  - Accordion, Dialog, Dropdown Menu, Tabs, Toast, Tooltip, and more
- **Framer Motion** - Advanced animations
- **Lucide React** - Icon library
- **shadcn/ui** - Pre-built component system

### **State Management & Data Fetching**
- **Redux Toolkit** - State management
- **TanStack Query (React Query)** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### **AI & Machine Learning**
- **Hugging Face Transformers** - AI model integration
- **face-api.js** - Facial expression detection and recognition

### **Routing & Navigation**
- **React Router DOM v7** - Client-side routing

### **Data Visualization**
- **Recharts** - Charts and graphs

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
- **Axios** - HTTP client

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS & Autoprefixer** - CSS processing
- **TypeScript ESLint** - TypeScript linting

## 📁 Folder Structure

```
cyber-cognito-learn-39687/
├── public/                          # Static assets
│   └── robots.txt
├── src/                            # Source code
│   ├── components/                 # React components
│   │   ├── ui/                    # shadcn/ui components (40+ components)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (and more)
│   │   ├── AIChat.tsx             # AI chatbot component
│   │   ├── AnimatedBackground.tsx # Animated background effects
│   │   ├── BrainGames.tsx         # Cognitive training games
│   │   ├── CameraEmotionAnalyzer.tsx  # Facial emotion detection
│   │   ├── Dashboard.tsx          # Main dashboard interface
│   │   ├── EEGControlPanel.tsx    # EEG monitoring controls
│   │   ├── EEGSimulator.tsx       # EEG simulation engine
│   │   ├── Hero.tsx               # Landing page hero section
│   │   ├── MicrophoneEmotionAnalyzer.tsx  # Voice emotion detection
│   │   ├── MoodTracker.tsx        # Mood tracking component
│   │   ├── Navigation.tsx         # Navigation bar
│   │   ├── RobotAssistant.tsx     # Robot assistant interface
│   │   ├── ThreeScene.tsx         # 3D visualization
│   │   ├── VRExperience.tsx       # VR interface
│   │   └── WorkflowDiagram.tsx    # System workflow visualization
│   ├── config/                    # Configuration files
│   │   └── emotionThemes.json     # Emotion theme configurations
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-mobile.tsx         # Mobile detection hook
│   │   ├── use-toast.ts           # Toast notification hook
│   │   ├── useEmotionDetection.ts # Emotion detection logic
│   │   ├── useEmotionSpeech.ts    # Speech synthesis hook
│   │   ├── useRobotConversation.ts # Robot conversation logic
│   │   └── useWakeWord.ts         # Wake word detection
│   ├── integrations/              # External service integrations
│   │   └── supabase/
│   │       ├── client.ts          # Supabase client configuration
│   │       └── types.ts           # Supabase type definitions
│   ├── lib/                       # Utility libraries
│   │   └── utils.ts               # Helper functions
│   ├── pages/                     # Page components (routing)
│   │   ├── EEGSimulatorPage.tsx   # EEG simulator page
│   │   ├── Index.tsx              # Home page
│   │   ├── MainDashboard.tsx      # Main dashboard page
│   │   ├── SubDashboard.tsx       # Sub dashboard page
│   │   └── NotFound.tsx           # 404 page
│   ├── types/                     # TypeScript type definitions
│   │   └── face-api.d.ts          # face-api.js types
│   ├── utils/                     # Utility functions
│   │   └── emotionDetection.ts    # Emotion detection utilities
│   ├── App.css                    # Global app styles
│   ├── App.tsx                    # Main App component
│   ├── index.css                  # Global CSS
│   ├── main.tsx                   # Application entry point
│   └── vite-env.d.ts              # Vite environment types
├── supabase/                      # Supabase configuration
│   ├── config.toml                # Supabase config
│   └── functions/
│       └── chat/
│           └── index.ts           # Chat function
├── .env                           # Environment variables
├── .gitignore                     # Git ignore rules
├── bun.lockb                      # Bun lock file
├── components.json                # shadcn/ui configuration
├── eslint.config.js               # ESLint configuration
├── index.html                     # HTML entry point
├── package.json                   # Project dependencies
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.app.json              # App-specific TS config
├── tsconfig.node.json             # Node-specific TS config
├── vite.config.ts                 # Vite configuration
└── webcam-colour.html             # Webcam testing page
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or Bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cyber-cognito-learn-39687
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with necessary configurations:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
bun run build
```

### Preview Production Build

```bash
npm run preview
# or
bun preview
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🎨 Key Features

### Privacy-First Design
- User consent management for data collection
- Local storage of user preferences
- Transparent data usage policies

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interfaces

### Accessibility
- WCAG compliant components (Radix UI)
- Keyboard navigation support
- Screen reader friendly

### Performance
- Code splitting and lazy loading
- Optimized bundle size
- Fast refresh during development

## 🔗 Integration Points

- **Supabase**: Backend services, authentication, and database
- **Hugging Face**: AI model integration for chat and analysis
- **face-api.js**: Real-time facial emotion recognition
- **Web APIs**: Camera, Microphone, Speech Synthesis

## 🏗️ Architecture

The application follows a modular component-based architecture:

1. **Presentation Layer**: React components with Tailwind CSS
2. **Business Logic Layer**: Custom hooks for state and behavior
3. **Data Layer**: Redux for global state, React Query for server state
4. **Integration Layer**: Supabase client and external API integrations

## 🎯 Problem Statement: Mental Health Support Platform

This project addresses the critical need for accessible, continuous, and personalized mental health support. By leveraging AI and multimodal sensing technologies, Cyber Cognito Learn provides:

- **Early Detection**: Identify signs of depression, anxiety, and stress through continuous monitoring
- **Personalized Support**: Adaptive interventions based on individual emotional patterns
- **24/7 Accessibility**: Round-the-clock AI companion for emotional support
- **Privacy & Security**: User-controlled data with transparent consent management
- **Evidence-Based Approach**: Combines neuroscience research with modern AI capabilities
- **Holistic Monitoring**: Integrates multiple data sources (facial, vocal, cognitive) for comprehensive assessment

## 🌟 Impact & Benefits

### For Individuals
- Self-awareness tools for understanding emotional patterns
- Immediate support during emotional distress
- Personalized coping strategies and interventions
- Progress tracking and mental wellness journey visualization
- Reduced stigma through private, judgment-free support

### For Mental Health Professionals
- Objective data on patient emotional states between sessions
- Trend analysis for better treatment planning
- Early warning system for crisis intervention
- Enhanced patient engagement through interactive tools

## 🔒 Privacy & Ethics

- **User Consent**: Explicit opt-in for all data collection
- **Data Ownership**: Users maintain full control over their data
- **Local Processing**: Emotion detection happens client-side when possible
- **Transparent Usage**: Clear communication about how data is used
- **HIPAA Compliance Ready**: Architecture designed for healthcare data protection standards

## 🤝 Contributing

This project was developed for the STC Hackathon to address mental health support challenges. For contributions, questions, or collaboration opportunities, please contact the development team.

## 📄 License

This project is proprietary and developed for mental health support and educational purposes.

## ⚠️ Disclaimer

This platform is designed to support mental wellness and is not a replacement for professional mental health care. If you are experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.

**Crisis Resources:**
- National Suicide Prevention Lifeline: 988 (US)
- Crisis Text Line: Text HOME to 741741
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

---

**Built with ❤️ for Mental Health Support | STC Hackathon 2026**

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
