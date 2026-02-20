import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'

export default function WorkplacesPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [trade, setTrade] = useState('')

  const { data: workplaces, isLoading } = useQuery({
    queryKey: ['workplaces'],
    queryFn: () => api.workplaces.list(),
  })

  const createShift = useMutation({
    mutationFn: api.shifts.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shifts'] })
      setOpen(false)
      setStart('')
      setEnd('')
      setTrade('')
    },
  })

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: "text.primary", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
        Workplaces
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2 }}>
        {workplaces?.map((wp) => (
          <Card key={wp.id}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="subtitle1">{wp.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: 'text.secondary' }}>
                <LocationOnIcon sx={{ fontSize: 15 }} />
                <Typography variant="body2">{wp.address}</Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  setSelectedWorkplaceId(wp.id)
                  setOpen(true)
                }}
              >
                Post shift
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Post a shift</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Trade"
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            placeholder="e.g. Welder"
            size="small"
          />
          <TextField
            label="Start time"
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            label="End time"
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!start || !end || !trade || createShift.isPending}
            onClick={() =>
              createShift.mutate({
                workplaceId: selectedWorkplaceId,
                start: new Date(start).toISOString(),
                end: new Date(end).toISOString(),
                trade,
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
