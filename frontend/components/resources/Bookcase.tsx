import Link from "next/link";
import { EXPLAINERS, TOPICS, readMinutes } from "@/lib/resources";

// Cover colors and heights, cycled across the books so the shelf
// looks hand-collected rather than uniform
const COVERS = [
  "bg-burgundy text-paper",
  "bg-sage-light text-ink",
  "bg-olive text-paper",
  "bg-blush text-burgundy",
  "bg-slate text-paper",
  "bg-mood-okay text-ink",
  "bg-mood-low text-ink",
];
const HEIGHTS = ["h-52", "h-48", "h-56"];

// One shelf per topic. Each article is a book cover standing on the plank;
// hovering lifts it off the shelf.
export default function Bookcase() {
  let bookIndex = 0;

  return (
    <div className="overflow-hidden rounded-card bg-paper/95">
      {TOPICS.map((topic) => {
        const books = EXPLAINERS.filter((e) => e.topic === topic.id);

        return (
          <section key={topic.id} className="px-6 pt-8 md:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end">
              {/* Shelf label */}
              <div className="md:w-48 md:shrink-0 md:pb-6">
                <h3 className="text-title leading-tight font-black text-burgundy">
                  {topic.label}
                </h3>
                <p className="mt-1 font-hand text-body text-muted">
                  {topic.note}
                </p>
              </div>

              {/* Books, standing on the plank below */}
              <div className="flex flex-wrap items-end gap-4">
                {books.map((book) => {
                  const i = bookIndex++;
                  return (
                    <Link
                      key={book.slug}
                      href={`/resources/${book.slug}`}
                      className={`group relative flex w-36 flex-col justify-between rounded-l-sm rounded-r-md pt-4 pr-4 pb-3 pl-6 shadow-[4px_4px_0_rgb(0_0_0/0.12)] transition duration-200 hover:-translate-y-3 hover:-rotate-2 ${COVERS[i % COVERS.length]} ${HEIGHTS[i % HEIGHTS.length]}`}
                    >
                      {/* Spine edge */}
                      <span className="absolute inset-y-0 left-0 w-2.5 rounded-l-sm bg-black/15" />
                      <span className="font-display text-[0.95rem] leading-snug font-black italic">
                        {book.title}
                      </span>
                      <span className="font-hand text-small font-bold opacity-80">
                        {readMinutes(book)} min read
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* The plank */}
            <div className="-mx-6 h-4 border-b-4 border-wood-dark bg-wood shadow-[0_6px_8px_rgb(0_0_0/0.12)] md:-mx-10" />
          </section>
        );
      })}
      <div className="h-8" />
    </div>
  );
}
