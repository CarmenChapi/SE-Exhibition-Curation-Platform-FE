import { getCollectionByUserMail } from "../utils/api";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

const CollectionsUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [listCollections, setListCollections] = useState([]);
  const [error, setError] = useState(null);
  const [isEmptyInputError, setIsInputEmptyError] = useState(null);
  const [isEmptyCollectionsList, setIsEmptyCollectionsList] = useState(true);
  const [errorPosting, setErrorPosting] = useState(false);
  const { userCx, setUserCx } = useContext(UserContext);

  useEffect(() => {
    //const {email} = userCx;
    //console.log(userCx, email);
    console.log("userCx:", userCx);
    console.log("userCx.email:", userCx.email);
    getCollectionByUserMail(userCx.email)
      .then((collection) => {
        console.log(collection);
        setListCollections(collection);
        setIsLoading(false);
        setIsEmptyCollectionsList(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
        setIsLoading(false);
        setIsEmptyCollectionsList(true);
        console.log("Error getting collection", err.message);
      });
  }, []);
  if (isLoading) {
    return (
      <div>
        <h3 className="loading">...Loading</h3>
      </div>
    );
  }

  return (
    <ul>
      <p>My personal collections</p>
      {listCollections.map((art, index) => (
        <li key={index}>{art.title}</li>
      ))}
    </ul>
  );
};

export default CollectionsUser;
