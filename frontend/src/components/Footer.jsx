import { FiGithub, FiMail, FiHeart } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <span className="brand-icon">◈</span>
                    <span>Shodeep</span>
                </div>
                <p className="footer-text">
                    Built with <FiHeart className="heart-icon" /> Premium Ecommerce Experience
                </p>
                <div className="footer-links">
                    <a href="mailto:support@shodeep.com" className="footer-link">
                        <FiMail /> support@shodeep.com
                    </a>
                </div>
                <p className="footer-copyright">© 2026 Shodeep. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
