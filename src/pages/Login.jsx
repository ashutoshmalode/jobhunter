import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { setUser } from "../features/auth/authSlice";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      dispatch(
        setUser({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        }),
      );
      navigate("/");
    } catch (err) {
      const msg =
        {
          "auth/invalid-credential": "Invalid email or password.",
          "auth/user-not-found": "No account found with this email.",
          "auth/wrong-password": "Incorrect password.",
          "auth/too-many-requests":
            "Too many attempts. Please try again later.",
        }[err.code] || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(
        setUser({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        }),
      );
      navigate("/");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      fontFamily: "Inter, sans-serif",
      fontSize: 14,
      "&:hover fieldset": { borderColor: "#7C3AED" },
      "&.Mui-focused fieldset": { borderColor: "#7C3AED" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#7C3AED" },
  };

  return (
    <AuthLayout
      title="Welcome back 👋"
      subtitle="Sign in to your JobHunter account"
    >
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: "10px", fontFamily: "Inter" }}
        >
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        <TextField
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={inputSx}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={inputSx}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
          <Typography
            sx={{
              fontSize: 13,
              color: "#7C3AED",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Forgot password?
          </Typography>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 15,
            textTransform: "none",
            borderRadius: "10px",
            py: 1.5,
            boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #6D28D9, #5B21B6)",
            },
            "&:disabled": { background: "#C4B5FD" },
          }}
        >
          {loading ? (
            <CircularProgress size={22} sx={{ color: "white" }} />
          ) : (
            "Sign In"
          )}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography
          sx={{
            fontSize: 12,
            color: "#9CA3AF",
            fontFamily: "Inter, sans-serif",
            px: 1,
          }}
        >
          or continue with
        </Typography>
      </Divider>

      {/* Google button */}
      <Button
        onClick={handleGoogle}
        fullWidth
        disabled={googleLoading}
        variant="outlined"
        sx={{
          borderColor: "#E5E7EB",
          color: "#374151",
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: 14,
          textTransform: "none",
          borderRadius: "10px",
          py: 1.4,
          gap: 1.5,
          "&:hover": { borderColor: "#7C3AED", background: "#F5F3FF" },
        }}
      >
        {googleLoading ? (
          <CircularProgress size={20} sx={{ color: "#7C3AED" }} />
        ) : (
          <>
            <Box
              component="img"
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              sx={{ width: 20, height: 20 }}
            />
            Continue with Google
          </>
        )}
      </Button>

      <Typography
        sx={{
          textAlign: "center",
          mt: 3,
          fontSize: 14,
          color: "#6B7280",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Don't have an account?{" "}
        <Link
          to="/signup"
          style={{ color: "#7C3AED", fontWeight: 700, textDecoration: "none" }}
        >
          Sign up →
        </Link>
      </Typography>
    </AuthLayout>
  );
}
