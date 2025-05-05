import { withBasePath } from '@/app/lib/imageSrc';
import { Box, AppBar, Toolbar, Typography, Container, alpha } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';

const theme = createTheme({
   palette: {
      primary: {
         main: '#5e35b1',
      },
      secondary: {
         main: "#fff",
      },
      background: {
         default: "#f7f7fc",
      },
   },
   typography: {
      fontFamily: 'Kanit',
   },
   components: {
      MuiAppBar: {
         styleOverrides: {
            root: {
               boxShadow: `0 4px 20px ${alpha('#5e35b1', 0.15)}`,
            },
         },
      },
      MuiDrawer: {
         styleOverrides: {
            paper: {
               width: 250,
            },
         },
      },
      MuiButton: {
         styleOverrides: {
            root: {
               borderRadius: 12,
               textTransform: 'none',
            },
            contained: {
               boxShadow: `0 8px 20px ${alpha('#5e35b1', 0.3)}`,
               '&:hover': {
                  boxShadow: `0 12px 28px ${alpha('#5e35b1', 0.4)}`,
               },
            },
         },
      },
   },
});

export default function MainLayout({ children }: { children: React.ReactNode }) {
   return (
      <ThemeProvider theme={theme}>
         <Box sx={{
            flexGrow: 1,
            minHeight: '100vh',
            backgroundColor: 'background.default',
            position: 'relative',
            overflow: 'hidden',
         }}>
            <Box
               sx={{
                  position: "absolute",
                  top: -150,
                  right: -150,
                  width: 400,
                  height: 400,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${alpha('#5e35b1', 0.04)}, transparent 70%)`,
                  zIndex: 0,
               }}
            />
            <Box
               sx={{
                  position: "absolute",
                  bottom: -100,
                  left: -100,
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${alpha('#1976d2', 0.04)}, transparent 70%)`,
                  zIndex: 0,
               }}
            />

            <AppBar
               position="static"
               color="secondary"
               sx={{
                  py: 1.5,
                  boxShadow: `0 4px 20px ${alpha('#5e35b1', 0.15)}`,
                  borderBottom: '1px solid',
                  borderColor: alpha('#5e35b1', 0.08),
                  position: 'relative',
                  zIndex: 2,
               }}
            >
               <Toolbar>
                  <Box
                     sx={{
                        display: 'flex',
                        alignItems: 'center',
                        ml: 2,
                        pl: 1,
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                           transform: 'scale(1.02)',
                        }
                     }}
                  >
                     <Image
                        width={80}
                        height={60}
                        src={withBasePath('/logo-does.webp')}
                        alt="Logo"
                        style={{
                           filter: 'drop-shadow(0 4px 6px rgba(94, 53, 177, 0.2))'
                        }}
                     />
                  </Box>
                  <Box sx={{ ml: 3 }}>
                     <Typography
                        variant="h6"
                        sx={{
                           flexGrow: 1,
                           textAlign: { xs: 'center', sm: 'left' },
                           fontWeight: 700,
                           background: "#5e35b1",
                           backgroundClip: "text",
                           WebkitBackgroundClip: "text",
                           WebkitTextFillColor: "transparent",
                           letterSpacing: '-0.5px'
                        }}
                     >
                        กองบริการการศึกษา
                     </Typography>
                     <Typography
                        variant="caption"
                        sx={{
                           color: alpha("#000", 0.6),
                           fontWeight: 400,
                        }}
                     >
                        มหาวิทยาลัยพะเยา | University of Phayao
                     </Typography>
                  </Box>
               </Toolbar>
            </AppBar>

            <Container
               maxWidth="lg"
               sx={{
                  mt: 4,
                  mb: 4,
                  position: 'relative',
                  zIndex: 1,
               }}
            >
               {children}
            </Container>
         </Box>
      </ThemeProvider>
   );
}