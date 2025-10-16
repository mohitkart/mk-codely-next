'use client'
import OptionDropdown from "@/components/OptionDropdown"
import FireApi from "@/utils/firebaseApi.utils"
import { getRandomCode, loaderHtml } from "@/utils/shared"
import { statusList } from "@/utils/shared.utils"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { ADD_PAGE_NAME, PAGE_TABLE, PAGE_URL } from "./shared"
import Link from "next/link"
import UploadFile from "@/components/UploadFile"
import packageModel from "@/utils/package"

type FormType = {
  title: string
  short_description: string
  status: string
  package: string
  token: string
}


export default function AddEdit() {
  const { slug } = useParams()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset: resetForm,
    formState: { errors, defaultValues },
  } = useForm<FormType>({ defaultValues: { title: '', status: 'active', package: '', short_description: '', token: getRandomCode(40) } })
  const { get: getDetail, isLoading: isDetailLoading } = FireApi()
  const { post, isLoading: formLoading, put } = FireApi()
  const onSubmit: SubmitHandler<FormType> = (data) => {
    loaderHtml(true)
    if (slug) {
      put(PAGE_TABLE, { ...data, id: slug}).then(res => {
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
                Title *
              </label>
              <input type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter title"
                {...register("title")}
                required />
              {errors.title && <span>This field is required</span>}
            </div>
<div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="material-symbols-outlined text-gray-500 text-sm mr-1">title</span>
                Token *
              </label>
              <input type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter title"
                {...register("token")}
                disabled
                required />
              {errors.token && <span>This field is required</span>}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="material-symbols-outlined text-gray-500 text-sm mr-1">inventory_2</span>
                Package
              </label>
              <OptionDropdown
                value={watch('package')}
                onChange={e => {
                  setValue('package', e)
                }}
                options={packageModel.list}
              />
            </div>

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
