'use client'
import CodeEditor from "@/components/CodeEditor"
import { getColor } from "@/components/MkChart"
import OptionDropdown from "@/components/OptionDropdown"
import FireApi from "@/utils/firebaseApi.utils"
import packageModel from "@/utils/package"
import { loaderHtml } from "@/utils/shared"
import { statusList } from "@/utils/shared.utils"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm, SubmitHandler, useFieldArray, Controller } from "react-hook-form"
import { ADD_PAGE_NAME, PAGE_TABLE, PAGE_URL } from "./shared"
import Link from "next/link"
import Editor from "@/components/Editor"
import UploadFile from "@/components/UploadFile"

type FormType = {
  english: string
  short_description: string
  description: string
  hindi: string
  status: string
  image:string
}


export default function AddEdit() {
  const { slug } = useParams()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    reset: resetForm,
    formState: { errors, defaultValues },
  } = useForm<FormType>({ defaultValues: { english: '', description: '', status: 'active', hindi: '', short_description: '',image:'' } })
  const { get: getDetail, isLoading: isDetailLoading } = FireApi()
  const { get: getCategory, isLoading: categoryLoading } = FireApi()
  const { post, isLoading: formLoading, put } = FireApi()



  const [categories, setCategories] = useState<any[]>([])
  const onSubmit: SubmitHandler<FormType> = (data) => {
    loaderHtml(true)
    if (slug) {
      put(PAGE_TABLE, { ...data, id: slug }).then(res => {
        if (res.success) {
          router.push(`${PAGE_URL}`)
        }
      }).finally(() => {
        loaderHtml(false)
      })
    } else {
      post(PAGE_TABLE, data).then(res => {
        if (res.success) {
          router.push(`${PAGE_URL}`)
        }
      }).finally(() => {
        loaderHtml(false)
      })
    }
  }

  const getCategories = async () => {
    const res = await getCategory('categories', [{ field: 'type', operator: '==', value: 'code' }])
    let data = []
    if (res.data) {
      data = res.data.map((itm: any, i: any) => ({ ...itm, color: getColor(i) })).sort((a: any, b: any) => {
        if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) return -1; // a comes before b
        if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) return 1;  // a comes after b
        return 0;
      })
    }
    setCategories(data)
  }

  useEffect(() => {
    getCategories()
  }, [])

  useEffect(() => {
    if (slug) {
      loaderHtml(true)
      getDetail(PAGE_TABLE, [], slug).then(res => {
        if (res.success) {
          const data = res.data
          const payload: any = defaultValues
          Object.keys(defaultValues as object).map(key => {
            payload[key] = data[key]
          })
          resetForm(payload)
        }
        loaderHtml(false)
      })
    }
  }, [slug])

  return (
    <>
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <span className="material-symbols-outlined text-blue-600 mr-2">edit_note</span>
            {slug ? 'Edit' : 'Add'} {ADD_PAGE_NAME}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          <form className="p-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
  <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="material-symbols-outlined text-gray-500 text-sm mr-1">title</span>
                English *
              </label>
              <input type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter title"
                {...register("english")}
                required />
              {errors.english && <span>This field is required</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="material-symbols-outlined text-gray-500 text-sm mr-1">title</span>
                Hindi *
              </label>
              <input type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter title"
                {...register("hindi")}
                required />
              {errors.hindi && <span>This field is required</span>}
            </div>
           


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="material-symbols-outlined text-gray-500 text-sm mr-1">toggle_on</span>
                  Status *
                </label>

                <Controller
                  name={`status`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return <OptionDropdown
                      value={field.value}
                      onChange={e => {
                        setValue('status', e)
                      }}
                      showUnselect={false}
                      isSearch={false}
                      options={statusList}
                    />
                  }}
                />
                {errors.status && <span className="text-red-500">This field is required</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="material-symbols-outlined text-gray-500 text-sm mr-1">description</span>
                Short Description
              </label>
              <textarea className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
                rows={4}
                {...register("short_description")}
                placeholder=""></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="material-symbols-outlined text-gray-500 text-sm mr-1">description</span>
                Description
              </label>
              <Controller
                name={'description'}
                control={control}
                rules={{}}
                render={({ field }) => {
                  return <Editor
                    className=''
                    value={field.value}
                    onChange={(html) => {
                      setValue('description', html)
                    }}
                  />
                }}
              />
              {errors.description && <span className="text-red-500">This field is required</span>}
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="material-symbols-outlined text-gray-500 text-sm mr-1">image</span>
                Image
              </label>
              <Controller
                name={'image'}
                control={control}
                rules={{}}
                render={({ field }) => {
                  return <UploadFile
                    label="Upload Image"
                    value={field.value}
                    modal={PAGE_TABLE}
                    result={e => {
                      setValue('image', e.value)
                    }}
                  />
                }}
              />
              {errors.image && <span className="text-red-500">This field is required</span>}
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <Link href={`${PAGE_URL}`} type="button"
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200">
                <span className="material-symbols-outlined text-sm">cancel</span>
                <span>Cancel</span>
              </Link>

              <button type="submit"
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200">
                <span className="material-symbols-outlined text-sm">save</span>
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
