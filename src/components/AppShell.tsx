import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* offset para não sobrepor a sidebar: 64px (w-16) no mobile, 224px (w-56) no xl */}
      <div className="flex-1 pl-16 xl:pl-56">{children}</div>
    </div>
  );
}
