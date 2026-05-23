export const generateDateOptions = (count: number = 14): string[] => {
  const options: string[] = [];
  const today = new Date();
  
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    
    // Format: "Quarta, 20 Mai 2026"
    const weekday = capitalize(d.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0]);
    const day = d.getDate().toString().padStart(2, '0');
    const month = capitalize(d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''));
    const year = d.getFullYear();
    
    options.push(`${weekday}, ${day} ${month} ${year}`);
  }
  
  return options;
};
