import {
  collection,
  deleteDoc,
  doc,
  endAt,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  startAt,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export class CelestialBody {
  private id: string;
  private name: string;
  private hasAtmosphere: boolean;
  private biomes: string[];

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
    this.hasAtmosphere = data.hasAtmosphere;
    this.biomes = data.biomes;
    this.created = data.created;
    this.lastUpdate = data.lastUpdate;
  }

  private getAll() {
    return {
      id: this.id,
      name: this.name,
      hasAtmosphere: this.hasAtmosphere,
      biomes: this.biomes,
      created: this.created,
      lastUpdate: this.lastUpdate,
    };
  }

  private format() {
    this.id = this.id;
    this.name = this.name?.toLowerCase() || "";
    this.biomes = this.biomes.map((biome) => biome.toLowerCase() || "");
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

    const col = collection(db, "celestial-bodies");
    const q = query(
      col,
      where("lastUpdate", "<", fromDate.getTime()),
      where("lastUpdate", ">", toDate.getTime())
    );

    const data: any[] = [];
    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      const snap = new CelestialBody(doc.data());
      snap.set("id", doc.id);
      data.push(snap);
    });

    return data;
  }

  public async downloadSearch(search: string) {
    const formattedSearch = search.toLowerCase();
    const col = collection(db, "celestial-bodies");
    const q = query(
      col,
      orderBy("name"),
      startAt(formattedSearch),
      endAt(formattedSearch + "\uf8ff")
    );
    const data: any[] = [];

    try {
      const querySnap = await getDocs(q);
      querySnap.forEach((doc) => {
        const snap = new CelestialBody(doc.data());
        snap.set("id", doc.id);
        data.push(snap);
      });

      return data;
    } catch (error) {
      console.error("Error searching by partial name:", error);
    }
  }

  public async download(id?: string) {
    const downloadId = id || this.id;
    if (!downloadId || downloadId == "") return;

    const docRef = doc(db, "celestial-bodies", downloadId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    this.populate(docSnap.data());
    this.format();
    this.id = docSnap.id;
  }

  public async upload() {
    if (!this.id || this.id == "") return;

    if (!this.created) this.created = Date.now();
    this.lastUpdate = Date.now();
    const docRef = doc(db, "celestial-bodies", this.id);
    this.format();
    await setDoc(docRef, this.getAll());
  }

  public async delete() {
    if (!this.id || this.id == "") return;

    const docRef = doc(db, "celestial-bodies", this.id);
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
      | "hasAtmosphere"
      | "biomes"
      | "created"
      | "lastUpdate"
  ) {
    return (this as any)[attribute];
  }

  public set(
    attribute: "id" | "name" | "hasAtmosphere" | "biomes",
    newValue: any,
    setter?: React.Dispatch<React.SetStateAction<CelestialBody>>
  ) {
    (this as any)[attribute] = newValue;
    if (setter) setter(new CelestialBody(this.getAll()));
  }
}
