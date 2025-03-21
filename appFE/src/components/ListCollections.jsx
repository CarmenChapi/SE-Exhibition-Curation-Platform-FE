import { useEffect, useState, useContext } from "react";
import { getCollectionByUserMail, addCollection } from "../utils/api";
import { UserContext } from "../context/UserContext";
import CollectionCard from "./CollectionCard";
import BackControl from "./BackControl";
import MenuCollections from "./MenuCollections";
import Header from "./Header";
import UserProfile from "./UserProfile";

const ListCollections = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [listCollections, setListCollections] = useState([]);
  const [error, setError] = useState(null);
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const { userCx, setUserCx } = useContext(UserContext);
  // const userCx ={
  //   email : "mariachaparro58@gmail.com",
  //   displayName: "Mari del Car"}

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
      }
    };
  
    fetchData(); // Call the function
  }, [userCx?.email]); // Only re-run when user email changes
  

  const handleAddCollection = () => {
    if (!newCollectionTitle.trim()) return alert("Title cannot be empty!");

    const newCollection = {
      title: newCollectionTitle,
      user_mail: userCx.email,
    };

    addCollection(newCollection)
      .then((addedCollection) => {
        setListCollections([addedCollection, ...listCollections]);
        setNewCollectionTitle("");
      })
      .catch((err) => setError(err));
  };

  if (isLoading) return <h3 className="loading">...Loading User's Collections</h3>;
  if (error && error.status !== 404)
    return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <>
      <Header />
      <nav className="topMenu">
        <MenuCollections />
        <BackControl />
        <UserProfile/>
      </nav>
      <h2 className="collection-title">
        {userCx?.displayName.split(" ")[0]} 's Personal Art Collections:
      </h2>
      <p className="subtitle"><strong>
      Organize your private gallery by creating collections and adding your artwork.</strong>
      </p>

      {/* 🔹 Collection List */}
      {listCollections.length === 0 ? (
        <p>No collections created yet.</p>
      ) : (
        <ul>
          <div className="collection-list">
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

      {/* 🔹 Add new collection */}
      <div className="collection-card">
        <label>Create a new collection
        <input
          type="text"
          className="collection-input"
          value={newCollectionTitle}
          onChange={(e) => setNewCollectionTitle(e.target.value)}
          placeholder="Title"
        />
        </label>
        <button className="btn-add" onClick={handleAddCollection}>
          Add Collection
        </button>
      </div>
    </>
  );
};

export default ListCollections;
