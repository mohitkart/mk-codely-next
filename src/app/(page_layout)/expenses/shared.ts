export const PAGE_TABLE = 'expenses'
export const EXPENSE_CATEGORY_TABLE = 'expenseCategory'
export const PAGE_NAME = 'Expense Tracker'
export const ADD_PAGE_NAME = 'Expense'
export const PAGE_URL = '/expenses'
export const EXPENSE_STATUS_LIST = [
    { id: 'Pending', bgcolor: '#fef3c7', color: '#92400e' },
    { id: 'Done', bgcolor: '#d1fae5', color: '#065f46' },
].map(item => ({ ...item, name: item.id }))

export const EXPENSE_TYPE_LIST = [
    { name: 'Give', id: 'Give' },
    { name: 'Got', id: 'Got' },
]