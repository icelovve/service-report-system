"use client";

import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import {
   FormControl,
   Select,
   MenuItem,
   Button,
   Stack,
   Typography,
   Paper,
   Container,
   Box,
   CircularProgress,
   Fade,
   Grid,
   Chip,
   alpha,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import { SelectChangeEvent } from "@mui/material";
import AddFile from "./../components/share/AddFile";
import Swal from 'sweetalert2';
import { getUrlWithBase } from "./lib/getUrlWithBase";

export default function Home() {
   const [budgetYear, setBudgetYear] = useState<string>(
      String(new Date().getFullYear() + 543)
   );
   const [loading, setLoading] = useState<boolean>(false);
   const [isFiltering, setIsFiltering] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const startYear = String(Number(budgetYear) - 1);
   const startMonth = "10";
   const endYear = budgetYear;
   const endMonth = "09";

   const handleBudgetYearChange = (event: SelectChangeEvent<string>) => {
      setBudgetYear(event.target.value);
   };

   const handleDownload = async () => {
      setIsFiltering(true);
      setError(null);
      try {
         const gregorianEndYear = Number(budgetYear) - 543;
         const startDate = `${gregorianEndYear - 1}-${startMonth}`;
         const endDate = `${gregorianEndYear}-${endMonth}`;
         setLoading(false);
         window.open(getUrlWithBase(`/reports?startYear=${startDate}&endYear=${endDate}`));
      } catch (error) {
         console.error("Error:", error);
         setError("เกิดข้อผิดพลาดในการค้นหารายงาน");
         Swal.fire({
            icon: "error",
            text: "เกิดข้อผิดพลาดในการค้นหารายงาน",
            showConfirmButton: false,
            timer: 1500
         })
         return
      } finally {
         setIsFiltering(false);
      }
   };

   const currentYear = new Date().getFullYear() + 543;
   const years = Array.from(
      { length: currentYear - 2556 + 1 },
      (_, i) => currentYear - i
   );

   const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
   ];

   const formatMonthYear = (month: string, year: string) => {
      const monthIndex = parseInt(month, 10) - 1;
      return `${thaiMonths[monthIndex]} ${year}`;
   };

   return (
      <MainLayout>
         <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper
               elevation={3}
               sx={{
                  px: { xs: 3, md: 5 },
                  py: 6,
                  mb: 4,
                  borderRadius: 4,
                  position: "relative",
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: alpha("#5e35b1", 0.1),
                  boxShadow: `0 10px 40px ${alpha("#5e35b1", 0.08)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                     boxShadow: `0 15px 50px ${alpha("#5e35b1", 0.12)}`,
                     transform: "translateY(-5px)",
                  },
               }}
            >
               <Box
                  sx={{
                     position: "absolute",
                     top: -120,
                     right: -120,
                     width: 300,
                     height: 300,
                     borderRadius: "50%",
                     background: `radial-gradient(circle, ${alpha("#5e35b1", 0.06)}, transparent 70%)`,
                     zIndex: 0,
                  }}
               />
               <Box
                  sx={{
                     position: "absolute",
                     bottom: -100,
                     left: -100,
                     width: 200,
                     height: 200,
                     borderRadius: "50%",
                     background: `radial-gradient(circle, ${alpha("#5e35b1", 0.06)}, transparent 70%)`,
                     zIndex: 0,
                  }}
               />

               <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Box
                     sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 6,
                        pb: 4,
                        borderBottom: `1px solid ${alpha("#5e35b1", 0.1)}`
                     }}
                  >
                     <Box
                        sx={{
                           bgcolor: "primary.main",
                           borderRadius: 3,
                           p: 2,
                           mr: 3,
                           boxShadow: `0 6px 20px ${alpha("#5e35b1", 0.3)}`,
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                           transform: "rotate(-5deg)",
                           transition: "transform 0.3s ease",
                           "&:hover": {
                              transform: "rotate(0deg)",
                           }
                        }}
                     >
                        <CalendarMonthIcon sx={{ color: "white", fontSize: 36 }} />
                     </Box>
                     <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{
                           background: "#5e35b1",
                           backgroundClip: "text",
                           WebkitBackgroundClip: "text",
                           WebkitTextFillColor: "transparent",
                           letterSpacing: "-0.5px",
                        }}
                     >
                        รายงานข้อมูลสถิติการให้บริการ
                     </Typography>
                  </Box>

                  <Fade in={!loading} timeout={1000}>
                     <Box>
                        <Typography
                           variant="subtitle1"
                           color="text.secondary"
                           sx={{
                              mb: 2,
                              fontWeight: 600,
                              pl: 2,
                              borderLeft: `4px solid ${alpha("#5e35b1", 0.5)}`,
                              py: 1
                           }}
                        >
                           กรุณาเลือกปีงบประมาณสำหรับค้นหารายงานสถิติ
                        </Typography>

                        <Box
                           sx={{
                              p: 4,
                              mb: 4
                           }}
                        >
                           <Grid container spacing={4} alignItems="center">
                              <Grid item xs={12}>
                                 <Typography
                                    variant="body1"
                                    fontWeight="600"
                                    sx={{ mb: 2, pl: 1 }}
                                    color="text.secondary"
                                 >
                                    ประจำปีงบประมาณ
                                 </Typography>
                                 <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={3}
                                    sx={{ width: '100%' }}
                                 >
                                    <FormControl
                                       fullWidth
                                       sx={{
                                          maxWidth: { xs: '100%', sm: '60%' },
                                          flexGrow: 1
                                       }}
                                    >
                                       <Select
                                          value={budgetYear}
                                          onChange={handleBudgetYearChange}
                                          displayEmpty
                                          sx={{
                                             borderRadius: 3,
                                             bgcolor: "white",
                                             height: 56,
                                             width: '100%',
                                             "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: alpha("#5e35b1", 0.25),
                                                borderWidth: 2,
                                             },
                                             "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#5e35b1",
                                             },
                                             "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#5e35b1",
                                                borderWidth: 2,
                                             },
                                             boxShadow: `0 4px 12px ${alpha("#000", 0.05)}`,
                                          }}
                                       >
                                          {years.map((year) => (
                                             <MenuItem key={year} value={year}>
                                                {year}
                                             </MenuItem>
                                          ))}
                                       </Select>
                                    </FormControl>

                                    <Button
                                       variant="contained"
                                       onClick={handleDownload}
                                       disabled={isFiltering}
                                       fullWidth
                                       endIcon={
                                          isFiltering ? (
                                             <CircularProgress size={20} color="inherit" />
                                          ) : (
                                             <SearchIcon />
                                          )
                                       }
                                       sx={{
                                          px: 4,
                                          borderRadius: 3,
                                          fontSize: "1rem",
                                          fontWeight: 600,
                                          textTransform: "none",
                                          background: "#5e35b1",
                                          boxShadow: `0 8px 24px ${alpha("#5e35b1", 0.3)}`,
                                          height: 56,
                                          "&:hover": {
                                             background: "#4527a0",
                                             boxShadow: `0 12px 32px ${alpha("#5e35b1", 0.4)}`,
                                             transform: "translateY(-2px)",
                                          },
                                          "&:disabled": {
                                             background: "#5e35b1",
                                             opacity: 0.7,
                                          },
                                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                          flexShrink: 0,
                                          maxWidth: { xs: '100%', sm: '40%' },
                                       }}
                                    >
                                       {isFiltering ? "กำลังค้นหา..." : "ค้นหารายงาน"}
                                    </Button>
                                 </Stack>
                              </Grid>
                           </Grid>
                        </Box>

                        {error && (
                           <Box sx={{
                              mt: 4,
                              p: 3,
                              borderRadius: 3,
                              bgcolor: alpha("#f44336", 0.1),
                              border: `1px solid ${alpha("#f44336", 0.3)}`
                           }}>
                              <Typography color="error" fontWeight={500} align="center">
                                 {error}
                              </Typography>
                           </Box>
                        )}

                        <Box sx={{ mt: 6, textAlign: "center" }}>
                           <Chip
                              icon={<CalendarMonthIcon />}
                              label={`${formatMonthYear(startMonth, startYear)} - ${formatMonthYear(
                                 endMonth,
                                 endYear
                              )}`}
                              variant="outlined"
                              color="primary"
                              sx={{
                                 fontSize: "1rem",
                                 py: 3.5,
                                 px: 2,
                                 fontWeight: 600,
                                 borderColor: alpha("#5e35b1", 0.3),
                                 color: "#5e35b1",
                                 "& .MuiChip-icon": {
                                    color: "#5e35b1",
                                    marginRight: 1,
                                 },
                                 borderRadius: 6,
                                 boxShadow: `0 6px 16px ${alpha("#5e35b1", 0.1)}`,
                                 backgroundColor: alpha("#5e35b1", 0.05),
                                 transition: "all 0.3s ease",
                                 "&:hover": {
                                    boxShadow: `0 8px 24px ${alpha("#5e35b1", 0.15)}`,
                                    borderColor: alpha("#5e35b1", 0.5),
                                    backgroundColor: alpha("#5e35b1", 0.08),
                                 }
                              }}
                           />
                        </Box>
                     </Box>
                  </Fade>
               </Box>
            </Paper>
         </Container>
         <AddFile />
      </MainLayout>
   );
}