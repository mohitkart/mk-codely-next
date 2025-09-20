import ReactECharts from 'echarts-for-react';
import { memo, useCallback, useMemo, useState } from 'react';

import { getColor } from '.';
import pipeModel from '@/utils/pipeModel';
import { capitalize, getRandomCode } from '@/utils/shared';

type Props = {
    animation?: boolean
    isLoading?: boolean
    hideLegends?: boolean
    showTotal?: boolean
    dataColor?: boolean
    stack?: string
    suffix?: string
    prefix?: string
    yName?: string
    barType?: "vertical" | "horizontal"   // 👈 new prop
    data: any
    legends: {
        label: any
        key: any
        color?: any
    }[]
    config: {
        nameKey: any
    }
    onClick?: any
}

export default memo(function MkBarChart({
    animation = true,
    suffix = '',
    prefix = '',
    stack = '',
    yName = '',
    dataColor = false,
    barType = "vertical",   // 👈 default to vertical
    data = [],
    legends = [],
    config = { nameKey: 'date' },
    isLoading = false,
    hideLegends = false,
    showTotal = false,
    onClick = (_: any) => { }
}: Props) {
    const [hiddenItem, setHiddenItem] = useState<any>([])
    
    const clegends = useMemo(() => {
        const clegends = legends.map((itm: any, i: any) => ({ ...itm, color: itm.color || getColor(i) }))
        return clegends
    }, [legends])

     const cdata = useMemo(() => {
            const cdata = data.map((itm: any, i: any) => ({ ...itm, color: itm.color || getColor(i), id: itm?.id||getRandomCode(16) }))
            return cdata
        }, [data])

    const setValue = (value: any) => pipeModel.number(value)


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
        const isHorizontal = barType === "horizontal";

        return {
            animation,
            tooltip: customTooltip,
            legend: null,
            grid: {
                left: yName ? 60 : 40,
                right: 20,
                top: 30,
                bottom: 40,
                containLabel: true
            },
            xAxis: [
                isHorizontal
                    ? {
                        type: 'value',
                        name: yName || null,
                        nameLocation: 'middle',
                        nameGap: yName ? 45 : null,
                        nameTextStyle: yName ? { fontSize: 14 } : null,
                    }
                    : {
                        type: 'category',
                        data: cdata.map((itm: any) => itm?.[(config?.nameKey) || 'date']),
                        axisLabel: {
                            formatter: (value: any) => `${capitalize(value)}`
                        }
                    }
            ],
            yAxis: [
                isHorizontal
                    ? {
                        type: 'category',
                        data: cdata.map((itm: any) => itm?.[(config?.nameKey) || 'date']),
                        axisLabel: {
                            formatter: (value: any) => `${capitalize(value)}`
                        }
                    }
                    : {
                        type: 'value',
                        name: yName || '',
                        nameLocation: 'middle',
                        nameGap: yName ? 45 : null,
                        nameTextStyle: yName ? { fontSize: 14 } : null,
                        axisLabel: {
                            formatter: (value: any) => `${prefix}${String(value).includes('.') ? '' : value}${suffix}`
                        }
                    }
            ],
            series: clegends
                .map((itm) => ({
                    name: capitalize(itm.label),
                    key: itm.key,
                    type: 'bar',
                    stack: stack || null,
                    itemStyle: {
                        normal: {
                            areaStyle: { type: 'default' },
                            color: itm.color
                        }
                    },
                    data: cdata.map((ditm: any, di: any) => ({
                        value: Number(ditm[itm.key] || 0),
                        itemStyle: {
                            color: dataColor ? (ditm?.color) : null
                        }
                    }))
                }))
                .filter((fitm: any) => !hiddenItem.find((eitm: any) => eitm.key == fitm.key || eitm.compare == fitm.key))
        };
    }, [hiddenItem, cdata, clegends, barType]);

    const getTotal = useCallback((key: any) => {
        let arr = cdata.map((ditm: any) => Number(ditm[key] || 0))
        return arr.length ? arr.reduce((total: any, value: any) => total + value) : 0
    }, [cdata])

    const handleChartClick = (e: any) => {
        onClick({ value: e.value, name: e.name, seriesName: e.seriesName })
    }

    return (
        <>
            {isLoading ? (
                <div className='shine shineCard'></div>
            ) : (
                <div>
                    {!hideLegends && (
                        <div className='legends flex flex-wrap justify-center gap-2'>
                            {clegends.map((itm, i) => {
                                if (!itm.hide)
                                    return (
                                        <div
                                            key={i}
                                            className={`flex gap-2 text-[12px] items-center cursor-pointer ${hiddenItem.find((fitm: any) => fitm.key == itm.key) ? 'active opacity-50' : ''}`}
                                            onClick={() => legendClick(itm)}
                                        >
                                            <div className='color w-[15px] h-[15px]' style={{ background: itm.color }}></div>
                                            {itm.label} {showTotal ? <>({pipeModel.number(getTotal(itm.key))})</> : null}
                                        </div>
                                    )
                            })}
                        </div>
                    )}
                    <ReactECharts
                        option={performanceOption}
                        style={{ height: 350 }}
                        onEvents={{ click: handleChartClick }}
                    />
                </div>
            )}
        </>
    )
})
