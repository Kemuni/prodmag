'use client';

import React, { useState, useMemo } from 'react';
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
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  AddCircle as AddCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useDataStore } from '../../store/dataStore';
import { InputAdornment, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Sale, SaleItem } from '../../types';

export default function SalesPage() {
  const { sales, addSale, deleteSale, saleItems, addSaleItem, deleteSaleItem, products } = useDataStore();
  
  const memoizedProducts = useMemo(() => products, [products]);
  
  const memoizedSales = useMemo(() => {
    return sales.map(sale => {
      const items = saleItems.filter(item => item.sale_id === sale.id);
      const totalPrice = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
      const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...sale,
        total_price: totalPrice,
        items_count: itemsCount
      };
    });
  }, [sales, saleItems]);

  const [currentSaleId, setCurrentSaleId] = useState<string | null>(null);
  const memoizedSaleItems = useMemo(() => {
    if (!currentSaleId) return [];
    
    return saleItems
      .filter(item => item.sale_id === currentSaleId)
      .map(item => {
        const product = memoizedProducts.find(p => p.id === item.product_id);
        return {
          ...item,
          product_name: product?.name || 'Товар не найден',
          total_price: item.unit_price * item.quantity
        };
      });
  }, [saleItems, currentSaleId, memoizedProducts]);

  const [openSaleDialog, setOpenSaleDialog] = useState(false);
  const [openItemsDialog, setOpenItemsDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  
  const [saleFormData, setSaleFormData] = useState<Omit<Sale, 'id'>>({
    creation_date: new Date().toISOString(),
    cashier_id: '1'
  });
  
  const [itemFormData, setItemFormData] = useState<Omit<SaleItem, 'id' | 'sale_id'>>({
    product_id: '',
    quantity: 1,
    unit_price: 0
  });
  
  const [tempSaleItems, setTempSaleItems] = useState<Array<Omit<SaleItem, 'id' | 'sale_id'>>>([]);

  const handleOpenSaleDialog = () => {
    setSaleFormData({
      creation_date: new Date().toISOString(),
      cashier_id: '1'
    });
    setTempSaleItems([]);
    setOpenSaleDialog(true);
  };

  const handleCloseSaleDialog = () => {
    setOpenSaleDialog(false);
  };

  const handleAddSale = () => {
    const newSale = {
      ...saleFormData
    };
    
    const saleId = addSale(newSale);
    
    tempSaleItems.forEach(item => {
      addSaleItem({
        ...item,
        sale_id: saleId
      });
    });
    
    handleCloseSaleDialog();
  };

  const handleViewSale = (saleId: string) => {
    setCurrentSaleId(saleId);
    setOpenViewDialog(true);
  };

  const handleDeleteSale = (id: string) => {
    saleItems.filter(item => item.sale_id === id).forEach(item => {
      deleteSaleItem(item.id);
    });
    
    deleteSale(id);
  };

  const handleOpenItemDialog = () => {
    setItemFormData({
      product_id: '',
      quantity: 1,
      unit_price: 0
    });
    setOpenItemsDialog(true);
  };
  
  const handleCloseItemDialog = () => {
    setOpenItemsDialog(false);
  };

  const handleProductChange = (productId: string) => {
    const product = memoizedProducts.find(p => p.id === productId);
    if (product) {
      setItemFormData({
        ...itemFormData,
        product_id: productId,
        unit_price: product.price
      });
    }
  };

  const handleQuantityChange = (quantity: number) => {
    if (quantity <= 0) return;
    setItemFormData({
      ...itemFormData,
      quantity
    });
  };

  const handleAddSaleItem = () => {
    if (!itemFormData.product_id || itemFormData.quantity <= 0) return;
    
    setTempSaleItems([...tempSaleItems, itemFormData]);
    
    setItemFormData({
      product_id: '',
      quantity: 1,
      unit_price: 0
    });
  };

  const handleRemoveTempItem = (index: number) => {
    setTempSaleItems(tempSaleItems.filter((_, i) => i !== index));
  };

  const salesColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'creation_date', 
      headerName: 'Дата продажи', 
      width: 180,
      valueFormatter: (value) => new Date(value).toLocaleString('ru-RU')
    },
    { 
      field: 'items_count', 
      headerName: 'Кол-во товаров', 
      width: 150
    },
    { 
      field: 'total_price', 
      headerName: 'Сумма', 
      width: 120,
      valueFormatter: (value: number) => `${value.toFixed(2)} ₽`
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton 
            onClick={() => handleViewSale(params.row.id)}
            size="small" 
            color="primary"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton 
            onClick={() => handleDeleteSale(params.row.id)}
            size="small" 
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];
  
  const itemsColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'product_name', headerName: 'Товар', width: 250 },
    { field: 'quantity', headerName: 'Количество', width: 120 },
    { 
      field: 'unit_price', 
      headerName: 'Цена за ед.', 
      width: 150,
      valueFormatter: (value: number) => `${value.toFixed(2)} ₽`
    },
    { 
      field: 'total_price', 
      headerName: 'Общая стоимость', 
      width: 150,
      valueFormatter: (value: number) => `${value.toFixed(2)} ₽`
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Продажи</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenSaleDialog}
        >
          Добавить продажу
        </Button>
      </Box>

      <Paper sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
        <DataGrid
          rows={memoizedSales}
          columns={salesColumns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
            sorting: {
              sortModel: [{ field: 'creation_date', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[25, 50, 100]}
        />
      </Paper>

      {/* Диалог добавления продажи */}
      <Dialog open={openSaleDialog} onClose={handleCloseSaleDialog} maxWidth="md" fullWidth>
        <DialogTitle>Добавить продажу</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 2 }}>
            <Typography variant="h6">Товары в продаже</Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={handleOpenItemDialog}
              size="small"
            >
              Добавить товар
            </Button>
          </Box>
          
          {tempSaleItems.length > 0 ? (
            <List>
              {tempSaleItems.map((item, index) => {
                const product = memoizedProducts.find(p => p.id === item.product_id);
                const totalPrice = item.unit_price * item.quantity;
                
                return (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={product?.name || 'Товар не найден'}
                      secondary={`Количество: ${item.quantity}, Цена: ${item.unit_price.toFixed(2)} ₽, Всего: ${totalPrice.toFixed(2)} ₽`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTempItem(index)}>
                        <CancelIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography color="textSecondary" align="center" sx={{ my: 4 }}>
              Нет добавленных товаров
            </Typography>
          )}
          
          {tempSaleItems.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="h6" align="right">
                Общая сумма: {tempSaleItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0).toFixed(2)} ₽
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaleDialog}>Отмена</Button>
          <Button 
            onClick={handleAddSale} 
            variant="contained"
            disabled={tempSaleItems.length === 0}
          >
            Создать продажу
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Диалог добавления элемента продажи */}
      <Dialog open={openItemsDialog} onClose={handleCloseItemDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить товар в продажу</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <TextField
                select
                label="Товар"
                value={itemFormData.product_id}
                onChange={(e) => handleProductChange(e.target.value)}
                fullWidth
                margin="normal"
              >
                {memoizedProducts.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} - {product.price.toFixed(2)} ₽
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Количество"
                type="number"
                value={itemFormData.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                fullWidth
                margin="normal"
                slotProps={{
                  htmlInput: {
                    min: 1
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Цена за единицу"
                type="number"
                value={itemFormData.unit_price}
                onChange={(e) => setItemFormData({ ...itemFormData, unit_price: parseFloat(e.target.value) })}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                }}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 0.01
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Общая стоимость: {(itemFormData.unit_price * itemFormData.quantity).toFixed(2)} ₽
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseItemDialog}>Отмена</Button>
          <Button 
            onClick={handleAddSaleItem} 
            variant="contained"
            disabled={!itemFormData.product_id || itemFormData.quantity <= 0}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Диалог просмотра продажи */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Информация о продаже</DialogTitle>
        <DialogContent>
          {currentSaleId && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                ID продажи: {currentSaleId}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Дата: {new Date(sales.find(s => s.id === currentSaleId)?.creation_date || '').toLocaleString('ru-RU')}
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Товары в продаже
              </Typography>
              
              <DataGrid
                rows={memoizedSaleItems}
                columns={itemsColumns}
                autoHeight
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 5, page: 0 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                sx={{ mb: 3 }}
              />
              
              <Typography variant="h6" align="right">
                Общая сумма: {memoizedSaleItems.reduce((sum, item) => sum + item.total_price, 0).toFixed(2)} ₽
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
