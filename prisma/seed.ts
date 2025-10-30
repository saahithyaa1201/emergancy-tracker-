import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get the first user (or find by email)
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.log('❌ No user found. Please create a user first.');
    return;
  }

  console.log('✅ Found user:', user.email);

  // Delete existing contacts for clean slate
  await prisma.trustedContact.deleteMany({
    where: { userId: user.id }
  });

  // Create trusted contacts (removed priority/isActive as they're not in schema)
  const contacts = await prisma.trustedContact.createMany({
    data: [
      {
        userId: user.id,
        name: 'Mom',
        phone: '+94771234567',  // Renamed from 'phone'
        email: 'mom@example.com',
      },
      {
        userId: user.id,
        name: 'Dad',
        phone: '+94772345678',  // Renamed from 'phone'
        email: 'dad@example.com',
      },
      {
        userId: user.id,
        name: 'Best Friend',
        phone: '+94773456789',  // Renamed from 'phone'
        email: 'friend@example.com',
      },
    ],
  });

  console.log(`✅ Created ${contacts.count} trusted contacts`);

  // Create a test panic alert (removed address as it's not in schema)
  const alert = await prisma.panicAlert.create({
    data: {
      userId: user.id,
      latitude: 6.8649,
      longitude: 79.9738,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created test panic alert:', alert.id);

  // Fetch user contacts (removed isActive filter as field not in schema)
  const userContacts = await prisma.trustedContact.findMany({
    where: { userId: user.id },
    take: 3,
  });

  // TODO: Create notification records once AlertNotification model is added to schema
  // for (const contact of userContacts) {
  //   await prisma.alertNotification.create({
  //     data: {
  //       panicAlertId: alert.id,
  //       contactName: contact.name,
  //       contactPhone: contact.phoneNumber,  // Renamed from 'phone'
  //       contactEmail: contact.email,
  //       status: 'SENT',
  //       deliveredAt: new Date(),
  //     },
  //   });
  // }

  console.log('✅ Seeding complete (notifications skipped until model added)');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });