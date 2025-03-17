import { useState } from "react";
import { updateCollection, deleteCollection } from "../utils/api";

import { useNavigate } from "react-router-dom";

const CollectionCard = ({ collection, setListCollections, listCollections }) => {
  const [editing, setEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(collection.title);
  const navigate = useNavigate();

  const handleUpdate = () => {
    if (!updatedTitle.trim()) return alert("Title cannot be empty!");

    updateCollection(collection.id_collection, { title: updatedTitle })
      .then((updatedCollection) => {
        setListCollections(
          listCollections.map((col) =>
            col.id_collection === updatedCollection.id ? updatedCollection : col
          )
        );
        setEditing(false);
      })
      .catch((err) => console.error("Error updating collection:", err));
  };

  const handleDelete = () => {
    deleteCollection(collection.id_collection)
      .then(() => {
        setListCollections(listCollections.filter((col) => col.id_collection !== collection.id_collection));
      })
      .catch((err) => console.error("Error deleting collection:", err));
  };

  const handleOpenCollection = () => {
    console.log(collection.id_collection)
    navigate(`/home/collection/${collection.id_collection}-${collection.title}`);
  }

  return (
    <li className="collection-card" onClick={handleOpenCollection}>
      {editing ? (
        <>
          <input
            className="collection-input"
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <button className="btn-save" onClick={handleUpdate}>Save</button>
          <button className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <div class="button-group">
            <span className="collection-title">{collection.title}</span>
          <button class="btn-edit" onClick={() => setEditing(true)}>Edit Name</button>
          <button class="btn-delete" onClick={handleDelete}>Delete Collection</button>
          <button class="btn-open" onClick={handleOpenCollection}>Open</button>
        </div>
      )}
    </li>
  );
};

export default CollectionCard;
