import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MenuCollections from "../MenuCollections";
import axios from "axios";
import TopButton from "../TopButton";
import Loading from "../Loading";

const apiKeySmith = import.meta.env.VITE_API_KEY_SMITHSONIAN;
const ITEMS_PER_PAGE = 5;

const fetchSmithData = async ({ queryKey }) => {
  const [, { query }] = queryKey;


  const searchQuery = query ? encodeURIComponent(query) : "art";
  const { data } = await axios.get(
    `https://api.si.edu/openaccess/api/v1.0/category/art_design/search?q=${searchQuery}&api_key=${apiKeySmith}&rows=30&fq=online_media_type:image`
  );



  return data;
};

const SmithData = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "painting";
  const pageFromUrl = Number(searchParams.get("page"));
  const currentPage =
    Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
  const [searchTerm, setSearchTerm] = useState(query === "painting" ? "" : query);
  const [sortBy, setSortBy] = useState("");
  const [filterByImage, setFilterByImage] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["smith", { query }],
    queryFn: fetchSmithData,
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

  const allItems = data?.response.rows || [];
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const paginatedItems = allItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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

  const getArtistName = (art) =>
    art.content?.freetext?.name?.[0]?.content || "Unknown";

  const handleSort = (a, b) => {
    if (sortBy === "title") {
      return (a.title || "").localeCompare(b.title || "");
    } else if (sortBy === "artist") {
      return getArtistName(a).localeCompare(getArtistName(b));
    }
    return 0;
  };

  let filteredData = paginatedItems || [];


  if (filterByImage) {
    filteredData = filteredData.filter(
      (art) =>
        art.content?.descriptiveNonRepeating?.online_media?.media?.[0]?.content
    );
  }


  filteredData = [...filteredData].sort(handleSort);

   if (isLoading)
    return <Loading pageLoading="Loading Smithsonian..." />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>

    <nav className="topMenu">
        <MenuCollections />
      </nav>

      <h2>Smithsonian Institution</h2>

      <form
        className="searchMenu"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch();
        }}
      >
        <label className="label">Search artworks
        <input
          type="text"
          placeholder="Search Smithsonian..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="collection-input"
        />
        </label>
        <label>Sort by
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
        <button type="submit" aria-label="Search Smithsonian artworks" className="btn-search">
          Search
        </button>
      </form>

      <ul className="gallery-list">
        {filteredData.length > 0 ? (
          filteredData.map((art) => (
            <li
              key={art.id}
              className="gallery-card"
              onClick={() => navigate(`/home/artgallery/smithsonian/${art.id}`)}
              title={`Click to see more info+`}>
              {art.title ? <h3>{art.title}</h3> : <h3>Untitled</h3>}
              <p>{getArtistName(art)}</p>
              {art.content.descriptiveNonRepeating.online_media?.media[0]
                ?.content ? (
                <img
                  src={
                    art.content.descriptiveNonRepeating.online_media.media[0]
                      .content
                  }
                  alt={art.title ? art.title : "Artwork"}
                  className="gallery-photo"
                  onClick={() =>
                    navigate(`/home/artgallery/smithsonian/${art.id}`)
                  }
                />
              ) : (
                <p>No Image Available</p>
              )}
            </li>
          ))
        ) : (
                  <p><strong>No results found. Try again</strong></p>
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

export default SmithData;
