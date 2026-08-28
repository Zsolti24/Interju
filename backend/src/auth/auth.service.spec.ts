import { Test } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: { user: { findUnique: jest.Mock; create: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(() => 'signed-token') },
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  it('throws a conflict when the email is already registered', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'existing@test.com',
    });

    await expect(
      authService.register({
        name: 'Test',
        email: 'existing@test.com',
        password: 'password123',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('rejects login with an invalid password', async () => {
    const hashed = await bcrypt.hash('correct-password', 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'Test',
      email: 'test@test.com',
      password: hashed,
    });

    await expect(
      authService.login({ email: 'test@test.com', password: 'wrong-password' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
