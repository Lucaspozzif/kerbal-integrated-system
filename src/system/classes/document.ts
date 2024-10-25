import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export class Document {
    // Basic Data
    private id: string;
    private name: string;
    private alias: string;
    private long: string;
    private type: number;
    private status: number;

    private files: any[]

  constructor(data?: any) {
    if (!data) return;
    this.populate(data);
  }

    private getAll() {
        return {
            name: this.name,
            alias: this.alias,
            long: this.long,
            type: this.type,
            status: this.status,

            files: this.files,
    };
  }

  private populate(data: any) {
    this.name = data.name;
    this.alias = data.alias;
    this.long = data.long;
    this.type = data.type;
    this.status = data.status;
    this.files = data.files;
  }

  public async downloadModule(id?: string) {
    const downloadId = id || this.id;
    if (!downloadId) return;

    const docRef = doc(db, "documents", id.toString());
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    this.populate(docSnap.data());
    this.id = docSnap.id;
  }

  public get(attribute: "id" | "name" | "alias" | "long" | "type" | "status" | "files") {
    return (this as any)[attribute];
  }

  public set(attribute: "id" | "name" | "alias" | "long" | "type" | "status" | "files", newValue: any, setter?: React.Dispatch<React.SetStateAction<Document>>) {
    if (attribute == "id") return;
    (this as any)[attribute] = newValue;
    if (setter) setter(new Document(this.getAll()));
  }
}