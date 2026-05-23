import { useEffect, useState, useContext } from "react";
import { getArtworksByCollection, addArtwork } from "../utils/api";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ErrorPage from "./ErrorPage";
import UserProfile from "./UserProfile";
import MenuCollections from "./MenuCollections";
import { AiOutlineDelete } from "react-icons/ai";
import { TiPlusOutline } from "react-icons/ti";
import { TbListDetails } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { MdOutlineImageNotSupported } from "react-icons/md";

const ListArtworks = ({}) => {
  const { collectionId, nameCollection } = useParams();
  const {} = useParams();

  // console.log(collectionId, nameCollection);
  const [isLoading, setIsLoading] = useState(true);
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);
  const [idArtwork, setIdArtwork] = useState(null);

  const navigate = useNavigate();
  //const { userCx } = useContext(UserContext);
  const userCx = {
    email: "mariachaparro58@gmail.com",
    displayName: "Maria Chaparro",
  };

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

  const handleAddArtwork = () => {
    navigate(`/home/collections/${nameCollection}/${collectionId}/add`);
  };
  const handleOpenArtworkDetail = (id) => {
    navigate(
      `/home/collections/${nameCollection}/${collectionId}/artworks/${id}`,
    );
  };

  // const handleDeleteArtwork = (id) => {
  //       deleteArtwork(artwork.id_artwork)
  //         .then(() => {
  //           setArtworks(
  //             artworks.filter((art) => art.id_artwork !== artwork.id_artwork)
  //           );
  //         })
  //         .catch((err) => console.error("Error deleting artwork:", err));
  //     };

  if (isLoading) return <h3 className="loading">Loading User Art...</h3>;
  if (error) return <ErrorPage errorMsg={`Error: ${error.message}`} />;

  return (
    <>
      <Header />
      <nav className="topMenu">
        <UserProfile />
        <MenuCollections />
      </nav>

      <h2>
        <strong>{nameCollection}</strong>
      </h2>

      {/** Add Artwork */}
      <div collection-card2>
      <button className="btn-add-art" onClick={handleAddArtwork}>
        <TiPlusOutline /> Artwork
      </button>

      {/* 🔹 Artwork List */}
      {artworks.length === 0 ? (
        <p>Collection is empty.</p>
      ) : (
        <div>
          <ul>
            <div className="collections-grid">
              {artworks.map((artwork) => (
                <li className="collection-card">
                  <p className="collection-title">{artwork.title}</p>
                 { artwork.image_url ? (
                  <img
                    src={artwork.image_url}
                    alt="Collection preview"
                    className="card-image"
                  />) : (
                    <div className="no-image">
                      <MdOutlineImageNotSupported size={48} className="card-image"/>
                    </div>
                  )}
                  <div className="button-group">
                    <button
                      className="btn-add-art"
                      onClick={() =>
                        handleOpenArtworkDetail(artwork.id_artwork)
                      }
                    >
                      <TbListDetails />{" "}
                    </button>
              
                      <button className="btn-add-art" onClick={handleDeleteArtwork(artwork.id_artwork)}> 
                      <AiOutlineDelete />
                    </button>
                  </div>
                </li>
              ))}
            </div>
          </ul>
          <Footer />
        </div>
        
      )}
          </div>
    </>

  );
};

export default ListArtworks;
