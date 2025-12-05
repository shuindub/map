import * as Drive from './driveService';
import { StorageStep, StorageSession } from '../types';

const ROOT_FOLDER_NAME = 'GeminiStudio_Storage';
const PROJECT_NAME = 'KethuRakhu_Analytics';

let currentSession: StorageSession | null = null;
let isInitialized = false;

// Format: 2024-10-27T14-30-00
const getTimestampStr = () => {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-').split('.')[0];
};

export const initializeStorage = async (): Promise<{ restored: boolean, lastSteps: StorageStep[] }> => {
  if (!Drive.isAuthorized()) return { restored: false, lastSteps: [] };
  if (isInitialized && currentSession) return { restored: true, lastSteps: [] }; // Already init

  try {
    // 1. Find or Create Root
    let rootId = await Drive.findFolder(ROOT_FOLDER_NAME);
    if (!rootId) rootId = await Drive.createFolder(ROOT_FOLDER_NAME);
    if (!rootId) throw new Error("Could not create root folder");

    // 2. Find or Create Project Folder
    let projectId = await Drive.findFolder(PROJECT_NAME, rootId);
    if (!projectId) projectId = await Drive.createFolder(PROJECT_NAME, rootId);
    if (!projectId) throw new Error("Could not create project folder");

    // 3. Check for existing sessions (Subfolders)
    const sessions = await Drive.listFiles(projectId);
    // Filter only folders
    // Note: listFiles returns mix, simplified here assuming naming convention is robust or we check mimeType if needed.
    // Ideally we'd filter by mimeType in the query, but for now we take the latest created.
    
    let activeSessionId = '';
    let activeSessionName = '';
    let restoredSteps: StorageStep[] = [];
    let startStep = 1;
    let didRestore = false;

    if (sessions.length > 0) {
      // Restore the most recent session
      const lastSession = sessions[0]; // Ordered by name desc in service, so latest timestamp comes first
      activeSessionId = lastSession.id;
      activeSessionName = lastSession.name;
      
      console.log(`Restoring session: ${activeSessionName}`);

      // Load steps
      const files = await Drive.listFiles(activeSessionId);
      const stepFiles = files.filter(f => f.name.startsWith('step_') && f.name.endsWith('.json')).sort((a, b) => a.name.localeCompare(b.name));
      
      // Determine next step number
      if (stepFiles.length > 0) {
        const lastFile = stepFiles[stepFiles.length - 1];
        const match = lastFile.name.match(/step_(\d+)\.json/);
        if (match) {
          startStep = parseInt(match[1]) + 1;
        }

        // Load content of last 5 steps for context
        const stepsToLoad = stepFiles.slice(-5);
        for (const f of stepsToLoad) {
          const content = await Drive.getFileContent(f.id);
          if (content) restoredSteps.push(content);
        }
        didRestore = true;
      }
    } else {
      // Create New Session
      activeSessionName = getTimestampStr();
      const newId = await Drive.createFolder(activeSessionName, projectId);
      if (!newId) throw new Error("Failed to create session folder");
      activeSessionId = newId;
      
      // Create Image Folders
      await Drive.createFolder('images', activeSessionId);
      // We could create input/output subfolders inside images here if needed
    }

    currentSession = {
      sessionId: activeSessionId,
      sessionName: activeSessionName,
      currentStep: startStep
    };
    
    isInitialized = true;
    console.log("Storage Initialized", currentSession);
    return { restored: didRestore, lastSteps: restoredSteps };

  } catch (e) {
    console.error("Storage Initialization Failed", e);
    return { restored: false, lastSteps: [] };
  }
};

export const saveStep = async (userInput: string, modelOutput: string): Promise<boolean> => {
  if (!currentSession || !Drive.isAuthorized()) return false;

  const stepNum = currentSession.currentStep.toString().padStart(3, '0');
  const fileName = `step_${stepNum}.json`;
  
  const stepData: StorageStep = {
    timestamp: new Date().toISOString(),
    step_number: currentSession.currentStep,
    user_input: userInput,
    model_output: modelOutput,
    image_inputs: [],
    image_outputs: []
  };

  console.log(`Saving ${fileName}...`);
  await Drive.createJsonFile(fileName, currentSession.sessionId, stepData);
  
  currentSession.currentStep++;
  return true;
};

export const getCurrentSession = () => currentSession;
