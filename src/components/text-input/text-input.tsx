import "./text-input.css";

type TextInputType = {
  readOnly?: boolean;
  size: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TextInput({ readOnly = false, size, value, onChange }: TextInputType) {
  return <input className={`text-input ${readOnly ? "" : "editable"} size${size}`} type='text' value={value} readOnly={readOnly} onChange={onChange} />;
}
