export interface DateProvider {
  convertToUTC(date: Date): string;
  now(): Date;
  compareInYears(startDate: Date, endDate: Date): number;
}
