import { type ReactNode } from "react";

type ButtonProps = {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  id?: string;
  name?: string;
  ariaLabel?: string;
};

const Button = ({
  onClick,
  children,
  className,
  id,
  name,
  ariaLabel,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${
        className ? className : ""
      } rounded-lg bg-black px-3 py-2 text-white focus:outline-none sm:text-sm md:text-base hover:bg-purple-600 transition-all duration-300`}
      id={id}
      name={name}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default Button;
