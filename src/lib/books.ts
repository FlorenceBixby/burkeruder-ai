export interface Book {
  title: string;
  author: string;
  rating: number;
  dateRead?: string;
  imageUrl?: string;
  link?: string;
}

async function fetchShelf(shelf: string): Promise<Book[]> {
  const url = `https://www.goodreads.com/review/list_rss/17449496?shelf=${shelf}&per_page=50&sort=date_read`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const xml = await res.text();

    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    return items.map((item) => {
      const get = (tag: string) => {
        const m = item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
        return m ? (m[1] || m[2] || "").trim() : "";
      };

      const title = get("title");
      const author = get("author_name");
      const rating = parseInt(get("user_rating") || "0", 10);
      const dateRead = get("user_read_at") || get("user_date_added");
      const link = get("link");

      const imgMatch = item.match(/src="([^"]+goodreads[^"]+)"/);
      const imageUrl = imgMatch ? imgMatch[1].replace(/\._S[XY]\d+_/, "._SX150_") : "";

      return { title, author, rating, dateRead, imageUrl, link };
    }).filter((b) => b.title);
  } catch {
    return [];
  }
}

export async function getReadBooks(): Promise<Book[]> {
  return fetchShelf("read");
}

export async function getToReadBooks(): Promise<Book[]> {
  return fetchShelf("to-read");
}
