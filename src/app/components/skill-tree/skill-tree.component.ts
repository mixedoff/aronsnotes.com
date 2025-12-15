import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
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
  
  // Touch properties
  isTouching: boolean = false;
  lastTouchX: number = 0;
  lastTouchY: number = 0;
  isMobile: boolean = false;
  
  // Mobile active node tracking
  activeMobileNode: string | null = null;
  
  // Pinch zoom properties
  isPinching: boolean = false;
  lastPinchDistance: number = 0;
  initialScale: number = 1;
  
  // Flicker animation properties
  private hasInitialized: boolean = false;
  private flickerTimeout: any;
  private flickerInterval: any;
  private flickerElements: HTMLElement[] = [];
  
  // Resize listener
  private resizeListener: (() => void) | null = null;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    // Detect mobile device
    this.isMobile = window.innerWidth <= 768;
    console.log('Initial mobile detection:', this.isMobile, 'window width:', window.innerWidth);
    
    // Detect view from URL if available
    const url = this.location.path();
    const segments = url.split('/');
    if (segments.length > 1 && ['folders', 'technologies', 'projects'].includes(segments[segments.length - 1])) {
      this.currentView = segments[segments.length - 1] as 'folders' | 'technologies' | 'projects';
    } else if (segments.includes('theory')) {
      // Already on /theory, default to folders
      this.currentView = 'folders';
    }
    
    this.initializeSkillTree();
    this.loadArticles();
    
    // Set the initial URL to reflect the current view
    this.location.go(`/theory/${this.currentView}`);
    
    // Center the skill tree in the viewport initially
    this.centerSkillTree();
    
    // Trigger flicker animation for subnodes on first load
    if (!this.hasInitialized) {
      this.hasInitialized = true;
      this.triggerFlickerAnimation();
    }
    
    // Add resize listener for responsive layout
    this.resizeListener = () => {
      this.isMobile = window.innerWidth <= 768;
      console.log('Resize detected - mobile:', this.isMobile, 'width:', window.innerWidth);
      this.calculateAllPositions();
      this.centerSkillTree();
    };
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    if (this.flickerTimeout) {
      clearTimeout(this.flickerTimeout);
    }
    if (this.flickerInterval) {
      clearInterval(this.flickerInterval);
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  toggleView(view: 'folders' | 'technologies' | 'projects') {
    this.currentView = view;
    this.initializeSkillTree();
    this.loadArticles();
    
    // Update the URL to reflect the current view
    this.location.go(`/theory/${view}`);
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
    // Keep main folders as they are (Level 0)
    const allFolders = new Set<string>();
    allArticles.forEach(article => {
      article.folder.forEach(f => {
        if (f && f.trim() !== '') {
          allFolders.add(f);
        }
      });
    });
    
    // Create main folder nodes (Level 0)
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
    
    // Create project nodes (Level 1) only for projects view
    PROJECTS.forEach((project, index) => {
      const connections: string[] = [];
      
      // Connect to the main folder based on project categories (now an array)
      project.category.forEach(cat => {
        const mainFolderNode = this.skillNodes.find(node => 
          node.id.startsWith(`folder-${cat}-`)
        );
        if (mainFolderNode && !connections.includes(mainFolderNode.id)) {
          connections.push(mainFolderNode.id);
        }
      });
      
      // If no connection found, connect to all main folders as fallback
      if (connections.length === 0) {
        this.skillNodes.forEach(node => {
          if (node.id.startsWith('folder-')) {
            connections.push(node.id);
          }
        });
      }
      
      const projectNodeId = `project-${project.id}-${index}`;
      this.skillNodes.push({
        id: projectNodeId,
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
          // Project view: match based on folder, project, subfolder, and subsubfolder
          if (node.id.startsWith('folder-')) {
            // Extract folder name by removing 'folder-' prefix and any trailing index
            const folderName = node.id.replace(/^folder-/, '').replace(/-\d+$/, '');
            return article.folder.includes(folderName);
          } else if (node.id.startsWith('project-') && !node.id.includes('subfolder')) {
            // Extract project id by removing 'project-' prefix and any trailing index
            const projectId = node.id.replace(/^project-/, '').replace(/-\d+$/, '');
            // Match by project id (case-insensitive) or project name (case-insensitive, with/without .com)
            if (node.project) {
              const articleProjectLower = (article.project?.toLowerCase() || '').trim();
              const projectIdLower = projectId.toLowerCase();
              const projectNameLower = node.project.name.toLowerCase();
              const projectNameNoCom = projectNameLower.replace(/\.com$/, '');
              return articleProjectLower === projectIdLower || 
                     articleProjectLower === projectNameLower || 
                     articleProjectLower === projectNameNoCom;
            }
            return false;
          } else if (node.id.startsWith('project-subfolder-')) {
            // Extract project id and subfolder name
            const match = node.id.match(/^project-subfolder-([^-]+)-(.+?)(?:-\d+)?$/);
            if (match) {
              const projectId = match[1];
              const subFolderName = match[2];
              // Check if article belongs to this project and has this subfolder
              const articleProjectLower = (article.project?.toLowerCase() || '').trim();
              const project = PROJECTS.find(p => p.id === projectId);
              if (project) {
                const projectIdLower = project.id.toLowerCase();
                const projectNameLower = project.name.toLowerCase();
                const projectNameNoCom = projectNameLower.replace(/\.com$/, '');
                const belongsToProject = articleProjectLower === projectIdLower || 
                                         articleProjectLower === projectNameLower || 
                                         articleProjectLower === projectNameNoCom;
                return belongsToProject && article.subFolder.includes(subFolderName);
              }
            }
            return false;
          } else if (node.id.startsWith('project-subsubfolder-')) {
            // Extract project id, subfolder name, and subsubfolder name
            const match = node.id.match(/^project-subsubfolder-([^-]+)-([^-]+)-(.+?)(?:-\d+)?$/);
            if (match) {
              const projectId = match[1];
              const subFolderName = match[2];
              const subSubFolderName = match[3];
              // Check if article belongs to this project and has this subfolder and subsubfolder
              const articleProjectLower = (article.project?.toLowerCase() || '').trim();
              const project = PROJECTS.find(p => p.id === projectId);
              if (project) {
                const projectIdLower = project.id.toLowerCase();
                const projectNameLower = project.name.toLowerCase();
                const projectNameNoCom = projectNameLower.replace(/\.com$/, '');
                const belongsToProject = articleProjectLower === projectIdLower || 
                                         articleProjectLower === projectNameLower || 
                                         articleProjectLower === projectNameNoCom;
                return belongsToProject && 
                       article.subFolder.includes(subFolderName) &&
                       article.subSubFolder.includes(subSubFolderName);
              }
            }
            return false;
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
      'writing': '#4ECDC4'
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
      
      // For project nodes, use the color of the first category
      if (node.project && node.project.category.length > 0) {
        const firstCategory = node.project.category[0].toLowerCase();
        if (colors[firstCategory as keyof typeof colors]) {
          node.color = colors[firstCategory as keyof typeof colors];
        } else {
          node.color = '#95A5A6'; // Default fallback
        }
      } else {
        // For article nodes and other nodes, find the parent color based on connections
        let parentColor = '#95A5A6'; // Default fallback color
        
        if (node.connections.length > 0) {
          // Find the parent node (project node for articles, folder node for others)
          const parentNode = this.skillNodes.find(parent => 
            node.connections.includes(parent.id) && parent.color
          );
          if (parentNode) {
            parentColor = parentNode.color!;
          }
        }
        
        // Assign the parent's color to all subnodes (including article nodes)
        node.color = parentColor;
      }
      
      // Set appropriate levels
      if (this.currentView === 'technologies' && node.id.startsWith('technology-')) {
        node.level = 1;
      } else if (this.currentView === 'projects' && node.id.startsWith('project-') && !node.id.includes('subfolder')) {
        node.level = 1;
      } else if (this.currentView === 'projects' && node.id.startsWith('project-subfolder-')) {
        node.level = 2;
      } else if (this.currentView === 'projects' && node.id.startsWith('project-subsubfolder-')) {
        node.level = 3;
      } else if (this.currentView === 'folders' && node.id.startsWith('subfolder-')) {
        node.level = 1;
      } else if (this.currentView === 'folders' && node.id.startsWith('subsubfolder-')) {
        node.level = 2;
      }
    });
    
    // Use circular layout instead of force-directed
    this.circularLayout();
  }

  private circularLayout() {
    // Use absolute pixel coordinates for consistent layout regardless of screen size
    // Base the layout on a 1200px width for optimal spacing
    const baseWidth = 1200;
    const centerX = baseWidth / 2;
    const centerY = 500; // Fixed center Y position
    
    // Group nodes by level
    const mainFolders = this.skillNodes.filter(node => node.id.startsWith('folder-'));
    const middleLevelNodes = this.skillNodes.filter(node => {
      if (this.currentView === 'technologies') return node.id.startsWith('technology-');
      if (this.currentView === 'projects') return node.id.startsWith('project-') && !node.id.includes('subfolder');
      if (this.currentView === 'folders') return node.id.startsWith('subfolder-');
      return false;
    });
    // For projects view we no longer render level 2/3 nodes
    const level2Nodes = this.currentView === 'projects'
      ? []
      : this.skillNodes.filter(node => node.id.startsWith('subsubfolder-'));
    const level3Nodes: SkillNode[] = [];

    // ---------------------------------------------------------
    // UNIVERSAL RAY-BASED LAYOUT (ALL VIEWS)
    // ---------------------------------------------------------
    const level0Distance = 150; // Center circle
    const level1Distance = 400; // Level 1 nodes
    const minNodeDistance = 200; // Increased minimum distance to prevent edge overlaps

    // 1. Position Main Folders in the center circle and assign rays
    const folderAngles = new Map<string, number>();
    mainFolders.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / mainFolders.length;
      folderAngles.set(node.id, angle);
      node.position = {
        x: centerX + level0Distance * Math.cos(angle),
        y: centerY + level0Distance * Math.sin(angle)
      };
    });

    // 2. Position Level 1 nodes (technologies/subfolders/projects) along their parent folder's ray
    const level1Angles = new Map<string, number>();
    middleLevelNodes.forEach((node, index) => {
      // Get the first parent connection (first instance)
      const parentId = node.connections[0];
      const parentAngle = folderAngles.get(parentId);
      
      let baseAngle: number;
      if (parentAngle !== undefined) {
        // Use parent folder's angle
        baseAngle = parentAngle;
      } else {
        // Fallback: distribute evenly
        baseAngle = (2 * Math.PI * index) / middleLevelNodes.length;
      }
      
      level1Angles.set(node.id, baseAngle);
      
      // Position with some spread along the ray
      const angleJitter = (Math.random() - 0.5) * 0.3; // Small jitter for level 1
      const finalAngle = baseAngle + angleJitter;
      
      node.position = {
        x: centerX + level1Distance * Math.cos(finalAngle),
        y: centerY + level1Distance * Math.sin(finalAngle)
      };
    });

    // Helper to position children along their parent's ray with wide distribution
    const positionAlongRay = (node: SkillNode, minDist: number, maxDist: number) => {
      let parentId: string | undefined;
      let baseAngle = 0;
      let foundParent = false;

      // Get parent ID from connections (first instance)
      if (node.connections.length > 0) {
        parentId = node.connections[0];
        
        // Try to find parent in level1Angles first (for level 2 nodes)
        if (level1Angles.has(parentId)) {
          baseAngle = level1Angles.get(parentId)!;
          foundParent = true;
        } else {
          // For level 3 nodes, find parent's parent
          const parent = this.skillNodes.find(n => n.id === parentId);
          if (parent && parent.connections.length > 0) {
            const grandParentId = parent.connections[0];
            if (level1Angles.has(grandParentId)) {
              baseAngle = level1Angles.get(grandParentId)!;
              foundParent = true;
            } else if (folderAngles.has(grandParentId)) {
              baseAngle = folderAngles.get(grandParentId)!;
              foundParent = true;
            }
          }
        }
      }

      if (!foundParent) {
        // Fallback: random angle
        baseAngle = Math.random() * 2 * Math.PI;
      }

      // Apply wide randomness along the ray for mind map distribution
      // 1. Random Distance within range
      const distance = minDist + Math.random() * (maxDist - minDist);
      
      // 2. Wide Angle Jitter (Spread nodes out within a "slice" rather than a thin line)
      // +/- 90 degrees (1.57 radians) for very wide distribution
      const angleJitter = (Math.random() - 0.5) * 1.57;
      const finalAngle = baseAngle + angleJitter;

      node.position = {
        x: centerX + distance * Math.cos(finalAngle),
        y: centerY + distance * Math.sin(finalAngle)
      };
    };

    // 3. Position Level 2 nodes along rays with view-specific distances (increased ranges)
    if (level2Nodes.length > 0) {
      if (this.currentView === 'projects') {
        level2Nodes.forEach(node => {
          positionAlongRay(node, 600, 900); // Increased from 600-900
        });
      } else if (this.currentView === 'folders') {
        level2Nodes.forEach(node => {
          positionAlongRay(node, 500, 800); // Increased from 500-800
        });
      } else {
        // Technologies view doesn't have level 2, but just in case
        level2Nodes.forEach(node => {
          positionAlongRay(node, 500, 800); // Increased from 500-800
        });
      }
    }

    // 4. Position Level 3 nodes further out along rays (increased ranges)
    if (level3Nodes.length > 0) {
      if (this.currentView === 'projects') {
        level3Nodes.forEach(node => {
          positionAlongRay(node, 1000, 1400); // Increased from 1000-1400
        });
      } else if (this.currentView === 'folders') {
        level3Nodes.forEach(node => {
          positionAlongRay(node, 900, 1300); // Increased from 900-1300
        });
      }
    }

    // 5. Final Collision Resolution (Very strong push for mind map spacing)
    const allNodes = [...mainFolders, ...middleLevelNodes, ...level2Nodes, ...level3Nodes];
    const maxIterations = 100; // Many more iterations for better resolution

    for (let iter = 0; iter < maxIterations; iter++) {
      let hasOverlaps = false;
      let totalOverlaps = 0;

      for (let i = 0; i < allNodes.length; i++) {
        for (let j = i + 1; j < allNodes.length; j++) {
          const dx = allNodes[j].position.x - allNodes[i].position.x;
          const dy = allNodes[j].position.y - allNodes[i].position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < minNodeDistance && dist > 0) {
            hasOverlaps = true;
            totalOverlaps++;
            const overlap = minNodeDistance - dist;

            // Very strong push - push nodes apart completely
            const pushStrength = 1.2; // Stronger than before
            const pushX = (dx / dist) * overlap * pushStrength;
            const pushY = (dy / dist) * overlap * pushStrength;

            allNodes[i].position.x -= pushX;
            allNodes[i].position.y -= pushY;
            allNodes[j].position.x += pushX;
            allNodes[j].position.y += pushY;
          }
        }
      }

      // Log progress for debugging
      if (iter % 20 === 0 && totalOverlaps > 0) {
        console.log(`Iteration ${iter}: ${totalOverlaps} overlaps remaining`);
      }

      if (!hasOverlaps) break;
    }

    // For mind map, allow nodes to extend beyond screen bounds (user can drag/zoom)
    const margin = 200; // Larger margin to keep some nodes visible
    // Include margin space in the total canvas size so we don't need negative coordinates
    const extendedWidth = baseWidth * 12 + margin * 2; // Allow layout to be 12x screen width plus margins
    const extendedHeight = 1000 * 12 + margin * 2; // Allow layout to be 12x screen height plus margins

    this.skillNodes.forEach(node => {
      // Clamp to non-negative space so the SVG viewBox can start at 0,0
      node.position.x = Math.max(0, Math.min(extendedWidth, node.position.x + margin));
      node.position.y = Math.max(0, Math.min(extendedHeight, node.position.y + margin));
    });
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
    console.log('Node clicked:', node.title, 'isMobile:', this.isMobile, 'articles:', node.articles.length);
    
    if (this.isMobile) {
      // On mobile, toggle the active state to show/hide content like hover
      if (node.articles.length > 0 || (this.currentView === 'projects' && node.project)) {
        if (this.activeMobileNode === node.id) {
          // If already active, deactivate it
          this.activeMobileNode = null;
          console.log('Deactivated mobile node:', node.title);
        } else {
          // Activate this node
          this.activeMobileNode = node.id;
          console.log('Activated mobile node:', node.title);
        }
      } else {
        console.log('Node has no content to show');
      }
    } else {
      // On desktop, emit the first article if available
      if (node.articles.length > 0) {
        this.articleClicked.emit(node.articles[0]);
      }
    }
  }

  onNodeTouchEnd(node: SkillNode, event: TouchEvent) {
    // Prevent default touch behavior and handle the touch
    if (this.isMobile) {
      event.preventDefault();
      event.stopPropagation();
      console.log('Node touched:', node.title, 'isMobile:', this.isMobile);
      this.onNodeClick(node);
    }
  }

  onArticleClick(article: Article) {
    this.articleClicked.emit(article);
    // Close mobile overlay when article is clicked
    if (this.isMobile) {
      this.activeMobileNode = null;
    }
  }

  isMobileNodeActive(nodeId: string): boolean {
    return this.isMobile && this.activeMobileNode === nodeId;
  }

  isMainNode(node: SkillNode): boolean {
    const mainFolders = ['design', 'development', 'writing'];
    return mainFolders.includes(node.title.toLowerCase());
  }

  onContainerClick(event: MouseEvent) {
    console.log('Container clicked:', event.target);
    
    // On mobile, if clicking on the container (not on a node), close any active mobile nodes
    if (this.isMobile) {
      const target = event.target as Element;
      console.log('Target classes:', target.className);
      console.log('Target tag:', target.tagName);
      console.log('Is tree-container:', target.classList.contains('tree-container'));
      console.log('Has skill-node ancestor:', !!target.closest('.skill-node'));
      console.log('Active mobile node:', this.activeMobileNode);
      
      // Check if we clicked on the container itself or any of its children that aren't skill nodes
      if (target.classList.contains('tree-container') || 
          (target.closest('.tree-container') && !target.closest('.skill-node'))) {
        this.activeMobileNode = null;
        console.log('✅ Closed mobile node by clicking outside');
      } else {
        console.log('❌ Did not close - click was on skill node or its children');
      }
    }
  }

  onContainerTouchEnd(event: TouchEvent) {
    console.log('Container touched:', event.target);
    
    // On mobile, if touching the container (not on a node), close any active mobile nodes
    if (this.isMobile) {
      const target = event.target as Element;
      console.log('Touch target classes:', target.className);
      console.log('Touch target tag:', target.tagName);
      console.log('Touch - Is tree-container:', target.classList.contains('tree-container'));
      console.log('Touch - Has skill-node ancestor:', !!target.closest('.skill-node'));
      console.log('Touch - Active mobile node:', this.activeMobileNode);
      
      // Only close if we didn't just drag/pan
      if (!this.isTouching) {
        // Check if we touched the container itself or any of its children that aren't skill nodes
        if (target.classList.contains('tree-container') || 
            (target.closest('.tree-container') && !target.closest('.skill-node'))) {
          this.activeMobileNode = null;
          console.log('✅ Closed mobile node by touching outside');
        } else {
          console.log('❌ Did not close - touch was on skill node or its children');
        }
      }
    }
  }

  onProjectClick(project: Project) {
    if (project.link) {
      window.open(project.link, '_blank');
    }
  }

  getAllRoles(project: Project): string[] {
    const allRoles: string[] = [];
    if (project.designRoles) {
      allRoles.push(...project.designRoles);
    }
    if (project.developmentRoles) {
      allRoles.push(...project.developmentRoles);
    }
    if (project.writingRoles) {
      allRoles.push(...project.writingRoles);
    }
    if (project.otherRoles) {
      allRoles.push(...project.otherRoles);
    }
    return allRoles;
  }

  getRolesWithClasses(project: Project): Array<{role: string, chipClass: string}> {
    const rolesWithClasses: Array<{role: string, chipClass: string}> = [];
    if (project.designRoles) {
      project.designRoles.forEach(role => rolesWithClasses.push({role, chipClass: 'blue-chip'}));
    }
    if (project.developmentRoles) {
      project.developmentRoles.forEach(role => rolesWithClasses.push({role, chipClass: 'green-chip'}));
    }
    if (project.writingRoles) {
      project.writingRoles.forEach(role => rolesWithClasses.push({role, chipClass: 'cyan-chip'}));
    }
    if (project.otherRoles) {
      project.otherRoles.forEach(role => rolesWithClasses.push({role, chipClass: 'white-chip'}));
    }
    return rolesWithClasses;
  }

  onClose() {
    this.closeClicked.emit();
  }

  getNodeStyle(node: SkillNode): any {
    return {
      position: 'absolute',
      left: `${node.position.x}px`,
      top: `${node.position.y}px`,
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

  // Touch event handlers for mobile devices
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      // Single touch - start dragging
      this.isTouching = true;
      this.isPinching = false;
      this.lastTouchX = event.touches[0].clientX;
      this.lastTouchY = event.touches[0].clientY;
      // Don't prevent default on touch start to allow click events to work
    } else if (event.touches.length === 2) {
      // Two touches - start pinch zoom
      this.isTouching = false;
      this.isPinching = true;
      this.initialScale = this.scale;
      this.lastPinchDistance = this.getDistance(
        event.touches[0].clientX, event.touches[0].clientY,
        event.touches[1].clientX, event.touches[1].clientY
      );
      event.preventDefault();
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (this.isTouching && event.touches.length === 1) {
      // Single touch dragging - only prevent default if we're actually dragging
      const deltaX = event.touches[0].clientX - this.lastTouchX;
      const deltaY = event.touches[0].clientY - this.lastTouchY;
      
      // Only consider it dragging if movement is significant
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance > 10) {
        this.translateX += deltaX;
        this.translateY += deltaY;
        
        this.lastTouchX = event.touches[0].clientX;
        this.lastTouchY = event.touches[0].clientY;
        
        event.preventDefault();
      }
    } else if (this.isPinching && event.touches.length === 2) {
      // Two touches - pinch zoom
      const currentDistance = this.getDistance(
        event.touches[0].clientX, event.touches[0].clientY,
        event.touches[1].clientX, event.touches[1].clientY
      );
      
      if (this.lastPinchDistance > 0) {
        const scaleChange = currentDistance / this.lastPinchDistance;
        const newScale = Math.max(0.1, Math.min(5, this.initialScale * scaleChange));
        this.scale = newScale;
      }
      
      this.lastPinchDistance = currentDistance;
      event.preventDefault();
    }
  }

  onTouchEnd(event: TouchEvent): void {
    this.isTouching = false;
    this.isPinching = false;
    this.lastPinchDistance = 0;
    event.preventDefault();
  }

  private getDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  resetZoom(): void {
    this.scale = 1;
    this.centerSkillTree();
  }

  private centerSkillTree(): void {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight - 40; // Account for top margin
    const treeWidth = 1200;
    const treeHeight = 1000;
    
    // Center the skill tree in the viewport
    this.translateX = (containerWidth - treeWidth) / 2;
    this.translateY = (containerHeight - treeHeight) / 2;
    
    // Ensure we don't go too far off-screen
    this.translateX = Math.max(-treeWidth + 100, Math.min(containerWidth - 100, this.translateX));
    this.translateY = Math.max(-treeHeight + 100, Math.min(containerHeight - 100, this.translateY));
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

  getConnectionColor(node: SkillNode, connectionId: string): string {
    // Find the target node (the node this connection points to)
    const targetNode = this.skillNodes.find(n => n.id === connectionId);
    
    if (!targetNode) {
      return '#95A5A6'; // Default fallback color
    }
    
    const mainFolders = ['design', 'development', 'writing'];
    const targetName = targetNode.title.toLowerCase();
    
    // If the target is a main folder (design, development, writing), use its color
    // This handles the case where projects connect to main folders
    if (mainFolders.includes(targetName)) {
      return targetNode.color || '#95A5A6';
    }
    
    // If the source is a main folder and target is a project,
    // use the source's color (the main folder color)
    const sourceName = node.title.toLowerCase();
    if (mainFolders.includes(sourceName)) {
      return node.color || '#95A5A6';
    }
    
    // For other cases, try to find a main folder in the target's connections
    if (targetNode.connections.length > 0) {
      const categoryNode = this.skillNodes.find(parent => 
        targetNode.connections.includes(parent.id) && 
        mainFolders.includes(parent.title.toLowerCase())
      );
      if (categoryNode) {
        return categoryNode.color || '#95A5A6';
      }
    }
    
    // Fallback: use the target node's color or default
    return targetNode.color || '#95A5A6';
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
          line.setAttribute('stroke-width', '3');
        } else {
          line.style.opacity = '0.6';
          line.style.filter = 'brightness(0.8)';
          line.setAttribute('stroke-width', '2');
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
          line.setAttribute('stroke-width', '2');
        });
        
        clearInterval(this.flickerInterval);
      }
    }, 100);
  }
}
