import { Outlet } from "react-router-dom";
import { useAppContext } from "../../appContext/AppContext";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Loader from "../../components/Loader";

const Layout = () => {
  const { isAdmin } = useAppContext();

  return isAdmin ? (
    <>
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 px-4 md:px-10 h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <>
      <Loader />
    </>
  );
};

export default Layout;
 