import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiTrendingUp, FiEdit } from 'react-icons/fi'; // Icons for feed items

// Animation variants for container and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Slightly slower stagger for list items
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 }, // Animate from left
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Simple Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Activity Feed</h2>
        {/* Optional: Add filter/sort button */}
      </div>

      <motion.div
        className="space-y-4" // Vertical list layout
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Placeholder Feed Item 1: Recent Workout */}
        <motion.div
          className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-start space-x-3"
          variants={itemVariants}
        >
          <FiActivity className="text-blue-500 mt-1" size={20} />
          <div>
            <p className="font-semibold text-gray-800">Recent Workout</p>
            <p className="text-sm text-gray-600">Yesterday - Bench Press, Running (45 mins)</p>
          </div>
        </motion.div>

        {/* Placeholder Feed Item 2: Weekly Summary */}
        <motion.div
          className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-start space-x-3"
          variants={itemVariants}
        >
          <FiTrendingUp className="text-green-500 mt-1" size={20} />
          <div>
            <p className="font-semibold text-gray-800">Weekly Progress</p>
            <p className="text-sm text-gray-600">3/5 Workouts Completed this week.</p>
            {/* Optional: Add a mini progress bar or stats */}
          </div>
        </motion.div>

        {/* Placeholder Feed Item 3: Log Prompt */}
        <motion.div
          className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-start space-x-3"
          variants={itemVariants}
        >
          <FiEdit className="text-purple-500 mt-1" size={20} />
          <div>
            <p className="font-semibold text-gray-800">Log Today's Workout</p>
            <p className="text-sm text-gray-600">Use the bar below to quickly log your activity.</p>
          </div>
        </motion.div>

        {/* Add more feed items as needed */}

      </motion.div>
    </div>
  );
};

export default HomePage;