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

  // CORRECCIÓN: Se cambió 'www' por 'data' en el subdominio
  const { data } = await axios.get(
    `https://data.rijksmuseum.nl/api/en/collection?key=${apikeyRM}${searchQuery}&limit=30`
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

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["rijksm", { query }],
    queryFn: fetchRijksMData,
    keepPreviousData: true,
  });

  const handleSearch = () => {
    setQuery(searchTerm);
    setCurrentPage(1); // Resetea a la primera página con una nueva búsqueda
  };

  const allItems = data?.artObjects || [];

  const handleSort = (a, b) => {
    if (sortBy === "title") {
      return (a.title || "").localeCompare(b.title || "");
    } else if (sortBy === "artist") {
      return (a.principalOrFirstMaker || "").localeCompare(b.principalOrFirstMaker || "");
    }
    return 0;
  };

  // OPTIMIZACIÓN: Primero filtramos y ordenamos sobre el TOTAL de los datos
  let filteredData = [...allItems];

  if (filterByImage) {
    filteredData = filteredData.filter((art) => art.webImage && art.webImage.url);
  }

  filteredData.sort(handleSort);

  // OPTIMIZACIÓN: Paginamos al final para que afecte correctamente a los filtros
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) return <p>Loading RijksM...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
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
        <button onClick={handleSearch} className="btn-back">
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
        {paginatedItems.length > 0 ? (
          paginatedItems.map((art) => (
            <li 
              key={art.id}
              className="gallery-card"
              onClick={() => navigate(`/home/artgallery/rijksmuseum/${art.objectNumber}`)}
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
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
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