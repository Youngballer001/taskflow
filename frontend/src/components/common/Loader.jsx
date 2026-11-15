import Spinner from './Spinner';
export default function Loader({ label = 'Loading', fullPage = false }) {
  return <div className={fullPage ? 'loader loader-full' : 'loader'} role="status"><Spinner /><span>{label}</span></div>;
}
