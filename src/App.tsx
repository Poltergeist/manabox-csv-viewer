import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { type Card } from '@/types';
import { CsvUpload } from '@/components/CsvUpload';
import { DataTable } from '@/components/DataTable';
import { Toolbar } from '@/components/Toolbar';
import { saveCsvData, loadCsvData, detectScryfallColumn, calculateEstimatedValue } from '@/utils/storage';
import { SAMPLE_CSV_DATA } from '@/data/sampleCsv';

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDense, setIsDense] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [scryfallColumn, setScryfallColumn] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<string>('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  const handleCsvData = useCallback((csvText: string) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.data && results.meta.fields) {
          const parsedCards = results.data as Card[];
          const parsedColumns = results.meta.fields;
          
          setCards(parsedCards);
          setColumns(parsedColumns);
          setVisibleColumns(parsedColumns); // Show all columns by default
          setCsvData(csvText);
          
          // Detect Scryfall column
          const scryfallCol = detectScryfallColumn(parsedColumns);
          setScryfallColumn(scryfallCol);
          
          // Save to localStorage
          saveCsvData(csvText);
        }
      },
      error: (error: unknown) => {
        console.error('CSV parsing error:', error);
        alert('Error parsing CSV data.');
      },
    });
  }, []);

  // Load saved CSV data on mount
  useEffect(() => {
    const savedData = loadCsvData();
    if (savedData) {
      handleCsvData(savedData);
    }
  }, [handleCsvData]);

  const handleCsvUpload = useCallback((uploadedCards: Card[], uploadedColumns: string[], csvText: string) => {
    setCards(uploadedCards);
    setColumns(uploadedColumns);
    setVisibleColumns(uploadedColumns); // Show all columns by default
    setCsvData(csvText);
    
    // Detect Scryfall column
    const scryfallCol = detectScryfallColumn(uploadedColumns);
    setScryfallColumn(scryfallCol);
    
    // Save to localStorage
    saveCsvData(csvText);
  }, []);

  const handleLoadSample = useCallback(() => {
    handleCsvData(SAMPLE_CSV_DATA);
  }, [handleCsvData]);

  const handleExportCsv = useCallback(() => {
    if (!csvData) {
      alert('No data to export');
      return;
    }

    // Create and trigger download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'collection.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [csvData]);

  const handleColumnVisibilityChange = useCallback((columnId: string, visible: boolean) => {
    setVisibleColumns(prev => {
      if (visible) {
        return prev.includes(columnId) ? prev : [...prev, columnId];
      } else {
        return prev.filter(id => id !== columnId);
      }
    });
  }, []);

  const estimatedValue = calculateEstimatedValue(cards);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-slate-800">
      {/* Sticky translucent header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                MTG
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Collection Viewer</h1>
                <p className="text-sm text-slate-600">
                  View, search, and analyze your Magic: The Gathering collection
                </p>
              </div>
            </div>
            {cards.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={handleLoadSample}
                  className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
                >
                  Load Sample
                </button>
                
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
                >
                  Export CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

        {cards.length === 0 ? (
          /* Upload state */
          <div className="max-w-2xl mx-auto mt-8">
            <CsvUpload onCsvUpload={handleCsvUpload} />
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadSample}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
              >
                Load Sample Data
              </button>
            </div>
          </div>
        ) : (
          /* Data view state */
          <div className="space-y-6 mt-8">
            <Toolbar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isDense={isDense}
              onDenseToggle={() => setIsDense(!isDense)}
              onLoadSample={handleLoadSample}
              onExportCsv={handleExportCsv}
              estimatedValue={estimatedValue}
              hasImages={!!scryfallColumn}
              columns={columns}
              visibleColumns={visibleColumns}
              onColumnVisibilityChange={handleColumnVisibilityChange}
              totalRows={cards.length}
            />
            
            <DataTable
              data={cards}
              columns={columns}
              scryfallColumn={scryfallColumn}
              globalFilter={searchTerm}
              isDense={isDense}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              visibleColumns={visibleColumns}
              onColumnVisibilityChange={handleColumnVisibilityChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
