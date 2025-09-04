import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { type Card } from '@/types';
import { CardImage } from './CardImage';
import { ImageLightbox } from './ImageLightbox';
import { useScryfallCache } from '@/hooks/useScryfallCache';

interface DataTableProps {
  data: Card[];
  columns: string[];
  scryfallColumn?: string | null;
  globalFilter: string;
  isDense: boolean;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

const columnHelper = createColumnHelper<Card>();

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  scryfallColumn,
  globalFilter,
  isDense,
  pageSize,
  onPageSizeChange,
}) => {
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const { getImage } = useScryfallCache();

  const tableColumns = useMemo(() => {
    const cols: ColumnDef<Card, unknown>[] = [];

    // Add Scryfall image column if available
    if (scryfallColumn) {
      cols.push(
        columnHelper.display({
          id: 'cardImage',
          header: 'Image',
          cell: ({ row }) => {
            const scryfallId = row.original[scryfallColumn];
            const cardName = row.original.Name || row.original.name || 'Card';
            
            if (!scryfallId || typeof scryfallId !== 'string') return null;

            const handleImageClick = async () => {
              const imageUrl = await getImage(scryfallId);
              if (imageUrl) {
                const name = typeof cardName === 'string' ? cardName : 'Card';
                setLightboxImage({ url: imageUrl, name });
              }
            };

            return (
              <CardImage
                scryfallId={scryfallId}
                cardName={typeof cardName === 'string' ? cardName : 'Card'}
                onClick={handleImageClick}
                size={isDense ? 'small' : 'medium'}
              />
            );
          },
          size: isDense ? 60 : 80,
        })
      );
    }

    // Add data columns
    columns.forEach((column) => {
      cols.push(
        columnHelper.accessor(column as string, {
          header: column,
          cell: (info) => {
            const value = info.getValue();
            if (value === null || value === undefined) return '';
            return String(value);
          },
        }) as ColumnDef<Card, unknown>
      );
    });

    return cols;
  }, [columns, scryfallColumn, isDense, getImage]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    state: {
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: 0, pageSize });
        onPageSizeChange(newState.pageSize);
      }
    },
  });

  const renderSortIcon = (isSorted: string | false) => {
    if (isSorted === 'asc') return <ChevronUp className="w-4 h-4" />;
    if (isSorted === 'desc') return <ChevronDown className="w-4 h-4" />;
    return <ChevronsUpDown className="w-4 h-4 opacity-50" />;
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${
                      isDense ? 'py-2' : 'py-3'
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.getSize() }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      {header.column.getCanSort() && renderSortIcon(header.column.getIsSorted())}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-3 text-sm text-gray-900 ${
                      isDense ? 'py-2' : 'py-4'
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Showing {table.getState().pagination.pageIndex * pageSize + 1} to{' '}
            {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, data.length)} of{' '}
            {data.length} results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700">
            Rows per page:
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          
          <div className="flex space-x-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          isOpen={!!lightboxImage}
          imageUrl={lightboxImage.url}
          cardName={lightboxImage.name}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
};