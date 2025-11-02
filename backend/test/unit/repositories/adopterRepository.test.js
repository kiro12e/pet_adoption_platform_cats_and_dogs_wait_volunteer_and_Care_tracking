const { findAdopterByEmail, insertAdopter, insertAdopterProfile, insertAdopterConsents } = require('../../../repositories/adopterRepository');

// Mock the MySQL connection/pool
const mockExecute = jest.fn();
const mockRelease = jest.fn();
const mockGetConnection = jest.fn();

const mockPool = {
  execute: mockExecute,
  getConnection: mockGetConnection.mockResolvedValue({
    execute: mockExecute,
    release: mockRelease
  })
};

const mockConn = {
  execute: mockExecute,
  release: mockRelease
};

describe('AdopterRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAdopterByEmail', () => {
    it('should find adopter by email using connection', async () => {
      const mockRows = [{ id: 1, first_name: 'John', last_name: 'Doe' }];
      mockExecute.mockResolvedValueOnce([mockRows]);

      const result = await findAdopterByEmail(mockConn, 'john@example.com');

      expect(mockExecute).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['john@example.com']
      );
      expect(result).toEqual(mockRows);
    });

    it('should find adopter by email using pool', async () => {
      const mockRows = [{ id: 1, first_name: 'John', last_name: 'Doe' }];
      mockExecute.mockResolvedValueOnce([mockRows]);

      const result = await findAdopterByEmail(mockPool, 'john@example.com');

      expect(mockGetConnection).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['john@example.com']
      );
      expect(mockRelease).toHaveBeenCalled();
      expect(result).toEqual(mockRows);
    });
  });

  describe('insertAdopter', () => {
    it('should insert adopter and return insertId', async () => {
      mockExecute.mockResolvedValueOnce([{ insertId: 1 }]);

      const result = await insertAdopter(
        mockConn,
        'John',
        'Doe',
        'john@example.com',
        '1234567890',
        'hashedpwd123'
      );

      expect(mockExecute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO adopters'),
        ['John', 'Doe', 'john@example.com', '1234567890', 'hashedpwd123']
      );
      expect(result).toBe(1);
    });

    it('should handle null phone number', async () => {
      mockExecute.mockResolvedValueOnce([{ insertId: 1 }]);

      await insertAdopter(
        mockConn,
        'John',
        'Doe',
        'john@example.com',
        null,
        'hashedpwd123'
      );

      expect(mockExecute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO adopters'),
        ['John', 'Doe', 'john@example.com', null, 'hashedpwd123']
      );
    });
  });

  describe('insertAdopterProfile', () => {
    it('should insert adopter profile', async () => {
      mockExecute.mockResolvedValueOnce([{}]);

      await insertAdopterProfile(mockConn, 1, 'House', 'Dogs');

      expect(mockExecute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO adopter_profile'),
        [1, 'House', 'Dogs']
      );
    });

    it('should handle null living situation', async () => {
      mockExecute.mockResolvedValueOnce([{}]);

      await insertAdopterProfile(mockConn, 1, null, 'Cats');

      expect(mockExecute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO adopter_profile'),
        [1, null, 'Cats']
      );
    });
  });

  describe('insertAdopterConsents', () => {
    it('should insert adopter consents', async () => {
      mockExecute.mockResolvedValueOnce([{}]);

      await insertAdopterConsents(mockConn, 1, 1, 0, 1);

      expect(mockExecute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO adopter_consents'),
        [1, 1, 0, 1]
      );
    });
  });
});