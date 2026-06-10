import loading from "../assets/loading.gif";
const Loading = ({ pageLoading }) => {
  return (
    <div className="loading-wrapper" role="status" aria-live="polite">
      <div className="loading-card">
        <img src={loading} alt="" className="loading-image" />
        <p className="loading-message">{pageLoading || "Loading..."}</p>
      </div>
    </div>
  );
};

export default Loading;
