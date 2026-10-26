const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

export const toBnDigits = (value: number | string) =>
  String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
