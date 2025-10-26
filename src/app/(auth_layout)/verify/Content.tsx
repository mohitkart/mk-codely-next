'use client'
import { fire } from "@/components/Swal";
import { login } from "@/redux/slices/userSlice";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Content({ response }: { response: any }) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>();
  const navigate = (p = '') => {
    router.push(p)
  }


  useEffect(() => {
    if (response) {
      if (!response.success) {
        fire({ icon: 'error', description: response.message }).then(res => {
          navigate('/')
        })
      } else {
        fire({ icon: 'success', description: 'Verified Successfully' }).then(res => {
          navigate('/')
        })
        dispatch(login(response.data))
      }
    }
  }, [])


  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Mk Codely
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Verify
              </h1>
              {/* <form className="space-y-4 md:space-y-6" onSubmit={e => { e.preventDefault(); handleSubmit() }}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" name="email" id="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
              </div>
              <button type="submit"
              disabled={loading}
              className="w-full cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">{loading?'Send Recovery Email...':'Send Recovery Email'}</button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Just Remember? <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Log in</Link>
              </p>
            </form> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
