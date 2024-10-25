import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export class Document {
  private id: string;
  private name: string;
  private long: string;
  private type: number;
  private status: number;
  private files: {
    id: string;
    name: string;
    description: string;
    version: string;
    uploaded: string;
    file: any;
  }[];

  private created: any;
  private lastUpdate: any;

  constructor(data?: any) {
    if (data) {
      this.populate(data);
    }
  }

  // Internal Methods
  private populate(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.long = data.long;
    this.type = data.type;
    this.status = data.status;
    this.files = data.files;
    this.created = data.created;
    this.lastUpdate = data.lastUpdate;
  }

  private getAll() {
    return {
      id: this.id,
      name: this.name,
      long: this.long,
      type: this.type,
      status: this.status,
      files: this.files,
      created: this.created,
      lastUpdate: this.lastUpdate,
    };
  }

  // Database Methods
  public async downloadInterval(from: any, to: any) {
    const col = collection(db, "documents");
    const q = query(
      col,
      where("lastUpdate", ">", from),
      where("lastUpdate", "<", to)
    );

    const data: any[] = [];
    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      const snap = new Document(doc.data());
      snap.set("id", doc.id);
      data.push(snap);
    });
  }

  public async download(id?: string) {
    const downloadId = id || this.id;
    if (!downloadId || downloadId == "") return;

    const docRef = doc(db, "documents", downloadId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    this.populate(docSnap.data());
    this.id = docSnap.id;
  }

  public async upload() {
    if (!this.id || this.id == "") return;

    if (!this.created) this.created = serverTimestamp();
    this.lastUpdate = serverTimestamp();

    const docRef = doc(db, "documents", this.id);
    await setDoc(docRef, this.getAll());
  }

  public async delete() {
    if (!this.id || this.id == "") return;

    const docRef = doc(db, "documents", this.id);
    await deleteDoc(docRef);
  }

  public async generateId(database: string, slots: number) {
    const docRef = doc(db, "config/idCounters");
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    const data = docSnap.data();
    if (!data[database]) {
      data[database] = "0".repeat(slots);
    }
    const updatedId = (parseInt(data[database]) + 1)
      .toString()
      .padStart(slots, "0");

    data[database] = updatedId;
    await setDoc(docRef, data);

    return updatedId;
  }

  // Setters and Getters
  public get(
    attribute:
      | "id"
      | "name"
      | "long"
      | "type"
      | "status"
      | "files"
      | "created"
      | "lastUpdate"
  ) {
    return (this as any)[attribute];
  }

  public set(
    attribute: "id" | "name" | "alias" | "long" | "type" | "status" | "files",
    newValue: any,
    setter?: React.Dispatch<React.SetStateAction<Document>>
  ) {
    (this as any)[attribute] = newValue;
    if (setter) setter(new Document(this.getAll()));
  }
}
