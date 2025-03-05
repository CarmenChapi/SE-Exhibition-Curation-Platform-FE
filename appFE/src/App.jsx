import { useState } from 'react'
import GoogleLogin from "./googleLogin";
import './App.css'
import ArticData from './components/articData';
import VAMData from './components/vamData';
import HarvardData from './components/harvardData';
import EuropeanaData from './components/europeanaData';
import RijksMData from './components/rijksMData';
import SmithData from './components/smithsonianData';
import METData from './components/metData';

function App() {

  return (
    <>
    
    <div>
      <h1>SE Curator</h1>
      <GoogleLogin />
      <METData/>
       <ArticData/> 
       <VAMData/> 
        <HarvardData/> 
      <EuropeanaData/> 
        <RijksMData/> 
      <SmithData/> 
    </div>
  
      
    </>
  )
}

export default App
