import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import Papa from 'papaparse';
import { type Card } from '@/types';

interface CsvUploadProps {
  onCsvUpload: (data: Card[], headers: string[], csvText: string) => void;
  className?: string;
}

export const CsvUpload: React.FC<CsvUploadProps> = ({ onCsvUpload, className = '' }) => {
  const handleFileUpload = useCallback((file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.data && results.meta.fields) {
          // Convert to our card format and extract original CSV text
          const cards = results.data as Card[];
          const headers = results.meta.fields;
          
          // Read file as text to store original CSV
          const reader = new FileReader();
          reader.onload = (e) => {
            const csvText = e.target?.result as string;
            onCsvUpload(cards, headers, csvText);
          };
          reader.readAsText(file);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        alert('Error parsing CSV file. Please check the format.');
      },
    });
  }, [onCsvUpload]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    if (csvFile) {
      handleFileUpload(csvFile);
    }
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  return (
    <div 
      className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors ${className}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2 text-gray-500">
          <Upload className="w-8 h-8" />
          <FileText className="w-8 h-8" />
        </div>
        <div>
          <p className="text-lg font-medium text-gray-700">
            Drop your CSV file here
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to browse
          </p>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileInput}
            className="hidden"
          />
          <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Browse Files
          </span>
        </label>
      </div>
    </div>
  );
};