import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import ChatInputBar from './ChatInputBar';

// Define props for Layout, including the callback
interface LayoutProps {
  onLogSubmit: (logText: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ onLogSubmit }) => { // Destructure the prop
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Main Content Area */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        // Adjust pb value as needed based on exact heights of fixed bars
        className="flex-1 overflow-y-auto pb-36 pt-4 px-4"
      >
        <Outlet /> {/* Page content renders here */}
      </motion.main>

      {/* Fixed Chat Input Bar - Pass the handler down */}
      <ChatInputBar onLogSubmit={onLogSubmit} />

      {/* Fixed Bottom Navigation */}
      <BottomNav />

    </div>
  );
};

export default Layout;