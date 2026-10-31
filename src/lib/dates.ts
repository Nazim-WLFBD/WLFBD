/** Today's date in Bangladesh (Asia/Dhaka), as YYYY-MM-DD. */
export const dhakaDate = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(d);
