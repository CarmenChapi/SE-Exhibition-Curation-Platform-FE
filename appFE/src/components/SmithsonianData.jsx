import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuCollections from "./MenuCollections";
import BackControl from "./BackControl";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const apiKeySmith = import.meta.env.VITE_API_KEY_SMITHSONIAN;
const ITEMS_PER_PAGE = 5;

const fetchSmithData = async ({ queryKey }) => {
  const [_key, { query }] = queryKey;

  // Default search term if no query is provided
  const searchQuery = query ? encodeURIComponent(query) : "art";
  const { data } = await axios.get(
    `https://api.si.edu/openaccess/api/v1.0/category/art_design/search?q=${searchQuery}&api_key=${apiKeySmith}&rows=30&fq=online_media_type:image`
  );
  //console.log(data)
  console.log(apiKeySmith);

  return data;
};

const SmithData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("painting"); // Default query term
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [filterByImage, setFilterByImage] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["smith", { query }],
    queryFn: fetchSmithData,
    keepPreviousData: true,
  });

  const allItems = data?.response.rows || [];
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
      return a.title.localeCompare(b.title);
    } else if (sortBy === "artist") {
      return a.content.freetext.name[0].content.localeCompare(
        b.content.freetext.name[0].content
      );
    }
    return 0;
  };

  let filteredData = paginatedItems || [];

  // Apply filtering (only show artworks with images if selected)
  if (filterByImage) {
    filteredData = filteredData.filter(
      (art) =>
        art.content?.descriptiveNonRepeating?.online_media?.media?.[0]?.content
    );
  }

  // Apply sorting
  filteredData = [...filteredData].sort(handleSort);

  if (isLoading) return <p>Loading Smithsonian Artworks...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
    <Header/>
      <nav className="topMenu">
        <MenuCollections />
        <BackControl />
      </nav>

      <h2>Smithsonian Institution</h2>

      {/* Search Input */}
      <div className="collection-input">
        <label> Search artworks
        <input
          type="text"
          placeholder="Search Smithsonian Art..."
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

      <ul className="gallery-list">
        {filteredData.length > 0 ? (
          filteredData.map((art) => (
            <li
              key={art.id}
              onClick={() => navigate(`/home/artgallery/smithsonian/${art.id}`)}
            >
              {art.title ? <h3>{art.title}</h3> : <h3>Untitled</h3>}
              {art.content.freetext.name ? (
                <p>{art.content.freetext.name[0].content}</p>
              ) : (
                <p>Untitled</p>
              )}
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

export default SmithData;
