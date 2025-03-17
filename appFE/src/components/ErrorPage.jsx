import BackControl from "./BackControl";

const ErrorPage = ({ errorMsg }) => {
  return (
    <section className="error">
      <BackControl />
      <h1 className="errorTitle">{errorMsg}</h1>{" "}
    </section>
  );
};

export default ErrorPage;
