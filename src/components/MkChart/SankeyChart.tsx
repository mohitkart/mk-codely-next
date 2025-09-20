import ReactECharts from 'echarts-for-react';
import { useCallback, useMemo, useState } from 'react';
import pipeModel from '@/utils/pipeModel';
import { capitalize } from '@/utils/shared';
import { getColor } from '.';
type Props = {
    animation: boolean
    isLoading: boolean
    hideLegends: boolean
    showTotal: boolean
    suffix: string
    prefix: string
    yName: string
    data: any
    legends?: {
        label: any
        key: any
        color?: any
    }[]
    config: {
        nameKey: any
    }
    onClick: any
}
export default function MkSankeyChart({ animation = false, suffix = '', prefix = '', yName = '', data = [], legends = [], config = { nameKey: 'date' }, isLoading = false, hideLegends = false, showTotal = false, onClick = (_: any) => { } }: Props) {
    const [hiddenItem, setHiddenItem] = useState<any>([])
    const clegends=legends.map((itm:any,i:any)=>({...itm,color:itm.color||getColor(i)}))
    const customTooltip = {
        trigger: 'axis',
        formatter: function (params: any) {
            // Ensure params is an array
            if (!Array.isArray(params)) params = [params];

            let html = `<b>${capitalize(params[0]?.axisValueLabel || params[0]?.axisValue)}</b><br/>`;

            params.forEach((item: any) => {
                html += `<div class="flex gap-1 items-center">
                <span class="rounded-full h-[10px] w-[10px] bg-[${item.color}]"></span>
                ${capitalize(item.seriesName)}: 
                <b>${prefix}${setValue(item.value ?? 0)}${suffix}</b>
                </div>`;
            });
            return html;
        }
    }

    const setValue = (value: any) => {
        return pipeModel.number(value)
    }

    const legendClick = (itm: any) => {
        let arr: any = hiddenItem
        if (arr.find((fitm: any) => fitm.key == itm.key)) {
            arr = arr.filter((fitm: any) => fitm.key != itm.key)
        } else {
            arr.push(itm)
        }
        setHiddenItem([...arr])
    }

    const performanceOption = useMemo(() => {
        return {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                series: [
                    {
                        type: 'sankey',
                        layout: 'none',
                        emphasis: {
                            focus: 'adjacency'
                        },
                        data: [
                            {name: 'Free Members'},
                            {name: 'Paid Members'},
                            {name: 'Dormant'},
                            {name: 'Active'},
                            {name: 'Cancelled'}
                        ],
                        links: [
                            {source: 'Free Members', target: 'Paid Members', value: 15},
                            {source: 'Free Members', target: 'Dormant', value: 10},
                            {source: 'Free Members', target: 'Cancelled', value: 5},
                            {source: 'Paid Members', target: 'Active', value: 12},
                            {source: 'Paid Members', target: 'Cancelled', value: 3},
                            {source: 'Dormant', target: 'Active', value: 7},
                            {source: 'Dormant', target: 'Cancelled', value: 3}
                        ],
                        lineStyle: {
                            color: 'gradient',
                            curveness: 0.5
                        }
                    }
                ]
            };
    }, [hiddenItem, data, clegends])

    const getTotal = useCallback((key: any) => {
        let value = 0
        const arr = data.map((ditm: any) => Number(ditm[key] || 0))
        if (arr.length) value = arr.reduce((total: any, value: any) => total + value)
        return value
    }, [data])


    const handleChartClick = (e: any) => {
        const value = {
            value: e.value,
            name: e.name,
            seriesName: e.seriesName
        }
        onClick(value)
    }
    return <>
        {isLoading ? <>
            <div className='shine shineCard'></div>
        </> : <>
            <div className=''>
                {!hideLegends ? <>
                    <div className='legends flex flex-wrap justify-center gap-2'>
                        {clegends.map((itm, i: any) => {
                            if (!itm.hide)
                                return <>
                                    <div key={i} className={`flex gap-2 text-[12px] items-center cursor-pointer ${hiddenItem.find((fitm: any) => fitm.key == itm.key) ? 'active opacity-50' : ''}`} onClick={() => legendClick(itm)}>
                                        <div className='color w-[15px] h-[15px]' style={{ background: itm.color }}></div>
                                        {itm.label} {showTotal ? <>({pipeModel.number(getTotal(itm.key))})</> : <></>}</div>
                                </>
                        })}
                    </div>
                </> : <></>}

                <ReactECharts
                    option={performanceOption}
                    style={{ height: 350 }}
                    onEvents={{
                        click: handleChartClick,
                    }}
                />
            </div>
        </>}
    </>
}