import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function BookingModal({ open, onOpenChange }: Props) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    department: '',
    date: '',
    time: '',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // 간단한 유효성 검사
    if (!form.name || !form.phone || !form.department || !form.date || !form.time) {
      toast.error('모든 항목을 입력해 주세요.');
      return;
    }
    // TODO: API 연동 자리
    toast.success('예약 요청이 접수되었어요!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>예약하기</DialogTitle>
          <DialogDescription>기본 정보를 입력해 주세요.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-3">
          <div className="grid gap-1.5">
            <Label htmlFor="name">이름</Label>
            <Input id="name" name="name" value={form.name} onChange={onChange} placeholder="홍길동" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="phone">연락처</Label>
            <Input id="phone" name="phone" value={form.phone} onChange={onChange} placeholder="010-0000-0000" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="department">진료과</Label>
            <select
              id="department"
              name="department"
              value={form.department}
              onChange={onChange}
              className="h-10 rounded-md border px-3 text-sm"
            >
              <option value="">선택</option>
              <option value="implants">임플란트</option>
              <option value="pediatrics">소아치과</option>
              <option value="orthodontics">교정</option>
              <option value="whitening">미백</option>
              <option value="cosmetic">치아성형</option>
              <option value="etc">기타</option>
            </select>
          </div>

          <div className="grid gap-1.5 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="date">예약일</Label>
              <Input id="date" name="date" type="date" value={form.date} onChange={onChange} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="time">시간</Label>
              <Input id="time" name="time" type="time" value={form.time} onChange={onChange} />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
            <Button type="submit">예약 요청</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
