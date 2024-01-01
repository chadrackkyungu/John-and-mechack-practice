import Head from "next/head";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { dangerMessage, successMessage, warningMessage } from "./../../components/toast";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const Page = () => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleTogglePasswordVisibility1 = () => {
    setShowPassword1((prevShowPassword) => !prevShowPassword);
  };
  const [loadBtn, setLoadBtn] = useState(false);

  const handleTogglePasswordVisibility2 = () => {
    setShowPassword2((prevShowPassword) => !prevShowPassword);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmpassword: "",
    },

    validationSchema: Yup.object({
      password: Yup.string()
        .password("Must be a valid email")
        .max(255)
        .required("Password is required"),
      confirmpassword: Yup.string()
        .confirmpassword("Must be a valid email")
        .max(255)
        .required("Confirm Password is required"),
    }),

    // API
    onSubmit: async (values, { resetForm }) => {
      setLoadBtn(true);

      var requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        redirect: "follow",
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/registerAdmin`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("result", result);
          if (result.status === "success") {
            setLoadBtn(false);
            resetForm();
            // successMessage(result.data.message);
            successMessage("Reset Password Successfully.");
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
              <Typography variant="h4">Reset password</Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack container spacing={3}>
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type={showPassword1 ? "text" : "password"}
                  value={formik.values.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility1}
                          edge="end"
                        >
                          {showPassword1 ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  error={!!(formik.touched.passwordConfirm && formik.errors.passwordConfirm)}
                  fullWidth
                  helperText={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
                  label="Confirm Password"
                  name="confirmpassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type={showPassword2 ? "text" : "password"}
                  value={formik.values.passwordConfirm}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility2}
                          edge="end"
                        >
                          {showPassword2 ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
