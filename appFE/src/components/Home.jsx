import React from "react";
import MenuCollections from "./MenuCollections";
import IntroRandom from "./IntroRandom";
import Header from "./Header";
import UserProfile from "./UserProfile";

const Home = () => {

  return (
    <>
        <Header />
    
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
