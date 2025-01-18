import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faGithub } from '@fortawesome/free-brands-svg-icons'; // Import the appropriate icons

function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Copyright © {year} LogIQ</p>
        <ul className="social-links">
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faTwitter} /> Twitter
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faFacebook} /> Facebook
            </a>
          </li>
          <li>
            <a href="https://github.com/FreeOps-Tools/LogIQ/">
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
