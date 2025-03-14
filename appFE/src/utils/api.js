import axios from "axios";

const curationAPI = axios.create({
  baseURL: `https://se-curator-be.onrender.com/api`,
});

export const getCollectionByUserMail = (user_mail) => {
  //console.log(user_mail);
  return curationAPI.get(`/collection/${user_mail}`).then(({ data }) => {
    return data.collections;
  });
  // // }).catch(err =>{
  // //     console.log(err)
  // //    return err;
  // // })
};

export const getCollections = () => {
  return curationAPI.get("/collection").then(({ data }) => {
    return data.collections;
  });
};

export const getCollectionById = (id) => {
  return curationAPI.get(`/collection/id/${id}`).then(({ data }) => {
    return data.collection;
  });
};

export const deleteCollection = (id) => {
  // console.log(id)
  return curationAPI.delete(`/collection/${id}`).then(() => {
    return "201";
  });
};

export const updateCollection = (id_collection, title) => {
  return curationAPI
    .patch(`/collection/${id_collection}`, title)
    .then(({ data }) => {
      return data.collection;
    });
};

export const addCollection = (newCollection) => {
  //  console.log(newCollection)
  return curationAPI.post(`/collection/`, newCollection).then(({ data }) => {
    return data.collection;
  });
};

export const getArtworksByCollection = (id) => {
  return curationAPI.get(`/artwork/collection/${id}`).then(({ data }) => {
    return data.artworks;
  });
};

export const addArtwork = (id, newArtwork) => {
  console.log(newArtwork)
  return curationAPI.post(`/artwork/${id}`, newArtwork).then(({ data }) => {
    return data.artwork;
  });
};

export const updateArtwork = (id_artwork, updatedArtwork) => {
  console.log(id_artwork, updatedArtwork)
  return curationAPI
    .patch(`/artwork/${id_artwork}`, updatedArtwork)
    .then(({ data }) => {
      return data.artwork;
    });
};

export const deleteArtwork = (id) => {
  return curationAPI.delete(`/artwork/${id}`).then(() => {
    return "201";
  });
}
