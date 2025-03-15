import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const fetchArticData = async ({ queryKey }) => {
  const [_key, { page, query }] = queryKey;

  const searchQuery = query ? `&q=${query}` : "&q=art";

  const { data } = await axios.get(
    `https://api.artic.edu/api/v1/artworks/search?${searchQuery}?limit=10&page=${page}&fields=id,title,image_id,artist_display`
  );

  return data;
};

const ArticData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h2>Art Institute of Chicago</h2>
      {/* Search Input */}
      <div>
        <input
          type="text"
          className="collection-input"
          placeholder="Search Art Institue of Chicago Art..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Artworks List */}
      <ul className="gallery-list">
        {data?.data.length > 0 ? (
          data.data.map((art) => (
            <li key={art.id}>
              <h3>{art.title}</h3>
              {art.image_id ? (
                <img
                  src={`https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`}
                  alt={art.title}
                  className="gallery-photo"
                  onClick={() => navigate(`/home/artgallery/chicago/${art.id}`)}
                />
              ) : (
                <p className="text-gray-500">No Image Available</p>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No results found</p>
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
    </>
  );
};

export default ArticData;
