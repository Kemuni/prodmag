'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  MenuItem,
  Paper,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDataStore } from '../../store/dataStore';
import { Sale, SaleItem, Product } from '../../types';

export default function SalesPage() {
  const { sales, products, addSale } = useDataStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  
  const [saleDate, setSaleDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'other'>('card');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [currentProduct, setCurrentProduct] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState(1);

  const handleOpenDialog = () => {
    setSaleDate(dayjs());
    setPaymentMethod('card');
    setSaleItems([]);
    setCurrentProduct('');
    setCurrentQuantity(1);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDetailsDialog = (sale: Sale) => {
    setSelectedSale(sale);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedSale(null);
  };

  const handleAddItem = () => {
    if (!currentProduct || currentQuantity <= 0) return;
    
    const product = products.find(p => p.id === currentProduct);
    if (!product) return;
    
    const existingItemIndex = saleItems.findIndex(item => item.productId === currentProduct);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...saleItems];
      const item = updatedItems[existingItemIndex];
      item.quantity += currentQuantity;
      item.total = item.price * item.quantity;
      setSaleItems(updatedItems);
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        quantity: currentQuantity,
        price: product.price,
        total: product.price * currentQuantity,
      };
      setSaleItems([...saleItems, newItem]);
    }
    
    setCurrentProduct('');
    setCurrentQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...saleItems];
    updatedItems.splice(index, 1);
    setSaleItems(updatedItems);
  };

  const calculateTotal = () => {
    return saleItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = () => {
    if (saleItems.length === 0 || !saleDate) return;
    
    const newSale: Omit<Sale, 'id'> = {
      date: saleDate.toISOString(),
      products: saleItems,
      total: calculateTotal(),
      paymentMethod,
    };
    
    addSale(newSale);
    handleCloseDialog();
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'date', 
      headerName: 'Дата и время', 
      width: 180,
      valueFormatter: (value) => {
        const date = new Date(value);
        return date.toLocaleString('ru-RU');
      }
    },
    { 
      field: 'total', 
      headerName: 'Сумма', 
      width: 120,
      valueFormatter: (value: number) => `${value.toFixed(2)} ₽`,
    },
    {
      field: 'itemCount',
      headerName: 'Кол-во товаров',
      width: 150,
      valueGetter: (params, row, ...rest) => row.products.length,
    },
    {
      field: 'paymentMethod',
      headerName: 'Способ оплаты',
      width: 150,
      renderCell: (params) => {
        const method = params.row.paymentMethod;
        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
        let label = 'Неизвестно';
        
        switch (method) {
          case 'cash':
            color = 'success';
            label = 'Наличные';
            break;
          case 'card':
            color = 'info';
            label = 'Карта';
            break;
          case 'other':
            color = 'warning';
            label = 'Другое';
            break;
        }
        
        return <Chip label={label} color={color} size="small" />;
      },
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 120,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleOpenDetailsDialog(params.row as Sale)}
        >
          <ReceiptIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Продажи
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Новая продажа
        </Button>
      </Box>
      
      <Paper sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
        <DataGrid
          rows={sales}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'date', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </Paper>
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Новая продажа
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <DatePicker 
                  label="Дата продажи"
                  value={saleDate}
                  onChange={(newValue) => setSaleDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Способ оплаты"
                  select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card' | 'other')}
                >
                  <MenuItem value="cash">Наличные</MenuItem>
                  <MenuItem value="card">Карта</MenuItem>
                  <MenuItem value="other">Другое</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Товары
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Товар"
                  select
                  value={currentProduct}
                  onChange={(e) => setCurrentProduct(e.target.value)}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} - {product.price.toFixed(2)} ₽
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Количество"
                  type="number"
                  value={currentQuantity}
                  onChange={(e) => setCurrentQuantity(parseFloat(e.target.value) || 0)}
                  InputProps={{
                    inputProps: { min: 0.1, step: 0.1 },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ height: '100%' }}
                  onClick={handleAddItem}
                >
                  Добавить
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Товар</TableCell>
                        <TableCell align="right">Цена</TableCell>
                        <TableCell align="right">Количество</TableCell>
                        <TableCell align="right">Сумма</TableCell>
                        <TableCell align="right">Действия</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {saleItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell align="right">{item.price.toFixed(2)} ₽</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">{item.total.toFixed(2)} ₽</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {saleItems.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            Нет добавленных товаров
                          </TableCell>
                        </TableRow>
                      )}
                      {saleItems.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <Typography variant="subtitle1" fontWeight="bold">
                              Итого:
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle1" fontWeight="bold">
                              {calculateTotal().toFixed(2)} ₽
                            </Typography>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={saleItems.length === 0}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Детали продажи
        </DialogTitle>
        <DialogContent>
          {selectedSale && (
            <Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">ID продажи</Typography>
                  <Typography variant="body1">{selectedSale.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Дата и время</Typography>
                  <Typography variant="body1">
                    {new Date(selectedSale.date).toLocaleString('ru-RU')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Способ оплаты</Typography>
                  <Chip 
                    label={
                      selectedSale.paymentMethod === 'cash' ? 'Наличные' : 
                      selectedSale.paymentMethod === 'card' ? 'Карта' : 'Другое'
                    }
                    color={
                      selectedSale.paymentMethod === 'cash' ? 'success' : 
                      selectedSale.paymentMethod === 'card' ? 'info' : 'warning'
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Итоговая сумма</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedSale.total.toFixed(2)} ₽
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Товары
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Товар</TableCell>
                          <TableCell align="right">Цена</TableCell>
                          <TableCell align="right">Количество</TableCell>
                          <TableCell align="right">Сумма</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedSale.products.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell align="right">{item.price.toFixed(2)} ₽</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{item.total.toFixed(2)} ₽</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
