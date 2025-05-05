import { PrismaClient, Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const reports = await prisma.rEQ_GROUP_REPORT.findMany();
        return NextResponse.json({ 
            ok: true,
            reports 
        }, { 
            status: 200 
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json(
            { 
                ok: false,
                error: error instanceof Error ? error.message : 'Cannot fetch reports'
            }, 
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { 
                    ok: false,
                    error: "Valid ID is required" 
                },
                { status: 400 }
            );
        }

        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const moreReportDelete = await tx.rEQ_MORE_REPORT.deleteMany({
                where: {
                    GROUP_ID: Number(id),
                }
            });

            const groupReportDelete = await tx.rEQ_GROUP_REPORT.delete({
                where: {
                    id: Number(id)
                }
            });

            return {
                ok: true,
                groupReportCount: groupReportDelete ? 1 : 0,
                moreReportCount: moreReportDelete.count,
            };
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error deleting reports:', error);
        return NextResponse.json(
            { 
                ok: false,
                error: error instanceof Error ? error.message : 'Cannot delete reports'
            }, 
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}