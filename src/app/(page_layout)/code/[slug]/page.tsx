import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME, noImg } from "@/utils/shared";
import { getIdFire } from "@/utils/firebase.utils";
import Detail from "./Detail";

const table = 'code'
async function getBlog(slug: string) {
  const detail: any = await getIdFire({ table, id: slug })
  return detail.data
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
  const title = blog.title
  const description = blog.short_description
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

export default function DetailPage() {
    return <>
    <Detail/>
    </>
}
