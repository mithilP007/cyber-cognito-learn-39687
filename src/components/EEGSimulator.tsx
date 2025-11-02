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

interface DatasetRow {
  attention: number;
  relaxation: number;
  drowsiness: number;
  engagement: number;
  timestamp?: number;
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

  // Dataset upload state
  const [uploadedDataset, setUploadedDataset] = useState<DatasetRow[] | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [mode, setMode] = useState<'simulated' | 'dataset'>('simulated');
  const [datasetIndex, setDatasetIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadStatus('Uploading...');

    try {
      const text = await file.text();
      let parsedData: DatasetRow[] = [];

      // Parse CSV
      if (file.name.endsWith('.csv')) {
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          const row: any = {};
          
          headers.forEach((header, index) => {
            const value = parseFloat(values[index]);
            if (!isNaN(value)) {
              row[header] = value;
            }
          });

          if (row.attention !== undefined && row.relaxation !== undefined && 
              row.drowsiness !== undefined && row.engagement !== undefined) {
            parsedData.push({
              attention: row.attention,
              relaxation: row.relaxation,
              drowsiness: row.drowsiness,
              engagement: row.engagement,
              timestamp: row.timestamp
            });
          }
        }
      }
      // Parse JSON
      else if (file.name.endsWith('.json')) {
        const jsonData = JSON.parse(text);
        parsedData = Array.isArray(jsonData) ? jsonData : [jsonData];
      }

      if (parsedData.length > 0) {
        setUploadedDataset(parsedData);
        setUploadStatus(`✓ Loaded ${parsedData.length} data points`);
        setMode('dataset');
        setDatasetIndex(0);
      } else {
        setUploadStatus('❌ Invalid data format');
      }
    } catch (error) {
      setUploadStatus('❌ Error parsing file');
      console.error('File parsing error:', error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const toggleMode = () => {
    if (uploadedDataset && uploadedDataset.length > 0) {
      setMode(mode === 'simulated' ? 'dataset' : 'simulated');
      setDatasetIndex(0);
    }
  };

  const generateRandomEEG = () => {
    const variation = 10;
    return {
      attention: Math.max(0, Math.min(100, eegData.attention + (Math.random() - 0.5) * variation)),
      relaxation: Math.max(0, Math.min(100, eegData.relaxation + (Math.random() - 0.5) * variation)),
      drowsiness: Math.max(0, Math.min(100, eegData.drowsiness + (Math.random() - 0.5) * variation)),
      engagement: Math.max(0, Math.min(100, eegData.engagement + (Math.random() - 0.5) * variation)),
    };
  };

  const determineBrainState = (data: EEGData): BrainState => {
    if (data.attention > 70) return { label: 'Highly Focused', color: '#FF6B6B' };
    if (data.relaxation > 70) return { label: 'Deeply Relaxed', color: '#4ECDC4' };
    if (data.drowsiness > 60) return { label: 'Drowsy', color: '#95E1D3' };
    if (data.engagement > 70) return { label: 'Engaged', color: '#FFD93D' };
    if (data.attention > 50 && data.engagement > 50) return { label: 'Active Learning', color: '#F38181' };
    return { label: 'Neutral', color: '#808080' };
  };

  const drawWaveform = (canvas: HTMLCanvasElement, data: number[], color: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const points = Math.min(data.length, canvas.width);
    const amplitude = canvas.height / 2;
    const frequency = 0.05;

    for (let i = 0; i < points; i++) {
      const x = (canvas.width - points) + i;
      const normalizedValue = (data[i] - 50) / 50;
      const wave = Math.sin(i * frequency) * normalizedValue * amplitude * 0.5;
      const y = amplitude + wave;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      let newData: EEGData;

      if (mode === 'dataset' && uploadedDataset && uploadedDataset.length > 0) {
        // Use dataset data
        const dataPoint = uploadedDataset[datasetIndex];
        newData = {
          attention: dataPoint.attention,
          relaxation: dataPoint.relaxation,
          drowsiness: dataPoint.drowsiness,
          engagement: dataPoint.engagement,
        };
        setDatasetIndex((prevIndex) => (prevIndex + 1) % uploadedDataset.length);
      } else {
        // Use simulated data
        newData = generateRandomEEG();
      }

      setEegData(newData);
      setBrainState(determineBrainState(newData));

      // Update data buffers
      Object.keys(dataBuffers.current).forEach((key) => {
        const buffer = dataBuffers.current[key as keyof typeof dataBuffers.current];
        buffer.push(newData[key as keyof EEGData]);
        if (buffer.length > 800) buffer.shift();
      });

      // Draw waveforms
      Object.entries(canvasRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const colors = {
            attention: '#FF6B6B',
            relaxation: '#4ECDC4',
            drowsiness: '#95E1D3',
            engagement: '#FFD93D',
          };
          drawWaveform(
            ref.current,
            dataBuffers.current[key as keyof typeof dataBuffers.current],
            colors[key as keyof typeof colors]
          );
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, mode, uploadedDataset, datasetIndex, eegData]);

  return (
    <div className="eeg-simulator">
      <div className="eeg-header">
        <h2>EEG Brain Wave Simulator</h2>
        <div className="controls">
          <button
            className={`control-btn ${isRunning ? 'stop' : 'start'}`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Stop' : 'Start'} Simulation
          </button>
        </div>
      </div>

      {/* Dataset Upload Section */}
      <div className="dataset-section">
        <h3>Dataset Upload</h3>
        <div className="upload-controls">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button className="upload-btn" onClick={handleUploadClick}>
            📁 Upload Dataset (CSV/JSON)
          </button>
          {fileName && (
            <span className="file-name">File: {fileName}</span>
          )}
          {uploadStatus && (
            <span className={`upload-status ${uploadStatus.includes('✓') ? 'success' : uploadStatus.includes('❌') ? 'error' : 'loading'}`}>
              {uploadStatus}
            </span>
          )}
        </div>
        {uploadedDataset && uploadedDataset.length > 0 && (
          <div className="mode-toggle">
            <label>
              <input
                type="radio"
                name="mode"
                value="simulated"
                checked={mode === 'simulated'}
                onChange={toggleMode}
              />
              Simulated Mode
            </label>
            <label>
              <input
                type="radio"
                name="mode"
                value="dataset"
                checked={mode === 'dataset'}
                onChange={toggleMode}
              />
              Dataset Mode ({uploadedDataset.length} points)
            </label>
          </div>
        )}
      </div>

      <div className="brain-state" style={{ backgroundColor: brainState.color }}>
        <h3>Current Brain State: {brainState.label}</h3>
        {mode === 'dataset' && uploadedDataset && (
          <p className="dataset-indicator">📊 Using uploaded dataset (point {datasetIndex + 1}/{uploadedDataset.length})</p>
        )}
      </div>

      <div className="waveforms">
        <h3>Attention</h3>
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

        <h3>Relaxation</h3>
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

        <h3>Drowsiness</h3>
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

        <h3>Engagement</h3>
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
        <p>Upload a CSV or JSON dataset with columns: attention, relaxation, drowsiness, engagement (values 0-100).</p>
      </div>
    </div>
  );
};

export default EEGSimulator;
