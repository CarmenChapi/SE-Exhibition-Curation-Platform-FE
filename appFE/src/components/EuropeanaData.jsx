import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackControl from "./BackControl";
import MenuCollections from "./MenuCollections";
import Header from "./Header";
import Footer from "./Footer";

const apiKeyEuro = import.meta.env.VITE_API_KEY_EUROPEANA;
const ITEMS_PER_PAGE = 6;

const fetchEuroData = async ({ queryKey }) => {
  const [_key, { query }] = queryKey;
  const searchQuery = query ? `&query=${query}` : "&query=art curator";

  const { data } = await axios.get(
    `https://api.europeana.eu/record/v2/search.json?wskey=${apiKeyEuro}${searchQuery}&media=true&qf=TYPE:IMAGE&rows=30`
  );

  return data;
};

const EuropeanaData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [filterByImage, setFilterByImage] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["euro", { query }],
    queryFn: fetchEuroData,
    keepPreviousData: true,
  });

  const handleSearch = () => {
    setCurrentPage(1); // Reset to page 1 on new search
    setQuery(searchTerm);
  };

  const allItems = data?.items || [];
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const paginatedItems = allItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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

  // Apply filtering (only show artworks with images if selected)
  if (filterByImage) {
    filteredData = filteredData.filter((art) => art.edmIsShownBy);
  }

  // Apply sorting
  filteredData = [...filteredData].sort(handleSort);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
    <Header/>
      <nav className="topMenu">
        <MenuCollections />
        <BackControl />
      </nav>

      <h2>Europeana</h2>

      {/* Search Input */}
      <div>
        <label>Search artworks
        <input
          type="text"
          placeholder="Search Europeana Art..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="collection-input"
        />
        </label>
        <button onClick={handleSearch} className="btn-search">
          Search
        </button>
      </div>

      {/* Sorting & Filtering Options */}
   
      <div className="filter-sort-container">
      <label>Sort by
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
            type="checkbox"
            checked={filterByImage}
            onChange={() => setFilterByImage(!filterByImage)}
          />
          Only show artworks with images
        </label>
      </div>

      {/**Europeana ListArworks */}
      <ul className="gallery-list">
        {filteredData.length > 0 ? (
          filteredData.map((art) => (
            <li
              key={art.id}
              onClick={() =>
                navigate(
                  `/home/artgallery/europeana/${art.id.replaceAll("/", "-")}`
                )
              }
            >
              {art.title ? <h3>{art.title[0]}</h3> : <h3>Untitled</h3>}
              {art.edmIsShownBy ? (
                <img
                  className="gallery-photo"
                  src={art.edmIsShownBy[0]}
                  alt={art.title ? art.title[0] : "photo-artwork"}
                  onClick={() =>
                    navigate(
                      `/home/artgallery/europeana/${art.id.replaceAll(
                        "/",
                        "-"
                      )}`
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

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
      <Footer/>
    </>
  );
};

export default EuropeanaData;
