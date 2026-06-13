import { useNavigate } from "react-router-dom";
import { IoCaretBack } from "react-icons/io5";

const BackControl = () => {
    const navigate = useNavigate();
    const handleBack = () => {

          navigate(-1);



      };
return(
<button aria-label="Go back" onClick={handleBack} className="btn-back">
<IoCaretBack />
</button>
)
}

export default BackControl
