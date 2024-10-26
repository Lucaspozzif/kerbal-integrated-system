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

export class Mission {
  private id: string;
  private name: string;
  private alias: string;
  private long: string;
  private type: number;
  private status: number;
  private start: {
    year: number;
    day: number;
    hour: number;
    minute: number;
  };
  private conclusion: {
    year: number;
    day: number;
    hour: number;
    minute: number;
  };
  private speculatedDuration: {
    year: number;
    day: number;
    hour: number;
    minute: number;
  };
  private modules: string[];
  private parentMissions: string[];
  private childMissions: string[];
  private tripulation: string[];
  private science: {
    experiment: string;
    body: string;
    biome: string;
    condition: string;
  };
  private incomes: {
    id: string;
    type: string;
    description: string;
    value: string;
  };
  private expenses: {
    id: string;
    type: string;
    description: string;
    value: string;
  };
  private deviations: {
    type: string;
    description: string;
    consequence: string;
  };
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
    this.alias = data.alias;
    this.long = data.long;
    this.type = data.type;
    this.status = data.status;
    this.start = data.start;
    this.conclusion = data.conclusion;
    this.speculatedDuration = data.speculatedDuration;
    this.modules = data.modules;
    this.parentMissions = data.parentMissions;
    this.childMissions = data.childMissions;
    this.tripulation = data.tripulation;
    this.science = data.science;
    this.incomes = data.incomes;
    this.expenses = data.expenses;
    this.deviations = data.deviations;
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
      start: this.start,
      conclusion: this.conclusion,
      speculatedDuration: this.speculatedDuration,
      modules: this.modules,
      parentMissions: this.parentMissions,
      childMissions: this.childMissions,
      tripulation: this.tripulation,
      science: this.science,
      incomes: this.incomes,
      expenses: this.expenses,
      deviations: this.deviations,
      documents: this.documents,
      created: this.created,
      lastUpdate: this.lastUpdate,
    };
  }

  // Database Methods
  public async downloadInterval(from: any, to: any) {
    const col = collection(db, "missions");
    const q = query(
      col,
      where("lastUpdate", ">", from),
      where("lastUpdate", "<", to)
    );

    const data: any[] = [];
    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      const snap = new Mission(doc.data());
      snap.set("id", doc.id);
      data.push(snap);
    });
  }

  public async download(id?: string) {
    const downloadId = id || this.id;
    if (!downloadId || downloadId == "") return;

    const docRef = doc(db, "missions", downloadId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    this.populate(docSnap.data());
    this.id = docSnap.id;
  }

  public async upload() {
    if (!this.id || this.id == "") return;

    if (!this.created) this.created = Date.now();
    this.lastUpdate = Date.now();

    const docRef = doc(db, "missions", this.id);
    await setDoc(docRef, this.getAll());
  }

  public async delete() {
    if (!this.id || this.id == "") return;

    const docRef = doc(db, "missions", this.id);
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
      | "start"
      | "conclusion"
      | "speculatedDuration"
      | "modules"
      | "parentMissions"
      | "childMissions"
      | "tripulation"
      | "science"
      | "incomes"
      | "expenses"
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
      | "alias"
      | "long"
      | "type"
      | "status"
      | "start"
      | "conclusion"
      | "speculatedDuration"
      | "modules"
      | "parentMissions"
      | "childMissions"
      | "tripulation"
      | "science"
      | "incomes"
      | "expenses"
      | "deviations"
      | "documents",
    newValue: any,
    setter?: React.Dispatch<React.SetStateAction<Mission>>
  ) {
    (this as any)[attribute] = newValue;
    if (setter) setter(new Mission(this.getAll()));
  }
}
