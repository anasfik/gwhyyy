export const dynamic = "force-static";

export function GET() {
  return new Response("This project has been retired. See https://gwhyyy.com/work for current work.\n", {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
