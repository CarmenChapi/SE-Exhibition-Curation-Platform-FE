import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";
import MenuCollections from "./MenuCollections";
import Header from "./Header";
import Footer from "./Footer";

const apikeyRM = import.meta.env.VITE_API_KEY_RIJKS;
const ITEMS_PER_PAGE = 6;

const fetchRijksMData = async ({ queryKey }) => {
  const [_key, { query }] = queryKey;

  const searchQuery = query ? `&q=${query}` : "";

  const { data } = await axios.get(
    `https://www.rijksmuseum.nl/api/en/collection?key=${apikeyRM}${searchQuery}&limit=30`
  );

  return data;
};

const RijksMData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(""); 
  const [filterByImage, setFilterByImage] = useState(false); 
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["rijksm", { query }],
    queryFn: fetchRijksMData,
    keepPreviousData: true,
  });

  const handleSearch = () => {
    setQuery(searchTerm);
  };

  const allItems = data?.artObjects || [];
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const paginatedItems = allItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "artist") {
      return a.principalOrFirstMaker.localeCompare(b.principalOrFirstMaker);
    }
    return 0;
  };

  let filteredData = paginatedItems || [];

  // Apply filtering (only show artworks with images if selected)
  if (filterByImage) {
    filteredData = filteredData.filter((art) => art.webImage.url);
  }

  // Apply sorting
  filteredData = [...filteredData].sort(handleSort);



  if (isLoading) return <p>Loading RijksM Artworks...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
    <Header/>
          <nav className="topMenu"> 
       <MenuCollections/>
       <BackControl/>
       </nav>
      <h2>Rijksmuseum</h2>
      {/* Search Input */}
      <div>
        <label>Search artworks
        <input
          type="text"
          placeholder="Search Rijksmuseum Art..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="collection-input"
        />
        </label>
        <button
          onClick={handleSearch}
          className="btn-back"
        >
          Search
        </button>
      </div>


          {/* Sorting & Filtering Options */}
          <div className="filter-sort-container">
            <label>Sort by
        <select onChange={(e) => setSortBy(e.target.value)} className="sort-dropdown">
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
            <li key={art.id}
            onClick={() => navigate(`/home/artgallery/rijksmuseum/${art.id.slice(3)}`)}>
              {art.title ? <h3>{art.title}</h3> : <h3>Untitled</h3>}
              {art.principalOrFirstMaker ? <p>{art.principalOrFirstMaker}</p> : <p>Unkown</p>}
              {art.webImage ? (
                <img
                  src={art.webImage.url}
                  alt={art.title ? art.title : "Artwork-photo"}
                  className="gallery-photo"
                  onClick={() => navigate(`/home/artgallery/rijksmuseum/${art.id.slice(3)}`)}
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

export default RijksMData;
