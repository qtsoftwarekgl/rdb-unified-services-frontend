import { FC, ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="relative">
      <Navbar />
      <Sidebar />
      {children}
    </main>
  );
};

export default Layout;
