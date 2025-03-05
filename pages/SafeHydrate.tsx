import { useEffect, useState } from "react";

export const SafeHydrate = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
    }, []);
  
    if (!mounted) {
      return null;
    }
  
    return (
      <div suppressHydrationWarning className="bg-[#fafaff] min-h-screen">
        {children}
      </div>
    );
  }