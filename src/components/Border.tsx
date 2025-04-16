export default function Border({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={` border-2 ${className} border-solid`}>{children}</div>
  );
}
