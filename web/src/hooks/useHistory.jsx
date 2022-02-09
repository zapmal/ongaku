import { useState, useEffect } from 'react';

export function useHistory(initialHistory = []) {
  const key = 'history';
  const [storedHistory, setStoredHistory] = useState(
    () => JSON.parse(localStorage.getItem(key)) || initialHistory
  );

  const setHistory = (history) => {
    if (storedHistory.length >= 5) {
      const filteredHistory = [...storedHistory, history].slice(-5);
      console.log('top', filteredHistory);
      setStoredHistory(filteredHistory);
    } else {
      console.log('bot', history);
      setStoredHistory([...storedHistory, history]);
    }
  };

  const clearHistory = () => {
    localStorage.clear();
    setStoredHistory([]);
  };

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedHistory));
  }, [storedHistory]);

  return [storedHistory, setHistory, clearHistory];
}
