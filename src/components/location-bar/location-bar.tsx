import "./location-bar.css";

type LocationBarType = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function LocationBar({ placeholder, value, onChange }: LocationBarType) {
  return (
    <form className='location-bar'>
      <label className='lb-label'>Location:</label>
      <input className='lb-input' placeholder={placeholder} value={value} onChange={onChange} />
    </form>
  );
}
