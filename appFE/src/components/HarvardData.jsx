import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";
import MenuCollections from "./MenuCollections";
import Footer from "./Footer";
import Header from "./Header";

const apikeyHarvard = import.meta.env.VITE_API_KEY_HARVARD;
const ITEMS_PER_PAGE = 10;

const fetchHarvardData = async ({ queryKey }) => {
  const [_key, { query, page }] = queryKey;
  const searchQuery = query ? `&q=${encodeURIComponent(query)}` : "";

  const url = `https://api.harvardartmuseums.org/object?apikey=${apikeyHarvard}&hasimage=1&size=${ITEMS_PER_PAGE}&sort=random&fields=id,title,primaryimageurl,people,dated&page=${page}${searchQuery}`;
  //console.log("Fetching URL:", url); // Debugging
  const { data } = await axios.get(url);
  return data;
};

const HarvardData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [filterByImage, setFilterByImage] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["harvard", { query, page }],
    queryFn: fetchHarvardData,
    keepPreviousData: true,
  });

  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    setQuery(searchTerm);
  };

  const handleSort = (a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "artist") {
      // console.log(a.people[0].displayname, b.people[0].displayname)
      return a.people[0].displayname.localeCompare(b.people[0].displayname);
    }
    return 0;
  };

  let filteredData = data?.records || [];

  // Apply filtering (only show artworks with images if selected)
  if (filterByImage) {
    filteredData = filteredData.filter((art) => art.primaryimageurl);
  }

  // Apply sorting
  filteredData = [...filteredData].sort(handleSort);

  if (isLoading) return <p>Loading Harvard Art Museum Arworks...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
    <Header/>
    <nav className="topMenu">
        <MenuCollections />
        <BackControl />
      </nav>
      <h2>Harvard Art Museum</h2>
      {/* Search Input */}
      <div>
      <label>Search artworks
        <input
          type="text"
          placeholder="Search for artworks..."
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

      {/* Artworks List */}
      <ul className="gallery-list">
        {filteredData.length > 0 ? (
          filteredData.map((art) => (
            <li
              key={art.id}
              className="gallery-card"
              onClick={() => navigate(`/home/artgallery/harvard/${art.id}`)}
              title={`Click to see more info+`}
            >
              <h3>{art.title || "Untitled"}</h3>
              <p>{art.people ? art.people[0].displayname : "Unknown"}</p>
              {art.primaryimageurl ? (
                <img
                  src={art.primaryimageurl}
                  alt={art.title}
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
      <Footer/>
    </>
  );
};

export default HarvardData;
