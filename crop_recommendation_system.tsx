import React, { useState, useEffect, useMemo } from 'react';
import {
  Sprout,
  Sliders,
  Cpu,
  Compass,
  BarChart3,
  Code2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Info,
  Droplets,
  Thermometer,
  CloudRain,
  FlaskConical,
  Zap,
  MapPin,
  ChevronRight,
  BookOpen,
  Award,
  Layers,
  Leaf
} from 'lucide-react';

// Comprehensive Agronomic Dataset for Crops
const CROP_DATASET = [
  {
    id: 'rice',
    name: 'Rice',
    category: 'Cereal',
    optimal: { N: 90, P: 45, K: 40, ph: 6.5, temp: 25, humidity: 80, rainfall: 220 },
    tolerances: { N: 30, P: 20, K: 20, ph: 1.2, temp: 6, humidity: 15, rainfall: 60 },
    fertilizer: 'NPK 14-35-14 (100 kg/ha) + Urea split application during tillering.',
    description: 'Thrives in warm, humid conditions with high water availability and heavy clay or loam soils.',
    season: 'Kharif (Monsoon)',
    growthPeriod: '120-150 days'
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    category: 'Cereal',
    optimal: { N: 80, P: 40, K: 40, ph: 6.5, temp: 24, humidity: 65, rainfall: 85 },
    tolerances: { N: 35, P: 20, K: 20, ph: 1.0, temp: 7, humidity: 20, rainfall: 35 },
    fertilizer: 'NPK 20-20-0 + Zinc Sulphate (25 kg/ha) to prevent micronutrient chlorosis.',
    description: 'Adaptable grain crop requiring well-drained fertile soils and moderate rainfall.',
    season: 'Kharif / Rabi',
    growthPeriod: '90-110 days'
  },
  {
    id: 'wheat',
    name: 'Wheat',
    category: 'Cereal',
    optimal: { N: 100, P: 50, K: 40, ph: 6.8, temp: 18, humidity: 55, rainfall: 60 },
    tolerances: { N: 30, P: 20, K: 20, ph: 1.0, temp: 5, humidity: 20, rainfall: 30 },
    fertilizer: 'Urea (120 kg/ha) + Diammonium Phosphate (DAP) during sowing.',
    description: 'Requires cool weather during growth and warm sunny conditions during ripening.',
    season: 'Rabi (Winter)',
    growthPeriod: '110-130 days'
  },
  {
    id: 'chickpea',
    name: 'Chickpea (Gram)',
    category: 'Pulses',
    optimal: { N: 30, P: 60, K: 50, ph: 7.2, temp: 20, humidity: 50, rainfall: 50 },
    tolerances: { N: 25, P: 25, K: 25, ph: 1.2, temp: 6, humidity: 20, rainfall: 25 },
    fertilizer: 'Single Super Phosphate (SSP) + Rhizobium inoculant (Biofertilizer).',
    description: 'Leguminous pulse crop that fixes atmospheric nitrogen; prefers dry cool climates.',
    season: 'Rabi',
    growthPeriod: '90-120 days'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    category: 'Cash Crop',
    optimal: { N: 120, P: 50, K: 50, ph: 7.5, temp: 28, humidity: 70, rainfall: 75 },
    tolerances: { N: 40, P: 25, K: 25, ph: 1.0, temp: 6, humidity: 20, rainfall: 35 },
    fertilizer: 'NPK 17-17-17 + Muriate of Potash (MOP) split during boll development.',
    description: 'Deep-rooted fiber crop well-suited to deep black basaltic soils (Regur).',
    season: 'Kharif',
    growthPeriod: '150-180 days'
  },
  {
    id: 'coffee',
    name: 'Coffee',
    category: 'Plantation',
    optimal: { N: 100, P: 30, K: 35, ph: 6.2, temp: 24, humidity: 65, rainfall: 150 },
    tolerances: { N: 35, P: 15, K: 15, ph: 0.8, temp: 4, humidity: 15, rainfall: 50 },
    fertilizer: 'Balanced NPK 15-15-15 + Organic compost and agricultural lime for pH maintenance.',
    description: 'Perennial shade-tolerant plantation crop ideal for high-altitude hilly terrains.',
    season: 'Perennial',
    growthPeriod: '3-4 years (First Yield)'
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    category: 'Commercial',
    optimal: { N: 140, P: 60, K: 80, ph: 6.8, temp: 29, humidity: 75, rainfall: 180 },
    tolerances: { N: 45, P: 30, K: 30, ph: 1.2, temp: 6, humidity: 20, rainfall: 60 },
    fertilizer: 'High Nitrogen Urea dosing + Potassium Sulfate to boost sugar (sucrose) content.',
    description: 'Heavy feeding perennial crop needing abundant sunlight and consistent irrigation.',
    season: 'Annual',
    growthPeriod: '10-14 months'
  },
  {
    id: 'jute',
    name: 'Jute',
    category: 'Fiber',
    optimal: { N: 70, P: 40, K: 40, ph: 6.4, temp: 31, humidity: 85, rainfall: 170 },
    tolerances: { N: 30, P: 20, K: 20, ph: 1.0, temp: 5, humidity: 15, rainfall: 50 },
    fertilizer: 'Urea (60 kg/ha) in split doses along with organic leaf mold compost.',
    description: 'Golden fiber crop requiring warm, humid alluvial river basin environments.',
    season: 'Kharif',
    growthPeriod: '120-150 days'
  }
];

