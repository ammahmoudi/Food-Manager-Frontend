// utils/jalaali.ts
import jalaali from 'jalaali-js';
import { DateTime } from 'luxon';
import jMoment from 'moment-jalaali';

export const toJalali = (date: string) => {
  return jMoment(date, 'YYYY-MM-DD').format('jYYYY/jM/jD');
};


export const jalaaliToDateTime = (jalaaliDate: string): DateTime => {
  const [jy, jm, jd] = jalaaliDate.split('/').map(Number);
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return DateTime.fromObject({ year: gy, month: gm, day: gd });
};

export const dateTimeToJalaali = (dateTime: DateTime): string => {
  const { jy, jm, jd } = jalaali.toJalaali(dateTime.year, dateTime.month, dateTime.day);
  return `${jy}-${jm.toString().padStart(2, "0")}-${jd.toString().padStart(2, "0")}`;
};
export const formatDateToYYYYMMDD = (date: Date): string => {
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, '0');
  const day: string = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
export function convertPersianMonthToEnglish(persianDate: string): string {
  const persianMonths: { [key: string]: string } = {
      "فروردین": "Farvardin",
      "اردیبهشت": "Ordibehesht",
      "خرداد": "Khordad",
      "تیر": "Tir",
      "مرداد": "Mordad",
      "شهریور": "Shahrivar",
      "مهر": "Mehr",
      "آبان": "Aban",
      "آذر": "Azar",
      "دی": "Dey",
      "بهمن": "Bahman",
      "اسفند": "Esfand"
  };

  const [month, year] = persianDate.split(' ');

  const englishMonth = persianMonths[month];
  if (!englishMonth) {
      throw new Error("Invalid Persian month name");
  }

  return `${englishMonth} ${year}`;
}