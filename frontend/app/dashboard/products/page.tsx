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
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { useDataStore } from '../../store/dataStore';
import { Product } from '../../types';
import { InputAdornment } from '@mui/material';

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, departments, suppliers } = useDataStore();
  
  const memoizedProducts = useMemo(() => {
    return products.map(product => {
      const department = departments.find(d => d.id === product.department_id);
      const supplier = suppliers.find(s => s.id === product.supplier_id);
      return {
        ...product,
        department_name: department?.name || 'Неизвестно',
        supplier_name: supplier?.name || 'Неизвестно'
      };
    });
  }, [products, departments, suppliers]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    department_id: '',
    supplier_id: '',
    grade: '',
    price: 0,
    current_quantity: 0,
    min_threshold: 0,
    expiry_date: new Date().toISOString().split('T')[0],
    storage_cond: ''
  });
  
  const handleOpenAddDialog = () => {
    setEditingId(null);
    setFormData({
      name: '',
      department_id: '',
      supplier_id: '',
      grade: '',
      price: 0,
      current_quantity: 0,
      min_threshold: 0,
      expiry_date: new Date().toISOString().split('T')[0],
      storage_cond: ''
    });
    setOpenDialog(true);
  };
  
  const handleOpenEditDialog = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      department_id: product.department_id,
      supplier_id: product.supplier_id,
      grade: product.grade,
      price: product.price,
      current_quantity: product.current_quantity,
      min_threshold: product.min_threshold,
      expiry_date: product.expiry_date,
      storage_cond: product.storage_cond
    });
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };
  
  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      ...formData
    };
    
    addProduct(newProduct);
    handleCloseDialog();
  };
  
  const handleUpdateProduct = () => {
    if (!editingId) return;
    
    const updatedProduct = {
      id: editingId,
      ...formData
    };
    
    updateProduct(updatedProduct);
    handleCloseDialog();
  };
  
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      deleteProduct(id);
    }
  };
  
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Название', width: 200 },
    { field: 'department_name', headerName: 'Отдел', width: 150 },
    { field: 'supplier_name', headerName: 'Поставщик', width: 150 },
    { field: 'grade', headerName: 'Сорт/Класс', width: 120 },
    { 
      field: 'price', 
      headerName: 'Цена', 
      type: 'number', 
      width: 100, 
      valueFormatter: (value: number) => `${value.toFixed(2)} ₽`
    },
    { field: 'current_quantity', headerName: 'На складе', type: 'number', width: 100 },
    { field: 'min_threshold', headerName: 'Мин. запас', type: 'number', width: 100 },
    { 
      field: 'expiry_date', 
      headerName: 'Срок годности', 
      width: 130, 
      valueFormatter: (value) => new Date(value).toLocaleDateString('ru-RU')
    },
    { field: 'storage_cond', headerName: 'Условия хранения', width: 180 },
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
          rows={memoizedProducts}
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingId ? 'Редактировать товар' : 'Добавить новый товар'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Название"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Отдел"
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                fullWidth
                margin="normal"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Поставщик"
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                fullWidth
                margin="normal"
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>{supplier.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Сорт/Класс"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Цена"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                fullWidth
                margin="normal"
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 0.01
                  }
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Количество на складе"
                type="number"
                value={formData.current_quantity}
                onChange={(e) => setFormData({ ...formData, current_quantity: parseInt(e.target.value) })}
                fullWidth
                margin="normal"
                slotProps={{
                  htmlInput: {
                    min: 0
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Минимальный запас"
                type="number"
                value={formData.min_threshold}
                onChange={(e) => setFormData({ ...formData, min_threshold: parseInt(e.target.value) })}
                fullWidth
                margin="normal"
                slotProps={{
                  htmlInput: {
                    min: 0
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Срок годности"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                fullWidth
                margin="normal"
                slotProps={{
                  htmlInput: {
                    min: new Date().toISOString().split('T')[0]
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <TextField
                label="Условия хранения"
                value={formData.storage_cond}
                onChange={(e) => setFormData({ ...formData, storage_cond: e.target.value })}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button 
            onClick={editingId ? handleUpdateProduct : handleAddProduct} 
            variant="contained"
          >
            {editingId ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
