import React from "react";
import { useNavigate } from "react-router-dom";
import BackControl from "./BackControl";
import MenuCollections from "./MenuCollections";

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
    <div >
      <section className="topMenu"> 
       <MenuCollections/>
       <BackControl/>
       </section>
       <section className="artApis">
      <h2>Select an art collection to browse and explore</h2>
      <ul >
        {apiList.map((artCollection, index) => (
          <li key={index}>
            <button
              onClick={() => navigate(`/home/artgallery${artCollection.path}`)}
              className="btn-gallery"
            >
              {artCollection.name}
            </button>
          </li>
        ))}
      </ul>
      </section>
    </div>
  );
};

export default ListApiArtGalleries;
