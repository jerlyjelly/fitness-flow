import React from 'react';
import { motion } from 'framer-motion';
import { FiInfo } from 'react-icons/fi'; // Icon for info message

const LogWorkoutPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center h-full pt-10" // Center content
    >
      <FiInfo className="text-blue-500 mb-4" size={48} />
      <h2 className="text-xl font-semibold mb-2 text-gray-700">Log Your Workout</h2>
      <p className="text-gray-500 max-w-xs">
        Use the input bar at the bottom of the screen to quickly log your activities using natural language.
      </p>
      {/*
        Optional: Add alternative logging methods here later
        e.g., buttons for common activities, or a link to a more structured form.
      */}

      {/* Placeholder for showing processing/confirmation status */}
      <div className="mt-8 text-sm text-gray-600 hidden">
        {/* Status messages like "Processing..." or "Workout Logged!" could appear here */}
      </div>
    </motion.div>
  );
};

export default LogWorkoutPage;