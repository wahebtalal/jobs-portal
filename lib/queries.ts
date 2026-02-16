import { prisma } from './prisma';

export async function listJobs(params: {
  search?: string;
  categoryId?: string;
  locationId?: string;
  jobType?: string;
  page?: number;
  includeUnpublished?: boolean;
}) {
  const page = Math.max(1, params.page || 1);
  const pageSize = 9;
  const where = {
    ...(params.includeUnpublished ? {} : { published: true }),
    ...(params.search
      ? {
          OR: [
            { titleEn: { contains: params.search, mode: 'insensitive' as const } },
            { titleAr: { contains: params.search, mode: 'insensitive' as const } },
            { companyEn: { contains: params.search, mode: 'insensitive' as const } },
            { companyAr: { contains: params.search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(params.categoryId ? { categoryId: Number(params.categoryId) } : {}),
    ...(params.locationId ? { locationId: Number(params.locationId) } : {}),
    ...(params.jobType ? { jobType: params.jobType } : {}),
  };

  const [jobs, count] = await Promise.all([
    prisma.job.findMany({
      where,
      include: { category: true, location: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs, count, page, pageSize, totalPages: Math.max(1, Math.ceil(count / pageSize)) };
}
