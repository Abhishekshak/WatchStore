import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, Typography, Grid, Paper, IconButton,
  Snackbar, Alert, Divider, Card, CardContent, FormControlLabel, Checkbox
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';

// Helper to convert specification keys from spaces to camelCase if needed
const convertSpecsToCamelCase = (specs) => {
  if (!specs) return {
    movement: '',
    caseMaterial: '',
    waterResistance: '',
    strap: '',
  };

  return {
    movement: specs['Movement'] || specs.movement || '',
    caseMaterial: specs['Case Material'] || specs.caseMaterial || '',
    waterResistance: specs['Water Resistance'] || specs.waterResistance || '',
    strap: specs['Strap'] || specs.strap || '',
  };
};

// Validation schema with camelCase keys
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  brand: Yup.string().required('Brand is required'),
  price: Yup.number()
    .typeError('Must be a number')
    .required('Price is required')
    .min(0),
  discountedPrice: Yup.number()
    .typeError('Must be a number')
    .min(0)
    .test(
      'discountedPrice-check',
      'Discounted price cannot be greater than price',
      function (value) {
        const { price } = this.parent;
        if (value === undefined || value === '') return true; // allow empty
        return Number(value) <= Number(price);
      }
    ),
  description: Yup.string().required('Description is required'),
  features: Yup.array().of(Yup.string().required('Feature cannot be empty')).min(1),
  specifications: Yup.object().shape({
    movement: Yup.string().required('Required'),
    caseMaterial: Yup.string().required('Required'),
    waterResistance: Yup.string().required('Required'),
    strap: Yup.string().required('Required')
  }),
  images: Yup.array().max(4, 'Maximum 4 images allowed'),
  gender: Yup.string().required('Gender is required'),
  displayInHome: Yup.boolean(),
});

function EditWatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImagePaths, setExistingImagePaths] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch existing watch data
  useEffect(() => {
    axios.get(`http://localhost:3001/api/watches/${id}`)
      .then(({ data }) => {
        setInitialValues({
          name: data.name,
          brand: data.brand,
          price: data.price,
          discountedPrice: data.discountedPrice || '',
          description: data.description,
          features: data.features.length ? data.features : [''],
          specifications: convertSpecsToCamelCase(data.specifications),
          images: [],
          gender: data.gender || 'Unisex',
          displayInHome: data.displayInHome || false,
        });
        setExistingImagePaths(data.images || []);
      })
      .catch(() => setSnackbar({ open: true, message: 'Failed to load watch.', severity: 'error' }));
  }, [id]);

  // Clean up preview blobs
  useEffect(() => () => previewImages.forEach(URL.revokeObjectURL), [previewImages]);

  if (!initialValues) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, mt: -5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Edit Watch</Typography>
        </Box>
        <Divider />

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const formData = new FormData();

              for (const [key, val] of Object.entries(values)) {
                if (key === 'images') {
                  if (val && val.length > 0) {
                    val.forEach(img => formData.append('images', img));
                  }
                } else if (typeof val === 'object' && val !== null && key !== 'displayInHome') {
                  formData.append(key, JSON.stringify(val));
                } else if (typeof val === 'boolean') {
                  formData.append(key, val.toString());
                } else {
                  formData.append(key, val);
                }
              }

              await axios.put(`http://localhost:3001/api/watches/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });

              setSnackbar({ open: true, message: 'Watch updated!', severity: 'success' });
              setPreviewImages([]);  // clear preview after success
              setTimeout(() => navigate('/admin/watches'), 1500);
            } catch (error) {
              console.error('Update error:', error);
              setSnackbar({ open: true, message: 'Update failed.', severity: 'error' });
            }
          }}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form encType="multipart/form-data">

              {/* Basic Info */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" fontWeight={600}>Basic Information</Typography>
                  <Grid container spacing={3}>
                    {['name', 'brand', 'price', 'discountedPrice'].map((field) => (
                      <Grid item xs={12} md={6} key={field}>
                        <TextField
                          fullWidth
                          name={field}
                          label={field === 'name' ? 'Watch Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                          type={field.includes('price') ? 'number' : 'text'}
                          value={values[field]}
                          onChange={handleChange}
                          error={Boolean(touched[field] && errors[field])}
                          helperText={touched[field] && errors[field]}
                          inputProps={field.includes('price') ? { min: 0, step: 0.01 } : {}}
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
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Features */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" fontWeight={600}>Features</Typography>
                  <FieldArray name="features">
                    {({ push, remove }) => (
                      <>
                        {values.features.map((f, i) => (
                          <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                            <TextField
                              fullWidth
                              name={`features.${i}`}
                              value={f}
                              onChange={handleChange}
                              error={Boolean(errors.features?.[i] && touched.features?.[i])}
                              helperText={errors.features?.[i] && touched.features?.[i]}
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

              {/* Specifications with camelCase keys */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" fontWeight={600}>Specifications</Typography>
                  <Grid container spacing={3}>
                    {['movement', 'caseMaterial', 'waterResistance', 'strap'].map((key) => (
                      <Grid item xs={12} md={6} key={key}>
                        <TextField
                          fullWidth
                          label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
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
                  <Typography variant="h6" color="primary" fontWeight={600}>Additional Details</Typography>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <TextField
                        select fullWidth label="Gender"
                        name="gender" value={values.gender} onChange={handleChange}
                        SelectProps={{ native: true }}
                        error={Boolean(touched.gender && errors.gender)}
                        helperText={touched.gender && errors.gender}
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
                  <Typography variant="h6" color="primary" fontWeight={600}>Product Images</Typography>
                  <Button component="label" variant="outlined" startIcon={<PhotoCameraIcon />} sx={{ mb: 2 }}>
                    Upload New Images (optional)
                    <input
                      type="file" hidden multiple accept="image/*"
                      onChange={e => {
                        const files = Array.from(e.target.files).slice(0, 4);
                        setFieldValue('images', files);
                        setPreviewImages(files.map(f => URL.createObjectURL(f)));
                      }}
                    />
                  </Button>
                  <Grid container spacing={2}>
                    {(previewImages.length ? previewImages : existingImagePaths).map((src, i) => (
                      <Grid item xs={6} sm={4} md={3} key={i}>
                        <Paper sx={{ p: 1 }}>
                          <Box
                            component="img"
                            src={previewImages.length ? src : `http://localhost:3001/${src}`}
                            sx={{ width: '100%', height: 120, objectFit: 'cover' }}
                            alt={`Watch image ${i + 1}`}
                          />
                          <Typography variant="caption">Image {i + 1}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              <Box sx={{ textAlign: 'center', pt: 2 }}>
                <Button type="submit" variant="contained" size="large">Update Watch</Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EditWatch;
