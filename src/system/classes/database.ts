import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export class Database {
  private name: string;
  private data: {
    [id: string]: string;
  };

  constructor(data?: any) {
    if (!data) return;
    this.populate(data);
  }

  public get(attribute: "name" | "data") {
    return (this as any)[attribute];
  }

  public set(
    attribute: "name" | "data",
    newValue: any,
    setter?: React.Dispatch<React.SetStateAction<Database>>
  ) {
    (this as any)[attribute] = newValue;
    if (setter) setter(new Database(this.getAll()));
  }

  private getAll() {
    return {
      name: this.name,
      data: this.data,
    };
  }

  private populate(data: any) {
    this.name = data.name;
    this.data = data.data;
  }

  public async download(name?: string) {
    const downloadId = name || this.name;
    if (!downloadId) return;

    const docRef = doc(db, "databases", name);
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    this.populate(docSnap.data());
    this.name = docSnap.id;
  }

  public async upload() {
    console.log(this)
    if (this.name == "") return;

    const docRef = doc(db, "databases", this.name);
    await setDoc(docRef, this.getAll());
  }

  public async generateId() {
    const docRef = doc(db, "config/idCounters");
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    const data = docSnap.data();
    if (!data[`db-${this.name}`]) {
      data[`db-${this.name}`] = "00";
    }
    const updatedId = (parseInt(data[`db-${this.name}`]) + 1)
      .toString()
      .padStart(2, "0");

    data[`db-${this.name}`] = updatedId;
    await setDoc(docRef, data);

    return updatedId;
  }
}
