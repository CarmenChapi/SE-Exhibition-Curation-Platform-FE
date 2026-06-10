import { useNavigate } from "react-router-dom";
import { IoCaretBack } from "react-icons/io5";

const BackControl = () => {
    const navigate = useNavigate();
    const handleBack = () => {
        // if (window.history.length > 2) {
          navigate(-1);
        // } else {
        //   navigate("/home");
        // }
      };
return(
<button aria-label="Go back" onClick={handleBack} className="btn-back">
<IoCaretBack /> Cancel
</button>
)
}

export default BackControl
