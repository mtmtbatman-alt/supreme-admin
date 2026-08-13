/**
 * js/backup.js
 * 데이터 내보내기(JSON, CSV) 및 DB 백업 로직
 */
function exportToJSON(data, filename = "backup.json") {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToCSV(headers, rows, filename = "backup.csv") {
  let csvContent = "\uFEFF" + headers.join(",") + "\n";
  rows.forEach(row => {
    csvContent += row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}