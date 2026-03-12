const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Event = require('./models/Event');
const Announcement = require('./models/Announcement');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@mgmcollege.edu.in' });
    if (!adminExists) {
      await User.create({
        name: 'MGM Administrator',
        email: 'admin@mgmcollege.edu.in',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Admin created: admin@mgmcollege.edu.in / admin123');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    // Create sample student
    const studentExists = await User.findOne({ rollNumber: '22BCA001' });
    if (!studentExists) {
      await User.create({
        name: 'Ravi Kumar',
        email: 'ravi@student.mgm.edu.in',
        password: 'student123',
        role: 'student',
        rollNumber: '22BCA001',
        course: 'BCA',
        year: 3,
      });
      console.log('✅ Student created: Roll 22BCA001 / student123');
    }

    // Create sample events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.insertMany([
        { title: 'Elixir 2K25', slug: 'elixir-2k25', description: 'Annual cultural festival', date: new Date('2025-02-14'), category: 'cultural', location: 'MGM Campus' },
        { title: 'Spectrum 2K24', slug: 'spectrum-2k24', description: 'Science and arts extravaganza', date: new Date('2024-02-20'), category: 'cultural', location: 'MGM Campus' },
        { title: 'Cluster 2K25', slug: 'cluster-2k25', description: 'Inter-college academic competition', date: new Date('2025-01-15'), category: 'academic', location: 'MGM Campus' },
      ]);
      console.log('✅ Sample events created');
    }

    // Create sample announcement
    const annCount = await Announcement.countDocuments();
    if (annCount === 0) {
      await Announcement.create({
        text: 'SSP Account Creation link',
        link: 'https://ssp.postmatric.karnataka.gov.in/CA/',
        linkText: 'ssp.postmatric.karnataka.gov.in/CA/',
        isActive: true,
      });
      console.log('✅ Sample announcement created');
    }

    console.log('\n🎉 Seed complete!');
    console.log('Admin Login: admin@mgmcollege.edu.in / admin123');
    console.log('Student Login: Roll 22BCA001 / student123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
