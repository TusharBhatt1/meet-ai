import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardNavbar from "@/modules/dashboard/dashboard-navbar";
import AppSidebar from "@/modules/dashboard/dashboard-sidebar";
import { TRPCReactProvider } from "@/trpc/client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="bg-muted w-full">
          <div className="flex items-center p-2 bg-background border-b">
            <SidebarTrigger />
            <DashboardNavbar />
          </div>
          <div className="p-3 md:p-7">{children}</div>
        </main>
      </SidebarProvider>
    </TRPCReactProvider>
  );
}
