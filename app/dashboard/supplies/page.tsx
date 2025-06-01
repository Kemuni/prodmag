'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  LocalShipping as LocalShippingIcon,
  Check as CheckIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDataStore } from '../../store/dataStore';
import { Supply, SupplyItem } from '../../types';

export default function SuppliesPage() {
  const { supplies, products, addSupply, updateSupplyStatus } = useDataStore();
  const [openDialog, setOpenDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    date: dayjs(),
    supplier: '',
  });
  
  const [supplyItems, setSupplyItems] = useState<SupplyItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cost, setCost] = useState(0);
  
  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0 || cost <= 0) return;
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;
    
    const existingItemIndex = supplyItems.findIndex(item => item.productId === selectedProduct);
    
    if (existingItemIndex !== -1) {
      const updatedItems = [...supplyItems];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].total = 
        updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].cost;
      setSupplyItems(updatedItems);
    } else {
      setSupplyItems([
        ...supplyItems,
        {
          productId: product.id,
          productName: product.name,
          quantity,
          cost,
          total: cost * quantity
        }
      ]);
    }
    
    setSelectedProduct('');
    setQuantity(1);
    setCost(0);
  };
  
  const handleRemoveItem = (productId: string) => {
    setSupplyItems(supplyItems.filter(item => item.productId !== productId));
  };
  
  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
    
    const product = products.find(p => p.id === productId);
    if (product) {
      setCost(product.cost);
    }
  };
  
  const handleSubmit = () => {
    if (supplyItems.length === 0 || !formData.supplier) return;
    
    const total = supplyItems.reduce((sum, item) => sum + item.total, 0);
    
    addSupply({
      date: formData.date.toISOString(),
      supplier: formData.supplier,
      products: supplyItems,
      total,
      status: 'pending',
    });
    
    setOpenDialog(false);
    setSupplyItems([]);
    setFormData({
      date: dayjs(),
      supplier: '',
    });
  };
  
  const handleStatusChange = (id: string, status: Supply['status']) => {
    updateSupplyStatus(id, status);
  };
  
  const columns: GridColDef[] = [
    { 
      field: 'date', 
      headerName: 'Дата поставки', 
      width: 180,
      valueFormatter: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('ru-RU');
      }
    },
    { field: 'supplier', headerName: 'Поставщик', width: 200 },
    { 
      field: 'total', 
      headerName: 'Сумма', 
      width: 120,
      valueFormatter: (value) => `${value.toFixed(2)} ₽`,
    },
    {
      field: 'itemCount',
      headerName: 'Кол-во товаров',
      width: 150,
      valueGetter: (params, row, ...rest) => row.products.length,
    },
    {
      field: 'status',
      headerName: 'Статус',
      width: 150,
      renderCell: (params) => {
        const status = params.value;
        let label = 'Неизвестно';
        let color: 'success' | 'warning' | 'error' | 'default' = 'default';
        
        if (status === 'pending') {
          label = 'Ожидается';
          color = 'warning';
        } else if (status === 'delivered') {
          label = 'Доставлено';
          color = 'success';
        } else if (status === 'canceled') {
          label = 'Отменено';
          color = 'error';
        }
        
        return <Chip label={label} color={color} size="small" />;
      }
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const isDelivered = params.row.status === 'delivered';
        const isCanceled = params.row.status === 'canceled';
        const isPending = params.row.status === 'pending';
        
        return (
          <Box>
            {isPending && (
              <>
                <IconButton 
                  color="success" 
                  size="small"
                  onClick={() => handleStatusChange(params.row.id, 'delivered')}
                  title="Отметить как доставлено"
                >
                  <CheckIcon />
                </IconButton>
                <IconButton 
                  color="error" 
                  size="small"
                  onClick={() => handleStatusChange(params.row.id, 'canceled')}
                  title="Отменить поставку"
                >
                  <CancelIcon />
                </IconButton>
              </>
            )}
            {(isDelivered || isCanceled) && (
              <IconButton 
                color="primary" 
                size="small"
                onClick={() => handleStatusChange(params.row.id, 'pending')}
                title="Вернуть в ожидание"
              >
                <LocalShippingIcon />
              </IconButton>
            )}
          </Box>
        );
      }
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Поставки
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Новая поставка
        </Button>
      </Box>
      
      <Paper sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
        <DataGrid
          rows={supplies}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
        />
      </Paper>
      
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Новая поставка</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Дата поставки"
                  value={formData.date}
                  onChange={(newValue) => newValue && setFormData({...formData, date: newValue})}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Поставщик"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                fullWidth
                required
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                Товары
              </Typography>
              <Box display="flex" gap={1} mb={2}>
                <TextField
                  select
                  label="Товар"
                  value={selectedProduct}
                  onChange={(e) => handleProductChange(e.target.value)}
                  sx={{ flexGrow: 1 }}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} - {product.cost.toFixed(2)} ₽
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Количество"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  inputProps={{ min: 1, step: 1 }}
                  sx={{ width: 120 }}
                />
                <TextField
                  label="Цена закупки"
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  inputProps={{ min: 0.01, step: 0.01 }}
                  sx={{ width: 150 }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddItem}
                  startIcon={<LocalShippingIcon />}
                >
                  Добавить
                </Button>
              </Box>
              
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Товар</TableCell>
                      <TableCell align="right">Цена закупки</TableCell>
                      <TableCell align="right">Количество</TableCell>
                      <TableCell align="right">Сумма</TableCell>
                      <TableCell align="center">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {supplyItems.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="right">{item.cost.toFixed(2)} ₽</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{item.total.toFixed(2)} ₽</TableCell>
                        <TableCell align="center">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleRemoveItem(item.productId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {supplyItems.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <Typography variant="subtitle1">Итого:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1">
                            {supplyItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)} ₽
                          </Typography>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    )}
                    {supplyItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Нет добавленных товаров
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={supplyItems.length === 0 || !formData.supplier}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
