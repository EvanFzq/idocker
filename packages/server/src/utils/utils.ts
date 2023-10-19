export const commandFormat = (str: string): string[] | undefined => {
  if (!str.trim()) return;

  const arr = [...str.matchAll(/".*?"/g)];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const index = str.indexOf(item[0]);
    str = `${str.slice(0, index)}$${i}${str.slice(index + item[0].length)}`;
  }
  let params = str.trim().split(/\s+/);
  params = params.map(item => {
    if (/^\$[0-9]+$/.test(item)) {
      const index = Number(item.slice(1));
      if (isNaN(index)) return item;
      return arr[index][0].slice(1, arr[index][0].length - 1);
    }
    return item;
  });
  return params;
};
