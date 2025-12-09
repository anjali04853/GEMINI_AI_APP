import React from 'react';

// --- Types ---
interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface RadarData {
  subject: string;
  value: number;
}

// --- Bar Chart ---
export const SimpleBarChart = ({ data, height = 200 }: { data: ChartData[]; height?: number }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid div by 0

  return (
    <div className="flex items-end justify-between gap-2 w-full" style={{ height: `${height}px` }}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 100;
        return (
          <div key={index} className="flex flex-col items-center flex-1 group">
             <div className="relative w-full flex items-end justify-center h-full bg-slate-50 rounded-t-md overflow-hidden hover:bg-slate-100 transition-colors">
                <div 
                  className="w-4/5 bg-blue-500 rounded-t-sm transition-all duration-500 ease-out group-hover:bg-blue-600 relative"
                  style={{ height: `${barHeight}%` }}
                >
                   {/* Tooltip */}
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {item.value}
                   </div>
                </div>
             </div>
             <span className="text-xs text-slate-500 mt-2 font-medium truncate w-full text-center">
               {item.label}
             </span>
          </div>
        );
      })}
    </div>
  );
};

// --- Radar Chart ---
export const SimpleRadarChart = ({ data, size = 300 }: { data: RadarData[]; size?: number }) => {
  const center = size / 2;
  const radius = (size / 2) - 40; // Padding
  const levels = 4;
  const totalAxes = data.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Helper to get coordinates
  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleSlice - Math.PI / 2; // -PI/2 to start at top
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Generate web points
  const points = data.map((d, i) => {
    const { x, y } = getCoordinates(d.value, i);
    return `${x},${y}`;
  }).join(' ');

  // Generate Axis Labels
  const labels = data.map((d, i) => {
    const { x, y } = getCoordinates(115, i); // Push labels out slightly
    return (
      <text
        key={i}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-[10px] fill-slate-500 font-medium uppercase tracking-wider"
      >
        {d.subject}
      </text>
    );
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="max-w-[300px] mx-auto">
      {/* Grid Levels */}
      {[...Array(levels)].map((_, level) => {
        const factor = (level + 1) / levels;
        const levelPoints = data.map((_, i) => {
           const { x, y } = getCoordinates(100 * factor, i);
           return `${x},${y}`;
        }).join(' ');
        
        return (
          <polygon
            key={level}
            points={levelPoints}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        );
      })}

      {/* Axes */}
      {data.map((_, i) => {
        const { x, y } = getCoordinates(100, i);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        );
      })}

      {/* Data Polygon */}
      <polygon
        points={points}
        fill="rgba(59, 130, 246, 0.2)"
        stroke="#3b82f6"
        strokeWidth="2"
        className="drop-shadow-sm transition-all duration-500"
      />
      
      {/* Data Dots */}
      {data.map((d, i) => {
        const { x, y } = getCoordinates(d.value, i);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            className="fill-blue-600 stroke-white stroke-2"
          />
        );
      })}

      {labels}
    </svg>
  );
};

// --- Line Chart (Simulated with Bar for simplicity in this demo, or SVG polyline) ---
export const SimpleTrendChart = ({ data, height = 200 }: { data: number[]; height?: number }) => {
    const width = 500;
    const max = Math.max(...data, 100);
    const min = 0;
    
    // Scale X and Y
    const getX = (index: number) => (index / (data.length - 1)) * width;
    const getY = (value: number) => height - (value / max) * height;
    
    if (data.length < 2) return <div className="text-center text-slate-400 text-sm py-10">Not enough data for trend</div>;

    const points = data.map((val, i) => `${getX(i)},${getY(val)}`).join(' ');
    
    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            {/* Grid lines */}
            <line x1="0" y1={height} x2={width} y2={height} stroke="#e2e8f0" strokeWidth="1" />
            <line x1="0" y1={0} x2={width} y2={0} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Area */}
            <path 
                d={`M 0,${height} ${points} L ${width},${height} Z`} 
                fill="url(#gradient)" 
                opacity="0.2" 
            />
            <defs>
                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Line */}
            <polyline 
                points={points} 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            
            {/* Dots */}
            {data.map((val, i) => (
                <circle 
                    key={i}
                    cx={getX(i)}
                    cy={getY(val)}
                    r="4"
                    className="fill-white stroke-blue-600 stroke-2 hover:r-6 transition-all cursor-pointer"
                >
                    <title>{val}</title>
                </circle>
            ))}
        </svg>
    )
}
