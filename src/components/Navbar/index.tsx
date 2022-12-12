import Link from "@ui_palette/Link";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full py-8">
      <nav className="mx-auto flex justify-between px-4 md:max-w-full lg:max-w-screen-xl">
        <Link href="/" className="text-xl sm:text-2xl tracking-tighter focus:outline-none">
          <span className="bg-gradient-to-r from-pink-500 via-blue-500 to-purple-600 bg-clip-text font-extrabold text-transparent">
            CekOngkir.
          </span>
          <span className="font-normal">online</span>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
