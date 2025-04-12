import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

const ChatInputBar: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log('Sending workout log:', inputValue);
      // Add logic here to process the input (e.g., send to LLM, update state)
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
      transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.1 }} // Slight delay
      className="fixed bottom-16 left-0 right-0 p-3 bg-gray-100 border-t border-gray-200 shadow-up-md z-40 flex items-center space-x-2" // Above BottomNav
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Log your workout (e.g., ran 3 miles)..."
        className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
      />
      <motion.button
        onClick={handleSend}
        disabled={!inputValue.trim()}
        className={`p-2 rounded-full transition-colors duration-200 ${
          inputValue.trim()
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        whileHover={{ scale: inputValue.trim() ? 1.1 : 1 }}
        whileTap={{ scale: inputValue.trim() ? 0.9 : 1 }}
      >
        <FiSend size={20} />
      </motion.button>
    </motion.div>
  );
};

export default ChatInputBar;