'use client';

import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { LineChart, PieChart } from '@mui/x-charts';
import { useDataStore } from '../../store/dataStore';

export default function AnalyticsPage() {
  const { sales, products, supplyItems, departments, saleItems } = useDataStore();

  const memoizedProducts = useMemo(() => products, [products]);
  const memoizedSales = useMemo(() => sales, [sales]);
  const memoizedSaleItems = useMemo(() => saleItems, [saleItems]);
  const memoizedSupplyItems = useMemo(() => supplyItems, [supplyItems]);
  const memoizedDepartments = useMemo(() => departments, [departments]);

  const salesData = useMemo(() => {
    const salesByDate: { [date: string]: number } = {};

    memoizedSales.forEach(sale => {
      const date = new Date(sale.creation_date).toLocaleDateString('ru-RU');

      const items = memoizedSaleItems.filter(item => item.sale_id === sale.id);
      const saleTotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

      salesByDate[date] = (salesByDate[date] || 0) + saleTotal;
    });

    return Object.entries(salesByDate).map(([date, total]) => ({
      date,
      total
    })).sort((a, b) => {
      const dateA = new Date(a.date.split('.').reverse().join('-'));
      const dateB = new Date(b.date.split('.').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });
  }, [memoizedSales, memoizedSaleItems]);

  const salesByDepartment = useMemo(() => {
    const departmentSales: { [key: string]: number } = {};

    memoizedDepartments.forEach(dept => {
      departmentSales[dept.name] = 0;
    });

    memoizedSaleItems.forEach(item => {
      const product = memoizedProducts.find(p => p.id === item.product_id);
      if (product) {
        const department = memoizedDepartments.find(d => d.id === product.department_id);
        if (department) {
          const itemTotal = item.quantity * item.unit_price;
          departmentSales[department.name] = (departmentSales[department.name] || 0) + itemTotal;
        }
      }
    });

    return Object.entries(departmentSales)
      .filter(([, value]) => value > 0)
      .map(([name, total]) => ({
        id: name,
        value: total,
        label: name
      }));
  }, [memoizedSaleItems, memoizedProducts, memoizedDepartments]);

  const productProfitability = useMemo(() => {
    const purchasePrices: { [productId: string]: number } = {};

    memoizedSupplyItems.forEach(item => {
      purchasePrices[item.product_id] = item.unit_price;
    });

    return memoizedProducts
      .map(product => {
        const purchasePrice = purchasePrices[product.id] || 0;
        const profitMargin = purchasePrice > 0
          ? ((product.price - purchasePrice) / purchasePrice) * 100
          : 0;

        return {
          name: product.name,
          price: product.price,
          purchasePrice,
          profitMargin
        };
      })
      .filter(p => p.profitMargin > 0)
      .sort((a, b) => b.profitMargin - a.profitMargin)
      .slice(0, 10);
  }, [memoizedProducts, memoizedSupplyItems]);

  const lowStockProducts = useMemo(() => {
    return memoizedProducts
      .filter(product => product.current_quantity <= product.min_threshold)
      .map(product => {
        const department = memoizedDepartments.find(d => d.id === product.department_id);
        return {
          id: product.id,
          name: product.name,
          department: department?.name || 'Неизвестно',
          current: product.current_quantity,
          minimum: product.min_threshold,
          status: product.current_quantity === 0 ? 'Закончился' : 'Заканчивается'
        };
      })
      .sort((a, b) => (a.current / a.minimum) - (b.current / b.minimum));
  }, [memoizedProducts, memoizedDepartments]);

  const totalSalesAmount = useMemo(() => {
    return memoizedSaleItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }, [memoizedSaleItems]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Аналитика</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Всего продаж
              </Typography>
              <Typography variant="h5" component="div">
                {memoizedSales.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Выручка
              </Typography>
              <Typography variant="h5" component="div">
                {totalSalesAmount.toFixed(2)} ₽
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Кол-во товаров
              </Typography>
              <Typography variant="h5" component="div">
                {memoizedProducts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Товаров на исходе
              </Typography>
              <Typography variant="h5" component="div">
                {lowStockProducts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Динамика продаж
            </Typography>
            <Box sx={{ height: 300 }}>
              {salesData.length > 0 ? (
                <LineChart
                  xAxis={[{ 
                    data: salesData.map(item => item.date),
                    scaleType: 'band' 
                  }]}
                  series={[
                    {
                      data: salesData.map(item => item.total),
                      area: true,
                      label: 'Продажи',
                      color: '#8884d8'
                    }
                  ]}
                  height={300}
                  margin={{ top: 20, bottom: 30, left: 40, right: 20 }}
                  slotProps={{
                    legend: { hidden: false }
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography>Нет данных о продажах</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Продажи по отделам
            </Typography>
            <Box sx={{ height: 300 }}>
              {salesByDepartment.length > 0 ? (
                <PieChart
                  series={[
                    {
                      data: salesByDepartment,
                      valueFormatter: (value,) => `${value.value.toFixed(2)} ₽`,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 30, color: 'gray' },
                      arcLabel: (item) => `${item.label}: ${((item.value / totalSalesAmount) * 100).toFixed(0)}%`,
                      arcLabelMinAngle: 20,
                    }
                  ]}
                  height={300}
                  margin={{ top: 10, bottom: 10 }}
                  slotProps={{
                    legend: { 
                      hidden: salesByDepartment.length > 5 ? true : false 
                    }
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography>Нет данных о продажах по отделам</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Товары на исходе
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Товар</TableCell>
                    <TableCell>Отдел</TableCell>
                    <TableCell align="right">Остаток</TableCell>
                    <TableCell align="right">Мин. порог</TableCell>
                    <TableCell align="right">Статус</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.department}</TableCell>
                      <TableCell align="right">{product.current}</TableCell>
                      <TableCell align="right">{product.minimum}</TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={product.status}
                          color={product.current === 0 ? 'error' : 'warning'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Все товары в достаточном количестве
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Топ-10 товаров по прибыльности
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Товар</TableCell>
                    <TableCell align="right">Цена продажи</TableCell>
                    <TableCell align="right">Закупочная цена</TableCell>
                    <TableCell align="right">Маржа, %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productProfitability.map((product) => (
                    <TableRow key={product.name}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="right">{product.price.toFixed(2)} ₽</TableCell>
                      <TableCell align="right">{product.purchasePrice.toFixed(2)} ₽</TableCell>
                      <TableCell align="right">{product.profitMargin.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                  {productProfitability.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Нет данных о прибыльности
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
