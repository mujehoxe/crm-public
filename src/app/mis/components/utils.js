export function areSanctionImagesAvailable(row) {
  return (
    row?.KYCimage &&
    row?.KYCimage != "https://crm-milestonehomes.com/public/kyc/undefined" &&
    row?.UNimage &&
    row?.UNimage != "https://crm-milestonehomes.com/public/kyc/undefined" &&
    row?.Sanctionimage &&
    row?.Sanctionimage !=
      "https://crm-milestonehomes.com/public/kyc/undefined" &&
    row?.Riskimage &&
    row?.Riskimage != "https://crm-milestonehomes.com/public/kyc/undefined"
  );
}
