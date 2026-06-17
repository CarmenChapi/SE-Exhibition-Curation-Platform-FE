import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import MenuCollections from "../MenuCollections";
import TopButton from "../TopButton";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

const apikeyHarvard = import.meta.env.VITE_API_KEY_HARVARD;
const ITEMS_PER_PAGE = 6;
const RESULTS_PER_REQUEST = 30;

const getHarvardTitle = (art) => art.title || "Untitled";

const getHarvardArtist = (art) => art.people?.[0]?.displayname || "Unknown";

const fetchHarvardData = async ({ queryKey }) => {
  const [, { query }] = queryKey;
  const { data } = await axios.get("https://api.harvardartmuseums.org/object", {
    params: {
      apikey: apikeyHarvard,
      hasimage: 1,
      size: RESULTS_PER_REQUEST,
      sort: "random",
      fields: "id,title,primaryimageurl,people,dated",
      ...(query && { q: query }),
    },
  });
  return data;
};

const HarvardData = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageFromUrl = Number(searchParams.get("page"));
  const page =
    Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
  const [searchTerm, setSearchTerm] = useState(query);
  const [sortBy, setSortBy] = useState("");
  const [filterByImage, setFilterByImage] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["harvard", { query }],
    queryFn: fetchHarvardData,
    keepPreviousData: true,
  });

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const updateUrlParams = ({ nextPage = page, nextQuery = query }) => {
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
    updateUrlParams({ nextPage: Math.max(page - 1, 1) });
  };

  const handleNextPage = () => {
    updateUrlParams({ nextPage: Math.min(page + 1, totalPages) });
  };

  const handleSort = (a, b) => {
    if (sortBy === "title") {
      return getHarvardTitle(a).localeCompare(getHarvardTitle(b));
    } else if (sortBy === "artist") {
      return getHarvardArtist(a).localeCompare(getHarvardArtist(b));
    }
    return 0;
  };

  const allItems = data?.records || [];
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = allItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  let filteredData = paginatedItems || [];

  if (filterByImage) {
    filteredData = filteredData.filter((art) => art.primaryimageurl);
  }

  filteredData = [...filteredData].sort(handleSort);

  if (isLoading) return <Loading pageLoading="Loading Harvard Art..." />;
  if (isError) return <ErrorPage errorMsg={`Error: ${error.message}`} />;

  return (
    <>
      <nav className="topMenu">
        <MenuCollections />
      </nav>
      <h2>Harvard Art Museum </h2>

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
            placeholder="Search in Harvard..."
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
          aria-label="Search Harvard artworks"
          className="btn-search"
        >
          Search
        </button>
      </form>

      <ul className="gallery-list">
        {filteredData.length > 0 ? (
          filteredData.map((art) => (
            <li
              key={art.id}
              className="gallery-card"
              onClick={() => navigate(`/home/artgallery/harvard/${art.id}`)}
              title={`Click to see more info+`}
            >
              <h3>{getHarvardTitle(art)}</h3>
              <p>{getHarvardArtist(art)}</p>
              {art.primaryimageurl ? (
                <img
                  src={art.primaryimageurl}
                  alt={getHarvardTitle(art)}
                  className="gallery-photo"
                  onClick={() => navigate(`/home/artgallery/harvard/${art.id}`)}
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
          disabled={page === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="pagination-status">
          Page {page} of {totalPages}
        </span>
        <button
          aria-label="Next page"
          onClick={handleNextPage}
          disabled={page >= totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
      <TopButton />
    </>
  );
};

export default HarvardData;
