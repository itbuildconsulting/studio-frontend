export const isBirthday = (birthday: string | Date | null | undefined): boolean => {
  if (!birthday) return false;

  try {
    const today = new Date();
    let birthMonth: number;
    let birthDay: number;

    if (typeof birthday === 'string') {
      // Parseia manualmente para evitar offset de fuso horário (UTC vs local)
      const parts = birthday.split('T')[0].split('-');
      birthMonth = Number.parseInt(parts[1], 10) - 1;
      birthDay = Number.parseInt(parts[2], 10);
    } else {
      birthMonth = birthday.getMonth();
      birthDay = birthday.getDate();
    }

    return today.getDate() === birthDay && today.getMonth() === birthMonth;
  } catch {
    return false;
  }
};