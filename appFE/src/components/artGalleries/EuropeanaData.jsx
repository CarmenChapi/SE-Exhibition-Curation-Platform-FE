import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MenuCollections from "../MenuCollections";
import TopButton from "../TopButton";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

const apiKeyEuro = import.meta.env.VITE_API_KEY_EUROPEANA;
const ITEMS_PER_PAGE = 6;

const getEuropeanaErrorMessage = (error) => {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "Europeana is taking too long to respond. Please try again.";
    }

    if (error.response?.status) {
      return `Europeana request failed (${error.response.status}). Please try again.`;
    }

    return "Europeana is currently unavailable. Please try again.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Europeana is currently unavailable. Please try again.";
};

const fetchEuroData = async ({ queryKey }) => {
  const [, { query }] = queryKey;
  try {
    const { data } = await axios.get(
      "https://api.europeana.eu/record/v2/search.json",
      {
        params: {
          wskey: apiKeyEuro,
          query: query || "art",
          media: true,
          qf: "TYPE:IMAGE",
          rows: 30,
        },
        timeout: 10000,
      },
    );

    if (data?.success === false) {
      throw new Error(data.error || "Europeana returned an error.");
    }

    return data;
  } catch (error) {
    throw new Error(getEuropeanaErrorMessage(error));
  }
};

const EuropeanaData = () => {
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
    queryKey: ["euro", { query }],
    queryFn: fetchEuroData,
    keepPreviousData: true,
    retry: false,
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

  const allItems = data?.items || [];
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const paginatedItems = allItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSort = (a, b) => {
    if (sortBy === "title") {
      return a.title[0].localeCompare(b.title[0]);
    } else if (sortBy === "artist") {
      return b.title[0].localeCompare(a.title[0]);
    }
    return 0;
  };

  let filteredData = paginatedItems || [];

  if (filterByImage) {
    filteredData = filteredData.filter((art) => art.edmIsShownBy);
  }

  filteredData = [...filteredData].sort(handleSort);

  if (isLoading) return <Loading pageLoading="Loading Europeana..." />;
  if (isError) return <ErrorPage errorMsg={`Error: ${error.message}`} />;

  return (
    <>
      <nav className="topMenu">
        <MenuCollections />
      </nav>

      <h2>Europeana</h2>

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
            placeholder="Search Europeana Art..."
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
            <option value="artist">Title (Z-A)</option>
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
          aria-label="Search Europeana artworks"
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
              key={art.id}
              onClick={() =>
                navigate(
                  `/home/artgallery/europeana/${encodeURIComponent(art.id)}`,
                )
              }
              title={`Click to see more info+`}
            >
              {art.title ? <h3>{art.title[0]}</h3> : <h3>Untitled</h3>}
              {art.edmIsShownBy ? (
                <img
                  className="gallery-photo"
                  src={art.edmIsShownBy[0]}
                  alt={art.title ? art.title[0] : "photo-artwork"}
                  onClick={() =>
                    navigate(
                      `/home/artgallery/europeana/${encodeURIComponent(art.id)}`,
                    )
                  }
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

export default EuropeanaData;
