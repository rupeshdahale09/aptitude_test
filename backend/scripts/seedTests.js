const mongoose = require('mongoose');
const Test = require('../models/Test');
require('dotenv').config();

// Generate 50 questions for each test type
const generateQuantitativeQuestions = () => {
  const questions = [];
  
  // Math/Quantitative questions
  const mathQuestions = [
    { q: "What is 25% of 200?", opts: ["40", "50", "60", "75"], ans: 1 },
    { q: "If a train travels 120 km in 2 hours, what is its speed?", opts: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], ans: 1 },
    { q: "What is the square root of 144?", opts: ["10", "11", "12", "13"], ans: 2 },
    { q: "If 3x + 5 = 20, what is x?", opts: ["3", "4", "5", "6"], ans: 2 },
    { q: "What is 15 × 8?", opts: ["100", "110", "120", "130"], ans: 2 },
    { q: "If a rectangle has length 8 and width 5, what is its area?", opts: ["35", "40", "45", "50"], ans: 1 },
    { q: "What is 2³?", opts: ["4", "6", "8", "10"], ans: 2 },
    { q: "If 20% of a number is 40, what is the number?", opts: ["150", "200", "250", "300"], ans: 1 },
    { q: "What is the average of 10, 20, 30, 40, 50?", opts: ["25", "30", "35", "40"], ans: 1 },
    { q: "If a circle has radius 7, what is its area? (π = 22/7)", opts: ["154", "164", "174", "184"], ans: 0 },
    { q: "What is 144 ÷ 12?", opts: ["10", "11", "12", "13"], ans: 2 },
    { q: "If 5x = 35, what is x?", opts: ["5", "6", "7", "8"], ans: 2 },
    { q: "What is 7²?", opts: ["42", "49", "56", "63"], ans: 1 },
    { q: "If a triangle has base 10 and height 6, what is its area?", opts: ["25", "30", "35", "40"], ans: 1 },
    { q: "What is 3/4 of 80?", opts: ["50", "55", "60", "65"], ans: 2 },
    { q: "What is the next number: 2, 4, 8, 16, ?", opts: ["24", "28", "32", "36"], ans: 2 },
    { q: "If 30% of 500 is x, what is x?", opts: ["120", "150", "180", "200"], ans: 1 },
    { q: "What is 9 × 7?", opts: ["56", "63", "70", "77"], ans: 1 },
    { q: "If a number is increased by 20% to become 120, what was the original number?", opts: ["90", "100", "110", "115"], ans: 1 },
    { q: "What is 100 - 37?", opts: ["61", "63", "65", "67"], ans: 1 },
    { q: "If 4x - 8 = 12, what is x?", opts: ["3", "4", "5", "6"], ans: 2 },
    { q: "What is 6³?", opts: ["196", "206", "216", "226"], ans: 2 },
    { q: "What is the LCM of 6 and 8?", opts: ["20", "24", "28", "32"], ans: 1 },
    { q: "If a car travels 60 km in 1.5 hours, what is its speed?", opts: ["35 km/h", "40 km/h", "45 km/h", "50 km/h"], ans: 1 },
    { q: "What is 11 × 11?", opts: ["110", "121", "132", "143"], ans: 1 },
    { q: "If 2/3 of a number is 24, what is the number?", opts: ["32", "34", "36", "38"], ans: 2 },
    { q: "What is 5! (5 factorial)?", opts: ["100", "110", "120", "130"], ans: 2 },
    { q: "If a square has side 9, what is its area?", opts: ["72", "81", "90", "99"], ans: 1 },
    { q: "What is 17 + 28?", opts: ["43", "44", "45", "46"], ans: 2 },
    { q: "If 8x = 64, what is x?", opts: ["6", "7", "8", "9"], ans: 2 },
    { q: "What is 50% of 180?", opts: ["80", "85", "90", "95"], ans: 2 },
    { q: "If 3y + 12 = 30, what is y?", opts: ["4", "5", "6", "7"], ans: 2 },
    { q: "What is 13 × 4?", opts: ["48", "50", "52", "54"], ans: 2 },
    { q: "What is the HCF of 12 and 18?", opts: ["4", "5", "6", "7"], ans: 2 },
    { q: "If a number is divided by 5 and the result is 15, what is the number?", opts: ["65", "70", "75", "80"], ans: 2 },
    { q: "What is 8²?", opts: ["56", "64", "72", "80"], ans: 1 },
    { q: "If 25% of x is 50, what is x?", opts: ["150", "200", "250", "300"], ans: 1 },
    { q: "What is 19 + 27?", opts: ["44", "45", "46", "47"], ans: 2 },
    { q: "If a rectangle has perimeter 30 and length 10, what is its width?", opts: ["3", "4", "5", "6"], ans: 2 },
    { q: "What is 14 × 5?", opts: ["60", "65", "70", "75"], ans: 2 },
    { q: "If 6x = 42, what is x?", opts: ["6", "7", "8", "9"], ans: 1 },
    { q: "What is 3/5 of 100?", opts: ["50", "55", "60", "65"], ans: 2 },
    { q: "What is the next number: 5, 10, 15, 20, ?", opts: ["23", "24", "25", "26"], ans: 2 },
    { q: "If 40% of 250 is x, what is x?", opts: ["90", "100", "110", "120"], ans: 1 },
    { q: "What is 16 × 3?", opts: ["46", "48", "50", "52"], ans: 1 },
    { q: "If a number is multiplied by 3 and then 5 is added, the result is 26. What is the number?", opts: ["5", "6", "7", "8"], ans: 2 },
    { q: "What is 12²?", opts: ["132", "142", "144", "154"], ans: 2 },
    { q: "If 7x - 14 = 21, what is x?", opts: ["4", "5", "6", "7"], ans: 1 },
    { q: "What is 18 + 19?", opts: ["35", "36", "37", "38"], ans: 2 },
    { q: "If a cube has side 4, what is its volume?", opts: ["48", "56", "64", "72"], ans: 2 },
  ];

  // Fill to 50 questions by duplicating and modifying
  for (let i = 0; i < 50; i++) {
    const baseQ = mathQuestions[i % mathQuestions.length];
    questions.push({
      question: `${baseQ.q} (Question ${i + 1})`,
      options: [...baseQ.opts],
      correctAnswer: baseQ.ans,
      marks: 1,
    });
  }

  return questions;
};

