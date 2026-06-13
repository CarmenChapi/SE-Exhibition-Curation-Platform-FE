import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import MenuCollections from "../MenuCollections";
import TopButton from "../TopButton";
import Loading from "../Loading";

const fetchArticData = async ({ queryKey }) => {
  const [, { page, query }] = queryKey;

  const { data } = await axios.get(
    "https://api.artic.edu/api/v1/artworks/search",
    {
      params: {
        q: query || "art",
        limit: 10,
        page,
        fields: "id,title,image_id,artist_display",
      },
    },
  );

  return data;
};

const ArticData = ({ searchValue = "" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageFromUrl = Number(searchParams.get("page"));
  const page =
    Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
  const [searchTerm, setSearchTerm] = useState(query || searchValue);
  const [sortBy, setSortBy] = useState("");
  const [filterByImage, setFilterByImage] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["artic", { page, query }],
    queryFn: fetchArticData,
    keepPreviousData: true,
  });

  useEffect(() => {
    setSearchTerm(query || searchValue);
  }, [query, searchValue]);

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
    updateUrlParams({ nextPage: page + 1 });
  };

  const handleSort = (a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "artist") {
      return a.artist_display.localeCompare(b.artist_display);
    }
    return 0;
  };

  let filteredData = data?.data || [];

  if (filterByImage) {
    filteredData = filteredData.filter((art) => art.image_id);
  }

  filteredData = [...filteredData].sort(handleSort);

  if (isLoading) return <Loading pageLoading="Loading Chicago Art..." />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <nav className="topMenu">
        <MenuCollections />
      </nav>

      <h2>Art Institute of Chicago</h2>

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
            className="collection-input"
            placeholder="Search in Chicago..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          aria-label="Search Art Institute of Chicago artworks"
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
              onClick={() => navigate(`/home/artgallery/chicago/${art.id}`)}
              title={`Click to see more info+`}
              className="gallery-card"
            >
              <h3>{art.title}</h3>
              <p>{art.artist_display ? art.artist_display : "Unknown"}</p>
              {art.image_id ? (
                <img
                  src={`https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`}
                  alt={art.title}
                  className="gallery-photo"
                  onClick={() => navigate(`/home/artgallery/chicago/${art.id}`)}
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
          disabled={page === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="pagination-status">Page {page}</span>
        <button
          aria-label="Next page"
          onClick={handleNextPage}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
      <TopButton />
    </>
  );
};

export default ArticData;
