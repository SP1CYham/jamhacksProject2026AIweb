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
export function kWattHours(
  prompts: number,
  tier: number[],
  usage: number[],
  lengthConvo: number,
  imgPercentage: number,
) {
  const tokens = prompts * 500;
  const tierCo = [0.0002, 0.0006, 0.002, 0.02];
  const usageCo = [2, 1, 1, 0.2, 0.1];

  var tierF = 0;
  for (let i = 0; i < tier.length; i++) {
    tierF += tier[i] * tierCo[i];
  }
  tierF /= 100;

  var usageF = 0;
  for (let i = 0; i < usage.length; i++) {
    usageF += usage[i] * usageCo[i];
  }
  usageF /= 100;

  imgPercentage /= 100;

  return (
    (((tokens *
      (1 - imgPercentage) *
      tierF *
      usageF *
      (1 + (lengthConvo - 1) * 0.15) +
      prompts * imgPercentage * 2.9) *
      1.4) /
      1000) *
    365
  );
}
