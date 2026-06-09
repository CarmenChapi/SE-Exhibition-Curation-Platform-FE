import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoogleLogin from "./components/GoogleLogin";
import ListArworks from "./components/collections/ListArtworks";
import ErrorPage from "./components/ErrorPage";
import "./App.css";
import ArticData from "./components/artGalleries/ArticData";
import VAMData from "./components/artGalleries/VamData";
import HarvardData from "./components/artGalleries/HarvardData";
import EuropeanaData from "./components/artGalleries/EuropeanaData";
import RijksMData from "./components/artGalleries/RijksMData";
import SmithData from "./components/artGalleries/SmithsonianData";
import METData from "./components/artGalleries/MetData";
import ArticCard from "./components/artGalleries/ArticCard";
import Home from "./components/Home";
import ListApiArtGalleries from "./components/artGalleries/ListApiArts";
import EuropeanaCard from "./components/artGalleries/EuropeanaCard";
import HarvardCard from "./components/artGalleries/HarvardCard";
import MetCard from "./components/artGalleries/MetCard";
import RijksMCard from "./components/artGalleries/RijksMCard";
import VAMCard from "./components/artGalleries/VamCard";
import SmithsonianCard from "./components/artGalleries/SmithsonianCard";
import ListCollections from "./components/collections/ListCollections";
import AddToCollection from "./components/collections/AddToCollection";
import ArtworkDetail from "./components/collections/ArtworkDetail";
import AddToCollectionFromApi from "./components/artGalleries/AddToCollectionFromApi";
import Header from "./components/Header";
import UserLogin from "./components/UserLogin";


function App() {
  return (
    <>
     <Header />
      <Router>
        <Routes>
          <Route path="/" element={<UserLogin />} />
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
