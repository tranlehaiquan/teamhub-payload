import zod from 'zod';

export const certificateSchema = zod
  .object({
    name: zod.string().nonempty({
      message: 'Name is required',
    }),
    issuingOrganization: zod.string().min(1, {
      message: 'Issuing organization is required',
    }),
    deliveryDate: zod.date().optional().nullable().optional(),
    expiryDate: zod.date().optional().nullable().optional(),
    skill: zod.number({
      message: 'Skill is required',
    }),
  })
  .refine(
    (data) => {
      if (data.deliveryDate && data.expiryDate && data.expiryDate < data.deliveryDate) {
        return false;
      }
      return true;
    },
    {
      path: ['expiryDate'],
      message: 'Expiry date must be greater than delivery date',
    },
  );

export type CertificateFormValues = zod.infer<typeof certificateSchema>;
