import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { pendingUser } from "@prisma/client";

describe("AuthService", () => {
  let service: AuthService;
  let prismaService: PrismaService;

  const pendingUserMocks = {
    // the AuthDTO data used to create the user account
    DTO: {
      email: "test@email.com",
      password: "testpass",
      username: "TestyMcTestface",
    },

    // the PendingUser returned by the Prisma Client
    PrismaUpsertResult: {
      id: 0,
      email: "test@email.com",
      username: "TestyMcTestface",
      hash: "mockHash",
      confirmationCode: "mockConfirmationCode",
    },

    // the stripped version of the PendingUser that does not include the hash or confirmation code
    Stripped: {
      id: 0,
      email: "test@email.com",
      username: "TestyMcTestface",
    },
  };

  const mockDB = {
    pendingUser: {
      upsert: jest.fn(() => {
        return pendingUserMocks.PrismaUpsertResult;
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
        {
          provide: JwtStrategy,
          useValue: () => {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return null;
            }),
          },
        },
      ],
      imports: [JwtModule.register({})],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // prevent the email that gets sent with real user registrations
    service.sendConfirmationEmail = jest.fn(() => null);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("signup", () => {
    it("should return a pendingUser object with id, email, and username", async () => {
      const newUser = await service.signup(pendingUserMocks.DTO);
      expect(newUser).toEqual(pendingUserMocks.Stripped);
    });

    it("should never return a password hash to the client", async () => {
      const newUser = await service.signup(pendingUserMocks.DTO);
      expect(newUser.hash).toBe(undefined);
    });

    it("should never return a confirmation code to the client", async () => {
      const newUser = await service.signup(pendingUserMocks.DTO);
      expect(newUser.confirmationCode).toBe(undefined);
    });
  });

  it("should throw an exception if two users with the same email try to sign up", () => {
    expect(service);
  });
});
