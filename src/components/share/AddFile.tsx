'use client';

import { useState, useEffect } from 'react';
import {
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   Typography,
   Button,
   TextField,
   Grid,
   Box,
   Divider,
   Container,
   alpha,
   Tooltip,
   Chip,
   Avatar
} from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Swal from 'sweetalert2';
import { fetchWithBase } from '@/app/lib/fetchWithBase';

interface GroupReport {
   id: number;
   Note: string;
   createdAt: string | null;
}

const AddFile = () => {
   const [file, setFile] = useState<File | null>(null);
   const [note, setNote] = useState('');
   const [loading, setLoading] = useState(false);
   const [groupReport, setGroupReport] = useState<GroupReport[]>([]);

   useEffect(() => {
      fetchGroupReport();
   }, []);

   const fetchGroupReport = async () => {
      try {
         const response = await fetchWithBase('/api/groupReport');
         if (!response.ok) throw new Error('Failed to fetch reports');
         const data = await response.json();
         if (data && data.reports) {
            setGroupReport(data.reports);
         }
      } catch (error) {
         console.error('Error fetching group report:', error);
      }
   };

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
         setFile(selectedFile);
      } else {
         Swal.fire({
            icon: "error",
            text: "กรุณาเลือกไฟล์ Excel (.xlsx) เท่านั้น",
            showConfirmButton: false,
            timer: 1500
         });
         setFile(null);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!file) {
         Swal.fire({
            icon: "error",
            text: "กรุณาเลือกไฟล์",
            showConfirmButton: false,
            timer: 1500
         });
         return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('note', note);

      try {
         const response = await fetchWithBase('/api/moreReport', {
            method: 'POST',
            body: formData,
         });

         if (!response.ok) throw new Error('Upload failed');
         const result = await response.json();

         Swal.fire({
            icon: "success",
            text: "บันทึกข้อมูลสำเร็จ",
            showConfirmButton: false,
            timer: 1500
         }).then(() => {
            fetchGroupReport();
         })

         if (result.ok || response.ok) {
            setFile(null);
            setNote('');
            await fetchGroupReport();
         }
      } catch (error) {
         Swal.fire({
            icon: "error",
            text: "เกิดข้อผิดพลาดในบันทึกข้อมูล",
            showConfirmButton: false,
            timer: 1500
         }).then(() => {
            console.log('error', error)
            setFile(null);
            setNote('');
         })
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id: number) => {
      const result = await Swal.fire({
         text: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่?",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: "#d33",
         cancelButtonColor: "#899499",
         confirmButtonText: "ยืนยัน",
         cancelButtonText: "ยกเลิก"
      });

      if (result.isConfirmed) {
         try {
            const response = await fetchWithBase(`/api/groupReport?id=${id}`, {
               method: 'DELETE',
            });

            if (!response.ok) throw new Error('Delete failed');
            const deleteResult = await response.json();

            if (deleteResult.ok) {
               setGroupReport((prev) => prev.filter((report) => report.id !== id));
               Swal.fire({
                  icon: "success",
                  text: "ลบข้อมูลสำเร็จ",
                  showConfirmButton: false,
                  timer: 1500
               });
            }
         } catch (error) {
            console.log('error', error)
            Swal.fire({
               icon: "error",
               text: "เกิดข้อผิดพลาดในการลบข้อมูล",
               showConfirmButton: false,
               timer: 1500
            });
         }
      }
   };

   const formatDate = (dateString: string | null | undefined) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleString('th-TH', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
      });
   };

   return (
      <Container maxWidth="lg" sx={{ pb: 10 }}>
         <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
               <Paper
                  elevation={3}
                  sx={{
                     px: 4,
                     py: 4,
                     borderRadius: 4,
                     border: '1px solid',
                     borderColor: alpha('#5e35b1', 0.1),
                     height: '100%',
                     boxShadow: `0 10px 40px ${alpha('#5e35b1', 0.08)}`,
                     transition: 'all 0.3s ease',
                     position: 'relative',
                     overflow: 'hidden',
                     '&:hover': {
                        boxShadow: `0 15px 50px ${alpha('#5e35b1', 0.12)}`,
                        transform: 'translateY(-5px)'
                     }
                  }}
               >
                  <Box
                     sx={{
                        position: "absolute",
                        top: -80,
                        left: -80,
                        width: 160,
                        height: 160,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${alpha('#5e35b1', 0.06)}, transparent 70%)`,
                        zIndex: 0,
                     }}
                  />

                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar
                           sx={{
                              mr: 2,
                              bgcolor: alpha('#5e35b1', 0.1),
                              color: '#5e35b1',
                              width: 48,
                              height: 48,
                              boxShadow: `0 4px 10px ${alpha('#5e35b1', 0.15)}`,
                           }}
                        >
                           <PostAddIcon sx={{ fontSize: 26 }} />
                        </Avatar>
                        <Typography
                           variant="h5"
                           fontWeight="700"
                           sx={{
                              background: "#5e35b1",
                              backgroundClip: "text",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                           }}
                        >
                           เพิ่มข้อมูลสถิติใหม่
                        </Typography>
                     </Box>

                     <Divider sx={{ mb: 3, borderColor: alpha('#5e35b1', 0.1) }} />

                     <form onSubmit={handleSubmit}>
                        <TextField
                           fullWidth
                           label="หมายเหตุ"
                           margin="normal"
                           value={note}
                           onChange={(e) => setNote(e.target.value)}
                           sx={{
                              mb: 3,
                              '& .MuiOutlinedInput-root': {
                                 borderRadius: 2,
                                 '& fieldset': {
                                    borderColor: alpha('#5e35b1', 0.2),
                                 },
                                 '&:hover fieldset': {
                                    borderColor: alpha('#5e35b1', 0.3),
                                 },
                                 '&.Mui-focused fieldset': {
                                    borderColor: '#5e35b1',
                                 },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                 color: '#5e35b1',
                              }
                           }}
                        />

                        <Box
                           sx={{
                              p: 3,
                              mb: 3,
                              borderRadius: 2,
                              border: '1px dashed',
                              borderColor: file ? alpha('#5e35b1', 0.4) : alpha('#5e35b1', 0.2),
                              bgcolor: file ? alpha('#5e35b1', 0.03) : 'transparent',
                              transition: 'all 0.2s',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              '&:hover': {
                                 borderColor: alpha('#5e35b1', 0.5),
                                 bgcolor: alpha('#5e35b1', 0.05),
                              }
                           }}
                           component="label"
                        >
                           <input
                              type="file"
                              hidden
                              onChange={handleFileChange}
                              accept=".xlsx"
                           />
                           <CloudUploadIcon sx={{ fontSize: 36, color: alpha('#5e35b1', 0.7), mb: 1 }} />
                           <Typography align="center" fontWeight={500} color={file ? '#5e35b1' : 'text.secondary'}>
                              {file ? file.name : 'คลิกเพื่อเลือกไฟล์ Excel (.xlsx)'}
                           </Typography>
                        </Box>

                        <Button
                           type="submit"
                           variant="contained"
                           color="primary"
                           disabled={loading || !file}
                           fullWidth
                           sx={{
                              py: 1.5,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '1rem',
                              background: "#5e35b1",
                              boxShadow: `0 4px 14px ${alpha('#5e35b1', 0.25)}`,
                              '&:hover': {
                                 boxShadow: `0 6px 20px ${alpha('#5e35b1', 0.35)}`,
                                 transform: 'translateY(-2px)'
                              },
                              transition: 'all 0.3s',
                           }}
                        >
                           {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </Button>
                     </form>
                  </Box>
               </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
               <Paper
                  elevation={3}
                  sx={{
                     px: 4,
                     py: 4,
                     borderRadius: 4,
                     border: '1px solid',
                     borderColor: alpha('#5e35b1', 0.1),
                     boxShadow: `0 10px 40px ${alpha('#5e35b1', 0.08)}`,
                     position: 'relative',
                     overflow: 'hidden',
                     transition: 'all 0.3s ease',
                     '&:hover': {
                        boxShadow: `0 15px 50px ${alpha('#5e35b1', 0.12)}`,
                        transform: 'translateY(-5px)'
                     }
                  }}
               >
                  <Box
                     sx={{
                        position: "absolute",
                        bottom: -100,
                        right: -100,
                        width: 200,
                        height: 200,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${alpha('#1976d2', 0.06)}, transparent 70%)`,
                        zIndex: 0,
                     }}
                  />

                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                        <Avatar
                           sx={{
                              mr: 2,
                              bgcolor: alpha('#5e35b1', 0.1),
                              color: '#5e35b1',
                              width: 48,
                              height: 48,
                              boxShadow: `0 4px 10px ${alpha('#5e35b1', 0.15)}`,
                           }}
                        >
                           <EventNoteIcon sx={{ fontSize: 26 }} />
                        </Avatar>
                        <Typography
                           variant="h5"
                           fontWeight="700"
                           align="center"
                           sx={{
                              background: "#5e35b1",
                              backgroundClip: "text",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                           }}
                        >
                           ข้อมูลสถิติทั้งหมด
                        </Typography>
                     </Box>

                     <Divider sx={{ mb: 3, borderColor: alpha('#5e35b1', 0.1) }} />

                     <TableContainer sx={{ maxHeight: 440, borderRadius: 2, mb: 2 }}>
                        <Table stickyHeader>
                           <TableHead>
                              <TableRow sx={{ '& th': { bgcolor: alpha('#5e35b1', 0.04) } }}>
                                 <TableCell
                                    width="80px"
                                    align="center"
                                    sx={{
                                       fontWeight: 600,
                                       color: '#5e35b1',
                                       borderBottom: `2px solid ${alpha('#5e35b1', 0.2)}`
                                    }}
                                 >
                                    ลำดับที่
                                 </TableCell>
                                 <TableCell
                                    width="260px"
                                    align="center"
                                    sx={{
                                       fontWeight: 600,
                                       color: '#5e35b1',
                                       borderBottom: `2px solid ${alpha('#5e35b1', 0.2)}`
                                    }}
                                 >
                                    หมายเหตุ
                                 </TableCell>
                                 <TableCell
                                    width="150px"
                                    align="center"
                                    sx={{
                                       fontWeight: 600,
                                       color: '#5e35b1',
                                       borderBottom: `2px solid ${alpha('#5e35b1', 0.2)}`
                                    }}
                                 >
                                    วันที่สร้าง
                                 </TableCell>
                                 <TableCell
                                    width="60px"
                                    align="center"
                                    sx={{
                                       fontWeight: 600,
                                       color: '#5e35b1',
                                       borderBottom: `2px solid ${alpha('#5e35b1', 0.2)}`
                                    }}
                                 >
                                    จัดการ
                                 </TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {groupReport.length > 0 ? (
                                 groupReport.map((report, index) => (
                                    <TableRow
                                       key={report.id}
                                       sx={{
                                          '&:nth-of-type(odd)': {
                                             bgcolor: alpha('#f5f5f5', 0.5),
                                          },
                                          '&:hover': {
                                             bgcolor: alpha('#5e35b1', 0.03),
                                          },
                                          transition: 'background-color 0.2s',
                                       }}
                                    >
                                       <TableCell align="center">
                                          <Chip
                                             label={index + 1}
                                             size="small"
                                             sx={{
                                                fontWeight: 600,
                                                bgcolor: alpha('#5e35b1', 0.1),
                                                color: '#5e35b1',
                                                minWidth: '40px',
                                             }}
                                          />
                                       </TableCell>
                                       <TableCell align="left" sx={{ fontWeight: 500 }}>
                                          {report.Note}
                                       </TableCell>
                                       <TableCell align="center">
                                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                             <AccessTimeIcon
                                                fontSize="small"
                                                sx={{ mr: 1, color: alpha('#5e35b1', 0.7) }}
                                             />
                                             <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {formatDate(report.createdAt)} น.
                                             </Typography>
                                          </Box>
                                       </TableCell>
                                       <TableCell align="center">
                                          <Tooltip title="ลบข้อมูล" arrow>
                                             <Button
                                                variant='outlined'
                                                color="error"
                                                size="small"
                                                onClick={() => handleDelete(report.id)}
                                                sx={{
                                                   borderRadius: 2,
                                                   minWidth: '40px',
                                                   '&:hover': {
                                                      backgroundColor: alpha('#f44336', 0.04),
                                                      transform: 'translateY(-2px)',
                                                      boxShadow: `0 4px 8px ${alpha('#f44336', 0.15)}`,
                                                   },
                                                   transition: 'all 0.2s',
                                                }}
                                             >
                                                <DeleteForeverIcon fontSize="small" />
                                             </Button>
                                          </Tooltip>
                                       </TableCell>
                                    </TableRow>
                                 ))
                              ) : (
                                 <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                          <EventNoteIcon sx={{ fontSize: 40, color: alpha('#5e35b1', 0.3), mb: 1 }} />
                                          <Typography color="text.secondary" fontWeight={500}>
                                             ไม่พบข้อมูล
                                          </Typography>
                                       </Box>
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </TableContainer>
                     {groupReport.length > 0 && (
                        <Box sx={{ textAlign: 'right', mt: 2 }}>
                           <Chip
                              label={`ทั้งหมด ${groupReport.length} รายการ`}
                              color="primary"
                              size="small"
                              sx={{
                                 fontWeight: 500,
                                 bgcolor: alpha('#5e35b1', 0.1),
                                 color: '#5e35b1',
                                 border: `1px solid ${alpha('#5e35b1', 0.2)}`,
                              }}
                           />
                        </Box>
                     )}
                  </Box>
               </Paper>
            </Grid>
         </Grid>
      </Container>
   );
};

export default AddFile;