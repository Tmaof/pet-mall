import { FC } from 'react';
import { footerLinks } from './constants';
import './index.scss';

const Footer: FC = () => {
  return (
    <footer className="index-footer">
      <div className="footer-content">
        <div className="footer-links">
          {footerLinks.map(section => (
            <div key={section.title} className="link-section">
              <h3 className="section-title">{section.title}</h3>
              <ul className="link-list">
                {section.links.map(link => (
                  <li key={link.text}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} Mall. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
