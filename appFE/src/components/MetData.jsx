import React, { useEffect, useState } from "react";


const METData = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchArtworks = async () => {
        try {
          const idsResponse = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/search?q=painting&hasImages=true");
          const idsData = await idsResponse.json();
          const objectIDs = idsData.objectIDs.slice(0, 10); // Get 10 artworks
  
          const artworkPromises = objectIDs.map(async (id) => {
            const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
            return response.json();
          });
  
          const artworks = await Promise.all(artworkPromises);
          const artworksWithImages = artworks.filter((art) => art.primaryImage);
  
          setArtworks(artworksWithImages);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching artworks:", error);
        }
      };
  
      fetchArtworks();
    }, []);
  
    if (loading) return <p>Loading...</p>;
  
    return (
    
       <ul>
       <p>MET Museum</p>
        {artworks.map((art) => (
       <li key={art.objectID}>{art.title}
       <img src={art.primaryImage}/>
       </li>
     ))}
   </ul>
    );
  };


export default METData;
