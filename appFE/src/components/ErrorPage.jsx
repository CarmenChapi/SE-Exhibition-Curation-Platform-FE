import BackControl from "./BackControl";

const ErrorPage = ({ errorMsg }) => {
  return (
    <div className="error-wrapper">
      <BackControl />
      <div className="error-card">
        <h1 className="error-title">Oops — Something went wrong</h1>
        <p className="error-message">{errorMsg}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
