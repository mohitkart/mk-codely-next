import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import Content from "./Content";
import envirnment from "@/envirnment";
export const metadata: Metadata = {
  title: `${APP_NAME} - Verify`,
  description: APP_DESCRIPTION,
};

const parseJson = (str: string) => {
  try {
    const value = JSON.parse(str)
    return value
  } catch (err) {
    return null
  }
}
export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }; }) {
  const q = await searchParams.q || ''
  const res = await fetch(`${envirnment.frontUrl}api/verify?q=${q}`)
  const poststext = await res.text()
  const response = parseJson(poststext)

  return <>
    <Content
      response={response}
    />
  </>
}
