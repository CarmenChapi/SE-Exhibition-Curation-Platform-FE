import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import HomeImg from "/src/assets/Home.png"
import ArtGalleriesImg from "/src/assets/ArtGalleries.png"
import CollectionImg from "/src/assets/MyCollections.png"

const MenuCollections = () => {
  const navigate = useNavigate();
  return (
   <div className="mainMenu">
  <Link to="/home" className="link-menu">
    <img src={HomeImg} alt="Home" className="menu-img"/>
  </Link>
  
  <Link to="/home/artgallery" className="link-menu">
    <img src={
      ArtGalleriesImg
    } className="menu-img" alt="Explore Art Galleries" />
  </Link>
  
  <Link to="/home/collection" className="link-menu">
    <img src={CollectionImg} alt="My Collections"  className="menu-img" />
  </Link>
</div>
  );
};

export default MenuCollections;