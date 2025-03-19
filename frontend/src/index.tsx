import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Definimos los tipos
interface Transaction {
  id?: number;
  name: string;
  date: string;
  amount: number;
  status: 'PENDING' | 'PAID';
}

interface TransactionFilter {
  name: string;
  date: string;
  status: string;
}

// Datos de ejemplo
const initialTransactions: Transaction[] = [
  { id: 1, name: 'Factura Electricidad', date: '2024-05-01', amount: 150, status: 'PENDING' },
  { id: 2, name: 'Compra Supermercado', date: '2024-05-02', amount: 75.5, status: 'PAID' },
  { id: 3, name: 'Suscripción Internet', date: '2024-05-05', amount: 45, status: 'PENDING' }
];

const FullApp = () => {
  // Estado para las transacciones
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  
  // Estado para los filtros
  const [filters, setFilters] = useState<TransactionFilter>({
    name: '',
    date: '',
    status: ''
  });

  // Estados para los formularios
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id' | 'status'>>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0
  });
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Función para filtrar transacciones
  const filteredTransactions = transactions.filter(transaction => {
    const matchesName = !filters.name || 
      transaction.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesDate = !filters.date || transaction.date === filters.date;
    const matchesStatus = !filters.status || transaction.status === filters.status;
    return matchesName && matchesDate && matchesStatus;
  });

  // Función para añadir una transacción
  const addTransaction = () => {
    if (newTransaction.name && newTransaction.date && newTransaction.amount > 0) {
      const transaction: Transaction = {
        ...newTransaction,
        id: Math.max(0, ...transactions.map(t => t.id || 0)) + 1,
        status: 'PENDING'
      };
      setTransactions([...transactions, transaction]);
      setNewTransaction({
        name: '',
        date: new Date().toISOString().split('T')[0],
        amount: 0
      });
      setShowAddForm(false);
    }
  };

  // Función para editar una transacción
  const startEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setNewTransaction({
      name: transaction.name,
      date: transaction.date,
      amount: transaction.amount
    });
    setShowEditForm(true);
  };

  const updateTransaction = () => {
    if (currentTransaction && newTransaction.name && newTransaction.date && newTransaction.amount > 0) {
      const updatedTransactions = transactions.map(t => 
        t.id === currentTransaction.id 
          ? { ...t, name: newTransaction.name, date: newTransaction.date, amount: newTransaction.amount }
          : t
      );
      setTransactions(updatedTransactions);
      setCurrentTransaction(null);
      setNewTransaction({
        name: '',
        date: new Date().toISOString().split('T')[0],
        amount: 0
      });
      setShowEditForm(false);
    }
  };

  // Función para eliminar una transacción
  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Función para procesar un pago
  const processPayment = () => {
    if (paymentAmount <= 0) return;

    let remainingAmount = paymentAmount;
    const pendingTransactions = [...transactions]
      .filter(t => t.status === 'PENDING')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const updatedTransactions = [...transactions];
    
    for (const transaction of pendingTransactions) {
      if (remainingAmount >= transaction.amount) {
        const index = updatedTransactions.findIndex(t => t.id === transaction.id);
        updatedTransactions[index] = { ...transaction, status: 'PAID' };
        remainingAmount -= transaction.amount;
      } else {
        break;
      }
    }
    
    setTransactions(updatedTransactions);
    setPaymentAmount(0);
    setShowPaymentForm(false);
  };

  // Calcular totales
  const pendingTotal = transactions
    .filter(t => t.status === 'PENDING')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const paidTotal = transactions
    .filter(t => t.status === 'PAID')
    .reduce((sum, t) => sum + t.amount, 0);

  // Estilos comunes
  const buttonStyle = { 
    backgroundColor: '#FF7F32', 
    color: 'white', 
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px'
  };

  const inputStyle = {
    padding: '8px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ddd',
    width: '100%'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '20px auto'
  };

  const modalOverlay = {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1 style={{ color: '#7a3cff' }}>Sistema de Transacciones</h1>
      
      {/* Resumen */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <div>
          <p style={{ color: '#6c757d', margin: '0' }}>Total Pendiente</p>
          <p style={{ color: '#FF7F32', fontWeight: 'bold', fontSize: '18px', margin: '5px 0' }}>
            ${pendingTotal.toFixed(2)}
          </p>
        </div>
        <div>
          <p style={{ color: '#6c757d', margin: '0' }}>Total Pagado</p>
          <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', margin: '5px 0' }}>
            ${paidTotal.toFixed(2)}
          </p>
        </div>
        <div>
          <p style={{ color: '#6c757d', margin: '0' }}>Total General</p>
          <p style={{ color: '#000', fontWeight: 'bold', fontSize: '18px', margin: '5px 0' }}>
            ${(pendingTotal + paidTotal).toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* Botones */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          style={buttonStyle}
          onClick={() => setShowAddForm(true)}
        >
          Nueva Transacción
        </button>
        
        <button 
          style={{ 
            ...buttonStyle, 
            backgroundColor: pendingTotal <= 0 ? '#ccc' : '#000',
            cursor: pendingTotal <= 0 ? 'not-allowed' : 'pointer'
          }}
          onClick={() => pendingTotal > 0 && setShowPaymentForm(true)}
          disabled={pendingTotal <= 0}
        >
          Procesar Pago
        </button>
      </div>
      
      {/* Filtros */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ marginTop: '0', color: '#495057' }}>Filtros</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#495057' }}>
              Buscar por nombre
            </label>
            <input 
              type="text"
              value={filters.name}
              onChange={(e) => setFilters({...filters, name: e.target.value})}
              style={inputStyle}
              placeholder="Nombre..."
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#495057' }}>
              Filtrar por fecha
            </label>
            <input 
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#495057' }}>
              Estado
            </label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              style={inputStyle}
            >
              <option value="">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="PAID">Pagado</option>
            </select>
          </div>
        </div>
        <button 
          style={{ 
            backgroundColor: '#6c757d', 
            color: 'white', 
            padding: '8px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
          onClick={() => setFilters({ name: '', date: '', status: '' })}
        >
          Limpiar Filtros
        </button>
      </div>
      
      {/* Tabla de transacciones */}
      <div style={{ marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#FF7F32', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Fecha</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Valor</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{transaction.name}</td>
                  <td style={{ padding: '12px' }}>{transaction.date}</td>
                  <td style={{ padding: '12px' }}>${transaction.amount.toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      backgroundColor: transaction.status === 'PAID' ? '#28a745' : '#ffc107',
                      color: transaction.status === 'PAID' ? 'white' : 'black',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {transaction.status === 'PAID' ? 'Pagado' : 'Pendiente'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {transaction.status !== 'PAID' && (
                      <>
                        <button 
                          style={{ 
                            backgroundColor: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            padding: '5px 10px', 
                            borderRadius: '4px',
                            marginRight: '5px'
                          }}
                          onClick={() => startEditTransaction(transaction)}
                        >
                          Editar
                        </button>
                        <button 
                          style={{ 
                            backgroundColor: '#dc3545', 
                            color: 'white', 
                            border: 'none', 
                            padding: '5px 10px', 
                            borderRadius: '4px' 
                          }}
                          onClick={() => deleteTransaction(transaction.id!)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '20px', textAlign: 'center' }}>
                  No hay transacciones que coincidan con los filtros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal para Añadir Transacción */}
      {showAddForm && (
        <div style={modalOverlay}>
          <div style={formStyle}>
            <h2 style={{ color: '#FF7F32', marginTop: 0 }}>Nueva Transacción</h2>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nombre</label>
              <input 
                type="text"
                value={newTransaction.name}
                onChange={(e) => setNewTransaction({...newTransaction, name: e.target.value})}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Fecha</label>
              <input 
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Valor</label>
              <input 
                type="number"
                value={newTransaction.amount || ''}
                onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                style={inputStyle}
                step="0.01"
                min="0.01"
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                style={{ 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  padding: '8px 15px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
                onClick={() => setShowAddForm(false)}
              >
                Cancelar
              </button>
              <button 
                style={{ 
                  backgroundColor: '#FF7F32', 
                  color: 'white', 
                  padding: '8px 15px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={addTransaction}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para Editar Transacción */}
      {showEditForm && (
        <div style={modalOverlay}>
          <div style={formStyle}>
            <h2 style={{ color: '#FF7F32', marginTop: 0 }}>Editar Transacción</h2>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nombre</label>
              <input 
                type="text"
                value={newTransaction.name}
                onChange={(e) => setNewTransaction({...newTransaction, name: e.target.value})}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Fecha</label>
              <input 
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Valor</label>
              <input 
                type="number"
                value={newTransaction.amount || ''}
                onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                style={inputStyle}
                step="0.01"
                min="0.01"
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                style={{ 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  padding: '8px 15px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
                onClick={() => setShowEditForm(false)}
              >
                Cancelar
              </button>
              <button 
                style={{ 
                  backgroundColor: '#FF7F32', 
                  color: 'white', 
                  padding: '8px 15px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={updateTransaction}
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para Procesar Pago */}
      {showPaymentForm && (
        <div style={modalOverlay}>
          <div style={formStyle}>
            <h2 style={{ color: '#FF7F32', marginTop: 0 }}>Procesar Pago</h2>
            <p style={{ color: '#6c757d' }}>
              Total pendiente: <strong>${pendingTotal.toFixed(2)}</strong>
            </p>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Monto a pagar</label>
              <input 
                type="number"
                value={paymentAmount || ''}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                style={inputStyle}
                step="0.01"
                min="0.01"
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                style={{ 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  padding: '8px 15px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
                onClick={() => setShowPaymentForm(false)}
              >
                Cancelar
              </button>
              <button 
                style={{ 
                  backgroundColor: '#FF7F32', 
                  color: 'white', 
                  padding: '8px 15px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: paymentAmount <= 0 ? 0.5 : 1
                }}
                onClick={processPayment}
                disabled={paymentAmount <= 0}
              >
                Pagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

root.render(
  <React.StrictMode>
    <FullApp />
  </React.StrictMode>
); 