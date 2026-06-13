import Logo from "/src/assets/logo.png";
const Header = () => {
  return (
    <section className="header">
      <img src={Logo} alt="Logo" className="logo" />
    </section>
  );
};

export default Header;
