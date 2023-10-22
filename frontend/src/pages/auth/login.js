import { useCallback, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie'
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { Layout as AuthLayout } from '../../layouts/auth/layout';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [method, setMethod] = useState('Address');
  const formik = useFormik({
    initialValues: {
      Address: '150 Western Ave, Boston, MA',
      Area: '5000',
      submit: null
    },
    validationSchema: Yup.object({
      Address: Yup
        .string()
        .max(255)
        .required('Address is required'),
      Area: Yup
        .string()
        .max(255)
        .required('Area is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signIn(values.Address, values.Area);
        Cookies.set('Address', values.Address);
        Cookies.set('Area', values.Area);
        router.push('/');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleMethodChange = useCallback(
    (event, value) => {
      setMethod(value);
    },
    []
  );

  const handleSkip = useCallback(
    () => {
      auth.skip();
      router.push('/');
    },
    [auth, router]
  );

  return (
    <>
      <Head>
        <title>
          SolarUpWith.us
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Lot Estimator
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Enter your parking lot information below
                
              </Typography>
            </Stack>
            <Tabs
              onChange={handleSkip}
              sx={{ mb: 3 }}
              value={method}
            >
              <Tab
                label="Lot Information"
                value="Address"
              />
         
            </Tabs>
            {method === 'Address' && (
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.Address && formik.errors.Address)}
                    fullWidth
                    helperText={formik.touched.Address && formik.errors.Address}
                    label="Address"
                    name="Address"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="Address"
                    value={formik.values.Address}
                  />
                  <TextField
                    error={!!(formik.touched.Area && formik.errors.Area)}
                    fullWidth
                    helperText={formik.touched.Area && formik.errors.Area}
                    label="Area in sf"
                    name="Area"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="Area"
                    value={formik.values.Area}
                  />
                </Stack>
                {/* <FormHelperText sx={{ mt: 1 }}> */}
                  {/* Optionally you can skip. */}
                {/* </FormHelperText> */}
                {formik.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Continue
                </Button>
                <Alert
                  color="primary"
                  severity="info"
                  sx={{ mt: 3 }}
                >
                  <div>
                    You can use <b>150 Western Ave, Boston, MA</b> and an area of <b>5000</b> sqft
                  </div>
                </Alert>
              </form>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
