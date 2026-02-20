import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api'

export default function WorkersPage() {
  const { data: workers, isLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: () => api.workers.list(),
  })

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Workers
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workers?.map((w) => (
              <TableRow key={w.id}>
                <TableCell>{w.name}</TableCell>
                <TableCell>{w.active ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
