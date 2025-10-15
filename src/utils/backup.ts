export const createBackup = ({table,data}:{table:string,data:any[]}) => {
   const jsonData = {
    table,
    data: data,
  };

  const content = JSON.stringify(jsonData, null, 2);
  const file = new Blob([content], { type: 'application/json' });
  
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);

  const datetime = new Date().toISOString().replace(/[:.]/g, "-"); // for valid filename
  link.download = `mohitk-art-${table}-${datetime}.json`;
  link.click();

  URL.revokeObjectURL(link.href);
}