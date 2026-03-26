import { AppLanguage } from '@prisma/client';

export type LocalizedText = {
  ar: string;
  en: string;
};

export type LocalizedNotificationContent = {
  title: LocalizedText;
  message: LocalizedText;
};

export type LocalizedBalance = {
  annualAmount: number;
  totalPaid: number;
  remaining: number;
  gradeName: string;
} | null;

export type AssessmentNotificationParams = {
  studentName: string;
  subjectName: string;
  assessmentType: string;
  assessmentTitle: string;
  maxScore: number;
  score: number;
  percentage: number;
  grade?: string | null;
  teacherName?: string;
  feedback?: string | null;
};

export type AssessmentPendingNotificationParams = {
  studentName: string;
  subjectName: string;
  assessmentType: string;
  assessmentTitle: string;
  maxScore: number;
  teacherName?: string;
};

export type AssessmentScoreUpdatedParams = {
  studentName: string;
  subjectName: string;
  assessmentType: string;
  assessmentTitle: string;
  maxScore: number;
  score: number;
  percentage: number;
  grade?: string | null;
  wasUnscored: boolean;
};

export type MonthlyReportNotificationAssessment = {
  subject: string;
  score: number | null;
  maxScore: number;
  percentage: number | null;
  grade: string | null;
};

export type MonthlyReportNotificationParams = {
  studentName: string;
  sectionName: string;
  month: number;
  year: number;
  assessments: MonthlyReportNotificationAssessment[];
  averagePercentage: number | null;
  overallGrade: string | null;
};

const MONTHS_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ASSESSMENT_TYPE_LABELS: Record<string, LocalizedText> = {
  quiz: { ar: 'اختبار قصير', en: 'quiz' },
  exam: { ar: 'اختبار', en: 'exam' },
  homework: { ar: 'واجب', en: 'homework' },
  midterm: { ar: 'مذاكرة', en: 'midterm' },
  final: { ar: 'فحص نهائي', en: 'final exam' },
};

const GRADE_LABELS: Record<string, LocalizedText> = {
  ممتاز: { ar: 'ممتاز', en: 'Excellent' },
  'جيد جداً': { ar: 'جيد جداً', en: 'Very Good' },
  جيد: { ar: 'جيد', en: 'Good' },
  مقبول: { ar: 'مقبول', en: 'Fair' },
  ضعيف: { ar: 'ضعيف', en: 'Weak' },
  راسب: { ar: 'راسب', en: 'Fail' },
  Excellent: { ar: 'ممتاز', en: 'Excellent' },
  'Very Good': { ar: 'جيد جداً', en: 'Very Good' },
  Good: { ar: 'جيد', en: 'Good' },
  Fair: { ar: 'مقبول', en: 'Fair' },
  Weak: { ar: 'ضعيف', en: 'Weak' },
  Fail: { ar: 'راسب', en: 'Fail' },
};

export function getMonthName(month: number, language: AppLanguage): string {
  const months = language === 'en' ? MONTHS_EN : MONTHS_AR;
  return months[month - 1] || '';
}

export function getAssessmentTypeLabel(
  type: string,
  language: AppLanguage,
): string {
  const labels = ASSESSMENT_TYPE_LABELS[type];
  if (!labels) {
    return type;
  }

  return labels[language];
}

export function translateGrade(
  grade: string | null | undefined,
  language: AppLanguage,
): string | null {
  if (!grade) {
    return null;
  }

  const translated = GRADE_LABELS[grade];
  if (!translated) {
    return grade;
  }

  return translated[language];
}

function formatNumber(value: number, language: AppLanguage): string {
  return value.toLocaleString(language === 'en' ? 'en-US' : 'ar-SY', {
    maximumFractionDigits: 2,
  });
}

