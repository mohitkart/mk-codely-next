'use client'
import { loaderHtml } from "@/utils/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ApiClientB from "@/utils/Apiclient";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import envirnment from "@/envirnment";
import { fire } from "@/components/Swal";

type FormType = {
  name: string
  email: string
  password: string
  confirmPassword?: string
}

export default function Content() {
  const router = useRouter()
  const navigate = (p = '') => {
    router.push(p)
  }
  const { post, isLoading: loading } = ApiClientB()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({ defaultValues: { name: '', email: '', password: '', confirmPassword: '' } })

  const onSubmit: SubmitHandler<FormType> = (data) => {

    if (data.password !== data.confirmPassword) {
      toast.error('Confirm Password is not matched with Password')
      return
    }
    const payload = {
      ...data
    }
    delete payload.confirmPassword
    loaderHtml(true)
    post('api/signup', { ...payload }, {}, envirnment.frontUrl).then(res => {
      if (res.success) {
        navigate('/')
        fire({icon:'success',title:'Verification link sent! Check your email to continue.'})
      }
      loaderHtml(false)
    })
  }
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen">
          <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Mk Codely
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Register
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                  <input type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder=""
                    {...register("name")}
                    required />
                  {errors.name && <span>This field is required</span>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input type="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder=""
                    {...register("email")}
                    required />
                  {errors.email && <span>This field is required</span>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="*************"
                    {...register("password")}
                    minLength={8}
                    required />
                  {errors.password && <span>This field is required</span>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                  <input type="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="*************"
                    {...register("confirmPassword")}
                    minLength={8}
                    required />
                  {errors.confirmPassword && <span>This field is required</span>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="remember"
                        required
                        aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">I acknowledge the Terms and Conditions.</label>
                    </div>
                  </div>
                </div>
                <button type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">{loading ? 'Sign in...' : 'Sign in'}</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account? <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
