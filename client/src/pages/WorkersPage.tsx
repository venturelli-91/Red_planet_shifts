import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api'

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function WorkersPage() {
  const { data: workers, isLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: () => api.workers.list(),
  })

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: "text.primary", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
        Workers
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2 }}>
        {workers?.map((w) => (
          <Card key={w.id}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: '1.1rem', fontWeight: 700 }}>
                {initials(w.name)}
              </Avatar>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1">{w.name}</Typography>
                <Chip label={w.trade} size="small" variant="outlined" color="primary" sx={{ mt: 0.5 }} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}
