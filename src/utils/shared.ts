import envirnment from "@/envirnment";

export const APP_NAME='Mk Codely'
export const APP_DESCRIPTION='Code Snippet Library'

export const loaderHtml = (p: boolean) => {
  const loaderEl = document.getElementById("loader");
  if (!loaderEl) return;
  if (p) {
    loaderEl.classList?.remove("hidden");
  } else {
    loaderEl.classList?.add("hidden");
  }
};

export const capitalize = (str:string) => str ? str.replace(/\b\w/g, (char:string) => char.toUpperCase()) : '';

export const truncate=(str:string='',length=150)=>{
  return `${str?.slice(0,length)}${str.length>length?'...':''}`
}

export const copyClipboard=(text:any='')=>{
  navigator.clipboard.writeText(text);
}

const getImage = (model: any, name: any = '') => {
  model = model.replaceAll('/', '%2F')
  if (name.includes('https')) return name
  return `https://firebasestorage.googleapis.com/v0/b/${envirnment.firebase.storageBucket}/o/assets%2F${model}%2F${name}?alt=media`
}

export const noImg = (img:any='',model='blogs', defaultImg = '/img/placeholder.png') => {
  let value = defaultImg;
  if (img?.includes("https")) return img;
  if (img) value = getImage(model,img);
  return value;
};


export const isNumber = (e:any) => {
  const key = e.target;
  const maxlength = key.maxLength ? key.maxLength : 0;

  const max = Number(key.max ? key.max : key.value);
  if (Number(key.value) > max) key.value = max;

  // let min = key.min;
  // if (min && Number(key.value)<Number(min)) key.value = min;


  if (maxlength > 0) {
    if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
  }

  key.value = key.value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");

  return key.value;
};

export function getRandomCode(length = 5) {
  const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  return code;
}

type ReplaceUrlType={
  url?:string;
  parm?:any;
  title?:string;
  description?:string
}

export const replaceUrl = ({
  url='',
  parm = {},
  title = APP_NAME,
  description = "",
}:ReplaceUrlType) => {
  const params = new URLSearchParams();
  const dazhHomeUrl = "";
  Object.keys(parm).map((key) => {
    params.append(key, parm[key]);
  });

  const u = `${dazhHomeUrl}${url}` + params.toString();
  const nextTitle = title;
  const nextState = { additionalInformation: description };
  window.history.replaceState(nextState, nextTitle, u);
};


export const scrollId = (id:string) => {
  const element = document.getElementById(id);
  const headerOffset = 85;
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    // var offsetPosition = elementPosition - headerOffset;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "instant" });
  } else {
    console.log("id", id);
    console.log("element", element);
  }

  return element;
};