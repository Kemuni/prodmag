'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useDataStore } from '../store/dataStore';

export default function DashboardPage() {
  const { products, supplies, saleItems } = useDataStore();

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.current_quantity, 0);
  const totalSales = saleItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const pendingSupplies = supplies.filter(supply => supply.status === 'pending').length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Панель управления
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Товары
            </Typography>
            <Typography variant="h4" component="div">
              {totalProducts}
            </Typography>
            <Typography variant="body2">
              Всего наименований
            </Typography>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'secondary.light',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Остаток
            </Typography>
            <Typography variant="h4" component="div">
              {totalStock}
            </Typography>
            <Typography variant="body2">
              Единиц товара
            </Typography>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Продажи
            </Typography>
            <Typography variant="h4" component="div">
              {totalSales.toFixed(2)} ₽
            </Typography>
            <Typography variant="body2">
              Общая сумма
            </Typography>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'warning.light',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Поставки
            </Typography>
            <Typography variant="h4" component="div">
              {pendingSupplies}
            </Typography>
            <Typography variant="body2">
              Ожидающих поставок
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
