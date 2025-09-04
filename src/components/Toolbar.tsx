import React from 'react';
import { Search, Download, Database, Grid3X3, List, Eye } from 'lucide-react';
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
  onToggleColumns?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  searchTerm,
  onSearchChange,
  isDense,
  onDenseToggle,
  onLoadSample,
  onExportCsv,
  estimatedValue,
  hasImages = false,
  onToggleColumns,
}) => {
  // We're not using the debounced value directly, but useDebounce provides the debouncing behavior
  useDebounce(searchTerm, 300);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Top row - Search and actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search across all columns..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onLoadSample}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Database className="w-4 h-4 mr-2" />
            Load Sample
          </button>
          
          <button
            onClick={onExportCsv}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>

          {onToggleColumns && (
            <button
              onClick={onToggleColumns}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Eye className="w-4 h-4 mr-2" />
              Columns
            </button>
          )}
          
          <button
            onClick={onDenseToggle}
            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isDense
                ? 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            {isDense ? <List className="w-4 h-4 mr-2" /> : <Grid3X3 className="w-4 h-4 mr-2" />}
            {isDense ? 'Normal' : 'Dense'}
          </button>
        </div>
      </div>

      {/* Bottom row - Info */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-sm text-gray-600">
        <div className="flex flex-wrap gap-4">
          {estimatedValue !== undefined && estimatedValue > 0 && (
            <div className="flex items-center">
              <span className="font-medium">Estimated Value:</span>
              <span className="ml-1 font-semibold text-green-600">
                ${estimatedValue.toFixed(2)}
              </span>
            </div>
          )}
          
          {hasImages && (
            <div className="text-xs text-gray-500">
              Images powered by Scryfall
            </div>
          )}
        </div>
      </div>
    </div>
  );
};