import { useState } from "react";
import { updateCollection, deleteCollection } from "../utils/api";

import { useNavigate } from "react-router-dom";
import { RiEditLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import { TiPlusOutline } from "react-icons/ti";
import { VscFolderOpened } from "react-icons/vsc";
import CollectionPreview from "/src/assets/collectionPreview.png";

const CollectionCard = ({
  collection,
  setListCollections,
  listCollections,
}) => {
  // console.log(collection);
  const [editing, setEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(collection.title);
  const navigate = useNavigate();

  const handleUpdate = () => {
    if (!updatedTitle.trim()) return alert("Title cannot be empty!");

    updateCollection(collection.id_collection, { title: updatedTitle })
      .then((updatedCollection) => {
        setListCollections(
          listCollections.map((col) =>
            col.id_collection === updatedCollection.id
              ? updatedCollection
              : col,
          ),
        );
        setEditing(false);
      })
      .catch((err) => console.error("Error updating collection:", err));
  };

  const handleDelete = () => {
    deleteCollection(collection.id_collection)
      .then(() => {
        setListCollections(
          listCollections.filter(
            (col) => col.id_collection !== collection.id_collection,
          ),
        );
      })
      .catch((err) => console.error("Error deleting collection:", err));
  };

  const handleOpenCollection = () => {
    console.log("open" ,collection.id_collection);
    navigate(
      `/home/collections/${collection.title}/${collection.id_collection}`,
    );
  };

    const handleAddCollection = () => {
    //console.log(collection.id_collection);
    navigate(
      `/home/collections/${collection.title}/${collection.id_collection}/add`,
    );
  };

  return (
    <li className="collection-card">
      <p className="collection-title">{collection.title}</p>

      <img
        src={CollectionPreview}
        alt="Collection preview"
        className="card-image"
      />
      {editing ? (
        <form>
          <label>
            Edit title    </label>
            <input
              className="collection-input"
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
      
          <button aria-label="Save collection changes" className="btn-back" onClick={handleUpdate}>
            Save
          </button>
          <button aria-label="Cancel editing collection" className="btn-back" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div className="button-group">
          <button aria-label="Edit collection" className="btn-add-art" onClick={() => setEditing(true)}>
            <RiEditLine />
          </button>
          <button aria-label="Add artwork to collection" className="btn-add-art" onClick={handleAddCollection}>
            <TiPlusOutline />
          </button>
            {collection.art_count >= 1 ?
                <button aria-label="Open collection" className="btn-add-art" onClick={handleOpenCollection}>
            <VscFolderOpened /></button> : null}
          <button aria-label="Delete collection" className="btn-add-art" onClick={handleDelete}>
            <AiOutlineDelete />
          </button>
        </div>
      )}
    </li>
  );
};

export default CollectionCard;
//         /** `Manage ${collection.art_count} artwork${collection.art_count > 1 ? "s" : ""}`}**/
