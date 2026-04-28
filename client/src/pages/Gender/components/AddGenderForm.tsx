import SubmitButton from "../../../components/Button/SubmitButton"
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput"

const AddGender = () => {
  return (
    <form className="w-full">
      <div className="mb-4">
        <FloatingLabelInput label="Gender" type="text" name="gender" />
      </div>
      <div className="flex-justify-end">

      </div>
      <div>
        <SubmitButton
          label="Save Gender"
          className="px-4 py-2 text-xs font-semibold rounded-md shadow-sm"
        />
      </div>
    </form>
  )
}

export default AddGender