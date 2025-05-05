import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { tmpdir } from 'os';

const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false,
    },
};

interface Report {
    REQ_YDC_ID: string;
    REQUEST_YEAR: number;
    REQUEST_MONTH: number;
    REQ_DOCUMENT_ID: number;
    DOCUMENT_CODE: string;
    DOCUMENT_NAME_TH: string;
    TOTAL_REQUESTS: number;
    E_SERVICE: number;
    WORK_IN: number;
}

export async function POST(req: NextRequest) {
    let filePath: string | undefined;

    try {
        const uploadDir = join(tmpdir(), 'uploads');
        await mkdir(uploadDir, { recursive: true }).catch((error) => {
            throw new Error(`ไม่สามารถสร้างโฟลเดอร์สำหรับอัปโหลดได้: ${error.message}`);
        });

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const Note = formData.get('note') as string;
        
        if (!file) {
            return NextResponse.json({ error: 'กรุณาอัปโหลดไฟล์' }, { status: 400 });
        }

        if (!file.name.endsWith('.xlsx')) {
            return NextResponse.json({ error: 'รองรับเฉพาะไฟล์ Excel (.xlsx) เท่านั้น' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        filePath = join(uploadDir, file.name);
        await writeFile(filePath, buffer);

        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const report: Report[] = XLSX.utils.sheet_to_json(sheet);

        if (report.length === 0) {
            return NextResponse.json({ error: 'ไฟล์ Excel ไม่มีข้อมูล' }, { status: 400 });
        }

        const requiredFields = [
            'REQ_YDC_ID',
            'REQUEST_YEAR',
            'REQUEST_MONTH',
            'REQ_DOCUMENT_ID',
            'DOCUMENT_CODE',
            'DOCUMENT_NAME_TH',
            'TOTAL_REQUESTS',
            'E_SERVICE',
            'WORK_IN',
        ];
        for (const row of report) {
            for (const field of requiredFields) {
                if (!(field in row) || row[field as keyof Report] === undefined || row[field as keyof Report] === null) {
                    throw new Error(`ข้อมูลในไฟล์ Excel ขาดฟิลด์ที่จำเป็น: ${field}`);
                }
            }
            if (typeof row.REQUEST_YEAR !== 'number' || row.REQUEST_YEAR < 0) {
                throw new Error(`REQUEST_YEAR ต้องเป็นจำนวนจริง`);
            }
            if (typeof row.REQUEST_MONTH !== 'number' || row.REQUEST_MONTH < 1 || row.REQUEST_MONTH > 12) {
                throw new Error(`REQUEST_MONTH ต้องเป็นตัวเลขระหว่าง 1-12`);
            }
        }

        const newGroup = await prisma.rEQ_GROUP_REPORT.create({
            data: {
                Note: Note || '',
            },
        });

        const reportData = report.map((row) => ({
            REQ_YDC_ID: String(row.REQ_YDC_ID), 
            REQUEST_YEAR: row.REQUEST_YEAR,
            REQUEST_MONTH: row.REQUEST_MONTH,
            REQ_DOCUMENT_ID: row.REQ_DOCUMENT_ID,
            DOCUMENT_CODE: String(row.DOCUMENT_CODE),
            DOCUMENT_NAME_TH: String(row.DOCUMENT_NAME_TH),
            TOTAL_REQUESTS: row.TOTAL_REQUESTS,
            E_SERVICE: row.E_SERVICE,
            WORK_IN: row.WORK_IN,
            GROUP_ID: newGroup.id,
        }));

        await prisma.rEQ_MORE_REPORT.createMany({
            data: reportData,
        });

        return NextResponse.json({
            message: 'อัปโหลดและบันทึกข้อมูลสำเร็จ',
            groupId: newGroup.id,
            totalRecords: report.length,
        }, { status: 200 });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' },
            { status: 500 }
        );
    } finally {
        if (filePath) {
            await unlink(filePath).catch((err) => console.error('Error deleting file:', err));
        }
        await prisma.$disconnect();
    }
}