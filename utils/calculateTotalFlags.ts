export const calculateTotalFlags = (flags: Record<string, string | undefined>) => {
    let total = 0;
    for (const key in flags) {
      const value = flags[key]; // could be string or undefined
      if (value) {
        const [numStr] = value.split("/");
        const num = parseInt(numStr, 10);
        if (!isNaN(num)) {
          total += num;
        }
      }
    }
    return total;
  };
  