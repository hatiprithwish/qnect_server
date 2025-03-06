export const debug = {
  log: (data: any, label?: string) => {
    if (process.env.NODE_ENV === "development") {
      console.group(label || "Debug Output");
      console.log(JSON.stringify(data, null, 2));
      console.groupEnd();
    }
  },

  dir: (data: any, label?: string) => {
    if (process.env.NODE_ENV === "development") {
      console.group(label || "Debug Output");
      console.dir(data, { depth: null, colors: true });
      console.groupEnd();
    }
  },
};
