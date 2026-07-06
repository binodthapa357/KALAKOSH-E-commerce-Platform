import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchBar({ placeholder = 'Search...', onSearch, className }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>
    </form>
  );
}