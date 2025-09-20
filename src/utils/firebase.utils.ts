import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, QueryConstraint, updateDoc, where } from "firebase/firestore";
import { deleteObject, getStorage, listAll, ref, uploadBytes } from "firebase/storage";
import { getDatabase, set,ref as rtRef } from "firebase/database";
import datepipeModel from "./datepipemodel";
import { getRandomCode } from "./shared";
import envirnment from "@/envirnment";

export const firebaseConfig = {
    ...envirnment.firebase
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDB = getDatabase(app);
export interface FirestoreConditions {
  field: string;
  operator: any;
  value: any;
}

interface AddUpdateProps {
  table: string;
  payload: any;
  id?: string;
}
interface GetProps {
  table: string;
  conditions?: FirestoreConditions[];
  id?: string;
}

export const getImage=(model:string,name:string='')=>{
    model=model.replaceAll('/','%2F')
    if(name.includes('https')) return name
    return `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/assets%2F${model}%2F${name}?alt=media`
}

export const fireDateParse=(p:any)=>{
  let d=p?.seconds
  if(d){
    d=d * 1000
  }else{
    d=p
  }
  return d?datepipeModel.datetodatetime(d):''
}

export async function writeDatabase(url:string,payload:any) {
return await set(rtRef(realtimeDB, `${url}`), {
    ...payload,
    createdAt: Date.now()
  });
}

export async function uploadFiles(files: File[], modal: string) {
  try {
    const uploadedFiles = [];

    for (const file of files) {
      // Generate unique name and clean spaces
      let name = `${getRandomCode(10)}_${file.name}`.replaceAll(" ", "_");
      let path = `assets/${modal}/${name}`;

      // Create a reference with unique name
      const storageRef = ref(storage, path);

      // Upload file
      await uploadBytes(storageRef, file);

      uploadedFiles.push({
        url:getImage(modal, name),                // Firebase download URL
        name,              // Saved file name
        modal: `assets/${modal}`, // Base folder
        fullPath: path,    // Full path in storage
      });
    }

    return { success: true, data: uploadedFiles };
  } catch (error) {
    console.error("❌ Error uploading files:", error);
    return { success: false, error };
  }
}


export async function deleteFile(filePath:string) {
  try {
    // Create a reference to the file
    const fileRef = ref(storage, filePath);
    // Delete the file
    await deleteObject(fileRef);
      return { success: true,data:filePath };
  } catch (error) {
    throw error;
  }
}

export async function getFiles(folderPath:string) {
  try {
    // Create a reference to the folder
    const folderRef = ref(storage, folderPath);

    // List all files in the folder
    const result = await listAll(folderRef);

    // Get download URLs for each file
    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          url:`https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${itemRef.fullPath.replaceAll('/', '%2F')}?alt=media`,
        };
      })
    );

   return { success: true, data:files };
  } catch (error) {
   throw error;
  }
}

export const getQuery=(table:string,conditions:FirestoreConditions[]=[],count:number=1000)=>{
   const constraints: QueryConstraint[] = conditions.map((c) =>
        where(c.field, c.operator, c.value)
      );
   const q = query(collection(db, table), ...constraints,orderBy("createdAt",'desc'),limit(count));
   return q
}


// Firebase specific operations
  export const getFire = async ({ table, conditions = [] }: GetProps) => {
    try {
      const constraints: QueryConstraint[] = conditions.map((c) =>
        where(c.field, c.operator, c.value)
      );
      const q = query(collection(db, table), ...constraints);
      const snapshot = await getDocs(q);
      
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt:fireDateParse(doc.data().createdAt),
        updatedAt:fireDateParse(doc.data().updatedAt),
        id: doc.id,
      }));

      return { success: true, data };
    } catch (error) {
      throw error;
    }
  };

  export const addFire = async ({ table, payload }: AddUpdateProps) => {
    try {
      payload.createdAt = new Date()
      const docRef = await addDoc(collection(db, table), payload);
      return { success: true, data: { ...payload, id: docRef.id, } };
    } catch (error) {
      throw error;
    }
  };

  export const updateFire = async ({ table, payload }: AddUpdateProps) => {
    try {
      if (!payload.id) throw new Error("ID is required for update");
      
      const docRef = doc(db, table, payload.id);
      const updateData = {
        ...payload,
        updatedAt: new Date()
      };
      delete updateData.id;
      
      await updateDoc(docRef, updateData);
      return { success: true, data: payload };
    } catch (error) {
      throw error;
    }
  };

  export const deleteFire = async ({ table, id }: { table: string; id: string }) => {
    try {
      const docRef = doc(db, table, id);
      await deleteDoc(docRef);
      return { success: true, message: "Document deleted successfully" };
    } catch (error) {
      throw error;
    }
  };

  export const getIdFire = async ({ table, id }: { table: string; id: string }) => {
    try {
      const docRef = doc(db, table, id);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        return { success: false, message: "Document not found" };
      }

      return {
        success: true,
        data: {
          ...snapshot.data(),
            createdAt:fireDateParse(snapshot.data().createdAt),
        updatedAt:fireDateParse(snapshot.data().updatedAt),
          id: snapshot.id,
        } 
      };
    } catch (error) {
      throw error;
    }
  };