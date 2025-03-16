
import { Button } from '@/components/ui/button';
import { Fonts } from '@/utils/Font.jsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-end mt-4 space-x-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2"
        style={{ ...Fonts.Inter }}
      >
        Previous
      </Button>
      <div className="flex items-center space-x-2">
        <span style={{ ...Fonts.Inter }}>Page</span>
        <span className="font-semibold" style={{ ...Fonts.Inter }}>{currentPage}</span>
        <span style={{ ...Fonts.Inter }}>of {totalPages}</span>
      </div>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2"
        style={{ ...Fonts.Inter }}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
