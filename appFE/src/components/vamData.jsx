import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchVAMData = async () => {
  const { data } = await axios.get(`https://api.vam.ac.uk/v2/objects/search?q=%22painting%22&images_exist=true`);

  return data;
};

const VAMData = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["vam"],
    queryFn: fetchVAMData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
 
    <ul>
        <p>Victoria and Albert Museum</p>
         {data.records.map((art) => (
        <li key={art.systemNumber}>{art._primaryTitle}
        <img src={`https://framemark.vam.ac.uk/collections/${art._primaryImageId}/full/843,/0/default.jpg`}/>
        </li>
      ))}
    </ul>
  );
};

export default VAMData;
