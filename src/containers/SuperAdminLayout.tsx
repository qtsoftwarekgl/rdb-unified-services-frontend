import { FC, ReactNode } from 'react';
import Navbar from './Navbar';
import SuperAdminSidebar from './SuperAdminSidebar';

interface SuperAdminLayout {
  children: ReactNode;
}

const SuperAdminLayout: FC<SuperAdminLayout> = ({ children }) => {
  return (
    <main className="relative">
      <Navbar />
      <SuperAdminSidebar />
      <section className="absolute left-[17%] top-[10vh] w-full h-full max-w-[83%] p-4">
        {children}
      </section>
    </main>
  );
};

export default SuperAdminLayout;
