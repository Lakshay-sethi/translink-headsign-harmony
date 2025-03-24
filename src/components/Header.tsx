
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("w-full py-6 px-8", className)}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-translink-blue rounded-lg flex items-center justify-center shadow-md">
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold leading-none tracking-tight">TransLink Headsign</h1>
            <p className="text-sm text-muted-foreground">Route Verification Tool</p>
          </div>
        </div>
        <a 
          href="https://www.translink.ca/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Powered by TransLink GTFS Data
        </a>
      </div>
    </header>
  );
};

export default Header;
