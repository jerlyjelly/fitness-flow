import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import ChatInputBar from './ChatInputBar';

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col"> {/* Changed background */}

      {/* Main Content Area */}
      <motion.main
        key={location.pathname} // Animate route changes
        initial={{ opacity: 0 }} // Simpler fade-in
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }} // Faster transition
        // Added padding-bottom to account for both fixed bars (h-16 + p-3 + h-input approx)
        // Adjust pb value as needed based on exact heights
        className="flex-1 overflow-y-auto pb-36 pt-4 px-4"
      >
        <Outlet /> {/* Page content renders here */}
      </motion.main>

      {/* Fixed Chat Input Bar */}
      <ChatInputBar />

      {/* Fixed Bottom Navigation */}
      <BottomNav />

    </div>
  );
};

export default Layout;