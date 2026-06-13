//before
export function Q1(prompts: number) {
  return 0.24 * Math.sqrt(prompts);
}
export function Q3(usage: number[]) {
  const weight = [1.57, 1.14, 0.71, 0.57, 0.49];
  var n = 0;
  for (let i = 0; i < usage.length; i++) {
    n += usage[i] * weight[i];
  }

  return n / 100;
}

//after
