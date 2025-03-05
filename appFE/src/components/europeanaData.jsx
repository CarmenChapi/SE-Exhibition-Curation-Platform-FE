import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const apiKeyEuro = import.meta.env.VITE_API_KEY_EUROPEANA;


const fetchEuroData = async () => {
  const { data } = await axios.get(`https://api.europeana.eu/record/v2/search.json?wskey=${apiKeyEuro}&query=painting&media=true&qf=TYPE:IMAGE&rows=20`);
  return data;
};

const EuropeanaData = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["euro"],
    queryFn: fetchEuroData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
 
    <ul>
        <p>Europeana</p>
         {data.items.map((art) => (
        <li key={art.id}>{art.title[0]}
        <img src={ art.edmIsShownBy[0]}/>
        </li>
      ))}
    </ul>
  );
};

export default EuropeanaData;
