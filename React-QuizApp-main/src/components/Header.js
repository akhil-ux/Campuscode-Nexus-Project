import ReactLogo from "./React_logo1.png"; // Import the image
function Header() {
  return (
    <header className="app-header">
      <h1>CampusCode Nexus</h1>
      <h2>React Quiz</h2>
      <img src={ReactLogo} alt="Reactlogo" />
      
    </header>
  );
}

export default Header;