const generateLogicalReasoningQuestions = () => {
  const questions = [];
  
  const logicQuestions = [
    { q: "If all roses are flowers and some flowers are red, which statement is true?", opts: ["All roses are red", "Some roses are red", "No roses are red", "Cannot be determined"], ans: 1 },
    { q: "What comes next: A, C, E, G, ?", opts: ["H", "I", "J", "K"], ans: 1 },
    { q: "If Monday is the first day, what day is the 10th day?", opts: ["Wednesday", "Thursday", "Friday", "Saturday"], ans: 1 },
    { q: "Complete: 2, 6, 12, 20, ?", opts: ["28", "30", "32", "34"], ans: 1 },
    { q: "If CAT is coded as 3120, how is DOG coded?", opts: ["4157", "4158", "4159", "4160"], ans: 0 },
    { q: "What is the opposite of 'always'?", opts: ["Never", "Sometimes", "Rarely", "Often"], ans: 0 },
    { q: "If 5 books cost $25, how much do 8 books cost?", opts: ["$35", "$38", "$40", "$45"], ans: 2 },
    { q: "What comes next: 1, 4, 9, 16, ?", opts: ["20", "24", "25", "30"], ans: 2 },
    { q: "If all birds can fly and penguins are birds, can penguins fly?", opts: ["Yes", "No", "Maybe", "Cannot determine"], ans: 1 },
    { q: "Complete: 3, 6, 9, 12, ?", opts: ["14", "15", "16", "18"], ans: 1 },
    { q: "If RED is to COLOR as APPLE is to?", opts: ["Fruit", "Tree", "Seed", "Juice"], ans: 0 },
    { q: "What is the missing number: 5, 10, ?, 20, 25", opts: ["12", "14", "15", "18"], ans: 2 },
    { q: "If today is Wednesday, what day was 3 days ago?", opts: ["Sunday", "Monday", "Tuesday", "Thursday"], ans: 0 },
    { q: "Complete: Z, Y, X, W, ?", opts: ["U", "V", "T", "S"], ans: 1 },
    { q: "If all students study and John is a student, does John study?", opts: ["Yes", "No", "Maybe", "Cannot determine"], ans: 0 },
    { q: "What comes next: 1, 3, 6, 10, ?", opts: ["12", "14", "15", "18"], ans: 2 },
    { q: "If DOG is to PUPPY, CAT is to?", opts: ["Kitten", "Cub", "Chick", "Calf"], ans: 0 },
    { q: "Complete: 7, 14, 21, 28, ?", opts: ["32", "34", "35", "38"], ans: 2 },
    { q: "What is the pattern: 2, 4, 8, 16, ?", opts: ["24", "28", "32", "36"], ans: 2 },
    { q: "If all cars have wheels and a bicycle has wheels, is a bicycle a car?", opts: ["Yes", "No", "Maybe", "Cannot determine"], ans: 1 },
    { q: "Complete: A, D, G, J, ?", opts: ["K", "L", "M", "N"], ans: 2 },
    { q: "What comes next: 10, 20, 30, 40, ?", opts: ["45", "50", "55", "60"], ans: 1 },
    { q: "If BOOK is to READ, MOVIE is to?", opts: ["Watch", "See", "View", "Look"], ans: 0 },
    { q: "Complete: 1, 2, 4, 8, ?", opts: ["12", "14", "16", "18"], ans: 2 },
    { q: "What is the missing: 9, 18, 27, ?, 45", opts: ["32", "34", "36", "38"], ans: 2 },
    { q: "If all doctors are professionals and Mary is a doctor, is Mary a professional?", opts: ["Yes", "No", "Maybe", "Cannot determine"], ans: 0 },
    { q: "Complete: B, E, H, K, ?", opts: ["M", "N", "O", "P"], ans: 1 },
    { q: "What comes next: 4, 8, 12, 16, ?", opts: ["18", "20", "22", "24"], ans: 1 },
    { q: "If PEN is to PAPER, BRUSH is to?", opts: ["Canvas", "Paint", "Color", "Art"], ans: 0 },
    { q: "Complete: 6, 12, 18, 24, ?", opts: ["28", "30", "32", "36"], ans: 1 },
    { q: "What is the pattern: 1, 4, 9, 16, 25, ?", opts: ["30", "34", "36", "40"], ans: 2 },
    { q: "If all fruits are healthy and an apple is a fruit, is an apple healthy?", opts: ["Yes", "No", "Maybe", "Cannot determine"], ans: 0 },
    { q: "Complete: C, F, I, L, ?", opts: ["M", "N", "O", "P"], ans: 2 },
    { q: "What comes next: 11, 22, 33, 44, ?", opts: ["52", "54", "55", "56"], ans: 2 },
    { q: "If TEACHER is to STUDENT, DOCTOR is to?", opts: ["Patient", "Nurse", "Medicine", "Hospital"], ans: 0 },
    { q: "Complete: 8, 16, 24, 32, ?", opts: ["38", "40", "42", "48"], ans: 1 },
    { q: "What is the missing: 15, 30, ?, 60, 75", opts: ["40", "45", "50", "55"], ans: 1 },
    { q: "If all mammals are animals and a dog is a mammal, is a dog an animal?", opts: ["Yes", "No", "Maybe", "Cannot determine"], ans: 0 },
    { q: "Complete: D, G, J, M, ?", opts: ["N", "O", "P", "Q"], ans: 2 },
    { q: "What comes next: 13, 26, 39, 52, ?", opts: ["60", "63", "65", "68"], ans: 2 },
    { q: "If SHOE is to FOOT, HAT is to?", opts: ["Head", "Hair", "Face", "Ear"], ans: 0 },
    { q: "Complete: 5, 10, 15, 20, ?", opts: ["22", "24", "25", "28"], ans: 2 },
    { q: "What is the pattern: 2, 5, 10, 17, ?", opts: ["24", "26", "28", "30"], ans: 1 },
    { q: "If all vehicles have engines and a car is a vehicle, does a car have an engine?", opts: ["Yes", "No", "Maybe", "Cannot determine"], ans: 0 },
    { q: "Complete: E, H, K, N, ?", opts: ["O", "P", "Q", "R"], ans: 2 },
    { q: "What comes next: 14, 28, 42, 56, ?", opts: ["68", "70", "72", "75"], ans: 1 },
    { q: "If KEY is to LOCK, PASSWORD is to?", opts: ["Account", "Security", "Login", "Computer"], ans: 2 },
    { q: "Complete: 3, 9, 15, 21, ?", opts: ["25", "27", "28", "30"], ans: 1 },
    { q: "What is the missing: 20, 40, ?, 80, 100", opts: ["55", "60", "65", "70"], ans: 1 },
    { q: "If all books have pages and a novel is a book, does a novel have pages?", opts: ["Yes", "No", "Maybe", "Cannot determine"], ans: 0 },
  ];

  for (let i = 0; i < 50; i++) {
    const baseQ = logicQuestions[i % logicQuestions.length];
    questions.push({
      question: `${baseQ.q} (Question ${i + 1})`,
      options: [...baseQ.opts],
      correctAnswer: baseQ.ans,
      marks: 1,
    });
  }

  return questions;
};

