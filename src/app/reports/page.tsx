'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { PDFDocument, grayscale, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { useRouter, useSearchParams } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import { fetchWithBase } from '../lib/fetchWithBase';

interface Report {
   REQ_YDC_ID: string;
   REQUEST_YEAR: number;
   REQUEST_MONTH: number;
   DOCUMENT_CODE: string;
   DOCUMENT_NAME_TH: string;
   E_SERVICE: number;
   WORK_IN: number;
}

const ReportContent = () => {
   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
   const [loading, setLoading] = useState(true);
   const [report, setReport] = useState<Report[]>([]);
   const searchParams = useSearchParams();
   const startYear = searchParams.get("startYear");
   const endYear = searchParams.get("endYear");
   const router = useRouter();

   const formatMonth = (month: number, year: number) => {
      const thaiYear = (year + 543) % 100;
      switch (month) {
         case 1: return `ม.ค. ${thaiYear}`;
         case 2: return `ก.พ. ${thaiYear}`;
         case 3: return `มี.ค. ${thaiYear}`;
         case 4: return `เม.ย. ${thaiYear}`;
         case 5: return `พ.ค. ${thaiYear}`;
         case 6: return `มิ.ย. ${thaiYear}`;
         case 7: return `ก.ค. ${thaiYear}`;
         case 8: return `ส.ค. ${thaiYear}`;
         case 9: return `ก.ย. ${thaiYear}`;
         case 10: return `ต.ค. ${thaiYear}`;
         case 11: return `พ.ย. ${thaiYear}`;
         case 12: return `ธ.ค. ${thaiYear}`;
         default: return '';
      }
   }

   const fetchReport = useCallback(async () => {
      if (!startYear || !endYear) {
         console.log("Missing parameters");
         setLoading(false);
         return;
      }
      try {
         const res = await fetchWithBase(`/api/reports?startYear=${startYear}&endYear=${endYear}`);
         if (res.ok) {
            const data = await res.json();
            const sortedData = data.sort((a: Report, b: Report) => {
               if (a.REQUEST_YEAR !== b.REQUEST_YEAR) {
                  return a.REQUEST_YEAR - b.REQUEST_YEAR;
               }
               return a.REQUEST_MONTH - b.REQUEST_MONTH;
            });
            setReport(sortedData);
         } else {
            console.error("Failed to fetch data", res.statusText);
            Swal.fire({
               icon: "error",
               text: `ไม่พบข้อมูล`,
               showConfirmButton: false,
               timer: 2000
            }).then(() => {
               router.push('/');
            });
         }
      } catch (err) {
         console.error("Error :", err);
         Swal.fire({
            icon: "error",
            text: `เกิดข้อผิดพลาดในการค้นหาข้อมูล`,
            showConfirmButton: false,
            timer: 2000
         }).then(() => {
            router.push('/');
         });
      } finally {
         setLoading(false);
      }
   }, [startYear, endYear, router]);

   useEffect(() => {
      fetchReport();
   }, [fetchReport]);

   const generatePDF = useCallback(async () => {
      if (report.length === 0) return;

      try {
         const pdfDoc = await PDFDocument.create();
         pdfDoc.registerFontkit(fontkit);

         const fontUrl = `/font/Sarabun/Sarabun-Regular.ttf`;
         const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
         const customFont = await pdfDoc.embedFont(fontBytes, { subset: true });

         const uniqueDocCodes = Array.from(new Set(report.map(item => item.DOCUMENT_CODE)));

         const firstDocReports = report.filter(r => r.DOCUMENT_CODE === uniqueDocCodes[0]);
         const globalEarliestReport = firstDocReports.reduce((earliest, current) => {
            const earliestDate = earliest.REQUEST_YEAR * 12 + earliest.REQUEST_MONTH;
            const currentDate = current.REQUEST_YEAR * 12 + current.REQUEST_MONTH;
            return currentDate < earliestDate ? current : earliest;
         }, firstDocReports[0]);
         const globalEarliestMonth = globalEarliestReport.REQUEST_MONTH;
         const globalEarliestYear = globalEarliestReport.REQUEST_YEAR;

         for (const docCode of uniqueDocCodes) {
            const page = pdfDoc.addPage([595, 841]);
            const { width } = page.getSize();
            const fontSizeTitle = 11;
            const fontSize = 10;

            const docReports = report.filter(r => r.DOCUMENT_CODE === docCode);
            const firstReport = docReports[0];

            const textTitle = `รายงานข้อมูลสถิติ${firstReport.DOCUMENT_NAME_TH}`;
            const textWidthTitle = customFont.widthOfTextAtSize(textTitle, fontSizeTitle);
            const titleX = (width - textWidthTitle) / 2;

            page.drawText(textTitle, {
               x: titleX,
               y: 780,
               size: fontSizeTitle,
               font: customFont
            });

            const textSubtopic = `ประจำปีงบประมาณ พ.ศ. ${firstDocReports[0].REQUEST_YEAR + 543 + 1}`;
            const textWidthSubtopic = customFont.widthOfTextAtSize(textSubtopic, fontSizeTitle);
            const subtopicX = (width - textWidthSubtopic) / 2;

            page.drawText(textSubtopic, {
               x: subtopicX,
               y: 760,
               size: fontSizeTitle,
               font: customFont
            });

            page.drawRectangle({
               x: 50,
               y: 335,
               width: 500,
               height: 395,
               borderWidth: 1,
               borderColor: grayscale(0),
            });

            page.drawLine({
               start: { x: 130, y: 730 },
               end: { x: 130, y: 335 },
               thickness: 1,
               color: grayscale(0),
            });

            page.drawLine({
               start: { x: 430, y: 730 },
               end: { x: 430, y: 335 },
               thickness: 1,
               color: grayscale(0),
            });

            page.drawLine({
               start: { x: 306.5, y: 697 },
               end: { x: 306.5, y: 335 },
               thickness: 1,
               color: grayscale(0),
            });

            page.drawLine({
               start: { x: 130, y: 697 },
               end: { x: 430, y: 697 },
               thickness: 1,
               color: grayscale(0),
            });

            page.drawLine({
               start: { x: 50, y: 664 },
               end: { x: 550, y: 664 },
               thickness: 1,
               color: grayscale(0),
            });

            for (let i = 0; i < 13; i++) {
               page.drawLine({
                  start: { x: 50, y: 664 - (i * 25) },
                  end: { x: 550, y: 664 - (i * 25) },
                  thickness: 1,
                  color: grayscale(0),
               });
            }

            page.drawText('เดือน', {
               x: 80,
               y: 690,
               size: fontSize,
               font: customFont
            });

            page.drawText('การให้บริการ', {
               x: 250,
               y: 710,
               size: fontSize,
               font: customFont
            });

            page.drawText('จุดให้บริการ Walk-in (จำนวนครั้ง)', {
               x: 155,
               y: 676,
               size: fontSize,
               font: customFont
            });

            page.drawText('E-service (จำนวนครั้ง)', {
               x: 320,
               y: 676,
               size: fontSize,
               font: customFont
            });

            page.drawText('หมายเหตุ', {
               x: 470,
               y: 690,
               size: fontSize,
               font: customFont
            });

            const fullYearData = Array.from({ length: 12 }, (_, i) => {
               const monthIndex = (globalEarliestMonth - 1 + i) % 12 + 1;
               const yearOffset = Math.floor((globalEarliestMonth - 1 + i) / 12);
               const year = globalEarliestYear + yearOffset;
               const item = docReports.find(r => r.REQUEST_MONTH === monthIndex && r.REQUEST_YEAR === year);
               return {
                  REQUEST_MONTH: monthIndex,
                  REQUEST_YEAR: year,
                  WORK_IN: item ? Number(item.WORK_IN) : 0,
                  E_SERVICE: item ? Number(item.E_SERVICE) : 0
               };
            });

            let totalWorkIn = 0;
            let totalEService = 0;

            fullYearData.forEach((item, index) => {
               page.drawText(String(formatMonth(item.REQUEST_MONTH, item.REQUEST_YEAR)), {
                  x: 75,
                  y: 645 - (index * 25),
                  size: fontSize,
                  font: customFont
               });

               const workIn = item.WORK_IN;
               const eService = item.E_SERVICE;

               totalWorkIn += workIn;
               totalEService += eService;

               page.drawText(String(workIn), {
                  x: 210,
                  y: 645 - (index * 25),
                  size: fontSize,
                  font: customFont
               });

               page.drawText(String(eService), {
                  x: 365,
                  y: 645 - (index * 25),
                  size: fontSize,
                  font: customFont
               });
            });

            const lastIndex = 12;
            page.drawText('รวม', {
               x: 80,
               y: 645 - (lastIndex * 25),
               size: fontSize,
               font: customFont
            });

            page.drawText(String(totalWorkIn), {
               x: 210,
               y: 645 - (lastIndex * 25),
               size: fontSize,
               font: customFont
            });

            page.drawText(String(totalEService), {
               x: 365,
               y: 645 - (lastIndex * 25),
               size: fontSize,
               font: customFont
            });

            const chartX = 80;
            const chartY = 100;
            const chartWidth = 470;
            const chartHeight = 200;
            const barWidth = 16;
            const chartDataPoints = fullYearData.length;
            const barSpacing = chartWidth / (chartDataPoints * 2 + 1);

            page.drawRectangle({
               x: chartX,
               y: chartY,
               width: chartWidth,
               height: chartHeight,
               borderWidth: 1,
               borderColor: grayscale(0),
               color: rgb(0.95, 0.95, 0.95),
            });

            const maxValue = Math.max(
               ...fullYearData.map(data => Math.max(data.WORK_IN, data.E_SERVICE)),
               10
            );

            function roundUpToNiceNumber(num: number): number {
               if (num === 0) return 10;
               const magnitude = Math.pow(10, Math.floor(Math.log10(num)));
               const normalized = Math.ceil(num / magnitude);
               return normalized * magnitude;
            }

            const valueMax = roundUpToNiceNumber(maxValue);

            const tickCount = 5;
            for (let i = 0; i < tickCount; i++) {
               const lineY = chartY + chartHeight - (chartHeight * i) / tickCount;
               const value = Math.round((valueMax * (tickCount - i)) / tickCount);

               page.drawLine({
                  start: { x: chartX, y: lineY },
                  end: { x: chartX + chartWidth, y: lineY },
                  thickness: 0.5,
                  color: grayscale(0.8),
               });

               page.drawText(String(value), {
                  x: chartX - 30,
                  y: lineY - 5,
                  size: 8,
                  font: customFont,
               });
            }


            fullYearData.forEach((data, index) => {
               const xPosition = chartX + barSpacing + index * barSpacing * 2;

               const walkInHeight = (data.WORK_IN / valueMax) * chartHeight;
               if (walkInHeight > 0) {
                  page.drawRectangle({
                     x: xPosition - 10,
                     y: chartY,
                     width: barWidth,
                     height: walkInHeight,
                     color: rgb(0.031, 0.239, 0.569),
                  });
               }

               const eServiceHeight = (data.E_SERVICE / valueMax) * chartHeight;
               if (eServiceHeight > 0) {
                  page.drawRectangle({
                     x: xPosition + barWidth - 10,
                     y: chartY,
                     width: barWidth,
                     height: eServiceHeight,
                     color: rgb(0.835, 0.098, 0.074),
                  });
               }

               page.drawText(formatMonth(data.REQUEST_MONTH, data.REQUEST_YEAR), {
                  x: xPosition + barWidth - 20,
                  y: chartY - 15,
                  size: 8,
                  font: customFont
               });
            });

            const legendX = chartX;
            const legendY = chartY - 60;

            page.drawRectangle({
               x: legendX + 50,
               y: legendY,
               width: 12,
               height: 12,
               color: rgb(0.031, 0.239, 0.569),
            });

            page.drawText('การให้บริการ จุดให้บริการ Walk-in (จำนวนครั้ง)', {
               x: legendX + 70,
               y: legendY + 3,
               size: 10,
               font: customFont
            });

            page.drawRectangle({
               x: legendX + 270,
               y: legendY,
               width: 12,
               height: 12,
               color: rgb(0.835, 0.098, 0.074),
            });

            page.drawText('การให้บริการ E-service (จำนวนครั้ง)', {
               x: legendX + 290,
               y: legendY + 3,
               size: 10,
               font: customFont
            });
         }

         const pdfBytes = await pdfDoc.save();
         const blob = new Blob([pdfBytes], { type: 'application/pdf' });
         const url = URL.createObjectURL(blob);
         setPdfUrl(url);

         return () => URL.revokeObjectURL(url);

      } catch (error) {
         console.error('Error generating PDF:', error);
      }
   }, [report]);

   useEffect(() => {
      if (report.length > 0) {
         generatePDF();
      }
   }, [report, generatePDF]);

   return (
      <>
         {pdfUrl && !loading ? (
            <iframe
               src={pdfUrl}
               width="100%"
               height="800px"
               style={{ border: 'none' }}
               title="Report PDF with Charts"
            />
         ) : (
            <div className="flex items-center justify-center min-h-screen">
               <CircularProgress />
            </div>
         )}
      </>
   );
};

const Report = () => {
   return (
      <Suspense fallback={<div className='flex items-center justify-center min-h-screen'><CircularProgress /></div>}>
         <ReportContent />
      </Suspense>
   );
};

export default Report;