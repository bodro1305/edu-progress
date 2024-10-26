export const formatDate = (date: string) =>
  new Date(date).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const getTodayDay = () => {
  const days = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
  const today = new Date().getDay();
  return days[today];
};
