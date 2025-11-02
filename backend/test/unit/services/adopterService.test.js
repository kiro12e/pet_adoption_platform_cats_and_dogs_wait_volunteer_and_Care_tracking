const bcrypt = require('bcryptjs');
const { signUp, login } = require('../../../services/adopterService');
const { UserDb } = require('../../../config/user/userDatabase');
const repo = require('../../../repositories/adopterRepository');

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('../../../config/user/userDatabase');
jest.mock('../../../repositories/adopterRepository');

describe('AdopterService', () => {
  let mockConn;
  let mockPool;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock connection
    mockConn = {
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
    };

    // Setup mock pool
    mockPool = {
      getConnection: jest.fn().mockResolvedValue(mockConn)
    };

    // Setup UserDb mock
    UserDb.mockResolvedValue(mockPool);

    // Setup bcrypt mock
    bcrypt.hash.mockResolvedValue('hashedPassword123');
    bcrypt.compare.mockResolvedValue(true);
  });

  describe('signUp', () => {
    const mockPayload = {
      adopterFName: 'John',
      adopterLName: 'Doe',
      adopterEmail: 'john@example.com',
      adopterPhone: '1234567890',
      adopterPassword: 'password123',
      livingSituation: 'House',
      petExperience: ['Dogs'],
      consents: ['terms_agreed', 'receive_updates']
    };

    it('should successfully sign up a new adopter', async () => {
      // Mock repo responses
      repo.findAdopterByEmail.mockResolvedValue([]);
      repo.insertAdopter.mockResolvedValue(1);
      repo.insertAdopterProfile.mockResolvedValue();
      repo.insertAdopterConsents.mockResolvedValue();

      const result = await signUp(mockPayload);

      // Verify transaction flow
      expect(mockPool.getConnection).toHaveBeenCalled();
      expect(mockConn.beginTransaction).toHaveBeenCalled();
      expect(mockConn.commit).toHaveBeenCalled();
      expect(mockConn.release).toHaveBeenCalled();

      // Verify bcrypt usage
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

      // Verify repository calls
      expect(repo.findAdopterByEmail).toHaveBeenCalledWith(mockConn, 'john@example.com');
      expect(repo.insertAdopter).toHaveBeenCalledWith(
        mockConn,
        'John',
        'Doe',
        'john@example.com',
        '1234567890',
        'hashedPassword123'
      );

      // Verify result
      expect(result).toEqual({ adopterId: 1 });
    });

    it('should throw error if email exists', async () => {
      repo.findAdopterByEmail.mockResolvedValue([{ id: 1 }]);

      await expect(signUp(mockPayload)).rejects.toThrow('Email already in use');

      expect(mockConn.rollback).toHaveBeenCalled();
      expect(mockConn.release).toHaveBeenCalled();
    });

    it('should handle transaction failure', async () => {
      repo.findAdopterByEmail.mockResolvedValue([]);
      repo.insertAdopter.mockRejectedValue(new Error('DB Error'));

      await expect(signUp(mockPayload)).rejects.toThrow('DB Error');

      expect(mockConn.rollback).toHaveBeenCalled();
      expect(mockConn.release).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const mockCredentials = {
      adopterEmail: 'john@example.com',
      adopterPassword: 'password123'
    };

    it('should successfully login with valid credentials', async () => {
      const mockUser = {
        id: 1,
        password: 'hashedPassword123',
        first_name: 'John',
        last_name: 'Doe'
      };

      repo.findAdopterByEmail.mockResolvedValue([mockUser]);
      bcrypt.compare.mockResolvedValue(true);

      const result = await login(mockCredentials);

      expect(repo.findAdopterByEmail).toHaveBeenCalledWith(mockPool, 'john@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(result).toEqual({
        adopterId: 1,
        name: 'John Doe'
      });
    });

    it('should throw error for non-existent email', async () => {
      repo.findAdopterByEmail.mockResolvedValue([]);

      await expect(login(mockCredentials))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw error for wrong password', async () => {
      const mockUser = {
        id: 1,
        password: 'hashedPassword123',
        first_name: 'John',
        last_name: 'Doe'
      };

      repo.findAdopterByEmail.mockResolvedValue([mockUser]);
      bcrypt.compare.mockResolvedValue(false);

      await expect(login(mockCredentials))
        .rejects.toThrow('Invalid credentials');
    });
  });
});