import { useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function WorkerCardSkeleton() {
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: '1px solid rgba(232,97,44,0.14)',
        p: 3,
        background: 'rgba(18,7,3,0.78)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'rgba(232,97,44,0.15)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <Box sx={{ width: '60%', height: 16, borderRadius: 1, bgcolor: 'rgba(232,97,44,0.08)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <Box sx={{ width: '40%', height: 20, borderRadius: 2, bgcolor: 'rgba(232,97,44,0.08)', animation: 'pulse 1.5s ease-in-out infinite' }} />
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

export default function WorkersPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [trade, setTrade] = useState('')
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  })

  const { data: workers, isLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: () => api.workers.list(),
  })

  const createWorker = useMutation({
    mutationFn: api.workers.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workers'] })
      setOpen(false)
      setName('')
      setTrade('')
      setToast({ open: true, message: 'Worker added successfully!', severity: 'success' })
    },
    onError: () => setToast({ open: true, message: 'Failed to add worker.', severity: 'error' }),
  })

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: 'text.primary', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
          Workers
        </Typography>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
          <Button variant="contained" size="small" onClick={() => setOpen(true)}>
            Add worker
          </Button>
        </motion.div>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2 }}>
          {[...Array(6)].map((_, i) => <WorkerCardSkeleton key={i} />)}
        </Box>
      ) : workers?.length === 0 ? (
        <Typography color="text.secondary">No workers yet.</Typography>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}
        >
          {workers?.map((w) => (
            <motion.div key={w.id} variants={cardVariants}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 3 }}>
                  <Avatar
                    sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: '1.1rem', fontWeight: 700 }}
                    aria-hidden="true"
                  >
                    {initials(w.name)}
                  </Avatar>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1">{w.name}</Typography>
                    <Chip label={w.trade} size="small" variant="outlined" color="primary" sx={{ mt: 0.5 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
        aria-labelledby="add-worker-dialog-title"
      >
        <DialogTitle id="add-worker-dialog-title">Add a worker</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            inputProps={{ 'aria-required': true }}
          />
          <TextField
            label="Trade"
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            placeholder="e.g. Welder"
            size="small"
            inputProps={{ 'aria-required': true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
            <Button
              variant="contained"
              disabled={!name || !trade || createWorker.isPending}
              onClick={() => createWorker.mutate({ name, trade })}
            >
              {createWorker.isPending ? 'Adding…' : 'Add'}
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
