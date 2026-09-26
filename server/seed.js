import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import { User } from './models/User.model.js';
import { Project } from './models/Project.model.js';
import { Milestone } from './models/Milestone.model.js';
import { Proposal } from './models/Proposal.model.js';
import { Submission } from './models/Submission.model.js';
import { Transaction } from './models/Transaction.model.js';
import { Message } from './models/Message.model.js';
import { Notification } from './models/Notification.model.js';
import { Dispute } from './models/Dispute.model.js';
import { Review } from './models/Review.model.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas for seeding...');

    // Clear existing
    await User.deleteMany({});
    await Project.deleteMany({});
    await Milestone.deleteMany({});
    await Proposal.deleteMany({});
    await Submission.deleteMany({});
    await Transaction.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    await Dispute.deleteMany({});
    await Review.deleteMany({});

    console.log('🧹 Cleared old collections');

    // 1. Create Users
    const client1 = await User.create({
      name: 'Aditi Sharma',
      email: 'client@flow.com',
      password: 'password123',
      role: 'client',
      title: 'Product Director @ Epicurean',
      bio: 'Managing digital culinary brands and restaurant platforms across India.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      wallet: { balance: 45000, escrow: 15000 },
      isVerified: true,
      ratings: { avg: 4.9, count: 8 },
    });

    const freelancer1 = await User.create({
      name: 'Rohan Mehta',
      email: 'freelancer@flow.com',
      password: 'password123',
      role: 'freelancer',
      title: 'Senior Full Stack & React Specialist',
      bio: '5+ years crafting high-performance web apps, interactive UIs, and robust Node.js APIs.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      skills: ['React.js', 'Node.js', 'Tailwind CSS', 'MongoDB', 'Socket.IO', 'Express.js'],
      hourlyRate: 850,
      wallet: { balance: 18000, escrow: 0 },
      isVerified: true,
      ratings: { avg: 4.95, count: 14 },
      portfolio: [
        {
          title: 'QuickDine - Restaurant POS & Web Portal',
          description: 'Live order tracking with websocket notifications and table reservations.',
          link: 'https://quickdine.demo.app',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
        },
        {
          title: 'CryptoPulse Trading Dashboard',
          description: 'Dark-themed live chart analytics with glassmorphic cards.',
          link: 'https://cryptopulse.demo.app',
          image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
        },
      ],
    });

    const freelancer2 = await User.create({
      name: 'Ananya Verma',
      email: 'ananya@flow.com',
      password: 'password123',
      role: 'freelancer',
      title: 'UI/UX Designer & Frontend Engineer',
      bio: 'Obsessed with micro-interactions, accessibility, and modern glassmorphism web design.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      skills: ['Figma', 'UI/UX Design', 'React.js', 'Tailwind CSS', 'Next.js'],
      hourlyRate: 700,
      wallet: { balance: 12500, escrow: 0 },
      isVerified: true,
      ratings: { avg: 4.8, count: 9 },
    });

    const adminUser = await User.create({
      name: 'Vikram Rajput (Admin)',
      email: 'admin@flow.com',
      password: 'password123',
      role: 'admin',
      title: 'Platform Administrator',
      bio: 'Managing platform governance, dispute resolution, and security.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      wallet: { balance: 100000, escrow: 0 },
      isVerified: true,
    });

    // 2. Create Active Milestone Project (Restaurant Web App)
    const project1 = await Project.create({
      title: 'Modern Restaurant Ordering & Reservation Portal',
      description:
        'We require an ultra-modern, responsive restaurant website with table reservation system, interactive food menu with dish customizations, and simulated online checkout. Built through 4 clear milestones.',
      category: 'Web Development',
      clientId: client1._id,
      freelancerId: freelancer1._id,
      budget: 15000,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      skills: ['React.js', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Socket.IO'],
      status: 'ACTIVE',
      progress: 50,
      milestoneCount: 4,
      completedMilestones: 2,
    });

    // Milestones for Project 1
    const m1 = await Milestone.create({
      projectId: project1._id,
      title: 'Milestone 1: UI/UX High-Fidelity Prototypes & Design System',
      description: 'Design dark glassmorphism layouts for Homepage, Menu, Table Booking, and Cart in Figma.',
      amount: 3000,
      deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      order: 1,
      status: 'APPROVED',
      submissionCount: 1,
      approvedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    });

    const m2 = await Milestone.create({
      projectId: project1._id,
      title: 'Milestone 2: Frontend Implementation & Responsive Views',
      description: 'Develop all React pages, menu filtering, cart modal, and animations with Tailwind CSS.',
      amount: 5000,
      deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      order: 2,
      status: 'APPROVED',
      submissionCount: 2,
      approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    const m3 = await Milestone.create({
      projectId: project1._id,
      title: 'Milestone 3: Backend REST APIs & Reservation Logic',
      description: 'Implement Express endpoints for table bookings, menu catalog, and JWT authentication.',
      amount: 5000,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      order: 3,
      status: 'SUBMITTED', // currently submitted, awaiting client review!
      submissionCount: 1,
    });

    const m4 = await Milestone.create({
      projectId: project1._id,
      title: 'Milestone 4: Testing, Performance Optimization & Live Deployment',
      description: 'End-to-end testing, Core Web Vitals optimization, and live deployment on cloud.',
      amount: 2000,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      order: 4,
      status: 'PENDING',
      submissionCount: 0,
    });

    // Submissions for Project 1
    await Submission.create({
      milestoneId: m1._id,
      projectId: project1._id,
      freelancerId: freelancer1._id,
      submissionNumber: 1,
      description: 'Completed Figma prototypes with interactive component variants and responsive mobile frames.',
      demoLink: 'https://figma.com/file/demo-restaurant-design',
      status: 'APPROVED',
      clientFeedback: 'Stunning visual direction! Glassmorphism aesthetic is spot on.',
    });

    await Submission.create({
      milestoneId: m2._id,
      projectId: project1._id,
      freelancerId: freelancer1._id,
      submissionNumber: 1,
      description: 'Initial React build with menu filter.',
      demoLink: 'https://preview-v1.restaurant.app',
      status: 'REVISION_REQUESTED',
      clientFeedback: 'Cart drawer needs smooth slide animation and mobile table booking date picker fix.',
    });

    await Submission.create({
      milestoneId: m2._id,
      projectId: project1._id,
      freelancerId: freelancer1._id,
      submissionNumber: 2,
      description: 'Updated with smooth Framer Motion spring drawer animations and cross-browser datepicker.',
      demoLink: 'https://preview-v2.restaurant.app',
      status: 'APPROVED',
      clientFeedback: 'Approved! Looks amazing and animations are silky smooth.',
    });

    await Submission.create({
      milestoneId: m3._id,
      projectId: project1._id,
      freelancerId: freelancer1._id,
      submissionNumber: 1,
      description: 'Backend API completed with table reservation slots, conflict check, and JWT auth routes.',
      demoLink: 'https://api-restaurant-demo.onrender.com/api/health',
      status: 'PENDING',
    });

    // Transactions for Project 1
    await Transaction.create({
      from: client1._id,
      type: 'ESCROW_LOCK',
      amount: 15000,
      projectId: project1._id,
      description: 'Escrow locked for 4 milestones on "Modern Restaurant Ordering & Reservation Portal"',
    });

    await Transaction.create({
      from: client1._id,
      to: freelancer1._id,
      type: 'MILESTONE_RELEASE',
      amount: 3000,
      milestoneId: m1._id,
      projectId: project1._id,
      description: 'Payment released for Milestone 1: "UI/UX High-Fidelity Prototypes"',
    });

    await Transaction.create({
      from: client1._id,
      to: freelancer1._id,
      type: 'MILESTONE_RELEASE',
      amount: 5000,
      milestoneId: m2._id,
      projectId: project1._id,
      description: 'Payment released for Milestone 2: "Frontend Implementation & Responsive Views"',
    });

    // 3. Create Open Projects for Freelancers to browse and bid
    const project2 = await Project.create({
      title: 'AI-Powered Resume Builder with Glassmorphic Dashboard',
      description:
        'Seeking an experienced developer to build a full-stack SaaS platform that allows job seekers to generate ATS-friendly resumes using AI prompts. Needs export to PDF, live live preview, and subscription tiers.',
      category: 'AI & SaaS',
      clientId: client1._id,
      budget: 35000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      skills: ['React.js', 'OpenAI API', 'Tailwind CSS', 'Node.js', 'MongoDB'],
      status: 'OPEN',
      milestoneCount: 0,
      completedMilestones: 0,
    });

    const project3 = await Project.create({
      title: 'Fintech Mobile Banking Web App & Crypto Wallet Tracker',
      description:
        'Build a real-time cryptocurrency and fiat wallet tracker with simulated transactions, live candlesticks, and portfolio rebalancing alerts.',
      category: 'Fintech',
      clientId: client1._id,
      budget: 28000,
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      skills: ['React.js', 'Chart.js', 'WebSockets', 'Express.js', 'MongoDB'],
      status: 'OPEN',
      milestoneCount: 0,
      completedMilestones: 0,
    });

    // Proposal on Open Project
    await Proposal.create({
      projectId: project2._id,
      freelancerId: freelancer2._id,
      bidAmount: 32000,
      deliveryDays: 20,
      coverLetter:
        'Hello Aditi! I have built 3 similar SaaS tools with dynamic PDF generators and clean glassmorphism UI. I propose dividing this into 4 milestones: 1) Wireframes & Architecture, 2) AI Prompt Engine & JSON Schema, 3) PDF Export & React UI, 4) Testing & Stripe setup.',
      status: 'PENDING',
    });

    // Messages on Project 1
    await Message.create({
      projectId: project1._id,
      senderId: client1._id,
      receiverId: freelancer1._id,
      text: 'Hi Rohan! Really impressed with the Milestone 2 delivery. How is Milestone 3 backend coming along?',
    });

    await Message.create({
      projectId: project1._id,
      senderId: freelancer1._id,
      receiverId: client1._id,
      text: 'Hi Aditi! Just submitted Milestone 3 with all reservation endpoints and live demo link for testing.',
    });

    // Review on previous completed collaboration
    await Review.create({
      projectId: project1._id,
      reviewerId: client1._id,
      revieweeId: freelancer1._id,
      rating: 5,
      comment: 'Exceptional communication and high quality code! Delivered ahead of deadline.',
    });

    console.log('✅ Sample Data Seeded Successfully!');
    console.log('\n--- DEMO ACCOUNTS ---');
    console.log('1. Client:      client@flow.com     | password123');
    console.log('2. Freelancer:  freelancer@flow.com | password123');
    console.log('3. Designer:    ananya@flow.com     | password123');
    console.log('4. Admin:       admin@flow.com      | password123');
    console.log('---------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
