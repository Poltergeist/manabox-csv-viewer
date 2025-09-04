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
      className={`border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 ${className}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
    >
      <div className="flex flex-col items-center space-y-6">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
          <Upload className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <p className="text-xl font-semibold text-slate-900">
            Drop your CSV file here
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Drag and drop your MTG collection CSV file, or click below to browse
          </p>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileInput}
            className="hidden"
          />
          <span className="inline-flex items-center px-6 py-3 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            <FileText className="w-4 h-4 mr-2" />
            Choose File
          </span>
        </label>
      </div>
    </div>
  );
};