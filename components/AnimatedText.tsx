'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fadeIn' | 'slideUp' | 'slideRight' | 'slideLeft';
}

export default function AnimatedText({ 
  children, 
  className = '', 
  delay = 0,
  animation = 'slideUp'
}: AnimatedTextProps) {
  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: 0.8, delay }
      },
    },
    slideUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.8, delay }
      },
    },
    slideRight: {
      hidden: { opacity: 0, x: -30 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.8, delay }
      },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 30 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.8, delay }
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        ease: [0.25, 0.4, 0.25, 1],
      }}
      variants={animations[animation]}
      className={className}
    >
      {children}
    </motion.div>
  );
}
