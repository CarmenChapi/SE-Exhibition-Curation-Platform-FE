import { useState, useEffect } from "react";
import { getCollectionByUserMail } from "../utils/api";

const CollectionDropdown = ({ onSave }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [listCollections, setListCollections] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState("");

  
  const userCx = {
    email: "mariachaparro58@gmail.com",
    displayName: "Mari del Car",
  };

  useEffect(() => {
    if (userCx?.email) {
      fetchCollections();
    }
  }, []);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const collections = await getCollectionByUserMail(userCx.email);
      setListCollections(collections);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (selectedCollection) {
      onSave(selectedCollection);
    } else {
      alert("Please select a collection.");
    }
  };

  return (
    <div className="collection-dropdown">
      <h3>Choose a Collection</h3>

      {isLoading ? (
        <p>Loading collections...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          <option value="">-- Select a Collection --</option>
          {listCollections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.title}
            </option>
          ))}
        </select>
      )}

      <button onClick={handleSave} disabled={!selectedCollection}>
        Save Artwork
      </button>
    </div>
  );
};

export default CollectionDropdown;


// const handleSaveArtwork = (collectionId) => {
//     console.log("Artwork saved to collection:", collectionId);
//     // Here, implement the logic to save the artwork in the selected collection
//   };

//   <CollectionDropdown onSave={handleSaveArtwork}/>;