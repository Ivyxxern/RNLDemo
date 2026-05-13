import { useEffect, useState, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Spinner from "../../../components/Spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import GenderService from "../../../services/GenderServices";

const DeleteGenderForm = () => {
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [gender, setGender] = useState("");

  const { gender_id } = useParams();
  const navigate = useNavigate();

  const handleGetGender = async (genderId: number) => {
    try {
      setLoadingGet(true);

      const res = await GenderService.getGender(genderId);

      if (res.status === 200 && res.data?.gender) {
        setGender(res.data.gender.gender ?? "");
      } else {
        console.error(
          "Unexpected status error occured during getting gender: ",
          res.status
        );
      }
    } catch (error: any) {
      console.error(
        "Unexpected server error occured during getting gender: ",
        error
      );
    } finally {
      setLoadingGet(false);
    }
  };

  useEffect(() => {
    const parsedGenderId = Number(gender_id);
    if (!gender_id || Number.isNaN(parsedGenderId)) {
      console.error(
        "Unexpected parameter error occured during getting gender: ",
        gender_id
      );
      return;
    }
    handleGetGender(parsedGenderId);
  }, [gender_id]);

  const handleDestroyGender = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoadingDestroy(true);
      const res = await GenderService.destroyGender(gender_id!);

      if (res.status === 200) {
        navigate("/genders", { state: { message: res.data.message } });
      } else {
        console.error(
          "Unexpected status error occured during deleting gender: ",
          res.status
        );
      }
    } catch (error: any) {
      console.error(
        "Unexpected server error occured during deleting gender: ",
        error
      );
    } finally {
      setLoadingDestroy(false);
    }
  };

  return (
    <>
      {loadingGet ? (
        <div className="flex justify-center items-center mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleDestroyGender}>
          <div className="mb-4">
            <FloatingLabelInput
              label="Gender"
              type="text"
              name="gender"
              value={gender}
              readOnly
            />
          </div>
          <div className="flex justify-end gap-2">
            {!loadingDestroy && <BackButton label="Back" path="/genders" />}
            <SubmitButton
              label="Delete Gender"
              newClassName="px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              loading={loadingDestroy}
              loadingLabel="Deleting Gender..."
              spinnerOnPrimary
            />
          </div>
        </form>
      )}
    </>
  );
};

export default DeleteGenderForm;