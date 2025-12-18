export function formatDate(dateString: string): string {
    // Parse date string manually to avoid timezone issues
    // Expected format: YYYY-MM-DD
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }

export function formatDateTime(dateString: string): string {
    if (!dateString) return '';
    
    // Handle both date-only (YYYY-MM-DD) and datetime (YYYY-MM-DDTHH:mm:ss) formats
    let date: Date;
    
    if (dateString.includes('T')) {
      // Datetime format: parse date and time separately to avoid timezone issues
      const [datePart, timePart] = dateString.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      
      if (timePart) {
        // Extract hours and minutes, ignore seconds and timezone
        const timeMatch = timePart.match(/^(\d{2}):(\d{2})/);
        if (timeMatch) {
          const hours = parseInt(timeMatch[1], 10);
          const minutes = parseInt(timeMatch[2], 10);
          date = new Date(year, month - 1, day, hours, minutes);
        } else {
          date = new Date(year, month - 1, day);
        }
      } else {
        date = new Date(year, month - 1, day);
      }
    } else {
      // Date-only format: YYYY-MM-DD
      const [year, month, day] = dateString.split('-').map(Number);
      date = new Date(year, month - 1, day);
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }