import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Container, Stack, Typography, Link, IconButton } from "@mui/material";
import { DeleteButton } from "@/components";
import EditIcon from "@mui/icons-material/Edit";
import { getAnimalSpecies } from "@/services/get-animal-species";

export default async function Home() {
  const animalSpecies = await getAnimalSpecies();

  if (!animalSpecies) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <Stack gap={4}>
        <Typography variant="h3">All animal species</Typography>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Minimal heartbeat</TableCell>
              <TableCell align="right">Maximal heartbeat</TableCell>
              <TableCell align="right">Minimal respiration rate</TableCell>
              <TableCell align="right">Maximal respiration rate</TableCell>{" "}
              <TableCell align="right">Minimal temperature</TableCell>
              <TableCell align="right">Maximal temperature</TableCell>
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
                <TableCell align="right">
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
