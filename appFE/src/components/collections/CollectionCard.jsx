import { useState } from "react";
import { updateCollection, deleteCollection } from "../../utils/api";

import { useNavigate } from "react-router-dom";
import { RiEditLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import { TiPlusOutline } from "react-icons/ti";
import { VscFolderOpened } from "react-icons/vsc";
import CollectionPreview from "/src/assets/collectionPreview.png";
import "./Collections.css";

const CollectionCard = ({
  collection,
  setListCollections,
  onValidationError,
}) => {
  const [editing, setEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(collection.title);
  const [pendingAction, setPendingAction] = useState(null);
  const navigate = useNavigate();

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!updatedTitle.trim()) {
      onValidationError("Title cannot be empty!");
      return;
    }
    if (pendingAction) return;

    setPendingAction("saving");
    try {
      const updatedCollection = await updateCollection(
        collection.id_collection,
        {
          title: updatedTitle,
        },
      );
      setListCollections((currentCollections) =>
        currentCollections.map((col) =>
          col.id_collection === updatedCollection.id ? updatedCollection : col,
        ),
      );
      setEditing(false);
    } catch (err) {
      console.error("Error updating collection:", err);
    } finally {
      setPendingAction(null);
    }
  };

  const handleDelete = async () => {
    if (pendingAction) return;

    setPendingAction("deleting");
    try {
      await deleteCollection(collection.id_collection);
      setListCollections((currentCollections) =>
        currentCollections.filter(
          (col) => col.id_collection !== collection.id_collection,
        ),
      );
    } catch (err) {
      console.error("Error deleting collection:", err);
      setPendingAction(null);
    }
  };

  const handleOpenCollection = () => {
    navigate(
      `/home/collections/${collection.title}/${collection.id_collection}`,
    );
  };

  const handleAddCollection = () => {
    navigate(
      `/home/collections/${collection.title}/${collection.id_collection}/add`,
    );
  };

  return (
    <li className="collection-card">
      <p className="collection-title">{collection.title}</p>

      <img
        src={CollectionPreview}
        alt={`${collection.title} collection preview`}
        className="card-image"
      />
      {editing ? (
        <form onSubmit={handleUpdate}>
          <label>Edit title </label>
          <input
            className="collection-input"
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />

          <button
            aria-label="Save collection changes"
            className="btn-back"
            type="submit"
            disabled={Boolean(pendingAction)}
          >
            {pendingAction === "saving" ? "Saving..." : "Save"}
          </button>
          <button
            aria-label="Cancel editing collection"
            className="btn-back"
            type="button"
            disabled={Boolean(pendingAction)}
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="button-group">
          <button
            aria-label="Edit collection"
            className="btn-add-art"
            onClick={() => setEditing(true)}
          >
            <RiEditLine />
          </button>
          <button
            aria-label="Add artwork to collection"
            className="btn-add-art"
            onClick={handleAddCollection}
          >
            <TiPlusOutline />
          </button>
          {collection.art_count >= 1 ? (
            <button
              aria-label="Open collection"
              className="btn-add-art"
              onClick={handleOpenCollection}
            >
              <VscFolderOpened />
            </button>
          ) : null}
          <button
            aria-label="Delete collection"
            className="btn-add-art"
            disabled={Boolean(pendingAction)}
            onClick={handleDelete}
          >
            <AiOutlineDelete />{" "}
            {pendingAction === "deleting" ? "Deleting..." : ""}
          </button>
        </div>
      )}
    </li>
  );
};

export default CollectionCard;
