import React from "react";
import UserProfile from "./UserProfile";
import { Link } from "react-router-dom";
import ArtGalleriesImg from "/src/assets/ArtGalleries.png";
import CollectionImg from "/src/assets/MyCollections.png";
import TopButton from "./TopButton";

const images = [
  "https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?cs=srgb&dl=pexels-steve-1266808.jpg&fm=jpg",
  "https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFydHxlbnwwfHwwfHx8Mg%3D%3D",
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFydHxlbnwwfHwwfHx8Mg%3D%3D",
  "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXJ0fGVufDB8fDB8fHwy",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0fGVufDB8fDB8fHwy",
  "https://images.unsplash.com/photo-1493210977798-4f655ac200a9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGFydHxlbnwwfHwwfHx8Mg%3D%3D",
  "https://images.unsplash.com/photo-1459908676235-d5f02a50184b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGFydHxlbnwwfHwwfHx8Mg%3D%3D",
];

const Home = () => {
  return (
    <>
      <nav className="home-user">
        <UserProfile />
      </nav>

      <main className="home-showcase">
        <Link
          to="/home/artgalleries"
          className="home-showcase-card home-showcase-link"
        >
          <img
            src={ArtGalleriesImg}
            className="home-showcase-icon"
            alt=""
          />
          <div>
            <h2>Explore Art Galleries</h2>
            <p>
              Discover a world of inspiration. Explore thousands of
              masterpieces from world-renowned museums.
            </p>
          </div>
        </Link>

        <div className="home-showcase-card home-image-grid">
          {images.slice(0, 4).map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Featured artwork ${index + 1}`}
              className="home-grid-image"
            />
          ))}
        </div>

        <div className="home-showcase-card home-image-grid">
          {images.slice(4).map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Featured artwork ${index + 5}`}
              className="home-grid-image"
            />
          ))}
        </div>

        <Link
          to="/home/collections"
          className="home-showcase-card home-showcase-link"
        >
          <img
            src={CollectionImg}
            className="home-showcase-icon"
            alt=""
          />
          <div>
            <h2>My Collections</h2>
            <p>
              Curate your own exhibitions by selecting and organizing artworks
              into personalized collections.
            </p>
          </div>
        </Link>
      </main>
      <TopButton />
    </>
  );
};

export default Home;
