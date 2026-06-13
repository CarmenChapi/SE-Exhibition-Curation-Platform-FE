import axios from "axios";

const curationAPI = axios.create({
  baseURL: `https://se-curator-be.onrender.com/api`,
});

export const getCollectionByUserMail = (user_mail) => {
  return curationAPI.get(`/collection/${user_mail}`).then(({ data }) => {
    return data.collections;
  });
};

export const deleteCollection = (id) => {
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
  return curationAPI.post(`/artwork/${id}`, newArtwork).then(({ data }) => {
    return data.artwork;
  });
};

export const updateArtwork = (id_artwork, updatedArtwork) => {
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
};

export const getArtworkByIdArtwork = (id) => {
  return curationAPI.get(`/artwork/${id}`).then(({ data }) => {
    return data.artwork[0];
  });
};
