import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#FF7F32" }}>
        <Toolbar>
          <Typography variant="h6">Sistema de Transacciones</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>{children}</Box>
      </Container>
    </>
  );
}; 