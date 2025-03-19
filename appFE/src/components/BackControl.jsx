import { useNavigate } from "react-router-dom";


const BackControl = () => {
    const navigate = useNavigate();
    const handleBack = () => {
        if (window.history.length > 2) {
          navigate(-1); 
        } else {
          navigate("/home"); 
        }
      };
return(
<button  onClick={handleBack} className="btn-back">
⬅ Back
</button>
)
}

export default BackControl