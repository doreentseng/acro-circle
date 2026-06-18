export async function POST(req: Request) {
  await req.json();
  // const body = await req.json();
  // console.log(JSON.stringify(body, null, 2));

  return new Response('OK');
}
