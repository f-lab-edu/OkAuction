export enum OrderShipping {
  Pending = 'Pending', // Temp
  Prepared = 'Prepared', // 배송 준비 Confirmed

  Shipped = 'Shipped', // 배송 중 Confirmed
  Delivered = 'Delivered', // 배송 완료 End
  Returned = 'Returned', // 반품 End
}
