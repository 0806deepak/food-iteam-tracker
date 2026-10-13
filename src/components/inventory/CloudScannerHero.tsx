import React from 'react';
import { Scan, Cloud } from 'lucide-react';
import { motion } from 'motion/react';

interface CloudScannerHeroProps {
  onOpenScanner: () => void;
  onOpenCloudExtractor?: () => void;
  onQuickBarcodeLookup?: (barcode: string) => void;
}

export const CloudScannerHero: React.FC<CloudScannerHeroProps> = ({
  onOpenScanner,
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none">
      {/* Outer Pulse/Radar Glow Effect */}
      <div className="absolute inset-0 rounded-full border-2 border-sky-400/40 animate-radar-pulse pointer-events-none -m-1" />

      {/* Floating Circular Scanner Button with Moving Cloud Theme (Scan Icon Only) */}
      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.92 }}
        onClick={onOpenScanner}
        aria-label="Scan"
        title="Scan barcode or food item"
        className="group relative overflow-hidden w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-sky-100 via-sky-50 to-blue-100/95 border-2 border-white shadow-xl shadow-sky-400/35 hover:shadow-2xl hover:shadow-sky-400/60 cursor-pointer flex items-center justify-center transition-all backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-sky-300/50"
      >
        {/* --- MOVING CLOUDS ANIMATION BACKGROUND (Light Theme) --- */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full select-none" aria-hidden="true">
          {/* Soft Sun Ray Glow */}
          <div className="absolute -top-3 -right-3 w-14 h-14 bg-gradient-to-br from-amber-200/60 to-transparent rounded-full blur-md animate-sun-pulse" />

          {/* Cloud Layer 1 - Slow Background Drift */}
          <div className="absolute top-1 w-24 opacity-60 animate-cloud-slow">
            <svg viewBox="0 0 100 45" className="w-full text-white fill-current drop-shadow-xs">
              <path d="M20 35 Q10 35 10 25 Q10 15 22 15 Q25 8 38 8 Q50 8 55 17 Q65 10 75 18 Q85 18 85 28 Q92 28 92 35 Z" />
            </svg>
          </div>

          {/* Cloud Layer 2 - Medium Mid Drift */}
          <div className="absolute -bottom-1 w-20 opacity-70 animate-cloud-medium">
            <svg viewBox="0 0 100 45" className="w-full text-sky-100 fill-current drop-shadow-xs">
              <path d="M15 32 Q8 32 8 22 Q8 14 18 14 Q22 6 34 6 Q44 6 49 14 Q58 8 68 15 Q76 15 76 25 Q82 25 82 32 Z" />
            </svg>
          </div>

          {/* Floating Cloud Puff */}
          <div className="absolute right-1 top-1 opacity-40 animate-cloud-float">
            <Cloud className="w-5 h-5 text-sky-200 fill-white" />
          </div>
        </div>

        {/* --- FOREGROUND BIG SCAN ICON (Icon Only) --- */}
        <div className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/40 flex items-center justify-center group-hover:scale-108 transition-transform">
          {/* Animated Laser Beam */}
          <div className="absolute left-1.5 right-1.5 h-0.5 bg-sky-100 shadow-[0_0_6px_#ffffff] animate-scan-laser rounded-full pointer-events-none" />
          <Scan className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.2]" />
        </div>
      </motion.button>
    </div>
  );
};
