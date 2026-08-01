const months: Record<string, string> = {
  Januari: "01",
  Februari: "02",
  Maret: "03",
  April: "04",
  Mei: "05",
  Juni: "06",
  Juli: "07",
  Agustus: "08",
  September: "09",
  Oktober: "10",
  November: "11",
  Desember: "12",
};

const parseDateRange = (range: string) => {
  const match = range.match(
    /^(\d{1,2})\s+(\w+)\s*-\s*(\d{1,2})\s+(\w+)\s+(\d{4})$/
  );

  if (!match) return null;

  const [, startDay, startMonth, endDay, endMonth, year] = match;

  return {
    startDate: `${year}-${months[startMonth]}-${startDay.padStart(2, "0")}`,
    endDate: `${year}-${months[endMonth]}-${endDay.padStart(2, "0")}`,
  };
}

export default parseDateRange;