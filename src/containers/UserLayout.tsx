import { FC, ReactNode } from "react";
import Navbar from "./Navbar";
import UserSidebar from "./UserSidebar";
import { useSelector } from "react-redux";
import { RootState } from "../states/store";
import AdminSidebar from "./AdminSidebar";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: FC<UserLayoutProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <main className="relative">
      <Navbar />
      {user?.email?.includes("info@rdb") ? <AdminSidebar /> : <UserSidebar />}
      <section className="left-[17%] top-[10vh] absolute mx-auto flex w-[83%] items-center justify-center p-4">
        <section className="h-full mx-auto w-full max-w-[1500px]">
          {children}
        </section>
      </section>
    </main>
  );
};

export default UserLayout;
