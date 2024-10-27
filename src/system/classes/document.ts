import { collection, deleteDoc, doc, endAt, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, startAt, where } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

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

  private format() {
    this.id = this.id;
    this.name = this.name?.toLowerCase() || "";
    this.long = this.long?.toLowerCase() || "";

    this.files = this.files.map((file) => ({
      id: file.id,
      groupId: file.groupId,
      name: file.name?.toLowerCase() || "",
      description: file.description?.toLowerCase() || "",
      version: file.version || "00",
      uploaded: file.uploaded || null,
    }));
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

    const col = collection(db, "documents");
    const q = query(col, where("lastUpdate", "<", fromDate.getTime()), where("lastUpdate", ">", toDate.getTime()));

    const data: any[] = [];
    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      const snap = new Document(doc.data());
      snap.set("id", doc.id);
      data.push(snap);
    });

    return data;
  }

  public async downloadSearch(search: string) {
    const formattedSearch = search.toLowerCase();
    const col = collection(db, "documents");
    const q = query(col, orderBy("name"), startAt(formattedSearch), endAt(formattedSearch + "\uf8ff"));
    const data: any[] = [];

    try {
      const querySnap = await getDocs(q);
      querySnap.forEach((doc) => {
        const snap = new Document(doc.data());
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

    const docRef = doc(db, "documents", downloadId);
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
    const docRef = doc(db, "documents", this.id);
    this.format();
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

  public async downloadFile(fileId: string) {
    if (!fileId) return;

    const storageRef = ref(storage, `files/${fileId}`);
    try {
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log("File available at", downloadURL);

      // Initiate the download
      const link = document.createElement("a");
      link.href = downloadURL;
      link.download = fileId; // You can set a specific filename if needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
    }
  }

  public async uploadFile(fileId: string, file: File, onProgress: (progress: number) => void) {
    if (!file) return;

    const storageRef = ref(storage, `files/${fileId}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error("Upload failed", error);
          reject(error);
        },
        async () => {
          // Get the download URL after a successful upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        }
      );
    });
  }

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
