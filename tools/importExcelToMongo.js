/**
 * Excel to MongoDB Import Script
 * 
 * This script imports matrimonial profiles from an Excel file to MongoDB.
 * 
 * Prerequisites:
 * - npm install xlsx mongodb
 * - MongoDB connection string
 * 
 * Usage:
 * node tools/importExcelToMongo.js path/to/profiles.xlsx
 * 
 * Excel Column Mapping:
 * Column A: First Name → firstName
 * Column B: Middle Name → middleName
 * Column C: Last Name → lastName
 * Column D: Email → email
 * Column E: Phone → phone
 * Column F: DOB (YYYY-MM-DD) → dob
 * Column G: Gender (male/female/other) → gender
 * Column H: City → city
 * Column I: State → state
 * Column J: Pincode → pincode
 * Column K: Caste → caste
 * Column L: Sub-caste → subCaste
 * Column M: Education → education
 * Column N: Occupation → occupation
 * Column O: Annual Income → annualIncome
 * Column P: Father's Name → familyDetails.fatherName
 * Column Q: Mother's Name → familyDetails.motherName
 * Column R: Siblings → familyDetails.siblings
 * Column S: Bio → bio
 */

const XLSX = require('xlsx');
const { MongoClient } = require('mongodb');

// MongoDB connection string - update with your credentials
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'kadamvivah';
const COLLECTION_NAME = 'profiles';

async function importProfiles(excelFilePath) {
  try {
    // Read Excel file
    console.log('Reading Excel file:', excelFilePath);
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Skip header row and map columns to profile structure
    const profiles = rawData.slice(1).map((row, index) => {
      // Validate required fields
      if (!row[0] || !row[2] || !row[3] || !row[5]) {
        console.warn(`Skipping row ${index + 2}: Missing required fields`);
        return null;
      }

      return {
        firstName: row[0]?.trim(),
        middleName: row[1]?.trim() || '',
        lastName: row[2]?.trim(),
        email: row[3]?.trim().toLowerCase(),
        phone: row[4]?.toString().trim(),
        dob: row[5], // Should be in YYYY-MM-DD format
        gender: row[6]?.toLowerCase() || 'male',
        city: row[7]?.trim(),
        state: row[8]?.trim(),
        pincode: row[9]?.toString().trim(),
        caste: row[10]?.trim(),
        subCaste: row[11]?.trim() || '',
        education: row[12]?.trim(),
        occupation: row[13]?.trim(),
        annualIncome: row[14]?.trim() || '',
        familyDetails: {
          fatherName: row[15]?.trim() || '',
          motherName: row[16]?.trim() || '',
          siblings: row[17]?.trim() || ''
        },
        bio: row[18]?.trim() || '',
        photos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }).filter(profile => profile !== null);

    console.log(`Parsed ${profiles.length} valid profiles from Excel`);

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Insert profiles
    if (profiles.length > 0) {
      const result = await collection.insertMany(profiles);
      console.log(`Successfully inserted ${result.insertedCount} profiles`);
    } else {
      console.log('No valid profiles to insert');
    }

    // Close connection
    await client.close();
    console.log('Import completed successfully');

  } catch (error) {
    console.error('Error importing profiles:', error);
    process.exit(1);
  }
}

// Get Excel file path from command line arguments
const excelFilePath = process.argv[2];

if (!excelFilePath) {
  console.error('Usage: node importExcelToMongo.js <path-to-excel-file>');
  console.error('Example: node importExcelToMongo.js ./profiles.xlsx');
  process.exit(1);
}

// Run import
importProfiles(excelFilePath);
