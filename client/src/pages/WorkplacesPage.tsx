import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { motion } from 'framer-motion'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'

function WorkplaceCardSkeleton() {
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: '1px solid rgba(232,97,44,0.14)',
        p: 2,
        background: 'rgba(18,7,3,0.78)',
      }}
    >
      <Box sx={{ width: '65%', height: 18, borderRadius: 1, bgcolor: 'rgba(232,97,44,0.12)', mb: 1, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <Box sx={{ width: '85%', height: 14, borderRadius: 1, bgcolor: 'rgba(232,97,44,0.08)', mb: 2, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <Box sx={{ width: 80, height: 30, borderRadius: 1, bgcolor: 'rgba(232,97,44,0.12)', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </Box>
  )
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

export default function WorkplacesPage() {
  const qc = useQueryClient()

  const [shiftOpen, setShiftOpen] = useState(false)
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState('')
  const [selectedWorkplaceName, setSelectedWorkplaceName] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [trade, setTrade] = useState('')

  const [wpOpen, setWpOpen] = useState(false)
  const [wpName, setWpName] = useState('')
  const [wpAddress, setWpAddress] = useState('')

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  })

  const { data: workplaces, isLoading } = useQuery({
    queryKey: ['workplaces'],
    queryFn: () => api.workplaces.list(),
  })

  const createShift = useMutation({
    mutationFn: api.shifts.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shifts'] })
      setShiftOpen(false)
      setStart('')
      setEnd('')
      setTrade('')
      setToast({ open: true, message: 'Shift posted successfully!', severity: 'success' })
    },
    onError: () => setToast({ open: true, message: 'Failed to post shift.', severity: 'error' }),
  })

  const createWorkplace = useMutation({
    mutationFn: api.workplaces.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workplaces'] })
      setWpOpen(false)
      setWpName('')
      setWpAddress('')
      setToast({ open: true, message: 'Workplace added successfully!', severity: 'success' })
    },
    onError: () => setToast({ open: true, message: 'Failed to add workplace.', severity: 'error' }),
  })

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: 'text.primary', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
          Workplaces
        </Typography>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
          <Button variant="contained" size="small" onClick={() => setWpOpen(true)}>
            Add workplace
          </Button>
        </motion.div>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2 }}>
          {[...Array(4)].map((_, i) => <WorkplaceCardSkeleton key={i} />)}
        </Box>
      ) : workplaces?.length === 0 ? (
        <Typography color="text.secondary">No workplaces yet.</Typography>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}
        >
          {workplaces?.map((wp) => (
            <motion.div key={wp.id} variants={cardVariants}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="subtitle1">{wp.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: 'text.secondary' }}>
                    <LocationOnIcon sx={{ fontSize: 15 }} aria-hidden="true" />
                    <Typography variant="body2">{wp.address}</Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    <Button
                      size="small"
                      variant="contained"
                      aria-label={`Post shift at ${wp.name}`}
                      onClick={() => {
                        setSelectedWorkplaceId(wp.id)
                        setSelectedWorkplaceName(wp.name)
                        setShiftOpen(true)
                      }}
                    >
                      Post shift
                    </Button>
                  </motion.div>
                </CardActions>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog
        open={wpOpen}
        onClose={() => setWpOpen(false)}
        fullWidth
        maxWidth="xs"
        aria-labelledby="add-workplace-dialog-title"
      >
        <DialogTitle id="add-workplace-dialog-title">Add a workplace</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Name"
            value={wpName}
            onChange={(e) => setWpName(e.target.value)}
            size="small"
            inputProps={{ 'aria-required': true }}
          />
          <TextField
            label="Address"
            value={wpAddress}
            onChange={(e) => setWpAddress(e.target.value)}
            placeholder="e.g. 1 Olympus Mons, Mars"
            size="small"
            inputProps={{ 'aria-required': true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWpOpen(false)}>Cancel</Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
            <Button
              variant="contained"
              disabled={!wpName || !wpAddress || createWorkplace.isPending}
              onClick={() => createWorkplace.mutate({ name: wpName, address: wpAddress })}
            >
              {createWorkplace.isPending ? 'Adding…' : 'Add'}
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>

      <Dialog
        open={shiftOpen}
        onClose={() => setShiftOpen(false)}
        fullWidth
        maxWidth="xs"
        aria-labelledby="post-shift-dialog-title"
      >
        <DialogTitle id="post-shift-dialog-title">
          Post a shift{selectedWorkplaceName ? ` at ${selectedWorkplaceName}` : ''}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Trade"
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            placeholder="e.g. Welder"
            size="small"
            inputProps={{ 'aria-required': true }}
          />
          <TextField
            label="Start time"
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            inputProps={{ 'aria-required': true }}
          />
          <TextField
            label="End time"
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            inputProps={{ 'aria-required': true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShiftOpen(false)}>Cancel</Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
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
              {createShift.isPending ? 'Posting…' : 'Post'}
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
