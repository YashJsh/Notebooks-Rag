export const formatTime = (isoDate: string): string => {
    const date = new Date(isoDate);
  
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  