function buildBalanceLines(
  balance: LocalizedBalance,
  language: AppLanguage,
): string[] {
  if (!balance) {
    return [];
  }

  if (language === 'en') {
    const lines = [
      '',
      `Account summary (${balance.gradeName}):`,
      `Total paid: SYP ${formatNumber(balance.totalPaid, 'en')}`,
      `Remaining: SYP ${formatNumber(balance.remaining, 'en')}`,
      `Annual fee: SYP ${formatNumber(balance.annualAmount, 'en')}`,
    ];

    if (balance.remaining <= 0) {
      lines.push('The annual fee has been fully paid.');
    }

    return lines;
  }

  const lines = [
    '',
    `ملخص الحساب (${balance.gradeName}):`,
    `إجمالي المدفوع: ${formatNumber(balance.totalPaid, 'ar')} ل.س`,
    `المتبقي: ${formatNumber(balance.remaining, 'ar')} ل.س`,
    `القسط السنوي: ${formatNumber(balance.annualAmount, 'ar')} ل.س`,
  ];

  if (balance.remaining <= 0) {
    lines.push('تم سداد القسط السنوي بالكامل.');
  }

  return lines;
}

export function buildAbsenceNotification(
  studentName: string,
): LocalizedNotificationContent {
  return {
    title: {
      ar: 'غياب طالب',
      en: 'Student absence',
    },
    message: {
      ar: `ابنكم ${studentName} غائب اليوم`,
      en: `Your child ${studentName} is absent today.`,
    },
  };
}

export function buildLateNotification(
  studentName: string,
  lateMinutes: number,
): LocalizedNotificationContent {
  return {
    title: {
      ar: 'تأخر طالب',
      en: 'Student late arrival',
    },
    message: {
      ar: `ابنكم ${studentName} متأخر ${lateMinutes} دقيقة اليوم`,
      en: `Your child ${studentName} is ${lateMinutes} minutes late today.`,
    },
  };
}

export function buildAssessmentResultNotification(
  params: AssessmentNotificationParams,
): LocalizedNotificationContent {
  const typeLabelAr = getAssessmentTypeLabel(params.assessmentType, 'ar');
  const typeLabelEn = getAssessmentTypeLabel(params.assessmentType, 'en');
  const gradeAr = translateGrade(params.grade, 'ar');
  const gradeEn = translateGrade(params.grade, 'en');

  const arLines = [
    `حصل ${params.studentName} على ${params.score}/${params.maxScore} (${params.percentage.toFixed(0)}%) في ${typeLabelAr}: "${params.assessmentTitle}" - مادة ${params.subjectName}`,
  ];
  const enLines = [
    `${params.studentName} scored ${params.score}/${params.maxScore} (${params.percentage.toFixed(0)}%) in the ${typeLabelEn} "${params.assessmentTitle}" for ${params.subjectName}.`,
  ];

  if (gradeAr) {
    arLines.push(`التقدير: ${gradeAr}`);
  }
  if (gradeEn) {
    enLines.push(`Grade: ${gradeEn}`);
  }
  if (params.teacherName) {
    arLines.push(`المعلم: ${params.teacherName}`);
    enLines.push(`Teacher: ${params.teacherName}`);
  }
  if (params.feedback) {
    arLines.push(`ملاحظة: ${params.feedback}`);
    enLines.push(`Feedback: ${params.feedback}`);
  }

  return {
    title: {
      ar: `نتيجة ${typeLabelAr} - ${params.studentName} - ${params.subjectName}`,
      en: `${capitalize(typeLabelEn)} result - ${params.studentName} - ${params.subjectName}`,
    },
    message: {
      ar: arLines.join('\n'),
      en: enLines.join('\n'),
    },
  };
}

export function buildAssessmentCreatedNotification(
  params: AssessmentPendingNotificationParams,
): LocalizedNotificationContent {
  const typeLabelAr = getAssessmentTypeLabel(params.assessmentType, 'ar');
  const typeLabelEn = getAssessmentTypeLabel(params.assessmentType, 'en');

  const arLines = [
    `تم إنشاء ${typeLabelAr} جديد لـ ${params.studentName} في مادة ${params.subjectName}: "${params.assessmentTitle}"`,
    `الدرجة العظمى: ${params.maxScore}`,
  ];
  const enLines = [
    `A new ${typeLabelEn} was created for ${params.studentName} in ${params.subjectName}: "${params.assessmentTitle}".`,
    `Maximum score: ${params.maxScore}`,
  ];

  if (params.teacherName) {
    arLines.push(`المعلم: ${params.teacherName}`);
    enLines.push(`Teacher: ${params.teacherName}`);
  }

  arLines.push('لم تُسجَّل الدرجة بعد');
  enLines.push('The score has not been recorded yet.');

  return {
    title: {
      ar: `${typeLabelAr} جديد - ${params.studentName} - ${params.subjectName}`,
      en: `New ${typeLabelEn} - ${params.studentName} - ${params.subjectName}`,
    },
    message: {
      ar: arLines.join('\n'),
      en: enLines.join('\n'),
    },
  };
}

