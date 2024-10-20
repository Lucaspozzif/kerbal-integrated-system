import "./text-button.css";

export type TextButtonType = {
  spaced?: boolean;
  selected?: boolean;
  long?: boolean;
  title: string;
  onClick: () => void;
};

export function TextButton({ spaced = false, selected = false, long = false, title, onClick }: TextButtonType) {
  return (
    <div className={`text-button ${selected ? "selected" : ""} ${spaced ? "spaced" : ""} ${long ? "long" : ""}`} onClick={onClick}>
      <p className='tb-title'>{title}</p>
    </div>
  );
}
