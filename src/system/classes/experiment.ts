import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

export class Crew {
  // Basic Data
  private id: string;
  private name: string;
  private landed: boolean;
  private splashed: boolean;
  private flyingLow: boolean;
  private flyingHigh: boolean;
  private spaceLow: boolean;
  private spaceHigh: boolean;
  private completed: {
    [planetId: string]: string[];
  };

  private created: any;
  private lastUpdated: any;

  constructor(data?: any) {
    if (data) {
      this.populate(data);
    }
  }

  // Internal Methods
  private populate(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.landed = data.landed;
    this.splashed = data.splashed;
    this.flyingLow = data.flyingLow;
    this.flyingHigh = data.flyingHigh;
    this.spaceLow = data.spaceLow;
    this.spaceHigh = data.spaceHigh;
    this.completed = data.completed;
    this.created = data.created;
    this.lastUpdated = data.lastUpdated;
  }

  private getAll() {
    return {
      id: this.id,
      name: this.name,
      landed: this.landed,
      splashed: this.splashed,
      flyingLow: this.flyingLow,
      flyingHigh: this.flyingHigh,
      spaceLow: this.spaceLow,
      spaceHigh: this.spaceHigh,
      completed: this.completed,
      created: this.created,
      lastUpdate: this.lastUpdated,
    };
  }

  // Database Methods
  public async downloadInterval(from: any, to: any) {
    const col = collection(db, "experiments");
    const q = query(col, where("lastUpdate", ">", from), where("lastUpdate", "<", to));

    const data: any[] = [];
    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      const snap = new Crew(doc.data());
      snap.set("id", doc.id);
      data.push(snap);
    });
  }

  public async download(id?: string) {
    const downloadId = id || this.id;
    if (!downloadId || downloadId == "") return;

    const docRef = doc(db, "experiments", downloadId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    this.populate(docSnap.data());
    this.id = docSnap.id;
  }

  public async upload() {
    if (!this.id || this.id == "") return;

    if (!this.created) this.created = Date.now();
    this.lastUpdated = Date.now();

    const docRef = doc(db, "experiments", this.id);
    await setDoc(docRef, this.getAll());
  }

  public async delete() {
    if (!this.id || this.id == "") return;

    const docRef = doc(db, "experiments", this.id);
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

  // Setters and Getters
  public get(attribute: "id" | "name" | "landed" | "splashed" | "flyingLow" | "flyingHigh" | "spaceLow" | "spaceHigh" | "completed" | "created" | "lastUpdated") {
    return (this as any)[attribute];
  }

  public set(attribute: "id" | "name" | "landed" | "splashed" | "flyingLow" | "flyingHigh" | "spaceLow" | "spaceHigh" | "completed", newValue: any, setter?: React.Dispatch<React.SetStateAction<Crew>>) {
    (this as any)[attribute] = newValue;
    if (setter) setter(new Crew(this.getAll()));
  }
}
