export const getDatesOfWeek = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const startOfWeek = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const datesOfWeek: string[] = [];
    
    for (let i = 0; i < 7; i++) {
        const day = new Date(currentDate.setDate(startOfWeek + i));
        const formattedDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
        
        datesOfWeek.push(formattedDate);
    }
    
    return datesOfWeek;
};