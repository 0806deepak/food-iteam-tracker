import React from 'react';

/**
 * AnimatedBackground - Replica aesthetic inspired by Food Stories & MyFitnessPal
 * Renders floating background culinary & nutritional graphic icons with organic drift animations,
 * combined with an ambient breathing radial gradient mesh backdrop.
 */
export const AnimatedBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* --- Dynamic Ambient Mesh Gradient Atmosphere --- */}
      <div className="absolute inset-0 opacity-40 dark:opacity-30">
        {/* Soft emerald / mint glow top left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-300/35 via-teal-200/25 to-transparent blur-3xl animate-ambient-mesh" />

        {/* Warm culinary peach / amber glow top right */}
        <div
          className="absolute -top-24 -right-24 w-88 h-88 rounded-full bg-gradient-to-bl from-amber-300/30 via-orange-200/20 to-transparent blur-3xl animate-ambient-mesh"
          style={{ animationDelay: '-4s' }}
        />

        {/* Sky / indigo hydration glow bottom center */}
        <div
          className="absolute -bottom-36 left-1/3 w-96 h-96 rounded-full bg-gradient-to-tr from-sky-300/30 via-indigo-200/20 to-transparent blur-3xl animate-ambient-mesh"
          style={{ animationDelay: '-8s' }}
        />

        {/* Soft rose / berry glow bottom right */}
        <div
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-tl from-rose-300/25 via-pink-200/15 to-transparent blur-3xl animate-ambient-mesh"
          style={{ animationDelay: '-6s' }}
        />
      </div>

      {/* --- Floating Culinary & Nutritional Icon Design Graphics --- */}
      <div className="absolute inset-0 opacity-45 dark:opacity-25">
        {/* 1. Fresh Avocado Graphic (Top Left) */}
        <div className="absolute top-[8%] left-[4%] animate-float-sway-1">
          <svg className="w-12 h-12 text-emerald-600 dark:text-emerald-400 drop-shadow-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2C8.5 2 5 7 5 13a7 7 0 0 0 14 0c0-6-3.5-11-7-11z" fill="currentColor" fillOpacity="0.12" />
            <circle cx="12" cy="14" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>

        {/* 2. Apple / Fruit Graphic (Top Right) */}
        <div className="absolute top-[12%] right-[6%] animate-float-sway-2">
          <svg className="w-11 h-11 text-rose-500 dark:text-rose-400 drop-shadow-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 4c.5-1.5 1.5-2 3-2" strokeLinecap="round" />
            <path d="M12 6c-2-2-5-2-7 0-2.5 2.5-2.5 7 0 9.5 2 2 4.5 3.5 7 3.5s5-1.5 7-3.5c2.5-2.5 2.5-7 0-9.5-2-2-5-2-7 0z" fill="currentColor" fillOpacity="0.12" />
          </svg>
        </div>

        {/* 3. Fresh Basil / Herb Leaf (Mid Left) */}
        <div className="absolute top-[34%] left-[2%] animate-float-sway-3">
          <svg className="w-10 h-10 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3s7 4 7 10a7 7 0 0 1-7 7z" fill="currentColor" fillOpacity="0.14" />
            <path d="M11 20V8" strokeLinecap="round" />
          </svg>
        </div>

        {/* 4. Energy Flame / Calorie Graphic (Top Center-Right) */}
        <div className="absolute top-[18%] left-[72%] animate-float-sway-4">
          <svg className="w-9 h-9 text-amber-500 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="currentColor" fillOpacity="0.16" />
          </svg>
        </div>

        {/* 5. Chef Hat / Cooking Toque (Mid Center-Left) */}
        <div className="absolute top-[48%] left-[8%] animate-float-sway-2">
          <svg className="w-11 h-11 text-indigo-500 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M6 18h12v3H6v-3z" fill="currentColor" fillOpacity="0.2" />
            <path d="M6 18c-2 0-3-1.5-3-3.5 0-2 1.5-3.5 3.5-3.5.5 0 1 .1 1.5.3C8.5 9 10.5 7 13 7c2 0 3.7 1.2 4.4 3 .4-.1.7-.2 1.1-.2 2.2 0 4 1.8 4 4s-1.8 4-4 4H6z" fill="currentColor" fillOpacity="0.1" />
          </svg>
        </div>

        {/* 6. Citrus / Lemon Slice (Mid Right) */}
        <div className="absolute top-[44%] right-[3%] animate-float-sway-1">
          <svg className="w-12 h-12 text-yellow-500 dark:text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.1" />
            <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" strokeOpacity="0.4" />
          </svg>
        </div>

        {/* 7. Salad Bowl / Meal Graphic (Lower Mid-Left) */}
        <div className="absolute top-[65%] left-[5%] animate-float-sway-3">
          <svg className="w-11 h-11 text-emerald-500 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M4 11h16a8 8 0 0 1-16 0z" fill="currentColor" fillOpacity="0.14" />
            <path d="M6 8c1-1 3-1 4 0m2-1c1-1 3-1 4 0" strokeLinecap="round" />
          </svg>
        </div>

        {/* 8. Fork & Spoon Culinary Emblem (Lower Mid-Right) */}
        <div className="absolute top-[62%] right-[5%] animate-float-sway-4">
          <svg className="w-10 h-10 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M18 2v6a2 2 0 0 1-2 2h-1v12h-2V10h-1a2 2 0 0 1-2-2V2" strokeLinecap="round" />
            <path d="M8 2v20M6 2v6M10 2v6" strokeLinecap="round" />
          </svg>
        </div>

        {/* 9. Carrot / Fresh Produce (Bottom Left) */}
        <div className="absolute bottom-[10%] left-[7%] animate-float-sway-2">
          <svg className="w-10 h-10 text-orange-500 dark:text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M8 12l8-8m-4-2l2 2m2-2l-2 2" strokeLinecap="round" />
            <path d="M7 11c2.5-2.5 6-3 8-1s1.5 5.5-1 8l-6 6c-.5.5-1.5.5-2 0s-.5-1.5 0-2l1-11z" fill="currentColor" fillOpacity="0.12" />
          </svg>
        </div>

        {/* 10. Water Droplet / Hydration Graphic (Bottom Center) */}
        <div className="absolute bottom-[14%] left-[45%] animate-float-sway-1">
          <svg className="w-8 h-8 text-sky-500 dark:text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" fillOpacity="0.18" />
          </svg>
        </div>

        {/* 11. Vitality Sparkle / Food Magic (Bottom Right) */}
        <div className="absolute bottom-[8%] right-[8%] animate-float-sway-3">
          <svg className="w-9 h-9 text-amber-400 dark:text-amber-300" viewBox="0 0 24 24" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
          </svg>
        </div>

        {/* 12. Strawberry Graphic (Center Ambient Float) */}
        <div className="absolute top-[28%] left-[22%] animate-float-sway-4 opacity-50">
          <svg className="w-8 h-8 text-rose-400 dark:text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 6c3-4 7-2 7 2 0 5-4 10-7 12-3-2-7-7-7-12 0-4 4-6 7-2z" fill="currentColor" fillOpacity="0.15" />
            <path d="M10 3c1 2 2 3 2 3s1-1 2-3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};
