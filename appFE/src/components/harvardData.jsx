import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const apikeyHarvard = import.meta.env.VITE_API_KEY_HARVARD;

const fetchHarvardData = async () => {
  const { data } = await axios.get(`http://api.harvardartmuseums.org/object?apikey=${apikeyHarvard}&hasimage=1&size=10&sort=random&fields=id,title,primaryimageurl,people,dated`);

  return data;
};

const HarvardData = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["harvard"],
    queryFn: fetchHarvardData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
 
    <ul>
        <p>Harvard Museum</p>
         {data.records.map((art) => (
        <li key={art.id}>{art.title}
        <img src={ art.primaryimageurl}/>
        </li>
      ))}
    </ul>
  );
};

export default HarvardData;
