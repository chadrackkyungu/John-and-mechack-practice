import Head from "next/head";
import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import NextLink from "next/link";
import { dangerMessage, warningMessage } from "./../../components/toast";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";

const Page = () => {
  const [loadBtn, setLoadBtn] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoadBtn(true);

      var requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        redirect: "follow",
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/forgotPassword`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("result", result);
          if (result.status === "success") {
            setLoadBtn(false);
            resetForm();
            openSuccessModal();
          }

          if (result.status === "fail") {
            warningMessage(result.message);
            setLoadBtn(false);
          }
          if (result.status === "error") {
            dangerMessage(result.data);
            setLoadBtn(false);
          }
        })
        .catch((error) => {
          setLoadBtn(false);
          dangerMessage(error);
        });
    },
  });

  const openSuccessModal = () => {
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <Box
        sx={{
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h5">Forgot password</Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
              </Stack>

              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                onClick={formik.handleSubmit}
                disabled={loadBtn}
              >
                {loadBtn ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm mx-3"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </>
                ) : (
                  <>Submit</>
                )}
              </Button>
            </form>
          </div>
        </Box>
      </Box>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onClose={closeSuccessModal}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Password reset link has been sent to your email. Please check your inbox.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSuccessModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
