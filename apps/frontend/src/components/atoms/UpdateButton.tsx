import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface UpdateButtonProps extends ButtonProps {
  loading?: boolean;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({
  loading = false,
  children,
  disabled,
  ...props
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
      {...props}
    >
      {children}
    </Button>
  );
};

export default UpdateButton;
