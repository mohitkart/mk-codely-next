'use client'
import CodeEditor from "@/components/CodeEditor"
import { getColor } from "@/components/MkChart"
import OptionDropdown from "@/components/OptionDropdown"
import FireApi from "@/utils/firebaseApi.utils"
import packageModel from "@/utils/package"
import { getRandomCode, loaderHtml } from "@/utils/shared"
import { statusList } from "@/utils/shared.utils"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm, SubmitHandler, useFieldArray, Controller } from "react-hook-form"
import { ADD_PAGE_NAME, PAGE_TABLE, PAGE_URL } from "./shared"
import Link from "next/link"
import Editor from "@/components/Editor"

type FormType = {
  title: string
  short_description: string
  description: string
  status: string
  category: string
  package: string
  code: { code: string, ext?: string, name: string, uid?: string }[]
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
  } = useForm<FormType>({ defaultValues: { title: '', description: '', status: '', category: '', package: '', code: [], short_description: '' } })
  const { get: getDetail, isLoading: isDetailLoading } = FireApi()
  const { get: getCategory, isLoading: categoryLoading } = FireApi()
  const { post, isLoading: formLoading, put } = FireApi()



  const { fields: codes, append: appendCode, move: moveCode, remove: removeCode } = useFieldArray({
    control,
    name: "code",
  });

  // store the index of the dragged item
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // handle drag start
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  // handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // allow dropping
  };

  // handle drop
  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    moveCode(dragIndex, index);
    setDragIndex(null);
  };


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

  const addCode = () => {
    appendCode({ code: '', ext: '', name: '', uid: getRandomCode(12) })
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
          payload.code = typeof data.code == 'object' ? data.code : JSON.parse(data?.code)
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
                placeholder="Enter item title"
                {...register("title")}
                required />
              {errors.title && <span>This field is required</span>}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="material-symbols-outlined text-gray-500 text-sm mr-1">category</span>
                  Category *
                </label>
                <Controller
                  name={`category`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return <OptionDropdown
                      value={field.value}
                      onChange={e => {
                        setValue('category', e)
                      }}
                      options={categories}
                      isLoading={categoryLoading}
                    />
                  }}
                />
                {errors.category && <span className="text-red-500">This field is required</span>}
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
                rules={{ required: true }}
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
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <span className="material-symbols-outlined text-gray-500 text-sm mr-1">code</span>
                  Code Array
                </label>
                <button type="button"
                  onClick={() => addCode()}
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg transition duration-200">
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Code</span>
                </button>
              </div>

              <div className="space-y-4">
                {codes.map((item, i) => {
                  return <div key={i}
                    className={`bg-gray-50 p-4 rounded-lg border border-gray-200 fade-in ${dragIndex === i ? "bg-gray-200" : "bg-gray-50"
                      }`}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(i)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-700">Code #{item.uid}</h3>
                      <div className="flex space-x-2">
                        <button type="button" onClick={() => removeCode(i)} className="text-red-600 hover:text-red-800 transition duration-200">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                        <input type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="Enter name"
                          {...register(`code.${i}.name` as const)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Extension</label>
                        <input type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="Enter extension"
                          {...register(`code.${i}.ext` as const)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Code</label>
                        <Controller
                          name={`code.${i}.code`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => {
                            return <CodeEditor
                              value={field.value}
                              onChange={e => {
                                setValue(`code.${i}.code`, e)
                              }}
                            />
                          }}
                        />
                        {errors.code?.[i]?.code && <span className="text-red-500">This field is required</span>}
                      </div>
                    </div>
                  </div>
                })}


                {!codes.length ? <>
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">code_off</span>
                    <p className="text-lg">No codes added yet</p>
                    <p className="text-sm mt-1">Click &quot;Add Code&quot; to create your first code entry</p>
                  </div>
                </> : <></>}
              </div>
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
