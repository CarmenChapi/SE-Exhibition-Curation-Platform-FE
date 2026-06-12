import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import MenuCollections from "../MenuCollections";
import TopButton from "../TopButton";
import Loading from "../Loading";


const apikeyHarvard = import.meta.env.VITE_API_KEY_HARVARD;
const ITEMS_PER_PAGE = 6;

const fetchHarvardData = async ({ queryKey }) => {
  const [, { query, page }] = queryKey;
  const { data } = await axios.get(
    "https://api.harvardartmuseums.org/object",
    {
      params: {
        apikey: apikeyHarvard,
        hasimage: 1,
        size: ITEMS_PER_PAGE,
        sort: "random",
        fields: "id,title,primaryimageurl,people,dated",
        page,
        ...(query && { q: query }),
      },
    },
  );
  return data;
};

const HarvardData = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageFromUrl = Number(searchParams.get("page"));
  const page = Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
  const [searchTerm, setSearchTerm] = useState(query);
  const [sortBy, setSortBy] = useState("");
  const [filterByImage, setFilterByImage] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading, isError} = useQuery({
    queryKey: ["harvard", { query, page }],
    queryFn: fetchHarvardData,
    keepPreviousData: true,
  });

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const updateUrlParams = ({ nextPage = page, nextQuery = query }) => {
    const params = new URLSearchParams();

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    }

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    }

    setSearchParams(params);
  };

  const handleSearch = () => {
    updateUrlParams({ nextPage: 1, nextQuery: searchTerm });
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
      return a.people[0].displayname.localeCompare(b.people[0].displayname);
    }
    return 0;
  };

  let filteredData = data?.records || [];


  if (filterByImage) {
    filteredData = filteredData.filter((art) => art.primaryimageurl);
  }


  filteredData = [...filteredData].sort(handleSort);

   if (isLoading)
    return <Loading pageLoading="Loading Harvard Art Museum..." />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
    <nav className="topMenu">
        <MenuCollections />
      </nav>
      <h2>Harvard Art Museum </h2>



      <form
        className="searchMenu"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch();
        }}
      >
      <label className="label">Search artworks
        <input
          type="text"
          placeholder="Search for artworks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="collection-input"
        />
        </label>
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
            className="box-input"
            type="checkbox"
            checked={filterByImage}
            onChange={() => setFilterByImage(!filterByImage)}
          />
          Only show artworks with images
        </label>
           <button type="submit" aria-label="Search Harvard artworks"
         className="btn-search">
          Search
        </button>
        </form>

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
      <TopButton />
    </>
  );
};

export default HarvardData;
