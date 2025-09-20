// import { BiBarChart, BiPieChart } from "react-icons/bi"
import MkBarChart from "./BarChart"
import colorsModel from "./color.model"
import MkDoughnutChart from "./DoughnutChart"
import MkLineChart from "./LineChart"
import MkSankeyChart from "./SankeyChart"
import { useState } from "react"

type Props = {
    chartType: 'doughnut' | 'line' | 'bar' | 'stats'|'sankey',
    animation?: boolean
    isLoading?: boolean
    hideLegends?: boolean
    hideLabelLegends?: boolean
    showTotal?: boolean
    suffix?: string
    prefix?: string
    data: any
    legends?: {
        label: any
        key: any
        nameKey?: any
        color?: any
    }[]
    config: {
        nameKey: any
        key: any
    }
    onClick?: (_:any)=>void
    yName?:string
    noOptions?:boolean
    dataColor?:boolean
}
const MkChart = ({ chartType = 'line',
    animation = false,
    suffix = '',
    prefix = '',
    data = [],
    legends = [],
    config = { nameKey: 'date', key: 'value' },
    isLoading = false,
    hideLegends = false,
    hideLabelLegends = false,
    showTotal = false,
    onClick = (_: any) => { },
    yName='',
    dataColor=false,
    noOptions=false
}: Props) => {
  const [currentChart, setCurrentChart] = useState<any>(chartType)
   const options = [
        { id: "bar", name: "Bar Chart", icon: ''
        // <BiBarChart />
     },
        // { id: "line", name: "Line Chart", icon: <BiLineChart /> },
        { id: "doughnut", name: "Doughnut Chart", icon: ''
        // <BiPieChart />
     },
        // { id: "table", name: "Table View", icon: <BiTable /> }
    ]

    return <>
        {currentChart == 'doughnut' ? <>
            <MkDoughnutChart
                data={data}
                legends={legends}
                hideLegends={hideLegends}
                hideLabelLegends={hideLabelLegends}
                isLoading={isLoading}
                onClick={onClick}
                config={config}
                showTotal={showTotal}
                suffix={suffix}
                prefix={prefix}
                animation={animation}
            />
        </> : <></>}
         {currentChart == 'line' ? <>
            <MkLineChart
                yName={yName}
                data={data}
                legends={legends}
                hideLegends={hideLegends}
                isLoading={isLoading}
                onClick={onClick}
                config={config}
                showTotal={showTotal}
                suffix={suffix}
                prefix={prefix}
                animation={animation}
            />
        </> : <></>}
         {currentChart == 'bar' ? <>
            <MkBarChart
                yName={yName}
                data={data}
                dataColor={dataColor}
                legends={legends}
                hideLegends={hideLegends}
                isLoading={isLoading}
                onClick={onClick}
                config={config}
                showTotal={showTotal}
                suffix={suffix}
                prefix={prefix}
                animation={animation}
            />
        </> : <></>}
         {currentChart == 'sankey' ? <>
         {/* flow diagram chart */}
            <MkBarChart
                yName={yName}
                data={data}
                legends={legends}
                hideLegends={hideLegends}
                isLoading={isLoading}
                onClick={onClick}
                config={config}
                showTotal={showTotal}
                suffix={suffix}
                prefix={prefix}
                animation={animation}
            />
        </> : <></>}

        {!noOptions?<>
         <div className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-4 space-4 mt-3 px-4 py-2 bg-white border-gray-200  border rounded-lg">
            {options.map((itm, i) => {
                return <p key={i} onClick={() => {
                    if (itm.id == 'table') {
                        // if (tableClick) tableClick()
                        // else setCurrentChart(itm.id)
                    } else {
                        setCurrentChart(itm.id)
                    }
                }} className={`${currentChart == itm.id ? '!text-primary font-semibold' : ''} cursor-pointer flex gap-2 items-center relative font-normal text-gray-700 text-muted-foreground hover:text-primary transition-all text-sm`}>
                    {itm.icon}
                    {itm.name}
                </p>
            })}
        </div>
        </>:<></>}
    </>
}

export default MkChart

const { getColor, getRandomColor, getRandomLightColor } = colorsModel

export {
    getColor,
    getRandomColor,
    getRandomLightColor,
    MkBarChart,
    MkDoughnutChart,
    MkLineChart,
    MkSankeyChart
}
