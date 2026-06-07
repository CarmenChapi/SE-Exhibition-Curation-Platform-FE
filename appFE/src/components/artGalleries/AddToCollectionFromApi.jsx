import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCollectionByUserMail,
  addCollection,
  addArtwork,
} from "../../utils/api";
import { UserContext } from "../../context/UserContext";
import MenuCollections from "../MenuCollections";
import UserProfile from "../UserProfile";
import ErrorPage from "../ErrorPage";
import { TiPlusOutline } from "react-icons/ti";
import Footer from "../Footer";

const AddToCollectionFromApi = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [listCollections, setListCollections] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const { userCx } = useContext(UserContext);
  const { artwork } = location.state || {};
  const navigate = useNavigate();

  //  const userCx ={
  //   email : "mariachaparro58@gmail.com",
  //  displayName: "Ada Lovelace"}

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching collections for user:", userCx?.email, artwork);
      if (userCx?.email) {
        setIsLoading(true);
        try {
          const collections = await getCollectionByUserMail(userCx.email);
          setListCollections(collections);
        } catch (err) {
          setError(err);
        } finally {
          setIsLoading(false);
        }
      } else {
        // setError({message:"No user email provided"})
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userCx?.email, artwork]);

  const handleAddToNewCollection = () => {
    if (!newCollectionTitle.trim()) return alert("Title cannot be empty!");

    const newCollection = {
      title: newCollectionTitle,
      user_mail: userCx.email,
      art_count: 0,
    };

    addCollection(newCollection)
      .then((addedCollection) => {
        console.log("Added collection:", addedCollection);
        addedCollection.art_count = 0;
        setListCollections([addedCollection, ...listCollections]);
        setNewCollectionTitle("");
        addArtwork(addedCollection.id_collection, artwork)
          .then((addedArtwork) => {
            console.log("Added artwork to collection:", addedArtwork); //
            navigate(
              `/home/collections/${addedCollection.title}/${addedCollection.id_collection}`,
            );
          })
          .catch((err) => setError(err));
        //navigate(`/home/collections`);
      })
      .catch((err) => setError(err));
  };

  const handleAddToCollection = (event, collection) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("Adding artwork to collection:", collection);

    if (!artwork) {
      setError({ message: "No artwork selected to add." });
      return;
    }

    addArtwork(collection.id_collection, artwork)
      .then((addedArtwork) => {
        console.log("Added artwork to collection:", addedArtwork); //
        navigate(
          `/home/collections/${collection.title}/${collection.id_collection}`,
        );
      })
      .catch((err) => setError(err));
  };

  if (isLoading)
    return <h3 className="loading">Loading User Collections...</h3>;
  if (error && error.status !== 404)
    return <ErrorPage errorMsg={`Error: ${error.message}`} />;

  return (
    <>
      <nav className="topMenu">
        <UserProfile />
        <MenuCollections />
      </nav>
      <h2>Add {artwork.title}</h2>
      <p>
        <strong>
          Pick one of your collections to add the artwork or create a new one!
        </strong>
      </p>

      {/** Add Collection Form */}
      <div className="collection-card2">
        <label className="label">
         
          <input
            type="text"
            className="collection-input"
            value={newCollectionTitle}
            onChange={(e) => setNewCollectionTitle(e.target.value)}
            placeholder="Give a name"
          />
        </label>
        <button
          aria-label="Add artwork to a new collection"
          className="btn-add-art"
          onClick={handleAddToNewCollection}
        >
          <strong>  <TiPlusOutline /> New Collection</strong>
        </button>
      </div>

      {/* Collection List */}
      {listCollections.length === 0 ? (
        <p>No collections created yet.</p>
      ) : (
        <ul className="collections-grid">
            {listCollections.map((collection) => (
              <li className="collection-card" key={collection.id_collection}>
                <button
                  aria-label={`Add artwork to ${collection.title}`}
                  type="button"
                  className="btn-add-art btn-select-collection"
                  onClick={(event) => handleAddToCollection(event, collection)}
                >
                  <strong>{collection.title}</strong>
                  <TiPlusOutline />
                </button>
              </li>
            ))}
        </ul>
      )}
      <Footer />
    </>
  );
};

export default AddToCollectionFromApi;
