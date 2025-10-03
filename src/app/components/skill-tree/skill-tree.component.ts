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
  
  // Touch properties
  isTouching: boolean = false;
  lastTouchX: number = 0;
  lastTouchY: number = 0;
  
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

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.initializeSkillTree();
    this.loadArticles();
    
    // Center the skill tree in the viewport initially
    this.centerSkillTree();
    
    // Trigger flicker animation for subnodes on first load
    if (!this.hasInitialized) {
      this.hasInitialized = true;
      this.triggerFlickerAnimation();
    }
    
    // Add resize listener for responsive layout
    this.resizeListener = () => {
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
    
    // Use circular layout instead of force-directed
    this.circularLayout();
  }

  private circularLayout() {
    // Use absolute pixel coordinates for consistent layout regardless of screen size
    // Base the layout on a 1200px width for optimal spacing
    const baseWidth = 1200;
    const centerX = baseWidth / 2;
    const centerY = 400; // Fixed center Y position
    
    // Group nodes by level
    const mainFolders = this.skillNodes.filter(node => node.id.startsWith('folder-'));
    const middleLevelNodes = this.skillNodes.filter(node => {
      if (this.currentView === 'technologies') return node.id.startsWith('technology-');
      if (this.currentView === 'projects') return node.id.startsWith('project-');
      if (this.currentView === 'folders') return node.id.startsWith('subfolder-');
      return false;
    });
    const topLevelNodes = this.skillNodes.filter(node => 
      this.currentView === 'folders' && node.id.startsWith('subsubfolder-')
    );
    
    // Use pixel-based radii for consistent spacing
    const innerRadius = 150;
    const middleRadius = 300;
    const outerRadius = 450;
    
    // Position main folders in inner circle
    mainFolders.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / mainFolders.length;
      node.position = {
        x: centerX + innerRadius * Math.cos(angle),
        y: centerY + innerRadius * Math.sin(angle)
      };
    });
    
    // Position middle level nodes in outer circle
    middleLevelNodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / middleLevelNodes.length;
      node.position = {
        x: centerX + middleRadius * Math.cos(angle),
        y: centerY + middleRadius * Math.sin(angle)
      };
    });
    
    // Position top level nodes in outermost circle (if any)
    if (topLevelNodes.length > 0) {
      topLevelNodes.forEach((node, index) => {
        const angle = (2 * Math.PI * index) / topLevelNodes.length;
        node.position = {
          x: centerX + outerRadius * Math.cos(angle),
          y: centerY + outerRadius * Math.sin(angle)
        };
      });
    }
    
    // Ensure all positions have minimum margins
    const margin = 100;
    this.skillNodes.forEach(node => {
      node.position.x = Math.max(margin, node.position.x);
      node.position.y = Math.max(margin, node.position.y);
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
      event.preventDefault();
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
      // Single touch dragging
      const deltaX = event.touches[0].clientX - this.lastTouchX;
      const deltaY = event.touches[0].clientY - this.lastTouchY;
      
      this.translateX += deltaX;
      this.translateY += deltaY;
      
      this.lastTouchX = event.touches[0].clientX;
      this.lastTouchY = event.touches[0].clientY;
      
      event.preventDefault();
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
    const treeHeight = 800;
    
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
