import { useParams } from "react-router-dom";

export default function About() {  
  // const content = useParams(); 선생님 코드 
    // content 파라미터만 추출 (없을 수도 있으니 ?)
  const { content } = useParams<{ content?: string }>(); // 챗이 알려준 코드 

  return (
    // <div> About { content ? content : '대메뉴' } </div> //선생님 코드
     <div>About {content ?? "대메뉴"}</div> // 챗이 알려준 코드 
   
    // <div className="p-6 space-y-6">
    //   {/*공통(default)**으로 충분한 페이지 → 그냥 <Seo /> */}
    //   {/* SEO 메타 태그 개별 SEO가 필요한 페이지 → props를 넣어 덮어쓰기 */}
    //   {/* <Seo
    //     title="About — SoRa Clinic"
    //     description="SoRa Clinic 소개 페이지"
    //     canonical="https://sora-react.vercel.app/about"
    //     ogImage="/icons/og-about.png"
    //   /> */}

    //   {/* 페이지 컨텐츠 */}
    //   <h1 className="text-3xl font-bold">About SoRa Clinic</h1>
    //   <p className="text-lg text-gray-700">
    //     SoRa Clinic은 글로벌 K-뷰티 전문 클리닉으로, 최고의 스킨케어 서비스를 제공합니다.
    //   </p>
    // </div>
    
  )
}
