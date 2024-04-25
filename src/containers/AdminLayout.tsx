import { FC, ReactNode } from "react";
import Navbar from "./Navbar";
import AdminSidebar from "./AdminSidebar";
import SuperAdminSidebar from "./SuperAdminSidebar";
import { useSelector } from "react-redux";
import { RootState } from "../states/store";

interface AdminLayout {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayout> = ({ children }) => {
  // STATE VARIABLES
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <main className="relative">
      <Navbar />
      {user?.email?.includes("info") ? <AdminSidebar /> : <SuperAdminSidebar />}
      <section className="left-[17%] top-[10vh] absolute mx-auto flex w-[83%] items-center justify-center p-4">
        <section className="h-full mx-auto w-full max-w-[1500px]">
          {children}
        </section>
      </section>
    </main>
  );
};

export default AdminLayout;
