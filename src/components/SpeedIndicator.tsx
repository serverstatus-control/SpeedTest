import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useEffect, useRef } from 'react';

interface SpeedIndicatorProps {
  icon: IconDefinition;
  value: number;
  unit: string;
  label: string;
  isTesting: boolean;
  maxValue?: number;
}

const SpeedIndicator = ({ icon, value, unit, label, isTesting, maxValue = 100 }: SpeedIndicatorProps) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = 100; // Raggio del cerchio
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (circleRef.current) {
      const progress = Math.min(value / maxValue, 1);
      const offset = circumference - (progress * circumference);
      circleRef.current.style.strokeDasharray = `${circumference}`;
      circleRef.current.style.strokeDashoffset = `${offset}`;
    }
  }, [value, maxValue, circumference]);

  return (
    <div className={`indicator ${isTesting ? 'testing' : ''}`}>
      <div className="icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="value">{value}</div>
      <div className="unit">{unit}</div>
      <div className="label">{label}</div>
      <div className="progress-ring">
        <svg viewBox="0 0 210 210">
          <circle
            ref={circleRef}
            className="progress-ring-circle"
            cx="105"
            cy="105"
            r={radius}
            fill="none"
            strokeWidth="3"
          />
        </svg>
      </div>
    </div>
  );
};

export default SpeedIndicator;