const generateVerbalAbilityQuestions = () => {
  const questions = [];
  
  const verbalQuestions = [
    { q: "What is the synonym of 'Happy'?", opts: ["Sad", "Joyful", "Angry", "Tired"], ans: 1 },
    { q: "What is the antonym of 'Fast'?", opts: ["Quick", "Slow", "Rapid", "Swift"], ans: 1 },
    { q: "Choose the correct spelling:", opts: ["Recieve", "Receive", "Recive", "Receve"], ans: 1 },
    { q: "What is the meaning of 'Benevolent'?", opts: ["Kind", "Evil", "Lazy", "Smart"], ans: 0 },
    { q: "Fill in: The cat sat ___ the mat.", opts: ["on", "in", "at", "by"], ans: 0 },
    { q: "What is the synonym of 'Beautiful'?", opts: ["Ugly", "Pretty", "Bad", "Good"], ans: 1 },
    { q: "What is the antonym of 'Brave'?", opts: ["Courageous", "Fearless", "Cowardly", "Bold"], ans: 2 },
    { q: "Choose the correct word: I ___ to the store yesterday.", opts: ["go", "went", "gone", "going"], ans: 1 },
    { q: "What is the meaning of 'Abundant'?", opts: ["Scarce", "Plentiful", "Empty", "Full"], ans: 1 },
    { q: "Fill in: She is ___ than her sister.", opts: ["tall", "taller", "tallest", "tallly"], ans: 1 },
    { q: "What is the synonym of 'Big'?", opts: ["Small", "Large", "Tiny", "Little"], ans: 1 },
    { q: "What is the antonym of 'Light'?", opts: ["Bright", "Dark", "Shiny", "Clear"], ans: 1 },
    { q: "Choose the correct spelling:", opts: ["Seperate", "Separate", "Seperete", "Separete"], ans: 1 },
    { q: "What is the meaning of 'Diligent'?", opts: ["Lazy", "Hardworking", "Slow", "Fast"], ans: 1 },
    { q: "Fill in: They ___ playing football.", opts: ["is", "are", "am", "be"], ans: 1 },
    { q: "What is the synonym of 'Smart'?", opts: ["Dumb", "Intelligent", "Slow", "Fast"], ans: 1 },
    { q: "What is the antonym of 'Rich'?", opts: ["Wealthy", "Poor", "Happy", "Sad"], ans: 1 },
    { q: "Choose the correct word: He ___ a book every week.", opts: ["read", "reads", "reading", "readed"], ans: 1 },
    { q: "What is the meaning of 'Eloquent'?", opts: ["Quiet", "Fluent", "Loud", "Silent"], ans: 1 },
    { q: "Fill in: This is the ___ book I've ever read.", opts: ["good", "better", "best", "goodest"], ans: 2 },
    { q: "What is the synonym of 'Angry'?", opts: ["Happy", "Furious", "Calm", "Peaceful"], ans: 1 },
    { q: "What is the antonym of 'Old'?", opts: ["Ancient", "New", "Young", "Fresh"], ans: 2 },
    { q: "Choose the correct spelling:", opts: ["Definately", "Definitely", "Definetly", "Definitley"], ans: 1 },
    { q: "What is the meaning of 'Meticulous'?", opts: ["Careless", "Careful", "Quick", "Slow"], ans: 1 },
    { q: "Fill in: I have ___ finished my homework.", opts: ["already", "all ready", "allready", "alredy"], ans: 0 },
    { q: "What is the synonym of 'Tired'?", opts: ["Energetic", "Exhausted", "Active", "Lively"], ans: 1 },
    { q: "What is the antonym of 'Easy'?", opts: ["Simple", "Hard", "Soft", "Light"], ans: 1 },
    { q: "Choose the correct word: They ___ to school every day.", opts: ["go", "goes", "going", "gone"], ans: 0 },
    { q: "What is the meaning of 'Generous'?", opts: ["Selfish", "Kind", "Mean", "Stingy"], ans: 1 },
    { q: "Fill in: She is ___ intelligent student.", opts: ["a", "an", "the", "some"], ans: 1 },
    { q: "What is the synonym of 'Small'?", opts: ["Big", "Tiny", "Large", "Huge"], ans: 1 },
    { q: "What is the antonym of 'Hot'?", opts: ["Warm", "Cold", "Cool", "Freezing"], ans: 1 },
    { q: "Choose the correct spelling:", opts: ["Occured", "Occurred", "Ocurred", "Occured"], ans: 1 },
    { q: "What is the meaning of 'Optimistic'?", opts: ["Pessimistic", "Hopeful", "Sad", "Angry"], ans: 1 },
    { q: "Fill in: He ___ not like coffee.", opts: ["do", "does", "did", "done"], ans: 1 },
    { q: "What is the synonym of 'Quick'?", opts: ["Slow", "Fast", "Lazy", "Active"], ans: 1 },
    { q: "What is the antonym of 'Day'?", opts: ["Morning", "Night", "Evening", "Afternoon"], ans: 1 },
    { q: "Choose the correct word: We ___ studying for the exam.", opts: ["is", "are", "am", "be"], ans: 1 },
    { q: "What is the meaning of 'Persistent'?", opts: ["Giving up", "Determined", "Lazy", "Slow"], ans: 1 },
    { q: "Fill in: This is ___ interesting story.", opts: ["a", "an", "the", "some"], ans: 1 },
    { q: "What is the synonym of 'Sad'?", opts: ["Happy", "Unhappy", "Joyful", "Cheerful"], ans: 1 },
    { q: "What is the antonym of 'Begin'?", opts: ["Start", "End", "Continue", "Stop"], ans: 1 },
    { q: "Choose the correct spelling:", opts: ["Accomodate", "Accommodate", "Acommodate", "Accomadate"], ans: 1 },
    { q: "What is the meaning of 'Reliable'?", opts: ["Unreliable", "Trustworthy", "Dishonest", "False"], ans: 1 },
    { q: "Fill in: She ___ her homework yesterday.", opts: ["do", "did", "does", "done"], ans: 1 },
    { q: "What is the synonym of 'Large'?", opts: ["Small", "Big", "Tiny", "Little"], ans: 1 },
    { q: "What is the antonym of 'Love'?", opts: ["Like", "Hate", "Adore", "Cherish"], ans: 1 },
    { q: "Choose the correct word: I ___ a teacher.", opts: ["is", "am", "are", "be"], ans: 1 },
    { q: "What is the meaning of 'Sincere'?", opts: ["Fake", "Honest", "Dishonest", "False"], ans: 1 },
    { q: "Fill in: They are ___ friends.", opts: ["good", "well", "better", "best"], ans: 0 },
  ];

  for (let i = 0; i < 50; i++) {
    const baseQ = verbalQuestions[i % verbalQuestions.length];
    questions.push({
      question: `${baseQ.q} (Question ${i + 1})`,
      options: [...baseQ.opts],
      correctAnswer: baseQ.ans,
      marks: 1,
    });
  }

  return questions;
};

