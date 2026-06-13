import { AiFillCaretUp } from "react-icons/ai";

const TopButton = () => {
  function handleClic() {
    window.scrollTo(0, 0);
  }

  return (
    <div className="TopButton">
      <button
        aria-label="Scroll to top"
        onClick={handleClic}
        className="btn-back"
      >
        <AiFillCaretUp />
      </button>
    </div>
  );
};

export default TopButton;
