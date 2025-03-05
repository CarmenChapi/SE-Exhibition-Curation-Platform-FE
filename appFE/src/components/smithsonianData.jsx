

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiKeySmith = import.meta.env.VITE_API_KEY_SMITHSONIAN;


const fetchSmithData = async () => {
  const { data } = await axios.get(`https://api.si.edu/openaccess/api/v1.0/search?q=art&api_key=${apiKeySmith}&rows=20&fq=online_media_type:image`);
  //console.log(data)
  console.log(apiKeySmith)

  return data;
};

const SmithData = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["smith"],
    queryFn: fetchSmithData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
 
    <ul>
 
        <p>Smithsonian Institution</p>
         {data.response.rows.map((art) => (
        <li key={art.id}>{art.title}
        <img src={art.content.descriptiveNonRepeating.online_media?.media[0]?.content}/>
        </li>
      ))}
    </ul>
  );
};

export default SmithData;
