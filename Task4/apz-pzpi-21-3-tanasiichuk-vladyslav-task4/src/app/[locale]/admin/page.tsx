import initTranslations from "@/app/i18n";
import { Link, Stack, Typography } from "@mui/material";
import { ExportDatabaseButton } from "./ui";

export default async function Export({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale);

  return (
    <Stack justifyContent="center" alignItems="center" gap={6}>
      <Typography fontSize="1.75rem" fontWeight="700" color="text.primary">
        {t("export")}
      </Typography>
      <Stack alignItems="center" gap={2}>
        <Typography fontSize="1.5rem" fontWeight="600" color="text.primary">
          SQL
        </Typography>
        <ExportDatabaseButton />
      </Stack>
    </Stack>
  );
}
