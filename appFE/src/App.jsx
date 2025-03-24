import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoogleLogin from "./components/GoogleLogin";
import ListArworks from "./components/ListArtworks"
import ErrorPage from "./components/ErrorPage";
import "./App.css";
import ArticData from "./components/ArticData";
import VAMData from "./components/VamData";
import HarvardData from "./components/HarvardData";
import EuropeanaData from "./components/EuropeanaData";
import RijksMData from "./components/RijksMData";
import SmithData from "./components/SmithsonianData";
import METData from "./components/MetData";
import ArticCard from "./components/ArticCard";
import Home from "./components/Home";
import ListApiArtGalleries from "./components/ListApiArts";
import EuropeanaCard from "./components/EuropeanaCard";
import HarvardCard from "./components/HarvardCard";
import MetCard from "./components/MetCard"
import RijksMCard from "./components/RijksMCard";
import VAMCard from "./components/VamCard";
import SmithsonianCard from "./components/SmithsonianCard";
import ListCollections from "./components/ListCollections";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/collection" element={<ListCollections />} />
          <Route path="/home/collection/:collectionId" element={<ListArworks />} />
          <Route path="/home/artgallery/" element={<ListApiArtGalleries/>} />
          <Route path="/home/artgallery/chicago" element={<ArticData/>} />
          <Route path="/home/artgallery/europeana" element={<EuropeanaData/>} />
          <Route path="/home/artgallery/harvard" element={<HarvardData/>} />
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
