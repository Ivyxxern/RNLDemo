import { useEffect, useState, type FC, type FormEvent } from "react"
import SubmitButton from "../../../components/Button/SubmitButton"
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput"
import Modal from "../../../components/Modal"
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect"
import CloseButton from "../../../components/Button/CloseButton"

import GenderService from "../../../services/GenderServices"
import UserService from "../../../services/UserService"
import type { UserFieldErrors } from "../../../interfaces/UserInterface"
import type { GenderColoumns } from "../../../interfaces/GenderInterface"
import UploadInput from "../../../components/Input/UploadInput"

interface AddUserFormModalProps {
  onUserAdded: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean
  onClose: () => void;
}

const AddUserFormModal: FC<AddUserFormModalProps> = ({
  onUserAdded,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [genders, setGenders] = useState<GenderColoumns[]>([]);

  const [loadingStore, setLoadingStore] = useState(false);
  const [addUserProfilePicture, setAddUserProfilePicture] = useState<File | null>(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<UserFieldErrors>({});

  const clearFieldError = (key: keyof UserFieldErrors) => {
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleStoreUser = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const formData = new FormData();

      if (addUserProfilePicture) {
        formData.append("add_user_profile_picture", addUserProfilePicture);
      }

      formData.append("first_name", firstName);
      formData.append("middle_name", middleName || "");
      formData.append("last_name", lastName);
      formData.append("suffix_name", suffixName || "");
      formData.append("gender", gender);
      formData.append("birth_date", birthDate);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("password_confirmation", passwordConfirmation);

      const res = await UserService.storeUser(formData);

      if (res.status === 200) {
        setAddUserProfilePicture(null);
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setSuffixName("");
        setGender("");
        setBirthDate("");
        setUsername("");
        setPassword("");
        setPasswordConfirmation("");
        setErrors({});

        onUserAdded(res.data.message);

        handleLoadGenders();
        refreshKey();
      } else {
        console.error(
          "Unexpected status error occurred during adding user: ",
          res.status
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors as UserFieldErrors);
      } else {
        console.log(
          "Unexpected server error occurred during adding user: ",
          error
        );
      }
    } finally {
      setLoadingStore(false);
    }
  };

  const handleLoadGenders = async () => {
    const loadingStart = Date.now();
    const minimumLoadingTimeMs = 500;

    try {
      setLoadingGenders(true)

      const res = await GenderService.loadGenders()

      if (res.status === 200) {
        setGenders(res.data.genders)
      } else {
        console.error('Unexpected status error  occured during loading genders: ', res.status)
      }
    } catch (error) {
      console.error('Unexpected server error occured during loading genders', error)
    } finally {
      const elapsedMs = Date.now() - loadingStart;
      if (elapsedMs < minimumLoadingTimeMs) {
        await new Promise((resolve) => setTimeout(resolve, minimumLoadingTimeMs - elapsedMs));
      }
      setLoadingGenders(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      handleLoadGenders();
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showCloseButton
        bodyClassName="p-0"
      >
        <form onSubmit={handleStoreUser} noValidate>
          <h1 className="border-b border-gray-100 px-6 pb-5 pe-14 pt-6 text-2xl font-semibold">
            Add User Form
          </h1>
          <div className="mb-6 px-6 pt-5">
            <UploadInput
              label="Profile Picture"
              name="add_user_profile_picture"
              value={addUserProfilePicture}
              onChange={(file) => {
                setAddUserProfilePicture(file);
                clearFieldError("add_user_profile_picture");
              }}
              errors={errors.add_user_profile_picture}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-5 px-6 pb-8 pt-0">
            <div className="col-span-2 space-y-5 md:col-span-1">
              <FloatingLabelInput
                label="First Name"
                type="text"
                name="first_name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  clearFieldError("first_name");
                }}
                required
                autoFocus
                errors={errors.first_name}
              />
              <FloatingLabelInput
                label="Middle Name"
                type="text"
                name="middle_name"
                value={middleName}
                onChange={(e) => {
                  setMiddleName(e.target.value);
                  clearFieldError("middle_name");
                }}
                errors={errors.middle_name}
              />
              <FloatingLabelInput
                label="Last Name"
                type="text"
                name="last_name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  clearFieldError("last_name");
                }}
                required
                errors={errors.last_name}
              />
              <FloatingLabelInput
                label="Suffix Name"
                type="text"
                name="suffix_name"
                value={suffixName}
                onChange={(e) => {
                  setSuffixName(e.target.value);
                  clearFieldError("suffix_name");
                }}
                errors={errors.suffix_name}
              />
              <FloatingLabelSelect
                label="Gender"
                name="gender"
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  clearFieldError("gender");
                }}
                errors={errors.gender}
                required
              >
                {loadingGenders ? (
                  <option value="">Loading...</option>
                ) : (
                  <>
                    <option value="">Select Gender</option>
                    {genders.map((g, index) => (
                      <option value={g.gender_id} key={index}>
                        {g.gender}
                      </option>
                    ))}
                  </>
                )}
              </FloatingLabelSelect>
            </div>

            <div className="col-span-2 space-y-5 md:col-span-1">
              <FloatingLabelInput
                label="Birth Date"
                type="date"
                name="birth_date"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  clearFieldError("birth_date");
                }}
                required
                errors={errors.birth_date}
              />
              <FloatingLabelInput
                label="Username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearFieldError("username");
                }}
                required
                errors={errors.username}
              />
              <FloatingLabelInput
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                  clearFieldError("password_confirmation");
                }}
                required
                errors={errors.password}
              />
              <FloatingLabelInput
                label="Password Confirmation"
                type="password"
                name="password_confirmation"
                value={passwordConfirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                  clearFieldError("password_confirmation");
                }}
                required
                errors={errors.password_confirmation}
              />
            </div>
          </div>

          <footer className="flex justify-end gap-3 border-t border-gray-100 px-6 py-5">
            <CloseButton
              label="Close"
              onClose={onClose}
              className={
                loadingStore ? "pointer-events-none opacity-50" : undefined
              }
            />
            <SubmitButton
              label="Save User"
              loading={loadingStore}
              loadingLabel="Saving User..."
              spinnerOnPrimary
            />
          </footer>
        </form>
      </Modal>
    </>
  )
}

export default AddUserFormModal