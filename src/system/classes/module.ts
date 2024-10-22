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

    constructor() {

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
        }
    }

    async downloadModule(id?: string) {
        const downloadId = id || this.id
        if (!downloadId) return

        const docRef = doc(db, "modules", id.toString());
        const docSnap = await getDoc(docRef);
        if (!docSnap.data()) return;

        console.log(docSnap.data());

    }
}