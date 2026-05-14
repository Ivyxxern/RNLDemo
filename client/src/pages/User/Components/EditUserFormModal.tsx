import {
  useEffect,
  useState,
  type FC,
  type FormEvent,
} from "react"
import CloseButton from "../../../components/Button/CloseButton"
import SubmitButton from "../../../components/Button/SubmitButton"
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput"
import Modal from "../../../components/Modal"
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect"


import GenderService from "../../../services/GenderServices"
import UserService from "../../../services/UserService"
import type { UserColumns, UserFieldErrors } from "../../../interfaces/UserInterface"
import type { GenderColoumns } from "../../../interfaces/GenderInterface"
import UploadInput from "../../../components/Input/UploadInput"
import { toAbsoluteMediaUrl } from "../../../utils/mediaUrl"

interface EditUserFormModalProps {
  user: UserColumns | null
  onUserUpdated: (message: string) => void
  refreshKey?: () => void
  isOpen: boolean
  onClose: () => void
}

function toDateInputValue(raw: string | null | undefined): string {
  if (raw == null || raw === "") return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  const head = String(raw).slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(head) ? head : ""
}

const EditUserFormModal: FC<EditUserFormModalProps> = ({
  user,
  onUserUpdated,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [genders, setGenders] = useState<GenderColoumns[]>([]);

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [existingProfilePicture, setExistingProfilePicture] = useState<
  string | null>(null);
  const [editUserProfilePicture, setEditUserProfilePicture] =
    useState<File | null>(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<UserFieldErrors>({});

  const handleUpdateUser = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const formData = new FormData();

      if (editUserProfilePicture) {
        formData.append("edit_user_profile_picture", editUserProfilePicture);
      } else if(!existingProfilePicture) {
        formData.append("remove_profile_picture", "1");
      }

      formData.append("first_name", firstName);
      formData.append("middle_name", middleName || "");
      formData.append("last_name", lastName);
      formData.append("suffix_name", suffixName || "");
      formData.append("gender", gender);
      formData.append("birth_date", birthDate);
      formData.append("username", username);

      const res = await UserService.updateUser(user?.user_id!, formData);

      if (res.status === 200) {
        setEditUserProfilePicture(null);
        setFirstName(res.data.user.first_name);
        setMiddleName(res.data.user.middle_name ?? "");
        setLastName(res.data.user.last_name);
        setSuffixName(res.data.user.suffix_name ?? "");
        setGender(
          res.data.user.gender_id != null
            ? String(res.data.user.gender_id)
            : String(res.data.user.gender?.gender_id ?? "")
        );
        setBirthDate(toDateInputValue(res.data.user.birth_date));
        setUsername(res.data.user.username);
        setExistingProfilePicture(toAbsoluteMediaUrl(res.data.user.profile_picture));

        onUserUpdated(res.data.message);

        handleLoadGenders();
        refreshKey();
      } else {
        console.error("Unexpected status error occured during updating user: ", res.status);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Unexpected server error occured during updating user: ", error);
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleLoadGenders = async () => {
    try {
      setLoadingGenders(true);

      const res = await GenderService.loadGenders();

      if (res.status === 200) {
        setGenders(res.data.genders);
      } else {
        console.error("Unexpected status error  occured during loading genders: ",
          res.status
        );
      }
    } catch (error) {
      console.error('Unexpected server error occured during loading genders: ', error);
    } finally {
      setLoadingGenders(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadGenders();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setErrors({});
        setEditUserProfilePicture(null);
        setExistingProfilePicture(toAbsoluteMediaUrl(user.profile_picture ?? null));
        setFirstName(user.first_name);
        setMiddleName(user.middle_name ?? "");
        setLastName(user.last_name);
        setSuffixName(user.suffix_name ?? "");
        setGender(user.gender.gender_id.toString());
        setBirthDate(toDateInputValue(user.birth_date));
        setUsername(user.username);
      } else {
        console.log(
          "Unexpected user error occured during getting user details: ",
          user
        );
      }
    }
  }, [isOpen, user]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
        <form onSubmit={handleUpdateUser}>
          <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
            Edit User Form
          </h1>
          <div className="mb-4">
          <UploadInput
            label="Profile Picture"
            name="edit_user_profile_picture"
            value={editUserProfilePicture}
            onChange={setEditUserProfilePicture}
            onRemoveExistingImageUrl={() => setExistingProfilePicture(null)}
            existingImageUrl={existingProfilePicture}
            errors={errors.edit_user_profile_picture}
          />
          </div>
          <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
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
              </div>
              <div className="mb-4">
                <FloatingLabelInput
                  label="Middle Name"
                  type="text"
                  name="middle_name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  errors={errors.middle_name}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelInput
                  label="Last Name"
                  type="text"
                  name="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  errors={errors.last_name}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelInput
                  label="Suffix Name"
                  type="text"
                  name="suffix_name"
                  value={suffixName}
                  onChange={(e) => setSuffixName(e.target.value)}
                  errors={errors.suffix_name}
                />
              </div>
              <div className="mb-4">
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
            </div>

            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <FloatingLabelInput
                  label="Birth Date"
                  type="date"
                  name="birth_date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  errors={errors.birth_date}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelInput
                  label="Username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  errors={errors.username}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {!loadingUpdate && (
              <CloseButton label="Close" onClose={onClose} />
            )}
            <SubmitButton
              label="Update User"
              loading={loadingUpdate}
              loadingLabel="Updating User..."
            />
          </div>
        </form>
      </Modal>
    </>
  )
}

export default EditUserFormModal
