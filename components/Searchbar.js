import { SearchContext } from '@/context/SearchContext';
import { useContext, useRef, useState } from 'react';

const Searchbar = () => {
  const [input, setInput] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State for dropdown visibility
  const { setSearchQuery } = useContext(SearchContext);
  const inputRef = useRef(null); // Create a ref for the input field

  const handleInputChange = (e) => {
    // When users clean up the search, show every tasks
    if (e.target.value === "") {
      setInput('');
      setSearchQuery('');
      setIsDropdownVisible(false); // Hide dropdown after searching
      return;
    }
    setInput(e.target.value);
    setIsDropdownVisible(true); // Show dropdown when input changes
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchQuery(input);  // Update the global search query when Enter is pressed
      setIsDropdownVisible(false); // Hide dropdown after searching
      inputRef.current.blur(); // Remove focus from input field
    }
  };

  // Array of search hints
  const searchHints = [
    { code: '"words here"', description: 'exact phrase' },
    { code: 'words here', description: 'partial phrase' },
    { code: '[tag]', description: 'specific tag' },
    { code: '-[tag]', description: 'exclude a tag' },
    { code: '[tag1][tag2]', description: 'either tags' },
    { code: '[tag1]-[tag2]', description: 'include a tag and exclude another' },
  ];

  return (
    <div className="form-control mr-4 relative">
      <div className="dropdown dropdown-end">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Listen for Enter key press
          onFocus={() => setIsDropdownVisible(true)} // Show dropdown when focused
          ref={inputRef} // Attach the ref to the input field
        />
        {isDropdownVisible && (
          <div
            tabIndex={0}
            role="button"
            className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow w-96"
          >
            <strong className="text-lg">Search Tips:</strong>
            <span className="text-md pb-2">We look for both keywords/tags together by default, show those that match everything first!</span>
            <div className="grid grid-cols-2 gap-x-10 gap-y-2 mt-2">
              {searchHints.map((hint, index) => (
                <div key={index}>
                  <code className="text-xs">{hint.code}</code> <span className='text-xs text-gray-500'>{hint.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
