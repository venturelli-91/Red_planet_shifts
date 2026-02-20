import { useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'

export default function WorkplacesPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const { data: workplaces, isLoading } = useQuery({
    queryKey: ['workplaces'],
    queryFn: () => api.workplaces.list(),
  })

  const createShift = useMutation({
    mutationFn: api.shifts.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shifts'] })
      setOpen(false)
      setStartTime('')
      setEndTime('')
    },
  })

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Workplaces
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Active</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {workplaces?.map((wp) => (
              <TableRow key={wp.id}>
                <TableCell>{wp.name}</TableCell>
                <TableCell>{wp.active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {wp.active && (
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedWorkplaceId(wp.id)
                        setOpen(true)
                      }}
                    >
                      Post shift
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Post a shift</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Start time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End time"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!startTime || !endTime || createShift.isPending}
            onClick={() =>
              createShift.mutate({
                workplaceId: selectedWorkplaceId,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
              })
            }
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
