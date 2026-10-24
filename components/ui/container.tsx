type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
  id?: string;
};

/**
 * Centered page column with consistent horizontal padding.
 */
export function Container({ children, className = "", as: Tag = "div", id }: ContainerProps) {
  return (
    <Tag id={id} className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </Tag>
  );
}
