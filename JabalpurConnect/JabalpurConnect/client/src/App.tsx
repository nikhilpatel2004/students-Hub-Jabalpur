import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import Rooms from "./pages/rooms";
import Tiffin from "./pages/tiffin";
import Messages from "./pages/messages";
import Profile from "./pages/profile";
import Auth from "./pages/auth";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/rooms" component={Rooms} />
          <Route path="/tiffin" component={Tiffin} />
          <Route path="/messages" component={Messages} />
          <Route path="/profile" component={Profile} />
          <Route path="/auth" component={Auth} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
