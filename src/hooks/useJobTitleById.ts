'use client';

import { api } from '@/trpc/react';

const useJobTitleById = (jobTitleId?: string | null) => {
  const [jobTitles] = api.global.getJobTitles.useSuspenseQuery();

  if (!jobTitles) {
    return null;
  }

  const jobTitle = jobTitles.titles.find((jobTitle) => jobTitle.id === jobTitleId);
  return jobTitle;
};

export default useJobTitleById;
