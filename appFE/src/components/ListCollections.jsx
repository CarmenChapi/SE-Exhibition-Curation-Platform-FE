import { useEffect, useState, useContext } from "react";
import { getCollectionByUserMail, addCollection } from "../utils/api";
import { UserContext } from "../context/UserContext";
import CollectionCard from "./CollectionCard";

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
        setListCollections([...listCollections, addedCollection]);
        setNewCollectionTitle("");
      })
      .catch((err) => setError(err));
  };

  if (isLoading) return <h3 className="loading">...Loading</h3>;
  if (error && error.status !== 404) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div>
      <h2>My Art Collections</h2>

      {/* 🔹 Add new collection */}
      <div>
        <input
          type="text"
          value={newCollectionTitle}
          onChange={(e) => setNewCollectionTitle(e.target.value)}
          placeholder="New Collection Title"
        />
        <button onClick={handleAddCollection}>Add</button>
      </div>

      {/* 🔹 Collection List */}
      {listCollections.length === 0 ? (
        <p>No collections found.</p>
      ) : (
        <ul>
          {listCollections.map((collection) => (
            <CollectionCard
              key={collection.id_collection}
              collection={collection}
              setListCollections={setListCollections}
              listCollections={listCollections}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListCollections;
