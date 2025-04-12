import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiPlusSquare, FiBarChart2 } from 'react-icons/fi'; // Example icons

// Define navigation items with icons
const navItems = [
  { path: '/', label: 'Home', icon: FiHome },
  { path: '/log', label: 'Log', icon: FiPlusSquare },
  { path: '/history', label: 'History', icon: FiBarChart2 },
];

const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-up flex justify-around items-center z-50" // Fixed bottom, shadow
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Icon size={24} className={`mb-0.5 ${isActive ? 'fill-current' : ''}`} />
            <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </motion.nav>
  );
};

export default BottomNav;