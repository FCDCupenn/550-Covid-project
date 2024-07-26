import styles from './LoginPage.module.css';
import { Typography, TextField, Button, Grid, Link } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [account, setAccount] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAccount = (field, event) => {
    setAccount({ ...account, [field]: event.target.value });
    setError(''); // clear error when input changes
  };

  const handleLogin = async () => {
    try {
      // 1. form validation
      if (!account.username) {
        setError('Username cannot be empty');
        return;
      }
      if (!account.password) {
        setError('Password cannot be empty');
        return;
      }

      // 2. send login request
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account),
      });

      if (response.ok) {
        const data = await response.json();
        // Save the user information in localStorage or a cookie
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect the user to the dashboard or home page
        navigate('/');
        toast.success('Welcome, you are now logged in.');
      } else {
        const error = await response.json();
        setError(error.error);
      }
    } catch (error) {
      setError('An error occurred while logging in. Please try again later.');
    }
  };

  return (
    <div className={styles.container}>
      <Typography component="h1" variant="h5">
        Log in
      </Typography>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <form className={styles.form} noValidate>
        <TextField
          onChange={(event) => handleAccount('username', event)}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoFocus
        />
        <TextField
          onChange={(event) => handleAccount('password', event)}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleLogin}
        >
          Log In
        </Button>
        <Grid container>
          <Grid item>
            <Link href="/sign-up" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default LoginPage;
