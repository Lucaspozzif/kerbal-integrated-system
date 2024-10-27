import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

export class Database {
  private name: string;
  private data: {
    id: string;
    value: string;
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
    this.name = data.name;
    this.data = data.data;
    this.created = data.created;
    this.lastUpdate = data.lastUpdate;
  }

  private getAll() {
    return {
      name: this.name,
      data: this.data,
      created: this.created,
      lastUpdate: this.lastUpdate,
    };
  }

  // Database Methods
  /**
   *
   * @param from from X months since today
   * @param to to X months since today
   * @returns returns the array of documents in the interval
   */
  public async downloadInterval(from: number, to: number) {
    const today = new Date();

    const fromDate = new Date(today);
    const toDate = new Date(today);
    fromDate.setMonth(today.getMonth() - from);
    toDate.setMonth(today.getMonth() - to);

    const col = collection(db, "databases");
    const q = query(col, where("lastUpdate", "<", fromDate.getTime()), where("lastUpdate", ">", toDate.getTime()));

    const data: any[] = [];
    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      const snap = new Database(doc.data());
      snap.set("name", doc.id);
      data.push(snap);
    });

    return data;
  }

  public async downloadSearch(search: string) {
    const formattedSearch = search.toLowerCase();
    const col = collection(db, "databases");
    const q = query(col, orderBy("name"), startAt(formattedSearch), endAt(formattedSearch + "\uf8ff"));
    const data: any[] = [];

    try {
      const querySnap = await getDocs(q);
      querySnap.forEach((doc) => {
        const snap = new Database(doc.data());
        snap.set("name", doc.id);
        data.push(snap);
      });

      return data;
    } catch (error) {
      console.error("Error searching by partial name:", error);
    }
  }

  public async download(name?: string) {
    const downloadId = name || this.name;
    if (!downloadId || downloadId == "") return;

    const docRef = doc(db, "databases", downloadId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    this.populate(docSnap.data());
    this.name = docSnap.id;
  }

  public async upload() {
    if (!this.name || this.name == "") return;

    if (!this.created) this.created = Date.now();
    this.lastUpdate = Date.now();

    const docRef = doc(db, "databases", this.name);
    await setDoc(docRef, this.getAll());
  }

  public async delete() {
    if (!this.name || this.name == "") return;

    const docRef = doc(db, "databases", this.name);
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
  public get(attribute: "name" | "data" | "created" | "lastUpdate") {
    return (this as any)[attribute];
  }

  public set(attribute: "name" | "data", newValue: any, setter?: React.Dispatch<React.SetStateAction<Database>>) {
    (this as any)[attribute] = newValue;
    if (setter) setter(new Database(this.getAll()));
  }
}
