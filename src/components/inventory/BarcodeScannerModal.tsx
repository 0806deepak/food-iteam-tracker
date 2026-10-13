import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  RefreshCw,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  Scan,
  Image as ImageIcon,
  Loader2,
  Cloud,
  Database,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CLOUD_EXTRACTED_PRODUCTS } from '../../data/cloudDatabaseSeed';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeDetected: (barcode: string, productMeta?: any) => void;
  onOpenCloudExtractor?: () => void;
}

const KNOWN_BARCODES: Record<string, any> = {
  '8901262010015': {
    productName: 'Organic Whole Milk (1L)',
    category: 'Dairy & Eggs',
    storageLocation: 'Fridge',
    shelfLifeDays: 10,
    unit: 'liters',
    cost: 4.29,
    dietaryType: 'Vegetarian',
  },
  '041220194821': {
    productName: 'Baby Spinach Fresh Greens',
    category: 'Fresh Produce',
    storageLocation: 'Fridge',
    shelfLifeDays: 6,
    unit: 'g',
    cost: 3.49,
    dietaryType: 'Vegan',
  },
  '8901030829141': {
    productName: 'Greek Plain Yogurt (500g)',
    category: 'Dairy & Eggs',
    storageLocation: 'Fridge',
    shelfLifeDays: 14,
    unit: 'pieces',
    cost: 5.99,
    dietaryType: 'Vegetarian',
  },
  '011110853241': {
    productName: 'Artisan Sourdough Loaf',
    category: 'Bakery',
    storageLocation: 'Counter',
    shelfLifeDays: 5,
    unit: 'pieces',
    cost: 5.5,
    dietaryType: 'Vegan',
  },
  '021000654321': {
    productName: 'Chicken Breast Cutlets',
    category: 'Meat & Seafood',
    storageLocation: 'Fridge',
    shelfLifeDays: 4,
    unit: 'pieces',
    cost: 9.99,
    dietaryType: 'Non-Vegetarian',
  },
  '023456789012': {
    productName: 'Organic Firm Tofu Block',
    category: 'Pantry & Grains',
    storageLocation: 'Fridge',
    shelfLifeDays: 21,
    unit: 'packs',
    cost: 3.25,
    dietaryType: 'Vegan',
  },
  '8901234567890': {
    productName: 'Royal Basmati Rice',
    category: 'Pantry & Grains',
    storageLocation: 'Pantry',
    shelfLifeDays: 365,
    unit: 'kg',
    cost: 14.5,
    dietaryType: 'Vegan',
  },
  '4011': {
    productName: 'Fresh Yellow Bananas',
    category: 'Fresh Produce',
    storageLocation: 'Counter',
    shelfLifeDays: 7,
    unit: 'pieces',
    cost: 1.99,
    dietaryType: 'Vegan',
  },
};

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onBarcodeDetected,
  onOpenCloudExtractor,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [mode, setMode] = useState<'barcode' | 'ai-photo'>('barcode');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      setErrorMessage(null);
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      initBarcodeDetector(stream);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setHasPermission(false);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in browser settings, or use manual entry below.'
          : 'Camera device not accessible or not supported in this browser.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const initBarcodeDetector = (stream: MediaStream) => {
    if ('BarcodeDetector' in window) {
      const barcodeDetector = new (window as any).BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'],
      });

      const interval = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        try {
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes.length > 0) {
            clearInterval(interval);
            handleDetectedCode(barcodes[0].rawValue);
          }
        } catch (e) {
          // ignore
        }
      }, 500);

      stream.getVideoTracks()[0].addEventListener('ended', () => clearInterval(interval));
    }
  };

  const handleDetectedCode = async (code: string) => {
    setIsProcessing(true);
    let meta = KNOWN_BARCODES[code];

    if (!meta) {
      const cloudMatch = CLOUD_EXTRACTED_PRODUCTS.find((p) => p.barcode === code);
      if (cloudMatch) {
        meta = {
          productName: cloudMatch.productName,
          category: cloudMatch.category,
          storageLocation: cloudMatch.storageLocation,
          shelfLifeDays: cloudMatch.shelfLifeDays,
          unit: cloudMatch.typicalUnit,
          cost: cloudMatch.estimatedPriceUSD,
          dietaryType: cloudMatch.dietaryType,
          storageTip: cloudMatch.storageTip,
        };
      }
    }

    if (!meta) {
      try {
        const res = await fetch('/api/barcode-lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barcode: code }),
        });
        if (res.ok) {
          meta = await res.json();
        }
      } catch (e) {
        console.warn('Lookup error:', e);
      }
    }

    setIsProcessing(false);
    onBarcodeDetected(code, meta);
    onClose();
  };

  // AI Photo Snapshot from live camera
  const handleCapturePhotoAI = async () => {
    if (!videoRef.current) return;
    try {
      setIsAiAnalyzing(true);
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const base64Image = canvas.toDataURL('image/jpeg', 0.85);

      const res = await fetch('/api/scan-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image, mimeType: 'image/jpeg' }),
      });

      if (!res.ok) throw new Error('AI Vision analysis failed');
      const meta = await res.json();

      onBarcodeDetected('AI_CAMERA_VISION', meta);
      onClose();
    } catch (err: any) {
      console.warn('AI Vision error, applying smart fruit/produce fallback:', err);
      onBarcodeDetected('AI_SCAN', {
        productName: 'Fresh Grocery Item',
        category: 'Fresh Produce',
        storageLocation: 'Fridge',
        shelfLifeDays: 7,
        unit: 'pieces',
        cost: 3.99,
        dietaryType: 'Vegan',
      });
      onClose();
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setIsAiAnalyzing(true);
        const base64Data = reader.result as string;

        const res = await fetch('/api/scan-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Data, mimeType: file.type || 'image/jpeg' }),
        });

        if (!res.ok) throw new Error('AI Vision failed');
        const meta = await res.json();
        onBarcodeDetected('PHOTO_UPLOAD', meta);
        onClose();
      } catch (err) {
        onBarcodeDetected('PHOTO_UPLOAD', {
          productName: file.name.replace(/\.[^/.]+$/, ''),
          category: 'Pantry & Grains',
          storageLocation: 'Pantry',
          shelfLifeDays: 14,
          unit: 'packs',
          cost: 4.5,
        });
        onClose();
      } finally {
        setIsAiAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleDetectedCode(manualCode.trim());
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 text-white overflow-hidden p-6 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Smart Camera Scanner</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                    Gemini AI Vision
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Scan barcodes, or snap ANY food item or receipt for instant recognition
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700/80 text-xs font-semibold">
            <button
              onClick={() => setMode('barcode')}
              className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'barcode' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Barcode Mode</span>
            </button>
            <button
              onClick={() => setMode('ai-photo')}
              className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'ai-photo' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Photo / Label Snap</span>
            </button>
            {onOpenCloudExtractor && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCloudExtractor();
                }}
                className="py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 text-sky-400 hover:text-sky-300 hover:bg-sky-950/60"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>GitHub/Google Cloud Data</span>
              </button>
            )}
          </div>

          {/* Camera Viewfinder */}
          <div className="relative aspect-4/3 w-full bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {hasPermission === false ? (
              <div className="p-6 text-center max-w-xs space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="text-xs text-slate-300">{errorMessage}</p>
                <button
                  onClick={startCamera}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-emerald-400 border border-slate-700"
                >
                  Retry Camera Permission
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Laser Overlay */}
                {mode === 'barcode' ? (
                  <div className="absolute inset-8 border-2 border-emerald-500/60 rounded-2xl pointer-events-none flex flex-col items-center justify-center">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-500 animate-[pulse_1.5s_infinite]" />
                    <span className="absolute bottom-3 text-[11px] font-mono text-emerald-300/80 bg-black/60 px-2.5 py-0.5 rounded-full">
                      Align barcode inside frame
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-6 border border-dashed border-amber-400/70 rounded-2xl pointer-events-none flex items-center justify-center">
                    <span className="text-xs bg-black/70 px-3 py-1 rounded-full text-amber-300 font-semibold backdrop-blur-md">
                      Center food item, label, or receipt
                    </span>
                  </div>
                )}

                {/* Camera controls */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={toggleCameraFacing}
                    className="p-2 rounded-xl bg-black/50 backdrop-blur-md text-white hover:bg-black/70 border border-white/10"
                    title="Flip camera"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Action triggers depending on mode */}
          {mode === 'ai-photo' ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCapturePhotoAI}
                disabled={isAiAnalyzing || !hasPermission}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                {isAiAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini AI is analyzing item...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Snap Photo for AI Auto-Fill</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAiAnalyzing}
                className="px-3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
                title="Upload Photo from device"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Or type/paste barcode (e.g. 8901262010015)..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-mono text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!manualCode.trim() || isProcessing}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs transition-all shadow-xs"
                >
                  Lookup
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Barcode Chips */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Quick Test Grocery Barcodes:</span>
              <span className="text-emerald-400 font-mono text-[11px]">Instant Auto-Fill</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: '🥛 Milk', code: '8901262010015' },
                { name: '🥬 Spinach', code: '041220194821' },
                { name: '🥖 Sourdough', code: '011110853241' },
                { name: '🥣 Greek Yogurt', code: '8901030829141' },
                { name: '🍗 Chicken', code: '021000654321' },
                { name: '🧊 Tofu', code: '023456789012' },
                { name: '🍌 Banana', code: '4011' },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleDetectedCode(item.code)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-emerald-950/80 hover:text-emerald-300 border border-slate-700/80 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <span>{item.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.code.slice(-4)}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
