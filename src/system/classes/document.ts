import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

export class Document {
  private id: string;
  private name: string;
  private long: string;
  private files: {
    id: string;
    groupId: string;
    name: string;
    description: string;
    version: string;
    uploaded: string;
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
    this.files = data.files;
    this.created = data.created;
    this.lastUpdate = data.lastUpdate;
  }

  private getAll() {
    return {
      id: this.id,
      name: this.name,
      long: this.long,
      files: this.files,
      created: this.created,
      lastUpdate: this.lastUpdate,
    };
  }

  // Database Methods
  public async downloadInterval(from: any, to: any) {
    const col = collection(db, "documents");
    const q = query(col, where("lastUpdate", ">", from), where("lastUpdate", "<", to));

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
    const updatedId = (parseInt(data[database]) + 1).toString().padStart(slots, "0");

    data[database] = updatedId;
    await setDoc(docRef, data);

    return updatedId;
  }

  public async downloadFile(fileId: string) {}

  public async uploadFile(fileId: string) {}

  public async exportFile(fileId: string) {}
  
  public async importFile(fileId: string) {}

  // Setters and Getters
  public get(attribute: "id" | "name" | "long" | "files" | "created" | "lastUpdate") {
    return (this as any)[attribute];
  }

  public set(attribute: "id" | "name" | "alias" | "long" | "files", newValue: any, setter?: React.Dispatch<React.SetStateAction<Document>>) {
    (this as any)[attribute] = newValue;
    if (setter) setter(new Document(this.getAll()));
  }

  // Other methods
  /**
   *  @returns an array of IDs corresponding to the last version files
   */
  public lastVersionIds() {
    if (!this.files) return [];
    const lastFilesMap = new Map<string, { id: string; version: number }>();

    this.files.forEach((file) => {
      const version = parseInt(file.version);

      // If the group is new or the version is greater than the current one, update the map
      if (!lastFilesMap.has(file.groupId) || version > lastFilesMap.get(file.groupId)!.version) {
        lastFilesMap.set(file.groupId, { id: file.id, version });
      }
    });

    // Extract the IDs from the map and return them
    return Array.from(lastFilesMap.values()).map((file) => file.id);
  }
}
