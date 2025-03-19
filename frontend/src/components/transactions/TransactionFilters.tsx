import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  Typography,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { TransactionFilter } from '../../types/Transaction';

interface TransactionFiltersProps {
  filters: TransactionFilter;
  onFilterChange: (name: string, value: string) => void;
  onClearFilters: () => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const hasFilters = Object.values(filters).some(value => value !== '' && value !== undefined);

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filtros</Typography>
        
        {hasFilters && (
          <IconButton onClick={onClearFilters} size="small" color="primary">
            <ClearIcon /> <Typography variant="body2" sx={{ ml: 0.5 }}>Limpiar</Typography>
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Buscar por nombre"
          value={filters.name || ''}
          onChange={(e) => onFilterChange('name', e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        
        <TextField
          label="Filtrar por fecha"
          type="date"
          value={filters.date || ''}
          onChange={(e) => onFilterChange('date', e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1, minWidth: 200 }}
        />
        
        <FormControl size="small" sx={{ flex: 1, minWidth: 200 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filters.status || ''}
            label="Estado"
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="PENDING">Pendiente</MenuItem>
            <MenuItem value="PAID">Pagado</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
}; 