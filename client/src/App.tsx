import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    
<div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 9999 }}>
  <a href="/admin-capsules.html" style={{
    backgroundColor: '#00ff99',
    color: 'black',
    padding: '10px 20px',
    borderRadius: '10px',
    fontWeight: 'bold',
    textDecoration: 'none'
  }}>
    Admin
  </a>
</div>
<Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
