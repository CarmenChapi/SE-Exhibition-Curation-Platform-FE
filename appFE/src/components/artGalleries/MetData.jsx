import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MenuCollections from "../MenuCollections";
import TopButton from "../TopButton";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

const METData = () => {
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "painting";
  const pageFromUrl = Number(searchParams.get("page"));
  const page = Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
  const [searchTerm, setSearchTerm] = useState(query === "painting" ? "" : query);
  const ITEMS_PER_PAGE = 6;
  const [sortBy, setSortBy] = useState("");
  const [filterByImage, setFilterByImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworks = async () => {
      setIsLoading(true);
      setError(null);
      const searchQuery = query ? `q=${encodeURIComponent(query)}` : "q=painting";
      try {
        const idsResponse = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/search?${searchQuery}&hasImages=true`
        );
        if (!idsResponse.ok) {
          throw new Error("The Metropolitan Museum API could not be reached.");
        }
        const idsData = await idsResponse.json();

        if (!idsData.objectIDs) {
          setArtworks([]);
          return;
        }

        const startIdx = (page - 1) * ITEMS_PER_PAGE;
        const objectIDs = idsData.objectIDs.slice(startIdx, startIdx + ITEMS_PER_PAGE);

        const artworkPromises = objectIDs.map(async (id) => {
          const response = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
          );
          if (!response.ok) {
            throw new Error(`Artwork ${id} could not be loaded.`);
          }
          return response.json();
        });

        const artworks = await Promise.all(artworkPromises);
        const artworksWithImages = artworks.filter((art) => art.primaryImage);

        setArtworks(artworksWithImages);
      } catch (error) {
        console.error("Error fetching artworks:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtworks();
  }, [query, page]);

  useEffect(() => {
    setSearchTerm(query === "painting" ? "" : query);
  }, [query]);

  const updateUrlParams = ({ nextPage = page, nextQuery = query }) => {
    const params = new URLSearchParams();

    if (nextQuery.trim() && nextQuery.trim() !== "painting") {
      params.set("q", nextQuery.trim());
    }

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    }

    setSearchParams(params);
  };

  const handleSearch = () => {
    updateUrlParams({ nextPage: 1, nextQuery: searchTerm || "painting" });
  };

  const handlePreviousPage = () => {
    updateUrlParams({ nextPage: Math.max(page - 1, 1) });
  };

  const handleNextPage = () => {
    updateUrlParams({ nextPage: page + 1 });
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


  if (filterByImage) {
    filteredData = filteredData.filter((art) => art.primaryImage);
  }


  filteredData = [...filteredData].sort(handleSort);
  if (isLoading)
    return <Loading pageLoading="Loading The Metropolitan Museum of Art..." />;
  if (error)
    return <ErrorPage errorMsg={`Error: ${error.message}`} />;


  return (
    <>
      <nav className="topMenu">
        <MenuCollections />
      </nav>
      <div>
        <h2>The Metropolitan Museum of Art</h2>
        <div className="searchMenu">
          <label className="label">
            Search artworks
            <input
              type="text"
              placeholder="Search MET Art..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="collection-input"
            />
          </label>
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
            className="box-input"
            type="checkbox"
            checked={filterByImage}
            onChange={() => setFilterByImage(!filterByImage)}
          />
          Only show artworks with images
        </label>
          <button type="button" aria-label="Search MET artworks" onClick={handleSearch} className="btn-search">
            Search
          </button>
      </div>


        <ul className="gallery-list">
          {filteredData.length > 0 ? (
            filteredData.map((art) => (
              <li
                key={art.objectID}
                onClick={() => navigate(`/home/artgallery/met/${art.objectID}`)}
                title={`Click to see more info+`}
                className="gallery-card"
              >
                <h3>{art.title || "Untitled"}</h3>
                <p>{art.artistDisplayName || "Unknown"}</p>
                <img
                  src={art.primaryImage}
                  alt={art.title}
                  className="gallery-photo"
                  onClick={() =>
                    navigate(`/home/artgallery/met/${art.objectID}`)
                  }
                />
              </li>
            ))
          ) : (
            <p>No results found</p>
          )}
        </ul>

        <div className="pagination-controls">
          <button
            aria-label="Previous page"
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="pagination-status">Page {page}</span>
          <button
            aria-label="Next page"
            onClick={handleNextPage}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>

      <TopButton />

    </>
  );
};

export default METData;
