import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

interface ChatInputBarProps {
  onLogSubmit: (logText: string) => void; // Callback prop
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({ onLogSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput) {
      onLogSubmit(trimmedInput); // Call the callback function
      setInputValue(''); // Clear input after sending
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent newline on Enter
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.1 }}
      className="fixed bottom-16 left-0 right-0 p-3 bg-gray-100 border-t border-gray-200 shadow-up-md z-40 flex items-center space-x-2"
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Log your workout (e.g., ran 3 miles)..."
        className="flex-grow p-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 text-sm" // Adjusted padding and font size
      />
      <motion.button
        onClick={handleSend}
        disabled={!inputValue.trim()}
        className={`flex-shrink-0 p-2.5 rounded-full transition-colors duration-200 ${ // Adjusted padding
          inputValue.trim()
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        whileHover={{ scale: inputValue.trim() ? 1.1 : 1 }}
        whileTap={{ scale: inputValue.trim() ? 0.95 : 1 }} // Slightly less intense tap
      >
        <FiSend size={18} /> {/* Slightly smaller icon */}
      </motion.button>
    </motion.div>
  );
};

export default ChatInputBar;