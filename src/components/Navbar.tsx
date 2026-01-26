"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    LayoutDashboard,
    PlusCircle,
    ClipboardList,
    Users,
    Menu,
    LogOut,
    Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string;
    } | null;
}

const NAV_ITEMS = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard, roles: null }, // visible to all
    { href: "/events/new", label: "New Event", icon: PlusCircle, roles: ["PRESIDENT"] },
    { href: "/events", label: "All Events", icon: ClipboardList, roles: null }, // visible to all
    { href: "/approvals", label: "Approvals", icon: Users, roles: ["VP_CLUBS", "ADMIN", "SENIOR_ADMIN"] },
];

export function Navbar({ user }: NavbarProps) {
    const pathname = usePathname();
    const userRole = user?.role;

    // Filter nav items based on user role
    const visibleNavItems = NAV_ITEMS.filter(item => {
        if (!item.roles) return true; // visible to all
        if (!userRole) return false; // hide role-restricted items if not logged in
        return item.roles.includes(userRole);
    });

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                            E
                        </div>
                        <span className="hidden sm:inline-block font-semibold text-lg">
                            Event Dashboard
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {visibleNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={pathname === item.href ? "default" : "ghost"}
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 gap-2 px-2"
                                >
                                    <span className="hidden sm:inline-block text-sm font-medium">
                                        Welcome, {user.name?.split(" ")[0] || "User"}
                                    </span>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.image || ""} alt={user.name || ""} />
                                        <AvatarFallback>
                                            {user.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                        {user.role && (
                                            <p className="text-xs text-blue-600">{user.role}</p>
                                        )}
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/api/auth/signout" className="text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign Out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button>Sign In</Button>
                        </Link>
                    )}

                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64">
                            <nav className="flex flex-col gap-2 mt-8">
                                {visibleNavItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <Button
                                                variant={pathname === item.href ? "default" : "ghost"}
                                                className="w-full justify-start gap-2"
                                            >
                                                <Icon className="h-4 w-4" />
                                                {item.label}
                                            </Button>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
