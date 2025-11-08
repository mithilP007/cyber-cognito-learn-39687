import React, { useEffect, useMemo, useRef, useState } from 'react';
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

const PRIVACY_KEY = 'eegsim_privacy_consent_v1';

type ConsentValue = 'accepted' | 'declined' | null;

const brainStateFrom = (d: EEGData): BrainState => {
  if (d.drowsiness >= 65 && d.attention < 45) return { label: 'Drowsy', color: '#F76C6C' };
  if (d.attention >= 70 && d.engagement >= 65) return { label: 'Focused', color: '#2ECC71' };
  if (d.relaxation >= 70 && d.drowsiness < 40) return { label: 'Calm', color: '#4ECDC4' };
  if (d.engagement >= 70) return { label: 'Engaged', color: '#FFD93D' };
  return { label: 'Neutral', color: '#808080' };
};

const feedbackFor = (state: BrainState, d: EEGData): { title: string; message: string; tips: string[]; tone: 'success' | 'warning' | 'info'; } => {
  switch (state.label) {
    case 'Drowsy':
      return {
        title: 'Time for a breather',
        message: 'We detected signs of drowsiness. Short breaks can restore alertness.',
        tips: [
          'Stand, stretch, or grab some water',
          'Try 2–3 minutes of deep breathing',
          'Consider lowering screen brightness'
        ],
        tone: 'warning'
      };
    case 'Focused':
      return {
        title: 'Locked-in focus',
        message: 'Sustained attention and engagement detected—great momentum!',
        tips: [
          'Keep sessions 25–40 minutes to avoid fatigue',
          'Jot quick notes to capture insights',
          'Schedule a brief break soon to maintain quality'
        ],
        tone: 'success'
      };
    case 'Calm':
      return {
        title: 'Calm and steady',
        message: 'Relaxation levels are high—ideal for reflection and planning.',
        tips: [
          'Use this window for strategic thinking',
          'Light background music may help sustain calm',
          'Avoid multitasking to preserve balance'
        ],
        tone: 'info'
      };
    case 'Engaged':
      return {
        title: 'High engagement',
        message: 'Energy is up—channel it into meaningful tasks.',
        tips: [
          'Tackle medium-difficulty tasks now',
          'Group similar tasks to ride the momentum',
          'Track small wins to reinforce progress'
        ],
        tone: 'success'
      };
    default:
      return {
        title: 'Warming up',
        message: 'Your state is balanced. Ease into focus with a short goal.',
        tips: [
          'Define a 10-minute micro-goal',
          'Reduce notifications temporarily',
          'Adjust seating/lighting for comfort'
        ],
        tone: 'info'
      };
  }
};

