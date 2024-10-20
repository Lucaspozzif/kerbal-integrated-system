import { LocalHeader } from "../../components/local-header/local-header";

export function Home() {
  return (
    <LocalHeader
      buttons={[
        { title: "Create", onClick: () => {} },
        { title: "Edit", onClick: () => {} },
        { title: "Display", onClick: () => {} },
        { title: "Search", onClick: () => {} },
        { title: "Delete", onClick: () => {} },
      ]}
      text='Selected'
    />
  );
}
