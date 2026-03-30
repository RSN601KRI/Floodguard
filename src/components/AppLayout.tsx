import { Outlet } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import OnboardingDialog from './OnboardingDialog';

export default function AppLayout() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppNavbar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
      <OnboardingDialog />
    </div>
  );
}
