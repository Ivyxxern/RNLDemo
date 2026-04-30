import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddGenderForm from "./components/AddGenderForm";
import GenderList from "./components/GenderList";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useRefresh } from "../../hooks/useRefresh";

const GenderMainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    message: toastMessage,
    isVisible: toastMessageInvisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false);

  const { refresh, handleRefresh } = useRefresh(false);

  useEffect(() => {
    document.title = "Gender Main Page";
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      showToastMessage(location.state.message)
      handleRefresh()
      window.history.replaceState({}, document.title);
    }
  }, [location.state, showToastMessage]);

  useEffect(() => {
    const msg = (
      location.state as { genderDeletedMessage?: string } | null
    )?.genderDeletedMessage;
    if (msg) {
      showToastMessage(msg);
      handleRefresh();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [
    location.state,
    location.pathname,
    navigate,
    showToastMessage,
    handleRefresh,
  ]);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isSuccess={toastMessageInvisible}
        onClose={closeToastMessage}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <AddGenderForm onGenderAdded={showToastMessage} refreshKey={handleRefresh} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <GenderList refreshKey={refresh} />
        </div>
      </div>
    </>
  );
};
export default GenderMainPage;