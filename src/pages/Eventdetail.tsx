import { useParams } from 'react-router-dom';

export default function Eventdetail() {

const{ pk } = useParams();

  return (
    <div> 상품상세이미지 { pk } </div>
  )
}
