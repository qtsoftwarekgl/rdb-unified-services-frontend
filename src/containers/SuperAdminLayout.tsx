import { FC, ReactNode } from "react";
import Navbar from "./Navbar";
import SuperAdminSidebar from "./SuperAdminSidebar";

interface SuperAdminLayout {
    children: ReactNode;
  }
  
  const SuperAdminLayout: FC<SuperAdminLayout> = ({ children }) => {
    return (
      <main className="relative">
        <Navbar />
        <SuperAdminSidebar />
        {children}
      </main>
    );
  };

export default SuperAdminLayout;
