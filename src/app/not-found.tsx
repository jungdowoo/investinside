import Link from "next/link";
import { Container } from "@/components/ui";
export default function NotFound() { return <Container className="py-24 text-center"><p className="text-sm font-black text-teal-800">404</p><h1 className="mt-3 text-4xl font-black text-stone-950">페이지를 찾을 수 없습니다</h1><p className="mt-4 text-stone-500">주소가 바뀌었거나 아직 수집되지 않은 데이터일 수 있습니다.</p><Link href="/" className="mt-8 inline-block rounded-lg bg-stone-950 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">홈으로 돌아가기</Link></Container>; }
