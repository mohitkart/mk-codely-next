'use client'
import { loaderHtml } from "@/utils/shared";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ApiClientB from "@/utils/Apiclient";
import { useState } from "react";
import { toast } from "react-toastify";
import envirnment from "@/envirnment";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { login } from "@/redux/slices/userSlice";

export default function Content() {
  const router = useRouter()
   const dispatch = useDispatch<AppDispatch>();
  const navigate = (p = '') => {
    router.push(p)
  }
  const { put, isLoading: loading } = ApiClientB()
  const searchParams= useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = () => {
    const payload = {
      password: form.password,
      q: q
    };

    if(form.password!=form.confirmPassword){
      toast.error("Confirm Password is not matched with New Password")
      return
    }

    loaderHtml(true)
    put('api/reset', { ...payload },envirnment.frontUrl).then(res => {
      if (res.success) {
        dispatch(login(res.data))
        navigate('/')
      }
      loaderHtml(false)
    })
  }
  return (
    <>
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          Mk Codely
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-md font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              Please create a new password that you don’t use on any other site.
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={e => { e.preventDefault(); handleSubmit() }}>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                <input type="password" name="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                <input type="password" name="password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <button type="submit"
                disabled={loading}
                className="cursor-pointer w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">{loading ? 'Save...' : 'Save'}</button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Just Remember? <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
