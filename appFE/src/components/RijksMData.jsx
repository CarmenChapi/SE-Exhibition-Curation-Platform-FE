import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const apikeyRM = import.meta.env.VITE_API_KEY_RIJKS;

const fetchRijksMData = async () => {
  const { data } = await axios.get(`https://www.rijksmuseum.nl/api/en/collection?key=${apikeyRM}`);

  return data;
};

const RijksMData = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["rijksm"],
    queryFn: fetchRijksMData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
 
    <ul>
        <p>RijksM Museum</p>
         {data.artObjects.map((art) => (
        <li key={art.id}>{art.title}
        <img src={ art.webImage.url}/>
        </li>
      ))}
    </ul>
  );
};

export default RijksMData;
