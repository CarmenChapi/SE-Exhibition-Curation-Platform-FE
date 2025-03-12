import axios from "axios";

const curationAPI = axios.create({
  baseURL: `https://se-curator-be.onrender.com/api`,
});

export const getCollectionByUserMail = (user_mail) => {
  console.log(user_mail);
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

export const deleteCollecttion = (id) => {
  return curationAPI.delete(`/collection/${id}`).then(() => {
    return "201";
  });
};

// export const patchCommentVotes = (id, incVts) => {
//   const curationAPI = { inc_votes: incVts };
//   return curationAPI.patch(`/comments/${id}/`, bodyComment).then(({ data }) => {
//     return data.comments;
//   });
// };

// export const postComment = (id, body2, username2) => {
//   const curationAPI = { username: username2, body: body2 };
//   console.log(bodyComment, id);
//   return curationAPI
//     .post(`/articles/${id}/comments`, bodyComment)
//     .then(({ data }) => {
//       return data.comment;
//     });
// };

// export const deleteComment = (id) => {
//   return curationAPI.delete(`comments/${id}`).then(() => {
//     return "201";
//   });
// };

// export const getAllUsers = () => {
//   return curationAPI.get(`/users`).then(({ data }) => {
//     return data.users;
//   });
// };

// export const getArtworksByColId = (id) => {
//   return ncNews.get(`/topics`).then(({ data }) => {
//     return data.topics;
//   });
// };

// export const patchArticleVotes = (id, incVts) => {
//   const bodyArticle = { inc_votes: incVts };
//   return ncNews.patch(`/articles/${id}/`, bodyArticle).then(({ data }) => {
//     return data.article;
//   });
// };
