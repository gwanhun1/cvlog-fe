import React from 'react';

export const SafeHydrate = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div suppressHydrationWarning className="bg-[#fafaff] min-h-screen">
      {mounted ? children : null}
    </div>
  );
};
export default SafeHydrate;
