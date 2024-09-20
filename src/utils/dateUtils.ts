// utils/jalaali.ts

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