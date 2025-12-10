import React, { useEffect, useState } from 'react';
import { loadingService } from '../utils/loadingService';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalLoader = () => {
  const [isLoading, setIsLoading] = useState(loadingService.getIsLoading());

  useEffect(() => {
    const unsubscribe = loadingService.subscribe((loading) => {
      setIsLoading(loading);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-200 opacity-25"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-white font-medium text-lg tracking-wide">Loading...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
