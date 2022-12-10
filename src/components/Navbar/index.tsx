import Link from "@ui_palette/Link";

const Navbar = () => {
  return (
    <header className="w-full py-8">
      <nav className="mx-auto flex justify-between px-6 sm:max-w-xl md:max-w-full lg:max-w-screen-xl">
        <Link href="/" className="text-2xl spacing tracking-tighter">
          <span className="bg-gradient-to-r from-pink-500 via-blue-500 to-purple-600 bg-clip-text font-black text-transparent">
            CekOngkir.
          </span>
          <span className="font-normal">online</span>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
