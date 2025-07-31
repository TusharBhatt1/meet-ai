
"use client"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import logo from "@/public/logo.svg"
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import UserButton from "./user-button";


export default function DashboardSidebar() {
  const pathName = usePathname()


  const firstSection = [
    {
      icon: VideoIcon,
      label: "Meetings",
      href: "/meetings",
    },
    {
      icon: BotIcon,
      label: "Agents",
      href: "/agents",
    },
  ];

  const secondSection = [
    {
      icon: StarIcon,
      label: "Upgrade",
      href: "/upgrade",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center justify-left gap-4">
          <Image height={20} width={20} alt="Meet AI" className="size-14 rounded-full" src={logo} />
          <p className="font-extrabold text-lg">Meet.AI</p>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-4 p-2">
        <SidebarGroup>
        {firstSection.map(({ icon: Icon, label, href }) => (
          <SidebarMenuItem key={label} className="list-none">
            <SidebarMenuButton asChild>
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex items-center gap-2 text-sm px-2 py-1.5 rounded-md hover:bg-slate-400/20 transition",
                  pathName === href && "bg-slate-400/20"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
        {secondSection.map(({ icon: Icon, label, href }) => (
          <SidebarMenuItem key={label} className="list-none">
            <SidebarMenuButton asChild>
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex items-center gap-2 text-sm px-2 py-1.5 rounded-md hover:bg-slate-400/20 transition",
                  pathName === href && "bg-slate-400/20"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Separator/>
    <UserButton/>
      </SidebarFooter>
    </Sidebar>
  );
}
