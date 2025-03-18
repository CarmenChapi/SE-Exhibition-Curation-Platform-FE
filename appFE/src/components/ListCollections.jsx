import { useEffect, useState, useContext } from "react";
import { getCollectionByUserMail, addCollection } from "../utils/api";
import { UserContext } from "../context/UserContext";
import CollectionCard from "./CollectionCard";
import BackControl from "./BackControl";
import MenuCollections from "./MenuCollections";

const ListCollections = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [listCollections, setListCollections] = useState([]);
  const [error, setError] = useState(null);
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const { userCx } = useContext(UserContext);

  useEffect(() => {
    if (userCx?.email) {
      fetchCollections();
    }
  }, [userCx]);

  const fetchCollections = () => {
    setIsLoading(true);
    getCollectionByUserMail(userCx.email)
      .then((collections) => {
        setListCollections(collections);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  };

  const handleAddCollection = () => {
    if (!newCollectionTitle.trim()) return alert("Title cannot be empty!");

    const newCollection = { title: newCollectionTitle, user_mail: userCx.email };

    addCollection(newCollection)
      .then((addedCollection) => {
        setListCollections([addedCollection, ...listCollections]);
        setNewCollectionTitle("");
      })
      .catch((err) => setError(err));
  };

  if (isLoading) return <h3 className="loading">...Loading</h3>;
  if (error && error.status !== 404) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div>
         <section className="topMenu"> 
       <MenuCollections/>
       <BackControl/>
       </section>
      <h2 className="collection-title">{userCx?.displayName.split(" ")[0]} 's Personal Art Collections:"</h2>

  

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
      <spam>Create a new art collection</spam>
        <input
          type="text"
          className="collection-input"
          value={newCollectionTitle}
          onChange={(e) => setNewCollectionTitle(e.target.value)}
          placeholder="New Collection Title"
        />
        <button className="btn-add" onClick={handleAddCollection}>Add New Collection</button>
      </div>


    </div>
  );
};

export default ListCollections;
