'use client'

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { CategoryType, PersonType } from "./Content";
import "./balancestyle.css"
import { useMemo, useState } from "react";
import pipeModel from "@/utils/pipeModel";
import { toast } from "react-toastify";
import Modal from "@/components/Modal";
import ViewExpenses from "./ViewExpenses";
import datepipeModel from "@/utils/datepipemodel";

type ModalType = {
  data: any[]
  persons: PersonType[]
  categories: CategoryType[]
}

export default function Balance({ data, persons, categories }: ModalType) {
  const user: any = useSelector((state: RootState) => state.user.data);
  const [filters, setFilter] = useState({
    receiver: ''
  })
  const [listModal, setListModal] = useState<any>(null)

  const total = useMemo(() => {
    const t = data.map((itm: any) => Number(itm.price || 0)).reduce((p, c) => c + p, 0)
    return t
  }, [data])

  const balanceList = useMemo(() => {
    const balances: any = {};
    persons.forEach((person: any) => {
      balances[person.id] = {
        totalPaid: 0,
        totalShare: 0,
        balance: 0
      };
    });

    data.forEach(expense => {
      const amount = Number(expense.price || 0);
      const paidBy = expense.paidBy;
      const participants = expense.persons;

      if (isNaN(amount) || !participants || participants.length === 0) {
        console.warn(`Invalid expense: ${expense.id}`);
        return;
      }

      // Calculate share per person
      const sharePerPerson = amount / participants.length;

      // Update balances
      participants.forEach((personId: any) => {
        if (balances[personId]) {
          balances[personId].totalShare += sharePerPerson;
        }
      });

      // Update paid amount for the person who paid
      if (balances[paidBy]) {
        balances[paidBy].totalPaid += amount;
      }
    });

    return Object.keys(balances).map(personId => {
      return {
        ...balances[personId],
        balance: balances[personId].totalPaid - balances[personId].totalShare,
        person: persons.find(itm => itm.id == personId),
      }
    });
  }, [data, persons])

  const settlementList = useMemo(() => {
    const creditors: any[] = [];
    const debtors: any[] = [];

    // Separate creditors and debtors
    balanceList.forEach((balanceData) => {
      const personId = balanceData?.person?.id || ''
      if (balanceData.balance > 0) {
        creditors.push({
          personId,
          amount: balanceData.balance,
          ...persons.find(itm => itm.id == personId)
        });
      } else if (balanceData.balance < 0) {
        debtors.push({
          personId,
          amount: Math.abs(balanceData.balance),
          ...persons.find(itm => itm.id == personId)
        });
      }
    });

    // Sort creditors (highest first) and debtors (highest first)
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const settlements = [];
    let creditorIndex = 0;
    let debtorIndex = 0;

    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex];
      const debtor = debtors[debtorIndex];

      const settlementAmount = Math.min(creditor.amount, debtor.amount);

      settlements.push({
        from: debtor,
        to: creditor,
        amount: parseFloat(settlementAmount.toFixed(2))
      });

      // Update remaining amounts
      creditor.amount -= settlementAmount;
      debtor.amount -= settlementAmount;

      // Move to next creditor/debtor if current one is settled
      if (creditor.amount === 0) creditorIndex++;
      if (debtor.amount === 0) debtorIndex++;
    }

    return settlements;
  }, [data, balanceList, filters.receiver])

  const calculationList = useMemo(() => {
    if (!Array.isArray(persons) || !Array.isArray(data)) return [];

    return persons.map(payer => {
      // Total amount paid by this person (excluding 'Hold')
      const paidItems = data.filter(
        item => item.paidBy === payer.id && item.status !== 'Hold'
      );

      const totalPaid =
        paidItems.length > 0
          ? paidItems
            .map(item => Number(item.price || 0) / (item?.persons?.length || 1))
            .reduce((sum, val) => sum + val, 0)
          : 0;

      // List of other persons involved with contribution details
      const personContributions = persons
        .filter(p => p.id !== payer.id)
        .map(receiver => {
          // Amount this payer spent for receiver
          const sharedItems = data.filter(
            item =>
              item.paidBy === payer.id &&
              item.status !== 'Hold' &&
              item.persons?.includes(receiver.id)
          );

          const myAmount =
            sharedItems.length > 0
              ? sharedItems
                .map(item => Number(item.price || 0) / (item?.persons?.length || 1))
                .reduce((sum, val) => sum + val, 0)
              : 0;

          // Amount receiver spent for this payer
          const reverseItems = data.filter(
            item =>
              item.paidBy === receiver.id &&
              item.status !== 'Hold' &&
              item.persons?.includes(payer.id)
          );

          const receiverAmount =
            reverseItems.length > 0
              ? reverseItems
                .map(item => Number(item.price || 0) / (item?.persons?.length || 1))
                .reduce((sum, val) => sum + val, 0)
              : 0;

          const contriAmount = myAmount - receiverAmount;

          return {
            id: receiver.id,
            name: receiver.name,
            color: receiver.color,
            my_amount: myAmount,
            receiver_amount: receiverAmount,
            contri_amount: contriAmount,
          };
        })
        .filter(p => p.contri_amount > 0);

         const willReceive =
        personContributions.length > 0
          ? personContributions
            .map(item => Number(item.contri_amount || 0))
            .reduce((sum, val) => sum + val, 0)
          : 0;

      return {
        id: payer.id,
        name: payer.name,
        color: payer.color,
        totalPaid: totalPaid,
        willReceive: willReceive,
        persons: personContributions,
      };
    }).filter(p => p.persons.length > 0);
  }, [persons, data]);


  const copyExpence = (pitm: any) => {
    let text = ''
    pitm.persons.map((item: any) => {
      const me = pitm.name
      const other = item.name
      const my_amount = item.my_amount
      const other_amount = item.receiver_amount
      const contri_amount = item.contri_amount

      text += `${me} → ${other}\n`
      if (my_amount) text += `Gave ${pipeModel.currency(my_amount)} to ${other}\n`
      if (other_amount) text += `Received ${pipeModel.currency(other_amount)} from ${other}\n`
      text += `(${pipeModel.number(other_amount)} - ${pipeModel.number(my_amount)}) = ${pipeModel.number(contri_amount)}\n`
      if (contri_amount < 0) text += `Will Pay: ${pipeModel.currency(Math.abs(contri_amount))}\n`
      if (contri_amount > 0) text += `Will Receive: ${pipeModel.currency(Math.abs(contri_amount))}\n`
      text += `........\n\n`
    })

    navigator.clipboard.writeText(text);
    toast.success("Copied")
  }

  const viewExpence = (s: any, r: any) => {
    setListModal({
      list: data,
      s,
      r
    })
  }

   const copyCalculation = () => {
        let text = ''
        const datelist = Array.from(
            new Set(data.map((item) => datepipeModel.datetostring(item.date)))
        ).sort((a:any, b:any) => new Date(a).getTime() - new Date(b).getTime())

        datelist.map(date => {
                const listdate=data.filter(itm => itm.status != 'Hold'&&itm.status != 'Done'&& datepipeModel.datetostring(itm.date) == date) 
                text+=`Date : ${datepipeModel.date(date)}:-\n`

                persons.map(person=>{
                    const list=listdate.filter(item=>item.paidBy==person.id)
                    if (list.length) {
                        text += `Paid By ${person.name}:-\n`
                        list.map(item => {
                            text += `${item.name} (${pipeModel.currency(item.price)})\n`
                            const contributors= item.personsDetail.map((itm:any)=>itm.name).sort().join(', ')
                            const contri=item.price/item.personsDetail.length
                           text +=`Contributors : ${contributors}\n`
                            text +=`Contri : ${pipeModel.currency(contri)}\n\n`
                        })
                        text += `\n`
                    }
                })
                 text += `------------\n\n`

        })

        navigator.clipboard.writeText(text);
        toast.success("Copied")
    }

  return <>
    <div className="max-h-[calc(100vh-150px)] overflow-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="summary-card">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Balance Summary</h2>
                <p className="text-blue-100">All expenses are tracked and calculated</p>
              </div>
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <span className="material-symbols-outlined text-gray-600">account_balance_wallet</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Total Expenses</span>
                <span className="font-bold text-lg">{pipeModel.currency(total)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">People Involved</span>
                <span className="font-bold text-lg">{balanceList.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Pending Settlements</span>
                <span className="font-bold text-lg">{calculationList.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {/* <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">check_circle</span>
                Mark All as Settled
              </button> */}
              <button
              onClick={()=>copyCalculation()}
               className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">receipt</span>
                Copy Settlement Report
              </button>
              {/* <button className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">send</span>
                Send Reminders
              </button> */}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="material-symbols-outlined text-blue-500 mr-2">people</span>
              Individual Balances
            </h2>

            <div className="space-y-4">

              {balanceList.map((item, i) => {
                return <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="person-avatar bg-blue-100 text-blue-600">
                      {item?.person?.name[0]}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{item?.person?.name}</h3>
                      <p className="text-sm text-gray-500">Paid: {pipeModel.currency(item.totalPaid)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg ${item.balance < 0 ? 'text-red-800 bg-red-300' : 'text-green-800 bg-green-300'} font-semibold px-3 py-1 rounded-full`}>
                      {pipeModel.currency(item.balance)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Will {item.balance < 0 ? 'pay' : 'receive'}</p>
                  </div>
                </div>
              })}


            </div>
          </div>

          
        </div>



        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
              <h2 className="text-xl font-semibold text-gray-800">Payment Settlements</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <input type="text" placeholder="Search payments..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <span className="material-symbols-outlined absolute left-3 top-2 text-gray-400">search</span>
                </div>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>
            </div>


            {/* <div className="mb-8">
              <div className="flex flex-wrap gap-3 items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="material-symbols-outlined text-yellow-500 mr-2">schedule</span>
                  All Pending Payments
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">{settlementList.length}</span>
                </h3>
              </div>

              {settlementList.map((item, i) => {
                return <div className="payment-flow flex-wrap gap-2" key={i}>
                  <div className="person-card">
                    <div className="person-avatar bg-purple-100 text-purple-600 mr-2">
                      {item.from?.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{item.from?.name}</div>
                      <div className="text-sm text-gray-500">pays to</div>
                    </div>
                  </div>

                  <div className="payment-arrow">
                    <span className="material-symbols-outlined text-gray-400 text-2xl">arrow_forward</span>
                  </div>

                  <div className="person-card justify-end text-right">
                    <div>
                      <div className="font-medium text-gray-800">{item.to?.name}</div>
                      <div className="text-sm text-gray-500">will receive</div>
                    </div>
                    <div className="person-avatar bg-blue-100 text-blue-600 ml-3">
                      {item.to?.name[0]}
                    </div>
                  </div>

                  <div className="amount-badge">
                    {pipeModel.currency(item.amount)}
                  </div>

                  <button className="ml-4 p-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200">
                    <span className="material-symbols-outlined text-2xl">check_circle</span>
                  </button>
                </div>
              })}
            </div> */}

            {calculationList.map(citem => {
              return <div className="mb-8" key={citem.id}>
                <div className="flex flex-wrap gap-3 items-center mb-3">
                  <h3 className={`text-lg font-semibold text-gray-800 mb-4 gap-3 flex items-center`}
                    style={{
                      color: citem.color
                    }}
                  >
                    <span className="material-symbols-outlined text-yellow-500">schedule</span>
                    {citem.name}{`'s`} Pending Payments
                    <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">{pipeModel.currency(citem.willReceive)}</span>
                    <button onClick={() => copyExpence(citem)} title="Copy Expence">
                      <span className="material-symbols-outlined">content_copy</span>
                    </button>
                  </h3>
                </div>


                {citem.persons.map((item, i) => {
                  return <div style={{ borderColor: citem.color }} className={`payment-flow flex-wrap gap-2 !border-[${citem.color}]`} key={i}>
                    <div className="person-card">
                      <div className="person-avatar bg-purple-100 text-purple-600 mr-2">
                        {item.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{item?.name}</div>
                        <div className="text-sm text-gray-500">will pay</div>
                      </div>
                    </div>

                    <div className="payment-arrow">
                      <span className="material-symbols-outlined text-gray-400 text-2xl">arrow_forward</span>
                    </div>

                    {/* <div className="person-card justify-end text-right">
                      <div>
                        <div className="font-medium text-gray-800">{citem?.name}</div>
                        <div className="text-sm text-gray-500">will receive</div>
                      </div>
                      <div className="person-avatar bg-blue-100 text-blue-600 ml-3">
                        {citem?.name[0]}
                      </div>
                    </div> */}

                    <div className="amount-badge cursor-pointer" title="View Expense" onClick={() => viewExpence(citem.id, item.id)}>
                      {pipeModel.currency(item.contri_amount)}
                    </div>

                    {/* <button title="View Expense"
                      onClick={() => viewExpence(citem.id, item.id)}
                      className="text-green-600 hover:bg-green-50 rounded-lg transition duration-200">
                      <span className="material-symbols-outlined text-2xl">visibility</span>
                    </button> */}
                  </div>
                })}
              </div>
            })}
          </div>
        </div>
      </div>
    </div>

    {listModal ? <>
      <Modal
        title="View Expenses"
        body={<>
          <ViewExpenses
            data={listModal}
            persons={persons}
          />
        </>}
        result={()=>setListModal(null)}
      />
    </> : <></>}

  </>;
}