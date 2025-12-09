export const isBirthday = (birthday: string | Date | null | undefined): boolean => {
  if (!birthday) return false;
  
  try {
    const today = new Date();
    const birthDate = typeof birthday === 'string' ? new Date(birthday) : birthday;
    
    if (isNaN(birthDate.getTime())) return false;
    
    return today.getDate() === birthDate.getDate() && 
           today.getMonth() === birthDate.getMonth();
  } catch {
    return false;
  }
};