'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RiskGaugeProps {
  riskScore: number; // 0-1
  size?: number;
  className?: string;
}

export default function RiskGauge({ riskScore, size = 200, className = '' }: RiskGaugeProps) {
  const percentage = Math.round(riskScore * 100);
  
  // Determine risk level and colors
  const getRiskLevel = (score: number) => {
    if (score < 0.2) return { level: 'Safe', color: '#10B981', bgColor: '#D1FAE5' };
    if (score < 0.5) return { level: 'Moderate', color: '#F59E0B', bgColor: '#FEF3C7' };
    return { level: 'Severe', color: '#EF4444', bgColor: '#FEE2E2' };
  };

  const riskInfo = getRiskLevel(riskScore);
  
  // Calculate angle for the gauge (0-180 degrees)
  const angle = (riskScore * 180) - 90; // -90 to 90 degrees
  
  // SVG path for the gauge arc
  const radius = (size - 40) / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  
  const startAngle = -90;
  const endAngle = 90;
  
  const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
  const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
  const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
  const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
  
  const largeArcFlag = 1;
  const sweepFlag = 1;
  
  const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
  
  // Calculate current position on the arc
  const currentAngle = (riskScore * 180) - 90;
  const currentX = centerX + radius * Math.cos((currentAngle * Math.PI) / 180);
  const currentY = centerY + radius * Math.sin((currentAngle * Math.PI) / 180);
  
  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background arc */}
        <path
          d={pathData}
          stroke="#E5E7EB"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Colored segments */}
        <path
          d={pathData}
          stroke="#10B981"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${radius * Math.PI * 0.6} ${radius * Math.PI * 0.4}`}
          strokeDashoffset="0"
        />
        <path
          d={pathData}
          stroke="#F59E0B"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${radius * Math.PI * 0.3} ${radius * Math.PI * 0.7}`}
          strokeDashoffset={`-${radius * Math.PI * 0.6}`}
        />
        <path
          d={pathData}
          stroke="#EF4444"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${radius * Math.PI * 0.4} ${radius * Math.PI * 0.6}`}
          strokeDashoffset={`-${radius * Math.PI * 0.9}`}
        />
        
        {/* Progress arc */}
        <motion.path
          d={pathData}
          stroke={riskInfo.color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${radius * Math.PI * riskScore} ${radius * Math.PI * (1 - riskScore)}`}
          strokeDashoffset="0"
          initial={{ strokeDasharray: `0 ${radius * Math.PI}` }}
          animate={{ strokeDasharray: `${radius * Math.PI * riskScore} ${radius * Math.PI * (1 - riskScore)}` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Needle */}
        <motion.line
          x1={centerX}
          y1={centerY}
          x2={currentX}
          y2={currentY}
          stroke={riskInfo.color}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ x2: centerX, y2: centerY }}
          animate={{ x2: currentX, y2: currentY }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Center dot */}
        <circle
          cx={centerX}
          cy={centerY}
          r="8"
          fill={riskInfo.color}
          stroke="white"
          strokeWidth="3"
        />
      </svg>
      
      {/* Labels */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl font-bold"
          style={{ color: riskInfo.color }}
        >
          {percentage}%
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-sm font-medium text-gray-600 mt-1"
        >
          {riskInfo.level} Risk
        </motion.div>
      </div>
      
      {/* Risk level indicators */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs">
        <div className="text-green-600 font-medium">Safe</div>
        <div className="text-yellow-600 font-medium">Moderate</div>
        <div className="text-red-600 font-medium">Severe</div>
      </div>
    </div>
  );
}
