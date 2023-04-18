const fetchData = async (inputUrl: string) => {
  const allData = [];
  let counter = 1;
  let data = [];
  console.log("1.1");

  do {
    console.log("1.2");
    const url = `https://api.github.com/repos/${inputUrl.slice(
      19
    )}/issues?state=open&per_page=100&page=${counter}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("No issues!");
    }
    data = await res.json();
    allData.push(...data);
    counter++;
  } while (data.length === 100);

  console.log("ALL DATA", allData);
  console.log("1.3");

  return allData;
};

export default fetchData;

export function daysAgo(dateStr: string): string {
  const date: Date = new Date(dateStr);
  const now: Date = new Date();
  const diff: number = now.getTime() - date.getTime();
  const diffDays: number = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  else if (diffDays === 1) return "yesterday";
  else return `${diffDays} days ago`;
}

export function resetBoards(setBoards: Function) {
  setBoards([
    { id: 1, title: "ToDo", items: [] },
    { id: 2, title: "In Progress", items: [] },
    { id: 3, title: "Done", items: [] },
  ]);
}
