import { auth } from '@/lib/auth';

export async function getCurrentUser() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  return {
    id: session.user.id,
    username: session.user.name,
    email: session.user.email,
  };
}


export function validateKYCData(data: any) {
  const errors: string[] = [];
  
  if (!data.firstName?.trim()) errors.push('First name is required');
  if (!data.lastName?.trim()) errors.push('Last name is required');
  if (!data.dob?.trim()) errors.push('Date of birth is required');
  if (!data.nationality?.trim()) errors.push('Nationality is required');
  if (!data.address?.trim()) errors.push('Address is required');
  if (!data.city?.trim()) errors.push('City is required');
  if (!data.country?.trim()) errors.push('Country is required');
  if (!data.postalCode?.trim()) errors.push('Postal code is required');
  if (!data.idType?.trim()) errors.push('ID type is required');
  if (!data.idNumber?.trim()) errors.push('ID number is required');
  
  return errors;
}
