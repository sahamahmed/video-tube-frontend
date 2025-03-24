import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

const Paginations = ({
  currentPage,
  hasMore,
  fetchNextPage,
  fetchPreviousPage,
  fetchCustomPage,
}) => {
  const handleNextPage = () => {
    if (hasMore) {
      console.log("next page");

      fetchNextPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      console.log("back page");
      fetchPreviousPage(currentPage - 1);
    }
  };

  return (
    <div className="mb-8">
      <Pagination className=" flex justify-center items-center">
        <PaginationContent>
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious
              onClick={handlePreviousPage}
              className={`${currentPage !== 1 ? "" : "hidden"}`}
            />
          </PaginationItem>

          {Array.from({
            length: currentPage <= 5 ? currentPage : 5,
          }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => fetchCustomPage(index + 1)}
                className={currentPage === index + 1 ? "bg-green-400 text-gray-900 font-bold" : ""}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {hasMore && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem className="cursor-pointer">
            <PaginationNext
              onClick={handleNextPage}
              className={`${hasMore ? "" : "hidden"}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Paginations;
