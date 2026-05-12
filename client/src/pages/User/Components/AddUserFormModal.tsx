import { useEffect, useState, type FC, type FormEvent } from "react"
import SubmitButton from "../../../components/Button/SubmitButton"
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput"
import Modal from "../../../components/Modal"
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect"
import CloseButton from "../../../components/Button/CloseButton"
import type { GenderColoumns } from "../../../interfaces/GenderColumns"
import GenderService from "../../../services/GenderServices"
import type { UserFieldErrors } from "../../../interfaces/UserFieldErrors"
import UserService from "../../../services/UserService"

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

  const handleStoreUser = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const payload = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        suffix_name: suffixName,
        gender: gender,
        birth_date: birthDate,
        username: username,
        password: password,
        password_confirmation: passwordConfirmation,
      };

      const res = await UserService.storeUser(payload);

      if (res.status === 200) {
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
        setErrors(error.response.data.errors);
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
        <form
          noValidate
          onSubmit={handleStoreUser}
          className="flex flex-col"
        >
          <header className="border-b border-gray-200 px-6 pb-4 pr-14 pt-1">
            <h1 className="text-xl font-bold text-gray-900">Add User Form</h1>
          </header>

          <div className="grid grid-cols-1 gap-x-10 gap-y-1 px-6 py-5 sm:grid-cols-2">
            <div className="space-y-4">
              <FloatingLabelInput
                label="First Name"
                type="text"
                name="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoFocus
                errors={errors.first_name}
              />
              <FloatingLabelInput
                label="Middle Name"
                type="text"
                name="middle_name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                errors={errors.middle_name}
              />
              <FloatingLabelInput
                label="Last Name"
                type="text"
                name="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                errors={errors.last_name}
              />
              <FloatingLabelInput
                label="Suffix Name"
                type="text"
                name="suffix_name"
                value={suffixName}
                onChange={(e) => setSuffixName(e.target.value)}
                errors={errors.suffix_name}
              />
              <FloatingLabelSelect
                label="Gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
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

            <div className="space-y-4">
              <FloatingLabelInput
                label="Birth Date"
                type="date"
                name="birth_date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                errors={errors.birth_date}
              />
              <FloatingLabelInput
                label="Username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                errors={errors.username}
              />
              <FloatingLabelInput
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                errors={errors.password}
              />
              <FloatingLabelInput
                label="Password Confirmation"
                type="password"
                name="password_confirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                errors={errors.password_confirmation}
              />
            </div>
          </div>

          <footer className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
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