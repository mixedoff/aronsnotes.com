import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article, ArticleService } from '../../article.service';
import { Project, PROJECTS } from '../../data/projects.data';

export interface SkillNode {
  id: string;
  title: string;
  category: string;
  articles: Article[];
  project?: Project; // Add project data for project nodes
  unlocked: boolean;
  position: { x: number; y: number };
  connections: string[];
  color?: string; // Add color property
  level?: number; // Add level for graph positioning
}

@Component({
  selector: 'app-skill-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-tree.component.html',
  styleUrls: ['./skill-tree.component.css'],
})
export class SkillTreeComponent implements OnInit, OnDestroy {
  @Input() sourceScreen: 'booknotes' | 'articles' | 'main-menu' | 'about' | 'personal' = 'booknotes';
  @Output() articleClicked = new EventEmitter<Article>();
  @Output() closeClicked = new EventEmitter<void>();

  skillNodes: SkillNode[] = [];
  filteredArticles: Article[] = [];
  currentView: 'folders' | 'technologies' | 'projects' = 'folders';
  
  // Zoom and pan properties
  scale: number = 1;
  translateX: number = 0;
  translateY: number = 0;
  isDragging: boolean = false;
  lastMouseX: number = 0;
  lastMouseY: number = 0;
  
  // Flicker animation properties
  private hasInitialized: boolean = false;
  private flickerTimeout: any;
  private flickerInterval: any;
  private flickerElements: HTMLElement[] = [];

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.initializeSkillTree();
    this.loadArticles();
    
