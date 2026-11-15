import { useTheme } from '../../context/ThemeContext';
function SettingsPage() { const { theme, toggleTheme } = useTheme(); return <div className="page-block"><header className="page-header"><h2>Settings</h2></header><section className="panel"><h3>Appearance</h3><p>Choose the display theme for this browser.</p><button className="primary-button" type="button" onClick={toggleTheme}>Use {theme === 'light' ? 'dark' : 'light'} theme</button></section></div>; }

export default SettingsPage;
