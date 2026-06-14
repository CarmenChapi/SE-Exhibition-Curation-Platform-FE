import { useEffect, useState } from "react";
import { getArtworksByCollection, deleteArtwork } from "../../utils/api";
import { useParams } from "react-router-dom";
import TopButton from "../TopButton";
import ErrorPage from "../ErrorPage";
import UserProfile from "../UserProfile";
import MenuCollections from "../MenuCollections";
import { AiOutlineDelete } from "react-icons/ai";
import { TiPlusOutline } from "react-icons/ti";
import { TbListDetails } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import "./Collections.css";
import { IoCaretBack } from "react-icons/io5";


const ListArtworks = () => {
  const { collectionId, nameCollection } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);
  const [deletingArtworkId, setDeletingArtworkId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworks = () => {
      setIsLoading(true);
      getArtworksByCollection(collectionId)
        .then((artworks) => {
          setArtworks(artworks);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            setArtworks([]);
            setError(null);
          } else {
            setError(err);
          }
          setIsLoading(false);
        });
    };

    if (collectionId) {
      fetchArtworks();
    }
  }, [collectionId]);

  const handleAddArtwork = () => {
    navigate(`/home/collections/${nameCollection}/${collectionId}/add`);
  };
  const handleOpenArtworkDetail = (id) => {
    navigate(
      `/home/collections/${nameCollection}/${collectionId}/artworks/${id}`,
    );
  };

  const handleBack = () => {
    navigate(`/home/collections`);
  };

  const handleDeleteArtwork = async (id) => {
    if (deletingArtworkId) return;

    setDeletingArtworkId(id);
    try {
      await deleteArtwork(id);
      setArtworks((currentArtworks) =>
        currentArtworks.filter((art) => art.id_artwork !== id),
      );
    } catch (err) {
      console.error("Error deleting artwork:", err);
    } finally {
      setDeletingArtworkId(null);
    }
  };

  if (isLoading) return <Loading pageLoading="Loading Collection..." />;
  if (error) return <ErrorPage errorMsg={`Error: ${error.message}`} />;

  return (
    <>
      <nav className="topMenu">
        <UserProfile />
        <MenuCollections />
      </nav>
      <div>
        <Link to={`/home/collections`} className="link-menu">
          <h2><IoCaretBack />{nameCollection}</h2>
        </Link>
      </div>

      <div className="collection-card2 list-artworks-container">
        {artworks.length === 0 ? (
          <div>
            <p>Collection is empty</p>
            <button
              aria-label="Add artwork"
              className="btn-add-art"
              onClick={handleAddArtwork}
            >
              <TiPlusOutline /> Artwork
            </button>
          </div>
        ) : (
          <div>
            <button
              aria-label="Add artwork"
              className="btn-add-art list-art-add"
              onClick={handleAddArtwork}
            >
              <TiPlusOutline /> Add Artwork
            </button>
            <ul className="collections-grid">
              {artworks.map((artwork) => (
                <li className="collection-card" key={artwork.id_artwork}>
                    <p className="collection-title">{artwork.title}</p>
                    {artwork.image_url ? (
                      <img
                        src={artwork.image_url}
                        alt="Collection preview"
                        className="card-image card-preview"
                      />
                    ) : (
                      <div className="no-image">
                        <MdOutlineImageNotSupported
                          size={48}
                          className="card-image"
                        />
                      </div>
                    )}
                    <div className="button-group">
                      <button
                        aria-label={`View details for ${artwork.title}`}
                        className="btn-add-art"
                        onClick={() =>
                          handleOpenArtworkDetail(artwork.id_artwork)
                        }
                      >
                        <TbListDetails />{" "}
                      </button>

                      <button
                        aria-label={`Delete ${artwork.title}`}
                        className="btn-add-art"
                        disabled={deletingArtworkId === artwork.id_artwork}
                        onClick={() => handleDeleteArtwork(artwork.id_artwork)}
                      >
                        <AiOutlineDelete />{" "}
                        {deletingArtworkId === artwork.id_artwork
                          ? "Deleting..."
                          : ""}
                      </button>
                    </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        <button
          aria-label="Back to collections"
          className="btn-add-art"
          onClick={() => handleBack()}
        >
         <IoCaretBack />
        </button>
        <TopButton />
      </div>
    </>
  );
};

export default ListArtworks;
