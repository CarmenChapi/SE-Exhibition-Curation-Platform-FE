import { Link } from "react-router-dom";
import HomeImg from "/src/assets/Home.png"
import ArtGalleriesImg from "/src/assets/ArtGalleries.png"
import CollectionImg from "/src/assets/MyCollections.png"

const MenuCollections = () => {
  return (
   <div className="mainMenu">
  <Link to="/home" className="link-menu">
    <img src={HomeImg} alt="Home" className="menu-img"/>
  </Link>

  <Link to="/home/artgalleries" className="link-menu">
    <img src={
      ArtGalleriesImg
    } className="menu-img" alt="Explore Art Galleries" />
  </Link>

  <Link to="/home/collections" className="link-menu">
    <img src={CollectionImg} alt="My Collections"  className="menu-img" />
  </Link>
</div>
  );
};

export default MenuCollections;
