import { useEffect, useState, useContext } from "react";
import { getCollectionByUserMail, addCollection } from "../utils/api";
import { UserContext } from "../context/UserContext";
import CollectionCard from "./CollectionCard";
import BackControl from "./BackControl";
import MenuCollections from "./MenuCollections";
import Header from "./Header";
import UserProfile from "./UserProfile";
import ErrorPage from "./ErrorPage";
import { TiPlusOutline } from "react-icons/ti";
import Footer from "./Footer";

const ListCollections = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [listCollections, setListCollections] = useState([]);
  const [error, setError] = useState(null);
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const { userCx, setUserCx } = useContext(UserContext);
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

  const handleAddCollection = () => {
    if (!newCollectionTitle.trim()) return alert("Title cannot be empty!");

    const newCollection = {
      title: newCollectionTitle,
      user_mail: userCx.email,
      art_count: 0,
    };

    addCollection(newCollection)
      .then((addedCollection) => {
        addedCollection.art_count = 0;
        setListCollections([addedCollection, ...listCollections]);
        setNewCollectionTitle("");
      })
      .catch((err) => setError(err));
  };

  if (isLoading)
    return <h3 className="loading">Loading User Collections...</h3>;
  if (error && error.status !== 404)
    return <ErrorPage errorMsg={`Error: ${error.message}`} />;

  return (
    <>
      <Header />
      <nav className="topMenu">
        <UserProfile />
        <MenuCollections />
      </nav>
      <h2>{userCx?.displayName.split(" ")[0]} 's Art Collections:</h2>
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
        <button className="btn-add-art" onClick={handleAddCollection}>
          <TiPlusOutline />
        </button>
      </div>

      {/* Collection List */}
      {listCollections.length === 0 ? (
        <p>No collections created yet.</p>
      ) : (
        <ul>
          <div className="collections-grid">
            {listCollections.map((collection) => (
              <CollectionCard
                key={collection.id_collection}
                collection={collection}
                setListCollections={setListCollections}
                listCollections={listCollections}
              />
            ))}
          </div>
        </ul>
      )}
      <Footer/>
    </>
  );
};

export default ListCollections;