    // Trigger flicker animation for subnodes on first load
    if (!this.hasInitialized) {
      this.hasInitialized = true;
      this.triggerFlickerAnimation();
    }
  }

  ngOnDestroy() {
    if (this.flickerTimeout) {
      clearTimeout(this.flickerTimeout);
    }
    if (this.flickerInterval) {
      clearInterval(this.flickerInterval);
    }
  }

  toggleView(view: 'folders' | 'technologies' | 'projects') {
    this.currentView = view;
    this.initializeSkillTree();
    this.loadArticles();
  }

  private initializeSkillTree() {
    // Get all articles first to extract categories
    this.articleService.resetToOriginal();
    const allArticles = this.articleService.getArticles();
    
    console.log('All articles:', allArticles.length);
    
    // Create skill nodes dynamically from the extracted data
    this.skillNodes = [];
    
    if (this.currentView === 'technologies') {
      this.initializeTechnologyView(allArticles);
    } else if (this.currentView === 'projects') {
      this.initializeProjectView(allArticles);
    } else {
      this.initializeFolderView(allArticles);
    }
    
    // Clean up: Remove any nodes with empty titles
    this.skillNodes = this.skillNodes.filter(node => 
      node.title && node.title.trim() !== '' && node.title !== 'Undefined'
    );
    
    // Second pass: Calculate positions now that all nodes exist
    this.calculateAllPositions();
    
    console.log('Skill nodes created:', this.skillNodes.length);
  }

  private initializeFolderView(allArticles: Article[]) {
    // Extract all unique folders, subFolders, and subSubFolders
    const allFolders = new Set<string>();
    const allSubFolders = new Set<string>();
    const allSubSubFolders = new Set<string>();
    
    allArticles.forEach(article => {
      article.folder.forEach(f => {
        if (f && f.trim() !== '') {
          allFolders.add(f);
        }
      });
      article.subFolder.forEach(sf => {
        if (sf && sf.trim() !== '') {
          allSubFolders.add(sf);
        }
      });
      article.subSubFolder.forEach(ssf => {
        if (ssf && ssf.trim() !== '') {
          allSubSubFolders.add(ssf);
        }
      });
    });
    
    console.log('Folders:', Array.from(allFolders));
    console.log('SubFolders:', Array.from(allSubFolders));
    console.log('SubSubFolders:', Array.from(allSubSubFolders));
    
    // First pass: Create all nodes without positioning
    allFolders.forEach((folder, index) => {
      if (folder && folder.trim() !== '') {
        this.skillNodes.push({
          id: `folder-${folder}-${index}`, // Ensure unique IDs
          title: this.capitalizeFirst(folder),
          category: 'Main Category',
          articles: [],
          unlocked: true,
          position: { x: 0, y: 0 }, // Temporary position
          connections: []
        });
      }
    });
    
    const subFolderArray = Array.from(allSubFolders);
    subFolderArray.forEach((subFolder, index) => {
      if (subFolder && subFolder.trim() !== '') {
        // Create branching connections - each subfolder connects to main folders
        const connections: string[] = [];
        
        // Connect to main folders based on the subfolder's content
        const articlesWithThisSubFolder = allArticles.filter(article => 
          article.subFolder.includes(subFolder)
        );
        
        // Find which main folders this subfolder should connect to
        const mainFoldersForThisSubFolder = new Set<string>();
        articlesWithThisSubFolder.forEach(article => {
          article.folder.forEach(folder => {
            if (folder && folder.trim() !== '') {
              mainFoldersForThisSubFolder.add(folder);
            }
          });
        });
        
        // Connect to the actual main folder nodes
        mainFoldersForThisSubFolder.forEach(folder => {
          const mainFolderNode = this.skillNodes.find(node => 
            node.id.startsWith(`folder-${folder}-`)
          );
          if (mainFolderNode) {
            connections.push(mainFolderNode.id);
          }
        });
        
        // If no connections found, connect to all main folders as fallback
        if (connections.length === 0) {
          this.skillNodes.forEach(node => {
            if (node.id.startsWith('folder-')) {
              connections.push(node.id);
            }
          });
        }
        
        this.skillNodes.push({
          id: `subfolder-${subFolder}-${index}`, // Ensure unique IDs
          title: this.capitalizeFirst(subFolder),
          category: 'Sub Category',
          articles: [],
          unlocked: true,
          position: { x: 0, y: 0 }, // Temporary position
          connections: connections
        });
      }
    });
    
    const subSubFolderArray = Array.from(allSubSubFolders);
    subSubFolderArray.forEach((subSubFolder, index) => {
      if (subSubFolder && subSubFolder.trim() !== '') {
        // Create connections based on actual article data
        const connections: string[] = [];
        
        // Connect to subfolders based on the sub-subfolder's content
        const articlesWithThisSubSubFolder = allArticles.filter(article => 
          article.subSubFolder.includes(subSubFolder)
        );
        
        // Find which subfolders this sub-subfolder should connect to
        const subFoldersForThisSubSubFolder = new Set<string>();
        articlesWithThisSubSubFolder.forEach(article => {
          article.subFolder.forEach(subFolder => {
            if (subFolder && subFolder.trim() !== '') {
              subFoldersForThisSubSubFolder.add(subFolder);
            }
          });
        });
        
        // Connect to the actual subfolder nodes
        subFoldersForThisSubSubFolder.forEach(subFolder => {
          const subFolderNode = this.skillNodes.find(node => 
            node.id.startsWith(`subfolder-${subFolder}-`)
          );
          if (subFolderNode) {
            connections.push(subFolderNode.id);
          }
        });
        
        // If no connections found, connect to all subfolders as fallback
        if (connections.length === 0) {
          this.skillNodes.forEach(node => {
            if (node.id.startsWith('subfolder-')) {
              connections.push(node.id);
            }
          });
        }
        
        this.skillNodes.push({
          id: `subsubfolder-${subSubFolder}-${index}`, // Ensure unique IDs
          title: this.capitalizeFirst(subSubFolder),
          category: 'Detailed Category',
          articles: [],
          unlocked: true,
          position: { x: 0, y: 0 }, // Temporary position
          connections: connections
        });
      }
    });
  }

  private initializeTechnologyView(allArticles: Article[]) {
    // Extract all unique technologies
    const allTechnologies = new Set<string>();
    
    allArticles.forEach(article => {
      article.technologies.forEach(tech => {
        if (tech && tech.trim() !== '') {
          allTechnologies.add(tech);
        }
      });
    });
    
    console.log('Technologies:', Array.from(allTechnologies));
    
    // Keep main folders as they are
    const allFolders = new Set<string>();
    allArticles.forEach(article => {
      article.folder.forEach(f => {
        if (f && f.trim() !== '') {
          allFolders.add(f);
        }
      });
    });
    
    // Create main folder nodes
    allFolders.forEach((folder, index) => {
      if (folder && folder.trim() !== '') {
        this.skillNodes.push({
          id: `folder-${folder}-${index}`,
          title: this.capitalizeFirst(folder),
          category: 'Main Category',
          articles: [],
          unlocked: true,
          position: { x: 0, y: 0 },
          connections: []
        });
      }
    });
    
    // Create technology nodes that connect to main folders
    const technologyArray = Array.from(allTechnologies);
    technologyArray.forEach((technology, index) => {
      if (technology && technology.trim() !== '') {
        const connections: string[] = [];
        
        // Find which main folders this technology should connect to
        const articlesWithThisTech = allArticles.filter(article => 
          article.technologies.includes(technology)
        );
        
        const mainFoldersForThisTech = new Set<string>();
        articlesWithThisTech.forEach(article => {
          article.folder.forEach(folder => {
            if (folder && folder.trim() !== '') {
              mainFoldersForThisTech.add(folder);
            }
          });
        });
        
        // Connect to the actual main folder nodes
        mainFoldersForThisTech.forEach(folder => {
          const mainFolderNode = this.skillNodes.find(node => 
            node.id.startsWith(`folder-${folder}-`)
          );
          if (mainFolderNode) {
            connections.push(mainFolderNode.id);
          }
        });
        
        // If no connections found, connect to all main folders as fallback
        if (connections.length === 0) {
          this.skillNodes.forEach(node => {
            if (node.id.startsWith('folder-')) {
              connections.push(node.id);
            }
          });
        }
        
        this.skillNodes.push({
          id: `technology-${technology}-${index}`,
          title: this.capitalizeFirst(technology),
          category: 'Technology',
          articles: [],
          unlocked: true,
          position: { x: 0, y: 0 },
          connections: connections
        });
      }
    });
  }

  private initializeProjectView(allArticles: Article[]) {
    // Keep main folders as they are
    const allFolders = new Set<string>();
    allArticles.forEach(article => {
      article.folder.forEach(f => {
        if (f && f.trim() !== '') {
          allFolders.add(f);
        }
      });
    });
    
    // Create main folder nodes
    allFolders.forEach((folder, index) => {
      if (folder && folder.trim() !== '') {
        this.skillNodes.push({
          id: `folder-${folder}-${index}`,
          title: this.capitalizeFirst(folder),
          category: 'Main Category',
          articles: [],
          unlocked: true,
          position: { x: 0, y: 0 },
          connections: []
        });
      }
    });
    
    // Create project nodes using the project data
    PROJECTS.forEach((project, index) => {
      const connections: string[] = [];
      
      // Connect to the main folder based on project category
      const mainFolderNode = this.skillNodes.find(node => 
        node.id.startsWith(`folder-${project.category}-`)
      );
      if (mainFolderNode) {
        connections.push(mainFolderNode.id);
      }
      
      // If no connection found, connect to all main folders as fallback
      if (connections.length === 0) {
        this.skillNodes.forEach(node => {
          if (node.id.startsWith('folder-')) {
            connections.push(node.id);
          }
        });
      }
      
      this.skillNodes.push({
        id: `project-${project.id}-${index}`,
        title: project.name,
        category: 'Project',
        articles: [],
        project: project,
        unlocked: true,
        position: { x: 0, y: 0 },
        connections: connections
      });
    });
  }

  private loadArticles() {
    // Get all articles - for booknotes screen, we want all articles
    this.articleService.resetToOriginal();
    this.filteredArticles = this.articleService.getArticles();
    
    console.log('Filtered articles:', this.filteredArticles.length);
    
    // Categorize articles into skill nodes
    this.categorizeArticles();
  }

  private categorizeArticles() {
    this.skillNodes.forEach(node => {
      node.articles = this.filteredArticles.filter(article => {
        if (this.currentView === 'technologies') {
          // Technology view: match based on folder and technology
          if (node.id.startsWith('folder-')) {
            // Extract folder name by removing 'folder-' prefix and any trailing index
            const folderName = node.id.replace(/^folder-/, '').replace(/-\d+$/, '');
            return article.folder.includes(folderName);
          } else if (node.id.startsWith('technology-')) {
            // Extract technology name by removing 'technology-' prefix and any trailing index
            const technologyName = node.id.replace(/^technology-/, '').replace(/-\d+$/, '');
            return article.technologies.includes(technologyName);
          }
        } else if (this.currentView === 'projects') {
          // Project view: match based on folder and project
          if (node.id.startsWith('folder-')) {
            // Extract folder name by removing 'folder-' prefix and any trailing index
            const folderName = node.id.replace(/^folder-/, '').replace(/-\d+$/, '');
            return article.folder.includes(folderName);
          } else if (node.id.startsWith('project-')) {
            // Extract project name by removing 'project-' prefix and any trailing index
            const projectName = node.id.replace(/^project-/, '').replace(/-\d+$/, '');
            return article.project === projectName;
          }
        } else {
          // Folder view: match articles to skill nodes based on their folder structure
          if (node.id.startsWith('folder-')) {
            // Extract folder name by removing 'folder-' prefix and any trailing index
            const folderName = node.id.replace(/^folder-/, '').replace(/-\d+$/, '');
            return article.folder.includes(folderName);
          } else if (node.id.startsWith('subfolder-')) {
            // Extract subfolder name by removing 'subfolder-' prefix and any trailing index
            const subFolderName = node.id.replace(/^subfolder-/, '').replace(/-\d+$/, '');
            return article.subFolder.includes(subFolderName);
          } else if (node.id.startsWith('subsubfolder-')) {
            // Extract sub-subfolder name by removing 'subsubfolder-' prefix and any trailing index
            const subSubFolderName = node.id.replace(/^subsubfolder-/, '').replace(/-\d+$/, '');
            return article.subSubFolder.includes(subSubFolderName);
          }
        }
        return false;
      });
      
      if (node.articles.length > 0) {
        console.log(`Node ${node.title} has ${node.articles.length} articles`);
        node.articles.forEach(article => {
          console.log(`  - ${article.title} (ID: ${article.id})`);
        });
      }
    });
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
  }

  private calculateAllPositions() {
    const mainFolders = ['design', 'development', 'writing'];
    const colors = {
      'design': '#3A94DE',
      'development': '#6ffa1e',
      'writing': '#c6c8c8'
    };
    
    // First pass: assign colors to main folders
    this.skillNodes.forEach(node => {
      const nodeName = node.title.toLowerCase();
      
      if (mainFolders.includes(nodeName)) {
        node.color = colors[nodeName as keyof typeof colors];
        node.level = 0;
      }
    });
    
    // Second pass: assign colors to subnodes based on their parent folder
    this.skillNodes.forEach(node => {
      if (node.color) return; // Skip if already colored (main folders)
      
      // Find the parent folder color based on connections
      let parentColor = '#95A5A6'; // Default fallback color
      
      if (node.connections.length > 0) {
        const parentNode = this.skillNodes.find(parent => 
          node.connections.includes(parent.id) && parent.color
        );
        if (parentNode) {
          parentColor = parentNode.color!;
        }
      }
      
      // Assign the parent's color to all subnodes
      node.color = parentColor;
      
      // Set appropriate levels
      if (this.currentView === 'technologies' && node.id.startsWith('technology-')) {
        node.level = 1;
      } else if (this.currentView === 'projects' && node.id.startsWith('project-')) {
        node.level = 1;
      } else if (this.currentView === 'folders' && node.id.startsWith('subfolder-')) {
        node.level = 1;
      } else if (this.currentView === 'folders' && node.id.startsWith('subsubfolder-')) {
        node.level = 2;
      }
    });
    
    // Position main folders first with fixed positions
    this.positionMainFolders();
    
    // Use force-directed graph layout for the rest
    this.forceDirectedLayout();
  }

  private positionMainFolders() {
    const mainFolders = ['design', 'development', 'writing'];
    
    this.skillNodes.forEach(node => {
      const nodeName = node.title.toLowerCase();
      
      if (mainFolders.includes(nodeName)) {
        const index = mainFolders.indexOf(nodeName);
        
        // Position main folders in a horizontal line at the bottom
        switch (index) {
          case 0: // Design
            node.position = { x: 20, y: 75 };
            break;
          case 1: // Development  
            node.position = { x: 50, y: 75 };
            break;
          case 2: // Writing
            node.position = { x: 80, y: 75 };
            break;
        }
      }
    });
  }

  private forceDirectedLayout() {
    const iterations = 200; // Reduced iterations for faster convergence
    const k = 30; // Reduced spring constant for gentler forces
    const c = 0.05; // Reduced damping factor
    const minDistance = 8; // Reduced minimum distance to allow closer nodes
    
    // Get main folder positions for hierarchical positioning
    const mainFolders = this.skillNodes.filter(node => node.id.startsWith('folder-'));
    const mainFolderPositions = mainFolders.map(node => ({
      id: node.id,
      x: node.position.x,
      y: node.position.y
    }));
    
    // Get non-main folder nodes
    const movableNodes = this.skillNodes.filter(node => 
      !node.id.startsWith('folder-')
    );
    
    // Initialize positions hierarchically above main folders
    movableNodes.forEach((node, index) => {
      // Force initialize position for all nodes to prevent (0,0) overlap
      if (node.position.x === 0 && node.position.y === 0) {
        if (this.currentView === 'technologies' && node.id.startsWith('technology-')) {
          // Position technologies in the middle layer above main folders
          const connectedMainFolders = node.connections
            .map(connId => mainFolders.find(mf => mf.id === connId))
            .filter(Boolean);
          
          if (connectedMainFolders.length > 0) {
            // Handle multi-folder nodes by finding the center position
            const connectedPositions = connectedMainFolders
              .map(folder => mainFolderPositions.find(pos => pos.id === folder!.id))
              .filter(Boolean);
            
            if (connectedPositions.length === 1) {
              // Single connection - position directly above
              const mainFolderPos = connectedPositions[0]!;
              const techIndex = movableNodes.filter(n => n.id.startsWith('technology-')).indexOf(node);
              const offsetX = (techIndex % 3 - 1) * 8;
              node.position = {
                x: Math.max(15, Math.min(85, mainFolderPos.x + offsetX)),
                y: Math.max(45, Math.min(65, mainFolderPos.y - 12 - (Math.floor(techIndex / 3) * 6)))
              };
            } else if (connectedPositions.length > 1) {
              // Multi-connection - position at center between connected folders
              const centerX = connectedPositions.reduce((sum, pos) => sum + pos!.x, 0) / connectedPositions.length;
              const centerY = connectedPositions.reduce((sum, pos) => sum + pos!.y, 0) / connectedPositions.length;
              
              const techIndex = movableNodes.filter(n => n.id.startsWith('technology-')).indexOf(node);
              const offsetX = (techIndex % 2 - 0.5) * 6; // Smaller offset for multi-folder nodes
              
              node.position = {
                x: Math.max(15, Math.min(85, centerX + offsetX)),
                y: Math.max(45, Math.min(65, centerY - 15 - (Math.floor(techIndex / 2) * 5)))
              };
              
              console.log(`Multi-folder technology ${node.id} positioned at center (${node.position.x}, ${node.position.y}) between ${connectedPositions.length} folders`);
            }
          } else {
            this.setGridPosition(node, index, movableNodes.length);
          }
        } else if (this.currentView === 'projects' && node.id.startsWith('project-')) {
          // Position projects in the middle layer above main folders
          const connectedMainFolders = node.connections
            .map(connId => mainFolders.find(mf => mf.id === connId))
            .filter(Boolean);
          
          if (connectedMainFolders.length > 0) {
            // Handle multi-folder nodes by finding the center position
            const connectedPositions = connectedMainFolders
              .map(folder => mainFolderPositions.find(pos => pos.id === folder!.id))
              .filter(Boolean);
            
            if (connectedPositions.length === 1) {
              // Single connection - position directly above
              const mainFolderPos = connectedPositions[0]!;
              const projectIndex = movableNodes.filter(n => n.id.startsWith('project-')).indexOf(node);
              const offsetX = (projectIndex % 3 - 1) * 8;
              node.position = {
                x: Math.max(15, Math.min(85, mainFolderPos.x + offsetX)),
                y: Math.max(45, Math.min(65, mainFolderPos.y - 12 - (Math.floor(projectIndex / 3) * 6)))
              };
            } else if (connectedPositions.length > 1) {
              // Multi-connection - position at center between connected folders
              const centerX = connectedPositions.reduce((sum, pos) => sum + pos!.x, 0) / connectedPositions.length;
              const centerY = connectedPositions.reduce((sum, pos) => sum + pos!.y, 0) / connectedPositions.length;
              
              const projectIndex = movableNodes.filter(n => n.id.startsWith('project-')).indexOf(node);
              const offsetX = (projectIndex % 2 - 0.5) * 6; // Smaller offset for multi-folder nodes
              
              node.position = {
                x: Math.max(15, Math.min(85, centerX + offsetX)),
                y: Math.max(45, Math.min(65, centerY - 15 - (Math.floor(projectIndex / 2) * 5)))
              };
              
              console.log(`Multi-folder project ${node.id} positioned at center (${node.position.x}, ${node.position.y}) between ${connectedPositions.length} folders`);
            }
          } else {
            this.setGridPosition(node, index, movableNodes.length);
          }
        } else if (this.currentView === 'folders' && node.id.startsWith('subfolder-')) {
          // Position subfolders in the middle layer above main folders
          const connectedMainFolders = node.connections
            .map(connId => mainFolders.find(mf => mf.id === connId))
            .filter(Boolean);
          
          if (connectedMainFolders.length > 0) {
            // Handle multi-folder nodes by finding the center position
            const connectedPositions = connectedMainFolders
              .map(folder => mainFolderPositions.find(pos => pos.id === folder!.id))
              .filter(Boolean);
            
            if (connectedPositions.length === 1) {
              // Single connection - position directly above
              const mainFolderPos = connectedPositions[0]!;
              const subfolderIndex = movableNodes.filter(n => n.id.startsWith('subfolder-')).indexOf(node);
              const offsetX = (subfolderIndex % 3 - 1) * 8;
              node.position = {
                x: Math.max(15, Math.min(85, mainFolderPos.x + offsetX)),
                y: Math.max(45, Math.min(65, mainFolderPos.y - 12 - (Math.floor(subfolderIndex / 3) * 6)))
              };
            } else if (connectedPositions.length > 1) {
              // Multi-connection - position at center between connected folders
              const centerX = connectedPositions.reduce((sum, pos) => sum + pos!.x, 0) / connectedPositions.length;
              const centerY = connectedPositions.reduce((sum, pos) => sum + pos!.y, 0) / connectedPositions.length;
              
              const subfolderIndex = movableNodes.filter(n => n.id.startsWith('subfolder-')).indexOf(node);
              const offsetX = (subfolderIndex % 2 - 0.5) * 6; // Smaller offset for multi-folder nodes
              
              node.position = {
                x: Math.max(15, Math.min(85, centerX + offsetX)),
                y: Math.max(45, Math.min(65, centerY - 15 - (Math.floor(subfolderIndex / 2) * 5)))
              };
              
              console.log(`Multi-folder subfolder ${node.id} positioned at center (${node.position.x}, ${node.position.y}) between ${connectedPositions.length} folders`);
            }
          } else {
            this.setGridPosition(node, index, movableNodes.length);
          }
        } else if (this.currentView === 'folders' && node.id.startsWith('subsubfolder-')) {
          // Position sub-subfolders in the top layer above subfolders
          const connectedSubFolders = node.connections
            .map(connId => this.skillNodes.find(n => n.id === connId && n.id.startsWith('subfolder-')))
            .filter(Boolean);
          
          if (connectedSubFolders.length > 0) {
            // Handle multi-subfolder nodes by finding the center position
            const connectedSubFolderPositions = connectedSubFolders
              .filter(subfolder => subfolder && subfolder.position.x !== 0)
              .map(subfolder => ({ x: subfolder!.position.x, y: subfolder!.position.y }));
            
            if (connectedSubFolderPositions.length === 1) {
              // Single subfolder connection
              const targetSubFolder = connectedSubFolderPositions[0];
              const subsubfolderIndex = movableNodes.filter(n => n.id.startsWith('subsubfolder-')).indexOf(node);
              const offsetX = (subsubfolderIndex % 4 - 1.5) * 6;
              node.position = {
                x: Math.max(20, Math.min(80, targetSubFolder.x + offsetX)),
                y: Math.max(15, Math.min(40, targetSubFolder.y - 15 - (Math.floor(subsubfolderIndex / 4) * 8)))
              };
            } else if (connectedSubFolderPositions.length > 1) {
              // Multi-subfolder connection - position at center
              const centerX = connectedSubFolderPositions.reduce((sum, pos) => sum + pos.x, 0) / connectedSubFolderPositions.length;
              const centerY = connectedSubFolderPositions.reduce((sum, pos) => sum + pos.y, 0) / connectedSubFolderPositions.length;
              
              const subsubfolderIndex = movableNodes.filter(n => n.id.startsWith('subsubfolder-')).indexOf(node);
              const offsetX = (subsubfolderIndex % 3 - 1) * 4; // Smaller offset for multi-subfolder nodes
              
              node.position = {
                x: Math.max(20, Math.min(80, centerX + offsetX)),
                y: Math.max(15, Math.min(40, centerY - 20 - (Math.floor(subsubfolderIndex / 3) * 6)))
              };
              
              console.log(`Multi-subfolder sub-subfolder ${node.id} positioned at center (${node.position.x}, ${node.position.y}) between ${connectedSubFolderPositions.length} subfolders`);
            } else {
              // No positioned subfolders yet, try main folders
              const connectedMainFolders = node.connections
                .map(connId => mainFolders.find(mf => mf.id === connId))
                .filter(Boolean);
              
              if (connectedMainFolders.length > 0) {
                const connectedMainPositions = connectedMainFolders
                  .map(folder => mainFolderPositions.find(pos => pos.id === folder!.id))
                  .filter(Boolean);
                
                if (connectedMainPositions.length === 1) {
                  const mainFolderPos = connectedMainPositions[0]!;
                  const subsubfolderIndex = movableNodes.filter(n => n.id.startsWith('subsubfolder-')).indexOf(node);
                  const offsetX = (subsubfolderIndex % 4 - 1.5) * 6;
                  node.position = {
                    x: Math.max(20, Math.min(80, mainFolderPos.x + offsetX)),
                    y: Math.max(15, Math.min(40, mainFolderPos.y - 30 - (Math.floor(subsubfolderIndex / 4) * 8)))
                  };
                } else if (connectedMainPositions.length > 1) {
                  // Multi-main folder connection
                  const centerX = connectedMainPositions.reduce((sum, pos) => sum + pos!.x, 0) / connectedMainPositions.length;
                  const centerY = connectedMainPositions.reduce((sum, pos) => sum + pos!.y, 0) / connectedMainPositions.length;
                  
                  const subsubfolderIndex = movableNodes.filter(n => n.id.startsWith('subsubfolder-')).indexOf(node);
                  const offsetX = (subsubfolderIndex % 3 - 1) * 4;
                  
                  node.position = {
                    x: Math.max(20, Math.min(80, centerX + offsetX)),
                    y: Math.max(15, Math.min(40, centerY - 35 - (Math.floor(subsubfolderIndex / 3) * 6)))
                  };
                  
                  console.log(`Multi-main-folder sub-subfolder ${node.id} positioned at center (${node.position.x}, ${node.position.y}) between ${connectedMainPositions.length} main folders`);
                } else {
                  this.setGridPosition(node, index, movableNodes.length);
                }
              } else {
                this.setGridPosition(node, index, movableNodes.length);
              }
            }
          } else {
            this.setGridPosition(node, index, movableNodes.length);
          }
        } else {
          // Fallback to grid positioning
          this.setGridPosition(node, index, movableNodes.length);
        }
      }
    });
    
    // Second pass: ensure ALL nodes have valid positions (no (0,0) positions)
    movableNodes.forEach((node, index) => {
      if (node.position.x === 0 && node.position.y === 0) {
        console.warn(`Node ${node.id} still at (0,0), forcing position`);
        this.setGridPosition(node, index, movableNodes.length);
      }
    });
    
    // Force-directed iterations with hierarchical attraction
    for (let iter = 0; iter < iterations; iter++) {
      const forces: { [key: string]: { x: number; y: number } } = {};
      
      // Initialize forces
      this.skillNodes.forEach(node => {
        forces[node.id] = { x: 0, y: 0 };
      });
      
      // Strong repulsive forces between all nodes
      for (let i = 0; i < this.skillNodes.length; i++) {
        for (let j = i + 1; j < this.skillNodes.length; j++) {
          const node1 = this.skillNodes[i];
          const node2 = this.skillNodes[j];
          
          const dx = node1.position.x - node2.position.x;
          const dy = node1.position.y - node2.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < minDistance) {
            // Gentler repulsion when too close
            const force = (minDistance - distance) * 2;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            forces[node1.id].x += fx;
            forces[node1.id].y += fy;
            forces[node2.id].x -= fx;
            forces[node2.id].y -= fy;
          } else if (distance > 0 && distance < minDistance * 1.5) {
            // Lighter repulsion in nearby area
            const force = k * k / (distance * distance * 2);
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            forces[node1.id].x += fx;
            forces[node1.id].y += fy;
            forces[node2.id].x -= fx;
            forces[node2.id].y -= fy;
          }
        }
      }
      
      // Strong hierarchical attractive forces between connected nodes
      this.skillNodes.forEach(node => {
        node.connections.forEach((connectionId, connectionIndex) => {
          const connectedNode = this.skillNodes.find(n => n.id === connectionId);
          if (connectedNode) {
            const dx = connectedNode.position.x - node.position.x;
            const dy = connectedNode.position.y - node.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
              // Different ideal distances and attraction for different connection types
              let idealDistance = 15;
              let attractionStrength = 0.1;
              
              // Main folder to technology connections (bottom to middle)
              if (connectedNode.id.startsWith('folder-') && node.id.startsWith('technology-')) {
                idealDistance = 18;
                attractionStrength = 0.15;
              }
              // Main folder to project connections (bottom to middle)
              else if (connectedNode.id.startsWith('folder-') && node.id.startsWith('project-')) {
                idealDistance = 18;
                attractionStrength = 0.15;
              }
              // Main folder to subfolder connections (bottom to middle)
              else if (connectedNode.id.startsWith('folder-') && node.id.startsWith('subfolder-')) {
                idealDistance = 18;
                attractionStrength = 0.15;
              }
              // Subfolder to sub-subfolder connections (middle to top)
              else if (node.id.startsWith('subsubfolder-') && connectedNode.id.startsWith('subfolder-')) {
                idealDistance = 16;
                attractionStrength = 0.12;
              }
              // Direct main folder to sub-subfolder connections (bottom to top)
              else if (node.id.startsWith('subsubfolder-') && connectedNode.id.startsWith('folder-')) {
                idealDistance = 25;
                attractionStrength = 0.08;
              }
              // Same level connections
              else {
                idealDistance = 12;
                attractionStrength = 0.06;
              }
              
              // Reduce force strength for secondary connections (multi-folder nodes)
              if (connectionIndex > 0) {
                attractionStrength *= 0.3; // Much weaker attraction for secondary connections
              }
              
              // Further reduce force for nodes with many connections to prevent conflicts
              if (node.connections.length > 2) {
                attractionStrength *= 0.7; // Reduce force for heavily connected nodes
              }
              
              const force = (distance - idealDistance) * attractionStrength;
              const fx = (dx / distance) * force;
              const fy = (dy / distance) * force;
              
              forces[node.id].x += fx;
              forces[node.id].y += fy;
            }
          }
        });
      });
      
      // Apply forces with damping (preserve main folder positions)
      this.skillNodes.forEach(node => {
        // Don't move main folders
        if (node.id.startsWith('folder-')) {
          return;
        }
        
        const force = forces[node.id];
        node.position.x += force.x * c;
        node.position.y += force.y * c;
        
        // Keep nodes within bounds and respect hierarchy (more conservative bounds)
        node.position.x = Math.max(10, Math.min(90, node.position.x));
        
        if (this.currentView === 'technologies' && node.id.startsWith('technology-')) {
          // Technologies stay in middle layer (y: 45-65) - tighter bounds
          node.position.y = Math.max(45, Math.min(65, node.position.y));
        } else if (this.currentView === 'projects' && node.id.startsWith('project-')) {
          // Projects stay in middle layer (y: 45-65) - tighter bounds
          node.position.y = Math.max(45, Math.min(65, node.position.y));
        } else if (this.currentView === 'folders' && node.id.startsWith('subfolder-')) {
          // Subfolders stay in middle layer (y: 45-65) - tighter bounds
          node.position.y = Math.max(45, Math.min(65, node.position.y));
        } else if (this.currentView === 'folders' && node.id.startsWith('subsubfolder-')) {
          // Sub-subfolders stay in top layer (y: 10-40) - tighter bounds
          node.position.y = Math.max(10, Math.min(40, node.position.y));
        } else {
          // Fallback for other nodes
          node.position.y = Math.max(5, Math.min(65, node.position.y));
        }
      });
    }
    
    // Final pass: ensure minimum spacing
    this.enforceMinimumSpacing();
  }

  private setGridPosition(node: any, index: number, totalNodes: number) {
    const cols = Math.ceil(Math.sqrt(totalNodes));
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    // Determine appropriate layer based on node type
    let baseY = 40; // Default middle layer
    let heightRange = 30;
    
    if (this.currentView === 'technologies' && node.id.startsWith('technology-')) {
      baseY = 65; // Middle layer for technologies
      heightRange = 20;
    } else if (this.currentView === 'projects' && node.id.startsWith('project-')) {
      baseY = 65; // Middle layer for projects
      heightRange = 20;
    } else if (this.currentView === 'folders' && node.id.startsWith('subfolder-')) {
      baseY = 65; // Middle layer for subfolders
      heightRange = 20;
    } else if (this.currentView === 'folders' && node.id.startsWith('subsubfolder-')) {
      baseY = 35; // Top layer for sub-subfolders
      heightRange = 20;
    }
    
    node.position = {
      x: Math.max(10, Math.min(90, 20 + (col / Math.max(cols - 1, 1)) * 60)),
      y: Math.max(10, Math.min(70, baseY + (row / Math.max(cols - 1, 1)) * heightRange))
    };
    
    console.log(`Grid positioned ${node.id} at (${node.position.x}, ${node.position.y})`);
  }

  private enforceMinimumSpacing() {
    const minDistance = 8; // Reduced minimum distance
    const maxIterations = 30; // Reduced iterations
    
    for (let iter = 0; iter < maxIterations; iter++) {
      let hasOverlap = false;
      
      // Check all pairs of non-main folder nodes
      const movableNodes = this.skillNodes.filter(node => 
        !node.id.startsWith('folder-')
      );
      
      for (let i = 0; i < movableNodes.length; i++) {
        for (let j = i + 1; j < movableNodes.length; j++) {
          const node1 = movableNodes[i];
          const node2 = movableNodes[j];
          
          const dx = node1.position.x - node2.position.x;
          const dy = node1.position.y - node2.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < minDistance) {
            hasOverlap = true;
            
            // Push nodes apart more gently
            const pushDistance = (minDistance - distance) / 3; // Gentler push
            const angle = Math.atan2(dy, dx);
            
            const pushX = Math.cos(angle) * pushDistance;
            const pushY = Math.sin(angle) * pushDistance;
            
            node1.position.x += pushX;
            node1.position.y += pushY;
            node2.position.x -= pushX;
            node2.position.y -= pushY;
            
            // Keep within bounds with hierarchy
            node1.position.x = Math.max(5, Math.min(95, node1.position.x));
            node2.position.x = Math.max(5, Math.min(95, node2.position.x));
            
            // Respect hierarchy bounds
            if (this.currentView === 'technologies' && node1.id.startsWith('technology-')) {
              node1.position.y = Math.max(40, Math.min(70, node1.position.y));
            } else if (this.currentView === 'projects' && node1.id.startsWith('project-')) {
              node1.position.y = Math.max(40, Math.min(70, node1.position.y));
            } else if (this.currentView === 'folders' && node1.id.startsWith('subfolder-')) {
              node1.position.y = Math.max(40, Math.min(70, node1.position.y));
            } else if (this.currentView === 'folders' && node1.id.startsWith('subsubfolder-')) {
              node1.position.y = Math.max(5, Math.min(45, node1.position.y));
            } else {
              node1.position.y = Math.max(5, Math.min(70, node1.position.y));
            }
            
            if (this.currentView === 'technologies' && node2.id.startsWith('technology-')) {
              node2.position.y = Math.max(40, Math.min(70, node2.position.y));
            } else if (this.currentView === 'projects' && node2.id.startsWith('project-')) {
              node2.position.y = Math.max(40, Math.min(70, node2.position.y));
            } else if (this.currentView === 'folders' && node2.id.startsWith('subfolder-')) {
              node2.position.y = Math.max(40, Math.min(70, node2.position.y));
            } else if (this.currentView === 'folders' && node2.id.startsWith('subsubfolder-')) {
              node2.position.y = Math.max(5, Math.min(45, node2.position.y));
            } else {
              node2.position.y = Math.max(5, Math.min(70, node2.position.y));
            }
          }
        }
      }
      
      if (!hasOverlap) {
        break;
      }
    }
  }


  private findParentFolderForSubFolder(subFolder: string, allArticles: Article[]): string | null {
    const articlesWithThisSubFolder = allArticles.filter(article => 
      article.subFolder.includes(subFolder)
    );
    
    const folderCounts: { [key: string]: number } = {};
    articlesWithThisSubFolder.forEach(article => {
      article.folder.forEach(folder => {
        folderCounts[folder] = (folderCounts[folder] || 0) + 1;
      });
    });
    
    const mostCommonFolder = Object.keys(folderCounts).reduce((a, b) => 
      folderCounts[a] > folderCounts[b] ? a : b, ''
    );
    
    return mostCommonFolder;
  }

  private findParentSubFolderForSubSubFolder(subSubFolder: string, allArticles: Article[]): string | null {
    const articlesWithThisSubSubFolder = allArticles.filter(article => 
      article.subSubFolder.includes(subSubFolder)
    );
    
    const subFolderCounts: { [key: string]: number } = {};
    articlesWithThisSubSubFolder.forEach(article => {
      article.subFolder.forEach(subFolder => {
        subFolderCounts[subFolder] = (subFolderCounts[subFolder] || 0) + 1;
      });
    });
    
    const mostCommonSubFolder = Object.keys(subFolderCounts).reduce((a, b) => 
      subFolderCounts[a] > subFolderCounts[b] ? a : b, ''
    );
    
    return mostCommonSubFolder;
  }

  onNodeClick(node: SkillNode) {
    if (node.articles.length > 0) {
      // If node has articles, show the first one or emit for selection
      this.articleClicked.emit(node.articles[0]);
    }
  }

  onArticleClick(article: Article) {
    this.articleClicked.emit(article);
  }

  onProjectClick(project: Project) {
    if (project.link) {
      window.open(project.link, '_blank');
    }
  }

  onClose() {
    this.closeClicked.emit();
  }

  getNodeStyle(node: SkillNode): any {
    return {
      position: 'absolute',
      left: `${node.position.x}%`,
      top: `${node.position.y}%`,
      transform: 'translate(-50%, -50%)'
    };
  }


  getConnectedNodePosition(connectionId: string): { x: number; y: number } | null {
    const connectedNode = this.skillNodes.find(n => n.id === connectionId);
    return connectedNode ? connectedNode.position : null;
  }

  // Zoom and pan methods
  onMouseWheel(event: WheelEvent): void {
    event.preventDefault();
    
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(5, this.scale * delta));
    
    // Zoom towards mouse position
    const rect = (event.target as Element).getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const scaleDiff = newScale - this.scale;
    this.translateX -= mouseX * scaleDiff;
    this.translateY -= mouseY * scaleDiff;
    
    this.scale = newScale;
  }

  onMouseDown(event: MouseEvent): void {
    if (event.button === 0) { // Left mouse button
      this.isDragging = true;
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
      event.preventDefault();
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const deltaX = event.clientX - this.lastMouseX;
      const deltaY = event.clientY - this.lastMouseY;
      
      this.translateX += deltaX;
      this.translateY += deltaY;
      
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
    }
  }

  onMouseUp(): void {
    this.isDragging = false;
  }

  onMouseLeave(): void {
    this.isDragging = false;
  }

  resetZoom(): void {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
  }

  getTransform(): string {
    return `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  zoomIn(): void {
    this.scale = Math.min(5, this.scale * 1.2);
  }

  zoomOut(): void {
    this.scale = Math.max(0.1, this.scale * 0.8);
  }

  getConnectionColor(node: SkillNode): string {
    // If this is a main folder, use its own color
    const mainFolders = ['design', 'development', 'writing'];
    const nodeName = node.title.toLowerCase();
    
    if (mainFolders.includes(nodeName)) {
      return node.color || '#95A5A6';
    }
    
    // For subnodes, find the parent main folder color
    if (node.connections.length > 0) {
      const parentNode = this.skillNodes.find(parent => 
        node.connections.includes(parent.id) && 
        mainFolders.includes(parent.title.toLowerCase())
      );
      if (parentNode) {
        return parentNode.color || '#95A5A6';
      }
    }
    
    // Fallback to the node's own color or default
    return node.color || '#95A5A6';
  }

  shouldFlicker(node: SkillNode): boolean {
    // Only flicker subnodes (subFolder and subSubFolder), not main folders
    const isMainFolder = node.id.startsWith('folder-');
    return !isMainFolder && this.hasInitialized;
  }


  private triggerFlickerAnimation(): void {
    // Clear any existing timeouts/intervals
    if (this.flickerTimeout) {
      clearTimeout(this.flickerTimeout);
    }
    if (this.flickerInterval) {
      clearInterval(this.flickerInterval);
    }
    
    // Start JavaScript-based flicker animation after a short delay
    this.flickerTimeout = setTimeout(() => {
      this.startJavaScriptFlicker();
    }, 100);
  }

  private startJavaScriptFlicker(): void {
    // Find all subnode titles that should flicker
    this.flickerElements = [];
    const flickeringNodeIds: string[] = [];
    
    this.skillNodes.forEach(node => {
      if (this.shouldFlicker(node)) {
        flickeringNodeIds.push(node.id);
        // Use a more reliable selector approach
        const skillNodeElements = document.querySelectorAll('.skill-node');
        skillNodeElements.forEach((skillNode, index) => {
          if (index < this.skillNodes.length && this.skillNodes[index].id === node.id) {
            const titleElement = skillNode.querySelector('.node-title') as HTMLElement;
            if (titleElement) {
              this.flickerElements.push(titleElement);
            }
          }
        });
      }
    });

    if (this.flickerElements.length === 0) return;

    // Find connections that should flicker (lines connected to flickering nodes)
    const connectionElements = document.querySelectorAll('.connections-svg line') as NodeListOf<SVGLineElement>;
    const flickeringConnections: SVGLineElement[] = [];
    
    connectionElements.forEach(line => {
      const x1 = parseFloat(line.getAttribute('x1') || '0');
      const y1 = parseFloat(line.getAttribute('y1') || '0');
      const x2 = parseFloat(line.getAttribute('x2') || '0');
      const y2 = parseFloat(line.getAttribute('y2') || '0');
      
      // Check if this line connects to any flickering node
      const shouldFlicker = flickeringNodeIds.some(nodeId => {
        const node = this.skillNodes.find(n => n.id === nodeId);
        if (!node) return false;
        
        // Check if line connects to this node's position
        const nodeX = node.position.x;
        const nodeY = node.position.y;
        const tolerance = 0.5; // Small tolerance for floating point comparison
        
        return (Math.abs(x1 - nodeX) < tolerance && Math.abs(y1 - nodeY) < tolerance) ||
               (Math.abs(x2 - nodeX) < tolerance && Math.abs(y2 - nodeY) < tolerance);
      });
      
      if (shouldFlicker) {
        flickeringConnections.push(line);
      }
    });

    let flickerCount = 0;
    const maxFlickers = 5; // 500ms at 100ms intervals
    
    this.flickerInterval = setInterval(() => {
      // Flicker node titles
      this.flickerElements.forEach(element => {
        const shouldGlow = Math.random() > 0.4; // 60% chance to glow
        if (shouldGlow) {
          element.style.opacity = '0';
          element.style.textShadow = '0 0 3px currentColor';
          element.style.filter = 'brightness(1.1)';
        } else {
          element.style.opacity = '0.3';
          element.style.textShadow = 'none';
          element.style.filter = 'brightness(0.9)';
        }
      });
      
      // Flicker connections
      flickeringConnections.forEach(line => {
        const shouldGlow = Math.random() > 0.4; // 60% chance to glow
        if (shouldGlow) {
          line.style.opacity = '0';
          line.style.filter = 'brightness(1.2) drop-shadow(0 0 2px currentColor)';
          line.setAttribute('stroke-width', '0.15');
        } else {
          line.style.opacity = '0.6';
          line.style.filter = 'brightness(0.8)';
          line.setAttribute('stroke-width', '0.1');
        }
      });
      
      flickerCount++;
      if (flickerCount >= maxFlickers) {
        // Reset to normal state
        this.flickerElements.forEach(element => {
          element.style.opacity = '1';
          element.style.textShadow = 'none';
          element.style.filter = 'brightness(1)';
        });
        
        flickeringConnections.forEach(line => {
          line.style.opacity = '0.8';
          line.style.filter = 'none';
          line.setAttribute('stroke-width', '0.1');
        });
        
        clearInterval(this.flickerInterval);
      }
    }, 100);
  }
}
