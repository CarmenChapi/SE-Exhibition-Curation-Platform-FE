import { useNavigate } from "react-router-dom";


const BackControl = () => {
    const navigate = useNavigate();

return(
<button 
onClick={() => navigate(-1)}
className="btn-back"
>
⬅ Back
</button>
)
}

export default BackControl