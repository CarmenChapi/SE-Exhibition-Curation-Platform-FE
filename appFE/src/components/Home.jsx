import React from "react";
import MenuCollections from "./MenuCollections";
import IntroRandom from "./IntroRandom";
import UserProfile from "./UserProfile";

const Home = () => {

  return (
    <>
    
      <nav>
      <UserProfile/>
      <MenuCollections />
      </nav>
      <main>
      <IntroRandom />
      </main>
    </>
  );
};

export default Home;
