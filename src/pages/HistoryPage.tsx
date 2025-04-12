import React from 'react';
import { motion } from 'framer-motion';
import { FiArchive } from 'react-icons/fi'; // Icon for empty state

// Animation variants for list items
const itemVariants = {
  hidden: { opacity: 0, x: -15 }, // Animate from left
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 110 },
  },
};

const HistoryPage: React.FC = () => {
  // Placeholder: In a real app, you'd fetch history data here
  const hasHistory = false; // Set to true to see example entry styling

  return (
    <motion.div
      initial={{ opacity: 0 }} // Simple fade-in
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Consistent Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Workout History</h2>
        {/* Optional: Add filter/sort button */}
      </div>

      {/* History List or Empty State */}
      <div className={`rounded-lg ${hasHistory ? 'bg-white shadow border border-gray-100 p-4' : ''}`}>
        {hasHistory ? (
          <motion.ul
            className="space-y-3" // Slightly reduced spacing
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {/* Example History Item (Render dynamically later) */}
            <motion.li
              className="p-3 border border-gray-200 rounded-md bg-gray-50" // Subtle background for items
              variants={itemVariants}
            >
              <p className="font-semibold text-sm text-blue-700">Workout - April 11, 2025</p>
              <p className="text-xs text-gray-600 mt-1">Bench Press: 3x10 @ 135 lbs</p>
              <p className="text-xs text-gray-600">Running: 30 minutes</p>
            </motion.li>
             <motion.li
              className="p-3 border border-gray-200 rounded-md bg-gray-50"
              variants={itemVariants}
            >
              <p className="font-semibold text-sm text-blue-700">Workout - April 10, 2025</p>
              <p className="text-xs text-gray-600 mt-1">Squats: 4x8 @ 185 lbs</p>
              <p className="text-xs text-gray-600">Pull-ups: 3x Max reps</p>
            </motion.li>
            {/* Add more items */}
          </motion.ul>
        ) : (
          // Enhanced Empty State - Centered vertically within the viewport if possible, or just padded
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-center py-16 px-4" // More padding for empty state
          >
            <FiArchive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-500">History is Empty</p>
            <p className="text-sm text-gray-400 mt-1">Log your first workout using the bar below!</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HistoryPage;