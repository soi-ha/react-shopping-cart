import { useRecoilValue } from 'recoil';
import { calculateOrderPrice, checkedCartItems } from '../recoil/selectors';

import Header from '../components/Header/Header';
import { FloatingButton } from '../components/Button';
import * as PC from './PaymentConfirmPage.style';

export default function PaymentConfirmPage() {
  const orderProduct = useRecoilValue(checkedCartItems);
  const cartTotalCount = orderProduct.reduce(
    (acc, cartItem) => acc + cartItem.quantity,
    0,
  );
  const cartCount = orderProduct.length;
  const { totalPrice } = useRecoilValue(calculateOrderPrice);

  return (
    <div id="payment-confirm-page">
      <Header />
      <PC.PaymentConfirmPageStyle>
        <PC.Title>주문 확인</PC.Title>
        <PC.SubTitle>
          총 {cartCount} 종류의 상품 {cartTotalCount}개를 주문합니다.
        </PC.SubTitle>
        <PC.SubTitle>최종 결제 금액을 확인해 주세요.</PC.SubTitle>
        <PC.TotalPriceLabel>총 결제 금액</PC.TotalPriceLabel>
        <PC.TotalPrice>{totalPrice.toLocaleString('ko-kr')}원</PC.TotalPrice>
      </PC.PaymentConfirmPageStyle>
      <FloatingButton text="결제하기" disabled />
    </div>
  );
}
