import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeFork, faStar } from "@fortawesome/free-solid-svg-icons";

function Header({ theme }) {
  const [repoData, setRepoData] = useState({ stars: 0, forks: 0 });

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const response = await fetch("https://api.github.com/repos/FreeOps-Tools/LogIQ");
        const data = await response.json();
        setRepoData({
          stars: data.stargazers_count || 0,
          forks: data.forks_count || 0,
        });
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      }
    };

    fetchRepoData();
  }, []);

  return (
    <header className="header">
      <a href="/">
        <img src="/logiq.svg" alt="Vite logo" width={50} height={50} style={{ padding: "10px" }} />
      </a>
      <h1 className={`logo ${theme}`}>LogIQ</h1>
      <nav>
        <ul>
          <li>
            <FontAwesomeIcon
              icon={faStar}
              style={{ color: "#DAAA3F", marginRight: "5px" }}
            />
            {repoData.stars}
          </li>
          <li>
            <FontAwesomeIcon
              icon={faCodeFork}
              style={{ color: "#768390", marginRight: "5px" }}
            />
            {repoData.forks}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
