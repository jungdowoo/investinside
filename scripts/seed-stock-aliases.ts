import { createClient } from "@supabase/supabase-js";

const aliases = [
  ["013872106", "AA", "알코아", "ALCOA CORP"],
  ["037833100", "AAPL", "애플", "APPLE INC"],
  ["007903107", "AMD", "AMD", "ADVANCED MICRO DEVICES INC"],
  ["023135106", "AMZN", "아마존", "AMAZON COM INC"],
  ["G0403H108", "AON", "에이온", "AON PLC"],
  ["11135F101", "AVGO", "브로드컴", "BROADCOM INC"],
  ["025816109", "AXP", "아메리칸 익스프레스", "AMERICAN EXPRESS CO"],
  ["01609W102", "BABA", "알리바바", "ALIBABA GROUP HLDG LTD"],
  ["060505104", "BAC", "뱅크 오브 아메리카", "BANK AMERICA CORP"],
  ["11271J107", "BN", "브룩필드", "BROOKFIELD CORP"],
  ["116794207", "BRKR", "브루커", "BRUKER CORP"],
  ["H1467J104", "CB", "처브", "CHUBB LTD"],
  ["21873S108", "CRWV", "코어위브", "COREWEAVE INC"],
  ["166764100", "CVX", "셰브론", "CHEVRON CORPORATION"],
  ["285512109", "EA", "일렉트로닉 아츠", "ELECTRONIC ARTS INC"],
  ["036752103", "ELV", "엘리번스 헬스", "ELEVANCE HEALTH INC"],
  ["26969P108", "EXP", "이글 머티리얼스", "EAGLE MATLS INC"],
  ["31488V107", "FERG", "퍼거슨 엔터프라이즈", "FERGUSON ENTERPRISES INC"],
  ["36828A101", "GEV", "GE 버노바", "GE VERNOVA INC"],
  ["02079K107", "GOOG", "알파벳 클래스 C", "ALPHABET INC CLASS C"],
  ["02079K305", "GOOGL", "알파벳 클래스 A", "ALPHABET INC CLASS A"],
  ["406216101", "HAL", "할리버튼", "HALLIBURTON CO"],
  ["44267T102", "HHH", "하워드 휴즈 홀딩스", "HOWARD HUGHES HOLDINGS INC"],
  ["42806J700", "HTZ", "허츠 글로벌", "HERTZ GLOBAL HLDGS INC"],
  ["457669307", "INSM", "인스메드", "INSMED INC"],
  ["464287200", "IVV", "아이셰어즈 코어 S&P 500 ETF", "ISHARES CORE S&P 500 ETF"],
  ["500754106", "KHC", "크래프트 하인즈", "KRAFT HEINZ CO"],
  ["191216100", "KO", "코카콜라", "COCA COLA CO"],
  ["512807306", "LRCX", "램리서치", "LAM RESEARCH CORP"],
  ["550021109", "LULU", "룰루레몬 애슬레티카", "LULULEMON ATHLETICA INC"],
  ["30303M102", "META", "메타 플랫폼스", "META PLATFORMS INC"],
  ["60855R100", "MOH", "몰리나 헬스케어", "MOLINA HEALTHCARE INC"],
  ["594918104", "MSFT", "마이크로소프트", "MICROSOFT CORP"],
  ["595112103", "MU", "마이크론 테크놀로지", "MICRON TECHNOLOGY INC"],
  ["N62509109", "NAMS", "뉴암스테르담 파마", "NEWAMSTERDAM PHARMA COMPANY"],
  ["629377508", "NRG", "NRG 에너지", "NRG ENERGY INC"],
  ["632307104", "NTRA", "나테라", "NATERA INC"],
  ["67066G104", "NVDA", "엔비디아", "NVIDIA CORPORATION"],
  ["674599105", "OXY", "옥시덴털 페트롤리엄", "OCCIDENTAL PETE CORP"],
  ["717081103", "PFE", "화이자", "PFIZER INC"],
  ["69608A108", "PLTR", "팔란티어 테크놀로지스", "PALANTIR TECHNOLOGIES INC"],
  ["76131D103", "QSR", "레스토랑 브랜즈 인터내셔널", "RESTAURANT BRANDS INTL INC"],
  ["46137V357", "RSP", "인베스코 S&P 500 동일가중 ETF", "INVESCO S&P 500 EQUAL WEIGHT ETF"],
  ["81141R100", "SE", "씨 리미티드", "SEA LTD"],
  ["812215200", "SEG", "시포트 엔터테인먼트", "SEAPORT ENTMT GROUP INC"],
  ["78442P106", "SLM", "SLM 코퍼레이션", "SLM CORP"],
  ["80004C200", "SNDK", "샌디스크", "SANDISK CORP"],
  ["78462F103", "SPY", "SPDR S&P 500 ETF", "SPDR S&P 500 ETF TRUST"],
  ["861012102", "STM", "ST마이크로일렉트로닉스", "STMICROELECTRONICS N V"],
  ["G0896C103", "TBBB", "BBB 푸즈", "BBB FOODS INC"],
  ["879369106", "TFX", "텔레플렉스", "TELEFLEX INCORPORATED"],
  ["874039100", "TSM", "TSMC", "TAIWAN SEMICONDUCTOR MANUFACTURING"],
  ["90353T100", "UBER", "우버 테크놀로지스", "UBER TECHNOLOGIES INC"],
  ["907818108", "UNP", "유니언 퍼시픽", "UNION PAC CORP"],
  ["92826C839", "V", "비자", "VISA INC"],
  ["92840M102", "VST", "비스트라", "VISTRA CORP"],
  ["95082P105", "WCC", "웨스코 인터내셔널", "WESCO INTL INC"],
  ["G96629103", "WTW", "윌리스 타워스 왓슨", "WILLIS TOWERS WATSON PLC"],
  ["81369Y506", "XLE", "에너지 셀렉트 섹터 SPDR ETF", "ENERGY SELECT SECTOR SPDR FUND"],
  ["984245100", "YPF", "YPF", "YPF SOCIEDAD ANONIMA"],
] as const;

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required in .env.local`);
  return value;
}

async function main() {
  const db = createClient(requiredEnv("NEXT_PUBLIC_SUPABASE_URL"), requiredEnv("SUPABASE_SECRET_KEY"), { auth: { persistSession: false, autoRefreshToken: false } });
  const rows = aliases.map(([cusip, ticker, issuer_name, normalized_name]) => ({ cusip, ticker, issuer_name, normalized_name }));
  const { error: aliasError } = await db.from("stock_aliases").upsert(rows, { onConflict: "cusip" });
  if (aliasError) throw aliasError;

  for (const [cusip, ticker] of aliases) {
    const { error: holdingError } = await db.from("holdings").update({ ticker }).eq("cusip", cusip);
    if (holdingError) throw holdingError;
    const { error: changeError } = await db.from("holding_changes").update({ ticker }).eq("cusip", cusip);
    if (changeError) throw changeError;
  }
  console.log(`Stored and backfilled ${aliases.length} verified CUSIP aliases.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