export function buildAssessmentScoreUpdatedNotification(
  params: AssessmentScoreUpdatedParams,
): LocalizedNotificationContent {
  const typeLabelAr = getAssessmentTypeLabel(params.assessmentType, 'ar');
  const typeLabelEn = getAssessmentTypeLabel(params.assessmentType, 'en');
  const gradeAr = translateGrade(params.grade, 'ar');
  const gradeEn = translateGrade(params.grade, 'en');

  const arLines = [
    params.wasUnscored
      ? `حصل ${params.studentName} على ${params.score}/${params.maxScore} (${params.percentage.toFixed(0)}%) في ${typeLabelAr}: "${params.assessmentTitle}" - مادة ${params.subjectName}`
      : `تم تحديث درجة ${params.studentName} في ${typeLabelAr}: "${params.assessmentTitle}" - مادة ${params.subjectName}`,
  ];
  const enLines = [
    params.wasUnscored
      ? `${params.studentName} scored ${params.score}/${params.maxScore} (${params.percentage.toFixed(0)}%) in the ${typeLabelEn} "${params.assessmentTitle}" for ${params.subjectName}.`
      : `${params.studentName}'s score was updated for the ${typeLabelEn} "${params.assessmentTitle}" in ${params.subjectName}.`,
  ];

  if (!params.wasUnscored) {
    arLines.push(
      `الدرجة الجديدة: ${params.score}/${params.maxScore} (${params.percentage.toFixed(0)}%)`,
    );
    enLines.push(
      `New score: ${params.score}/${params.maxScore} (${params.percentage.toFixed(0)}%)`,
    );
  }

  if (gradeAr) {
    arLines.push(`التقدير: ${gradeAr}`);
  }
  if (gradeEn) {
    enLines.push(`Grade: ${gradeEn}`);
  }

  return {
    title: {
      ar: `${params.wasUnscored ? 'نتيجة' : 'تحديث نتيجة'} ${typeLabelAr} - ${params.studentName} - ${params.subjectName}`,
      en: `${params.wasUnscored ? 'Result' : 'Result update'} - ${capitalize(typeLabelEn)} - ${params.studentName} - ${params.subjectName}`,
    },
    message: {
      ar: arLines.join('\n'),
      en: enLines.join('\n'),
    },
  };
}

export function buildNewPaymentNotification(
  studentName: string,
  amount: number,
  dueDate: string,
  balance: LocalizedBalance,
): LocalizedNotificationContent {
  const arLines = [
    `تم إنشاء مستحق مالي جديد لـ ${studentName}.`,
    `القيمة: ${formatNumber(amount, 'ar')} ل.س`,
    `تاريخ الاستحقاق: ${dueDate}`,
    ...buildBalanceLines(balance, 'ar'),
  ];
  const enLines = [
    `A new payment due was created for ${studentName}.`,
    `Amount: SYP ${formatNumber(amount, 'en')}`,
    `Due date: ${dueDate}`,
    ...buildBalanceLines(balance, 'en'),
  ];

  return {
    title: {
      ar: `مستحق مالي جديد - ${studentName}`,
      en: `New payment due - ${studentName}`,
    },
    message: {
      ar: arLines.join('\n'),
      en: enLines.join('\n'),
    },
  };
}

