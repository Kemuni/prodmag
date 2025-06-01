'use client';

import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { 
  BarChart,
  PieChart
} from '@mui/x-charts';
import { useDataStore } from '../../store/dataStore';

export default function AnalyticsPage() {
  const { products, sales, supplies } = useDataStore();
  
  const totalRevenue = useMemo(() => {
    return sales.reduce((sum, sale) => sum + sale.total, 0);
  }, [sales]);
  
  const totalCost = useMemo(() => {
    return supplies
      .filter(supply => supply.status === 'delivered')
      .reduce((sum, supply) => sum + supply.total, 0);
  }, [supplies]);
  
  const profit = totalRevenue - totalCost;
  
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
  
  const salesByDay = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const salesByDay = last7Days.map(day => {
      const daySales = sales.filter(sale => 
        sale.date.split('T')[0] === day
      );
      
      const total = daySales.reduce((sum, sale) => sum + sale.total, 0);
      
      return {
        day: new Date(day).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' }),
        total
      };
    });
    
    return salesByDay;
  }, [sales]);
  
  const topSellingProducts = useMemo(() => {
    const productSales = sales.flatMap(sale => 
      sale.products.map(item => ({
        id: item.productId,
        name: item.productName,
        total: item.total
      }))
    );
    
    const salesByProduct = productSales.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = { name: item.name, total: 0 };
      }
      acc[item.id].total += item.total;
      return acc;
    }, {} as Record<string, { name: string; total: number }>);
    
    return Object.values(salesByProduct)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [sales]);
  
  const categoryDistribution = useMemo(() => {
    const categories = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = 0;
      }
      acc[product.category] += 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products
      .filter(product => product.stock < 10)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
  }, [products]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Аналитика
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'info.light',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Выручка
            </Typography>
            <Typography variant="h4" component="div">
              {totalRevenue.toFixed(2)} ₽
            </Typography>
            <Typography variant="body2">
              Общая сумма продаж
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
              Затраты
            </Typography>
            <Typography variant="h4" component="div">
              {totalCost.toFixed(2)} ₽
            </Typography>
            <Typography variant="body2">
              Общая сумма закупок
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
              Прибыль
            </Typography>
            <Typography variant="h4" component="div">
              {profit.toFixed(2)} ₽
            </Typography>
            <Typography variant="body2">
              Выручка - Затраты
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
              bgcolor: 'primary.light',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Маржа
            </Typography>
            <Typography variant="h4" component="div">
              {profitMargin.toFixed(2)}%
            </Typography>
            <Typography variant="body2">
              Процент прибыли
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Продажи за последние 7 дней
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              {salesByDay.length > 0 && (
                <BarChart
                  series={[
                    {
                      data: salesByDay.map(item => item.total),
                      label: 'Продажи (₽)',
                      color: '#2196f3',
                    },
                  ]}
                  xAxis={[
                    {
                      data: salesByDay.map(item => item.day),
                      scaleType: 'band',
                    },
                  ]}
                  height={300}
                />
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Распределение по категориям
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              {categoryDistribution.length > 0 && (
                <PieChart
                  series={[
                    {
                      data: categoryDistribution.map(item => ({
                        id: item.category,
                        value: item.count,
                        label: item.category,
                      })),
                      innerRadius: 30,
                      outerRadius: 100,
                      paddingAngle: 1,
                      cornerRadius: 5,
                      startAngle: -90,
                      endAngle: 270,
                    },
                  ]}
                  height={300}
                />
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Топ продаваемых товаров
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              {topSellingProducts.length > 0 && (
                <BarChart
                  series={[
                    {
                      data: topSellingProducts.map(item => item.total),
                      label: 'Выручка (₽)',
                      color: '#4caf50',
                    },
                  ]}
                  xAxis={[
                    {
                      data: topSellingProducts.map(item => item.name),
                      scaleType: 'band',
                    },
                  ]}
                  height={300}
                />
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Товары с низким запасом
            </Typography>
            {lowStockProducts.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {lowStockProducts.map((product, index) => (
                  <Card key={product.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid size={8}>
                          <Typography variant="subtitle1">
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.category}
                          </Typography>
                        </Grid>
                        <Grid size={4} sx={{ textAlign: 'right' }}>
                          <Typography 
                            variant="h6" 
                            color={product.stock < 5 ? 'error.main' : 'warning.main'}
                          >
                            {product.stock} шт.
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Нет товаров с низким запасом
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
