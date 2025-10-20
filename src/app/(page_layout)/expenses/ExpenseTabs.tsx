import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ExpenseTabs({}){
    const pathname=usePathname()
    return <>
     <div className="mb-6">
            <div className="flex border-b border-gray-200">
                <Link href="/expenses" className={`${pathname=='/expenses'?'bg-blue-500 text-white':''} py-2 px-4 font-medium text-gray-600 rounded-t-lg hover:bg-gray-100 transition duration-200`}>
                    Expenses
                </Link>
                 <Link href="/expenses/contri" className={`${pathname=='/expenses/contri'?'bg-blue-500 text-white':''} py-2 px-4 font-medium text-gray-600 rounded-t-lg hover:bg-gray-100 transition duration-200`}>
                    Contribution & Payment
                </Link>
                <Link href="/expenses/persons" className={`${pathname=='/expenses/persons'?'bg-blue-500 text-white':''} py-2 px-4 font-medium text-gray-600 rounded-t-lg hover:bg-gray-100 transition duration-200`}>
                    Persons
                </Link>
                <Link href="/expenses/categories" className={`${pathname=='/expenses/categories'?'bg-blue-500 text-white':''} py-2 px-4 font-medium text-gray-600 rounded-t-lg hover:bg-gray-100 transition duration-200`}>
                    Categories
                </Link>
            </div>
        </div>
    </>
}