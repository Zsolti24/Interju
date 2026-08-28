import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.restaurant.findMany();
  }

  async findOne(id: number) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: { menuItems: true },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }
}
