// weeding.controler.js

import Wedding from "../models/wedding.model.js";

export const createWedding = async (req, res) => {
  try {
    const { groomName, brideName, weddingDate, createdBy } = req.body;

    console.log('📨 Creating wedding with data:', { groomName, brideName, weddingDate, createdBy });

    // ✅ VALIDATION
    if (!groomName || !brideName) {
      return res.status(400).json({ 
        success: false,
        error: "Groom and bride names are required" 
      });
    }

    // ✅ CREATE WEDDING WITH EXPLICIT CODE
    const weddingCode = Math.random().toString(36).substring(2, 10).toLowerCase();
    
    console.log('🔧 Generated code before creation:', weddingCode);

    const wedding = new Wedding({
      groomName: groomName.trim(),
      brideName: brideName.trim(),
      weddingDate: weddingDate || null,
      createdBy: createdBy || "Anonymous",
      code: weddingCode // ✅ EXPLICITLY SET THE CODE
    });

    console.log('🔧 Wedding object before save - Code:', wedding.code);

    // ✅ MANUAL VALIDATION
    if (!wedding.code || wedding.code.trim() === '') {
      throw new Error('Code generation failed');
    }

    await wedding.save();

    console.log('✅ Wedding created successfully. Code:', wedding.code);

    res.status(201).json({
      success: true,
      wedding: {
        code: wedding.code,
        groomName: wedding.groomName,
        brideName: wedding.brideName,
        weddingDate: wedding.weddingDate,
        createdAt: wedding.createdAt,
        shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tree/${wedding.code}`
      }
    });

  } catch (err) {
    console.error('❌ Error creating wedding:', err);
    
    if (err.code === 11000) {
      // Duplicate code - try again with completely new code
      try {
        console.log('🔄 Duplicate code detected, retrying...');
        const newWeddingCode = Math.random().toString(36).substring(2, 12).toLowerCase();
        
        const wedding = new Wedding({
          groomName: req.body.groomName.trim(),
          brideName: req.body.brideName.trim(),
          weddingDate: req.body.weddingDate || null,
          createdBy: req.body.createdBy || "Anonymous",
          code: newWeddingCode
        });

        await wedding.save();
        
        console.log('✅ Wedding created on retry. Code:', wedding.code);
        
        return res.status(201).json({
          success: true,
          wedding: {
            code: wedding.code,
            groomName: wedding.groomName,
            brideName: wedding.brideName,
            weddingDate: wedding.weddingDate,
            createdAt: wedding.createdAt,
            shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tree/${wedding.code}`
          }
        });
      } catch (retryError) {
        console.error('❌ Retry failed:', retryError);
        return res.status(400).json({ 
          success: false,
          error: "Failed to create wedding after multiple attempts" 
        });
      }
    }
    
    if (err.name === 'ValidationError') {
      console.error('❌ Mongoose validation error details:', err.errors);
      return res.status(400).json({ 
        success: false,
        error: Object.values(err.errors).map(e => e.message).join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: err.message || "Internal server error" 
    });
  }
};

export const getWedding = async (req, res) => {
  try {
    const { code } = req.params;
    
    console.log('🔍 Fetching wedding:', code);
    
    const wedding = await Wedding.findOne({ code, isActive: true });
    if (!wedding) {
      return res.status(404).json({ 
        success: false,
        error: "Wedding not found" 
      });
    }

    res.json({
      success: true,
      wedding: {
        code: wedding.code,
        groomName: wedding.groomName,
        brideName: wedding.brideName,
        weddingDate: wedding.weddingDate,
        createdAt: wedding.createdAt
      }
    });
  } catch (err) {
    console.error('❌ Error fetching wedding:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// ✅ ADD THIS MISSING EXPORT
export const deactivateWedding = async (req, res) => {
  try {
    const { code } = req.params;
    
    console.log('🔧 Deactivating wedding:', code);
    
    const wedding = await Wedding.findOne({ code });
    if (!wedding) {
      return res.status(404).json({ 
        success: false,
        error: "Wedding not found" 
      });
    }

    wedding.isActive = false;
    await wedding.save();

    console.log('✅ Wedding deactivated:', code);

    res.json({ 
      success: true,
      message: "Wedding deactivated successfully" 
    });
  } catch (err) {
    console.error('❌ Error deactivating wedding:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};