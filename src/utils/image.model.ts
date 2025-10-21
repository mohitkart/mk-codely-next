import envirnment from "@/envirnment"

const getImage=(name:string='',modal:string='')=>{
    if(name.includes('https')) return name
    let v=name;
    if (modal) {
        console.log("modal",modal)
        console.log("name",name)
        const i = name.split('/')
        v = `assets/${modal}/${name}`
        if (i.length > 1) v = name
    }
    v=v.replaceAll('/','%2F')
    return `https://firebasestorage.googleapis.com/v0/b/${envirnment.firebase.storageBucket}/o/${v}?alt=media`
}
const imageModel={getImage}
export default imageModel;
