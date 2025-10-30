import './style.css';
import ReactPaginate from 'react-paginate';

const CustomPagination = ({ pagination, setFilters }) => {
  const { total, to, current_page, per_page } = pagination;

  // Ensure perPage is a number and not a string
  // const itemsPerPage = parseInt(per_page, 15) || 15;
  const active = current_page;

  const handlePageChange = (selectedPage) => {
    const newPage = selectedPage.selected + 1; // react-paginate is 0-based, so add 1
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Calculate the range of items being displayed
  // const startItem = (current_page - 1) * itemsPerPage + 1;
  // const endItem = Math.min(current_page * itemsPerPage, total);

  const totalPages = Math.ceil(total / per_page);

  return (
    <div className="customPagination">
      <div className="row align-items-baseline">
        <div className="col-lg-6">
          <div className="dataTables_info pl-2">
            Showing {total > 0 ? to : 0} To {to} Out Of {total} Entries
          </div>
        </div>
        <div className="col-lg-6">
          <ReactPaginate
            previousLabel={'Prev'}
            nextLabel={'Next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={totalPages || 0} // total number of pages
            marginPagesDisplayed={2} // number of pages to display at the start and end
            pageRangeDisplayed={3} // number of pages to display around the active page
            onPageChange={handlePageChange} // function to handle page changes
            containerClassName={'pagination'} // CSS class for the pagination container
            activeClassName={'active'} // CSS class for the active page
            forcePage={active - 1} // Set the current page (adjusted for 0-based index)
          />
        </div>
      </div>
    </div>
  );
};

export default CustomPagination;
