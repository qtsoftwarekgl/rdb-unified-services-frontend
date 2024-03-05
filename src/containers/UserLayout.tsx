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
      <section className="left-[17%] top-[10vh] absolute mx-auto flex w-[83%] items-center justify-center p-4">
        <section className="h-full mx-auto w-full max-w-[1500px]">
          {children}
        </section>
      </section>
    </main>
  );
};

export default UserLayout;
