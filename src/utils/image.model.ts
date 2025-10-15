import envirnment from "@/envirnment"

const getImage=(name:string='')=>{
    if(name.includes('https')) return name
    name=name.replaceAll('/','%2F')
    return `https://firebasestorage.googleapis.com/v0/b/${envirnment.firebase.storageBucket}/o/${name}?alt=media`
}
const imageModel={getImage}
export default imageModel;
