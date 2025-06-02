'use client';

import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useLoading } from '../../contexts/LoadingContext';

export default function LoadingOverlay() {
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    if (isLoading) {
      const safetyTimer = setTimeout(() => {
        setLoading(false);
      }, 3000);
      
      return () => clearTimeout(safetyTimer);
    }
  }, [isLoading, setLoading]);

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(3px)',
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={60} thickness={4} />
        <Box sx={{ mt: 2, fontWeight: 'bold' }}>Загрузка...</Box>
      </Box>
    </Box>
  );
}
