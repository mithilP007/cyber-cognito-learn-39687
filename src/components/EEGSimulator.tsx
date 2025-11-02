import React, { useState, useEffect, useRef } from 'react';
import './EEGSimulator.css';

interface EEGData {
  attention: number;
  relaxation: number;
  drowsiness: number;
  engagement: number;
}

interface BrainState {
  label: string;
  color: string;
}

const EEGSimulator: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [eegData, setEegData] = useState<EEGData>({
    attention: 50,
    relaxation: 50,
    drowsiness: 20,
    engagement: 50,
  });
  const [brainState, setBrainState] = useState<BrainState>({
    label: 'Neutral',
    color: '#808080',
  });
  
  const canvasRefs = {
    attention: useRef<HTMLCanvasElement>(null),
    relaxation: useRef<HTMLCanvasElement>(null),
    drowsiness: useRef<HTMLCanvasElement>(null),
    engagement: useRef<HTMLCanvasElement>(null),
  };
  
  const dataBuffers = useRef<{
    attention: number[];
    relaxation: number[];
    drowsiness: number[];
    engagement: number[];
  }>({
    attention: [],
    relaxation: [],
    drowsiness: [],
    engagement: [],
  });
  
  const animationFrameId = useRef<number | null>(null);

  // Determine brain state based on EEG data
  const determineBrainState = (data: EEGData): BrainState => {
    if (data.drowsiness > 70) {
      return { label: 'Drowsy', color: '#9370DB' };
    } else if (data.attention > 70) {
      return { label: 'Highly Focused', color: '#FF4500' };
    } else if (data.relaxation > 70) {
      return { label: 'Relaxed', color: '#4169E1' };
    } else if (data.engagement > 70) {
      return { label: 'Engaged', color: '#32CD32' };
    } else if (data.attention > 50) {
      return { label: 'Focused', color: '#FFA500' };
    } else if (data.relaxation > 50) {
      return { label: 'Calm', color: '#87CEEB' };
    } else {
      return { label: 'Neutral', color: '#808080' };
    }
  };

  // Generate realistic EEG-like waveform data
  const generateEEGValue = (baseValue: number, time: number, frequency: number): number => {
    const noise = (Math.random() - 0.5) * 15;
    const wave = Math.sin(time * frequency) * 10;
    const slowWave = Math.sin(time * 0.05) * 20;
    return Math.max(0, Math.min(100, baseValue + wave + slowWave + noise));
  };

  // Draw waveform on canvas
  const drawWaveform = (
    canvas: HTMLCanvasElement | null,
    dataBuffer: number[],
    color: string,
    label: string
  ) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    // Draw label
    ctx.fillStyle = color;
    ctx.font = '12px Arial';
    ctx.fillText(label, 10, 20);
    
    // Draw waveform
    if (dataBuffer.length > 1) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const step = width / 200;
      dataBuffer.forEach((value, index) => {
        const x = index * step;
        const y = height - (value / 100) * height;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    }
  };

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    let time = 0;
    const maxBufferLength = 200;

    const animate = () => {
      time += 0.1;

      // Generate new EEG values
      const newData: EEGData = {
        attention: generateEEGValue(eegData.attention, time, 0.2),
        relaxation: generateEEGValue(eegData.relaxation, time, 0.15),
        drowsiness: generateEEGValue(eegData.drowsiness, time, 0.1),
        engagement: generateEEGValue(eegData.engagement, time, 0.25),
      };

      // Update data buffers
      Object.keys(dataBuffers.current).forEach((key) => {
        const typedKey = key as keyof typeof dataBuffers.current;
        dataBuffers.current[typedKey].push(newData[typedKey]);
        if (dataBuffers.current[typedKey].length > maxBufferLength) {
          dataBuffers.current[typedKey].shift();
        }
      });

      // Draw waveforms
      drawWaveform(
        canvasRefs.attention.current,
        dataBuffers.current.attention,
        '#FF6B6B',
        'Attention'
      );
      drawWaveform(
        canvasRefs.relaxation.current,
        dataBuffers.current.relaxation,
        '#4ECDC4',
        'Relaxation'
      );
      drawWaveform(
        canvasRefs.drowsiness.current,
        dataBuffers.current.drowsiness,
        '#95E1D3',
        'Drowsiness'
      );
      drawWaveform(
        canvasRefs.engagement.current,
        dataBuffers.current.engagement,
        '#FFD93D',
        'Engagement'
      );

      // Update EEG data and brain state
      setEegData(newData);
      setBrainState(determineBrainState(newData));

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRunning]);

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    Object.keys(dataBuffers.current).forEach((key) => {
      const typedKey = key as keyof typeof dataBuffers.current;
      dataBuffers.current[typedKey] = [];
    });
    setEegData({
      attention: 50,
      relaxation: 50,
      drowsiness: 20,
      engagement: 50,
    });
    setBrainState({ label: 'Neutral', color: '#808080' });
  };

  return (
    <div className="eeg-simulator">
      <div className="eeg-header">
        <h2>EEG Brain Wave Simulator</h2>
        <div className="brain-state" style={{ backgroundColor: brainState.color }}>
          <span className="brain-state-label">Current State: {brainState.label}</span>
        </div>
      </div>

      <div className="controls">
        <button 
          className={`control-button ${isRunning ? 'stop' : 'start'}`}
          onClick={toggleSimulation}
        >
          {isRunning ? '⏸ Stop Simulation' : '▶ Start Simulation'}
        </button>
        <button 
          className="control-button reset"
          onClick={resetSimulation}
        >
          🔄 Reset
        </button>
      </div>

      <div className="waveforms-container">
        <div className="waveform">
          <canvas 
            ref={canvasRefs.attention} 
            width={800} 
            height={120}
            className="waveform-canvas"
          />
          <div className="waveform-value" style={{ color: '#FF6B6B' }}>
            {eegData.attention.toFixed(1)}%
          </div>
        </div>

        <div className="waveform">
          <canvas 
            ref={canvasRefs.relaxation} 
            width={800} 
            height={120}
            className="waveform-canvas"
          />
          <div className="waveform-value" style={{ color: '#4ECDC4' }}>
            {eegData.relaxation.toFixed(1)}%
          </div>
        </div>

        <div className="waveform">
          <canvas 
            ref={canvasRefs.drowsiness} 
            width={800} 
            height={120}
            className="waveform-canvas"
          />
          <div className="waveform-value" style={{ color: '#95E1D3' }}>
            {eegData.drowsiness.toFixed(1)}%
          </div>
        </div>

        <div className="waveform">
          <canvas 
            ref={canvasRefs.engagement} 
            width={800} 
            height={120}
            className="waveform-canvas"
          />
          <div className="waveform-value" style={{ color: '#FFD93D' }}>
            {eegData.engagement.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="eeg-info">
        <p>This simulator generates realistic EEG-like waveforms for demonstration purposes.</p>
        <p>The brain state is determined by analyzing the relative levels of different brain waves.</p>
      </div>
    </div>
  );
};

export default EEGSimulator;
