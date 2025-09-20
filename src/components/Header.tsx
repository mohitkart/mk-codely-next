import { useDispatch } from "react-redux"
import { logout } from "@/redux/slices/userSlice"
import OptionDropdown from "./OptionDropdown"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header({ user }: any) {
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const router=useRouter()  
  const navigate = (p = '') => {
    router.push(p)
  }

  const dispatch=useDispatch()
  const [unread,setUnread]=useState(0)
  const pathname=window.location.pathname

  const Logout=()=>{
    dispatch(logout())
  }

  useEffect(() => {
    // if (user) {
    //   const messagesRef = firebaseModel.firestore().collection('chat')
    //   var query1 = messagesRef
    //     .where('sendTo', '==', user.id)
    //     .where('read', '==',false)

    //     const unsubscribe=query1.onSnapshot(snapshot => {
    //     let length = snapshot.docs.length
    //     setUnread(length||0)
    //   }, err => {
    //   })

    //   return () => unsubscribe();
    // }
  }, [])

  
  return <>
     <nav className="bg-white shadow">
  <div className="container mx-auto px-4 flex flex-wrap items-center justify-between py-2">
    <Link className="text-xl font-semibold flex items-center" href="/">
      {pathname == '/tasks' ? (
        <img src="/img/mktaskly.png" className="w-[50px]" alt="logo" />
      ) : (
        'Mk Codely'
      )}
    </Link>

    {/* Mobile Toggle Button */}
    <button
      className="block lg:hidden text-gray-700 focus:outline-none"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div className={`w-full lg:flex lg:items-center lg:w-auto ${mobileMenuOpen ? '' : 'hidden'}`}>
      <ul className="lg:flex items-center gap-4 ml-auto space-y-2 lg:space-y-0 mt-4 lg:mt-0">
        <li>
          <Link className="text-black hover:text-blue-500" href="/">Home</Link>
        </li>
        <li>
          <Link className="hover:text-blue-500" href="/blogs">Blogs</Link>
        </li>
        <li>
          <Link className="hover:text-blue-500" href="/html">Html</Link>
        </li>
        {/* <li>
          <Link className="hover:text-blue-500" to="/tasks">Tasks</Link>
        </li>
        <li>
          <Link className="hover:text-blue-500" to="/music">Music</Link>
        </li> */}
        {/* <li className="relative">
          <Link className="hover:text-blue-500 relative" to="/chat">
            Chat
            {unread ? (
              <span className="absolute top-[-4px] right-[-3px] bg-red-500 text-white text-xs font-medium rounded-full h-5 min-w-[20px] flex items-center justify-center">
                {unread}
              </span>
            ) : null}
          </Link>
        </li> */}
        {/* <li>
          <Link className="hover:text-blue-500" to="/expenses">Expenses</Link>
        </li> */}
        <li>
          <Link className="hover:text-blue-500" href="/screen-recording">Screen Recording</Link>
        </li>
        {/* <li>
          <Link className="hover:text-blue-500" to="/dictionary">Dictionary</Link>
        </li> */}

        {user ? (
          <div className="">
            <OptionDropdown
            className='!border-0'
              placeholder={`Welcome ${user.name}`}
              isSearch={false}
              options={[
                // {
                //   name:'Dashboard',
                //   id:'/dashboard'
                // },
                // {
                //   name:'Calculation',
                //   id:'/calculation'
                // },
                {
                  name:'Logout',
                  id:'logout'
                }
              ]}
              onChange={(e:any)=>{
                if(e=='logout'){
                  Logout()   
                }else{
                  navigate(e)
                }
              }}
            />
          </div>
        ) : (
          <li>
            <Link className="hover:text-blue-500" href="/login">Login</Link>
          </li>
        )}
      </ul>
    </div>
  </div>
</nav>
  </>
}