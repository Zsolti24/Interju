import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();

  await prisma.restaurant.create({
    data: {
      name: 'Balkan Burek House',
      description: 'Vojvodina-style burek',
      menuItems: {
        create: [
          { name: 'Meat Burek', description: 'With minced beef', price: 1590 },
          { name: 'Cheese Burek', description: 'With sirene cheese', price: 1490 },
          { name: 'Spinach Burek', description: 'With spinach and cheese', price: 1550 },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      name: 'Gulyas House',
      description: 'Traditional Hungarian food',
      menuItems: {
        create: [
          { name: 'Gulyas', description: 'Beef, paprika, potatoes', price: 1990 },
          { name: 'Chicken Paprikash', description: 'With nokedli', price: 2390 },
          { name: 'Langos', description: 'With sour cream and cheese', price: 1490 },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      name: 'Pizza Corner',
      description: 'Wood-fired pizza',
      menuItems: {
        create: [
          { name: 'Margherita', description: 'Tomato, mozzarella, basil', price: 2490 },
          { name: 'Pepperoni', description: 'Tomato, mozzarella, pepperoni', price: 2890 },
          { name: 'Quattro Formaggi', description: 'Four cheese blend', price: 2990 },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
