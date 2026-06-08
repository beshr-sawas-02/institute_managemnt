import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(orgId: number, createStudentDto: CreateStudentDto) {
    const data: any = { ...createStudentDto, organizationId: orgId };
    if (data.dateOfBirth) data.dateOfBirth = new Date(data.dateOfBirth);

    const student = await this.prisma.student.create({
      data,
      include: {
        parent: { select: { id: true, firstName: true, lastName: true } },
        section: { include: { grade: true } },
      },
    });

    if (student.parentId) {
      await this.notificationsService.notifyStudentRegistered(student.id);
    }

    return student;
  }

  async findAll(orgId: number, paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId };
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          parent: {
            select: { id: true, firstName: true, lastName: true, phone: true },
          },
          section: { include: { grade: true } },
          user: { select: { id: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.student.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(orgId: number, id: number) {
    const student = await this.prisma.student.findFirst({
      where: { id, organizationId: orgId },
      include: {
        parent: true,
        section: { include: { grade: true } },
        user: { select: { id: true, email: true } },
        attendances: { take: 10, orderBy: { date: 'desc' } },
        assessments: {
          take: 10,
          orderBy: { assessmentDate: 'desc' },
          include: { gradeSubject: { include: { subject: true } } },
        },
        payments: { orderBy: { dueDate: 'desc' } },
      },
    });

    if (!student) throw new NotFoundException('الطالب غير موجود');
    return student;
  }

  async findBySection(orgId: number, sectionId: number) {
    return this.prisma.student.findMany({
      where: { sectionId, organizationId: orgId, status: 'active' },
      include: {
        parent: {
          select: { id: true, firstName: true, lastName: true, phone: true },
        },
      },
      orderBy: { firstName: 'asc' },
    });
  }

  async findByParent(orgId: number, parentId: number) {
    return this.prisma.student.findMany({
      where: { parentId, organizationId: orgId },
      include: { section: { include: { grade: true } } },
    });
  }

  async update(orgId: number, id: number, updateStudentDto: UpdateStudentDto) {
    await this.findOne(orgId, id);
    const data: any = { ...updateStudentDto };
    if (data.dateOfBirth) data.dateOfBirth = new Date(data.dateOfBirth);

    return this.prisma.student.update({
      where: { id },
      data,
      include: {
        parent: { select: { id: true, firstName: true, lastName: true } },
        section: { include: { grade: true } },
      },
    });
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.student.delete({ where: { id } });
    return { message: 'تم حذف الطالب بنجاح' };
  }
}
