import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography
} from '@mui/material';

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  pendingTotal: number;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  open,
  onClose,
  onSubmit,
  pendingTotal
}) => {
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = () => {
    onSubmit(amount);
    setAmount(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ bgcolor: '#FF7F32', color: 'white' }}>
        Procesar Pago
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
          Total pendiente: ${pendingTotal.toFixed(2)}
        </Typography>
        <TextField
          label="Monto a pagar"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          fullWidth
          required
          inputProps={{ min: 0.01, step: 0.01 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={amount <= 0}
        >
          Pagar
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 