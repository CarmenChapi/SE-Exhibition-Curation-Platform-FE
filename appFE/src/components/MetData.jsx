import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackControl from "./BackControl";
import MenuCollections from "./MenuCollections";
import Header from "./Header";
import Footer from "./Footer";

const METData = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("painting"); 
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const [sortBy, setSortBy] = useState(""); 
  const [filterByImage, setFilterByImage] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      const searchQuery = query ? `q=${query}` : "q=painting";
      try {
        const idsResponse = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/search?${searchQuery}&hasImages=true`
        );
        const idsData = await idsResponse.json();

        if (!idsData.objectIDs) {
          setArtworks([]);
          setLoading(false);
          return;
        }

        const startIdx = (page - 1) * ITEMS_PER_PAGE;
        const objectIDs = idsData.objectIDs.slice(startIdx, startIdx + ITEMS_PER_PAGE);

        const artworkPromises = objectIDs.map(async (id) => {
          const response = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
          );
          return response.json();
        });

        const artworks = await Promise.all(artworkPromises);
        const artworksWithImages = artworks.filter((art) => art.primaryImage);

        setArtworks(artworksWithImages);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
      setLoading(false);
    };

    fetchArtworks();
  }, [query, page]);

  const handleSearch = () => {
    setPage(1); 
    setQuery(searchTerm);
  };

  const handleSort = (a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "artist") {
      return a.artistDisplayName.localeCompare(b.artistDisplayName);
    }
    return 0;
  };

  let filteredData = artworks || [];

  // Apply filtering (only show artworks with images if selected)
  if (filterByImage) {
    filteredData = filteredData.filter((art) => art.primaryImage);
  }

  // Apply sorting
  filteredData = [...filteredData].sort(handleSort);



  if (loading) return <p>Loading MET Arworks...</p>;


  return (
    <>
    <Header/>
        <nav className="topMenu"> 
       <MenuCollections/>
       <BackControl/>
       </nav>
    <div>
        <h2>The Metropolitan Museum of Art</h2>
      {/* Search Input */}
      <div >
        <label>Search artworks
        <input
          type="text"
          placeholder="Search MET Art..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="collection-input"
        />
        </label>
        <button
          onClick={handleSearch}
          className="btn-search"
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
            <li key={art.objectID} 
            onClick={() => navigate(`/home/artgallery/met/${art.objectID}`)}>
              <h3>{art.title || "Untitled"}</h3>
              <p>{art.artistDisplayName || "Unknown"}</p>
              <img src={art.primaryImage} alt={art.title} className="gallery-photo" 
               onClick={() => navigate(`/home/artgallery/met/${art.objectID}`)}/>
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
    </div>
    <Footer/>
    </>
  );
};

export default METData;
