export const logMemoryUsage = () => {
  const used = process.memoryUsage().heapUsed / 1024;

  console.log(`The script used about ${Math.round(used * 100) / 100} kb`);
};
