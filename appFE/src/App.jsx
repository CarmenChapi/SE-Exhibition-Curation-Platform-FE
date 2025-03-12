import { useState } from "react";
import GoogleLogin from "./components/GoogleLogin";
import "./App.css";
import ArticData from "./components/ArticData";
import VAMData from "./components/VamData";
import HarvardData from "./components/HarvardData";
import EuropeanaData from "./components/EuropeanaData";
import RijksMData from "./components/RijksMData";
import SmithData from "./components/SmithsonianData";
import METData from "./components/MetData";
import CollectionsUser from "./components/CollectionsByUser";
import ArtCollection from "./components/ArtCollection";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";

function App() {
  return (
    <>
      <h1>Exhibition Curation Platform</h1>
      <Router>
        <Routes>
          <Route path="/" element={<GoogleLogin />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
