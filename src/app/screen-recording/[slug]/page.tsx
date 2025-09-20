import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME, noImg } from "@/utils/shared";
import Content from "./Content";
import { getFire } from "@/utils/firebase.utils";

const table = 'recording'
async function getBlog(slug: string) {
  const detail: any = await getFire({ table, conditions:[{field:'file',operator:'==',value:slug}] })
  return detail.data?.[0]
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const blog = await getBlog(params?.slug);

  if (!blog) {
    return {
      title: `No Data Found - ${APP_NAME}`,
      description: APP_DESCRIPTION,
      openGraph: {
        title: `No Data Found - ${APP_NAME}`,
        description: APP_DESCRIPTION,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `No Data Found - ${APP_NAME}`,
        description: APP_DESCRIPTION,
      },
    };
  }

  const images = blog?.image ? [noImg(blog?.image)] : []
  let title = blog.title||blog.file
  title=`${title} - ${APP_NAME}`
  const description = blog.short_description||APP_DESCRIPTION
  const data = {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: images,
    },
  }

  return data;
}

export default function Home() {
  return (
   <>
  <Content/>
   </>
  );
}
