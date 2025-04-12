import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiTrendingUp, FiEdit, FiClock, FiAlertTriangle, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'; // Added status icons
import { WorkoutLog, StructuredActivity } from '../App'; // Import types

// Define props for HomePage
interface HomePageProps {
  workoutLogs: WorkoutLog[];
  isApiKeyValid: boolean;
}

// Animation variants for container and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

// Helper to format relative time or date
const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return `Yesterday`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

// Helper component to render structured data (copied from HistoryPage)
const RenderStructuredData: React.FC<{ data: StructuredActivity[] }> = ({ data }) => {
  if (!data || data.length === 0) {
      return <p className="text-xs text-gray-500 mt-1">Details could not be extracted.</p>;
  }
  return (
    <ul className="mt-2 space-y-1 list-disc list-inside pl-1">
      {data.map((activity, index) => (
        <li key={index} className="text-xs text-gray-700">
          <span className="font-medium">{activity.exerciseName}</span>
          {activity.activityType === 'resistance' && (
            <>
              {activity.sets && ` ${activity.sets} sets`}
              {activity.reps && ` x ${activity.reps} reps`}
              {activity.weight && ` @ ${activity.weight}${activity.weightUnit || ''}`}
            </>
          )}
          {activity.activityType === 'cardio' && (
            <>
              {activity.duration && ` ${activity.duration} ${activity.durationUnit || 'mins'}`}
              {activity.distance && ` / ${activity.distance} ${activity.distanceUnit || 'km'}`}
            </>
          )}
          {activity.notes && <span className="block text-gray-500 italic text-[11px]">Note: {activity.notes}</span>}
        </li>
      ))}
    </ul>
  );
};

// Simple status indicator for the recent log card
const RecentLogStatus: React.FC<{ status: WorkoutLog['status'] }> = ({ status }) => {
    if (status === 'processing') {
        return <FiLoader size={12} className="text-yellow-500 animate-spin ml-1" title="Processing..." />;
    }
    if (status === 'error') {
        return <FiAlertCircle size={12} className="text-red-500 ml-1" title="Error" />;
    }
    // Optionally show completed check, or nothing for pending/completed
    // if (status === 'completed') {
    //     return <FiCheckCircle size={12} className="text-green-500 ml-1" title="Completed" />;
    // }
    return null; // Don't show anything for pending/completed by default on home page
};


const HomePage: React.FC<HomePageProps> = ({ workoutLogs, isApiKeyValid }) => {
  const recentLog = workoutLogs.length > 0 ? workoutLogs[0] : null;

  return (
    <div>
      {/* API Key Warning */}
      {!isApiKeyValid && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded-md mb-6 flex items-center space-x-2 text-sm"
          role="alert"
        >
          <FiAlertTriangle className="flex-shrink-0" />
          <p>
            <strong>Warning:</strong> Google Gemini API key (VITE_GEMINI_API_KEY) is not configured in your <code>.env</code> file. Workout log processing is disabled.
          </p>
        </motion.div>
      )}

      {/* Simple Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Activity Feed</h2>
      </div>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Feed Item 1: Recent Workout (Dynamic) */}
        <motion.div
          className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-start space-x-3"
          variants={itemVariants}
        >
          {recentLog ? (
            <>
              <FiActivity className="text-blue-500 mt-1 flex-shrink-0" size={20} />
              <div className="flex-1"> {/* Ensure div takes remaining space */}
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">Recent Workout</p>
                    <RecentLogStatus status={recentLog.status} />
                </div>

                {/* Conditional Rendering based on status */}
                {recentLog.status === 'completed' && recentLog.structuredData ? (
                    <RenderStructuredData data={recentLog.structuredData} />
                ) : recentLog.status === 'error' ? (
                    <>
                        <p className="text-sm text-gray-600 mt-0.5 whitespace-pre-wrap">{recentLog.text}</p>
                        <p className="text-xs text-red-500 mt-1">{recentLog.error}</p>
                    </>
                ) : ( // Pending or Processing
                    <p className="text-sm text-gray-600 mt-0.5 whitespace-pre-wrap">{recentLog.text}</p>
                )}

                <p className="text-xs text-gray-400 mt-2 flex items-center">
                    <FiClock size={12} className="mr-1"/> {formatRelativeTime(recentLog.date)}
                </p>
              </div>
            </>
          ) : (
             <>
              <FiActivity className="text-gray-400 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-gray-500">No Recent Activity</p>
                <p className="text-sm text-gray-400">Log your first workout below!</p>
              </div>
            </>
          )}
        </motion.div>

        {/* Placeholder Feed Item 2: Weekly Summary */}
        <motion.div
          className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-start space-x-3"
          variants={itemVariants}
        >
          <FiTrendingUp className="text-green-500 mt-1 flex-shrink-0" size={20} />
          <div>
            <p className="font-semibold text-gray-800">Weekly Progress</p>
            <p className="text-sm text-gray-600">{workoutLogs.filter(log => log.status === 'completed').length}/5 Workouts Completed this week (Example).</p>
          </div>
        </motion.div>

        {/* Placeholder Feed Item 3: Log Prompt */}
        <motion.div
          className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-start space-x-3"
          variants={itemVariants}
        >
          <FiEdit className="text-purple-500 mt-1 flex-shrink-0" size={20} />
          <div>
            <p className="font-semibold text-gray-800">Log Today's Workout</p>
            <p className="text-sm text-gray-600">Use the bar below to quickly log your activity.</p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default HomePage;