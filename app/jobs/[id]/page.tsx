import JobDetailPage from '@/components/JobDetailPage'

interface JobDetailProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobDetail({ params }: JobDetailProps) {
  const { id } = await params
  return <JobDetailPage jobId={id} />
}