import React from 'react';
import { cn } from '../../lib/utils';

// --- Types ---
interface ChartData {
  label: string;
  value: number;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

interface RadarData {
  subject: string;
  value: number;
}

// --- Horizontal Bar Chart ---
export const HorizontalBarChart = ({ data }: { data: ChartData[] }) => {
  return (
    <div className="space-y-4 w-full">
      {data.map((item, index) => (
        <div key={index} className="space-y-1 group">
          <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative">
            <div 
               className={cn(
                 "h-full rounded-full transition-all duration-1000 ease-out relative group-hover:brightness-110",
                 !item.gradientFrom && "bg-brand-purple"
               )}
               style={{ 
                 width: `${item.value}%`,
                 backgroundImage: item.gradientFrom ? `linear-gradient(to right, ${item.gradientFrom}, ${item.gradientTo})` : undefined
               }}
            >
               <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Donut Chart ---
export const DonutChart = ({ data, size = 200 }: { data: ChartData[]; size?: number }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let currentAngle = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
        {data.map((item, index) => {
          const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`;
          const strokeDashoffset = -currentAngle;
          currentAngle += (item.value / total) * circumference;
          
          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth="12"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300 hover:stroke-[14] cursor-pointer"
            >
              <title>{item.label}: {item.value}</title>
            </circle>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-slate-900">{total}</span>
        <span className="text-xs text-slate-500 uppercase tracking-widest">Sessions</span>
      </div>
    </div>
  );
};

// --- Bar Chart ---
export const SimpleBarChart = ({ data, height = 200 }: { data: ChartData[]; height?: number }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid div by 0

  return (
    <div className="flex items-end justify-between gap-2 w-full" style={{ height: `${height}px` }}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 100;
        return (
          <div key={index} className="flex flex-col items-center flex-1 group cursor-pointer">
             <div className="relative w-full flex items-end justify-center h-full bg-slate-50/50 rounded-t-md overflow-hidden hover:bg-slate-100 transition-colors">
                <div 
                  className="w-4/5 rounded-t-sm transition-all duration-700 ease-out group-hover:w-full bg-gradient-to-t from-brand-purple to-brand-turquoise relative"
                  style={{ height: `${barHeight}%` }}
                >
                   {/* Tooltip */}
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg pointer-events-none">
                      {item.value} Sessions
                      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                   </div>
                </div>
             </div>
             <span className="text-[10px] text-slate-400 mt-2 font-medium truncate w-full text-center uppercase tracking-wider group-hover:text-brand-purple transition-colors">
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
    const { x, y } = getCoordinates(120, i); // Push labels out slightly
    return (
      <text
        key={i}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-[10px] fill-slate-500 font-bold uppercase tracking-wider"
      >
        {d.subject}
      </text>
    );
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="max-w-[300px] mx-auto overflow-visible">
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
            className="opacity-50"
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
        fill="rgba(108, 99, 255, 0.2)"
        stroke="#6C63FF"
        strokeWidth="2"
        className="drop-shadow-md transition-all duration-500 hover:fill-brand-purple/30"
      />
      
      {/* Data Dots */}
      {data.map((d, i) => {
        const { x, y } = getCoordinates(d.value, i);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            className="fill-brand-purple stroke-white stroke-2 hover:r-6 transition-all"
          >
             <title>{d.subject}: {d.value}</title>
          </circle>
        );
      })}

      {labels}
    </svg>
  );
};

// --- Line Chart ---
export const SimpleTrendChart = ({ data, height = 200 }: { data: number[]; height?: number }) => {
    const width = 500;
    const max = Math.max(...data, 100);
    
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
            <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#f1f5f9" strokeWidth="1" />
            
            {/* Area */}
            <path 
                d={`M 0,${height} ${points} L ${width},${height} Z`} 
                fill="url(#trendGradient)" 
                opacity="0.3" 
            />
            <defs>
                <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4ECDC4" />
                    <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
                     <stop offset="0%" stopColor="#4ECDC4" />
                     <stop offset="100%" stopColor="#6C63FF" />
                </linearGradient>
            </defs>

            {/* Line */}
            <polyline 
                points={points} 
                fill="none" 
                stroke="url(#lineGradient)" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="drop-shadow-sm"
            />
            
            {/* Dots */}
            {data.map((val, i) => (
                <circle 
                    key={i}
                    cx={getX(i)}
                    cy={getY(val)}
                    r="5"
                    className="fill-white stroke-brand-purple stroke-2 hover:r-7 transition-all cursor-pointer"
                >
                    <title>{val}%</title>
                </circle>
            ))}
        </svg>
    )
}