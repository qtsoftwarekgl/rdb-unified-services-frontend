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
      {children}
    </main>
  );
};

export default UserLayout;
