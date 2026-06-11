import { useEffect, useState, useContext } from "react";
import { getCollectionByUserMail, addCollection } from "../../utils/api";
import { UserContext } from "../../context/UserContext";
import CollectionCard from "./CollectionCard";
import MenuCollections from "../MenuCollections";
import UserProfile from "../UserProfile";
import ErrorPage from "../ErrorPage";
import { TiPlusOutline } from "react-icons/ti";
import TopButton from "../TopButton";
import Loading from "../Loading";
import "./Collections.css";

const ListCollections = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [listCollections, setListCollections] = useState([]);
  const [error, setError] = useState(null);
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const { userCx } = useContext(UserContext);
  //  const userCx ={
  //   email : "mariachaparro58@gmail.com",
  //  displayName: "Ada Lovelace"}

  useEffect(() => {
    const fetchData = async () => {
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
  }, [userCx?.email]);

  const handleAddCollection = async () => {
    if (!newCollectionTitle.trim()) return alert("Title cannot be empty!");
    if (isAddingCollection) return;

    const newCollection = {
      title: newCollectionTitle,
      user_mail: userCx.email,
      art_count: 0,
    };

    setIsAddingCollection(true);
    try {
      const addedCollection = await addCollection(newCollection);
      addedCollection.art_count = 0;
      setListCollections((currentCollections) => [
        addedCollection,
        ...currentCollections,
      ]);
      setNewCollectionTitle("");
    } catch (err) {
      setError(err);
    } finally {
      setIsAddingCollection(false);
    }
  };

   if (isLoading)
    return <Loading pageLoading="Loading Collections..." />;
  if (error && error.status !== 404)
    return <ErrorPage errorMsg={`Error: ${error.message}`} />;

  return (
    <>
      <nav className="topMenu">
        <UserProfile />
        <MenuCollections />
      </nav>
      <h2>Collections</h2>
      <p>
        <strong>
          Organize your private gallery by creating collections and adding your
          artwork.
        </strong>
      </p>

      {/** Add Collection Form */}
      <div className="collection-card2">
        <label className="label">
          Create a new collection
          <input
            type="text"
            className="collection-input"
            value={newCollectionTitle}
            onChange={(e) => setNewCollectionTitle(e.target.value)}
            placeholder="Title"
          />
        </label>
        <button
          aria-label="Create collection"
          className="btn-add-art"
          onClick={handleAddCollection}
          disabled={isAddingCollection}
        >
          <TiPlusOutline /> {isAddingCollection ? "Creating..." : "Create"}
        </button>
      </div>

      {/* Collection List */}
      {listCollections.length === 0 ? (
        <p>No collections created yet.</p>
      ) : (
        <ul className="collections-grid">
        
            {listCollections.map((collection) => (
              <CollectionCard
                key={collection.id_collection}
                collection={collection}
                setListCollections={setListCollections}
              />
            ))}
          
        </ul>
      )}
      <TopButton />
    </>
  );
};

export default ListCollections;
