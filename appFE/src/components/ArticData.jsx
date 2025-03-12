import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchArticData = async () => {
  const { data } = await axios.get(`https://api.artic.edu/api/v1/artworks?query[term][is_public_domain]=true&query[term][has_images]=true&fields=id,title,image_id,artist_display&limit=10`);

  return data;
};

const ArticData = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["artic"],
    queryFn: fetchArticData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
 
    <ul>
        <p>Art Institute of Chicago</p>
         {data.data.map((art) => (
        <li key={art.id}>{art.title}
        <img src={`https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`}/>
        </li>
      ))}
    </ul>
  );
};

export default ArticData;
