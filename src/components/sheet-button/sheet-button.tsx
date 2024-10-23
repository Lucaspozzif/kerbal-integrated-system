import "./sheet-button.css";

type SheetButtonType = {
  src: string;
  onClick: () => void;
};

export function SheetButton({ src, onClick }: SheetButtonType) {
  return (
    <div className={`sheet-button`} onClick={onClick}>
      <img className={`sb-image`} src={src} />
    </div>
  );
}
