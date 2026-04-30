import { useEffect, useState, type FC, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton"
import SubmitButton from "../../../components/Button/SubmitButton"
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput"
import type { GenderFieldErros } from "../../../interfaces/GenderFieldErrors";
import GenderService from "../../../services/GenderServices";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";

interface EditGenderFormProps {
  onGenderUpdated: (message: string) => void
}

const MIN_SAVING_MS = 450;

const EditGenderForm: FC<EditGenderFormProps> = ({ onGenderUpdated }) => {
  const [loadingGet, setloadingGet] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<GenderFieldErros>({});

  const { gender_id } = useParams()

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
    const startedAt = Date.now();
    try {
      if (!trimmedGender) {
        setErrors({ gender: ["The gender field is required."] });
        return;
      }

      if (!gender_id) {
        console.error("Missing gender ID.");
        return;
      }

      const res = await GenderService.updateGender(gender_id, { gender: trimmedGender });

      if (res.status >= 200 && res.status < 300) {
        setErrors({});
        onGenderUpdated(res.data?.message ?? "Gender Successfully Updated.");
      } else {
        console.error("Unexpected status error occurred during update gender: ", res.status);
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Unexpected server error occurred during update gender: ", error);
      }
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_SAVING_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_SAVING_MS - elapsed));
      }
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
            {!loadingUpdate && <BackButton label="Back" path="/" />}
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
