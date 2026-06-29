function getNextMonday(): Date {
    const today = new Date();
    const dow = today.getDay(); // 0=Sun, 1=Mon … 6=Sat
    const daysToAdd = dow === 1 ? 7 : (8 - dow) % 7;
    const d = new Date(today);
    d.setDate(today.getDate() + daysToAdd);
    return d;
}

function ordinal(n: number): string {
    if (n > 3 && n < 21) return `${n}th`;
    return `${n}${(['th', 'st', 'nd', 'rd'] as const)[n % 10] || 'th'}`;
}

const MONTHS_UPPER = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const MONTHS_TITLE = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Returns e.g. "6th JULY" — for badge labels and WhatsApp messages */
export function getProgramStartLabel(): string {
    const d = getNextMonday();
    return `${ordinal(d.getDate())} ${MONTHS_UPPER[d.getMonth()]}`;
}

/** Returns e.g. "6th July To 19th July" — for popup body copy */
export function getProgramDateRange(): string {
    const start = getNextMonday();
    const end = new Date(start);
    end.setDate(start.getDate() + 13);
    return `${ordinal(start.getDate())} ${MONTHS_TITLE[start.getMonth()]} To ${ordinal(end.getDate())} ${MONTHS_TITLE[end.getMonth()]}`;
}
