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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useDataStore } from '../../store/dataStore';
import { Supply, SupplyStatus } from '../../types';
import { InputAdornment } from '@mui/material';

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'pending':
      return { label: 'В ожидании', color: 'warning' as const };
    case 'received':
      return { label: 'Получено', color: 'info' as const };
    case 'completed':
      return { label: 'Завершено', color: 'success' as const };
    case 'cancelled':
      return { label: 'Отменено', color: 'error' as const };
    default:
      return { label: 'Неизвестно', color: 'default' as const };
  }
};

export default function SuppliesPage() {
  const { supplies, addSupply, updateSupply, deleteSupply, suppliers, products, supplyItems, addSupplyItem, deleteSupplyItem } = useDataStore();
  
  const [tabValue, setTabValue] = useState(0);
  const [openSupplyDialog, setOpenSupplyDialog] = useState(false);
  const [openItemsDialog, setOpenItemsDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [supplyFormData, setSupplyFormData] = useState({
    supplier_id: '',
    supply_date: new Date().toISOString().split('T')[0],
    approved_by: '',
    total_cost: 0,
    status: 'pending' as SupplyStatus
  });
  const [itemFormData, setItemFormData] = useState({
    product_id: '',
    quantity: 0,
    unit_price: 0,
    supply_id: ''
  });
  const [currentSupplyId, setCurrentSupplyId] = useState<string | null>(null);
  
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);
  const [statusMenuSupplyId, setStatusMenuSupplyId] = useState<string | null>(null);
  
  const handleOpenStatusMenu = (event: React.MouseEvent<HTMLElement>, supplyId: string) => {
    setStatusMenuAnchor(event.currentTarget);
    setStatusMenuSupplyId(supplyId);
  };
  
  const handleCloseStatusMenu = () => {
    setStatusMenuAnchor(null);
    setStatusMenuSupplyId(null);
  };
  
  const handleChangeStatus = (status: string) => {
    if (!statusMenuSupplyId) return;
    
    const supply = supplies.find(s => s.id === statusMenuSupplyId);
    if (!supply) return;
    
    updateSupply({
      ...supply,
      status: status as SupplyStatus
    });
    
    handleCloseStatusMenu();
  };
  
  const memoizedSupplies = useMemo(() => {
    return supplies.map(supply => {
      const supplier = suppliers.find(s => s.id === supply.supplier_id);
      const items = supplyItems.filter(item => item.supply_id === supply.id);
      const totalCost = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
      
      return {
        ...supply,
        supplier_name: supplier?.name || 'Неизвестно',
        total_cost: totalCost,
        items_count: items.length
      };
    });
  }, [supplies, suppliers, supplyItems]);

  const memoizedSupplyItems = useMemo(() => {
    const currentItems = supplyItems.filter(item => item.supply_id === currentSupplyId);
    return currentItems.map(item => {
      const product = products.find(p => p.id === item.product_id);
      return {
        ...item,
        product_name: product?.name || 'Неизвестно',
        total_price: item.unit_price * item.quantity
      };
    });
  }, [supplyItems, products, currentSupplyId]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenSupplyDialog = () => {
    setEditingId(null);
    setSupplyFormData({
      supplier_id: '',
      supply_date: new Date().toISOString().split('T')[0],
      approved_by: '',
      total_cost: 0,
      status: 'pending'
    });
    setOpenSupplyDialog(true);
  };

  const handleOpenEditSupplyDialog = (supply: Supply) => {
    setEditingId(supply.id);
    setSupplyFormData({
      supplier_id: supply.supplier_id,
      supply_date: supply.supply_date,
      approved_by: supply.approved_by || '',
      total_cost: supply.total_cost || 0,
      status: supply.status || 'pending'
    });
    setOpenSupplyDialog(true);
  };

  const handleCloseSupplyDialog = () => {
    setOpenSupplyDialog(false);
    setEditingId(null);
  };

  const handleAddSupply = () => {
    const newSupply = {
      id: Date.now().toString(),
      ...supplyFormData
    };
    
    addSupply(newSupply);
    handleCloseSupplyDialog();
  };
  
  const handleUpdateSupply = () => {
    if (!editingId) return;
    
    const updatedSupply = {
      id: editingId,
      ...supplyFormData
    };
    
    updateSupply(updatedSupply);
    handleCloseSupplyDialog();
  };
  
  const handleDeleteSupply = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту поставку?')) {
      deleteSupply(id);
    }
  };

  const handleViewSupplyItems = (supplyId: string) => {
    setCurrentSupplyId(supplyId);
    setTabValue(1);
  };

  const handleOpenAddItemDialog = () => {
    if (!currentSupplyId) return;
    
    setItemFormData({
      product_id: '',
      quantity: 0,
      unit_price: 0,
      supply_id: currentSupplyId
    });
    setOpenItemsDialog(true);
  };

  const handleCloseItemsDialog = () => {
    setOpenItemsDialog(false);
  };

  const handleAddSupplyItem = () => {
    const newItem = {
      id: Date.now().toString(),
      ...itemFormData
    };
    
    addSupplyItem(newItem);
    handleCloseItemsDialog();
  };
  
  const handleDeleteSupplyItem = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар из поставки?')) {
      deleteSupplyItem(id);
    }
  };

  const supplyColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'supply_date', 
      headerName: 'Дата поставки', 
      width: 180, 
      valueFormatter: (value) => new Date(value).toLocaleString('ru-RU')
    },
    { field: 'supplier_name', headerName: 'Поставщик', width: 200 },
    { field: 'items_count', headerName: 'Кол-во товаров', width: 150 },
    { 
      field: 'total_cost', 
      headerName: 'Общая стоимость', 
      width: 150, 
      valueFormatter: (value: number) => `${value.toFixed(2)} ₽` 
    },
    { 
      field: 'status', 
      headerName: 'Статус', 
      width: 120, 
      renderCell: (params) => (
        <Box>
          <Chip 
            label={getStatusDisplay(params.value).label} 
            color={getStatusDisplay(params.value).color} 
            sx={{ mr: 1 }}
          />
          <IconButton 
            color="primary" 
            size="small"
            onClick={(event) => handleOpenStatusMenu(event, params.row.id)}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      )
    },
    { field: 'approved_by', headerName: 'Утвердил', width: 150 },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 180,
      renderCell: (params) => (
        <Box>
          <IconButton 
            color="primary" 
            size="small"
            onClick={() => handleViewSupplyItems(params.row.id)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton 
            color="primary" 
            size="small"
            onClick={() => handleOpenEditSupplyDialog(params.row as Supply)}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            size="small"
            onClick={() => handleDeleteSupply(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const itemColumns: GridColDef[] = [
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
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 100,
      renderCell: (params) => (
        <IconButton 
          color="error" 
          size="small"
          onClick={() => handleDeleteSupplyItem(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Поставки
        </Typography>
        {tabValue === 0 ? (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenSupplyDialog}
          >
            Новая поставка
          </Button>
        ) : (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenAddItemDialog}
            disabled={!currentSupplyId}
          >
            Добавить товар
          </Button>
        )}
      </Box>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Все поставки" />
        <Tab label="Товары в поставке" disabled={!currentSupplyId} />
      </Tabs>

      <Paper sx={{ height: 'calc(100vh - 230px)', width: '100%' }}>
        {tabValue === 0 ? (
          <DataGrid
            rows={memoizedSupplies}
            columns={supplyColumns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: 'supply_date', sort: 'desc' }],
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
          />
        ) : (
          <DataGrid
            rows={memoizedSupplyItems}
            columns={itemColumns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
          />
        )}
      </Paper>
      
      {/* Меню для изменения статуса */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={handleCloseStatusMenu}
      >
        <MenuItem onClick={() => handleChangeStatus('pending')}>
          <Chip 
            label={getStatusDisplay('pending').label} 
            color={getStatusDisplay('pending').color} 
            size="small" 
            sx={{ mr: 1 }}
          />
          В ожидании
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus('received')}>
          <Chip 
            label={getStatusDisplay('received').label} 
            color={getStatusDisplay('received').color} 
            size="small" 
            sx={{ mr: 1 }}
          />
          Получено
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus('completed')}>
          <Chip 
            label={getStatusDisplay('completed').label} 
            color={getStatusDisplay('completed').color} 
            size="small" 
            sx={{ mr: 1 }}
          />
          Завершено
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus('cancelled')}>
          <Chip 
            label={getStatusDisplay('cancelled').label} 
            color={getStatusDisplay('cancelled').color} 
            size="small" 
            sx={{ mr: 1 }}
          />
          Отменено
        </MenuItem>
      </Menu>
      
      {/* Supply Dialog */}
      <Dialog 
        open={openSupplyDialog} 
        onClose={handleCloseSupplyDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingId ? 'Редактировать поставку' : 'Новая поставка'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Поставщик"
                value={supplyFormData.supplier_id}
                onChange={(e) => setSupplyFormData({ ...supplyFormData, supplier_id: e.target.value })}
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
                label="Дата поставки"
                type="date"
                value={supplyFormData.supply_date}
                onChange={(e) => setSupplyFormData({ ...supplyFormData, supply_date: e.target.value })}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Утвердил"
                value={supplyFormData.approved_by}
                onChange={(e) => setSupplyFormData({ ...supplyFormData, approved_by: e.target.value })}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Статус"
                value={supplyFormData.status}
                onChange={(e) => setSupplyFormData({ ...supplyFormData, status: e.target.value as SupplyStatus })}
                fullWidth
                margin="normal"
              >
                <MenuItem value="pending">В ожидании</MenuItem>
                <MenuItem value="received">Получено</MenuItem>
                <MenuItem value="completed">Завершено</MenuItem>
                <MenuItem value="cancelled">Отменено</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSupplyDialog}>Отмена</Button>
          <Button 
            onClick={editingId ? handleUpdateSupply : handleAddSupply} 
            variant="contained"
            disabled={!supplyFormData.supplier_id}
          >
            {editingId ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Supply Items Dialog */}
      <Dialog 
        open={openItemsDialog} 
        onClose={handleCloseItemsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Добавить товар в поставку</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <TextField
                select
                label="Товар"
                value={itemFormData.product_id}
                onChange={(e) => setItemFormData({ ...itemFormData, product_id: e.target.value })}
                fullWidth
                margin="normal"
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Количество"
                type="number"
                value={itemFormData.quantity}
                onChange={(e) => setItemFormData({ ...itemFormData, quantity: parseInt(e.target.value) })}
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
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 0.01
                  },
                  input: {
                    endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseItemsDialog}>Отмена</Button>
          <Button 
            onClick={handleAddSupplyItem} 
            variant="contained"
            disabled={!itemFormData.product_id || itemFormData.quantity <= 0}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
