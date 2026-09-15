import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/global_student_connect';

const originalAccounts = [
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@student.edu',
    password: 'Password123!',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    age: 21,
    gradeLevel: 'Undergraduate - 3rd Year',
    bio: 'Computer science major specializing in artificial intelligence and web technologies. Passionate about cross-cultural academic collaboration, hackathons, and learning new languages.',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    languages: ['English', 'German', 'French'],
    interests: ['Artificial Intelligence', 'Web Development', 'System Architecture', 'Cultural Exchange'],
    isProfileComplete: true,
  },
  {
    name: 'Kenji Takahashi',
    email: 'kenji.takahashi@student.edu',
    password: 'Password123!',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    age: 22,
    gradeLevel: 'Undergraduate - 4th Year',
    bio: 'Software engineering student passionate about distributed systems, robotics, and interactive UI design. Looking forward to meeting international peers for study sessions and language exchange.',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    languages: ['Japanese', 'English'],
    interests: ['Software Engineering', 'Robotics', 'Web Development', 'Cultural Exchange'],
    isProfileComplete: true,
  },
];

async function resetAndSeed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    const dbName = mongoose.connection.name;
    console.log(`Connected successfully to database: "${dbName}"`);

    // 1. Fetch all collections in the current database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Found ${collections.length} collection(s) in "${dbName}":`);

    // 2. Remove all documents from all collections to completely wipe previous data
    for (const col of collections) {
      const deleteResult = await mongoose.connection.db.collection(col.name).deleteMany({});
      console.log(` - Cleared collection "${col.name}" (${deleteResult.deletedCount} documents removed)`);
    }

    // 3. Insert the two original student accounts through Mongoose Model
    // (This triggers userSchema.pre('save') which securely hashes passwords with bcrypt)
    console.log('\nCreating 2 original student accounts...');
    const createdUsers = [];
    for (const account of originalAccounts) {
      const user = await User.create(account);
      createdUsers.push(user);
      console.log(` ✓ Created User: ${user.name} <${user.email}> (ID: ${user._id})`);
    }

    // 4. Verify password authentication works for both accounts
    console.log('\nVerifying authentication credentials:');
    for (const user of createdUsers) {
      const isMatch = await user.comparePassword('Password123!');
      console.log(` - ${user.email} password verification: ${isMatch ? 'PASSED ✓' : 'FAILED ✗'}`);
    }

    // 5. Seed authentic initial reflections for Elena and Kenji
    const Reflection = (await import('../src/modules/matching-scheduling/models/Reflection.js')).default;
    console.log('\nSeeding authentic reflections...');
    await Reflection.create([
      {
        userId: createdUsers[0]._id, // Elena
        title: 'Distributed Robotics, Web Architecture & Student Life in Tokyo',
        partnerName: 'Kenji Takahashi',
        partnerCountry: 'Japan',
        duration: '45 mins',
        tags: ['Robotics', 'WebArchitecture', 'CrossCultural', 'TechExchange'],
        culturalExchangeNotes: 'Kenji shared how students at Tokyo Institute of Technology collaborate in formal technical circles to build autonomous robotics hardware and microservices.',
        learnings: 'Cross-cultural pairing bridges theoretical computer science with hardware engineering, inspiring deeper international collaboration.',
        rating: 5,
      },
      {
        userId: createdUsers[1]._id, // Kenji
        title: 'Renewable Tech, Distributed Systems & Campus Life in Munich',
        partnerName: 'Elena Rostova',
        partnerCountry: 'Germany',
        duration: '45 mins',
        tags: ['DistributedSystems', 'Sustainability', 'CrossCultural', 'TechExchange'],
        culturalExchangeNotes: 'Elena shared how engineering students in Munich collaborate on sustainable distributed energy grids and international research initiatives.',
        learnings: 'Exchanging perspectives on clean tech and European computer science research expanded our technical horizons.',
        rating: 5,
      },
    ]);
    console.log(' ✓ Created authentic reflections for Elena Rostova and Kenji Takahashi');

    // 6. Seed connected match between Elena and Kenji
    const Match = (await import('../models/Match.js')).default;
    await Match.create({
      requesterId: createdUsers[0]._id,
      receiverId: createdUsers[1]._id,
      status: 'accepted',
      compatibilityScore: 95,
      sharedInterests: ['Web Development', 'Cultural Exchange'],
    });
    console.log(' ✓ Created accepted match connection between Elena and Kenji');

    // 7. Final count check in DB
    const finalUserCount = await User.countDocuments();
    const finalReflectionCount = await Reflection.countDocuments();
    console.log(`\nFinal user count in database "${dbName}": ${finalUserCount}`);
    console.log(`Final reflection count in database "${dbName}": ${finalReflectionCount}`);

    console.log('\n=============================================');
    console.log(' DATABASE RESET & SEED COMPLETED SUCCESSFULLY');
    console.log('=============================================');
    console.log('Two original student accounts available:');
    createdUsers.forEach((u, i) => {
      console.log(`\nAccount #${i + 1}:`);
      console.log(` Name:     ${u.name}`);
      console.log(` Email:    ${u.email}`);
      console.log(` Password: Password123!`);
      console.log(` Country:  ${u.country} (${u.timezone})`);
      console.log(` College:  ${u.gradeLevel}`);
      console.log(` DB _id:   ${u._id}`);
    });
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error during reset and seed:', error);
    process.exit(1);
  }
}

resetAndSeed();
