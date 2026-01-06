'use client'
import { ReactNode, useState } from 'react'
import { Funnel } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { PaginationEllipsis } from '@/components/ui/pagination'
import Spinner from '../website/loaders/Spinner'

// Types for the dynamic table
export interface TableColumn<T> {
  key: string
  header: string
  accessor: (row: T) => ReactNode
  render?: (value: ReactNode, row: T) => ReactNode
  className?: string
}

export interface TableFilter {
  key: string
  type: 'search' | 'select'
  placeholder?: string
  options?: { label: string; value: string }[]
  onChange?: (value: string) => void
  className?: string
}

export interface TableAction<T> {
  label: string
  icon?: ReactNode
  onClick: (row: T) => void
  className?: string
}

interface PaginationData {
  totalPages: number
  currentPage: number
  totalItems?: number
}

interface DynamicTableProps<T> {
  data: T[] | { data: T[]; pagination?: PaginationData }
  columns: TableColumn<T>[]
  filters?: TableFilter[]
  actions?: TableAction<T>[]
  renderActions?: (row: T) => ReactNode
  showFilters?: boolean
  showPagination?: boolean
  itemsPerPage?: number
  onRowClick?: (row: T) => void
  emptyMessage?: string
  isLoading?: boolean
  // Add these for server-side handling
  onFilterChange?: (filters: Record<string, string>) => void
  onPageChange?: (page: number) => void
  useServerSide?: boolean // Toggle between client/server side
}

function DynamicTable<T extends { id?: string | number }>({
  data,
  columns,
  filters = [],
  actions = [],
  renderActions,
  showFilters = true,
  showPagination = true,
  itemsPerPage = 10,
  onRowClick,
  emptyMessage = 'No data available',
  isLoading = false,
  onFilterChange,
  onPageChange: onPageChangeCallback,
  useServerSide = false,
}: DynamicTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  const dataArray = Array.isArray(data) ? data : data?.data || []
  const serverPagination = !Array.isArray(data) ? data?.pagination : null

  // Client-side filtering (only if not using server-side)
  const filteredData = useServerSide
    ? dataArray
    : dataArray.filter((row) => {
        return Object.entries(filterValues).every(([key, value]) => {
          if (!value) return true

          const filter = filters.find((f) => f.key === key)
          if (!filter) return true

          if (filter.type === 'search') {
            const searchValue = value.toLowerCase()
            return columns.some((col) => {
              const cellValue = col.accessor(row)
              return String(cellValue).toLowerCase().includes(searchValue)
            })
          }

          if (filter.type === 'select') {
            const cellValue = columns.find((col) => col.key === key)?.accessor(row)
            return String(cellValue).toLowerCase() === value.toLowerCase()
          }

          return true
        })
      })

  // Pagination
  const totalPages = useServerSide
    ? serverPagination?.totalPages || 1
    : Math.ceil(filteredData.length / itemsPerPage)

  const paginatedData = useServerSide
    ? filteredData // Already paginated by server
    : filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filterValues, [key]: value }
    setFilterValues(newFilters)
    setCurrentPage(1)

    // Call server-side filter if enabled
    if (useServerSide && onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)

      // Call server-side page change if enabled
      if (useServerSide && onPageChangeCallback) {
        onPageChangeCallback(page)
      }
    }
  }

  const renderPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }

    return pages
  }

  return (
    <div className="mt-6 w-full">
      {/* Filters */}
      {showFilters && filters.length > 0 && (
        <div className="table-filters flex flex-col md:flex-row gap-2 items-center justify-start">
          {filters.map((filter) => (
            <div key={filter.key}>
              {filter.type === 'search' && (
                <input
                  key={filter.key}
                  type="text"
                  className={`table-filter-inputs w-full max-w-[596px] h-[40px] ${
                    filter.className || ''
                  }`}
                  placeholder={filter.placeholder || 'Search...'}
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => {
                    handleFilterChange(filter.key, e.target.value)
                    filter.onChange?.(e.target.value)
                  }}
                />
              )}
              {filter.type === 'select' && (
                <select
                  key={filter.key}
                  className={`table-filter-inputs w-full max-w-[152px] h-[40px] ${
                    filter.className || ''
                  }`}
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => {
                    handleFilterChange(filter.key, e.target.value)
                    filter.onChange?.(e.target.value)
                  }}
                >
                  <option value="">{filter.placeholder || 'All'}</option>
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
          <div className="filter-btn flex items-center justify-center cursor-pointer">
            <Funnel />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-data mt-5 border border-[#F0F0F0] bg-white rounded-[10px]">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={`table-data-head ${column.className || ''}`}>
                  {column.header}
                </TableHead>
              ))}
              {(actions.length > 0 || renderActions) && (
                <TableHead className="table-data-head">ACTIONS</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 || renderActions ? 1 : 0)}
                  className="text-center p-8"
                >
                  <Spinner loading={isLoading} />
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 || renderActions ? 1 : 0)}
                  className="text-center p-8"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  className={`table-data-body ${
                    onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => {
                    const value = column.accessor(row)
                    return (
                      <TableCell key={column.key} className={`p-[10px] ${column.className || ''}`}>
                        {column.render ? column.render(value, row) : value}
                      </TableCell>
                    )
                  })}
                  {(actions.length > 0 || renderActions) && (
                    <TableCell className="p-[10px]" onClick={(e) => e.stopPropagation()}>
                      {renderActions ? (
                        renderActions(row)
                      ) : (
                        <div className="flex gap-2">
                          {actions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => action.onClick(row)}
                              className={`text-sm ${action.className || ''}`}
                            >
                              {action.icon}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="w-full mt-4 flex items-center justify-end gap-2 text-[#262626]">
          <button
            className="pagination-btns px-4 py-2 mr-2 flex gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaAngleLeft /> Previous
          </button>
          {renderPageNumbers().map((page, idx) => (
            <div key={idx}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <button
                  className={`pagination-btns h-[36px] w-[36px] ${
                    currentPage === page ? 'bg-[#069768] text-white' : ''
                  }`}
                  onClick={() => handlePageChange(page as number)}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
          <button
            className="pagination-btns px-4 py-2 ml-2 flex gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <FaAngleRight />
          </button>
        </div>
      )}
    </div>
  )
}

export default DynamicTable
