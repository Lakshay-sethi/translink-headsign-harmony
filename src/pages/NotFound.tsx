
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4">
      <div className="glass-panel p-12 rounded-xl text-center max-w-md animate-fade-in">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30">
          <span className="text-3xl">404</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-3">Page not found</h1>
        
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <Button className="bg-translink-blue hover:bg-translink-blue/90 transition-all hover:scale-[1.02]">
            <HomeIcon className="mr-2 h-4 w-4" /> Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