const seedTests = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI );
    console.log('Connected to MongoDB');

    // Clear existing tests (optional - comment out if you want to keep existing)
    // await Test.deleteMany({});
    // console.log('Cleared existing tests');

    // Check if tests already exist
    const existingTests = await Test.countDocuments();
    if (existingTests >= 3) {
      console.log('Tests already exist. Skipping seed.');
      await mongoose.connection.close();
      process.exit(0);
    }

    const tests = [
      {
        title: 'Quantitative Aptitude Test',
        description: 'Test your mathematical skills with 50 questions covering arithmetic, algebra, geometry, and problem-solving.',
        duration: 3600, // 60 minutes
        questions: generateQuantitativeQuestions(),
      },
      {
        title: 'Logical Reasoning Test',
        description: 'Evaluate your logical thinking and reasoning abilities with 50 questions on patterns, sequences, and logical deductions.',
        duration: 3600, // 60 minutes
        questions: generateLogicalReasoningQuestions(),
      },
      {
        title: 'Verbal Ability Test',
        description: 'Assess your English language skills with 50 questions on vocabulary, grammar, synonyms, antonyms, and comprehension.',
        duration: 3600, // 60 minutes
        questions: generateVerbalAbilityQuestions(),
      },
    ];

    // Calculate total marks for each test
    tests.forEach((test) => {
      test.totalMarks = test.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    });

    // Create tests
    const createdTests = await Test.insertMany(tests);

    console.log(`\n✅ Successfully created ${createdTests.length} tests:`);
    createdTests.forEach((test, index) => {
      console.log(`\n${index + 1}. ${test.title}`);
      console.log(`   - Duration: ${test.duration / 60} minutes`);
      console.log(`   - Questions: ${test.questions.length}`);
      console.log(`   - Total Marks: ${test.totalMarks}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding tests:', error);
    process.exit(1);
  }
};

seedTests();

