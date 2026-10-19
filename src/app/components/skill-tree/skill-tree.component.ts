import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Note, NoteService } from '../../note.service';
import { ROOT_FOLDER, MAIN_FOLDERS, FOLDER_COLORS, FOLDER_LABELS, HIDDEN_FOLDERS } from '../../data/skills.data';
import { Quest, QUESTS } from '../../data/quests.data';

export interface SkillNode {
  id: string;
  title: string;
  folder?: string; // the folder a root or main folder node stands for (its title is only a label)
  category: string;
  notes: Note[];
  unlocked: boolean;
  position: { x: number; y: number };
  connections: string[];
  color?: string; // Add color property
  level?: number; // Add level for graph positioning
}

const ROOT_NODE_ID = `root-${ROOT_FOLDER}`;

@Component({
  selector: 'app-skill-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-tree.component.html',
  styleUrls: ['./skill-tree.component.css'],
})
export class SkillTreeComponent implements OnInit, OnDestroy {
  @Input() sourceScreen: 'booknotes' | 'notes' | 'main-menu' | 'character' | 'personal' = 'booknotes';
  @Output() noteClicked = new EventEmitter<Note>();
  @Output() closeClicked = new EventEmitter<void>();

  skillNodes: SkillNode[] = [];
  filteredNotes: Note[] = [];
  // Node under the mouse and the nodes on its way back to the root
  hoveredPath = new Set<string>();
  // The hovered or tapped node lights up with one of a few flicker effects
  litNodeId: string | null = null;
  litEffect = '';
  private readonly lightEffects = ['flicker', 'stutter', 'surge', 'buzz'];

  // The tree can show a single quest's notes (/skills?quest=careeverz), picked on the root node
  readonly rootNodeId = ROOT_NODE_ID;
  readonly quests: Quest[] = [...QUESTS].sort(
    (a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity)
  );
  activeQuest: Quest | null = null;
  questPickerOpen = false;
  private questSubscription?: Subscription;
  /**
   * After picking a quest, nodes ignore the pointer until the mouse really moves, so the
   * new tree doesn't open with whatever node happens to be under it already lit.
   * (A page can't move the pointer itself.)
   */
  hoverPaused = false;
  private pausedAt: { x: number; y: number } | null = null;
  private lastPointer = { x: 0, y: 0 };
  
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
  
  // Mobile active node tracking; a tapped node lights up like a hovered one
  private _activeMobileNode: string | null = null;
  get activeMobileNode(): string | null {
    return this._activeMobileNode;
  }
  set activeMobileNode(nodeId: string | null) {
    this._activeMobileNode = nodeId;
    const node = nodeId ? this.skillNodes.find(n => n.id === nodeId) : undefined;
    if (node) {
      this.onNodeEnter(node);
    } else {
      this.hoveredPath = new Set();
      this.litNodeId = null;
    }
  }
  
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
    private noteService: NoteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Detect mobile device
    this.isMobile = window.innerWidth <= 768;
    console.log('Initial mobile detection:', this.isMobile, 'window width:', window.innerWidth);
    
    // Builds the tree now, and again whenever another quest is picked
    this.questSubscription = this.route.queryParamMap.subscribe(params => {
      const questId = params.get('quest');
      this.activeQuest = this.quests.find(quest => quest.id === questId) ?? null;
      this.buildTree();
    });
    
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
    this.questSubscription?.unsubscribe();
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

  private buildTree() {
    this.activeMobileNode = null;
    this.questPickerOpen = false;
    this.initializeSkillTree();
    this.loadNotes();
    
    // Center the skill tree in the viewport
    this.centerSkillTree();
    
    // Subnodes flicker on, on first load and when the quest changes
    this.hasInitialized = true;
    this.triggerFlickerAnimation();
  }

  /** Every note, or only the picked quest's */
  private treeNotes(): Note[] {
    this.noteService.resetToOriginal();
    const notes = this.noteService.getNotes();
    if (!this.activeQuest) return notes;
    const questNotes = new Set(
      this.noteService.getNotesByQuest(this.activeQuest.id, this.activeQuest.name)
    );
    return notes.filter(note => questNotes.has(note));
  }

