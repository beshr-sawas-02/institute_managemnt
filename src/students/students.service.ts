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
    await this.validateRelations(orgId, createStudentDto);
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
    await this.validateRelations(orgId, updateStudentDto);
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

  private async validateRelations(
    orgId: number,
    dto: Pick<CreateStudentDto, 'userId' | 'parentId' | 'sectionId'>,
  ) {
    const checks: Promise<unknown>[] = [];

    if (dto.userId !== undefined) {
      checks.push(
        this.prisma.user.findFirst({
          where: { id: dto.userId, organizationId: orgId },
          select: { id: true },
        }),
      );
    }
    if (dto.parentId !== undefined) {
      checks.push(
        this.prisma.parent.findFirst({
          where: { id: dto.parentId, organizationId: orgId },
          select: { id: true },
        }),
      );
    }
    if (dto.sectionId !== undefined) {
      checks.push(
        this.prisma.section.findFirst({
          where: { id: dto.sectionId, organizationId: orgId },
          select: { id: true },
        }),
      );
    }

    const results = await Promise.all(checks);
    if (results.some((result) => !result)) {
      throw new NotFoundException('إحدى البيانات المرتبطة لا تتبع هذه المؤسسة');
    }
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.student.delete({ where: { id } });
    return { message: 'تم حذف الطالب بنجاح' };
  }
}
