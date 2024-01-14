import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { DateProvider } from "../DateProvider";

dayjs.extend(utc);

export class DayjsDateProvider implements DateProvider {
  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  now(): Date {
    return dayjs().toDate();
  }

  compareInYears(startDate: Date, endDate: Date): number {
    const endDateUTC = this.convertToUTC(endDate);
    const startDateUTC = this.convertToUTC(startDate);

    return dayjs(endDateUTC).diff(startDateUTC, "years");
  }
}