  toggleQuestPicker() {
    this.questPickerOpen = !this.questPickerOpen;
  }

  selectQuest(quest: Quest | null) {
    this.questPickerOpen = false;
    if (quest?.id === this.activeQuest?.id) return;
    if (!this.isMobile) {
      this.hoverPaused = true;
      this.pausedAt = { ...this.lastPointer };
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { quest: quest?.id ?? null },
    });
  }

  private initializeSkillTree() {
    // Get all notes first to extract categories
    const allNotes = this.treeNotes();
    
    console.log('All notes:', allNotes.length);
    
    // Create skill nodes dynamically from the extracted data
    this.skillNodes = [{
      id: ROOT_NODE_ID,
      title: this.folderTitle(ROOT_FOLDER),
      folder: ROOT_FOLDER,
      category: 'Root Category',
      notes: [],
      unlocked: true,
      position: { x: 0, y: 0 },
      connections: []
    }];
    
    this.initializeFolderView(allNotes);
    
    // Notes filed directly under the root folder belong to the root node,
    // not to a second main folder with the same name
    const rootFolderIds = this.skillNodes
      .filter(node => node.id.startsWith(`folder-${ROOT_FOLDER}-`))
      .map(node => node.id);
    this.skillNodes = this.skillNodes.filter(node => !rootFolderIds.includes(node.id));
    this.skillNodes.forEach(node => {
      node.connections = Array.from(new Set(
        node.connections.map(id => rootFolderIds.includes(id) ? ROOT_NODE_ID : id)
      ));
    });
    
    // Every main folder branches out of the root
    this.skillNodes.forEach(node => {
      if (node.id.startsWith('folder-')) {
        node.connections = [ROOT_NODE_ID];
      }
    });
    
    // Clean up: Remove any nodes with empty titles
    this.skillNodes = this.skillNodes.filter(node => 
      node.title && node.title.trim() !== '' && node.title !== 'Undefined'
    );
    
    // Second pass: Calculate positions now that all nodes exist
    this.calculateAllPositions();
    
    console.log('Skill nodes created:', this.skillNodes.length);
  }

  private initializeFolderView(allNotes: Note[]) {
    // Extract all unique folders and subFolders
    const allFolders = new Set<string>();
    const allSubFolders = new Set<string>();
    
    allNotes.forEach(note => {
      note.folder.forEach(f => {
        if (f && f.trim() !== '') {
          allFolders.add(f);
        }
      });
      note.subFolder.forEach(sf => {
        if (sf && sf.trim() !== '') {
          allSubFolders.add(sf);
        }
      });
    });
    
    console.log('Folders:', Array.from(allFolders));
    console.log('SubFolders:', Array.from(allSubFolders));
    
    // First pass: Create all nodes without positioning
    allFolders.forEach((folder, index) => {
      if (folder && folder.trim() !== '') {
        this.skillNodes.push({
          id: `folder-${folder}-${index}`, // Ensure unique IDs
          title: this.folderTitle(folder),
          folder,
          category: 'Main Category',
          notes: [],
          unlocked: true,
          position: { x: 0, y: 0 }, // Temporary position
          connections: []
        });
      }
    });
    
    const subFolderArray = Array.from(allSubFolders);
    subFolderArray.forEach((subFolder, index) => {
      if (subFolder && subFolder.trim() !== '' && !HIDDEN_FOLDERS.has(subFolder)) {
        // Create branching connections - each subfolder connects to main folders
        const connections: string[] = [];
        
        // Connect to main folders based on the subfolder's content
        const notesWithThisSubFolder = allNotes.filter(note => 
          note.subFolder.includes(subFolder)
        );
        
        // Find which main folders this subfolder should connect to
        const mainFoldersForThisSubFolder = new Set<string>();
        notesWithThisSubFolder.forEach(note => {
          this.noteService.getFolderPaths(note).forEach(path => {
            if (path[1] === subFolder && path[0]) {
              mainFoldersForThisSubFolder.add(path[0]);
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
          title: this.folderTitle(subFolder),
          folder: subFolder,
          category: 'Sub Category',
          notes: [],
          unlocked: true,
          position: { x: 0, y: 0 }, // Temporary position
          connections: connections,
          level: 1
        });
      }
    });
    
    // Sub-subfolders and anything deeper (deeper levels come from a note's paths) get a node
    // per level, connected to the folders one level up
    const allPaths = allNotes.flatMap(note => this.noteService.getFolderPaths(note));
    const maxDepth = Math.max(0, ...allPaths.map(path => path.length));
    for (let depth = 2; depth < maxDepth; depth++) {
      const names = Array.from(new Set(allPaths.map(path => path[depth]).filter(Boolean)));
      names.forEach((name, index) => {
        if (HIDDEN_FOLDERS.has(name)) return;
        const parentNames = new Set(
          allPaths.filter(path => path[depth] === name).map(path => path[depth - 1])
        );
        const connections = this.skillNodes
          .filter(node => node.level === depth - 1 && parentNames.has(node.folder!))
          .map(node => node.id);
        // Its parent folder is hidden (or missing), so it stays hidden too
        if (connections.length === 0) return;

        this.skillNodes.push({
          id: `level${depth}-${name}-${index}`, // Ensure unique IDs
          title: this.folderTitle(name),
          folder: name,
          category: 'Detailed Category',
          notes: [],
          unlocked: true,
          position: { x: 0, y: 0 }, // Temporary position
          connections,
          level: depth
        });
      });
    }
  }

  onNodeEnter(node: SkillNode) {
    // Walk the connections back to the root
    const path = new Set<string>([node.id]);
    const queue = [node];
    while (queue.length > 0) {
      const current = queue.shift()!;
      current.connections.forEach(id => {
        if (path.has(id)) return;
        path.add(id);
        const parent = this.skillNodes.find(n => n.id === id);
        if (parent) queue.push(parent);
      });
    }
    this.hoveredPath = path;
    this.lightUp(node);
  }

  onNodeLeave() {
    // A tapped node on mobile keeps its path lit
    if (!this.activeMobileNode) {
      this.hoveredPath = new Set();
      this.litNodeId = null;
    }
  }

  /** Picks a different effect than last time, so lighting up doesn't feel the same every time */
  private lightUp(node: SkillNode) {
    if (this.litNodeId === node.id) return;
    const choices = this.lightEffects.filter(effect => effect !== this.litEffect);
    this.litEffect = choices[Math.floor(Math.random() * choices.length)];
    this.litNodeId = node.id;
  }

  getLightClass(node: SkillNode): string {
    return this.litNodeId === node.id ? `light-${this.litEffect}` : '';
  }

  /** Technologies a note uses, shown as hashtags next to its title */
  getNoteTechnologies(note: Note): string[] {
    return note.technologies.filter(tech => tech && tech.trim() !== '');
  }

  isInHoveredPath(node: SkillNode): boolean {
    return this.hoveredPath.has(node.id);
  }

  private loadNotes() {
    // Every note, or only the picked quest's
    this.filteredNotes = this.treeNotes();
    
    console.log('Filtered notes:', this.filteredNotes.length);
    
    // Categorize notes into skill nodes
    this.categorizeNotes();
  }

  private categorizeNotes() {
    this.skillNodes.forEach(node => {
      node.notes = this.filteredNotes.filter(note => {
        if (node.id === ROOT_NODE_ID) {
          return note.folder.includes(ROOT_FOLDER);
        }
        // Folder view: match notes to skill nodes based on their folder structure
        if (node.id.startsWith('folder-')) {
          // A main node lists every note filed under its folder, except notes that are
          // only there through a hidden subfolder
          return this.noteService.getFolderPaths(note).some(([folder, subFolder]) =>
            folder === node.folder && !(subFolder && HIDDEN_FOLDERS.has(subFolder))
          );
        } else if (node.id.startsWith('subfolder-')) {
          // Extract subfolder name by removing 'subfolder-' prefix and any trailing index
          const subFolderName = node.id.replace(/^subfolder-/, '').replace(/-\d+$/, '');
          return note.subFolder.includes(subFolderName);
        } else if (node.level !== undefined && node.level >= 2) {
          return this.noteService.getFolderPaths(note).some(path => path[node.level!] === node.folder);
        }
        return false;
      });
      
      if (node.notes.length > 0) {
        console.log(`Node ${node.title} has ${node.notes.length} notes`);
        node.notes.forEach(note => {
          console.log(`  - ${note.title} (ID: ${note.id})`);
        });
      }
    });
  }

  private folderTitle(folder: string): string {
    const label = FOLDER_LABELS[folder];
    // Labels are written as they should read (e.g. "front-end dev"), so only the first letter changes
    return label ? label.charAt(0).toUpperCase() + label.slice(1) : this.capitalizeFirst(folder);
  }

  private folderKey(node: SkillNode): string {
    return node.folder ?? node.title.toLowerCase();
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
  }

  private calculateAllPositions() {
    const colors = FOLDER_COLORS;
    
    // First pass: assign colors to the root and the main folders
    this.skillNodes.forEach(node => {
      if (this.isMainNode(node)) {
        node.color = colors[this.folderKey(node)];
        node.level = 0;
      }
    });
    
    // Second pass: assign colors to subnodes based on their parent folder
    this.skillNodes.forEach(node => {
      if (node.color) return; // Skip if already colored (main folders)
      
      // Subnodes take their parent folder's color
      let parentColor = '#95A5A6'; // Default fallback color
      if (node.connections.length > 0) {
        const parentNode = this.skillNodes.find(parent => 
          node.connections.includes(parent.id) && parent.color
        );
        if (parentNode) {
          parentColor = parentNode.color!;
        }
      }
      node.color = parentColor;
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
    const rootNode = this.skillNodes.find(node => node.id === ROOT_NODE_ID);
    // Keep the main folders in a fixed order around the root
    const folderOrder = (node: SkillNode) => {
      const index = MAIN_FOLDERS.indexOf(this.folderKey(node));
      return index === -1 ? MAIN_FOLDERS.length : index;
    };
    const mainFolders = this.skillNodes
      .filter(node => node.id.startsWith('folder-'))
      .sort((a, b) => folderOrder(a) - folderOrder(b));
    const middleLevelNodes = this.skillNodes.filter(node => node.id.startsWith('subfolder-'));
    // Sub-subfolders and deeper, parents before their children
    const deepNodes = this.skillNodes
      .filter(node => (node.level ?? 0) >= 2)
      .sort((a, b) => a.level! - b.level!);

    // ---------------------------------------------------------
    // UNIVERSAL RAY-BASED LAYOUT (ALL VIEWS)
    // ---------------------------------------------------------
    const level0Distance = 220; // Main folders around the root
    const level1Distance = 470; // Level 1 nodes
    const minNodeDistance = 200; // Increased minimum distance to prevent edge overlaps

    // 1. Position the root in the center, the main folders around it, and assign rays
    if (rootNode) {
      rootNode.position = { x: centerX, y: centerY };
    }
    const folderAngles = new Map<string, number>();
    mainFolders.forEach((node, index) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * index) / mainFolders.length;
      folderAngles.set(node.id, angle);
      node.position = {
        x: centerX + level0Distance * Math.cos(angle),
        y: centerY + level0Distance * Math.sin(angle)
      };
    });

    // 2. Position Level 1 nodes (subfolders) along their parent folder's ray
    const level1Angles = new Map<string, number>();
    // Siblings share their folder's slice of the circle evenly instead of piling up on one ray
    const sliceWidth = (2 * Math.PI / Math.max(mainFolders.length, 1)) * 0.8;
    const siblingsOf = (parentId: string) =>
      middleLevelNodes.filter(sibling => sibling.connections[0] === parentId);
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
      
      // Quests that only belong to the root get their own ray between the folders
      if (parentId === ROOT_NODE_ID && mainFolders.length > 0) {
        baseAngle = -Math.PI / 2 + Math.PI / mainFolders.length;
      }
      
      if (parentAngle !== undefined) {
        const siblings = siblingsOf(parentId);
        const position = siblings.indexOf(node);
        baseAngle += sliceWidth * ((position + 0.5) / siblings.length - 0.5);
      }
      
      // Children further out follow this node's own angle
      level1Angles.set(node.id, baseAngle);
      
      // Position with some spread along the ray
      const angleJitter = (Math.random() - 0.5) * 0.1; // Small jitter for level 1
      const finalAngle = baseAngle + angleJitter;
      
      node.position = {
        x: centerX + level1Distance * Math.cos(finalAngle),
        y: centerY + level1Distance * Math.sin(finalAngle)
      };
    });

    // 3. Position deeper nodes along their parent's ray, each level further out
    const rayAngles = new Map<string, number>([...folderAngles, ...level1Angles]);
    deepNodes.forEach(node => {
      const parentAngle = rayAngles.get(node.connections[0]);
      // Fallback: random angle
      const baseAngle = parentAngle ?? Math.random() * 2 * Math.PI;
      rayAngles.set(node.id, baseAngle);

      // Wide randomness along the ray for mind map distribution:
      // a random distance within the level's band and up to +/- 45 degrees off the ray
      const minDist = 570 + 300 * (node.level! - 2);
      const distance = minDist + Math.random() * 300;
      const finalAngle = baseAngle + (Math.random() - 0.5) * 1.57;

      node.position = {
        x: centerX + distance * Math.cos(finalAngle),
        y: centerY + distance * Math.sin(finalAngle)
      };
    });

    // 5. Final Collision Resolution (Very strong push for mind map spacing)
    const allNodes = [...(rootNode ? [rootNode] : []), ...mainFolders, ...middleLevelNodes, ...deepNodes];
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

            // The root and the main folders stay pinned so the branches keep their shape;
            // the other node takes the whole push
            const pinnedI = allNodes[i] === rootNode || mainFolders.includes(allNodes[i]);
            const pinnedJ = allNodes[j] === rootNode || mainFolders.includes(allNodes[j]);
            if (pinnedI && pinnedJ) {
              continue;
            } else if (pinnedI) {
              allNodes[j].position.x += pushX * 2;
              allNodes[j].position.y += pushY * 2;
            } else if (pinnedJ) {
              allNodes[i].position.x -= pushX * 2;
              allNodes[i].position.y -= pushY * 2;
            } else {
              allNodes[i].position.x -= pushX;
              allNodes[i].position.y -= pushY;
              allNodes[j].position.x += pushX;
              allNodes[j].position.y += pushY;
            }
          }
        }
      }

      // Log progress for debugging
      if (iter % 20 === 0 && totalOverlaps > 0) {
        console.log(`Iteration ${iter}: ${totalOverlaps} overlaps remaining`);
      }

      if (!hasOverlaps) break;
    }

    // Shift the whole map into positive space so the SVG viewBox can start at 0,0.
    // Shifting (rather than clamping) keeps nodes that reach past the top or left edge
    // from being squashed into a line.
    const margin = 200;
    const minX = Math.min(...this.skillNodes.map(node => node.position.x));
    const minY = Math.min(...this.skillNodes.map(node => node.position.y));
    const shiftX = Math.max(margin, margin - minX);
    const shiftY = Math.max(margin, margin - minY);

    this.skillNodes.forEach(node => {
      node.position.x += shiftX;
      node.position.y += shiftY;
    });
  }





  private findParentFolderForSubFolder(subFolder: string, allNotes: Note[]): string | null {
    const notesWithThisSubFolder = allNotes.filter(note => 
      note.subFolder.includes(subFolder)
    );
    
    const folderCounts: { [key: string]: number } = {};
    notesWithThisSubFolder.forEach(note => {
      note.folder.forEach(folder => {
        folderCounts[folder] = (folderCounts[folder] || 0) + 1;
      });
    });
    
    const mostCommonFolder = Object.keys(folderCounts).reduce((a, b) => 
      folderCounts[a] > folderCounts[b] ? a : b, ''
    );
    
    return mostCommonFolder;
  }

  private findParentSubFolderForSubSubFolder(subSubFolder: string, allNotes: Note[]): string | null {
    const notesWithThisSubSubFolder = allNotes.filter(note => 
      note.subSubFolder.includes(subSubFolder)
    );
    
    const subFolderCounts: { [key: string]: number } = {};
    notesWithThisSubSubFolder.forEach(note => {
      note.subFolder.forEach(subFolder => {
        subFolderCounts[subFolder] = (subFolderCounts[subFolder] || 0) + 1;
      });
    });
    
    const mostCommonSubFolder = Object.keys(subFolderCounts).reduce((a, b) => 
      subFolderCounts[a] > subFolderCounts[b] ? a : b, ''
    );
    
    return mostCommonSubFolder;
  }

  onNodeClick(node: SkillNode) {
    console.log('Node clicked:', node.title, 'isMobile:', this.isMobile, 'notes:', node.notes.length);
    
    if (this.isMobile) {
      // On mobile, toggle the active state to show/hide content like hover
      if (node.notes.length > 0) {
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
      // On desktop, emit the first note if available
      if (node.notes.length > 0) {
        this.noteClicked.emit(node.notes[0]);
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

  onNoteClick(note: Note) {
    this.noteClicked.emit(note);
    // Close mobile overlay when note is clicked
    if (this.isMobile) {
      this.activeMobileNode = null;
    }
  }

  isMobileNodeActive(nodeId: string): boolean {
    return this.isMobile && this.activeMobileNode === nodeId;
  }

  isMainNode(node: SkillNode): boolean {
    return node.id === ROOT_NODE_ID || node.id.startsWith('folder-');
  }

  /** Main nodes and subnodes are filled with their color; deeper nodes are outlined */
  isFilledNode(node: SkillNode): boolean {
    return this.isMainNode(node) || node.level === 1;
  }

  onContainerClick(event: MouseEvent) {
    console.log('Container clicked:', event.target);
    this.questPickerOpen = false;
    
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
    this.lastPointer = { x: event.clientX, y: event.clientY };
    // A few pixels of jitter don't count as moving on
    if (this.hoverPaused && this.pausedAt &&
        this.getDistance(this.pausedAt.x, this.pausedAt.y, event.clientX, event.clientY) > 6) {
      this.hoverPaused = false;
      this.pausedAt = null;
    }
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
    // Use document dimensions for more accurate viewport size
    const containerWidth = document.documentElement.clientWidth || window.innerWidth;
    const containerHeight = (document.documentElement.clientHeight || window.innerHeight) - 40; // Account for top margin
    // Put the root (marketing) in the middle of the viewport; the transform origin is (0, 0)
    const root = this.skillNodes.find(node => node.id === ROOT_NODE_ID);
    const rootX = root ? root.position.x : 800;
    const rootY = root ? root.position.y : 700;
    this.translateX = containerWidth / 2 - rootX * this.scale;
    this.translateY = containerHeight / 2 - rootY * this.scale;
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
    
    // Branches from a main folder to the root take the folder's color
    if (targetNode.id === ROOT_NODE_ID && node.id.startsWith('folder-')) {
      return node.color || '#95A5A6';
    }
    
    // If the target is the root or a main folder, use its color
    if (this.isMainNode(targetNode)) {
      return targetNode.color || '#95A5A6';
    }
    
    // If the source is a main folder and the target is a subfolder,
    // use the source's color (the main folder color)
    if (this.isMainNode(node)) {
      return node.color || '#95A5A6';
    }
    
    // For other cases, try to find a main folder in the target's connections
    if (targetNode.connections.length > 0) {
      const categoryNode = this.skillNodes.find(parent => 
        targetNode.connections.includes(parent.id) && 
        this.isMainNode(parent)
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
    return !this.isMainNode(node) && this.hasInitialized;
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
