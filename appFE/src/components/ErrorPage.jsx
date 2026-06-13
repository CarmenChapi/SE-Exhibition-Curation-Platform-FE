import BackControl from "./BackControl";
import { IoAlertCircleOutline, IoCaretBack } from "react-icons/io5";

const ErrorPage = ({ errorMsg, onDismiss }) => {
  const isValidationError = Boolean(onDismiss);

  return (
    <main className="error-wrapper" role="alert" aria-live="assertive">
      <div
        className={`error-card ${isValidationError ? "error-card-warning" : ""}`}
      >
        <span className="error-icon" aria-hidden="true">
          <IoAlertCircleOutline />
        </span>
        <p className="error-eyebrow">
          {isValidationError
            ? "Form needs your attention"
            : "Something went wrong"}
        </p>
        <p className="error-message">{errorMsg}</p>
        <p className="error-help">Please go back and try again.</p>
        <div className="error-actions">
          {isValidationError ? (
            <button type="button" className="error-action" onClick={onDismiss}>
              <IoCaretBack /> Return to form
            </button>
          ) : (
            <BackControl />
          )}
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
