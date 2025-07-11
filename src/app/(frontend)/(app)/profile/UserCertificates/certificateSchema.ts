import zod from 'zod';

export const certificateSchema = zod
  .object({
    name: zod.string().nonempty({
      message: 'Name is required',
    }),
    issuingOrganization: zod.string().min(1, {
      message: 'Issuing organization is required',
    }),
    deliveryDate: zod.date().nullable().optional(),
    expiryDate: zod.date().nullable().optional(),
    skill: zod.number({
      error: (issue) => (issue.code === 'invalid_type' ? 'Must be a number' : undefined),
    }),
  })
  .refine(
    (data) => {
      return !(data.deliveryDate && data.expiryDate && data.expiryDate < data.deliveryDate);
    },
    {
      path: ['expiryDate'],
      message: 'Expiry date must be greater than delivery date',
    },
  );

export type CertificateFormValues = zod.infer<typeof certificateSchema>;
