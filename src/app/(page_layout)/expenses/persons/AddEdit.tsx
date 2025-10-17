'use client'

import { RootState } from "@/redux/store";
import FireApi from "@/utils/firebaseApi.utils";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ADD_PAGE_NAME, PAGE_TABLE } from "./shared";
import { ExpenseForm } from "./Content";
import { SubmitHandler, useForm } from "react-hook-form";
import { getRandomCode, loaderHtml } from "@/utils/shared";

type ModalType = {
  detail: any
  action: (_: { action: 'submit' | 'close', value?: any }) => void
}

export default function AddEdit({ detail, action}: ModalType) {
  const user: any = useSelector((state: RootState) => state.user.data);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors, defaultValues },
  } = useForm<ExpenseForm>({ defaultValues: { name: '' } })
  const { post, isLoading: formLoading, put } = FireApi()

  const onSubmit: SubmitHandler<ExpenseForm> = (data) => {
    if(!user){
      if (detail?.id) {
        action({ action: 'submit', value: { ...data, id: detail?.id } })
      }else{
        action({ action: 'submit', value: { ...data, id: getRandomCode(12),createdAt:new Date().toISOString() } })
      }
      return
    }
    loaderHtml(true)
    if (detail?.id) {
      put(PAGE_TABLE, { ...data, id: detail?.id }).then(res => {
        if (res.success) {
          action({ action: 'submit', value: { ...data, id: detail?.id } })
        }
      }).finally(() => {
        loaderHtml(false)
      })
    } else {
      post(PAGE_TABLE, data).then(res => {
        if (res.success) {
          action({ action: 'submit', value: { ...data, id: res.data.id } })
        }
      }).finally(() => {
        loaderHtml(false)
      })
    }
  }

  useEffect(() => {
    if (detail) {
      const payload: any = defaultValues
      Object.keys(defaultValues as object).map(key => {
        payload[key] = detail[key]
      })
      resetForm(payload)
    }
  }, [detail])


  return <>

    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="max-h-[calc(100vh-200px)] overflow-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("name")}
            required
            placeholder="Enter expense title" />
        </div>
      </div>


      <div className="flex space-x-3">
        <button type="submit" id="submit-btn"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center">
          {detail?.id ? 'Edit' : 'Add'} {ADD_PAGE_NAME}
        </button>
        <button type="button" id="cancel-btn" className="hidden bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200">
          Cancel
        </button>
      </div>
    </form>
  </>;
}