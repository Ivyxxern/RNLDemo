import { useEffect } from "react";
import AddGenderForm from "./components/AddGenderForm";
import GenderList from "./components/GenderList";

const MainPage = () => {
  useEffect(() => {
    document.title = 'Gender Main Page';
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <AddGenderForm />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <GenderList />
        </div>
      </div>
    </div>
  );
};

export default MainPage