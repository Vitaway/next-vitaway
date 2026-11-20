/** W29 API calls for food reports. Pure helpers are in food-report-logic.ts. */
import { mobileRequest } from "./client/api";
import { parseFoodReport } from "./food-report-logic";

export * from "./food-report-logic";

export async function listFoodReports() {
  const body = await mobileRequest<{ results?: unknown[] }>(`/api/v1/mobile/food-reports`);
  return (body?.results ?? []).map(parseFoodReport);
}

export async function getFoodReport(id: number) {
  return parseFoodReport(await mobileRequest(`/api/v1/mobile/food-reports/${id}`));
}
