import React from 'react';
import { motion } from 'framer-motion';
import { FiArchive, FiLoader, FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi'; // Added status icons
import { WorkoutLog, StructuredActivity } from '../App'; // Import types

// Define props for HistoryPage
interface HistoryPageProps {
  workoutLogs: WorkoutLog[];
}

// Animation variants for list items
const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 110 },
  },
};

// Helper function to format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

// Helper component to render structured data
const RenderStructuredData: React.FC<{ data: StructuredActivity[] }> = ({ data }) => {
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

// Helper component for status indicator
const StatusIndicator: React.FC<{ status: WorkoutLog['status'] }> = ({ status }) => {
    switch (status) {
        case 'processing':
            return <FiLoader size={14} className="text-yellow-500 animate-spin" title="Processing..." />;
        case 'completed':
            return <FiCheckCircle size={14} className="text-green-500" title="Completed" />;
        case 'error':
            return <FiAlertCircle size={14} className="text-red-500" title="Error" />;
        case 'pending':
        default:
            return <FiClock size={14} className="text-gray-400" title="Pending" />;
    }
};


const HistoryPage: React.FC<HistoryPageProps> = ({ workoutLogs }) => {
  const hasHistory = workoutLogs.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Workout History</h2>
      </div>

      <div className={`rounded-lg ${hasHistory ? 'bg-white shadow border border-gray-100 p-4' : ''}`}>
        {hasHistory ? (
          <motion.ul
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {workoutLogs.map((log) => (
              <motion.li
                key={log.id}
                className="p-3 border border-gray-200 rounded-md bg-gray-50 relative" // Added relative for absolute positioning of status
                variants={itemVariants}
              >
                <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-sm text-blue-700">{formatDate(log.date)}</p>
                    <div className="absolute top-2 right-2"> {/* Status Indicator Position */}
                        <StatusIndicator status={log.status} />
                    </div>
                </div>

                {/* Display Structured Data or Raw Text/Error */}
                {log.status === 'completed' && log.structuredData ? (
                  <RenderStructuredData data={log.structuredData} />
                ) : log.status === 'error' ? (
                  <p className="text-xs text-red-600 mt-1">Error: {log.error || 'Failed to process.'}</p>
                ) : (
                  // Show raw text while pending/processing or if no structured data
                  <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{log.text}</p>
                )}

              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-center py-16 px-4"
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