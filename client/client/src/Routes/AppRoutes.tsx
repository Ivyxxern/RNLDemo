import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import GenderMainPageMainPage from "../pages/Gender/GenderMainPage";
import EditGenderPage from "../pages/Gender/EditGenderPage";
import DeleteGenderPage from "../pages/Gender/DeleteGenderPage";
import UserMainPage from "../pages/User/UserMainPage";



const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route index element={<GenderMainPageMainPage />} />
                    <Route path="/gender/edit" element={<EditGenderPage />} />
                    <Route path="/gender/delete" element={<DeleteGenderPage />} />
                    <Route path="/users" element={<UserMainPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default AppRoutes