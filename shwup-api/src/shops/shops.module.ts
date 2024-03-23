import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import {
  DisapproveShop,
  FollowShopController,
  ShopsController,
  StaffsController,
  TopShopsController,
  FollowedShops,
  NearByShopController,
  NewShopsController,
  DisapproveShopController,
  ApproveShopController,
} from './shops.controller';

@Module({
  controllers: [
    ShopsController,
    StaffsController,
    TopShopsController,
    DisapproveShop,
    FollowShopController,
    FollowedShops,
    DisapproveShopController,
    ApproveShopController,
    NearByShopController,
    NewShopsController,
  ],
  providers: [ShopsService],
})
export class ShopsModule {}
