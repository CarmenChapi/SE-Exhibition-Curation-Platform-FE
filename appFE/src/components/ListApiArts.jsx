import React from "react";
import { useNavigate } from "react-router-dom";

const apiList = [
  { name: "Art Institute of Chicago", path: "/chicago" },
  { name: "Europeana Art", path: "/europeana" },
  { name: "Harvard Art Museums", path: "/harvard" },
  { name: "The Metropolitan Museum of Art", path: "/met" },
  { name: "Rijksmuseum", path: "/rijksmuseum" },
  { name: "Smithsonian Art", path: "/smithsonian" },
  { name: "Victoria & Albert Museum", path: "/vam" },
];

const ListApiArtGalleries = () => {
  const navigate = useNavigate(); // React Router navigation

  return (
    <div className="p-4">
      <p className="text-lg font-bold mb-3">Select an Art Collection</p>
      <ul className="space-y-2">
        {apiList.map((artCollection, index) => (
          <li key={index}>
            <button
              onClick={() => navigate(`/home/artgallery${artCollection.path}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full text-left"
            >
              {artCollection.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListApiArtGalleries;
