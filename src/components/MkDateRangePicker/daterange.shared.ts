import datepipeModel from "@/utils/datepipemodel";

interface RangeItem {
    id: string;
    name: string;
}

interface DateRange {
    startDate: string;
    endDate: string;
    range: string;
}

interface CompareRangeResult {
    compareStart: string;
    compareEnd: string;
    compare: string;
}

interface DateRangeInput {
     range?: string;
  startDate?: string;
  endDate?: string;
  compareStart?: string;
  compareEnd?: string;
  compare?: string;
}

export const rangeList: RangeItem[] = [
    { id: 'Today', name: "Today" },
    { id: 'Yesterday', name: "Yesterday" },
    { id: 'This Week', name: "This Week" },
    { id: 'Last Week', name: "Last Week" },
    { id: 'This Month', name: "This Month" },
    { id: 'Last Month', name: "Last Month" },
    { id: 'This Year', name: "This Year" },
    { id: 'Last Year', name: "Last Year" },
];

export const getRange = (e: string): DateRange => {
    let startDate: string = '';
    let endDate: string = '';
    let range: string = '';

    if (e === 'Today' || e === 'today') {
        range = 'Today';
        const current = new Date();
        startDate = datepipeModel.datetostring(current);
        endDate = startDate;
    } else if (e === 'Last 30 Days' || e === 'last_30_days') {
        range = 'Last 30 Days';
        const today = new Date();
        endDate = datepipeModel.datetostring(today);
        const startDateObj = new Date(today);
        startDateObj.setDate(startDateObj.getDate() - 30);
        startDate = datepipeModel.datetostring(startDateObj);
    } else if (e === 'Yesterday' || e === 'yesterday') {
        range = 'Yesterday';
        const current = new Date();
        const yesterday = new Date(current);
        yesterday.setDate(current.getDate() - 1);
        startDate = datepipeModel.datetostring(yesterday);
        endDate = startDate;
    } else if (e === 'Last Month' || e === 'last_month') {
        range = 'Last Month';
        const current = new Date();
        const lastDayOfPrevMonth = new Date(current.getFullYear(), current.getMonth(), 0);
        startDate = `${lastDayOfPrevMonth.getFullYear()}-${(lastDayOfPrevMonth.getMonth() + 1).toString().padStart(2, '0')}-01`;
        endDate = datepipeModel.datetostring(lastDayOfPrevMonth);
    } else if (e === 'This Month' || e === 'Month' || e === 'this_month') {
        range = 'This Month';
        const current = new Date();
        startDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-01`;
        const lastDayOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0);
        endDate = datepipeModel.datetostring(lastDayOfMonth);
    } else if (e === 'This Year' || e === 'this_year') {
        range = 'This Year';
        const current = new Date();
        startDate = `${current.getFullYear()}-01-01`;
        const lastDayOfYear = new Date(current.getFullYear() + 1, 0, 0);
        endDate = datepipeModel.datetostring(lastDayOfYear);
    } else if (e === 'Last Year' || e === 'last_year') {
        range = 'Last Year';
        const current = new Date();
        startDate = `${current.getFullYear() - 1}-01-01`;
        const lastDayOfPrevYear = new Date(current.getFullYear(), 0, 0);
        endDate = datepipeModel.datetostring(lastDayOfPrevYear);
    } else if (e === 'Last Week' || e === 'last_week') {
        range = 'Last Week';
        const current = new Date();
        const day = current.getDay();
        const diff = (day === 0 ? 7 : day) + 6;
        const lastWeekStart = new Date(current);
        lastWeekStart.setDate(current.getDate() - diff);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        startDate = datepipeModel.datetostring(lastWeekStart);
        endDate = datepipeModel.datetostring(lastWeekEnd);
    } else if (e === 'This Week' || e === 'Week' || e === 'this_week') {
        range = 'This Week';
        const current = new Date();
        const day = current.getDay();
        const thisWeekStart = new Date(current);
        thisWeekStart.setDate(current.getDate() - (day === 0 ? 6 : day - 1));
        const thisWeekEnd = new Date(thisWeekStart);
        thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
        startDate = datepipeModel.datetostring(thisWeekStart);
        endDate = datepipeModel.datetostring(thisWeekEnd);
    }

    return { startDate, endDate, range };
};

const getDays = (s: string, e: string): number => {
    const startDate = new Date(s);
    const endDate = new Date(e);
    const timeDifference = endDate.getTime() - startDate.getTime();
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
};

const previousYear = (value: DateRangeInput): { start: string; end: string } => {
    let start = '';
    let end = '';
    if (value.startDate && value.endDate) {
        const ssplit = value.startDate.split('-');
        const esplit = value.endDate.split('-');
        const year = Number(ssplit[0]);
        const eyear = Number(esplit[0]);

        const d = new Date(`${year - 1}-${ssplit[1]}-${ssplit[2]}`);
        start = datepipeModel.datetostring(d);

        const ed = new Date(`${eyear - 1}-${esplit[1]}-${esplit[2]}`);
        end = datepipeModel.datetostring(ed);
    }
    return { start, end };
};

const previousMonth = (value: DateRangeInput): { start: string; end: string } => {
    let start = '';
    let end = '';
    if (value.startDate && value.endDate) {
        const current = new Date(value.startDate);
        const lastDayOfPrevMonth = new Date(current.getFullYear(), current.getMonth() - 1, 0);
        start = `${lastDayOfPrevMonth.getFullYear()}-${(lastDayOfPrevMonth.getMonth() + 1).toString().padStart(2, '0')}-01`;
        end = datepipeModel.datetostring(lastDayOfPrevMonth);
    }
    return { start, end };
};

const previousPeriod = (value: DateRangeInput): { start: string; end: string } => {
    let start = '';
    let end = '';
    if (value.startDate && value.endDate) {
        const days = getDays(value.startDate, value.endDate) + 1;
        const d = new Date(value.startDate);
        d.setDate(d.getDate() - days);
        start = datepipeModel.datetostring(d);

        const ed = new Date(value.startDate);
        ed.setDate(ed.getDate() - 1);
        end = datepipeModel.datetostring(ed);
    }
    return { start, end };
};

export const getCompareRange = (e: string, value: DateRangeInput): CompareRangeResult => {
    let start = '';
    let end = '';

    if (e === 'Previous Period') {
        ({ start, end } = previousPeriod(value));
    } else if (e === 'Previous Year') {
        ({ start, end } = previousYear(value));
    } else if (e === 'Previous Month') {
        ({ start, end } = previousMonth(value));
    }

    return {
        compareStart: start,
        compareEnd: end,
        compare: e
    };
};