export default async function Page({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const param = await params;

  return <p>{param.meetingId}</p>;
}
