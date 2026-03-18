/**
 * Database seeding script
 * Run with: node src/seeds/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Badge = require('../models/Badge');
const User = require('../models/User');
const Event = require('../models/Event');

const badges = [
  {
    key: 'first_resource',
    title: 'Resource Creator',
    description: 'Created your first resource',
    criteria: [{ type: 'resource_created', minCount: 1 }]
  },
  {
    key: 'first_lesson',
    title: 'Lesson Planner',
    description: 'Created your first lesson plan',
    criteria: [{ type: 'lesson_created', minCount: 1 }]
  },
  {
    key: 'resource_remixer',
    title: 'Remixer',
    description: 'Remixed 5 resources',
    criteria: [{ type: 'resource_remixed', minCount: 5 }]
  },
  {
    key: 'collaboration_pro',
    title: 'Collaboration Pro',
    description: 'Participated in 10 collaborative sessions',
    criteria: [{ type: 'collaboration', minCount: 10 }]
  },
  {
    key: 'level_10',
    title: 'Level 10',
    description: 'Reached level 10 in gamification',
    criteria: [{ type: 'level_reached', level: 10 }]
  },
  {
    key: 'verified_teacher',
    title: 'Verified Teacher',
    description: 'School verified your teaching status',
    criteria: [{ type: 'teacher_verified' }]
  },
  {
    key: 'super_contributor',
    title: 'Super Contributor',
    description: 'Created 20 resources',
    criteria: [{ type: 'resource_created', minCount: 20 }]
  },
  {
    key: 'event_organizer',
    title: 'Event Organizer',
    description: 'Organized a professional development event',
    criteria: [{ type: 'event_organized' }]
  }
];

async function seedDatabase() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/teachnexus';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clear existing badges
    await Badge.deleteMany({});
    console.log('Cleared existing badges');

    // Insert new badges
    const inserted = await Badge.insertMany(badges);
    console.log(`Inserted ${inserted.length} badges`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seedDatabase();
