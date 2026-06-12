import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCollectionByUserMail,
  addCollection,
  addArtwork,
} from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";
import MenuCollections from "../MenuCollections";
import UserProfile from "../UserProfile";
import ErrorPage from "../ErrorPage";
import { TiPlusOutline } from "react-icons/ti";
import TopButton from "../TopButton";
import BackControl from "../BackControl";
import Loading from "../Loading";
import "../collections/Collections.css";

const AddToCollectionFromApi = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [listCollections, setListCollections] = useState([]);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const location = useLocation();
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const { user } = useAuth();
  const { artwork } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {

      if (user?.email) {
        setIsLoading(true);
        try {
          const collections = await getCollectionByUserMail(user.email);
          setListCollections(collections);
        } catch (err) {
          setError(err);
        } finally {
          setIsLoading(false);
        }
      } else {

        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.email, artwork]);

  const handleAddToNewCollection = async () => {
    if (!newCollectionTitle.trim()) {
      setValidationError("Title cannot be empty!");
      return;
    }
    if (pendingAction) return;

    const newCollection = {
      title: newCollectionTitle,
      user_mail: user.email,
      art_count: 0,
    };

    setPendingAction("new");
    try {
      const addedCollection = await addCollection(newCollection);
      addedCollection.art_count = 0;
      setListCollections((currentCollections) => [
        addedCollection,
        ...currentCollections,
      ]);
      setNewCollectionTitle("");
      await addArtwork(addedCollection.id_collection, artwork);
      navigate(
        `/home/collections/${addedCollection.title}/${addedCollection.id_collection}`,
      );
    } catch (err) {
      setError(err);
      setPendingAction(null);
    }
  };

  const handleAddToCollection = async (event, collection) => {
    event.preventDefault();
    event.stopPropagation();



    if (!artwork) {
      setError({ message: "No artwork selected to add." });
      return;
    }
    if (pendingAction) return;

    setPendingAction(collection.id_collection);
    try {
      await addArtwork(collection.id_collection, artwork);
      navigate(
        `/home/collections/${collection.title}/${collection.id_collection}`,
      );
    } catch (err) {
      setError(err);
      setPendingAction(null);
    }
  };

  if (isLoading)
    return <Loading pageLoading="Loading collections..." />;
  if (validationError)
    return (
      <ErrorPage
        errorMsg={validationError}
        onDismiss={() => setValidationError("")}
      />
    );
  if (error && error.status !== 404)
    return <ErrorPage errorMsg={`Error: ${error.message}`} />;

  return (
    <>
      <nav className="topMenu">
        <UserProfile />
        <MenuCollections />
      </nav>
      <h2>Add {artwork?.title || "artwork"}</h2>
      <p>
        <strong>
          Pick one of your collections to add the artwork or create a new one!
        </strong>
      </p>


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
          disabled={Boolean(pendingAction)}
        >
          <strong>
            <TiPlusOutline />{" "}
            {pendingAction === "new" ? "Creating and adding..." : "New Collection"}
          </strong>
        </button>
      </div>


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
                  disabled={Boolean(pendingAction)}
                  onClick={(event) => handleAddToCollection(event, collection)}
                >
                  <strong>
                    {pendingAction === collection.id_collection
                      ? "Adding..."
                      : collection.title}
                  </strong>
                  <TiPlusOutline />
                </button>
              </li>
            ))}
        </ul>
      )}
      <div>
      <BackControl/>
      <TopButton />
      </div>
    </>
  );
};

export default AddToCollectionFromApi;
