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

  useEffect(() => {
    if (circleRef.current) {
      const circumference = 339.292;
      const progress = Math.min(value / maxValue, 1);
      const offset = circumference - (progress * circumference);
      circleRef.current.style.strokeDashoffset = offset.toString();
    }
  }, [value, maxValue]);

  return (
    <div className={`indicator ${isTesting ? 'testing' : ''}`}>
      <div className="icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="value">{value}</div>
      <div className="unit">{unit}</div>
      <div className="label">{label}</div>
      <div className="progress-ring">
        <svg>
          <circle
            ref={circleRef}
            className="progress-ring-circle"
            cx="60"
            cy="60"
            r="54"
            strokeWidth="6"
          />
        </svg>
      </div>
    </div>
  );
};

export default SpeedIndicator;
