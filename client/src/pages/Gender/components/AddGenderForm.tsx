import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import GenderService from "../../../services/GenderServices";
import type { GenderFieldErrors } from "../../../interfaces/GenderInterface";



interface AddGenderFormProps {
  onGenderAdded: (message: string) => void;
  refreshKey: () => void
}

const MIN_SAVING_MS = 450;

const AddGenderForm: FC<AddGenderFormProps> = ({ onGenderAdded, refreshKey }) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<GenderFieldErrors>({});

  const handleStoreGender = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedGender = gender.trim();

    setLoadingStore(true);
    const startedAt = Date.now();
    try {
      if (!trimmedGender) {
        setErrors({ gender: ["The gender field is required."] });
        return;
      }

      const res = await GenderService.storeGender({ gender: trimmedGender });

      if (res.status >= 200 && res.status < 300) {
        setGender("");
        setErrors({});

        onGenderAdded(res.data?.message ?? "Gender Successfully Saved.");
        refreshKey()
      } else {
        console.error("Unexpected error occured during store gender: ", res.data);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected Server error occured during store gender: ",
          error
        );
      }
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_SAVING_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_SAVING_MS - elapsed));
      }
      setLoadingStore(false);
    }
  };

  const handleGenderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value);
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: undefined }));
    }
  };

  return (
    <form className="w-full" onSubmit={handleStoreGender} noValidate>
      <div className="mb-4">
        <FloatingLabelInput
          label="Gender"
          type="text"
          name="gender"
          value={gender}
          onChange={handleGenderChange}
          required
          autoFocus
          disabled={loadingStore}
          errors={errors.gender}
        />
      </div>
      <div className="flex justify-end">
        <SubmitButton
          label="Save Gender"
          loading={loadingStore}
          loadingLabel="Saving Gender..."
          spinnerOnPrimary
        />
      </div>
    </form>
  );
};

export default AddGenderForm;