interface DividerProps {
  className?: string;
}

const Divider = ({ className }: DividerProps) => {
  return <div className={`h-[1px] bg-gray-300 my-4 ${className}`}></div>;
};

export default Divider;
