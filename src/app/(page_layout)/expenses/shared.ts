export const PAGE_TABLE='calculation'
export const EXPENSE_CATEGORY_TABLE='calculationCategory'
export const EXPENSE_PERSON_TABLE='calculationPerson'
export const PAGE_NAME='Expense Tracker'
export const ADD_PAGE_NAME = 'Expense'
export const PAGE_URL = '/expenses'
export const EXPENSE_STATUS_LIST = [
    {id:'Pending',bgcolor:'#fef3c7',color:'#92400e'},
    {id:'Done',bgcolor:'#d1fae5',color:'#065f46'},
    {id:'Hold',bgcolor:'#fee2e2',color:'#991b1b'},
].map(item=>({...item,name:item.id}))