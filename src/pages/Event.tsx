import { useParams } from 'react-router-dom';
import type { Category } from '../db/type/common';
import catedb from '../db/category.json';

export default function EventPage() {
  const{ category_id } = useParams<{ category_id?: string }>();
  const category = category_id 
  ? catedb.find((item:Category)=> item.id === category_id)
  : null;

  return (

    <section className="container mx-auto px-4 py-10">
       <div>
        {
            category_id ? (
            <h2>{category ? category.name : '카테고리를 찾을 수 없습니다.'}</h2> //사망식표현 카테고리 ID가 있고 없고 
          ): (
          <h2>전체 상품 보기</h2>
        )}
       
    </div>
      <h1 className="text-2xl font-semibold mb-4">이벤트</h1>
      <p>프로모션/이벤트 리스트 영역</p>
    </section>
  );
}
