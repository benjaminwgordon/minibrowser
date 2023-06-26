import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { pendingUser } from "@prisma/client";
import { AuthDTO } from "./dto/auth.dto";

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
      username: "testymctestface",
      hash: "mockHash",
      confirmationCode: "mockConfirmationCode",
    },

    // the stripped version of the PendingUser that does not include the hash or confirmation code
    Stripped: {
      id: 0,
      email: "test@email.com",
      username: "testymctestface",
    },
  };

  type pendingUserUpsertArgs = {
    where: {
      email: string;
    };
    update: {
      confirmationCode: any;
      hash: string;
    };
    create: {
      email: string;
      username: string;
      hash: string;
      confirmationCode: any;
    };
  };

  const mockDB = {
    pendingUser: {
      // replace pending user upserts with a mock that only cares about email and usernames for checking behavior when a uniqueness constraint would be violated
      upsert: jest.fn((args: pendingUserUpsertArgs): pendingUser => {
        return {
          id: 0,
          email: args.where.email,
          username: args.create.username,
          hash: args.create.hash,
          confirmationCode: args.create.confirmationCode,
        };
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

  it("email addresses should not be case sensitive", async () => {
    // sign up user with lowercase email address
    const user1 = await service.signup({
      email: "casesensitiveemail@gmail.com",
      password: "fakePassword1",
      username: "username1",
    });
    // sign up user with uppercase email address
    const user2 = await service.signup({
      email: "CASESENSITIVEEMAIL@gmail.com",
      password: "fakePassword1",
      username: "username2",
    });
    expect(user1.email).toEqual(user2.email);
  });

  it("usernames should not be case sensitive", async () => {
    // sign up user with lowercase username
    const user1 = await service.signup({
      email: "casesensitiveemail@gmail.com",
      password: "fakePassword1",
      username: "username1",
    });
    // sign up user with uppercase username
    const user2 = await service.signup({
      email: "CASESENSITIVEEMAIL@gmail.com",
      password: "fakePassword1",
      username: "USERNAME1",
    });
    expect(user1.username).toEqual(user2.username);
  });
});
