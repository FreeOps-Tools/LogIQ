import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeFork, faStar } from "@fortawesome/free-solid-svg-icons";

function Header({ theme }) {
  return (
    <header className="header">
      <a href="/">
        <img src="/logiq.svg" alt="Vite logo" width={50} height={50} style={{padding: "10px"}}/>
      </a>
      <h1 className={`logo ${theme}`} >LogIQ</h1>
      <nav>
        <ul>
          <li>
            <FontAwesomeIcon
              icon={faStar}
              style={{ color: "#DAAA3F", marginRight: "5px" }}
            />
            9
          </li>
          <li>
            <FontAwesomeIcon
              icon={faCodeFork}
              style={{ color: "#768390", marginRight: "5px" }}
            />
            8
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
