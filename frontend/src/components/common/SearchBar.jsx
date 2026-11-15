export default function SearchBar({ value, onChange, placeholder = 'Search', label = 'Search' }) {
  return <label className="search-field"><span className="sr-only">{label}</span><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}
