import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* sem offset no mobile (sidebar oculta), 64px no md+, 224px no xl */}
      <div className="flex-1 pl-0 md:pl-16 xl:pl-56 pb-16 md:pb-0">{children}</div>
      <BottomNav />
    </div>
  );
}
