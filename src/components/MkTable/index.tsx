export interface MkTableColumn {
    key: string;
    name: string;
    render: (_: any) => any;
    sort?: boolean;
}
export interface MkTableProps {
    columns: MkTableColumn[];
    data: any[];
    total: number;
    count?: number;
    isLoading?: boolean;
}
export default function MKTable({ columns, data, total = 0, count = 50, isLoading = false }: MkTableProps) {
    if (isLoading) return <>
        <div className="shine h-[50px] mb-1"></div>
        <div className="shine h-[50px] mb-1"></div>
        <div className="shine h-[50px] mb-1"></div>
        <div className="shine h-[50px] mb-1"></div>
        <div className="shine h-[50px] mb-1"></div>
        <div className="shine h-[50px] mb-1"></div>
    </>

    if(!total) return <>
    <div className="text-center p-4">No Data Found</div>
    </>
    
    return <>
    <div className="text-right mb-3">Total: {total}</div>
        <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        {columns.map((item, i) => {
                            return <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{item.name}</th>
                        })}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, i) => {
                        return <tr className="table-row" key={i}>
                            {columns.map((citm, ci) => {
                                return <td className="px-6 py-4 whitespace-nowrap" key={ci}>
                                    {citm.render(item)}
                                </td>
                            })}
                        </tr>
                    })}
                </tbody>
            </table>
        </div>


        {/* <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-700 mb-4 md:mb-0">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{count}</span> of <span className="font-medium">{total}</span> results
            </div>
            <div className="flex items-center space-x-2">
                <button className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                    Previous
                </button>
                <button className="px-3 py-1 rounded-lg bg-blue-600 text-white">1</button>
                <button className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">2</button>
                <button className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">3</button>
                <button className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center">
                    Next
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </div>
        </div> */}
    </>
}