DELETE FROM service_record;
DELETE FROM service;
DELETE FROM caregiver;
DELETE FROM elder;
DELETE FROM service_type;


INSERT INTO service_type (kind, sub_type, desc)
VALUES ('Household Tasks','Laundry','Washing and drying clothes and other fabrics, such as towels and bed sheets, to maintain cleanliness and hygiene.'),
('Household Tasks','Cooking',' Preparing nutritious meals for the senior, taking into consideration their dietary restrictions and preferences.'),
('Household Tasks','Pet Care','Providing care for pets, such as feeding, grooming, and walking them, to ensure their well-being and companionship for the senior.'),
('Personal Care','Bathing','Helping seniors with personal hygiene, such as taking a shower or bath, to maintain cleanliness and prevent infections.'),
('Personal Care','Dressing','Assisting seniors with getting dressed and undressed, including selecting appropriate clothing, to promote independence and dignity.'),
('Personal Care','Feeding','Helping seniors with eating and drinking, including preparing meals and feeding them, to ensure proper nutrition and hydration.'),
('Companionship','Social Activities','Engaging in various activities with seniors, such as playing games, going on outings, or attending events, to promote social interaction and prevent loneliness.'),
('Companionship','Daily Exercises','Encouraging seniors to perform physical activities, such as walking, stretching, or chair exercises, to maintain mobility, balance, and overall health.'),
('Companionship','Shopping','Assisting seniors with grocery shopping or other errands, such as picking up prescriptions or buying household supplies, to ensure they have access to the items they need and remain independent.'),
('Mental Support','Emotional Support','Offering comfort, empathy, and encouragement to seniors, and helping them to cope with emotional challenges such as grief, loneliness, or stress.'),
('Mental Support','Conversation','Engaging in meaningful conversations with seniors, such as reminiscing about their life experiences, discussing current events, or exploring new topics, to promote cognitive stimulation and social interaction.'),
('Mental Support','Mental health Monitering','Observing and tracking seniors mental health, including symptoms such as confusion, forgetfulness, or mood swings, to detect any potential problems early and take appropriate action.'),
('Medical Service','Medication Mangement','Assisting seniors with managing their medications, including organizing, reminding them to take them, and ensuring they are taken as prescribed.'),
('Medical Service','Health Monitoring', 'Keeping track of seniors health, including vital signs such as blood pressure, heart rate, and weight, to detect any changes or issues that need attention.'),
('Medical Service','Doctor Communication',' Facilitating communication between seniors and their healthcare providers, such as scheduling appointments, relaying information, or asking questions.'),
('Medical Service','Pharmacist Communication','Facilitating communication between seniors and their pharmacists, such as refilling prescriptions, discussing side effects, or addressing concerns related to medications.');
