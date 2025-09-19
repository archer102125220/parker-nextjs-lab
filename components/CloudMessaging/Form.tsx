'use client';
import type { ReactNode } from 'react';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function CloudMessagingForm(): ReactNode {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <TextField label="推播標題" fullWidth />
      </Grid>
      <Grid size={12}>
        <TextField label="推播訊息" fullWidth />
      </Grid>
      <Grid size={12}>
        <TextField label="推播圖片網址" fullWidth />
      </Grid>
      <Grid
        container
        spacing={2}
        size={12}
        sx={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <Button variant="outlined" color="primary" fullWidth>
            重置
          </Button>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Button variant="contained" color="primary" fullWidth>
            送出
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CloudMessagingForm;
