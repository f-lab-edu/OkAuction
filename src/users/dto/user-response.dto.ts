export class UserResponseDto {
  // password를 제외한 사용자 정보를 반환하는 DTO
  id: number;
  u_id: string;
  u_name: string;
  u_email: string;
  u_phone: string;
  u_address: string;
  u_addr_postcode: number;
  u_address_sub: string;
}
