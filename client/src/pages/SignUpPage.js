import styles from './LoginPage.module.css';
import { Typography, TextField, Button, Grid, Link } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [account, setAccount] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleAccountChange = (field, event) => {
    setAccount({ ...account, [field]: event.target.value });
    setErrors({ ...errors, [field]: '' }); // clear error information when input
  };

  const handleSignUp = () => {
    // 1. form validation
    let hasError = false;
    if (!account.username) {
      setErrors((prev) => ({ ...prev, username: 'Username cannot be empty' }));
      hasError = true;
    }
    if (!account.password) {
      setErrors((prev) => ({ ...prev, password: 'Password cannot be empty' }));
      hasError = true;
    }
    if (hasError) return;

    // 2. send registration request
    fetch('http://localhost:8080/signUp', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrors((prev) => ({ ...prev, username: data.error }));
        } else {
          toast.success('Registration Successful');
          navigate('/login');
        }
      })
      .catch((err) => {
        console.error('Registration failed:', err);
        setErrors((prev) => ({
          ...prev,
          username: 'Registration failed, please try again later',
        }));
      });
  };

  return (
    <div className={styles.container}>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>

      <form noValidate>
        <TextField
          onChange={(event) => handleAccountChange('username', event)}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          error={!!errors.username}
          helperText={errors.username}
          autoFocus
        />
        <TextField
          onChange={(event) => handleAccountChange('password', event)}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          error={!!errors.password}
          helperText={errors.password}
          autoComplete="current-password"
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSignUp}
        >
          Sign up
        </Button>
        <Grid container>
          <Grid item>
            <Link href="/login" variant="body2">
              {'Already have an account? Log In'}
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default SignUpPage;
