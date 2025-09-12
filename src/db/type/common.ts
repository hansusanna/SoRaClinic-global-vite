
export interface NaviItem {
  pk: number;            // 고유 식별자 (Primary Key)
  path: string;          // 라우트 경로
  label: string;         // 메뉴 이름
  display: boolean;      // 화면 표시 여부
}

export interface FooterLink {
  pk: number;
  label: string;
  url: string;
  display: boolean;
}

//이벤트상품-선생님수업용데이터
export interface Product {
  pk: number;              // 제품 고유 ID
  name: string;            // 상품명
  category_id: number;     // 카테고리 ID
  price: number;           // 가격 (정가)
  discount_rate?: number;   // 할인율 (예: 10 = 10%)
   // 배지 표시용: 상품 이미지 위에 "세일/이벤트/신상품" 같은 뱃지 아이콘
  badge?: "sale" | "event" | "new" | "none";
  created_at: string;      // ISO 날짜 문자열
  image_url: string;       // 이미지 경로
  content: string;         // HTML 포함된 설명
}

export interface Category {
    id: string;   // 카테고리 고유 ID
    name: string; // 카테고리 이름 
  }