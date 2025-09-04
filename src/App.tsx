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

  const estimatedValue = calculateEstimatedValue(cards);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MTG Collection Viewer</h1>
          <p className="mt-2 text-gray-600">
            Upload your Magic: The Gathering collection CSV to view, search, and analyze your cards.
          </p>
        </div>

        {cards.length === 0 ? (
          /* Upload state */
          <div className="max-w-2xl mx-auto">
            <CsvUpload onCsvUpload={handleCsvUpload} />
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadSample}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Load Sample Data
              </button>
            </div>
          </div>
        ) : (
          /* Data view state */
          <div className="space-y-6">
            <Toolbar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isDense={isDense}
              onDenseToggle={() => setIsDense(!isDense)}
              onLoadSample={handleLoadSample}
              onExportCsv={handleExportCsv}
              estimatedValue={estimatedValue}
              hasImages={!!scryfallColumn}
            />
            
            <DataTable
              data={cards}
              columns={columns}
              scryfallColumn={scryfallColumn}
              globalFilter={searchTerm}
              isDense={isDense}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
