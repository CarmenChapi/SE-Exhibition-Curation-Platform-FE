import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import MenuCollections from "../MenuCollections";
import TopButton from "../TopButton";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

const ITEMS_PER_PAGE = 6;

const fetchVAMData = async ({ queryKey }) => {
  const [, { query }] = queryKey;

  const searchQuery = query ? encodeURIComponent(query) : "painting";

  const { data } = await axios.get(
    `https://api.vam.ac.uk/v2/objects/search?q=${searchQuery}&images_exist=true&limit=30`,
  );

  return data;
};

const VAMData = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "painting";
  const pageFromUrl = Number(searchParams.get("page"));
  const currentPage =
    Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
  const [searchTerm, setSearchTerm] = useState(
    query === "painting" ? "" : query,
  );
  const [sortBy, setSortBy] = useState("");
  const [filterByImage, setFilterByImage] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["vam", { query }],
    queryFn: fetchVAMData,
    keepPreviousData: true,
  });

  useEffect(() => {
    setSearchTerm(query === "painting" ? "" : query);
  }, [query]);

  const updateUrlParams = ({ nextPage = currentPage, nextQuery = query }) => {
    const params = new URLSearchParams();

    if (nextQuery.trim() && nextQuery.trim() !== "painting") {
      params.set("q", nextQuery.trim());
    }

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    }

    setSearchParams(params);
  };

  const allItems = data?.records || [];
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const paginatedItems = allItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearch = () => {
    updateUrlParams({ nextPage: 1, nextQuery: searchTerm || "painting" });
  };

  const handlePreviousPage = () => {
    updateUrlParams({ nextPage: Math.max(currentPage - 1, 1) });
  };

  const handleNextPage = () => {
    updateUrlParams({ nextPage: Math.min(currentPage + 1, totalPages) });
  };

  const handleSort = (a, b) => {
    if (sortBy === "title") {
      return a._primaryTitle.localeCompare(b._primaryTitle);
    } else if (sortBy === "artist") {
      return a._primaryMaker.name.localeCompare(b._primaryMaker.name);
    }
    return 0;
  };

  let filteredData = paginatedItems || [];

  if (filterByImage) {
    filteredData = filteredData.filter((art) => art._primaryImageId);
  }

  filteredData = [...filteredData].sort(handleSort);
  if (isLoading)
    return <Loading pageLoading="Loading Victoria & Albert Museum..." />;
  if (isError) return <ErrorPage errorMsg={`Error: ${error.message}`} />;

  return (
    <>
      <nav className="topMenu">
        <MenuCollections />
      </nav>

      <h2>Victoria & Albert Museum</h2>

      <form
        className="searchMenu"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch();
        }}
      >
        <label className="label">
          Search artworks
          <input
            type="text"
            placeholder="Search V&A Art..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="collection-input"
          />
        </label>
        <label>
          Sort by
          <select
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-dropdown"
          >
            <option value="">Sort By</option>
            <option value="title">Title (A-Z)</option>
            <option value="artist">Artist (A-Z)</option>
          </select>
        </label>
        <label>
          <input
            className="box-input"
            type="checkbox"
            checked={filterByImage}
            onChange={() => setFilterByImage(!filterByImage)}
          />
          Only show artworks with images
        </label>
        <button
          type="submit"
          aria-label="Search Victoria and Albert Museum artworks"
          className="btn-search"
        >
          Search
        </button>
      </form>

      <ul className="gallery-list">
        {filteredData.length > 0 ? (
          filteredData.map((art) => (
            <li
              className="gallery-card"
              key={art.systemNumber}
              onClick={() =>
                navigate(`/home/artgallery/vam/${art.systemNumber}`)
              }
              title={`Click to see more info+`}
            >
              {art._primaryTitle ? (
                <h3>{art._primaryTitle}</h3>
              ) : (
                <h3>Untitled</h3>
              )}

              {art._primaryMaker.name ? (
                <p>{art._primaryMaker.name}</p>
              ) : (
                <h3>Unknown</h3>
              )}
              {art._primaryImageId ? (
                <img
                  src={`https://framemark.vam.ac.uk/collections/${art._primaryImageId}/full/843,/0/default.jpg`}
                  alt={art._primaryTitle ? art._primaryTitle : "Artwork-photo"}
                  className="gallery-photo"
                  onClick={() =>
                    navigate(`/home/artgallery/vam/${art.systemNumber}`)
                  }
                />
              ) : (
                <p>No Image Available</p>
              )}
            </li>
          ))
        ) : (
          <p>
            <strong>No results found. Try again</strong>
          </p>
        )}
      </ul>

      <div className="pagination-controls">
        <button
          aria-label="Previous page"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="pagination-status">
          Page {currentPage} of {totalPages}
        </span>
        <button
          aria-label="Next page"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
      <TopButton />
    </>
  );
};

export default VAMData;
