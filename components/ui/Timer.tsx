import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface TimerProps {
  duration: number; // Duration in seconds
  onComplete?: () => void;
  onTick?: (remainingTime: number) => void;
  autoStart?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  format?: 'mm:ss' | 'ss' | 'custom';
  customFormat?: (time: number) => string;
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  onComplete,
  onTick,
  autoStart = true,
  containerStyle,
  textStyle,
  format = 'mm:ss',
  customFormat,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(autoStart);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          onTick?.(newTime);
          
          if (newTime === 0) {
            setIsActive(false);
            onComplete?.();
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, onComplete, onTick]);

  const formatTime = (seconds: number): string => {
    if (customFormat) {
      return customFormat(seconds);
    }

    switch (format) {
      case 'ss':
        return seconds.toString().padStart(2, '0');
      case 'mm:ss':
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      default:
        return seconds.toString();
    }
  };

  const start = () => {
    setIsActive(true);
  };

  const pause = () => {
    setIsActive(false);
  };

  const reset = (newDuration?: number) => {
    setTimeLeft(newDuration || duration);
    setIsActive(false);
  };

  const restart = (newDuration?: number) => {
    setTimeLeft(newDuration || duration);
    setIsActive(true);
  };

  // Expose control methods through ref
  React.useImperativeHandle(React.useRef(), () => ({
    start,
    pause,
    reset,
    restart,
    timeLeft,
    isActive,
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.timerText, textStyle]}>
        {formatTime(timeLeft)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
});
