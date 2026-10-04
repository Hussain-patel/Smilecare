const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');
const GalleryItem = require('../models/GalleryItem');
const BeforeAfter = require('../models/BeforeAfter');
const Equipment = require('../models/Equipment');
const FAQ = require('../models/FAQ');
const ClinicSetting = require('../models/ClinicSetting');

const seedAllData = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding for SmileCare...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Service.deleteMany({}),
      Appointment.deleteMany({}),
      Review.deleteMany({}),
      GalleryItem.deleteMany({}),
      BeforeAfter.deleteMany({}),
      Equipment.deleteMany({}),
      FAQ.deleteMany({}),
      ClinicSetting.deleteMany({}),
    ]);

    console.log('🧹 Cleaned up existing records.');

    // 1. Create Users (Admin & Patient)
    const adminUser = await User.create({
      name: 'Dr. Sarah Jenkins (Clinic Director)',
      email: 'admin@smilecare.com',
      password: 'Admin@123',
      phone: '+91 98765 00001',
      role: 'ADMIN',
      age: 42,
      gender: 'Female',
    });

    const patientUser = await User.create({
      name: 'Rohan Deshmukh',
      email: 'patient@smilecare.com',
      password: 'Patient@123',
      phone: '+91 98765 11111',
      role: 'PATIENT',
      age: 29,
      gender: 'Male',
      emergencyContact: {
        name: 'Pooja Deshmukh',
        phone: '+91 98765 22222',
        relation: 'Spouse',
      },
    });

    console.log('✅ Users seeded (Admin: admin@smilecare.com | Patient: patient@smilecare.com)');

    // 2. Create Doctors
    const doctorsData = [
      {
        name: 'Dr. Mohammed Ahmed',
        qualification: 'BDS, MDS (Oral & Maxillofacial Surgery)',
        designation: 'Chief Oral Surgeon & Implantologist',
        specialization: ['Dental Implants', 'Oral & Maxillofacial Surgery', 'Wisdom Tooth Extraction', 'Bone Grafting'],
        experienceYears: 14,
        registrationNumber: 'KDC-14892-A',
        languages: ['English', 'Hindi', 'Urdu', 'Kannada'],
        about: 'Dr. Mohammed Ahmed is a celebrated Implantologist with over 14 years of surgical experience. Having placed over 4,500 successful titanium and zirconia implants, he specializes in painless immediate-load implantology and complex jaw rehabilitations.',
        education: [
          { degree: 'MDS - Oral & Maxillofacial Surgery', institution: 'All India Institute of Medical Sciences (AIIMS)', year: '2012' },
          { degree: 'BDS', institution: 'Government Dental College', year: '2008' },
        ],
        certifications: ['Fellow of International Congress of Oral Implantologists (FICOI, USA)', 'Certified All-on-4 Specialist (Nobel Biocare)'],
        awards: ['Best Implantologist Award 2024 - Karnataka Healthcare Summit', 'Excellence in Surgical Dentistry 2021'],
        memberships: ['Indian Dental Association (IDA)', 'Association of Oral & Maxillofacial Surgeons of India (AOMSI)'],
        consultationFee: 700,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        availableTimings: { start: '09:00 AM', end: '06:00 PM', breakStart: '01:00 PM', breakEnd: '02:00 PM' },
        slotDurationMinutes: 30,
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
        email: 'dr.ahmed@smilecare.com',
        phone: '+91 98765 43211',
        rating: 4.96,
        reviewsCount: 340,
      },
      {
        name: 'Dr. Ananya Sharma',
        qualification: 'BDS, MDS (Orthodontics & Dentofacial Orthopedics)',
        designation: 'Senior Orthodontist & Clear Aligner Specialist',
        specialization: ['Invisalign & Clear Aligners', 'Self-Ligating Braces', 'Ceramic Braces', 'Pediatric Jaw Orthopedics'],
        experienceYears: 11,
        registrationNumber: 'KDC-19230-O',
        languages: ['English', 'Hindi', 'Tamil', 'Kannada'],
        about: 'Dr. Ananya Sharma is an acclaimed Diamond-tier Invisalign provider dedicated to creating symmetrical, radiant smiles. She blends artistic facial aesthetics with digital 3D orthodontic biomechanics to deliver faster, discreet smile transformations.',
        education: [
          { degree: 'MDS - Orthodontics', institution: 'Manipal College of Dental Sciences', year: '2015' },
          { degree: 'BDS', institution: 'SDM College of Dental Sciences', year: '2011' },
        ],
        certifications: ['Invisalign Certified Diamond Provider', 'Incognito Lingual Orthodontics Specialist'],
        awards: ['National Orthodontic Pioneer Award 2023', 'Top 10 Aligners Specialist South India'],
        memberships: ['Indian Orthodontic Society (IOS)', 'World Federation of Orthodontists (WFO)'],
        consultationFee: 650,
        availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        availableTimings: { start: '10:00 AM', end: '07:00 PM', breakStart: '01:30 PM', breakEnd: '02:30 PM' },
        slotDurationMinutes: 30,
        photo: 'https://images.unsplash.com/photo-1594824813589-3c72b1574c8c?q=80&w=800&auto=format&fit=crop',
        email: 'dr.ananya@smilecare.com',
        phone: '+91 98765 43212',
        rating: 4.94,
        reviewsCount: 280,
      },
      {
        name: 'Dr. Rajesh Vardhan',
        qualification: 'BDS, MDS (Conservative Dentistry & Endodontics)',
        designation: 'Microscopic Endodontist & Root Canal Specialist',
        specialization: ['Single-Sitting Root Canal', 'Microscopic Endodontics', 'Tooth Color Restorations', 'Dental Trauma Management'],
        experienceYears: 13,
        registrationNumber: 'KDC-16541-E',
        languages: ['English', 'Hindi', 'Telugu', 'Kannada'],
        about: 'Dr. Rajesh Vardhan has performed over 8,000 painless root canal procedures using dental operating microscopes and rotary laser systems. He is passionate about biological tooth preservation and absolute zero-discomfort treatment.',
        education: [
          { degree: 'MDS - Conservative Dentistry & Endodontics', institution: 'SRM Dental College', year: '2013' },
          { degree: 'BDS', institution: 'RGUHS Bangalore', year: '2009' },
        ],
        certifications: ['Micro-Endodontics Fellowship (Germany)', 'Laser Dentistry Mastership (AALD)'],
        awards: ['Best Endodontist of the Year 2022', 'Preservation of Natural Teeth Excellence Award'],
        memberships: ['Indian Endodontic Society (IES)', 'Federation of Operative Dentistry of India (FODI)'],
        consultationFee: 600,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        availableTimings: { start: '09:30 AM', end: '06:30 PM', breakStart: '01:00 PM', breakEnd: '02:00 PM' },
        slotDurationMinutes: 30,
        photo: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=800&auto=format&fit=crop',
        email: 'dr.rajesh@smilecare.com',
        phone: '+91 98765 43213',
        rating: 4.92,
        reviewsCount: 310,
      },
      {
        name: 'Dr. Priya Nambiar',
        qualification: 'BDS, MDS (Pedodontics & Preventive Dentistry)',
        designation: 'Chief Pediatric Dentist & Child Dental Specialist',
        specialization: ['Pediatric Dentistry', 'Fluoride Therapies & Sealants', 'Sedation Dentistry for Kids', 'Space Maintainers'],
        experienceYears: 9,
        registrationNumber: 'KDC-21045-P',
        languages: ['English', 'Hindi', 'Malayalam', 'Kannada'],
        about: 'Dr. Priya Nambiar is renowned for creating fun, comforting, and anxiety-free dental visits for children of all ages. Her gentle behavior-management techniques turn dental visits into positive adventures for kids and parents alike.',
        education: [
          { degree: 'MDS - Pedodontics', institution: 'Amrita School of Dentistry', year: '2017' },
          { degree: 'BDS', institution: 'Government Dental College Kozhikode', year: '2013' },
        ],
        certifications: ['Conscious Sedation Specialist', 'Special Healthcare Needs Pediatric Fellow'],
        awards: ['Child Care Health Champion 2023'],
        memberships: ['Indian Society of Pedodontics and Preventive Dentistry (ISPPD)'],
        consultationFee: 550,
        availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        availableTimings: { start: '10:00 AM', end: '05:30 PM', breakStart: '01:00 PM', breakEnd: '02:00 PM' },
        slotDurationMinutes: 30,
        photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
        email: 'dr.priya@smilecare.com',
        phone: '+91 98765 43214',
        rating: 4.98,
        reviewsCount: 220,
      },
      {
        name: 'Dr. Vikramaditya Rao',
        qualification: 'BDS, MDS (Prosthodontics & Aesthetic Dentistry)',
        designation: 'Cosmetic Dentist & Smile Makeover Artist',
        specialization: ['Porcelain Veneers & Laminates', 'Zirconia Crowns', 'Full Mouth Rehabilitation', 'Teeth Whitening'],
        experienceYears: 12,
        registrationNumber: 'KDC-17849-C',
        languages: ['English', 'Hindi', 'Marathi', 'Kannada'],
        about: 'Dr. Vikramaditya Rao transforms smiles with ultra-thin porcelain veneers, customized aesthetic smile design, and CAD/CAM crafted ceramic restorations that match natural enamel translucency with perfection.',
        education: [
          { degree: 'MDS - Prosthodontics & Crown-Bridge', institution: 'King Georges Medical University', year: '2014' },
          { degree: 'BDS', institution: 'Mumbai University', year: '2010' },
        ],
        certifications: ['Digital Smile Design (DSD) Certified Master', 'AACD Aesthetic Fellow'],
        awards: ['Smile Architect Award 2024'],
        memberships: ['Indian Prosthodontic Society (IPS)', 'American Academy of Cosmetic Dentistry (AACD)'],
        consultationFee: 700,
        availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
        availableTimings: { start: '09:00 AM', end: '06:00 PM', breakStart: '01:00 PM', breakEnd: '02:00 PM' },
        slotDurationMinutes: 30,
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop',
        email: 'dr.vikram@smilecare.com',
        phone: '+91 98765 43215',
        rating: 4.95,
        reviewsCount: 195,
      },
    ];

    const createdDoctors = await Doctor.insertMany(doctorsData);
    console.log(`✅ ${createdDoctors.length} Doctors seeded.`);

    // 3. Create Services
    const servicesData = [
      {
        name: 'Comprehensive Dental Consultation & Digital X-Ray',
        category: 'Preventive Dentistry',
        shortDescription: 'In-depth 360° oral examination with HD digital sensor X-rays, intraoral camera tour, and personalized treatment mapping.',
        fullDescription: 'Our consultation is a thorough evaluation of your teeth, gums, occlusion, and jaw joints. We utilize high-resolution digital RVG radiography and high-magnification intraoral cameras to show you high-definition images on-screen, ensuring full transparency in diagnosis.',
        startingPrice: 500,
        durationMinutes: '30-45 min',
        visitsRequired: '1 visit',
        benefits: [
          'Detailed digital intraoral photo tour',
          'Ultra-low radiation digital sensor X-rays',
          'Early detection of hidden micro-cavities & gum issues',
          'Personalized preventive oral hygiene roadmap',
        ],
        procedureSteps: [
          { stepNumber: 1, title: 'Medical History & Patient Goals', description: 'Reviewing your dental history, current concerns, and smile objectives.' },
          { stepNumber: 2, title: 'Digital HD Intraoral Imaging', description: 'Real-time camera view displaying your teeth on high-def monitor.' },
          { stepNumber: 3, title: 'Targeted Low-Radiation X-Rays', description: 'Digital RVG imaging to inspect roots, bone levels, and interdental zones.' },
          { stepNumber: 4, title: 'Comprehensive Consultation & Treatment Plan', description: 'Clear discussion of findings, transparent cost breakdown, and prioritized steps.' },
        ],
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop',
        icon: 'Stethoscope',
        isPopular: true,
      },
      {
        name: 'Ultrasonic Scaling & Deep Stain Polishing',
        category: 'Preventive Dentistry',
        shortDescription: 'Gentle ultrasonic tartar removal and air-flow polishing for ultra-fresh breath and healthy pink gums.',
        fullDescription: 'Professional ultrasonic scaling removes hardened calculus (tartar) and stubborn plaque deposits that normal brushing cannot reach. Followed by prophy-paste micro-polishing, this treatment restores natural tooth smoothness and prevents gingivitis and periodontal breakdown.',
        startingPrice: 1200,
        durationMinutes: '30-45 min',
        visitsRequired: '1 visit',
        benefits: [
          'Eliminates plaque & hardened calculus build-up',
          'Prevents bleeding gums and periodontal disease',
          'Removes tea, coffee, and tobacco surface stains',
          'Restores lasting clean, fresh breath',
        ],
        procedureSteps: [
          { stepNumber: 1, title: 'Gum Health Assessment', description: 'Measuring pocket depths and checking for gingival inflammation.' },
          { stepNumber: 2, title: 'Ultrasonic Piezo Scaling', description: 'Micro-vibrations with cooling water spray effortlessly dislodge calculus.' },
          { stepNumber: 3, title: 'Interdental Flossing & Jet Cleaning', description: 'Cleaning tight spaces between teeth.' },
          { stepNumber: 4, title: 'Micro-Polishing & Fluoride Boost', description: 'Polishing enamel smooth to delay future plaque adhesion.' },
        ],
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop',
        icon: 'Sparkles',
        isPopular: true,
      },
      {
        name: 'Advanced Laser Teeth Whitening',
        category: 'Cosmetic Dentistry',
        shortDescription: 'In-office photo-activated bleaching delivering up to 6-8 shades whiter teeth in under 60 minutes.',
        fullDescription: 'Get a dazzling red-carpet smile with our clinically proven LED laser teeth whitening system. Safe on enamel and formulated with anti-sensitivity desensitizers, this treatment eliminates years of deep coffee, wine, and aging stains in a single comfortable visit.',
        startingPrice: 6500,
        durationMinutes: '60 min',
        visitsRequired: '1 visit',
        benefits: [
          'Up to 8 shades noticeably brighter teeth',
          'Fast 60-minute immediate in-office results',
          'Formulated with advanced desensitizing agents',
          'Long-lasting bright aesthetic brilliance',
        ],
        procedureSteps: [
          { stepNumber: 1, title: 'Shade Matching & Gum Barrier', description: 'Recording baseline shade and applying light-cured gingival barrier to protect gums.' },
          { stepNumber: 2, title: 'Whitening Gel Application', description: 'Applying medical-grade hydrogen peroxide whitening formula evenly.' },
          { stepNumber: 3, title: 'Laser / LED Light Activation', description: 'Accelerating stain breakdown across three 15-minute cycles.' },
          { stepNumber: 4, title: 'Post-Shade Reveal & Remineralization', description: 'Applying desensitizing mineral gel and celebrating your new bright smile.' },
        ],
        image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800&auto=format&fit=crop',
        icon: 'Sun',
        isPopular: true,
      },
      {
        name: 'Painless Microscopic Root Canal Treatment (RCT)',
        category: 'Endodontics',
        shortDescription: 'Gentle, single-sitting root canal therapy using high-magnification dental microscopes and rotary nickel-titanium instruments.',
        fullDescription: 'Say goodbye to severe toothaches. Our specialist endodontists save badly infected or decayed teeth comfortably using computer-controlled local anesthesia, dental operating microscopes, and biocompatible thermoplastic obturation.',
        startingPrice: 3800,
        durationMinutes: '45-60 min',
        visitsRequired: '1-2 visits',
        benefits: [
          'Completely pain-free with computer-assisted anesthesia',
          'Saves your natural tooth and avoids extraction',
          'High-precision cleaning with 20x optical magnification',
          'Same-day single-sitting completion in most cases',
        ],
        procedureSteps: [
          { stepNumber: 1, title: 'Painless Numbing', description: 'Gentle computerized local anesthesia ensuring zero sensation.' },
          { stepNumber: 2, title: 'Microscopic Canal Access', description: 'Opening tooth under rubber dam isolation and locating all canal branches.' },
          { stepNumber: 3, title: 'Laser & Rotary Cleaning', description: 'Disinfecting canal walls and removing bacterial toxins.' },
          { stepNumber: 4, title: '3D Biocompatible Sealing', description: 'Hermetically sealing canals with gutta-percha and sealer.' },
        ],
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop',
        icon: 'Zap',
        isPopular: true,
      },
      {
        name: 'Premium Titanium Dental Implants',
        category: 'Oral Surgery',
        shortDescription: 'Permanent, life-like tooth replacements with world-class Swiss/German titanium implants and zirconia crowns.',
        fullDescription: 'The gold standard for replacing missing teeth. A dental implant acts as a permanent artificial root fused into the jawbone, supporting a lifelike ceramic crown that looks, feels, and chews exactly like your natural tooth.',
        startingPrice: 28000,
        durationMinutes: '45 min per implant',
        visitsRequired: '2-3 visits over healing phase',
        benefits: [
          'Permanent lifetime tooth replacement solution',
          'Prevents jawbone loss and facial sagging',
          'No damage or shaving down of adjacent healthy teeth',
          '100% natural biting force and aesthetic appeal',
        ],
        procedureSteps: [
          { stepNumber: 1, title: '3D CBCT Scan & Virtual Planning', description: '3D bone density assessment and precision guided stent design.' },
          { stepNumber: 2, title: 'Gentle Implant Placement', description: 'Flapless/keyhole placement of titanium fixture under local anesthesia.' },
          { stepNumber: 3, title: 'Osseointegration & Healing', description: 'Natural bone fusing securely around the biocompatible implant fixture.' },
          { stepNumber: 4, title: 'Digital Impression & Zirconia Crown', description: 'Attaching custom ceramic crown with exact color match.' },
        ],
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
        icon: 'ShieldCheck',
        isPopular: true,
      },
      {
        name: 'Invisalign & Invisible Clear Aligners',
        category: 'Orthodontics',
        shortDescription: 'Discreet, removable clear plastic aligners custom-designed via 3D digital simulation for gentle tooth alignment.',
        fullDescription: 'Straighten your teeth without wires, brackets, or dietary restrictions. Using 3D iTero intraoral digital scanning, we create custom series of virtually invisible BPA-free aligners that gradually guide teeth into optimal alignment.',
        startingPrice: 65000,
        durationMinutes: '30 min checkups',
        visitsRequired: 'Monthly monitoring visits',
        benefits: [
          'Virtually invisible — nobody notices you are wearing them',
          'Removable for eating, brushing, and special occasions',
          'No painful metal wires or sharp bracket irritation',
          'See your 3D smile transformation simulation before starting',
        ],
        procedureSteps: [
          { stepNumber: 1, title: '3D Digital iTero Scan', description: 'Mess-free optical scan creating a digital replica of your teeth.' },
          { stepNumber: 2, title: 'ClinCheck 3D Treatment Map', description: 'Virtual simulation showing week-by-week tooth movement.' },
          { stepNumber: 3, title: 'Custom Aligner Fabrication', description: 'Receiving your custom precision-milled SmartTrack aligners.' },
          { stepNumber: 4, title: 'Progress Checkups & Retention', description: 'Switching trays every 7-10 days and periodic progress reviews.' },
        ],
        image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800&auto=format&fit=crop',
        icon: 'Smile',
        isPopular: true,
      },
      {
        name: 'Custom Zirconia & Ceramic Dental Crowns',
        category: 'Restorative Dentistry',
        shortDescription: 'CAD/CAM milled monolithic zirconia and E.max crowns offering superior strength, natural translucency, and a 15-year warranty.',
        fullDescription: 'Protect and restore damaged, fractured, or post-RCT teeth with premium ceramic and monolithic zirconia crowns. Digitally scanned and robotically milled for an airtight, micro-gap fit that blends seamlessly with your smile.',
        startingPrice: 6000,
        durationMinutes: '30-45 min',
        visitsRequired: '2 visits',
        benefits: [
          'Exceptional durability and chip-resistant strength',
          'Metal-free bio-compatible material with zero dark gum lines',
          'Computer-milled 5-micron precision edge seal',
          'Natural light transmission matching adjacent teeth',
        ],
        procedureSteps: [
          { stepNumber: 1, title: 'Tooth Preparation & Scanning', description: 'Minimal conservative shaping and optical 3D scanning.' },
          { stepNumber: 2, title: 'Protective Temp Crown', description: 'Comfortable temporary crown placed immediately.' },
          { stepNumber: 3, title: 'Robotic CAD/CAM Milling', description: 'Precision ceramic crafting and shade layering in lab.' },
          { stepNumber: 4, title: 'Permanent Bonding & Bite Tuning', description: 'Cementing crown with high-strength resin and checking bite harmony.' },
        ],
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop',
        icon: 'Crown',
        isPopular: false,
      },
      {
        name: 'Wisdom Tooth & Surgical Extractions',
        category: 'Oral Surgery',
        shortDescription: 'Gentle, minimally invasive removal of impacted wisdom teeth with advanced PRF healing therapy.',
        fullDescription: 'Impacted or painful wisdom teeth can damage adjacent molars and cause recurring infections. Our maxillofacial surgeons specialize in gentle surgical extraction with platelet-rich fibrin (PRF) therapy for rapid healing and minimal swelling.',
        startingPrice: 3500,
        durationMinutes: '40 min',
        visitsRequired: '1 visit + follow-up',
        benefits: [
          'Relieves jaw stiffness, facial swelling, and pressure pain',
          'Prevents crowding and damage to nearby second molars',
          'PRF biological therapy for ultra-fast socket recovery',
          'Option for conscious sedation for total relaxation',
        ],
        procedureSteps: [
          { stepNumber: 1, title: 'Digital X-Ray & Nerve Mapping', description: 'Evaluating tooth angle and proximity to the alveolar nerve.' },
          { stepNumber: 2, title: 'Profound Local Anesthesia', description: 'Complete numbing of tooth and surrounding tissues.' },
          { stepNumber: 3, title: 'Gentle Sectioning & Removal', description: 'Carefully easing out tooth in segments to preserve bone.' },
          { stepNumber: 4, title: 'Dissolvable Sutures & Post-Op Pack', description: 'Placing natural sutures and providing home care kit.' },
        ],
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop',
        icon: 'Activity',
        isPopular: false,
      },
      {
        name: 'Pediatric & Kids Gentle Dental Care',
        category: 'Pediatric Dentistry',
        shortDescription: 'Compassionate, kid-friendly treatments including cavity prevention, fluoride varnish, pit & fissure sealants.',
        fullDescription: 'We make dental visits exciting and fear-free for children. Our pediatric lounge, gentle vocabulary, painless injections, and preventive sealants protect your child’s developing teeth for a lifetime of healthy confident smiles.',
        startingPrice: 800,
        durationMinutes: '30 min',
        visitsRequired: '1 visit',
        benefits: [
          'Child-friendly atmosphere and comforting pediatric team',
          'Painless cavity protection with pit & fissure sealants',
          'Topical mineral varnish for strong tooth enamel',
          'Fun oral hygiene education and bravery rewards',
        ],
        procedureSteps: [
          { stepNumber: 1, title: 'Playful Introduction & Acclimatization', description: 'Child gets comfortable and explores the dental chair.' },
          { stepNumber: 2, title: 'Gentle Checkup & Plaque Brush', description: 'Soft electric brushing and checking tooth eruption milestones.' },
          { stepNumber: 3, title: 'Protective Sealant / Fluoride Coating', description: 'Quick, tasty protective shield applied to chewing grooves.' },
          { stepNumber: 4, title: 'Bravery Certificate & Token of Honor', description: 'Celebrating a great visit!' },
        ],
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop',
        icon: 'HeartHandshake',
        isPopular: false,
      },
      {
        name: 'Porcelain Veneers & Smile Makeover',
        category: 'Cosmetic Dentistry',
        shortDescription: 'Ultra-thin, custom-sculpted porcelain shells to correct gaps, chips, uneven shapes, and permanent discolouration.',
        fullDescription: 'Achieve the Hollywood-standard smile you have always desired. Veneers are custom-bonded to the front of teeth, correcting misalignments, dark internal stains, chip fractures, and irregular spaces with permanent luster.',
        startingPrice: 12000,
        durationMinutes: '60 min',
        visitsRequired: '2-3 visits',
        benefits: [
          'Completely transforms smile symmetry and tooth contours',
          'Permanent stain-resistant porcelain material',
          'Conservative tooth preparation preserving natural tooth structure',
          'Digitally previewed with diagnostic wax-up',
        ],
        procedureSteps: [
          { stepNumber: 1, title: 'Aesthetic Smile Analysis & Waxup', description: 'Photographic mapping and temporary aesthetic preview.' },
          { stepNumber: 2, title: 'Micro-Preparation & 3D Scan', description: '0.3mm conservative surface shaping and digital scan.' },
          { stepNumber: 3, title: 'Master Ceramist Custom Crafting', description: 'Hand-layering porcelain shades and texture in laboratory.' },
          { stepNumber: 4, title: 'Adhesive Resin Bonding', description: 'Permanent adhesive cementation with high-intensity light cure.' },
        ],
        image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800&auto=format&fit=crop',
        icon: 'Sparkle',
        isPopular: true,
      },
      {
        name: 'Periodontal Laser Gum Therapy',
        category: 'Periodontics',
        shortDescription: 'Painless, stitch-free laser treatment for bleeding gums, deep pocket disinfection, and gum contouring.',
        fullDescription: 'Advanced diode laser treatment targets harmful anaerobic bacteria deep inside gum pockets without scalpels or stitches. Stimulates natural collagen re-attachment and cures chronic bleeding gums and bad breath.',
        startingPrice: 4000,
        durationMinutes: '45 min',
        visitsRequired: '1-2 visits',
        benefits: [
          'No scalpels, incisions, or sutures required',
          'Virtually zero bleeding and immediate post-op comfort',
          'Sterilizes deep bacterial bio-films inside gum pockets',
          'Promotes natural tissue regeneration and tight gum seal',
        ],
        procedureSteps: [
          { stepNumber: 1, title: 'Periodontal Charting & Pocket Depth', description: 'Measuring gum attachment levels around each tooth.' },
          { stepNumber: 2, title: 'Laser Fiber Pocket Sterilization', description: 'Gentle laser energy vaporizes diseased tissue and bacteria.' },
          { stepNumber: 3, title: 'Ultrasonic Root Smoothing', description: 'Smoothing root surfaces to encourage healthy gum re-adhesion.' },
          { stepNumber: 4, title: 'Biostimulation & Healing Review', description: 'Low-level laser therapy to accelerate tissue healing.' },
        ],
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
        icon: 'Flame',
        isPopular: false,
      },
      {
        name: '24/7 Emergency Dental Trauma & Pain Relief',
        category: 'Emergency Care',
        shortDescription: 'Same-day urgent treatment for severe toothaches, broken teeth, knocked-out teeth, swelling, and lost crowns.',
        fullDescription: 'Dental emergencies need immediate relief. Our emergency team is equipped to address severe acute toothache, pulpitis, fractured teeth, oral trauma, and displaced restorations promptly to stop pain and safeguard your tooth.',
        startingPrice: 900,
        durationMinutes: '30-60 min',
        visitsRequired: '1 urgent visit',
        benefits: [
          'Immediate priority emergency slot allocation',
          'Instant pain relief protocols and infection control',
          'Tooth preservation for knocked-out or fractured teeth',
          'Direct triage line with on-call dental surgeon',
        ],
        procedureSteps: [
          { stepNumber: 1, title: 'Instant Triage & Pain Relief', description: 'Immediate local anesthesia or calming medication administered.' },
          { stepNumber: 2, title: 'Rapid Diagnostic X-Ray', description: 'Identifying root cause of fracture, abscess, or nerve exposure.' },
          { stepNumber: 3, title: 'Targeted Emergency Intervention', description: 'Pulp extirpation, temporary stabilization, or extraction as indicated.' },
          { stepNumber: 4, title: 'Prescription & Follow-up Plan', description: 'Providing medication and scheduling permanent restorative care.' },
        ],
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop',
        icon: 'PhoneCall',
        isPopular: true,
      },
    ];

    const servicesDataWithSlugs = servicesData.map(s => ({
      ...s,
      slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));

    const createdServices = await Service.insertMany(servicesDataWithSlugs);
    console.log(`✅ ${createdServices.length} Services seeded.`);

    // 4. Create Equipment / Dental Machines
    const equipmentData = [
      {
        name: 'Carestream CS 9600 CBCT 3D Diagnostic Imaging Scanner',
        brandModel: 'Carestream Dental CS 9600 Multi-Field 3D',
        category: 'Imaging & Diagnostics',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop',
        purpose: 'Captures ultra-high resolution 3D volumetric images of jawbones, nerve pathways, sinuses, and tooth roots with precision down to 75 microns.',
        benefits: [
          'Sub-millimeter accuracy for safe, flawless dental implant placement',
          '75% lower radiation exposure than traditional medical CT scanners',
          'Detects hidden root canals, jaw cysts, and bone thickness instantly',
          'Full digital reconstruction displayed in real-time to patients',
        ],
        patientComfortImpact: 'Comfortable standing or seated scan completed in under 12 seconds with zero enclosed tunnel anxiety.',
        yearPurchased: 2024,
        status: 'Active & In-Use',
        order: 1,
      },
      {
        name: 'iTero Element 5D Plus Intraoral Digital Scanner',
        brandModel: 'Align Technology iTero 5D+',
        category: 'Digital Dentistry',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop',
        purpose: 'Eliminates messy, uncomfortable impression goop by optically scanning 6,000 frames per second to create exact 3D models of your teeth.',
        benefits: [
          'Zero choking sensation — no rubbery impression putty required',
          'Built-in NIRI near-infrared technology detects interproximal cavities',
          'Visualizes your future straight smile with 3D Outcome Simulator',
          'Direct cloud sync with Invisalign and CAD/CAM milling centers',
        ],
        patientComfortImpact: 'Gentle optical wand scans your entire mouth comfortably in just 60 seconds.',
        yearPurchased: 2023,
        status: 'Active & In-Use',
        order: 2,
      },
      {
        name: 'Zeiss Extaro 300 Dental Surgical Microscope',
        brandModel: 'Carl Zeiss Meditec Extaro 300',
        category: 'Treatment & Surgery',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
        purpose: 'Provides up to 30x optical magnification and shadow-free xenon illumination for microscopic root canal treatments and micro-aesthetic veneer bonding.',
        benefits: [
          'Reveals micro-cracks and hidden extra root canals invisible to the naked eye',
          'Enables ultra-conservative dentistry preserving healthy tooth enamel',
          'Fluorescence mode helps differentiate natural tooth structure from old fillings',
          'Integrated 4K video recording for clear patient education',
        ],
        patientComfortImpact: 'Ensures thorough, painless treatment and significantly higher root canal success rates.',
        yearPurchased: 2023,
        status: 'Active & In-Use',
        order: 3,
      },
      {
        name: 'Biolase Waterlase iPlus 2.0 Dental Hard & Soft Tissue Laser',
        brandModel: 'Biolase Waterlase iPlus All-Tissue Laser',
        category: 'Treatment & Surgery',
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop',
        purpose: 'Uses energised water droplets energized by laser photons to cut enamel, bone, and gum tissue smoothly without heat, friction, or vibration.',
        benefits: [
          'No drill noise, heat, or vibration sensations',
          'Eliminates need for needles and local anesthetic in many cavity preps',
          'Minimizes bleeding and swelling during gum treatments',
          'Accelerates tissue healing and biological cell regeneration',
        ],
        patientComfortImpact: 'Gentle, whisper-quiet treatment ideal for nervous patients and young children.',
        yearPurchased: 2024,
        status: 'Active & In-Use',
        order: 4,
      },
      {
        name: 'Melag Vacuklav 44 B+ Evolution Medical Autoclave',
        brandModel: 'MELAG Medizintechnik Class B Sterilizer (Germany)',
        category: 'Sterilization & Safety',
        image: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?q=80&w=800&auto=format&fit=crop',
        purpose: 'Hospital-grade fractionated pre-vacuum sterilization delivering 100% destruction of all bacterial, viral, and spore contaminants.',
        benefits: [
          'Strict compliance with EN 13060 European Hospital Standards',
          'Patented double-chamber technology achieves sterile dryness in 20 mins',
          'Individual digital barcode tracking on every sealed instrument pouch',
          'Zero cross-contamination guarantee between patients',
        ],
        patientComfortImpact: 'Peace of mind knowing every dental tool opened in front of you is 100% clinically sterile.',
        yearPurchased: 2023,
        status: 'Active & In-Use',
        order: 5,
      },
      {
        name: 'Sirona Intego Pro Smart Ergonomic Dental Unit',
        brandModel: 'Dentsply Sirona Intego Pro (Germany)',
        category: 'Patient Comfort',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop',
        purpose: 'Advanced treatment chair equipped with viscoelastic memory foam, integrated multimedia displays, and automated sanitizing lines.',
        benefits: [
          'Orthopedic memory foam cushioning contours perfectly to your body',
          'Integrated chairside 4K screen to watch movies or view treatment steps',
          'Built-in continuous chemical water line disinfection',
          'Smooth silent hydraulic positioning for seamless comfort',
        ],
        patientComfortImpact: 'Luxurious comfort even during longer dental and cosmetic procedures.',
        yearPurchased: 2024,
        status: 'Active & In-Use',
        order: 6,
      },
      {
        name: 'EMS AirFlow Prophylaxis Master Piezon Scaler',
        brandModel: 'EMS Electro Medical Systems (Switzerland)',
        category: 'Treatment & Surgery',
        image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800&auto=format&fit=crop',
        purpose: 'Guided Biofilm Therapy (GBT) device utilizing warm water jets and erythritol powder to remove stains and plaque without scraping enamel.',
        benefits: [
          'Warm water temperature control avoids sudden cold sensitivity',
          'Sub-gingival biofilm removal around implants and natural teeth',
          'Removes heavy coffee, wine, and nicotine stains effortlessly',
          'Gentle on sensitive tooth roots and delicate porcelain crowns',
        ],
        patientComfortImpact: 'A spa-like, painless dental cleaning experience with zero sharp sensations.',
        yearPurchased: 2024,
        status: 'Active & In-Use',
        order: 7,
      },
      {
        name: 'Philips Zoom WhiteSpeed In-Office LED Light System',
        brandModel: 'Philips Zoom WhiteSpeed 4th Gen',
        category: 'Cosmetic Dentistry',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop',
        purpose: 'Clinically proven photo-catalytic LED technology that accelerates bleaching gel reactions for rapid, safe tooth whitening.',
        benefits: [
          'Advanced blue LED spectrum with variable intensity settings',
          'Whitens teeth up to 8 shades in just 45 minutes of light time',
          'Enamel-safe formula with ACP (Amorphous Calcium Phosphate)',
          '99% patient satisfaction with minimal post-treatment sensitivity',
        ],
        patientComfortImpact: 'Comfortable session with custom lip retractors and instant visible transformation.',
        yearPurchased: 2023,
        status: 'Active & In-Use',
        order: 8,
      },
    ];

    const createdEquipment = await Equipment.insertMany(equipmentData);
    console.log(`✅ ${createdEquipment.length} Equipment items seeded.`);

    // 5. Create Photo Gallery Items
    const galleryData = [
      {
        title: 'Modern Clinic Facade & Entrance',
        category: 'Clinic Exterior',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
        caption: 'Welcoming front entrance at SmileCare Towers on Health Avenue with dedicated valet parking.',
        featured: true,
        order: 1,
      },
      {
        title: 'Lounge Reception & Patient Check-In',
        category: 'Reception & Lounge',
        image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=1200&auto=format&fit=crop',
        caption: 'Serene reception lounge with organic herbal tea bar, high-speed Wi-Fi, and calming aesthetic acoustics.',
        featured: true,
        order: 2,
      },
      {
        title: 'Surgical Suite & Advanced Implantology Theater',
        category: 'Treatment Rooms',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200&auto=format&fit=crop',
        caption: 'Ultra-hygienic surgical suite equipped with HEPA laminar air flow and 3D intraoral navigation.',
        featured: true,
        order: 3,
      },
      {
        title: 'Class-B Central Sterilization Monitoring Room',
        category: 'Sterilization Area',
        image: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?q=80&w=1200&auto=format&fit=crop',
        caption: 'European Standard Class-B sterilization bay with digital batch tracking on every sealed instrument pack.',
        featured: false,
        order: 4,
      },
      {
        title: 'Digital Diagnostic Imaging Center',
        category: 'Dental Equipment',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop',
        caption: 'Carestream CBCT 3D scan room providing instant multi-angle diagnostic mapping.',
        featured: true,
        order: 5,
      },
      {
        title: 'Consultation & 3D Smile Design Studio',
        category: 'Treatment Rooms',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop',
        caption: 'Interactive consultation suite where patients preview their digital smile mockups on 4K displays.',
        featured: false,
        order: 6,
      },
      {
        title: 'Pediatric Smile Corner for Kids',
        category: 'Pediatric Corner',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop',
        caption: 'Colorful pediatric lounge with interactive games, storybooks, and gentle kid-friendly dental chairs.',
        featured: false,
        order: 7,
      },
      {
        title: 'SmileCare Medical Team & Specialists',
        category: 'Doctors & Staff',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1200&auto=format&fit=crop',
        caption: 'Our multidisciplinary team of MDS dental surgeons, hygienists, and patient care coordinators.',
        featured: true,
        order: 8,
      },
      {
        title: 'World Oral Health Day Community Awareness Camp',
        category: 'Clinic Events',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop',
        caption: 'Providing free oral cancer screenings and child tooth sealants during our annual community outreach.',
        featured: false,
        order: 9,
      },
    ];

    const createdGallery = await GalleryItem.insertMany(galleryData);
    console.log(`✅ ${createdGallery.length} Gallery items seeded.`);

    // 6. Create Before & After Cases
    const beforeAfterData = [
      {
        title: 'Laser Teeth Whitening — 7 Shades Brighter',
        category: 'Teeth Whitening',
        beforeImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800&auto=format&fit=crop',
        treatmentType: 'Philips Zoom Laser Whitening',
        duration: '1 Session (60 mins)',
        doctor: createdDoctors[4]._id,
        description: 'Eliminated 6 years of deep tea and coffee oxidation stains, revealing bright natural enamel luminescence with zero sensitivity.',
      },
      {
        title: 'Invisalign Clear Aligners — Gap & Crowding Correction',
        category: 'Orthodontics / Braces',
        beforeImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800&auto=format&fit=crop',
        treatmentType: 'Invisalign SmartTrack System',
        duration: '7 Months',
        doctor: createdDoctors[1]._id,
        description: 'Corrected severe anterior midline diastema (gap) and lower arch crowding discreetly without metal wires.',
      },
      {
        title: 'Single Tooth Immediate Titanium Implant',
        category: 'Dental Implants',
        beforeImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
        treatmentType: 'Nobel Biocare Implant with Zirconia Crown',
        duration: '3 Months total osseointegration',
        doctor: createdDoctors[0]._id,
        description: 'Replaced a traumatically fractured upper central incisor with a custom shade-matched zirconia crown on a titanium fixture.',
      },
      {
        title: 'Minimal-Prep Ceramic Veneers — 6 Upper Anterior Teeth',
        category: 'Cosmetic Veneers',
        beforeImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800&auto=format&fit=crop',
        treatmentType: 'E.max Lithium Disilicate Veneers',
        duration: '2 Weeks (2 Appointments)',
        doctor: createdDoctors[4]._id,
        description: 'Restored worn, chipped edges and fluorosis discoloration with hand-layered translucent aesthetic veneers.',
      },
    ];

    const createdBeforeAfter = await BeforeAfter.insertMany(beforeAfterData);
    console.log(`✅ ${createdBeforeAfter.length} Before & After cases seeded.`);

    // 7. Create Reviews
    const reviewsData = [
      {
        patientName: 'Aarav Mehta',
        patientEmail: 'aarav.mehta@gmail.com',
        patientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        title: 'Painless Root Canal! Truly life-saving experience',
        comment: 'I was terrified of root canals after a bad experience years ago. Dr. Rajesh Vardhan was incredibly gentle, explained every single step on the screen, and I literally felt zero pain throughout the entire procedure. The clinic is spotless and feels like a 5-star hotel!',
        doctor: createdDoctors[2]._id,
        service: createdServices[3]._id,
        treatmentExperience: 'Single-Sitting Microscopic RCT',
        isVerifiedPatient: true,
        isApproved: true,
      },
      {
        patientName: 'Sneha Kulkarni',
        patientEmail: 'sneha.k@outlook.com',
        patientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        title: 'Loving my new Invisalign smile with Dr. Ananya!',
        comment: 'Completed my 8-month Invisalign treatment with Dr. Ananya Sharma. The 3D iTero scan was so quick and cool to watch. My teeth alignment is now 100% straight and my confidence has skyrocketed. Best dental clinic in Bengaluru by far!',
        doctor: createdDoctors[1]._id,
        service: createdServices[5]._id,
        treatmentExperience: 'Invisalign Clear Aligners',
        isVerifiedPatient: true,
        isApproved: true,
      },
      {
        patientName: 'Karthik Ramanathan',
        patientEmail: 'karthik.r@techcorp.com',
        patientAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        title: 'Top-tier dental implant by Dr. Mohammed Ahmed',
        comment: 'Had two molar implants placed here. Dr. Ahmed is a true master surgeon. The 3D CBCT scan guided everything perfectly, minimal post-surgery soreness, and the new zirconia teeth match my bite seamlessly. Transparent pricing with no hidden charges.',
        doctor: createdDoctors[0]._id,
        service: createdServices[4]._id,
        treatmentExperience: 'Titanium Dental Implants',
        isVerifiedPatient: true,
        isApproved: true,
      },
      {
        patientName: 'Meera & Vihaan Joshi',
        patientEmail: 'meera.joshi@gmail.com',
        patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        title: 'Dr. Priya is wonderful with kids!',
        comment: 'Took my 6-year-old son Vihaan for his first cavity sealant. Dr. Priya Nambiar made it so much fun with her cartoon story approach. Vihaan came out with a bravery certificate and actually looks forward to brushing now!',
        doctor: createdDoctors[3]._id,
        service: createdServices[8]._id,
        treatmentExperience: 'Pediatric Preventive Care',
        isVerifiedPatient: true,
        isApproved: true,
      },
      {
        patientName: 'Rohan Deshmukh',
        patientEmail: 'patient@smilecare.com',
        patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        patient: patientUser._id,
        rating: 5,
        title: 'Brilliant Laser Teeth Whitening session',
        comment: 'Visited for routine scaling and Zoom teeth whitening before my sister’s wedding. The results are phenomenal — noticeably whiter in under an hour. Great staff and easy online appointment booking!',
        doctor: createdDoctors[4]._id,
        service: createdServices[2]._id,
        treatmentExperience: 'Laser Whitening & Scaling',
        isVerifiedPatient: true,
        isApproved: true,
      },
      {
        patientName: 'Divya Nair',
        patientEmail: 'divya.nair@gmail.com',
        patientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        rating: 4,
        title: 'Very hygienic and punctual appointment',
        comment: 'Clean, modern clinic with sterilized instruments opened right in front of me. The doctor gave honest advice rather than pushing unnecessary treatments. Slight 10-minute wait on a Saturday, but well worth it.',
        doctor: createdDoctors[0]._id,
        service: createdServices[1]._id,
        treatmentExperience: 'Scaling & Oral Health Checkup',
        isVerifiedPatient: true,
        isApproved: true,
      },
    ];

    const createdReviews = await Review.insertMany(reviewsData);
    console.log(`✅ ${createdReviews.length} Reviews seeded.`);

    // 8. Create FAQs
    const faqsData = [
      {
        question: 'Do I need an appointment beforehand, or can I walk in?',
        answer: 'While we accommodate urgent dental emergencies immediately, we strongly recommend booking an appointment online or via phone. This guarantees minimal to zero waiting time and allows our specialists to dedicate focused time for your consultation.',
        category: 'General & Appointments',
        order: 1,
      },
      {
        question: 'Are dental treatments at SmileCare painful?',
        answer: 'Not at all! We strictly practice a painless care philosophy. We utilize computer-controlled local anesthesia delivery, ultra-fine microscopic needles, and water-assisted laser therapy to ensure total comfort and numbness before touching any tooth.',
        category: 'Treatments & Procedures',
        order: 2,
      },
      {
        question: 'How much does a Root Canal Treatment (RCT) cost?',
        answer: 'Our microscopic single-sitting root canal treatment starts from ₹3,800. The exact cost depends on tooth anatomy (front tooth vs. multi-rooted molar) and whether a high-strength zirconia crown is placed post-treatment. We provide a 100% itemized cost breakdown before beginning.',
        category: 'Pricing & Insurance',
        order: 3,
      },
      {
        question: 'How long do dental implants last?',
        answer: 'With proper daily brushing, flossing, and periodic routine checkups, modern titanium dental implants are designed to last a lifetime (over 25-30+ years) with a clinical success rate exceeding 98%.',
        category: 'Treatments & Procedures',
        order: 4,
      },
      {
        question: 'What should I do if I experience a severe dental emergency?',
        answer: 'Call our 24/7 emergency care line (+91 98765 00911) or WhatsApp us immediately. If a tooth is knocked out, hold it by the crown (do NOT scrub the root), place it in a cup of cold milk or saliva, and reach our clinic within 60 minutes for highest re-implantation success.',
        category: 'Emergency Care',
        order: 5,
      },
      {
        question: 'What payment methods do you accept at the clinic?',
        answer: 'We accept all major payment modes including UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay, Amex), Net Banking, and Cash. We also offer 0% interest EMI options for extensive smile makeovers, implants, and Invisalign treatments.',
        category: 'Pricing & Insurance',
        order: 6,
      },
      {
        question: 'How often should I get my teeth cleaned professionally?',
        answer: 'The American Dental Association and our specialists recommend professional ultrasonic cleaning every 6 months to remove hardened calculus deposits, polish away stains, and prevent gum inflammation and cavities.',
        category: 'General & Appointments',
        order: 7,
      },
      {
        question: 'What precautions should I take after a tooth extraction or surgery?',
        answer: 'Bite firmly on the sterile gauze pack for 45 minutes, avoid hot/spicy foods and straws for 24 hours, do not spit vigorously, and apply an ice pack on the cheek for 10-minute intervals to minimize swelling. Detailed post-op medicine instructions will be provided.',
        category: 'Post-Treatment Care',
        order: 8,
      },
    ];

    const createdFAQs = await FAQ.insertMany(faqsData);
    console.log(`✅ ${createdFAQs.length} FAQs seeded.`);

    // 9. Create Clinic Setting
    const clinicSettingsData = {
      name: 'SmileCare Premium Dental Clinic & Implant Center',
      shortName: 'SmileCare Dental',
      tagline: 'Your Smile. Our Expertise.',
      heroSubtitle: 'Professional dental care with advanced 3D technology, experienced specialists, and pain-free personalized treatments.',
      aboutDescription: 'SmileCare is Bengaluru’s premier multi-specialty dental clinic offering comprehensive restorative, cosmetic, orthodontic, and surgical dental solutions. Equipped with 3D CBCT imaging, Zeiss microscopes, and European Class-B sterilization protocols, our mission is to deliver world-class oral healthcare with gentle warmth and uncompromising clinical precision.',
      establishedYear: 2014,
      mission: 'To provide world-class, gentle, and accessible dental healthcare utilizing advanced digital diagnostics and evidence-based clinical practices.',
      vision: 'To be the most trusted healthcare sanctuary for smiles, setting the gold standard in patient comfort, safety, and aesthetic transformation.',
      values: [
        'Patient-First Compassion',
        'Zero-Compromise European Sterilization',
        'Transparent & Honest Pricing',
        'Continuous Digital Innovation',
        'Pain-Free Care Philosophy',
      ],
      phone: '+91 98765 43210',
      emergencyPhone: '+91 98765 00911',
      email: 'care@smilecaredental.com',
      whatsapp: '+919876543210',
      address: {
        building: 'SmileCare Towers, 2nd & 3rd Floor',
        street: '42 Health Avenue, 100 Feet Road, Metro Pillar 128',
        area: 'Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560038',
        country: 'India',
        landmark: 'Opposite Central Park Metro Station Gate 2',
      },
      coordinates: {
        lat: 12.9784,
        lng: 77.6408,
      },
      googleMapsEmbedUrl: 'https://maps.google.com/maps?q=12.9784,77.6408&z=15&output=embed',
      openingHours: [
        { day: 'Monday', open: '09:00 AM', close: '08:00 PM', isClosed: false },
        { day: 'Tuesday', open: '09:00 AM', close: '08:00 PM', isClosed: false },
        { day: 'Wednesday', open: '09:00 AM', close: '08:00 PM', isClosed: false },
        { day: 'Thursday', open: '09:00 AM', close: '08:00 PM', isClosed: false },
        { day: 'Friday', open: '09:00 AM', close: '08:00 PM', isClosed: false },
        { day: 'Saturday', open: '09:00 AM', close: '06:00 PM', isClosed: false },
        { day: 'Sunday', open: '10:00 AM', close: '02:00 PM', isClosed: false },
      ],
      socialLinks: {
        instagram: 'https://instagram.com/smilecaredental',
        facebook: 'https://facebook.com/smilecaredental',
        youtube: 'https://youtube.com/@smilecaredental',
        linkedin: 'https://linkedin.com/company/smilecare-dental',
        twitter: 'https://twitter.com/smilecaredental',
      },
      stats: {
        rating: 4.9,
        reviewsCount: 1480,
        experienceYears: 12,
        patientsServed: '18,500+',
        treatmentsCount: '25+',
        doctorsCount: 5,
      },
      nearbyAmenities: [
        {
          category: 'Metro Station',
          name: 'Indiranagar Metro (Purple Line) Gate 2',
          distance: '120 meters (2 min walk)',
        },
        {
          category: 'Parking',
          name: 'Dedicated Basement Valet Parking',
          distance: 'On-site (Free for Patients)',
        },
        {
          category: 'Pharmacy',
          name: 'Apollo 24/7 Pharmacy',
          distance: 'Building Ground Floor',
        },
        {
          category: 'Hospital',
          name: 'Manipal Multi-Specialty Hospital',
          distance: '800 meters',
        },
      ],
      emergencyCareEnabled: true,
      disclaimer: 'Information provided on this platform is for educational and appointment coordination purposes. Final diagnosis and pricing will be determined post comprehensive in-person examination by our certified dental surgeons.',
    };

    const createdClinic = await ClinicSetting.create(clinicSettingsData);
    console.log('✅ Clinic Profile & Settings seeded.');

    // 10. Create Sample Appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    const sampleAppointments = [
      {
        appointmentNumber: 'SC-2026-1042',
        patient: patientUser._id,
        patientInfo: {
          name: 'Rohan Deshmukh',
          email: 'patient@smilecare.com',
          phone: '+91 98765 11111',
          age: 29,
          gender: 'Male',
          isNewPatient: false,
        },
        doctor: createdDoctors[1]._id,
        service: createdServices[5]._id, // Invisalign
        date: tomorrowStr,
        timeSlot: '11:00 AM',
        status: 'Confirmed',
        reasonForVisit: 'Invisalign Routine Tray Review',
        patientNotes: 'Progress check for Tray set #8.',
        price: 650,
        paymentMethod: 'Pay at Clinic (Cash/Card/UPI)',
        paymentStatus: 'Pending',
      },
      {
        appointmentNumber: 'SC-2026-1043',
        patient: null,
        patientInfo: {
          name: 'Anjali Sharma',
          email: 'anjali.s@gmail.com',
          phone: '+91 98765 88888',
          age: 34,
          gender: 'Female',
          isNewPatient: true,
        },
        doctor: createdDoctors[0]._id,
        service: createdServices[0]._id, // Consultation
        date: tomorrowStr,
        timeSlot: '02:30 PM',
        status: 'Confirmed',
        reasonForVisit: 'Consultation for dental implant options',
        patientNotes: 'Lost a lower right tooth 2 months ago.',
        price: 700,
        paymentMethod: 'Pay at Clinic (Cash/Card/UPI)',
        paymentStatus: 'Pending',
      },
      {
        appointmentNumber: 'SC-2026-1040',
        patient: patientUser._id,
        patientInfo: {
          name: 'Rohan Deshmukh',
          email: 'patient@smilecare.com',
          phone: '+91 98765 11111',
          age: 29,
          gender: 'Male',
          isNewPatient: false,
        },
        doctor: createdDoctors[4]._id,
        service: createdServices[2]._id, // Whitening
        date: '2026-08-10',
        timeSlot: '04:00 PM',
        status: 'Completed',
        reasonForVisit: 'Laser Teeth Whitening',
        patientNotes: 'Pre-wedding teeth whitening.',
        price: 6500,
        paymentMethod: 'Online (Card/UPI/NetBanking)',
        paymentStatus: 'Paid',
      },
    ];

    const createdAppointments = await Appointment.insertMany(sampleAppointments);
    console.log(`✅ ${createdAppointments.length} Sample Appointments seeded.`);

    console.log('\n🎉 ALL SMILECARE DATABASE SEEDING COMPLETED SUCCESSFULLY!\n');
    return true;
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
};

// If run directly via node backend/seeds/seedData.js
if (require.main === module) {
  const { connectDB, closeDB } = require('../config/db');
  (async () => {
    await connectDB();
    await seedAllData();
    await closeDB();
    process.exit(0);
  })();
}

module.exports = seedAllData;
