import { useCallback, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { dangerMessage, successMessage, warningMessage } from "./../../components/toast";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useAuthContext } from "src/contexts/auth-context";

const Page = () => {
  const { signIn } = useAuthContext();
  const [loadBtn, setLoadBtn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const router = useRouter();
  const [method, setMethod] = useState("email");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      setLoadBtn(true);

      var requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        redirect: "follow",
      };

      // Fetch call to submit data
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "success") {
            signIn(result.data);
            setLoadBtn(false);
            resetForm();
            successMessage("Successfully logged in.");
            router.push("/");
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

  const handleMethodChange = useCallback((event, value) => {
    setMethod(value);
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard practice</title>
      </Head>

      <Box
        sx={{
          backgroundColor: "background.paper",
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
              <Typography variant="h4">Login</Typography>
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            </Stack>
            <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
              <Tab label="Email" value="email" />
              <Tab label="Phone Number" value="phoneNumber" />
            </Tabs>

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
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.secondary"
                variant="body2"
              >
                <Typography sx={{ marginRight: 1 }}>Forgotten password</Typography>
                <Link
                  component={NextLink}
                  href="/auth/forgotpassword"
                  underline="hover"
                  variant="subtitle2"
                >
                  Reset it
                </Link>
              </Typography>

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
                  <>Login</>
                )}
              </Button>
            </form>

            {method === "phoneNumber" && (
              <div>
                <Typography sx={{ mb: 1 }} variant="h6">
                  Not available in the demo
                </Typography>
                <Typography color="text.secondary">
                  To prevent unnecessary costs we disabled this feature in the demo.
                </Typography>
              </div>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