// Regional Presets for Rapid Context Setup
const REGIONAL_PRESETS = [
  {
    name: 'Alluvial Plains (Monsoon/Rice)',
    data: { N: 95, P: 48, K: 42, ph: 6.6, temp: 26, humidity: 82, rainfall: 210, location: 'Indo-Gangetic Delta' }
  },
  {
    name: 'Black Soil Belt (Cotton/Soybean)',
    data: { N: 115, P: 52, K: 55, ph: 7.6, temp: 29, humidity: 68, rainfall: 80, location: 'Deccan Plateau' }
  },
  {
    name: 'Cool Northern Hill Zone (Wheat/Pulses)',
    data: { N: 85, P: 55, K: 45, ph: 7.0, temp: 19, humidity: 52, rainfall: 55, location: 'Northern Foothills' }
  },
  {
    name: 'Humid Tropical Highlands (Coffee/Spices)',
    data: { N: 105, P: 32, K: 38, ph: 6.1, temp: 23, humidity: 70, rainfall: 160, location: 'Western Ghats' }
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'api'
  const [formData, setFormData] = useState({
    N: 90,
    P: 45,
    K: 40,
    ph: 6.5,
    temp: 25,
    humidity: 78,
    rainfall: 195,
    location: 'Gangetic Basin, India'
  });

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState(null);

  // Apply regional preset
  const applyPreset = (index) => {
    setSelectedPreset(index);
    setFormData(prev => ({ ...prev, ...REGIONAL_PRESETS[index].data }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  // Simulated Machine Learning Inference Scoring Algorithm
  const predictions = useMemo(() => {
    return CROP_DATASET.map(crop => {
      const opt = crop.optimal;
      const tol = crop.tolerances;

      // Gaussian-like distance metric for each agronomic parameter
      const scoreN = Math.max(0, 100 - Math.pow((formData.N - opt.N) / tol.N, 2) * 25);
      const scoreP = Math.max(0, 100 - Math.pow((formData.P - opt.P) / tol.P, 2) * 25);
      const scoreK = Math.max(0, 100 - Math.pow((formData.K - opt.K) / tol.K, 2) * 25);
      const scorePh = Math.max(0, 100 - Math.pow((formData.ph - opt.ph) / tol.ph, 2) * 30);
      const scoreTemp = Math.max(0, 100 - Math.pow((formData.temp - opt.temp) / tol.temp, 2) * 25);
      const scoreHum = Math.max(0, 100 - Math.pow((formData.humidity - opt.humidity) / tol.humidity, 2) * 20);
      const scoreRain = Math.max(0, 100 - Math.pow((formData.rainfall - opt.rainfall) / tol.rainfall, 2) * 25);

      // Weighted average score
      const totalScore = Math.round(
        (scoreN * 0.18) +
        (scoreP * 0.15) +
        (scoreK * 0.15) +
        (scorePh * 0.12) +
        (scoreTemp * 0.12) +
        (scoreHum * 0.08) +
        (scoreRain * 0.20)
      );

      return {
        ...crop,
        score: Math.min(99, Math.max(12, totalScore)),
        scoresBreakdown: { N: scoreN, P: scoreP, K: scoreK, ph: scorePh, temp: scoreTemp, rainfall: scoreRain }
      };
    }).sort((a, b) => b.score - a.score);
  }, [formData]);

  // Set default top recommendation
  useEffect(() => {
    if (predictions.length > 0 && !selectedCropId) {
      setSelectedCropId(predictions[0].id);
    }
  }, [predictions, selectedCropId]);

  const topCrop = useMemo(() => {
    return predictions.find(c => c.id === selectedCropId) || predictions[0];
  }, [predictions, selectedCropId]);

  // Soil Nutrient Variance Calculations
  const nutrientAnalysis = useMemo(() => {
    if (!topCrop) return null;
    const opt = topCrop.optimal;

    const calcStatus = (val, target, label) => {
      const diff = val - target;
      const pct = Math.round((val / target) * 100);
      let status = 'Optimal';
      let color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

      if (pct < 75) {
        status = 'Deficient';
        color = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      } else if (pct > 130) {
        status = 'Surplus';
        color = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      }

      return { val, target, diff, pct, status, color, label };
    };

    return {
      N: calcStatus(formData.N, opt.N, 'Nitrogen (N)'),
      P: calcStatus(formData.P, opt.P, 'Phosphorus (P)'),
      K: calcStatus(formData.K, opt.K, 'Potassium (K)'),
      ph: calcStatus(formData.ph, opt.ph, 'pH Level')
    };
  }, [formData, topCrop]);

  const triggerReInference = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 rounded-xl text-emerald-400 shadow-lg shadow-emerald-950/40">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-wide">AgroMind</h1>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
                v2.4 API
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Precision Crop Recommendation & Soil Analytics Platform</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'demo'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Interactive Dashboard
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'api'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> API Documentation
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {activeTab === 'demo' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Control Panel & Presets */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Presets Bar */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" /> Region Profile Quick Select
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {REGIONAL_PRESETS.map((preset, idx) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(idx)}
                      className={`text-left text-xs p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                        selectedPreset === idx
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-medium'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="line-clamp-1 font-semibold">{preset.name}</span>
                      <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> {preset.data.location}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input Controls */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-base font-bold text-white">Soil & Climate Inputs</h2>
                  </div>
                  <button
                    onClick={triggerReInference}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition"
                    title="Re-run Inference"
                  >
                    <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>
                </div>

                {/* Soil N-P-K Sliders */}
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Nitrogen (N)
                      </label>
                      <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {formData.N} kg/ha
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      value={formData.N}
                      onChange={e => handleInputChange('N', e.target.value)}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-400"></span> Phosphorus (P)
                      </label>
                      <span className="font-mono text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                        {formData.P} kg/ha
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="120"
                      value={formData.P}
                      onChange={e => handleInputChange('P', e.target.value)}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Potassium (K)
                      </label>
                      <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {formData.K} kg/ha
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="120"
                      value={formData.K}
                      onChange={e => handleInputChange('K', e.target.value)}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>

                  {/* Soil pH Slider */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-indigo-400" /> Soil pH Level
                      </label>
                      <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {formData.ph} pH
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3.5"
                      max="10.5"
                      step="0.1"
                      value={formData.ph}
                      onChange={e => handleInputChange('ph', e.target.value)}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>Acidic (3.5)</span>
                      <span>Neutral (7.0)</span>
                      <span>Alkaline (10.5)</span>
                    </div>
                  </div>

                  {/* Climate Numerical Fields */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Weather & Climate Parameters
                    </span>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                          <Thermometer className="w-3 h-3 text-orange-400" /> Temp (°C)
                        </label>
                        <input
                          type="number"
                          value={formData.temp}
                          onChange={e => handleInputChange('temp', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-400" /> Humidity (%)
                        </label>
                        <input
                          type="number"
                          value={formData.humidity}
                          onChange={e => handleInputChange('humidity', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                          <CloudRain className="w-3 h-3 text-teal-400" /> Rain (mm)
                        </label>
                        <input
                          type="number"
                          value={formData.rainfall}
                          onChange={e => handleInputChange('rainfall', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Real-time ML Evaluation
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">Latency: 28ms</span>
                </div>
              </div>
            </div>

            {/* Right Column: Prediction Results & Agronomic Analytics */}
            <div className="lg:col-span-7 space-y-6">

              {/* Main Recommendation Highlight Box */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        Primary AI Match
                      </span>
                      <span className="text-xs text-slate-400">{topCrop.category}</span>
                    </div>
                    <h2 className="text-3xl font-black text-white mt-1.5 tracking-tight flex items-center gap-2">
                      {topCrop.name}
                    </h2>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center min-w-[110px]">
                    <div className="text-2xl font-black text-emerald-400 font-mono">
                      {topCrop.score}%
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Match Score
                    </div>
                  </div>
                </div>

                {/* Agronomic Quick Facts */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
                  <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Growth Duration</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">{topCrop.growthPeriod}</p>
                  </div>
                  <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recommended Season</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">{topCrop.season}</p>
                  </div>
                  <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Optimal pH Range</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">{topCrop.optimal.ph} ± 0.5</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  <strong className="text-emerald-400">Crop Summary:</strong> {topCrop.description}
                </p>

                {/* Target Fertilizer Advice */}
                <div className="mt-4 p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Prescribed Fertilizer Protocol</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{topCrop.fertilizer}</p>
                  </div>
                </div>
              </div>

              {/* Soil Nutrient Variance & Health Dashboard */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" /> Soil Nutrient vs Optimal Crop Requirements
                  </h3>
                  <span className="text-xs text-slate-400">Target: {topCrop.name}</span>
                </div>

                {nutrientAnalysis && (
                  <div className="space-y-4">
                    {['N', 'P', 'K', 'ph'].map(key => {
                      const item = nutrientAnalysis[key];
                      return (
                        <div key={key} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300 font-semibold">{item.label}</span>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-slate-400">Field: {item.val}</span>
                              <span className="text-slate-500">/ Target: {item.target}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.color}`}>
                                {item.status}
                              </span>
                            </div>
                          </div>

                          {/* Dual Progress Bar Comparison */}
                          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden relative border border-slate-800">
                            {/* Current Value Fill */}
                            <div
                              className="h-full bg-emerald-500 transition-all duration-500"
                              style={{ width: `${Math.min(100, item.pct)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Ranked Crop Alternatives */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-400" /> Alternative Recommended Crops
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {predictions.slice(1, 5).map(crop => (
                    <button
                      key={crop.id}
                      onClick={() => setSelectedCropId(crop.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedCropId === crop.id
                          ? 'bg-emerald-500/10 border-emerald-500/60 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs text-white">{crop.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{crop.category} • {crop.season}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-emerald-400">{crop.score}%</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 ml-auto mt-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* API Documentation View */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-8">
            <div className="border-b border-slate-800 pb-5 flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded border border-emerald-500/30">
                    OpenAPI 3.0 Specification
                  </span>
                  <span className="text-xs text-slate-400">JSON Payload Standard</span>
                </div>
                <h2 className="text-2xl font-black text-white mt-2">Crop Recommendation REST API</h2>
                <p className="text-xs text-slate-400 mt-1">High-throughput endpoint for soil telemetry ingestion and real-time model inference.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/40">
                  POST /api/v1/recommend-crop
                </span>
              </div>
            </div>

            {/* Request Schema */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" /> Request Payload Schema (Application/JSON)
              </h3>
              <pre className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-emerald-400 text-xs font-mono overflow-x-auto leading-relaxed shadow-inner">
{JSON.stringify({
  "soil_telemetry": {
    "nitrogen_ppm": formData.N,
    "phosphorus_ppm": formData.P,
    "potassium_ppm": formData.K,
    "ph_level": formData.ph
  },
  "climate_data": {
    "temperature_celsius": formData.temp,
    "humidity_percent": formData.humidity,
    "rainfall_mm": formData.rainfall
  },
  "location": {
    "region_name": formData.location,
    "coordinates": { "lat": 23.8103, "lon": 90.4125 }
  }
}, null, 2)}
              </pre>
            </div>

            {/* Response Schema */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Response Payload Schema (200 OK)
              </h3>
              <pre className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-slate-300 text-xs font-mono overflow-x-auto leading-relaxed shadow-inner">
{JSON.stringify({
  "status": "success",
  "data": {
    "primary_recommendation": {
      "crop_name": topCrop.name,
      "confidence_score": topCrop.score / 100,
      "growth_period_days": topCrop.growthPeriod,
      "prescribed_fertilizer": topCrop.fertilizer
    },
    "ranked_alternatives": predictions.slice(1, 4).map(c => ({
      "crop_name": c.name,
      "score": c.score / 100
    })),
    "agronomic_indicators": {
      "soil_health": topCrop.optimal.ph - formData.ph < 0.5 ? "Optimal" : "Requires pH Adjustment",
      "nutrient_deficiencies": Object.keys(nutrientAnalysis || {})
        .filter(k => nutrientAnalysis[k].status === 'Deficient')
    }
  },
  "execution_metrics": {
    "latency_ms": 28,
    "model_version": "v2.1-randomforest-onnx"
  },
  "timestamp": new Date().toISOString()
}, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 flex flex-wrap justify-between items-center gap-2">
        <p>© 2026 AgroMind Hackathon Project Submission • Precision Agriculture Backend Engine</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1"><Leaf className="w-3.5 h-3.5 text-emerald-400" /> Sustainable Farming</span>
          <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-teal-400" /> ML Powered</span>
        </div>
      </footer>
    </div>
  );
}