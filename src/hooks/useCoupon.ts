import { useRecoilValue } from 'recoil';
import {
  calculateOrderPrice,
  checkedCartItems,
  fetchCouponList,
} from '../recoil/selectors';
import findCouponValidator from '../domain/findCouponValidator';
import findApplicableCoupons from '../domain/findApplicableCoupons';
import discountCalculator from '../domain/discountCalculator';
import { RULE } from '../constants/rule';

const useCoupon = ({ isIsland }: { isIsland: boolean }) => {
  const couponList = useRecoilValue(fetchCouponList);
  const orderList = useRecoilValue(checkedCartItems);
  const { totalOrderPrice, deliveryFee, totalPrice } =
    useRecoilValue(calculateOrderPrice);

  const { validCoupon } = findCouponValidator(couponList);

  const applicableCouponList = findApplicableCoupons({
    validCouponList: validCoupon(),
    totalPrice: totalOrderPrice,
    orderList,
  }).applicableCoupons();

  const finalDeliveryFee =
    deliveryFee === 0
      ? deliveryFee
      : isIsland
        ? deliveryFee + RULE.isLandSurcharge
        : deliveryFee;

  const finalTotalPrice = isIsland
    ? totalPrice + RULE.isLandSurcharge
    : totalPrice;

  const findBestCouponCombination = () => {
    let bestCombination: { coupons: Coupon[]; totalDiscount: number } = {
      coupons: [],
      totalDiscount: 0,
    };

    for (let i = 0; i < applicableCouponList.length; i++) {
      for (let j = i; j < applicableCouponList.length; j++) {
        const firstCoupon = applicableCouponList[i];
        const secondCoupon = applicableCouponList[j];

        const discount1 = discountCalculator({
          coupon: firstCoupon,
          totalOrderPrice: finalTotalPrice,
          orderList,
          deliveryFee: finalDeliveryFee,
        }).calculateDiscountAmount();

        const discount2 = discountCalculator({
          coupon: secondCoupon,
          totalOrderPrice: finalTotalPrice,
          orderList,
          deliveryFee: finalDeliveryFee,
        }).calculateDiscountAmount();

        const totalDiscount =
          firstCoupon === secondCoupon ? discount1! : discount1! + discount2!;

        if (totalDiscount > bestCombination.totalDiscount) {
          if (
            firstCoupon === secondCoupon &&
            applicableCouponList.length === 1
          ) {
            bestCombination = {
              coupons: [firstCoupon],
              totalDiscount: discount1!,
            };
          } else if (firstCoupon === secondCoupon) {
            continue;
          } else {
            bestCombination = {
              coupons: [firstCoupon, secondCoupon],
              totalDiscount,
            };
          }
        }
      }
    }

    return bestCombination;
  };

  const finalTotalPriceList = {
    applicableCouponList,
    totalOrderPrice: finalTotalPrice,
    discountPrice: findBestCouponCombination().totalDiscount,
    applyCoupons: findBestCouponCombination().coupons,
    deliveryFee: finalDeliveryFee,
    totalPaymentPrice:
      finalTotalPrice - findBestCouponCombination().totalDiscount,
  };

  return { applicableCouponList, finalTotalPriceList };
};

export default useCoupon;
