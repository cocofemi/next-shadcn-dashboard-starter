'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { navItems, storenavItems, steps } from '@/constants/data';
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  GalleryVerticalEnd,
  LogOut
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import Cookies from 'universal-cookie';
import { CurrentUserContextType } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import Joyride from 'react-joyride';
import { getStoreListing } from '@/utils/store';

export const company = {
  name: 'Mehchant',
  logo: GalleryVerticalEnd,
  plan: 'Store-Admin'
};

export default function AppSidebar() {
  const [runTour, setRunTour] = React.useState(false);
  const { user } = React.useContext(UserContext) as CurrentUserContextType;
  const { data: session } = useSession();
  const router = useRouter();
  const cookies = new Cookies();
  const pathname = usePathname();

  const handleLogout = () => {
    cookies.remove('user', { path: '/' });
    router.push('/');
  };

  React.useEffect(() => {
    const hasSeenTour = localStorage.getItem('storeTourCompleted');
    if (user?.token) {
      getStoreListing(user?.storeId, 1, 5).then((res) => {
        if (user?.role === 'store') {
          if (res?.data.length === 0 && !hasSeenTour) {
            const timer = setTimeout(() => {
              setRunTour(true);
            }, 500);
            return () => clearTimeout(timer);
          }
        }
      });
    }
  }, [user]);

  const handleTourEnd = () => {
    setRunTour(false);
    localStorage.setItem('storeTourCompleted', 'true');
  };

  return (
    <>
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        callback={(data) => {
          const { status } = data;
          if (['finished', 'skipped'].includes(status)) handleTourEnd();
        }}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#0984E3', // Accent color (buttons, highlights)
            backgroundColor: '#ffffff', // Tooltip background
            textColor: '#1e293b', // Neutral dark text
            arrowColor: '#ffffff', // Match tooltip background
            overlayColor: 'rgba(0, 0, 0, 0.4)' // Dark transparent mask
          },
          tooltip: {
            borderRadius: 12,
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            padding: '16px 20px',
            fontSize: 14,
            lineHeight: 1.5
          },
          tooltipContent: {
            fontWeight: 500,
            color: '#1e293b'
          },
          buttonNext: {
            backgroundColor: '#0984E3',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 6,
            padding: '6px 14px'
          },
          buttonBack: {
            marginRight: 8,
            color: '#64748b',
            fontWeight: 500,
            background: 'transparent'
          },
          buttonSkip: {
            color: '#64748b',
            fontSize: 13,
            background: 'transparent'
          },
          tooltipTitle: {
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 6
          }
        }}
      />

      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex gap-2 py-2 text-sidebar-accent-foreground">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <company.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{company.name}</span>
              <span className="truncate text-xs">{company.plan}</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="overflow-x-hidden">
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarMenu>
              {user.role === 'admin' ? (
                <>
                  {navItems.map((item) => {
                    const Icon = item.icon ? Icons[item.icon] : Icons.logo;
                    return item?.items && item?.items?.length > 0 ? (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={pathname === item.url}
                            >
                              {item.icon && <Icon />}
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === subItem.url}
                                  >
                                    <Link href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    ) : (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={pathname === item.url}
                        >
                          <Link href={item.url}>
                            <Icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </>
              ) : (
                <>
                  {storenavItems.map((item) => {
                    const Icon = item.icon ? Icons[item.icon] : Icons.logo;
                    return item?.items && item?.items?.length > 0 ? (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem
                          className={`sidebar-icon-${item.icon}`}
                        >
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={pathname === item.url}
                            >
                              {item.icon && <Icon />}
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === subItem.url}
                                  >
                                    <Link href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    ) : (
                      <SidebarMenuItem
                        key={item.title}
                        className={`sidebar-icon-${item.icon}`}
                      >
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={pathname === item.url}
                        >
                          <Link href={item.url}>
                            <Icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </>
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      {/* <AvatarImage
                      src={session?.user?.image || ''}
                      alt={session?.user?.name || ''}
                    /> */}
                      <AvatarFallback className="rounded-lg">
                        {user?.firstName?.slice(0, 2)?.toUpperCase() || 'CN'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.firstName || ''}
                      </span>
                      <span className="truncate text-xs">
                        {session?.user?.email || ''}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={session?.user?.image || ''}
                          alt={session?.user?.name || ''}
                        />
                        <AvatarFallback className="rounded-lg">
                          {session?.user?.name?.slice(0, 2)?.toUpperCase() ||
                            'CN'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.firstName || ''}
                        </span>
                        <span className="truncate text-xs">
                          {' '}
                          {user?.email || ''}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/profile')}
                    >
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem> */}
                    {/* <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem> */}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
