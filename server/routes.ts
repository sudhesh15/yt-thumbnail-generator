import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { refinePromptForThumbnail } from "./services/openai";
import { generateThumbnailImage, analyzeUploadedImage } from "./services/gemini";
import { insertThumbnailRequestSchema, customizationsSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Upload image endpoint
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Move file to permanent location with proper extension
      const fileExtension = path.extname(req.file.originalname);
      const newFileName = `${req.file.filename}${fileExtension}`;
      const newPath = path.join(uploadDir, newFileName);
      
      fs.renameSync(req.file.path, newPath);

      // For now, skip image analysis to allow uploads to work
      // const analysis = await analyzeUploadedImage(newPath);

      res.json({ 
        filePath: newFileName,
        analysis: "Image uploaded successfully - analysis will be performed during generation",
        originalName: req.file.originalname
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Create thumbnail request
  app.post("/api/thumbnail-requests", async (req, res) => {
    try {
      const validatedData = insertThumbnailRequestSchema.parse(req.body);
      const validatedCustomizations = customizationsSchema.parse(validatedData.customizations);
      
      const request = await storage.createThumbnailRequest({
        ...validatedData,
        customizations: validatedCustomizations,
      });
      
      res.json(request);
    } catch (error) {
      console.error("Create request error:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Refine prompt endpoint
  app.post("/api/thumbnail-requests/:id/refine", async (req, res) => {
    try {
      const { id } = req.params;
      const request = await storage.getThumbnailRequest(id);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      await storage.updateThumbnailRequest(id, { status: "processing" });

      const customizations = request.customizations as any;
      const refinedPrompt = await refinePromptForThumbnail({
        originalPrompt: request.originalPrompt,
        colorScheme: customizations.colorScheme,
        textOption: customizations.textOption,
        customText: customizations.customText,
        style: customizations.style,
        targetEmotion: customizations.targetEmotion,
      });

      const updatedRequest = await storage.updateThumbnailRequest(id, { 
        refinedPrompt 
      });

      res.json(updatedRequest);
    } catch (error) {
      console.error("Refine prompt error:", error);
      await storage.updateThumbnailRequest(req.params.id, { status: "failed" });
      res.status(500).json({ message: "Failed to refine prompt" });
    }
  });

  // Generate thumbnail endpoint
  app.post("/api/thumbnail-requests/:id/generate", async (req, res) => {
    try {
      const { id } = req.params;
      const request = await storage.getThumbnailRequest(id);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (!request.refinedPrompt) {
        return res.status(400).json({ message: "Prompt not refined yet" });
      }

      const outputPath = path.join(uploadDir, `generated_${id}.png`);
      const inputImagePath = request.uploadedImagePath ? path.join(uploadDir, request.uploadedImagePath) : undefined;
      
      console.log("Debug - Uploaded image path:", request.uploadedImagePath);
      console.log("Debug - Full input image path:", inputImagePath);
      console.log("Debug - Input image exists:", inputImagePath && fs.existsSync(inputImagePath));
      
      await generateThumbnailImage(request.refinedPrompt, outputPath, inputImagePath);

      const updatedRequest = await storage.updateThumbnailRequest(id, {
        generatedImagePath: `generated_${id}.png`,
        status: "completed"
      });

      res.json(updatedRequest);
    } catch (error) {
      console.error("Generate thumbnail error:", error);
      await storage.updateThumbnailRequest(req.params.id, { status: "failed" });
      res.status(500).json({ message: "Failed to generate thumbnail" });
    }
  });

  // Get thumbnail request
  app.get("/api/thumbnail-requests/:id", async (req, res) => {
    try {
      const request = await storage.getThumbnailRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Get request error:", error);
      res.status(500).json({ message: "Failed to get request" });
    }
  });

  // Serve uploaded and generated images
  app.get("/api/images/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Image not found" });
    }
    
    res.sendFile(filePath);
  });

  // Download generated thumbnail
  app.get("/api/download/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    
    res.download(filePath, `thumbnail_${Date.now()}.png`);
  });

  const httpServer = createServer(app);
  return httpServer;
}
