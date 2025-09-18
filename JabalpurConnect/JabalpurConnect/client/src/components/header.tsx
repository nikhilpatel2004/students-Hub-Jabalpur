import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Menu, Bell, MessageCircle, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/rooms", label: "Find Rooms", icon: "🏠" },
    { href: "/tiffin", label: "Tiffin Services", icon: "🍽️" },
    { href: "/", label: "Post Requirement", hash: "#post-requirement", icon: "📝" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" data-testid="logo">
            <GraduationCap className="text-2xl text-primary mr-2 w-8 h-8" />
            <span className="text-xl font-bold text-foreground">Student Hub Jabalpur</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.hash ? `${item.href}${item.hash}` : item.href}
                className={`transition-colors ${
                  isActiveLink(item.href)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hidden md:flex"
                  data-testid="button-notifications"
                >
                  <Bell className="w-5 h-5" />
                </Button>

                {/* Messages */}
                <Link href="/messages">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hidden md:flex"
                    data-testid="button-messages"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-1" data-testid="button-user-menu">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.profileImage || ""} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        <Badge variant="secondary" className="w-fit">
                          {user.userType === "student" ? "Student" : 
                           user.userType === "room_owner" ? "Room Owner" : "Tiffin Provider"}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" data-testid="menu-profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/messages" data-testid="menu-messages">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Messages
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} data-testid="menu-sign-out">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-sign-in">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.hash ? `${item.href}${item.hash}` : item.href}
                      className={`text-lg transition-colors ${
                        isActiveLink(item.href)
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                  
                  {user && (
                    <>
                      <hr className="my-4" />
                      <Link
                        href="/profile"
                        className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                        data-testid="mobile-nav-profile"
                      >
                        <User className="w-5 h-5 mr-3 inline" />
                        Profile
                      </Link>
                      <Link
                        href="/messages"
                        className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                        data-testid="mobile-nav-messages"
                      >
                        <MessageCircle className="w-5 h-5 mr-3 inline" />
                        Messages
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-lg text-muted-foreground hover:text-foreground transition-colors text-left"
                        data-testid="mobile-nav-sign-out"
                      >
                        <LogOut className="w-5 h-5 mr-3 inline" />
                        Sign Out
                      </button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
