// utils/jalaali.ts
import jalaali from 'jalaali-js';
import { DateTime } from 'luxon';

export const jalaaliToDateTime = (jalaaliDate: string): DateTime => {
  const [jy, jm, jd] = jalaaliDate.split('/').map(Number);
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return DateTime.fromObject({ year: gy, month: gm, day: gd });
};

export const dateTimeToJalaali = (dateTime: DateTime): string => {
  const { jy, jm, jd } = jalaali.toJalaali(dateTime.year, dateTime.month, dateTime.day);
  return `${jy}/${jm}/${jd}`;
};
