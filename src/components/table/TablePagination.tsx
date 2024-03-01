import { Link } from 'react-router-dom';
import Input from '../inputs/Input';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentPage,
  setPage,
  setSize,
} from '../../states/features/paginationSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { AppDispatch, RootState } from '../../states/store';
import { ReactNode } from 'react';

const TablePagination = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { size, totalPages, page, currentPage } = useSelector(
    (state: RootState) => state.pagination
  );

  const renderPageNumbers = () => {
    const displayPages = [];
    const maxVisiblePages = 3;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - Math.floor(maxVisiblePages / 2) &&
          i <= page + Math.floor(maxVisiblePages / 2))
      ) {
        displayPages.push(i);
      }
    }

    const pages: Array<unknown> = [];
    let lastPage: null | number = null;

    displayPages.forEach((page: number) => {
      if (lastPage !== null && page - lastPage !== 1) {
        pages.push('...');
      }
      pages.push(page);
      lastPage = page;
    });

    return pages.map((page: ReactNode | unknown, index: number) => {
      return page === '...' ? (
        <span key={`ellipsis${index}`} className="mx-2">
          ...
        </span>
      ) : (
        <Link
          to={'#'}
          key={index}
          className={`border-none shadwow-md p-[2.5px] px-[9px] text-[13px] shadow-sm rounded-md ${
            page === page && 'bg-background'
          }`}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setPage(Number(page) - 1));
            dispatch(setCurrentPage(page));
          }}
        >
          {String(page)}
        </Link>
      );
    });
  };

  return (
    <nav className="flex items-center gap-2 justify-between">
      <article className="flex items-center gap-2 w-full max-w-[20%]">
        <p className="flex items-center gap-1 !text-[14px]">
          Page {currentPage} of {totalPages}
        </p>
      </article>
      <label className="flex items-center gap-1">
        <p className="w-fit text-[14px] min-w-[45px]">Go to:</p>
        <Input
          placeholder="..."
          type="number"
          className="!w-fit !max-w-[60px] !py-1 !px-1 !text-[13px]"
          onChange={(e) => {
            setTimeout(() => {
              if (Number(e.target.value) > Number(totalPages)) return;
              if (Number(e.target.value) < 1) return;
              dispatch(setPage(Number(e.target.value) - 1));
              dispatch(setCurrentPage(Number(e.target.value)));
            }, 1000);
          }}
        />
      </label>
      <menu className="flex items-center gap-3">
        <FontAwesomeIcon
          className="p-[8px] px-[8px] text-[10px] rounded-md shadow-sm bg-background cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setPage(0));
            dispatch(setCurrentPage(1));
          }}
          icon={faAngleDoubleLeft}
        />
        <FontAwesomeIcon
          className="p-[6px] px-[8px] text-[12px] rounded-md shadow-sm bg-background cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            if (Number(currentPage) > 1) {
              dispatch(setPage(page - 1));
              dispatch(setCurrentPage(currentPage - 1));
            }
          }}
          icon={faChevronLeft}
        />
        <span className="flex items-center gap-2">{renderPageNumbers()}</span>
        <FontAwesomeIcon
          className="p-[6px] px-[8px] text-[12px] rounded-md shadow-sm bg-background cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            if (Number(page) < Number(totalPages - 1)) {
              dispatch(setPage(Number(page) + 1));
              dispatch(setCurrentPage(Number(currentPage) + 1));
            }
          }}
          icon={faChevronRight}
        />
        <FontAwesomeIcon
          className="p-[8px] px-[8px] text-[10px] rounded-md shadow-sm bg-background cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            if (Number(page) < Number(totalPages)) {
              dispatch(setPage(totalPages - 1));
              dispatch(setCurrentPage(totalPages - 1));
            }
          }}
          icon={faAngleDoubleRight}
        />
        <select
          value={size}
          onChange={(e) => {
            dispatch(setSize(Number(e.target.value)));
          }}
        >
          {[5, 10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </menu>
    </nav>
  );
};

export default TablePagination;
