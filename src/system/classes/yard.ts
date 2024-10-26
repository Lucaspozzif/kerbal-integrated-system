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

export class Yard {
  private id: string;
  private name: string;
  private status: number;
  private module: string;
  private missions: string[];
  private deviations: {
    type: string;
    description: string;
    consequence: string;
  }[];
  private documents: string[];
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
    this.status = data.status;
    this.module = data.module;
    this.missions = data.missions;
    this.deviations = data.deviations;
    this.documents = data.documents;
    this.created = data.created;
    this.lastUpdate = data.lastUpdate;
  }

  private getAll() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      module: this.module,
      missions: this.missions,
      deviations: this.deviations,
      documents: this.documents,
      created: this.created,
      lastUpdate: this.lastUpdate,
    };
  }

  // Database Methods
  public async downloadInterval(from: any, to: any) {
    const col = collection(db, "yards");
    const q = query(
      col,
      where("lastUpdate", ">", from),
      where("lastUpdate", "<", to)
    );

    const data: any[] = [];
    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      const snap = new Yard(doc.data());
      snap.set("id", doc.id);
      data.push(snap);
    });
  }

  public async download(id?: string) {
    const downloadId = id || this.id;
    if (!downloadId || downloadId == "") return;

    const docRef = doc(db, "yards", downloadId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    this.populate(docSnap.data());
    this.id = docSnap.id;
  }

  public async upload() {
    if (!this.id || this.id == "") return;

    if (!this.created) this.created = Date.now();
    this.lastUpdate = Date.now();

    const docRef = doc(db, "yards", this.id);
    await setDoc(docRef, this.getAll());
  }

  public async delete() {
    if (!this.id || this.id == "") return;

    const docRef = doc(db, "yards", this.id);
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
      | "status"
      | "module"
      | "missions"
      | "deviations"
      | "documents"
      | "created"
      | "lastUpdate"
  ) {
    return (this as any)[attribute];
  }

  public set(
    attribute:
      | "id"
      | "name"
      | "status"
      | "module"
      | "missions"
      | "deviations"
      | "documents",
    newValue: any,
    setter?: React.Dispatch<React.SetStateAction<Yard>>
  ) {
    (this as any)[attribute] = newValue;
    if (setter) setter(new Yard(this.getAll()));
  }
}
