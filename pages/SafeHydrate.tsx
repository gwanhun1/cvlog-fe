export const SafeHydrate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div suppressHydrationWarning className="bg-[#fafaff] min-h-screen">
      {typeof window === 'undefined' ? children : children}
    </div>
  );
};
export default SafeHydrate;
