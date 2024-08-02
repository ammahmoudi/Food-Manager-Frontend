import { redirect } from 'next/navigation';
import { startOfToday, format } from 'date-fns-jalali';

export default function CalendarRedirect() {
  const currentDate = startOfToday();
  const year = format(currentDate, 'yyyy');
  const month = format(currentDate, 'MM');
  redirect(`/admin/calendar/${year}/${month}`);
}
