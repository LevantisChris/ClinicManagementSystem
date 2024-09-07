
/* Library to easily manipulate time */
import dayjs from "dayjs";

/* ...dayjs()... with empty parameters it will be the present day */
export function getMonth(month = dayjs().month()) {
    month = Math.floor(month);
    const year = dayjs().year();
    const firstDayOfMonth = dayjs(new Date(year, month, 1)).day(); // object that represents the first day of the month

    let currentMonthCount = 0 - firstDayOfMonth;
    const daysMatrix = new Array(5).fill([]).map(() => {
        return new Array(7).fill(null).map(() => {
            currentMonthCount++;
            return dayjs(new Date(year, month, currentMonthCount))
        })
    });
    return daysMatrix;
}
