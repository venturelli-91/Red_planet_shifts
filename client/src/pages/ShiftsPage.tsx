import { useState } from 'react'
import {
  Box,
  Button,
  Chip,
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'
import type { Worker } from '../types'

export default function ShiftsPage() {
  const qc = useQueryClient()
  const [claimingId, setClaimingId] = useState<string | null>(null)

  const { data: shifts, isLoading: loadingShifts } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => api.shifts.list(),
  })

  const { data: workers } = useQuery({
    queryKey: ['workers'],
    queryFn: () => api.workers.list(),
  })

  const claim = useMutation({
    mutationFn: ({ shiftId, workerId }: { shiftId: string; workerId: string }) =>
      api.shifts.claim(shiftId, workerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shifts'] })
      setClaimingId(null)
    },
  })

  const workerMap = new Map<string, Worker>(workers?.map((w) => [w.id, w]) ?? [])

  const statusColor = (s: string) => {
    if (s === 'open') return 'success'
    if (s === 'claimed') return 'warning'
    return 'default'
  }

  if (loadingShifts) return <CircularProgress sx={{ m: 4 }} />

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Shifts
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Worker</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts?.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>{new Date(shift.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(shift.endTime).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip label={shift.status} color={statusColor(shift.status) as never} size="small" />
                </TableCell>
                <TableCell>
                  {shift.workerId ? workerMap.get(shift.workerId)?.name ?? shift.workerId : '—'}
                </TableCell>
                <TableCell>
                  {shift.status === 'open' && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {claimingId === shift.id
                        ? workers
                            ?.filter((w) => w.active)
                            .map((w) => (
                              <Button
                                key={w.id}
                                size="small"
                                variant="outlined"
                                onClick={() => claim.mutate({ shiftId: shift.id, workerId: w.id })}
                              >
                                {w.name}
                              </Button>
                            ))
                        : (
                          <Button size="small" onClick={() => setClaimingId(shift.id)}>
                            Claim
                          </Button>
                        )}
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
