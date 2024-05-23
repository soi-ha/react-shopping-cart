import { act, renderHook, waitFor } from '@testing-library/react';

import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import {
  cartData,
  cartItemCheckState,
  cartItemQuantityState,
  cartQuantity,
} from './atoms';

export const mockCartItem = [
  {
    id: 111,
    quantity: 1,
    product: {
      id: 1,
      name: 'Product 1',
      price: 10000,
      imageUrl: '',
      category: 'fashion',
    },
  },
  {
    id: 222,
    quantity: 2,
    product: {
      id: 2,
      name: 'Product 2',
      price: 20000,
      imageUrl: '',
      category: 'fashion',
    },
  },
];

const mockCartQuantity = mockCartItem.reduce(
  (acc, cur) => acc + cur.quantity,
  0,
);

describe('cartData', () => {
  it('fetchCartItem API 호출을 통해 초기 장바구니 데이터를 정상적으로 불러온다.', async () => {
    const { result } = renderHook(() => useRecoilValue(cartData), {
      wrapper: ({ children }) => (
        <RecoilRoot initializeState={({ set }) => set(cartData, mockCartItem)}>
          {children}
        </RecoilRoot>
      ),
    });

    await waitFor(() => {
      expect(result.current.length).toBe(2);
    });
  });
});

describe('cartQuantity', () => {
  it('장바구니에 담긴 상품의 총 주문 수량을 정상적으로 불러온다.', async () => {
    const { result } = renderHook(() => useRecoilValue(cartQuantity), {
      wrapper: ({ children }) => (
        <RecoilRoot
          initializeState={({ set }) => set(cartQuantity, mockCartQuantity)}
        >
          {children}
        </RecoilRoot>
      ),
    });
    await waitFor(() => {
      expect(result.current).toBe(3);
    });
  });
});

describe('cartItemQuantityState', () => {
  it('개별 cartItem의 수량을 변경하면, 정상적으로 값이 업데이트 된다.', () => {
    const { result } = renderHook(() => useRecoilState(cartItemQuantityState), {
      wrapper: ({ children }) => (
        <RecoilRoot initializeState={({ set }) => set(cartData, mockCartItem)}>
          {children}
        </RecoilRoot>
      ),
    });

    const [quantity, setQuantity] = result.current;
    const cartId = 111;

    act(() => {
      const newQuantity = quantity[cartId] + 1;
      setQuantity((prev) => ({ ...prev, [cartId]: newQuantity }));
    });

    waitFor(() => {
      expect(result.current[0]).toBe(quantity[cartId] - 1);
    });
  });
});

describe('cartItemCheckState', () => {
  it('초기값이 false인지 확인한다.', async () => {
    const { result } = renderHook(
      () => useRecoilState(cartItemCheckState(111)),
      {
        wrapper: ({ children }) => (
          <RecoilRoot
            initializeState={({ set }) => set(cartItemCheckState(111), false)}
          >
            {children}
          </RecoilRoot>
        ),
      },
    );

    await waitFor(() => {
      expect(result.current[0]).toBe(false);
    });
  });
});
