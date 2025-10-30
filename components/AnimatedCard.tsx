'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fadeIn' | 'slideUp' | 'slideRight' | 'slideLeft' | 'scaleUp' | 'zoomIn';
}

export default function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0,
  animation = 'slideUp'
}: AnimatedCardProps) {
  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: 0.5 }
      },
    },
    slideUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5 }
      },
    },
    slideRight: {
      hidden: { opacity: 0, x: -30 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.5 }
      },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 30 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.5 }
      },
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.5 }
      },
    },
    zoomIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.5 }
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      variants={animations[animation]}
      whileHover={{
        scale: 1.03,
        y: -8,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
