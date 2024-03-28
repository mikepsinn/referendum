const { PrismaClient } = require('@prisma/client');
const {expect, describe, test} = require("@jest/globals");
const prisma = new PrismaClient();

describe('User functionality', () => {
  test('Create a new user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        // Add other required fields based on your schema
      },
    });
    expect(user.email).toBe('test@example.com');
    // Clean up if necessary
    await prisma.user.delete({ where: { email: 'test@example.com' } });
  });

  test('Retrieve a user', async () => {
    const user = await prisma.user.findUnique({
      where: {
        email: 'test@example.com',
      },
    });
    expect(user.email).toBe('test@example.com');
  });

  test('Update a user', async () => {
    const updatedUser = await prisma.user.update({
      where: { email: 'test@example.com' },
      data: { name: 'Updated Test User' },
    });
    expect(updatedUser.name).toBe('Updated Test User');
  });

  test('Delete a user', async () => {
    await prisma.user.delete({ where: { email: 'test@example.com' } });
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });
    expect(user).toBeNull();
  });
});
describe('Session management unit tests', () => {
  test('Create and delete a session', async () => {
    // Delete any existing user with the same email
    await prisma.user.deleteMany({
      where: {
        email: 'test@example.com',
      },
    });

    // Create a new user for the session
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    // Create a session linked to the user
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        sessionToken: 'randomSessionTokenString', // Added as per instruction
      },
    });

    // Verify the session has been created with the correct properties
    expect(session).toHaveProperty('id');
    expect(session).toHaveProperty('userId', user.id);
    expect(new Date(session.expires).getTime()).toBeGreaterThan(new Date().getTime());

    // Clean up: delete the session and the user
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  });
});