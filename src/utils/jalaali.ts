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
