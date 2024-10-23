import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

class Database {
  private name: string;
  private data: {
    [id: string]: string;
  };

  constructor() {}

  private populate(data: any) {
    this.name = data.name;
    this.data = data;
  }

  public async download(name?: string) {
    const downloadName = name || this.name;
    if (!downloadName) return;

    const docRef = doc(db, "databases", downloadName);
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    this.populate(docSnap.data());
    this.name = docSnap.id;
  }
}
