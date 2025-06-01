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
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { useDataStore } from '../../store/dataStore';
import { Product } from '../../types';

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useDataStore();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    cost: 0,
    stock: 0,
    description: '',
    supplier: '',
    lastRestocked: new Date().toISOString().split('T')[0]
  });
  
  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      name: '',
      category: '',
      price: 0,
      cost: 0,
      stock: 0,
      description: '',
      supplier: '',
      lastRestocked: new Date().toISOString().split('T')[0]
    });
    setOpenDialog(true);
  };
  
  const handleOpenEditDialog = (product: Product) => {
    setDialogMode('edit');
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      description: product.description || '',
      supplier: product.supplier,
      lastRestocked: product.lastRestocked
    });
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (['price', 'cost', 'stock'].includes(name)) {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = () => {
    if (dialogMode === 'add') {
      addProduct(formData);
    } else if (dialogMode === 'edit' && currentProduct) {
      updateProduct({
        ...formData,
        id: currentProduct.id
      });
    }
    
    handleCloseDialog();
  };
  
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      deleteProduct(id);
    }
  };
  
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Название', width: 200 },
    { field: 'category', headerName: 'Категория', width: 150 },
    { 
      field: 'price', 
      headerName: 'Цена продажи', 
      width: 130,
      valueFormatter: (value) => `${value} ₽`
    },
    { 
      field: 'cost', 
      headerName: 'Себестоимость', 
      width: 130,
      valueFormatter: (value) => `${value} ₽`
    },
    { 
      field: 'profit', 
      headerName: 'Прибыль', 
      width: 130,
      valueGetter: (_value, row) => row.price - row.cost,
      valueFormatter: (value: number) => `${value.toFixed(2)} ₽`
    },
    { field: 'stock', headerName: 'На складе', width: 120 },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton 
            color="primary" 
            size="small"
            onClick={() => handleOpenEditDialog(params.row as Product)}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            size="small"
            onClick={() => handleDeleteProduct(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const categories = [
    'Молочные продукты',
    'Мясо и птица',
    'Овощи и фрукты',
    'Хлебобулочные изделия',
    'Бакалея',
    'Напитки',
    'Кондитерские изделия',
    'Замороженные продукты',
    'Консервы',
    'Бытовая химия'
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Товары
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Добавить товар
        </Button>
      </Box>
      
      <Paper sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
        <DataGrid
          rows={products}
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
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {dialogMode === 'add' ? 'Добавить товар' : 'Редактировать товар'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Название товара"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              select
              id="category"
              label="Категория"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="price"
              label="Цена продажи"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              slotProps={{
                htmlInput: {
                  min: 0, step: 0.01
                },
                input: {
                  endAdornment: <Typography variant="body2">₽</Typography>
                }
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="cost"
              label="Себестоимость"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleInputChange}
              slotProps={{
                htmlInput: {
                  min: 0, step: 0.01
                },
                input: {
                  endAdornment: <Typography variant="body2">₽</Typography>
                }
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="stock"
              label="Количество на складе"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              slotProps={{
                htmlInput: {
                  min: 0, step: 1
                },
              }}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Описание"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="supplier"
              label="Поставщик"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="lastRestocked"
              label="Дата последней поставки"
              name="lastRestocked"
              type="date"
              value={formData.lastRestocked}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name || !formData.category || formData.price <= 0}
          >
            {dialogMode === 'add' ? 'Добавить' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
