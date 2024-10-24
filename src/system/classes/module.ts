import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export class Module {
    // Basic Data
    private id: string;
    private name: string;
    private alias: string;
    private long: string;
    private type: number;
    private status: number;

    // Measures
    private mass: number;
    private height: number;
    private width: number;
    private depth: number;
    private parts: number;

    // Operations
    private crewCap: number;
    private commRange: number;
    private lifeSupport: number;
    private dockingPorts: { [id: string]: { units: number, using: number } };

    // Finances
    private construction: number;
    private reconditioning: number;
    private upgrades: number[];
    private documents: number[];

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

            mass: this.mass,
            height: this.height,
            width: this.width,
            depth: this.depth,
            parts: this.parts,

            crewCap: this.crewCap,
            commRange: this.commRange,
            lifeSupport: this.lifeSupport,
            dockingPorts: this.dockingPorts,

      construction: this.construction,
      reconditioning: this.reconditioning,
      upgrades: this.upgrades,
      documents: this.documents,
    };
  }

  private populate(data: any) {
    this.name = data.name;
    this.alias = data.alias;
    this.long = data.long;
    this.type = data.type;
    this.status = data.status;
    this.mass = data.mass;
    this.height = data.height;
    this.width = data.width;
    this.depth = data.depth;
    this.parts = data.parts;
    this.crewCap = data.crewCap;
    this.commRange = data.commRange;
    this.lifeSupport = data.lifeSupport;
    this.dockingPorts = data.dockingPorts;
    this.construction = data.construction;
    this.reconditioning = data.reconditioning;
    this.upgrades = data.upgrades;
    this.documents = data.documents;
  }

  public async downloadModule(id?: string) {
    const downloadId = id || this.id;
    if (!downloadId) return;

    const docRef = doc(db, "modules", id.toString());
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) return;

    this.populate(docSnap.data());
    this.id = docSnap.id;
  }

  public get(attribute: "id" | "name" | "alias" | "long" | "type" | "status" | "mass" | "height" | "width" | "depth" | "parts" | "crewCap" | "commRange" | "lifeSupport" | "dockingPorts" | "construction" | "reconditioning" | "upgrades" | "documents") {
    return (this as any)[attribute];
  }

  public set(attribute: "id" | "name" | "alias" | "long" | "type" | "status" | "mass" | "height" | "width" | "depth" | "parts" | "crewCap" | "commRange" | "lifeSupport" | "dockingPorts" | "construction" | "reconditioning" | "upgrades" | "documents", newValue: any, setter?: React.Dispatch<React.SetStateAction<Module>>) {
    if (attribute == "id") return;
    (this as any)[attribute] = newValue;
    if (setter) setter(new Module(this.getAll()));
  }
}