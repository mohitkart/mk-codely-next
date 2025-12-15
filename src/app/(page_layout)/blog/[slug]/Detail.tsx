'use client'
import ImageHtml from "@/components/ImageHtml"
import datepipeModel from "@/utils/datepipemodel"
import FireApi from "@/utils/firebaseApi.utils"
import { noImg } from "@/utils/shared"
import { getShortCode } from "@/utils/shared.utils"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const table = 'blogs'

export default function BlogDetail() {
  const { slug } = useParams()
  const { get: getDetail, isLoading: detailLoading } = FireApi()
  const { get: getRecent, isLoading: recentLoading } = FireApi()
  const { get: getCategory, isLoading: catLoading } = FireApi()
  const { get: getCategoryList, isLoading: categoryLoading } = FireApi()
  const [loaderData, setLoaderData] = useState<any>()
  const [category, setCategory] = useState<any>()
  const [categories, setCategories] = useState<any>([])
  const [recentPost, setRecentPost] = useState<any>([])
  const [search, setSearch] = useState<any>('')
  const router = useRouter()
  const navigate = (p = '') => {
    router.push(p)
  }

  const gtCatDetail = async () => {
    const res = await getCategory('categories', [], loaderData.category)
    setCategory(res.data)
  }

  const getCategories = async () => {
    const res = await getCategoryList('categories', [{ field: 'type', operator: '==', value: 'blog' }])
    let data = []
    if (res.data) {
      data = res.data
    }
    setCategories(data)
  }


  useEffect(() => {
    getDetail(table, [], slug).then(res => {
      if (res.success) {
        const data1 = res.data
        data1.description = getShortCode(data1.description)
        setLoaderData(data1)
      }
    })
    getCategories()
    getRecent(table, [], '', false, 'createdAt', 'desc', 5).then(res => {
      if (res.success) {
        setRecentPost(res.data)
      }
    })
  }, [])

  useEffect(() => {
    if (loaderData) {
      gtCatDetail()
    }
  }, [loaderData])

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="lg:flex lg:space-x-12">
        {detailLoading ? <>
          <article className="lg:w-2/3">
            <div className="h-[20px] shine mb-3"></div>
            <div className="h-[30px] shine mb-3"></div>
            <div className="h-[60px] max-w-[150px] shine mb-3"></div>
            <div className="h-[300px] shine mb-3 rounded"></div>
            <div className="h-[10px] shine mb-3 rounded"></div>
            <div className="h-[10px] shine mb-3 rounded"></div>
            <div className="h-[10px] shine mb-3 rounded"></div>
            <div className="h-[10px] shine mb-3 rounded"></div>
            <div className="h-[10px] shine mb-3 rounded"></div>
          </article>
        </> : <>
          {loaderData ? <>
            <article className="lg:w-2/3">
              {catLoading ? <>
                <div className="shine w-[300px] h-[20px]"></div>
              </> : <>
                <nav className="text-sm text-gray-500 mb-6">
                  <Link href="/blog" className="hover:text-primary">Blogs</Link> / <Link href={`/blog?category=${category?.id}`} className="hover:text-primary">{category?.name}</Link> / <span className="text-gray-700">{loaderData?.title}</span>
                </nav>
              </>}
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">{loaderData?.title}</h1>
                <div className="flex items-center text-gray-600">
                  <ImageHtml
                    height={40}
                    width={40}
                    src="/img/placeholder.png" alt="Author" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-medium">Michael Chen</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>{datepipeModel.datetime(loaderData?.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </header>

              {(loaderData?.image || category?.image) ? <>
                <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
                  <ImageHtml
                    height={415}
                    width={970}
                    src={noImg((loaderData?.image || category?.image), 'blogs')} alt={loaderData?.title} className="bg-gray-200 w-full h-auto object-cover" />
                </div>
              </> : <></>}

              <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: loaderData?.description }}></div>
              <div className="mb-8">
                <h3 className="font-semibold text-dark mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {loaderData?.tags?.map((tag: any, i: any) => {
                    return <Link href={`/blog?tags=${tag}`} key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-600 hover:text-white transition">{tag}</Link>
                  })}
                </div>
              </div>


              <div className="border-t border-b border-gray-200 py-6 mb-8">
                <h3 className="font-semibold text-dark mb-3">Share this article:</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                    <i className="fab fa-pinterest-p"></i>
                  </a>
                </div>
              </div>


              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <ImageHtml
                    height={40}
                    width={40}
                    src="/img/placeholder.png" alt="Author" className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <h3 className="font-bold text-lg text-dark">About Michael Chen</h3>
                    <p className="text-gray-600 mt-2">Michael is a senior web developer with over 10 years of experience in building scalable web applications. He is passionate about JavaScript frameworks, UX design, and the future of web technologies.</p>
                    <div className="flex space-x-4 mt-4">
                      <a href="#" className="text-gray-500 hover:text-primary"><i className="fab fa-twitter"></i></a>
                      <a href="#" className="text-gray-500 hover:text-primary"><i className="fab fa-github"></i></a>
                      <a href="#" className="text-gray-500 hover:text-primary"><i className="fab fa-linkedin"></i></a>
                    </div>
                  </div>
                </div>
              </div>


              <div className="mb-8">
                <h2 className="text-2xl font-bold text-dark mb-6">Comments (3)</h2>

                <div className="space-y-6">

                  <div className="flex">
                    <ImageHtml
                      height={40}
                      width={40}
                      src="/img/placeholder.png" alt="User" className="w-12 h-12 rounded-full mr-4" />
                    <div className="flex-1">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">Sarah Johnson</h4>
                          <span className="text-sm text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-gray-700">{`Great insights! I've been using WebAssembly in my recent projects and the performance gains are incredible. Looking forward to more articles on this topic.`}</p>
                        <div className="mt-3 flex items-center space-x-4">
                          <button className="text-sm text-gray-500 hover:text-primary"><span className="material-symbols-outlined">reply</span> Reply</button>
                          <button className="text-sm text-gray-500 hover:text-primary"><span className="material-symbols-outlined">heart_plus</span> Like</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <ImageHtml
                      height={40}
                      width={40}
                      src="/img/placeholder.png" alt="User" className="w-12 h-12 rounded-full mr-4" />
                    <div className="flex-1">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">Sarah Johnson</h4>
                          <span className="text-sm text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-gray-700">{`Great insights! I've been using WebAssembly in my recent projects and the performance gains are incredible. Looking forward to more articles on this topic.`}</p>
                        <div className="mt-3 flex items-center space-x-4">
                          <button className="text-sm text-gray-500 hover:text-primary"><span className="material-symbols-outlined">reply</span> Reply</button>
                          <button className="text-sm text-gray-500 hover:text-primary"><span className="material-symbols-outlined">heart_plus</span> Like</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-dark mb-4">Leave a comment</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                      <textarea id="comment" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <button type="submit" className="px-6 py-2 bg-blue-600 cursor-pointer text-white font-medium rounded-lg hover:bg-blue-700 transition">Post Comment</button>
                  </form>
                </div>
              </div>
            </article>
          </> : <>
            <article className="lg:w-2/3">
              <h1 className="font-bold text-[20px] text-center">Blog Not Found</h1>
            </article>
          </>}
        </>}

        <aside className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="font-semibold text-dark mb-4">Search</h3>
            <form className="relative" onSubmit={e => { e.preventDefault(); navigate(`/blog?search=${search.trim()}`) }}>
              <input type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
              <button className="cursor-pointer absolute right-2 top-2 text-gray-500 hover:text-primary">
                <span className="material-symbols-outlined">search</span>
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="font-semibold text-dark mb-4">Categories</h3>
            <ul className="space-y-2">
              {categoryLoading ? <>
                <div className="shine h-[20px] mb-3"></div>
                <div className="shine h-[20px] mb-3"></div>
                <div className="shine h-[20px] mb-3"></div>
                <div className="shine h-[20px] mb-3"></div>
                <div className="shine h-[20px] mb-3"></div>
                <div className="shine h-[20px] mb-3"></div>
                <div className="shine h-[20px] mb-3"></div>
              </> : <>
                {categories?.map((item: any, i: any) => {
                  return <li key={i}><Link href={`/blog?category=${item.id}`} className="text-gray-700 hover:text-primary flex justify-between"><span>{item.name}</span>
                    {/* <span>(12)</span> */}
                  </Link></li>
                })}
              </>}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="font-semibold text-dark mb-4">Popular Posts</h3>
            <div className="space-y-4">
              {recentLoading ? <>
                <div className="shine h-[60px] mb-2"></div>
                <div className="shine h-[60px] mb-2"></div>
                <div className="shine h-[60px] mb-2"></div>
              </> : <>
                {recentPost.map((item: any, i: any) => {
                  return <div className="flex" key={i}>
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageHtml
                        height={64}
                        width={64}
                        src={noImg(item.image, 'blogs')}
                        alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4">
                      <a href="#" className="font-medium text-dark hover:text-primary line-clamp-2">{item.title}</a>
                      <p className="text-sm text-gray-500 mt-1">{datepipeModel.datetime(item.createdAt)}</p>
                    </div>
                  </div>
                })}
              </>}
            </div>
          </div>

          {/* <div className="bg-gradient-to-r from-primary to-blue-400 rounded-xl shadow-sm p-6 text-white bg-blue-600">
            <h3 className="font-semibold text-xl mb-4">Subscribe to our newsletter</h3>
            <p className="mb-4">Get the latest articles, tips, and news delivered to your inbox.</p>
            <form className="space-y-3" onSubmit={e => { e.preventDefault() }}>
              <input type="email" placeholder="Your email address" className="w-full bg-white px-4 py-2 rounded-lg text-[#000]" />
              <button type="submit" className="w-full bg-[#000] cursor-pointer text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition">Subscribe</button>
            </form>
          </div> */}
        </aside>
      </div>
    </main>
  );
}
