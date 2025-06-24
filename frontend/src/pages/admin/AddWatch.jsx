import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Grid, Paper, IconButton,
  Snackbar, Alert, Divider, Card, CardContent, FormControlLabel, Checkbox
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';

// Validation schema with discountedPrice <= price check and displayInHome boolean
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  brand: Yup.string().required('Brand is required'),
  price: Yup.number()
    .typeError('Must be a number')
    .required('Price is required')
    .min(0, 'Price cannot be negative'),
  discountedPrice: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Discounted price cannot be negative')
    .max(Yup.ref('price'), 'Discounted price cannot be greater than price')
    .notRequired(),
  description: Yup.string().required('Description is required'),
  features: Yup.array()
    .of(Yup.string().required('Feature cannot be empty'))
    .min(1, 'At least one feature is required'),
  specifications: Yup.object().shape({
    Movement: Yup.string().required('Required'),
    Case_Material: Yup.string().required('Required'),
    Water_Resistance: Yup.string().required('Required'),
    Strap: Yup.string().required('Required'),
  }),
  images: Yup.array().max(4, 'Maximum 4 images allowed'),
  gender: Yup.string().required('Gender is required'),
  displayInHome: Yup.boolean(),
});

function AddWatch() {
  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Cleanup preview URLs on unmount or update
  useEffect(() => () => previewImages.forEach(url => URL.revokeObjectURL(url)), [previewImages]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, mt: -5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
              Back
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>Add New Watch</Typography>
          </Box>
          <Divider />
        </Box>

        <Formik
          initialValues={{
            name: '',
            brand: '',
            price: '',
            discountedPrice: '',
            description: '',
            features: [''],
            specifications: { Movement: '', Case_Material: '', Water_Resistance: '', Strap: '' },
            images: [],
            gender: 'Unisex',
            displayInHome: false,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              // DEBUG: check specs object before send
              console.log('Submitting specifications:', values.specifications);

              const data = new FormData();
              Object.entries(values).forEach(([key, val]) => {
                if (key === 'images') {
                  val.forEach(img => data.append('images', img));
                } else if (typeof val === 'object' && key !== 'displayInHome') {
                  data.append(key, JSON.stringify(val));
                } else {
                  data.append(key, val);
                }
              });
              await axios.post('http://localhost:3001/api/watches', data);
              setSnackbar({ open: true, message: 'Watch added successfully!', severity: 'success' });
              setTimeout(() => navigate('/admin/watches'), 1500);
            } catch (error) {
              console.error(error);
              setSnackbar({ open: true, message: 'Error adding watch.', severity: 'error' });
            }
          }}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form encType="multipart/form-data">

              {/* Basic Info */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" fontWeight={600} gutterBottom>Basic Information</Typography>
                  <Grid container spacing={3}>
                    {[ 
                      ['name', 'Watch Name'],
                      ['brand', 'Brand'],
                      ['price', 'Original Price', 'number'],
                      ['discountedPrice', 'Discounted Price', 'number'],
                    ].map(([name, label, type = 'text']) => (
                      <Grid item xs={12} md={6} key={name}>
                        <TextField
                          fullWidth
                          name={name}
                          label={label}
                          type={type}
                          value={values[name]}
                          onChange={handleChange}
                          error={Boolean(touched[name] && errors[name])}
                          helperText={touched[name] && errors[name]}
                          variant="outlined"
                          inputProps={type === 'number' ? { min: 0, step: 0.01 } : {}}
                        />
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth multiline rows={4}
                        name="description"
                        label="Description"
                        value={values.description}
                        onChange={handleChange}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                        required
                        placeholder="Detailed description..."
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Features */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" fontWeight={600} gutterBottom>Features</Typography>
                  <FieldArray name="features">
                    {({ push, remove }) => (
                      <>
                        {values.features.map((f, i) => (
                          <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                              fullWidth
                              name={`features.${i}`}
                              value={f}
                              onChange={handleChange}
                              placeholder={`Feature ${i + 1}`}
                              error={Boolean(errors.features?.[i] && touched.features?.[i])}
                              helperText={touched.features?.[i] && errors.features?.[i]}
                            />
                            <IconButton color="error" onClick={() => remove(i)} disabled={values.features.length === 1}>
                              <RemoveIcon />
                            </IconButton>
                          </Box>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => push('')}>Add Feature</Button>
                      </>
                    )}
                  </FieldArray>
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" fontWeight={600} gutterBottom>Specifications</Typography>
                  <Grid container spacing={3}>
                    {Object.entries(values.specifications).map(([key]) => (
                      <Grid item xs={12} md={6} key={key}>
                        <TextField
                          fullWidth
                          label={key.replace(/_/g, ' ')}
                          name={`specifications.${key}`}
                          value={values.specifications[key]}
                          onChange={handleChange}
                          error={Boolean(touched.specifications?.[key] && errors.specifications?.[key])}
                          helperText={touched.specifications?.[key] && errors.specifications?.[key]}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Additional Details */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" fontWeight={600} gutterBottom>Additional Details</Typography>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <TextField
                        select
                        fullWidth
                        label="Gender"
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                        error={Boolean(touched.gender && errors.gender)}
                        helperText={touched.gender && errors.gender}
                        SelectProps={{ native: true }}
                      >
                        <option value="Unisex">Unisex</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.displayInHome}
                            onChange={e => setFieldValue('displayInHome', e.target.checked)}
                          />
                        }
                        label="Display in Home"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Images */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" fontWeight={600} gutterBottom>Product Images</Typography>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<PhotoCameraIcon />}
                    sx={{ mb: 2 }}
                  >
                    Upload Images (Max 4)
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files).slice(0, 4);
                        setFieldValue('images', files);
                        setPreviewImages(files.map(f => URL.createObjectURL(f)));
                      }}
                    />
                  </Button>
                  {touched.images && errors.images && (
                    <Typography color="error" variant="body2">{errors.images}</Typography>
                  )}
                  {previewImages.length > 0 && (
                    <Grid container spacing={2}>
                      {previewImages.map((src, i) => (
                        <Grid item xs={6} sm={4} md={3} key={i}>
                          <Paper sx={{ p: 1 }}>
                            <Box
                              component="img"
                              src={src}
                              sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1 }}
                            />
                            <Typography variant="caption">Image {i + 1}</Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Box sx={{ textAlign: 'center', pt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ minWidth: 200, py: 1.5, fontWeight: 600 }}
                >
                  Add Watch
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AddWatch;
