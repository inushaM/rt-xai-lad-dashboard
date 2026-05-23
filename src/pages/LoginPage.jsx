import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { dashboardApi } from "../api/dashboardApi";
import { authStorage } from "../utils/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await dashboardApi.login({ username, password });
      const token = response.data?.data?.token;
      if (!token) {
        throw new Error("Login token missing in response");
      }
      authStorage.setToken(token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        px: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "-0.5px",
                    background:
                      "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  EarlyAlert
                </Typography>
                <Box
                  component="span"
                  sx={{
                    fontSize: "3.5rem",
                    lineHeight: 1,
                    mt: 0.5,
                    ml: 0.5,
                  }}
                >
                  🎓
                </Box>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                AI-powered student risk intelligence platform
              </Typography>
              <Chip
                label="RT-XAI-LAD"
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.65rem",
                  height: 20,
                  letterSpacing: "0.08em",
                  fontFamily: "monospace",
                  opacity: 0.55,
                  borderStyle: "dashed",
                }}
              />
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
