import { Button } from './Button';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { cn } from '@/app/lib/utils';  // ✅ Add this import

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * (itemsPerPage || 0) + 1;
  const endItem = Math.min(currentPage * (itemsPerPage || 0), totalItems || 0);

  return (
    <div className={cn('flex items-center justify-between px-4 py-3 border-t border-border', className)}>
      <div className="flex items-center gap-2 text-sm text-text-mid">
        {totalItems && itemsPerPage && (
          <span>
            Showing {startItem} to {endItem} of {totalItems} results
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft className="h-3 w-3" />
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
              className="min-w-[36px]"
            >
              {page}
            </Button>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}