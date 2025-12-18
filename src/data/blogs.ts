import { getRandomCode } from "@/utils/shared"

export const blogData=[
    {
        title:'Blogs 1',
        desciption:'describe 1'
    },
    {
        title:'Blogs 1',
        desciption:'describe 1'
    },
    {
        title:'Blogs 1',
        desciption:'describe 1'
    },
    {
        title:'Blogs 1',
        desciption:'describe 1'
    },
].map((itm,i)=>({
    id:getRandomCode(),
    title:`Blog ${i}`,
    desciption:`desciption ${i}`,
}))