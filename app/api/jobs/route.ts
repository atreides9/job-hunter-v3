import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || 'frontend';
  
  try {
    const response = await fetch(
      `https://oapi.saramin.co.kr/job-search?keywords=${keyword}&access-key=${process.env.SARAMIN_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    const data = await response.json();
    
    // 데이터 형식 변환
    const formattedJobs = data.jobs.job.map((job: {
      id: string;
      position: {
        title: string;
        location: { name: string };
        job_type: { name: string };
        required_education_level?: string;
      };
      company: { detail: { name: string } };
      posting_date: string;
      expiration_date: string;
      url: string;
      salary?: { min?: string; max?: string };
    }) => ({
      id: job.id,
      title: job.position.title,
      company: job.company.detail.name,
      location: job.position.location.name,
      posted_date: job.posting_date,
      deadline: job.expiration_date,
      description: job.position.job_type.name,
      url: job.url,
      keywords: job.position.required_education_level ? [job.position.required_education_level] : [],
      salary_min: parseInt(job.salary?.min || '0'),
      salary_max: parseInt(job.salary?.max || '0'),
      employment_type: job.position.job_type.name,
      remote_available: false // API에서 제공하지 않으면 별도 파싱 필요
    }));
    
    return NextResponse.json(formattedJobs);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}