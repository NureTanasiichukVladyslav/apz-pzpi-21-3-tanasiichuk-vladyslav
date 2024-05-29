import { AnalitycsDto } from "@/types";

const uaStatus = {
  warning: "тривожний",
  ill: "хворий",
  critical: "критичний",
  fine: "гарний",
};

export const translateAnimalStatus = (
  locale: string,
  status: AnalitycsDto["status"]
) => {
  return locale === "en" ? status : uaStatus[status];
};
