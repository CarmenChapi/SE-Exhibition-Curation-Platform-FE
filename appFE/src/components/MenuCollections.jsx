import { useNavigate } from "react-router-dom";

const MenuCollections = () => {
  const navigate = useNavigate();
  return (
    <div className="menuCollections">
     <button
          onClick={() => navigate("/home")}
          className="btn-menu"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/home/artgallery")}
          className="btn-menu"
        >
          Explore Art Galleries
        </button>
        <button
          onClick={() => navigate("/home/collection")}
          className="btn-menu"
        >
          My Collections
        </button>
    </div>
  );
};

export default MenuCollections;