'use client'

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { CategoryType, PersonType } from "./Content";
import "./balancestyle.css"
import { useMemo } from "react";
import pipeModel from "@/utils/pipeModel";

type ModalType = {
  data: any[]
  persons: PersonType[]
  categories: CategoryType[]
}

export default function Balance({ data, persons, categories }: ModalType) {
  const user: any = useSelector((state: RootState) => state.user.data);

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
  }, [data, balanceList])

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
                <span className="material-symbols-outlined">account_balance_wallet</span>
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
                <span className="font-bold text-lg">{settlementList.length}</span>
              </div>
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
                  <div className="flex items-center">
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

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">check_circle</span>
                Mark All as Settled
              </button>
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">receipt</span>
                Export Settlement Report
              </button>
              <button className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">send</span>
                Send Reminders
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
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


            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="material-symbols-outlined text-yellow-500 mr-2">schedule</span>
                Pending Payments
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">3</span>
              </h3>

              {settlementList.map((item, i) => {
                return <div className="payment-flow" key={i}>
                  <div className="person-card">
                    <div className="person-avatar bg-purple-100 text-purple-600">
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

                  <div className="amount-badge ml-4">
                    {pipeModel.currency(item.amount)}
                  </div>

                  <button className="ml-4 p-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200">
                    <span className="material-symbols-outlined text-2xl">check_circle</span>
                  </button>
                </div>
              })}
            </div>
          </div>
        </div>
      </div>
    </div>

  </>;
}