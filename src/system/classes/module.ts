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

export class Module {
  // Basic Data
  private id: string;
  private name: string;
  private alias: string;
  private long: string;
  private type: number;
  private status: number;

  // Operations
  private crewCap: number;
  private dockingPorts: {
    id: string;
    qty: number;
    using: number;
  }[];
  private commRange: string;
  private lifeSupport: string;

  // Finances
  private construction: number;
  private reconditioning: number;

  // Relations
  private parentModules: string[];
  private childModules: string[];
  private missions: string[];

  // Documents
  private upgrades: {
    name: string;
    long: string;
    type: string;
    previousConstruction: number;
    previousReconditioning: number;
    documents: string[];
  };
  private documents: number[];

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
    this.alias = data.alias;
    this.long = data.long;
    this.type = data.type;
    this.status = data.status;
    this.crewCap = data.crewCap;
    this.dockingPorts = data.dockingPorts;
    this.commRange = data.commRange;
    this.lifeSupport = data.lifeSupport;
    this.construction = data.construction;
    this.reconditioning = data.reconditioning;
    this.parentModules = data.parentModules;
    this.childModules = data.childModules;
    this.missions = data.missions;
    this.upgrades = data.upgrades;
    this.documents = data.documents;
    this.created = data.created;
    this.lastUpdate = data.lastUpdate;
  }

  private getAll() {
    return {
      id: this.id,
      name: this.name,
      alias: this.alias,
      long: this.long,
      type: this.type,
      status: this.status,
      crewCap: this.crewCap,
      dockingPorts: this.dockingPorts,
      commRange: this.commRange,
      lifeSupport: this.lifeSupport,
      construction: this.construction,
      reconditioning: this.reconditioning,
      parentModules: this.parentModules,
      childModules: this.childModules,
      missions: this.missions,
      upgrades: this.upgrades,
      documents: this.documents,
      created: this.created,
      lastUpdate: this.lastUpdate,
    };
  }

  // Database Methods
  public async downloadInterval(from: any, to: any) {
    const col = collection(db, "modules");
    const q = query(
      col,
      where("lastUpdate", ">", from),
      where("lastUpdate", "<", to)
    );

    const data: any[] = [];
    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      const snap = new Module(doc.data());
      snap.set("id", doc.id);
      data.push(snap);
    });
  }

  public async download(id?: string) {
    const downloadId = id || this.id;
    if (!downloadId || downloadId == "") return;

    const docRef = doc(db, "modules", downloadId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    this.populate(docSnap.data());
    this.id = docSnap.id;
  }

  public async upload() {
    if (!this.id || this.id == "") return;

    if (!this.created) this.created = serverTimestamp();
    this.lastUpdate = serverTimestamp();

    const docRef = doc(db, "modules", this.id);
    await setDoc(docRef, this.getAll());
  }

  public async delete() {
    if (!this.id || this.id == "") return;

    const docRef = doc(db, "modules", this.id);
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
      | "alias"
      | "long"
      | "type"
      | "status"
      | "crewCap"
      | "dockingPorts"
      | "commRange"
      | "lifeSupport"
      | "construction"
      | "reconditioning"
      | "parentModules"
      | "childModules"
      | "missions"
      | "upgrades"
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
      | "alias"
      | "long"
      | "type"
      | "status"
      | "crewCap"
      | "dockingPorts"
      | "commRange"
      | "lifeSupport"
      | "construction"
      | "reconditioning"
      | "parentModules"
      | "childModules"
      | "missions"
      | "upgrades"
      | "documents",
    newValue: any,
    setter?: React.Dispatch<React.SetStateAction<Module>>
  ) {
    (this as any)[attribute] = newValue;
    if (setter) setter(new Module(this.getAll()));
  }
}
