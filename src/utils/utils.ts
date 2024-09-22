export function calculateSimilarity(value1: string, value2: string): number {
    if (!value1 || !value2) return 0;
  
    const value1Lower = value1.toLowerCase();
    const value2Lower = value2.toLowerCase();
  
    let matches = 0;
    const length = Math.max(value1Lower.length, value2Lower.length);
  
    for (let i = 0; i < length; i++) {
      if (value1Lower[i] === value2Lower[i]) {
        matches++;
      }
    }
  
    return (matches / length) * 100;
  }
  