const EEGSimulator: React.FC = () => {
  // Core sim state
  const [isRunning, setIsRunning] = useState(false);
  const [eegData, setEegData] = useState<EEGData>({ attention: 50, relaxation: 50, drowsiness: 20, engagement: 50 });
  const [brainState, setBrainState] = useState<BrainState>({ label: 'Neutral', color: '#808080' });

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
    engagement: useRef<HTMLCanvasElement>(null)
  };

  // Privacy/consent state
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Load consent from localStorage (local-only)
  useEffect(() => {
    try {
      const saved = (localStorage.getItem(PRIVACY_KEY) as ConsentValue) || null;
      setConsent(saved);
      if (!saved) setShowPrivacy(true);
    } catch {
      setShowPrivacy(true);
    }
  }, []);

  const persistConsent = (value: ConsentValue) => {
    try {
      if (value) localStorage.setItem(PRIVACY_KEY, value);
      else localStorage.removeItem(PRIVACY_KEY);
    } catch {}
    setConsent(value);
  };

  const handleAccept = () => {
    persistConsent('accepted');
    setShowPrivacy(false);
  };
  const handleDecline = () => {
    persistConsent('declined');
    setShowPrivacy(false);
    setIsRunning(false);
  };

  // Sim/update loop
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setEegData(prev => {
        if (mode === 'dataset' && uploadedDataset && uploadedDataset.length > 0) {
          const row = uploadedDataset[datasetIndex % uploadedDataset.length];
          setDatasetIndex(i => (i + 1) % uploadedDataset.length);
          return {
            attention: row.attention,
            relaxation: row.relaxation,
            drowsiness: row.drowsiness,
            engagement: row.engagement
          };
        }
        // Simulate gentle drift
        const jitter = () => (Math.random() - 0.5) * 6;
        const clamp = (v: number) => Math.max(0, Math.min(100, v));
        return {
          attention: clamp(prev.attention + jitter()),
          relaxation: clamp(prev.relaxation + jitter()),
          drowsiness: clamp(prev.drowsiness + jitter()),
          engagement: clamp(prev.engagement + jitter())
        };
      });
    }, 750);
    return () => clearInterval(id);
  }, [isRunning, mode, uploadedDataset, datasetIndex]);

  // Derive brain state and feedback
  useEffect(() => {
    setBrainState(brainStateFrom(eegData));
  }, [eegData]);

  const feedback = useMemo(() => feedbackFor(brainState, eegData), [brainState, eegData]);

  // Canvas rendering helper
  useEffect(() => {
    const render = (canvas: HTMLCanvasElement | null, value: number, color: string) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      // Axis
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      for (let y = 0; y <= 4; y++) {
        const yy = (y / 4) * h;
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(w, yy);
        ctx.stroke();
      }
      // Wave
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const amp = (value / 100) * (h * 0.35) + 6;
      for (let x = 0; x < w; x++) {
        const t = (x / w) * Math.PI * 4;
        const y = h / 2 + Math.sin(t) * amp * 0.6 + Math.cos(t * 0.5) * amp * 0.4;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    render(canvasRefs.attention.current, eegData.attention, '#45B7D1');
    render(canvasRefs.relaxation.current, eegData.relaxation, '#4ECDC4');
    render(canvasRefs.drowsiness.current, eegData.drowsiness, '#95E1D3');
    render(canvasRefs.engagement.current, eegData.engagement, '#FFD93D');
  }, [eegData]);

  // Upload handlers
  const handleDatasetUpload = async (file: File) => {
    setFileName(file.name);
    setUploadStatus('Parsing…');
    try {
      const text = await file.text();
      let rows: DatasetRow[] = [];
      if (file.name.toLowerCase().endsWith('.json')) {
        const parsed = JSON.parse(text);
        rows = Array.isArray(parsed) ? parsed : [];
      } else {
        // basic CSV support: header with attention,relaxation,drowsiness,engagement
        const [header, ...lines] = text.split(/\r?\n/).filter(Boolean);
        const cols = header.split(',').map(c => c.trim().toLowerCase());
        const idx = {
          attention: cols.indexOf('attention'),
          relaxation: cols.indexOf('relaxation'),
          drowsiness: cols.indexOf('drowsiness'),
          engagement: cols.indexOf('engagement')
        };
        lines.forEach(line => {
          const parts = line.split(',');
          const row: DatasetRow = {
            attention: Number(parts[idx.attention] || 0),
            relaxation: Number(parts[idx.relaxation] || 0),
            drowsiness: Number(parts[idx.drowsiness] || 0),
            engagement: Number(parts[idx.engagement] || 0)
          };
          rows.push(row);
        });
      }
      const filtered = rows.filter(r =>
        [r.attention, r.relaxation, r.drowsiness, r.engagement].every(v => Number.isFinite(v))
      );
      if (filtered.length === 0) throw new Error('No valid rows found');
      setUploadedDataset(filtered);
      setMode('dataset');
      setDatasetIndex(0);
      setUploadStatus(`Loaded ${filtered.length} rows`);
    } catch (e) {
      setUploadStatus('Failed to parse file');
      setUploadedDataset(null);
    }
  };

  const disableDataUse = consent === 'declined';

  return (
    <div className="eeg-simulator">
      <div className="header-row">
        <h2 className="eeg-title">EEG Simulator</h2>
        <div className="header-actions">
          <button className="btn subtle" onClick={() => setShowPrivacy(true)}>Privacy & Consent</button>
          <div className="consent-pill" data-state={consent || 'unset'}>
            {consent === 'accepted' && 'Opt-in: Local only'}
            {consent === 'declined' && 'Opt-out: Minimal features'}
            {!consent && 'Consent required'}
          </div>
        </div>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>Mode</label>
          <div className="segmented">
            <button className={mode === 'simulated' ? 'active' : ''} onClick={() => setMode('simulated')} disabled={disableDataUse && mode !== 'simulated'}>Simulated</button>
            <button className={mode === 'dataset' ? 'active' : ''} onClick={() => setMode('dataset')} disabled={disableDataUse || !uploadedDataset}>Dataset</button>
          </div>
        </div>
        <div className="control-group">
          <label>Run</label>
          <button className="btn primary" onClick={() => setIsRunning(r => !r)} disabled={disableDataUse && isRunning}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
        </div>
        <div className="control-group">
          <label>Upload dataset</label>
          <div className="upload-row">
            <input ref={fileInputRef} type="file" accept=".csv,.json,application/json,text/csv" onChange={e => e.target.files && handleDatasetUpload(e.target.files[0])} disabled={disableDataUse} />
            <span className="upload-status">{fileName ? `${fileName} — ${uploadStatus}` : uploadStatus}</span>
          </div>
        </div>
      </div>

      <div className="panels">
        <div className="panel waves">
          <div className="wave">
            <h3>Attention</h3>
            <div className="waveform">
              <canvas ref={canvasRefs.attention} width={800} height={120} className="waveform-canvas" />
              <div className="waveform-value" style={{ color: '#45B7D1' }}>{eegData.attention.toFixed(1)}%</div>
            </div>
          </div>
          <div className="wave">
            <h3>Relaxation</h3>
            <div className="waveform">
              <canvas ref={canvasRefs.relaxation} width={800} height={120} className="waveform-canvas" />
              <div className="waveform-value" style={{ color: '#4ECDC4' }}>{eegData.relaxation.toFixed(1)}%</div>
            </div>
          </div>
          <div className="wave">
            <h3>Drowsiness</h3>
            <div className="waveform">
              <canvas ref={canvasRefs.drowsiness} width={800} height={120} className="waveform-canvas" />
              <div className="waveform-value" style={{ color: '#95E1D3' }}>{eegData.drowsiness.toFixed(1)}%</div>
            </div>
          </div>
          <div className="wave">
            <h3>Engagement</h3>
            <div className="waveform">
              <canvas ref={canvasRefs.engagement} width={800} height={120} className="waveform-canvas" />
              <div className="waveform-value" style={{ color: '#FFD93D' }}>{eegData.engagement.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="panel feedback">
          <div className={`feedback-card tone-${feedback.tone}`}>
            <div className="feedback-header">
              <div className="state-dot" style={{ background: brainState.color }} />
              <div className="state-text">
                <span className="state-label">{brainState.label}</span>
                <span className="state-sub">Personalized guidance</span>
              </div>
            </div>
            <div className="feedback-body">
              <h4 className="feedback-title">{feedback.title}</h4>
              <p className="feedback-message">{feedback.message}</p>
              <ul className="feedback-tips">
                {feedback.tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
          <div className="eeg-info">
            <p>This simulator generates EEG-like waveforms</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EEGSimulator;
            
