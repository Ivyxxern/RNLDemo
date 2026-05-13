import { useEffect, useState, type FC, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton"
import SubmitButton from "../../../components/Button/SubmitButton"
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput"

import GenderService from "../../../services/GenderServices";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import type { GenderFieldErrors } from "../../../interfaces/GenderInterface";


interface EditGenderFormProps {
  onGenderUpdated: (message: string, failed?: boolean) => void
}

const EditGenderForm: FC<EditGenderFormProps> = ({ onGenderUpdated }) => {
  const [loadingGet, setloadingGet] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<GenderFieldErrors>({});

  const { gender_id } = useParams()
  const navigate = useNavigate();

  const handleGetGender = async (genderId: number) => {
    try {
      setloadingGet(true);

      const res = await GenderService.getGender(genderId)

      if (res.status === 200) {
        setErrors({})
        setGender(res.data.gender.gender)
      } else {
        console.error('Unexpected status error occured during getting gender: ', res.status)
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors)
      } else {
        console.error('Unexpected server error occured during getting gender: ', error)
      }
    } finally {
      setloadingGet(false)
    }
  }

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

  const handleUpdateGender = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedGender = gender.trim();

    setLoadingUpdate(true);
    try {
      if (!trimmedGender) {
        setErrors({ gender: ["The gender field is required."] });
        return;
      }

      if (!gender_id) {
        console.error("Missing gender ID.");
        setErrors({ gender: ["Missing gender id in URL."] });
        onGenderUpdated("Missing gender id in URL.", true);
        return;
      }

      const res = await GenderService.updateGender(gender_id, { gender: trimmedGender });

      if (res.status >= 200 && res.status < 300) {
        setErrors({});
        const successMessage =
          res.data?.message ?? "Gender Successfully Updated.";

        // Show feedback immediately on the edit page too (in case navigation/refresh state is cleared).
        onGenderUpdated(successMessage, false);

        // Go back so the list refreshes and the user sees the change.
        navigate("/genders", { state: { message: successMessage } });
      } else {
        console.error("Unexpected status error occurred during update gender: ", res.status);
        setErrors({ gender: ["Update failed. Please try again."] });
        onGenderUpdated("Update failed. Please try again.", true);
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        onGenderUpdated("Please fix the validation errors.", true);
      } else {
        console.error("Unexpected server error occurred during update gender: ", error);
        setErrors({
          gender: [
            error?.response?.data?.message ??
            "Update failed. Please try again.",
          ],
        });
        onGenderUpdated(
          error?.response?.data?.message ??
          "Update failed. Please try again.",
          true
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <>
      {loadingGet ? (
        <div className="flex justify-center items-center mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleUpdateGender}>
          <div className="mb-4">
            <FloatingLabelInput
              label="Gender"
              type="text"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              errors={errors.gender}
              required
              autoFocus
              disabled={loadingUpdate}
            />
          </div>
          <div className="flex justify-end gap-2">
            {!loadingUpdate && <BackButton label="Back" path="/genders" />}
            <SubmitButton
              label="Update Gender"
              loading={loadingUpdate}
              loadingLabel="Updating Gender..."
              spinnerOnPrimary
            />
          </div>
        </form>
      )}
    </>
  )
}

export default EditGenderForm 
