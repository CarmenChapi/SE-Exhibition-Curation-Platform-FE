import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoogleLogin from "./components/GoogleLogin";
import ListArworks from "./components/my_collections/ListArtworks";
import ErrorPage from "./components/ErrorPage";
import "./App.css";
import ArticData from "./components/art_galleries/ArticData";
import VAMData from "./components/art_galleries/VamData";
import HarvardData from "./components/art_galleries/HarvardData";
import EuropeanaData from "./components/art_galleries/EuropeanaData";
import RijksMData from "./components/art_galleries/RijksMData";
import SmithData from "./components/art_galleries/SmithsonianData";
import METData from "./components/art_galleries/MetData";
import ArticCard from "./components/art_galleries/ArticCard";
import Home from "./components/Home";
import ListApiArtGalleries from "./components/ListApiArts";
import EuropeanaCard from "./components/art_galleries/EuropeanaCard";
import HarvardCard from "./components/art_galleries/HarvardCard";
import MetCard from "./components/art_galleries/MetCard";
import RijksMCard from "./components/art_galleries/RijksMCard";
import VAMCard from "./components/art_galleries/VamCard";
import SmithsonianCard from "./components/art_galleries/SmithsonianCard";
import ListCollections from "./components/my_collections/ListCollections";
import AddToCollection from "./components/my_collections/AddToCollection";
import ArtworkDetail from "./components/my_collections/ArtworkDetail";
import AddToCollectionFromApi from "./components/art_galleries/AddToCollectionFromApi";
import Header from "./components/Header";


function App() {
  return (
    <>
     <Header />
      <Router>
        <Routes>
          <Route path="/" element={<GoogleLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/collections" element={<ListCollections />} />
          <Route path="/home/collections/:nameCollection/:collectionId" element={<ListArworks />} />
          <Route path="/home/collections/:nameCollection/:collectionId/add" element={<AddToCollection />} />
          <Route path="/home/collections/:nameCollection/:collectionId/artworks/:artworkId" element={<ArtworkDetail />} />
          <Route path="/home/artgalleries/" element={<ListApiArtGalleries/>} />
          <Route path="/home/artgallery/chicago" element={<ArticData/>} />
          <Route path="/home/artgallery/europeana" element={<EuropeanaData/>} />
          <Route path="/home/artgallery/harvard" element={<HarvardData/>} />
          <Route path="/home/artgallery/addToCollectionFromApi" element={<AddToCollectionFromApi/>} />
          <Route path="/home/artgallery/met" element={<METData/>} />
          <Route path="/home/artgallery/rijksmuseum" element={<RijksMData/>} />
          <Route path="/home/artgallery/smithsonian" element={<SmithData/>} />
          <Route path="/home/artgallery/vam" element={<VAMData/>} /> 
          <Route path="/home/artgallery/chicago/:artId" element={<ArticCard/>} />
          <Route path="/home/artgallery/europeana/:artId" element={<EuropeanaCard/>} />
          <Route path="/home/artgallery/harvard/:artId" element={<HarvardCard/>} />
          <Route path="/home/artgallery/met/:artId" element={<MetCard/>} />
          <Route path="/home/artgallery/rijksmuseum/:artId" element={<RijksMCard/>} />
          <Route path="/home/artgallery/vam/:artId" element={<VAMCard/>} />
          <Route path="/home/artgallery/smithsonian/:artId" element={<SmithsonianCard/>} />
          

        <Route path="*" element={<ErrorPage errorMsg={"404 Not Found Invalid URL"}/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
