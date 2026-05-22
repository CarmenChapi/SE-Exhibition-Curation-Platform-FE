import { useEffect, useState, useContext } from "react";
import { getArtworksByCollection, addArtwork } from "../utils/api";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";
import Header from "./Header";
import Footer from "./Footer";
import ErrorPage from "./ErrorPage";
import UserProfile from "./UserProfile";
import MenuCollections from "./MenuCollections";

const ListArtworks = ({}) => {
  const  { collectionId, nameCollection } = useParams();
  const {}  = useParams();

 // console.log(collectionId, nameCollection);
  const [isLoading, setIsLoading] = useState(true);
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    location: "",
    artist: "",
    description: "",
    image_url: "",
  });

  //const { userCx } = useContext(UserContext);
      const userCx ={
     email : "mariachaparro58@gmail.com",
    displayName: "Maria Chaparro"}

  useEffect(() => {
    if (collectionId) {
      fetchArtworks();
    }
  }, [collectionId]);

  const fetchArtworks = () => {
    setIsLoading(true);
    getArtworksByCollection(collectionId)
      .then((artworks) => {
        console.log("artworks", artworks);
        setArtworks(artworks);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        if (err.response?.status === 404) {
          setArtworks([]);
          setError(null);
        } else {
          setError(err);

        }
        setIsLoading(false);
      });
  };


  if (isLoading) return <h3 className="loading">Loading User Art...</h3>;
  if (error)
    return <ErrorPage errorMsg={`Error: ${error.message}`}/>;


  return (
    <>
      
       <Header />
      <nav className="topMenu">
        <UserProfile />
        <MenuCollections />
      </nav>
     
      <h1>Collection <strong>{nameCollection}</strong></h1>
  

      {/* 🔹 Artwork List */}
      {artworks.length === 0 ? (
        <p>No artworks added.</p>
      ) : (
        <div>
        <ul className="collection-list">
          {artworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id_artwork}
              artwork={artwork}
              setArtworks={setArtworks}
              artworks={artworks}
            />
          ))}
        </ul> 
        <Footer/>
        </div>
      )}
    

     
    </>
  );
};


export default ListArtworks;
