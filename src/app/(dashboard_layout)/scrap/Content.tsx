'use client'
import {useState } from "react";
import FireApi from "@/utils/firebaseApi.utils";
import { loaderHtml } from "@/utils/shared";
import { toast } from "react-toastify";
export default function Content() {
    const {get,post}=FireApi()
    const tables = [
        { id: 'categories', name: 'Categories' },
        { id: 'code', name: 'Code' },
        { id: 'html', name: 'Html' },
        { id: 'blogs', name: 'Blogs' },
        { id: 'dictionary', name: 'Dictionary' },
    ]
    const [scrapData, setScrapData] = useState([])
    const [table, setTable] = useState('')
    const [text, setText] = useState('')
    const [tab, setTab] = useState('export')
    const [notAdded, setNotAdded] = useState<any>([])

    const tableChange = async (e: string) => {
        setTable(e)
        if (tab == 'export' && e) {
            // loaderHtml(true)
        }
    }


    const tabChange = (e: string) => {
        setTab(e)
        setTable('')
        setText('')
        setScrapData([])
    }

    const copy = () => {
        const url = JSON.stringify(scrapData)
        navigator.clipboard.writeText(url);
        toast.success('Copyed')
    }

    const importData = async () => {
        if (!text || !table) return
        const scrap = JSON.parse(text)
        loaderHtml(true)
        const res = []
        const categoryError = []
        for await (const itm of scrap) {
            const name = itm?.name || itm.title
            if (itm.category) {
                const afunction = async () => {
                    await get('categories',[{field:'scrapId',operator:'==',value:itm.category}]).then(res => {
                        const fres = res.docs.map((itm:any) => {
                            return {
                                ...itm.data(),
                                id: itm.id
                            }
                        })
                        if (fres.length) {
                            itm.category = fres[0].id
                        } else {
                            itm.category = ''
                        }
                    }, err => {
                        categoryError.push(itm)
                        localStorage.setItem('categoryError', JSON.stringify(notAdded))
                        console.error(`category err - ${name}`, err)
                    })
                }
                await afunction()
            }

            res.push({ ...itm, date: new Date().toISOString() })
        }

        //   return
        res.map(ritm => {
            const name = ritm?.name || ritm.title
            post(table,ritm).then(fres => {
            }, err => {
                notAdded.push(ritm)
                localStorage.setItem('notAdded', JSON.stringify(notAdded))
                console.error(`add err - ${name}`, err)
            })
        })
        loaderHtml(false)
    }

    const writeFile = () => {
        const link = document.createElement("a");
        const jsondata = {
            table: table,
            data: scrapData
        }

        const content = JSON.stringify(jsondata);
        const file = new Blob([content], { type: 'text/plain' });
        link.href = URL.createObjectURL(file);
        const datetime = new Date().toISOString()
        link.download = `mohitk-art-${table}-${datetime}.backup`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function isJsonString(str: any) {
        if (!str) return true
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    const readFile = (e: any) => {
        const files = e.target.files
        const fr = new FileReader();
        fr.onload = function () {
            const result = fr.result
            if (isJsonString(result)) {
                const jsondata = JSON.parse(String(result))
                setTable(jsondata.table)
                setText(JSON.stringify(jsondata.data))
            } else {
                setText('')
                setTable('')
            }
        }
        fr.readAsText(files[0]);
    }

    return (
        <>
          <div className="max-w-6xl mx-auto py-4">
  {/* Tabs */}
  <ul className="flex border-b mb-3">
    <li>
      <button
        onClick={() => tabChange("export")}
        className={`px-4 py-2 -mb-px border-b-2 transition-colors duration-200 ${
          tab === "export"
            ? "border-blue-500 text-blue-500 font-semibold"
            : "border-transparent text-gray-500 hover:text-blue-500"
        }`}
      >
        Export
      </button>
    </li>
    <li>
      <button
        onClick={() => tabChange("import")}
        className={`px-4 py-2 -mb-px border-b-2 transition-colors duration-200 ${
          tab === "import"
            ? "border-blue-500 text-blue-500 font-semibold"
            : "border-transparent text-gray-500 hover:text-blue-500"
        }`}
      >
        Import
      </button>
    </li>
  </ul>

  {/* Controls */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    {/* Select Table */}
    <div>
      <select
        value={table}
        disabled={tab === "import"}
        onChange={(e) => tableChange(e.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
      >
        <option value="">Select Table</option>
        {tables.map((itm, i) => (
          <option key={i} value={itm.id}>
            {itm.name}
          </option>
        ))}
      </select>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-wrap items-center gap-2">
      {tab === "import" ? (
        <>
          <button
            onClick={importData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Import
          </button>

          <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
            <input
              type="file"
              onChange={readFile}
              className="hidden"
            />
            Upload
          </label>
        </>
      ) : (
        <>
          <button
            onClick={copy}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Copy
          </button>
          <button
            onClick={writeFile}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Backup download
          </button>
        </>
      )}
    </div>
  </div>

  {/* Textarea */}
  <textarea
    disabled
    value={text}
    onChange={(e) => setText(e.target.value)}
    className="w-full h-40 p-3 rounded-lg border border-gray-300 shadow-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
  ></textarea>
</div>

        </>
    );
}
