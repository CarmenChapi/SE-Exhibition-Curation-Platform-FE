import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";
import MenuCollections from "./MenuCollections";
import Header from "./Header";
import Footer from "./Footer";

const ITEMS_PER_PAGE = 6;

const fetchVAMData = async ({ queryKey }) => {
  const [_key, { query }] = queryKey;


  const searchQuery = query ? encodeURIComponent(query) : "painting";

  const { data } = await axios.get(
    `https://api.vam.ac.uk/v2/objects/search?q=${searchQuery}&images_exist=true&limit=30`
  );

  return data;
};

const VAMData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("painting"); // Default query term
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [filterByImage, setFilterByImage] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["vam", { query }],
    queryFn: fetchVAMData,
    keepPreviousData: true,
  });

  const allItems = data?.records || [];
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const paginatedItems = allItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = () => {
    setQuery(searchTerm);
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

  if (isLoading) return <p>Loading V&A...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <Header />
      <nav className="topMenu">
        <MenuCollections />
        <BackControl />
      </nav>

      <h2>Victoria & Albert Museum</h2>

      {/* Search Input */}
      <div>
        <label>
          Search artworks
          <input
            type="text"
            placeholder="Search V&A Art..."
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
            type="checkbox"
            checked={filterByImage}
            onChange={() => setFilterByImage(!filterByImage)}
          />
          Only show artworks with images
        </label>
      </div>

      {/* Artworks List */}
      <ul className="gallery-list">
        {filteredData.length > 0 ? (
          filteredData.map((art) => (
            <li
            className="gallery-card"
              key={art.systemNumber}
              onClick={() =>
                navigate(`/home/artgallery/vam/${art.systemNumber}`)
              }
              title={`Click to see more info+`}>
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
      <Footer />
    </>
  );
};

export default VAMData;
