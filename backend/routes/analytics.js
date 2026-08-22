import express from 'express'; 
import { getDb } from '../db/index.js'; 
import { authenticateToken, authorizeRole } from '../middleware/auth.js'; 
