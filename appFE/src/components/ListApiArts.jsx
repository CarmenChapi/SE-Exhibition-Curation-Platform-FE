import React from "react";
import { useNavigate } from "react-router-dom";
import MenuCollections from "./MenuCollections";
import Header from "./Header";
import Footer from "./Footer";


const apiList = [
  { name: "Art Institute of Chicago", path: "/chicago", src:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Art_Institute_of_Chicago_logo.svg/512px-Art_Institute_of_Chicago_logo.svg.png" },
  { name: "Harvard Art Museums", path: "/harvard", src: "https://harvardartmuseums.org/assets/icons/fb-og-image-400x400.png"},
  { name: "Rijksmuseum", path: "/rijksmuseum" , src:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPwDwPjP8avzvCeLc3s4fSQeps5SjkeWfMbw&s"},
  { name: "Smithsonian Art Institution", path: "/smithsonian" , src:"https://upload.wikimedia.org/wikipedia/commons/7/7e/Smithsonian_logo_color.svg"},
  { name: "The Europeana", path: "/europeana", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Europeana_logo_2015_basic.svg/800px-Europeana_logo_2015_basic.svg.png" },
  { name: "The Metropolitan Museum of Art", path: "/met" , src:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/The_Metropolitan_Museum_of_Art_Logo.svg/2056px-The_Metropolitan_Museum_of_Art_Logo.svg.png"},
  { name: "Victoria & Albert Museum", path: "/vam" , src:"https://creativereview.imgix.net/content/uploads/2011/03/VA-Logo.png" },
];

const ListApiArtGalleries = () => {
  const navigate = useNavigate();

  return (
    <>
    <Header/>
      <nav className="topMenu">
       <MenuCollections/>
       {/* <BackControl/> */}
       </nav>
       <section >
      <h2>Select an art collection to browse and explore</h2>
     
      <ul className="artApis">
        {apiList.map((artCollection, index) => (
          <li key={index}>
            <img
             src={artCollection.src}
              onClick={() => navigate(`/home/artgallery${artCollection.path}`)}
              className="logo-gallery"
              alt={`logo of ${artCollection.name}`}
              title={`Explore ${artCollection.name} collections`}
            />
            {/* <p>{artCollection.name}</p> */}
          </li>
        ))}
      </ul>
      </section>
      <Footer/>
    </>
  );
};

export default ListApiArtGalleries;
