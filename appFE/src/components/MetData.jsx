import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackControl from "./BackControl";
import MenuCollections from "./MenuCollections";

const METData = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("painting"); // Stores actual search term
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
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
    setPage(1); // Reset to page 1
    setQuery(searchTerm);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
        <section className="topMenu"> 
       <MenuCollections/>
       <BackControl/>
       </section>
    <div>
        <h2>The Metropolitan Museum of Art</h2>
      {/* Search Input */}
      <div >
        <input
          type="text"
          placeholder="Search MET Art..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="collection-input"
        />
        <button
          onClick={handleSearch}
          className="btn-search"
        >
          Search
        </button>
      </div>

      {/* Artworks List */}
      <ul className="gallery-list">
      
        {artworks.length > 0 ? (
          artworks.map((art) => (
            <li key={art.objectID} 
            onClick={() => navigate(`/home/artgallery/met/${art.objectID}`)}>
              <h3>{art.title || "Untitled"}</h3>
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
    </>
  );
};

export default METData;
