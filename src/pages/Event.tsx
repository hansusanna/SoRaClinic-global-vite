import { useParams } from 'react-router-dom';

export default function EventPage() {
  const{ category_id } = useParams();

  return (

    <section className="container mx-auto px-4 py-10">
       <div>
        {
            category_id ? <h2>상품카테고리명노출</h2> : <h2>전체</h2>
        }
       
    </div>
      <h1 className="text-2xl font-semibold mb-4">이벤트</h1>
      <p>프로모션/이벤트 리스트 영역</p>
    </section>
  );
}
