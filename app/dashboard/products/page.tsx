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
  IconButton
} from '@mui/material';
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
    description: ''
  });
  
  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      name: '',
      category: '',
      price: 0,
      cost: 0,
      stock: 0,
      description: ''
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
      description: product.description
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
      updateProduct(currentProduct.id, formData);
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
      valueFormatter: (params) => `${params.value} ₽`
    },
    { 
      field: 'cost', 
      headerName: 'Себестоимость', 
      width: 130,
      valueFormatter: (params) => `${params.value} ₽`
    },
    { 
      field: 'profit', 
      headerName: 'Прибыль', 
      width: 130,
      valueGetter: (params) => params.row.price - params.row.cost,
      valueFormatter: (params) => `${params.value} ₽`
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
              InputProps={{
                inputProps: { min: 0, step: 0.01 },
                endAdornment: <Typography variant="body2">₽</Typography>
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
              InputProps={{
                inputProps: { min: 0, step: 0.01 },
                endAdornment: <Typography variant="body2">₽</Typography>
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
              InputProps={{
                inputProps: { min: 0, step: 1 }
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
