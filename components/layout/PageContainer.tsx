export default function PageContainer({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
