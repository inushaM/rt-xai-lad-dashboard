import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { authStorage } from '../../utils/auth'

const Topbar = ({ drawerWidth, onMenuClick }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    authStorage.clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          RT-XAI-LAD Dashboard
        </Typography>
        <Button
          color="inherit"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{ ml: 'auto' }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar
