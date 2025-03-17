import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface HalfCircleProgressBarProps {
  value: number;
  maxValue?: number;
  unit?: string;
  animated?: boolean;
  className?: string;
}

export default function HalfCircleProgressBar({
  value,
  maxValue = 160,
  unit = 'Km/h',
  animated = true,
  className = ''
}: HalfCircleProgressBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  const percentage = Math.min(100, (value / maxValue) * 100);

  useEffect(() => {
    if (animated) {
      setAnimatedValue(0);
      const timer = setTimeout(() => {
        setAnimatedValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(percentage);
    }
  }, [value, maxValue, animated, percentage]);

  const getColor = (percent: number) => {
    if (percent <= 33.33) {
      return '#10B981';
    } else if (percent <= 66.66) {
      return '#F59E0B';
    } else {
      return '#EF4444';
    }
  };

  const radius = 45;
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  const displayValue = animated ? Math.round((animatedValue / 100) * value) : value;

  return (
    <div className={clsx('relative flex flex-col items-center', className)}>
      <svg className="w-full h-16" viewBox="0 0 100 50">
        {/* Background path (gray semicircle) */}
        <path
          d="M5,45 A45,45 0 0,1 95,45"
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Foreground path (colored progress) */}
        <path
          d="M5,45 A45,45 0 0,1 95,45"
          fill="none"
          stroke={getColor(animatedValue)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: animated
              ? 'stroke-dashoffset 2s ease-in-out, stroke 2s ease-in-out'
              : 'none'
          }}
        />
      </svg>

      <div className="absolute bottom-3 flex flex-col items-center justify-center">
        <div className="text-xs font-medium leading-4">{unit}</div>
        <div className="text-xl font-bold leading-4">{displayValue.toFixed(0)}</div>
      </div>
    </div>
  );
}
