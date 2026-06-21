import { InvestorForm } from "@/components/admin/investor-form";
export default function NewInvestorPage() { return <><h1 className="text-3xl font-black">투자자 추가</h1><p className="mt-2 mb-6 text-sm text-slate-500">SEC company submissions에서 기관명과 CIK를 대조한 뒤 입력하세요.</p><InvestorForm /></>; }
