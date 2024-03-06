import { FC, ReactNode } from 'react';
import Navbar from './Navbar';
import SuperAdminSidebar from './SuperAdminSidebar';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

const SuperAdminLayout: FC<SuperAdminLayoutProps> = ({ children }) => {
  return (
    <main className="relative">
      <Navbar />
      <SuperAdminSidebar />
      <section className="left-[17%] top-[10vh] absolute mx-auto flex w-[83%] items-center justify-center p-4">
      <section className="h-full mx-auto w-full max-w-[1500px]">
        {children}
        </section>
      </section>
    </main>
  );
};

export default SuperAdminLayout;
