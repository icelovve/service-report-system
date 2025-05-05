import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
   try {
      const url = new URL(req.url);
      const startYear = url.searchParams.get("startYear");
      const endYear = url.searchParams.get("endYear");

      if (!startYear || !endYear) {
         return NextResponse.json({ error: "Please provide complete parameters" }, { status: 400 });
      }

      const startParts = startYear.split("-");
      const endParts = endYear.split("-");

      if (startParts.length !== 2 || endParts.length !== 2) {
         return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
      }

      const [startYearVal, startMonthVal] = startParts.map(val => parseInt(val, 10));
      const [endYearVal, endMonthVal] = endParts.map(val => parseInt(val, 10));

      if (isNaN(startYearVal) || isNaN(startMonthVal) || isNaN(endYearVal) || isNaN(endMonthVal)) {
         return NextResponse.json({ error: "The month or year is incorrect" }, { status: 400 });
      }

      if (startMonthVal < 1 || startMonthVal > 12 || endMonthVal < 1 || endMonthVal > 12) {
         return NextResponse.json({ error: "Month must be between 1 and 12" }, { status: 400 });
      }

      try {
         const yearMonthConditions = [];
         if (startYearVal === endYearVal) {
            yearMonthConditions.push({
               REQUEST_YEAR: startYearVal,
               REQUEST_MONTH: { gte: startMonthVal, lte: endMonthVal },
            });
         } else {
            yearMonthConditions.push({
               REQUEST_YEAR: startYearVal,
               REQUEST_MONTH: { gte: startMonthVal },
            });
            for (let year = startYearVal + 1; year < endYearVal; year++) {
               yearMonthConditions.push({ REQUEST_YEAR: year });
            }
            yearMonthConditions.push({
               REQUEST_YEAR: endYearVal,
               REQUEST_MONTH: { lte: endMonthVal },
            });
         }

         const [teacherReports, studentReports, moreReport] = await Promise.all([
            prisma.vW_REQ_TEACHER_REPORT.findMany({
               where: { OR: yearMonthConditions },
               orderBy: [{ DOCUMENT_CODE: "asc" }, { REQUEST_YEAR: "asc" }, { REQUEST_MONTH: "asc" }],
            }),
            prisma.vW_REQ_STUDENT_REPORT.findMany({
               where: { OR: yearMonthConditions },
               orderBy: [{ DOCUMENT_CODE: "asc" }, { REQUEST_YEAR: "asc" }, { REQUEST_MONTH: "asc" }],
            }),
            prisma.rEQ_MORE_REPORT.findMany({
               where: { OR: yearMonthConditions },
               orderBy: [{ DOCUMENT_CODE: "asc" }, { REQUEST_YEAR: "asc" }, { REQUEST_MONTH: "asc" }],
            }),
         ]);

         const allReports = [
            ...teacherReports.map((report) => ({ ...report })),
            ...studentReports.map(report => ({ ...report })),
            ...moreReport.map(report => ({ ...report })),
         ];

         const mergedReports = Object.values(
            allReports.reduce((acc: { [key: string]: typeof allReports[0] }, report) => {
               const key = `${report.DOCUMENT_CODE}-${report.REQUEST_YEAR}-${report.REQUEST_MONTH}`;

               if (!acc[key]) {
                  acc[key] = { ...report };
               } else {
                  acc[key].E_SERVICE = (acc[key].E_SERVICE || 0) + (report.E_SERVICE || 0);
                  acc[key].WORK_IN = (acc[key].WORK_IN || 0) + (report.WORK_IN || 0);
                  acc[key].TOTAL_REQUESTS = (acc[key].TOTAL_REQUESTS || 0) + (report.TOTAL_REQUESTS || 0);
               }

               return acc;
            }, {})
         );

         if (mergedReports.length === 0) {
            return NextResponse.json({ message: "No found report" }, { status: 404 });
         } else {
            return NextResponse.json(mergedReports, { status: 200 });
         }

      } catch (error) {
         console.error("Error fetching teacher report:", error);
         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }
   }
   catch (error) {
      console.error("Error parsing request:", error);
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
   } finally {
      await prisma.$disconnect();
   }
}