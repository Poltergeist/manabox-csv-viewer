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
  type VisibilityState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
  visibleColumns?: string[];
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
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
  visibleColumns = [],
  onColumnVisibilityChange,
}) => {
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const { getImage } = useScryfallCache();

  // Create column visibility state
  const columnVisibility = useMemo(() => {
    const visibility: VisibilityState = {};
    if (visibleColumns.length > 0) {
      columns.forEach(column => {
        visibility[column] = visibleColumns.includes(column);
      });
    }
    return visibility;
  }, [columns, visibleColumns]);

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
      columnVisibility,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
    onColumnVisibilityChange: (updater) => {
      if (onColumnVisibilityChange && typeof updater === 'function') {
        const newVisibility = updater(columnVisibility);
        Object.entries(newVisibility).forEach(([columnId, visible]) => {
          if (columns.includes(columnId)) {
            onColumnVisibilityChange(columnId, visible as boolean);
          }
        });
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: 0, pageSize });
        onPageSizeChange(newState.pageSize);
      }
    },
  });

  const renderSortIcon = (isSorted: string | false) => {
    if (isSorted === 'asc') return <ChevronUp className="w-3 h-3" />;
    if (isSorted === 'desc') return <ChevronDown className="w-3 h-3" />;
    return <ChevronsUpDown className="w-3 h-3 opacity-50" />;
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors ${
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
          <tbody className="bg-white divide-y divide-slate-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-4 text-sm text-slate-900 ${
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
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg px-4 py-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-700">
            Showing {table.getState().pagination.pageIndex * pageSize + 1} to{' '}
            {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, data.length)} of{' '}
            {data.length} results
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-sm text-slate-700">
            <span className="mr-2">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              title="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              title="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
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