// app/api/userStatus/approve/route.js
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Add your MongoDB URI to .env.local
const client = new MongoClient(uri);

// Default permissions for each category
const DEFAULT_PERMISSIONS = {
  student: {
    manageUsers: false,
    bookPeerToPeer: true,
    manageEvents: false,
    manageContent: false,
    viewProgress: true,
    scheduleSessions: true,
    accessIlluminaiConnect: true,
    accessPeerConnect: true,
    participateInChallenges: true,
    viewLeaderboard: true,
    receiveNotifications: true,
    managePlacements: false,
  },
  EC: {
    manageUsers: false,
    bookPeerToPeer: true,
    manageEvents: true,
    manageContent: true,
    viewProgress: true,
    scheduleSessions: true,
    accessIlluminaiConnect: true,
    accessPeerConnect: true,
    participateInChallenges: true,
    viewLeaderboard: true,
    receiveNotifications: true,
    managePlacements: false,
  },
  admin: {
    manageUsers: true,
    bookPeerToPeer: true,
    manageEvents: true,
    manageContent: true,
    viewProgress: true,
    scheduleSessions: true,
    accessIlluminaiConnect: true,
    accessPeerConnect: true,
    participateInChallenges: true,
    viewLeaderboard: true,
    receiveNotifications: true,
    managePlacements: true,
  },
};

// GET all users
// GET users with optional filtering
export async function GET(request) {
    try {
      const { searchParams } = new URL(request.url);
      const filter = searchParams.get('filter'); // Get the filter query parameter
  
      await client.connect();
      const database = client.db('LEVEL_UP');
      const collection = database.collection('all_users');
  
      let query = {};
      if (filter === 'pending') {
        query = { status: 'pending' }; // Fetch only pending users
      } else if (filter === 'done') {
        query = { status: 'approved' }; // Fetch only approved users
      } else if (filter === 'ec') {
        query = { category: 'EC' }; // Fetch only EC users
      } else if (filter === 'admin') {
        query = { category: 'admin' }; // Fetch only admin users
      } else if (filter === 'students') {
        query = { category: 'student' }; // Fetch only students
      } else if (filter === 'instructors') {
        query = { category: 'instructor' }; // Fetch only instructors
      } else if (filter === 'others') {
        query = { category: { $nin: ['student', 'EC', 'admin', 'instructor'] } }; // Fetch users in other categories
      }
      // For 'all', no filter is applied (fetch all users)
  
      const users = await collection.find(query).toArray();
      return NextResponse.json(users);
    } catch (error) {
      return NextResponse.json(
        { message: 'Failed to fetch users', error: error.message },
        { status: 500 }
      );
    } finally {
      await client.close();
    }
  }

// Update user status (approve/block) and assign category with permissions
export async function POST(request) {
  try {
    const { email, status, category, customPermissions } = await request.json();

    await client.connect();
    const database = client.db('LEVEL_UP');
    const collection = database.collection('all_users');

    // Get default permissions for the category
    const defaultPermissions = DEFAULT_PERMISSIONS[category] || {};

    // Merge default permissions with custom permissions (if provided)
    const permissions = customPermissions
      ? { ...defaultPermissions, ...customPermissions }
      : defaultPermissions;

    const update = {
      $set: {
        approved: status === 'approved',
        status,
        category,
        permissions,
      },
    };

    const result = await collection.updateOne({ email }, update);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'User status updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update user status', error: error.message },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}