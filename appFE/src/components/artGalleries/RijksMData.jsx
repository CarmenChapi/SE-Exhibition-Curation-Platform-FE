import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import MenuCollections from "../MenuCollections";
import TopButton from "../TopButton";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

const apikeyRM = import.meta.env.VITE_API_KEY_RIJKS;
const ITEMS_PER_PAGE = 6;
const RESULTS_PER_REQUEST = 30;

const fetchRijksMData = async ({ queryKey }) => {
  const [, { query }] = queryKey;
  const searchQuery = query ? `&q=${encodeURIComponent(query)}` : "";

  const { data } = await axios.get(
    `https://data.rijksmuseum.nl/api/en/collection?key=${apikeyRM}${searchQuery}&limit=${RESULTS_PER_REQUEST}`,
  );

  return data;
};

const RijksMData = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageFromUrl = Number(searchParams.get("page"));
  const currentPage =
    Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
  const [searchTerm, setSearchTerm] = useState(query);
  const [sortBy, setSortBy] = useState("");
  const [filterByImage, setFilterByImage] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["rijksm", { query }],
    queryFn: fetchRijksMData,
    keepPreviousData: true,
  });

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const updateUrlParams = ({ nextPage = currentPage, nextQuery = query }) => {
    const params = new URLSearchParams();

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    }

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    }

    setSearchParams(params);
  };

  const handleSearch = () => {
    updateUrlParams({ nextPage: 1, nextQuery: searchTerm });
  };

  const handlePreviousPage = () => {
    updateUrlParams({ nextPage: Math.max(currentPage - 1, 1) });
  };

  const handleNextPage = () => {
    updateUrlParams({ nextPage: Math.min(currentPage + 1, totalPages) });
  };

  const allItems = data?.artObjects || [];

  const handleSort = (a, b) => {
    if (sortBy === "title") {
      return (a.title || "").localeCompare(b.title || "");
    } else if (sortBy === "artist") {
      return (a.principalOrFirstMaker || "").localeCompare(
        b.principalOrFirstMaker || "",
      );
    }
    return 0;
  };

  let filteredData = [...allItems];

  if (filterByImage) {
    filteredData = filteredData.filter(
      (art) => art.webImage && art.webImage.url,
    );
  }

  filteredData.sort(handleSort);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  if (isLoading) return <Loading pageLoading="Loading Rijksmuseum..." />;
  if (isError) return <ErrorPage errorMsg={`Error: ${error.message}`} />;

  return (
    <>
      <nav className="topMenu">
        <MenuCollections />
      </nav>
      <h2>Rijksmuseum</h2>

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
            placeholder="Search Rijksmuseum Art..."
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
          aria-label="Search Rijksmuseum artworks"
          className="btn-search"
        >
          Search
        </button>
      </form>

      <ul className="gallery-list">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((art) => (
            <li
              key={art.id}
              className="gallery-card"
              onClick={() =>
                navigate(`/home/artgallery/rijksmuseum/${art.objectNumber}`)
              }
              title="Click to see more info+"
            >
              <h3>{art.title || "Untitled"}</h3>
              <p>{art.principalOrFirstMaker || "Unknown"}</p>
              {art.webImage?.url ? (
                <img
                  src={art.webImage.url}
                  alt={art.title || "Artwork-photo"}
                  className="gallery-photo"
                />
              ) : (
                <p>No Image Available</p>
              )}
            </li>
          ))
        ) : (
          <p>No results found</p>
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
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          aria-label="Next page"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
      <TopButton />
    </>
  );
};

export default RijksMData;
