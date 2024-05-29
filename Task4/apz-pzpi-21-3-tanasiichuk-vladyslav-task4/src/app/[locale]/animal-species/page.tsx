import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Container, Stack, Typography, IconButton } from "@mui/material";
import { DeleteButton } from "@/components";
import EditIcon from "@mui/icons-material/Edit";
import { getAnimalSpecies } from "@/services/get-animal-species";
import initTranslations from "@/app/i18n";

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const animalSpecies = await getAnimalSpecies();
  const { t } = await initTranslations(locale);

  if (!animalSpecies) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <Stack gap={4}>
        <Typography variant="h3">{t("animalSpecies")}</Typography>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>{t("name")}</TableCell>
              <TableCell align="right">{t("minHeartbeat")}</TableCell>
              <TableCell align="right">{t("maxHeartbeat")}</TableCell>
              <TableCell align="right">{t("minRespirationRate")}</TableCell>
              <TableCell align="right">
                {t("maxRespirationRate")}
              </TableCell>{" "}
              <TableCell align="right">{t("minTemperature")}</TableCell>
              <TableCell align="right">{t("maxTemperature")}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {animalSpecies.map((spesies) => (
              <TableRow key={spesies.id}>
                <TableCell component="th" scope="row">
                  {spesies.name}
                </TableCell>
                <TableCell align="right">{spesies.minHeartbeat}</TableCell>
                <TableCell align="right">{spesies.maxHeartbeat}</TableCell>
                <TableCell align="right">
                  {spesies.minRespirationRate}
                </TableCell>
                <TableCell align="right">
                  {spesies.maxRespirationRate}
                </TableCell>
                <TableCell align="right">{spesies.minTemperature}</TableCell>
                <TableCell align="right">{spesies.maxTemperature}</TableCell>
                <TableCell align="right" width={150}>
                  <IconButton href={`/animal-species/${spesies.id}/edit`}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <DeleteButton path={`/animal-species/${spesies.id}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Container>
  );
}
