// prisma/seed.ts
// ملف بذر قاعدة البيانات ببيانات تجريبية

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const superAdminPassword = await bcrypt.hash('password123', 12);
  const superAdmin = await prisma.platformUser.upsert({
    where: { email: 'superadmin@platform.com' },
    update: {
      password: superAdminPassword,
      role: 'super_admin',
      isActive: true,
    },
    create: {
      email: 'superadmin@platform.com',
      password: superAdminPassword,
      role: 'super_admin',
      isActive: true,
    },
  });

  const organization = await prisma.organization.upsert({
    where: { slug: 'default-org' },
    update: {
      name: 'Default School',
      nameAr: 'المدرسة الافتراضية',
      nameEn: 'Default School',
      type: 'school',
      typeAr: 'مدرسة',
      typeEn: 'School',
      email: 'admin@school.com',
      isActive: true,
    },
    create: {
      name: 'Default School',
      nameAr: 'المدرسة الافتراضية',
      nameEn: 'Default School',
      type: 'school',
      typeAr: 'مدرسة',
      typeEn: 'School',
      slug: 'default-org',
      email: 'admin@school.com',
      phone: '+966500000000',
      isActive: true,
    },
  });

  const activeSubscription = await prisma.subscription.findFirst({
    where: { organizationId: organization.id, status: 'active' },
  });

  if (!activeSubscription) {
    await prisma.subscription.create({
      data: {
        organizationId: organization.id,
        plan: 'premium',
        price: 0,
        status: 'active',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2099-12-31'),
      },
    });
  }

  console.log('🌱 بدء بذر قاعدة البيانات...');
  console.log('✅ تم إنشاء مسؤول المنصة:', superAdmin.email);

  // ======= إنشاء المستخدم المسؤول =======
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {
      organizationId: organization.id,
      password: adminPassword,
      role: 'admin',
      isActive: true,
    },
    create: {
      organizationId: organization.id,
      email: 'admin@school.com',
      password: adminPassword,
      phone: '+966500000001',
      role: 'admin',
    },
  });
  console.log('✅ تم إنشاء حساب المسؤول:', admin.email);

  // ======= إنشاء مستخدم الاستقبال =======
  const receptionPassword = await bcrypt.hash('reception123', 12);
  const reception = await prisma.user.upsert({
    where: { email: 'reception@school.com' },
    update: {
      organizationId: organization.id,
      password: receptionPassword,
      role: 'reception',
      isActive: true,
    },
    create: {
      organizationId: organization.id,
      email: 'reception@school.com',
      password: receptionPassword,
      phone: '+966500000002',
      role: 'reception',
    },
  });
  console.log('✅ تم إنشاء حساب الاستقبال:', reception.email);

  // ======= إنشاء معلم =======
  const teacherPassword = await bcrypt.hash('teacher123', 12);
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {
      organizationId: organization.id,
      password: teacherPassword,
      role: 'teacher',
      isActive: true,
    },
    create: {
      organizationId: organization.id,
      email: 'teacher@school.com',
      password: teacherPassword,
      phone: '+966500000003',
      role: 'teacher',
    },
  });

  const teacher = await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: { organizationId: organization.id },
    create: {
      organizationId: organization.id,
      userId: teacherUser.id,
      firstName: 'محمد',
      lastName: 'أحمد',
      specialization: 'رياضيات',
      qualifications: 'بكالوريوس تربية - رياضيات',
      experienceYears: 10,
      salary: 8000,
      status: 'active',
      hireDate: new Date('2020-09-01'),
    },
  });
  console.log('✅ تم إنشاء حساب المعلم:', teacherUser.email);

  // ======= إنشاء ولي أمر =======
  const parentPassword = await bcrypt.hash('parent123', 12);
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@school.com' },
    update: {
      organizationId: organization.id,
      password: parentPassword,
      role: 'parent',
      isActive: true,
    },
    create: {
      organizationId: organization.id,
      email: 'parent@school.com',
      password: parentPassword,
      phone: '+966500000004',
      role: 'parent',
    },
  });

  const parent = await prisma.parent.upsert({
    where: { userId: parentUser.id },
    update: { organizationId: organization.id },
    create: {
      organizationId: organization.id,
      userId: parentUser.id,
      firstName: 'عبدالله',
      lastName: 'خالد',
      phone: '+966500000004',
      email: 'parent@school.com',
      relationship: 'father',
    },
  });
  console.log('✅ تم إنشاء حساب ولي الأمر:', parentUser.email);

  // ======= إنشاء الصفوف =======
  const grade1 = await prisma.grade.upsert({
    where: { id: 1 },
    update: { organizationId: organization.id },
    create: { organizationId: organization.id, name: 'الصف الأول', level: 'preparatory', description: 'الصف الأول الإعدادي' },
  });

  const grade2 = await prisma.grade.upsert({
    where: { id: 2 },
    update: { organizationId: organization.id },
    create: { organizationId: organization.id, name: 'الصف الثاني', level: 'preparatory', description: 'الصف الثاني الإعدادي' },
  });

  const grade3 = await prisma.grade.upsert({
    where: { id: 3 },
    update: { organizationId: organization.id },
    create: { organizationId: organization.id, name: 'الصف الأول', level: 'secondary', description: 'الصف الأول الثانوي' },
  });
  console.log('✅ تم إنشاء الصفوف');

  // ======= إنشاء الشعب =======
  const section1 = await prisma.section.upsert({
    where: { id: 1 },
    update: { organizationId: organization.id },
    create: { organizationId: organization.id, gradeId: grade1.id, name: 'أ', academicYear: '2024-2025', maxStudents: 30 },
  });

  const section2 = await prisma.section.upsert({
    where: { id: 2 },
    update: { organizationId: organization.id },
    create: { organizationId: organization.id, gradeId: grade1.id, name: 'ب', academicYear: '2024-2025', maxStudents: 30 },
  });
  console.log('✅ تم إنشاء الشعب');

  // ======= إنشاء المواد =======
  const math = await prisma.subject.upsert({
    where: { id: 1 },
    update: { organizationId: organization.id },
    create: { organizationId: organization.id, name: 'الرياضيات', description: 'مادة الرياضيات' },
  });

  const arabic = await prisma.subject.upsert({
    where: { id: 2 },
    update: { organizationId: organization.id },
    create: { organizationId: organization.id, name: 'اللغة العربية', description: 'مادة اللغة العربية' },
  });

  const science = await prisma.subject.upsert({
    where: { id: 3 },
    update: { organizationId: organization.id },
    create: { organizationId: organization.id, name: 'العلوم', description: 'مادة العلوم' },
  });
  console.log('✅ تم إنشاء المواد');

  // ======= ربط المواد بالصفوف =======
  const gradeSubject = await prisma.gradeSubject.upsert({
    where: { unique_grade_subject: { gradeId: grade1.id, subjectId: math.id , sectionId:section1.id } },
    update: {},
    create: { gradeId: grade1.id, subjectId: math.id, teacherId: teacher.id, sectionId: section1.id },
  });
  console.log('✅ تم ربط المواد بالصفوف');

  // ======= إنشاء طالب =======
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@school.com' },
    update: {
      organizationId: organization.id,
      password: await bcrypt.hash('student123', 12),
      role: 'student',
      isActive: true,
    },
    create: {
      organizationId: organization.id,
      email: 'student@school.com',
      password: await bcrypt.hash('student123', 12),
      phone: '+966500000005',
      role: 'student',
    },
  });

  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: { organizationId: organization.id },
    create: {
      organizationId: organization.id,
      userId: studentUser.id,
      parentId: parent.id,
      sectionId: section1.id,
      firstName: 'خالد',
      lastName: 'عبدالله',
      dateOfBirth: new Date('2010-05-15'),
      gender: 'male',
      academicYear: '2024-2025',
      status: 'active',
    },
  });
  console.log('✅ تم إنشاء حساب الطالب:', studentUser.email);

  console.log('\n🎉 تم بذر قاعدة البيانات بنجاح!');
  console.log('\n📋 بيانات الدخول التجريبية:');
  console.log('   مسؤول المنصة: superadmin@platform.com / password123');
  console.log('   المسؤول: admin@school.com / admin123');
  console.log('   معرف المؤسسة: default-org');
  console.log('   الاستقبال: reception@school.com / reception123');
  console.log('   المعلم: teacher@school.com / teacher123');
  console.log('   ولي الأمر: parent@school.com / parent123');
  console.log('   الطالب: student@school.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في بذر قاعدة البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
