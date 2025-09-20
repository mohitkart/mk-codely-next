import ReactECharts from 'echarts-for-react';
import { useCallback, useMemo, useState } from 'react';
import { capitalize, getRandomCode } from '@/utils/shared';
import { getColor } from '.';
import pipeModel from '@/utils/pipeModel';

type Props = {
    animation?: boolean
    isLoading?: boolean
    hideLegends?: boolean
    hideLabelLegends?: boolean
    showTotal?: boolean
    suffix?: string
    prefix?: string
    data: any
    legends: {
        label: any
        key: any
        nameKey?: any
        color?: any
    }[]
    config?: {
        nameKey: any
        key: any
    }
    onClick?: any
}

export default function MkDoughnutChart({
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
    onClick = (_: any) => { }
}: Props) {
    const [hiddenItem, setHiddenItem] = useState<any>([])

    const cdata = useMemo(() => {
        const cdata = data.map((itm: any, i: any) => ({ ...itm, color: itm.color || getColor(i), id: getRandomCode(16) }))
        return cdata
    }, [data])

    const clegends = useMemo(() => {
        const clegends = legends.map((itm: any, i: any) => ({ ...itm, color: itm.color || getColor(i), id: getRandomCode(16) }))
        return clegends
    }, [legends])

    const setValue = (itm: any, data: any) => {
        let value = data?.[itm.key]
        if (itm?.extrakey && !value) {
            itm?.extrakey.map((eitm: any) => {
                if (data?.[eitm]) value = data?.[eitm]
            })
        }
        value = pipeModel.number(value)
        return value
    }

    const customTooltip = {
        trigger: 'item',
        formatter: function (params: any) {
            let data = params.data
            let html = `<b>${capitalize(data?.name)} (${params.percent}%)</b><br/>`
            clegends.map(itm => {
                html += `${capitalize(itm.label)}: ${prefix}${setValue(itm, data)}${suffix}<br/>`
            })
            return html
        }
    }

    const legendClick = (id: any) => {
        let arr: any = hiddenItem
        if (arr.includes(id)) {
            arr = arr.filter((fitm: any) => fitm != id)
        } else {
            arr.push(id)
        }
        setHiddenItem([...arr])
    }

    const performanceOption = useMemo(() => {
        return {
            animation,
            tooltip: customTooltip,
            legend: null,
            series: clegends
                .map((itm) => ({
                    name: capitalize(itm.label),
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    key: itm.key,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    emphasis: {
                        label: {
                            show: false,
                            fontSize: 20,
                            fontWeight: 'bold',
                            formatter: function (params: any) {
                                return `${params.value}`;
                            }
                        }
                    },
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false,
                    },
                    data: cdata.map((ditm: any) => ({
                        ...ditm,
                        value: ditm?.[itm.key || config?.key || 'value'],
                        name: (ditm?.[itm.nameKey || config?.nameKey || 'name'])
                    })).filter((fitm: any) => !hiddenItem.includes(fitm.id)),
                    color: cdata.filter((fitm: any) => !hiddenItem.includes(fitm.id)).map((itm: any) => itm.color),
                }))
                .filter((fitm: any) => !hiddenItem.includes(fitm.key))
        };
    }, [hiddenItem, cdata, clegends, config]);

    const getTotal = useCallback((key: any) => {
        let arr = cdata.map((ditm: any) => Number(ditm[key] || 0))
        return arr.length ? arr.reduce((total: any, value: any) => total + value) : 0
    }, [cdata])

    const handleChartClick = (e: any) => {
        onClick({ value: e.value, name: e.name, seriesName: e.seriesName, percent: e.percent })
    }

    return (
        <>
            {isLoading ? (
                <div className='shine shineCard'></div>
            ) : (
                <div>
                    {!hideLegends && (
                        <div className='legends flex flex-wrap justify-center gap-2'>
                            {clegends.map((itm: any, i: any) => {
                                if (!itm.hide)
                                    return (
                                        <div
                                            key={i}
                                            className={`flex capitalize gap-2 text-[12px] items-center cursor-pointer ${hiddenItem.includes(itm.key) ? 'active opacity-50' : ''}`}
                                            onClick={() => legendClick(itm.key)}
                                        >
                                            <div className='color w-[15px] h-[15px]' style={{ background: itm.color }}></div>
                                            {itm.label} {showTotal ? <>({pipeModel.number(getTotal(itm.key))})</> : null}
                                        </div>
                                    )
                            })}
                        </div>
                    )}
                    {!hideLabelLegends && (
                        <div className='legends flex flex-wrap justify-center gap-2'>
                            {cdata.map((itm: any, i: any) => {
                                if (!itm.hide)
                                    return (
                                        <div
                                            key={i}
                                            className={`flex capitalize gap-2 text-[12px] items-center cursor-pointer ${hiddenItem.includes(itm.id) ? 'active opacity-50' : ''}`}
                                            onClick={() => legendClick(itm.id)}
                                        >
                                            <div className='color w-[15px] h-[15px]' style={{ background: itm.color }}></div>
                                            {itm[config?.nameKey]} {showTotal ? <>({pipeModel.number(getTotal(itm.color))})</> : null}
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
}
