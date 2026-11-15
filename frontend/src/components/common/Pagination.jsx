export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;
  return <nav className="pagination" aria-label="Pagination"><button disabled={page <= 0} onClick={() => onPageChange(page - 1)}>Previous</button><span>Page {page + 1} of {totalPages}</span><button disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>Next</button></nav>;
}
