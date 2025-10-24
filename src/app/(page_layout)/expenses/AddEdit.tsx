'use client'

import { RootState } from "@/redux/store";
import FireApi from "@/utils/firebaseApi.utils";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ADD_PAGE_NAME, EXPENSE_STATUS_LIST, EXPENSE_TYPE_LIST, PAGE_TABLE } from "./shared";
import { CategoryType, ExpenseForm, PersonType } from "./Content";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { getRandomCode, loaderHtml } from "@/utils/shared";
import OptionDropdown from "@/components/OptionDropdown";
import FormControl from "@/components/FormControl";
import datepipeModel from "@/utils/datepipemodel";

type ModalType = {
  detail: any
  persons:PersonType[]
  categories:CategoryType[]
  action: (_: { action: 'submit' | 'close', value?: any }) => void
}

export default function AddEdit({ detail, action,persons,categories}: ModalType) {
  const user: any = useSelector((state: RootState) => state.user.data);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    reset: resetForm,
    formState: { errors, defaultValues },
  } = useForm<ExpenseForm>({ defaultValues: { name: '', status: 'Done', price: '', date: datepipeModel.datetodatetime(new Date()), category: '', type: 'Give' } })
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
    data.date=data.date?new Date(data.date):null
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <Controller
              name={`price`}
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                return <FormControl
                  type="number"
                  value={field.value}
                  placeholder="0.00"
                  onChange={(e: any) => setValue('price', e)}
                />
              }}
            />
            {errors.price && <span className="text-red-500">This field is required</span>}
          </div>
        </div>


        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category (Optional)</label>
          <Controller
            name={`category`}
            control={control}
            rules={{}}
            render={({ field }) => {
              return <OptionDropdown
                value={field.value}
                onChange={e => {
                  setValue('category', e)
                }}
                options={categories}
              />
            }}
          />
          {errors.category && <span className="text-red-500">This field is required</span>}
        </div>
<div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
                options={EXPENSE_STATUS_LIST}
              />
            }}
          />
          {errors.status && <span className="text-red-500">This field is required</span>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <Controller
            name={`type`}
            control={control}
            rules={{ required: true }}
            render={({ field }) => {
              return <OptionDropdown
                value={field.value}
                onChange={e => {
                  setValue('type', e)
                }}
                showUnselect={false}
                isSearch={false}
                options={EXPENSE_TYPE_LIST}
              />
            }}
          />
          {errors.type && <span className="text-red-500">This field is required</span>}
        </div>


        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="datetime-local"
            {...register("date")}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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