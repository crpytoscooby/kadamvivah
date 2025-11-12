const XLSX = require('xlsx');
const Profile = require('../models/Profile');
const ImportLog = require('../models/ImportLog');
const ExcelMapper = require('../utils/excelMapper');

/**
 * Import Controller
 * 
 * Handles Excel file upload and profile import/upsert.
 * Supports preview mode and custom column mapping.
 */

/**
 * Import profiles from Excel file
 * @route POST /api/admin/import-excel
 * @access Admin only
 */
exports.importExcel = async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { preview, mapping, sheetName } = req.query;
    const isPreview = preview === 'true';

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    
    // Get sheet (use specified sheet or first sheet)
    const targetSheet = sheetName || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[targetSheet];
    
    if (!worksheet) {
      return res.status(400).json({
        success: false,
        message: `Sheet "${targetSheet}" not found`
      });
    }

    // Convert to array of arrays
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    
    if (rawData.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Excel file must contain at least a header row and one data row'
      });
    }

    // First row is headers
    const headers = rawData[0];
    const dataRows = rawData.slice(1);

    // Initialize mapper
    const mapper = new ExcelMapper(mapping ? JSON.parse(mapping) : null);

    // Process rows
    const results = {
      totalRows: dataRows.length,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      details: []
    };

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNumber = i + 2; // +2 because Excel is 1-indexed and we skipped header

      // Skip empty rows
      if (row.every(cell => !cell || cell.toString().trim() === '')) {
        results.skipped++;
        results.details.push({
          row: rowNumber,
          status: 'skipped',
          message: 'Empty row'
        });
        continue;
      }

      // Map row to profile
      const { profile: profileData, errors: validationErrors } = mapper.mapRow(row, headers, rowNumber);

      if (validationErrors.length > 0) {
        results.errors++;
        results.details.push({
          row: rowNumber,
          status: 'error',
          message: validationErrors.join('; '),
          data: profileData
        });
        continue;
      }

      // Preview mode: just return parsed data without saving
      if (isPreview) {
        results.details.push({
          row: rowNumber,
          status: 'preview',
          message: 'Preview only - not saved',
          data: profileData
        });
        continue;
      }

      // Find existing profile (upsert logic)
      let existingProfile = null;
      
      // Priority 1: Match by email
      if (profileData.email) {
        existingProfile = await Profile.findOne({ email: profileData.email });
      }
      
      // Priority 2: Match by phone
      if (!existingProfile && profileData.phone) {
        existingProfile = await Profile.findOne({ phone: profileData.phone });
      }
      
      // Priority 3: Match by firstName + lastName + DOB
      if (!existingProfile && profileData.firstName && profileData.lastName && profileData.dob) {
        existingProfile = await Profile.findOne({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          dob: profileData.dob
        });
      }

      try {
        let savedProfile;
        
        if (existingProfile) {
          // Update existing profile
          Object.assign(existingProfile, profileData);
          existingProfile.updatedAt = new Date();
          savedProfile = await existingProfile.save();
          
          results.updated++;
          results.details.push({
            row: rowNumber,
            status: 'updated',
            message: 'Profile updated successfully',
            profileId: savedProfile._id
          });
        } else {
          // Create new profile
          profileData.createdBy = req.userId;
          const newProfile = new Profile(profileData);
          savedProfile = await newProfile.save();
          
          results.inserted++;
          results.details.push({
            row: rowNumber,
            status: 'inserted',
            message: 'Profile created successfully',
            profileId: savedProfile._id
          });
        }
      } catch (error) {
        results.errors++;
        results.details.push({
          row: rowNumber,
          status: 'error',
          message: error.message || 'Database error',
          data: profileData
        });
      }
    }

    // Calculate duration
    const duration = Date.now() - startTime;

    // Save import log (only for actual imports, not previews)
    if (!isPreview) {
      try {
        const importLog = new ImportLog({
          importedBy: req.userId,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          sheetName: targetSheet,
          totalRows: results.totalRows,
          inserted: results.inserted,
          updated: results.updated,
          skipped: results.skipped,
          errors: results.errors,
          details: results.details,
          duration
        });
        await importLog.save();
      } catch (logError) {
        console.error('Error saving import log:', logError);
      }
    }

    // Return results
    res.json({
      success: true,
      message: isPreview ? 'Preview completed' : 'Import completed',
      preview: isPreview,
      results: {
        ...results,
        duration: `${duration}ms`,
        fileName: req.file.originalname,
        sheetName: targetSheet
      }
    });

  } catch (error) {
    console.error('Import error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Import failed: ' + error.message
    });
  }
};

/**
 * Get default column mapping
 * @route GET /api/admin/import-mapping
 * @access Admin only
 */
exports.getDefaultMapping = (req, res) => {
  try {
    const mapper = new ExcelMapper();
    res.json({
      success: true,
      mapping: mapper.mapping
    });
  } catch (error) {
    console.error('Error getting mapping:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mapping configuration'
    });
  }
};

/**
 * Get import history
 * @route GET /api/admin/import-history
 * @access Admin only
 */
exports.getImportHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const imports = await ImportLog.find()
      .populate('importedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ImportLog.countDocuments();

    res.json({
      success: true,
      imports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching import history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch import history'
    });
  }
};
