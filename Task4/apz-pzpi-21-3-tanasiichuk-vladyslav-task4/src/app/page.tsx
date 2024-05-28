import { AnimalDto } from "@/types";
import { fetchClient } from "@/utils/fetch";
import { formatDate } from "@/utils/format-date";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Container, Stack, Typography, Link, IconButton } from "@mui/material";
import { DeleteButton } from "@/components";
import EditIcon from "@mui/icons-material/Edit";

async function getData() {
  return fetchClient.get<AnimalDto[]>("/animals");
}

export default async function Home() {
  const [animals] = await Promise.all([getData()]);

  if (!animals) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <Stack gap={4}>
        <Typography variant="h3">All animals</Typography>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Species</TableCell>
              <TableCell align="right">Gender</TableCell>
              <TableCell align="right">Weight</TableCell>
              <TableCell align="right">Date of birth</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {animals.map((animal) => (
              <TableRow key={animal.id}>
                <TableCell component="th" scope="row">
                  <Link
                    href={`/animals/${animal.id}`}
                    variant="body1"
                    underline="hover"
                  >
                    {animal.name}
                  </Link>
                </TableCell>
                <TableCell align="right">{animal.species.name}</TableCell>
                <TableCell align="right">{animal.gender}</TableCell>
                <TableCell align="right">{animal.weight}</TableCell>
                <TableCell align="right">
                  {formatDate(animal.dateOfBirth)}
                </TableCell>
                <TableCell align="right">
                  <IconButton href={`/animals/${animal.id}/edit`}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <DeleteButton path={`/animals/${animal.id}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Container>
  );
}
