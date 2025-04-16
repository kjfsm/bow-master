export default function Border({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={` border-4 ${className} m-4 border-dashed`}>{children}</div>
  );
}
