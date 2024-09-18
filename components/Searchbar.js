import { useState, useContext } from 'react';
import { SearchContext } from '@/context/SearchContext';

const Searchbar = () => {
  const [input, setInput] = useState('');
  const { setSearchQuery } = useContext(SearchContext);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchQuery(input);  // Update the global search query when Enter is pressed
    }
  };

  return (
    <div className="form-control mr-4">
      <input
        type="text"
        placeholder="Search"
        className="input input-bordered w-24 md:w-auto"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Listen for Enter key press
      />
    </div>
  );
};

export default Searchbar;
