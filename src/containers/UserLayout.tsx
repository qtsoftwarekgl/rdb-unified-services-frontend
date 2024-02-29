import { FC, ReactNode } from 'react';
import Navbar from './Navbar';
import UserSidebar from './UserSidebar';

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: FC<UserLayoutProps> = ({ children }) => {
  return (
    <main className="relative">
      <Navbar />
      <UserSidebar />
      <section className="absolute left-[17%] top-[10vh] w-full h-full max-w-[83%]">
        {children}
      </section>
    </main>
  );
};

export default UserLayout;
