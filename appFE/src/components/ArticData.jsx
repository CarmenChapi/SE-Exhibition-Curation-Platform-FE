import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";
import MenuCollections from "./MenuCollections";
import Header from "./Header";
import Footer from "./Footer";

const fetchArticData = async ({ queryKey }) => {
  const [_key, { page, query }] = queryKey;

  const searchQuery = query ? `&q=${query}` : "&q=art";

  const { data } = await axios.get(
    `https://api.artic.edu/api/v1/artworks/search?${searchQuery}&limit=10&page=${page}&fields=id,title,image_id,artist_display`
  );

  return data;
};

const ArticData = ({ searchValue = "" }) => {
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterByImage, setFilterByImage] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["artic", { page, query }],
    queryFn: fetchArticData,
    keepPreviousData: true,
  });

  const handleSearch = () => {
    setPage(1);
    setQuery(searchTerm);
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

  // Apply filtering (only show artworks with images if selected)
  if (filterByImage) {
    filteredData = filteredData.filter((art) => art.image_id);
  }

  // Apply sorting
  filteredData = [...filteredData].sort(handleSort);

  if (isLoading) return <p>Loading Chicago Art Institute Artwork...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Header />
      <nav className="topMenu">
        <MenuCollections />
        <BackControl />
      </nav>
      
      <h2>Art Institute of Chicago</h2>

      {/* Search Input */}
      <div>
        <label>
          Search artworks
          <input
            type="text"
            className="collection-input"
            placeholder="Search Art Institute of Chicago Art..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <button onClick={handleSearch} className="btn-search">
          Search
        </button>
      </div>

      {/* Sorting & Filtering Options */}
      <div className="filter-sort-container">
        <label>
          {" "}
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
              key={art.id}
              onClick={() => navigate(`/home/artgallery/chicago/${art.id}`)}
              title={`Click to see more info+`}
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
          <p>No results found</p>
        )}
      </ul>

      {/* Pagination Controls */}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
      <Footer />
    </>
  );
};

export default ArticData;
