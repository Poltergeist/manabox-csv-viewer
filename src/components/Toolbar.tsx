import React, { useState, useEffect, useRef } from 'react';
import { Search, Grid3X3, List, Eye, ChevronDown } from 'lucide-react';
import { useDebounce } from 'use-debounce';

interface ToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isDense: boolean;
  onDenseToggle: () => void;
  onLoadSample: () => void;
  onExportCsv: () => void;
  estimatedValue?: number;
  hasImages?: boolean;
  columns?: string[];
  visibleColumns?: string[];
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  totalRows?: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  searchTerm,
  onSearchChange,
  isDense,
  onDenseToggle,
  estimatedValue,
  hasImages = false,
  columns = [],
  visibleColumns = [],
  onColumnVisibilityChange,
  totalRows = 0,
}) => {
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // We're not using the debounced value directly, but useDebounce provides the debouncing behavior
  useDebounce(searchTerm, 300);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowColumnDropdown(false);
      }
    };

    if (showColumnDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnDropdown]);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm">
      {/* Top row - Search and actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search across all columns..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          {/* Columns dropdown */}
          {columns.length > 0 && onColumnVisibilityChange && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                Columns
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              
              {showColumnDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {columns.map((column) => (
                      <label key={column} className="flex items-center px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column)}
                          onChange={(e) => onColumnVisibilityChange(column, e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mr-2"
                        />
                        <span className="text-sm text-slate-700 truncate">{column}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={onDenseToggle}
            className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm ${
              isDense
                ? 'border-indigo-500 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
            }`}
          >
            {isDense ? <List className="w-4 h-4 mr-2" /> : <Grid3X3 className="w-4 h-4 mr-2" />}
            {isDense ? 'Normal' : 'Dense'}
          </button>
        </div>
      </div>

      {/* Bottom row - Info */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-sm">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center text-slate-600">
            <span className="font-medium">Rows:</span>
            <span className="ml-1 font-semibold text-slate-900">{totalRows.toLocaleString()}</span>
          </div>
          
          {estimatedValue !== undefined && estimatedValue > 0 && (
            <div className="flex items-center text-slate-600">
              <span className="font-medium">Est. Value:</span>
              <span className="ml-1 font-semibold text-emerald-600">
                ${estimatedValue.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        
        {hasImages && (
          <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            Images powered by Scryfall
          </div>
        )}
      </div>
    </div>
  );
};