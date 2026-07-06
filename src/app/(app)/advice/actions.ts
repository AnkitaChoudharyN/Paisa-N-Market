'use server';

import { getPersonalizedFinancialAdvice } from '@/ai/flows/personalized-financial-advice';
import { z } from 'zod';

const adviceFormSchema = z.object({
  simulationData: z.string().min(1, { message: 'Simulation data cannot be empty.' }),
  learningProgress: z.string().min(1, { message: 'Learning progress cannot be empty.' }),
  userGoals: z.string().min(1, { message: 'User goals cannot be empty.' }),
});

export type AdviceFormState = {
  message: string;
  advice?: string;
  isSuccess: boolean;
};

export async function getAdviceAction(
  prevState: AdviceFormState,
  formData: FormData
): Promise<AdviceFormState> {
  const validatedFields = adviceFormSchema.safeParse({
    simulationData: formData.get('simulationData'),
    learningProgress: formData.get('learningProgress'),
    userGoals: formData.get('userGoals'),
  });

  if (!validatedFields.success) {
    return {
      message: 'All fields are required. Please check your input.',
      isSuccess: false,
    };
  }

  try {
    const result = await getPersonalizedFinancialAdvice(validatedFields.data);

    if (result.advice) {
      return {
        message: 'Here is your personalized financial advice!',
        advice: result.advice,
        isSuccess: true,
      };
    } else {
      return { message: 'Could not generate advice. Please try again.', isSuccess: false };
    }
  } catch (error) {
    console.error(error);
    return { message: 'An unexpected error occurred. Please try again later.', isSuccess: false };
  }
}