export function buildPaymentConfirmedNotification(
  studentName: string,
  amount: number,
  receiptNumber: string,
  balance: LocalizedBalance,
): LocalizedNotificationContent {
  const arLines = [
    `تم تأكيد دفع مبلغ ${formatNumber(amount, 'ar')} ل.س.`,
    `رقم الإيصال: ${receiptNumber}`,
    ...buildBalanceLines(balance, 'ar'),
  ];
  const enLines = [
    `A payment of SYP ${formatNumber(amount, 'en')} was confirmed.`,
    `Receipt number: ${receiptNumber}`,
    ...buildBalanceLines(balance, 'en'),
  ];

  return {
    title: {
      ar: `تأكيد دفع - ${studentName}`,
      en: `Payment confirmed - ${studentName}`,
    },
    message: {
      ar: arLines.join('\n'),
      en: enLines.join('\n'),
    },
  };
}

export function buildOverduePaymentNotification(
  studentName: string,
  amount: number,
  dueDate: string,
): LocalizedNotificationContent {
  return {
    title: {
      ar: `تذكير بمستحق متأخر - ${studentName}`,
      en: `Overdue payment reminder - ${studentName}`,
    },
    message: {
      ar: `يوجد مستحق مالي متأخر بقيمة ${formatNumber(amount, 'ar')} ل.س كان مستحقاً في ${dueDate}`,
      en: `There is an overdue payment of SYP ${formatNumber(amount, 'en')} that was due on ${dueDate}.`,
    },
  };
}

export function buildStudentRegisteredNotification(
  studentName: string,
  sectionInfoAr: string,
  sectionInfoEn: string = sectionInfoAr,
): LocalizedNotificationContent {
  return {
    title: {
      ar: 'تم تسجيل الطالب',
      en: 'Student registration completed',
    },
    message: {
      ar: `تم تسجيل ${studentName} بنجاح في ${sectionInfoAr}`,
      en: `${studentName} was successfully registered in ${sectionInfoEn}.`,
    },
  };
}

export function buildMonthlyReportNotification(
  params: MonthlyReportNotificationParams,
): LocalizedNotificationContent {
  const monthAr = getMonthName(params.month, 'ar');
  const monthEn = getMonthName(params.month, 'en');

  const arLines = [
    `التقرير الشهري لـ ${params.studentName} - ${monthAr} ${params.year}`,
    params.sectionName,
    '',
    'التقييمات:',
  ];
  const enLines = [
    `Monthly report for ${params.studentName} - ${monthEn} ${params.year}`,
    params.sectionName,
    '',
    'Assessments:',
  ];

  for (const assessment of params.assessments) {
    const arScoreText =
      assessment.score !== null
        ? `${assessment.score}/${assessment.maxScore} (${assessment.percentage?.toFixed(0)}%)`
        : 'لم يُقيَّم بعد';
    const enScoreText =
      assessment.score !== null
        ? `${assessment.score}/${assessment.maxScore} (${assessment.percentage?.toFixed(0)}%)`
        : 'Not graded yet';
    const gradeAr = translateGrade(assessment.grade, 'ar');
    const gradeEn = translateGrade(assessment.grade, 'en');

    arLines.push(
      `• ${assessment.subject}: ${arScoreText}${gradeAr ? ` - ${gradeAr}` : ''}`,
    );
    enLines.push(
      `• ${assessment.subject}: ${enScoreText}${gradeEn ? ` - ${gradeEn}` : ''}`,
    );
  }

  if (params.averagePercentage !== null) {
    const overallGradeAr = translateGrade(params.overallGrade, 'ar');
    const overallGradeEn = translateGrade(params.overallGrade, 'en');

    arLines.push(
      '',
      `المعدل العام: ${params.averagePercentage.toFixed(1)}%${overallGradeAr ? ` - ${overallGradeAr}` : ''}`,
    );
    enLines.push(
      '',
      `Overall average: ${params.averagePercentage.toFixed(1)}%${overallGradeEn ? ` - ${overallGradeEn}` : ''}`,
    );
  }

  return {
    title: {
      ar: `تقرير شهري - ${params.studentName} - ${monthAr}`,
      en: `Monthly report - ${params.studentName} - ${monthEn}`,
    },
    message: {
      ar: arLines.join('\n'),
      en: enLines.join('\n'),
    },
  };
}

function capitalize(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
