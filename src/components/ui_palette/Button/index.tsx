import { type ReactNode } from "react";

type ButtonProps = {
  onClick?: () => void;
  children: ReactNode;
};

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-black px-3 py-2 text-white sm:text-sm md:text-base"
    >
      {children}
    </button>
  );
};

export default Button;
