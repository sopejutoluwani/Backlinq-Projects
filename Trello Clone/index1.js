//Project Management System - Trello Clone

//Core Classes with Encapsulation and Inheritance
class TaskCard {
  #id;
  #createdAt;
  #comments = [];
  #priority = ["low", "medium", "high"];

  constructor(title, description, dueDate, assignedTo, labels = []) {
    this.#id = TaskCard.generateId();
    this.title = title;
    this.labels = labels;
    this.description = description;
    this.dueDate = dueDate;
    this.assignedTo = assignedTo;
    this.status = "To Do";
    this.#createdAt = new Date();
  }
  //generate unique ID
  static generateId() {
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  }

  //addLabel
  addLabel(label) {
    this.labels.push(label);
  }
  removeLabel(label) {
    this.labels = this.labels.filter((l) => l !== label);
  }

  //add comment to task card
  addComment(user, text) {
    this.#comments.push({ user, text, date: new Date() });
  }

  //get comments i.e returns all comments
  getComments() {
    return this.#comments;
  }

  //public getter for id (exposes private #id safely)
  get id() {
    return this.#id;
  }

  //set priority of task card
  set Priority(level) {
    if (this.#priority.includes(level)) {
      this.priority = level;
    } else {
      throw new Error("Invalid priority level");
    }
  }

  //get priority of task card
  get Priority() {
    return this.priority;
  }

  //check if task is overdue
  isOverdue() {
    const now = new Date();
    return now > this.dueDate;
  }
}

//List management with composition
class TaskList {
  constructor(name, cards = []) {
    this.name = name; //name of the list
    this.cards = cards;
  }

  //add card to list
  addCard(card) {
    this.cards.push(card);
  }

  //remove card from list by id
  removeCard(cardId) {
    this.cards = this.cards.filter((card) => card.id !== cardId);
  }

  //move card between lists
  moveCard(cardId, targetList) {
    const cardIndex = this.cards.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      const [card] = this.cards.splice(cardIndex, 1); // using splice to remove the card because it returns the removed element
      targetList.addCard(card);
    }
  }

  //get cards by there priority
  getCardsByPriority(priority) {
    return this.cards.filter((card) => card.Priority === priority);
  }

  //get overdue cards
  getOverdueCards() {
    return this.cards.filter((card) => card.isOverdue());
  }

  //getter for total cards in the list
  get cardCount() {
    return this.cards.length;
  }
}

//Board with Advanced composition
class Board {
  #id;
  constructor(name, lists = [], members = []) {
    this.#id = Board.generateId();
    this.name = name;
    this.lists = lists;
    this.members = members;
  }

  //get id
  get id() {
    return this.#id;
  }
  //generate unique ID for board
  static generateId() {
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  }

  //add list to board
  addList(listName) {
    this.lists.push(listName);
  }

  //remove list from board
  deleteList(listName) {
    this.lists = this.lists.filter((list) => list.name !== listName);
  }

  //add member to board
  addMember(user) {
    this.members.push(user);
  }
  //remove member from board
  removeMember(userId) {
    this.members = this.members.filter((member) => member.id !== userId);
  }

  //move card between lists on the board
  moveCardBetweenLists(cardId, sourceListName, targetListName) {
    const sourceList = this.lists.find((list) => list.name === sourceListName); //find the source list by its name
    const targetList = this.lists.find((list) => list.name === targetListName); //find the target list by its name

    //check if both lists exist
    if (sourceList && targetList) {
      sourceList.moveCard(cardId, targetList); //calling the moveCard method from TaskList class
    } else {
      console.log("Source or Target list not found on the board");
      //throw new Error("Source or Target list not found on the board");
    }
  }

  //search cards across all lists by title/description keyword
  searchCards(keyword) {
    const results = []; //array to hold search results
    this.lists.forEach((list) => {
      //iterate through each list on the board
      list.cards.forEach((card) => {
        //iterate through each card in the list
        if (
          card.title.includes(keyword) ||
          card.description.includes(keyword)
        ) {
          //check if title or description contains the keyword
          results.push(card); //push matching card to results array
        } else {
          console.log("No matching cards found.");
        }
      });
    });
    return results; //return all matching cards
  }

  //get stats of the board
  getBoardStats() {
    const stats = {
      totalLists: this.lists.length, //number of lists on the board
      totalCards: this.lists.reduce((sum, list) => sum + list.cardCount, 0), //total number of cards across all lists
      overdueCards: 0, //number of overdue cards
      priorityCounts: { low: 0, medium: 0, high: 0 },
    };
    this.lists.forEach((list) => {
      list.cards.forEach((card) => {
        //count overdue cards
        if (card.isOverdue()) {
          stats.overdueCards += 1;
        }
        //count cards by priority
        if (card.Priority in stats.priorityCounts) {
          stats.priorityCounts[card.Priority] += 1; //count by priority
        }
      });
    });
    return stats; //return all collected stats
  }
}

//User system with Abstraction
class User {
  constructor(id, name, email, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role; //e.g., Admin, Member, Viewer
  }

  //abstract method to get permissions based on role
  getPermissions() {
    throw new Error("Method 'getPermissions()' must be implemented.");
  }
}

//Admin user extending User class
class AdminUser extends User {
  constructor(id, name, email) {
    super(id, name, email, "Admin");
  }
  //manage board
  //can delete users from the board based on role permissions
  deleteMember(board, userId) {
    // only admin can delete users from the board
    if (this.getPermissions().canRemoveMembers) {
      board.removeMember(userId);
    }
  }
  addMember(board, user) {
    if (this.getPermissions().canAddMembers) {
      board.addMember(user);
    }
  }

  //create task card
  createTaskCard(title, description, dueDate, assignedTo) {
    if (this.getPermissions().canCreateTaskCard) {
      return new TaskCard(title, description, dueDate, assignedTo);
    }
  }

  //update task card
  updateTaskCard(card, newDetails) {
    if (this.getPermissions().canUpdateTaskCard) {
      Object.assign(card, newDetails);
    }
  }

  //view board details
  viewBoard(board) {
    if (this.getPermissions().canView) {
      return board;
    }
  }

  //delete boards
  /*deleteBoard(board) {
        if (this.getPermissions().canDeleteBoards) {    
            //logic to delete the board
            
        }
    }*/
  /*Admin cant delete boards because it's a critical operation and 
  their credentials is included in the board data if board is 
  deleted their access is lost too.*/

  getPermissions() {
    return {
      canUpdateTaskCard: true,
      canCreateTaskCard: true,
      canAddMembers: true,
      canDeleteBoards: true,
      canRemoveMembers: true,
      canView: true,
    };
  }
}

//Member user extending User class
class MemberUser extends User {
  constructor(id, name, email) {
    super(id, name, email, "Member");
  }
  //can create and update task cards
  updateTaskCard(card, newDetails) {
    if (this.getPermissions().canUpdateTaskCard) {
      Object.assign(card, newDetails);
    }
  }
  //create task card
  createTaskCard(title, description, dueDate, assignedTo) {
    if (this.getPermissions().canCreateTaskCard) {
      return new TaskCard(title, description, dueDate, assignedTo);
    }
  }
  getPermissions() {
    return {
      canUpdateTaskCard: true,
      canCreateTaskCard: true,
      canAddMembers: false,
      canDeleteBoards: false,
      canRemoveMembers: false,
      canEditOwnCards: true,
      canView: true,
    };
  }
}

//guest user extending User class
class GuestUser extends User {
  constructor(id, name, email) {
    super(id, name, email, "Guest");
  }
  getPermissions() {
    return {
      canUpdateTaskCard: false,
      canCreateTaskCard: false,
      canAddMembers: false,
      canDeleteBoards: false,
      canRemoveMembers: false,
      canView: true,
    };
  }

  //view board details
  viewBoard(board) {
    if (this.getPermissions().canView) {
      return board;
    }
  }
}

//Activity tracking with observer pattern
class ActivityLog {
  #activities = [];

  logActivity(user, action, details, timestamp = new Date().getTime()) {
    this.#activities.push({ user, action, details, timestamp });
  }

  //get recent activities
  getRecentActivities(limit = 10) {
    return this.#activities.slice(-limit).reverse();
  }

  //get activities by user
  getActivitiesByUser(userId) {
    return this.#activities.filter((activity) => activity.user.id === userId);
  }

  //formatted string summary of activities
  exportLogSummary() {
    let summary = "Activity Log Summary:\n";
    this.#activities.forEach((activity) => {
      summary += `[${new Date(activity.timestamp).toLocaleString()}] User: ${
        activity.user.name
      }, Action: ${activity.action}, Details: ${activity.details}\n`;
    });
    console.log(summary);
    return summary;
  }
}

// Advaced Features
class Label {
  constructor(name, color) {
    this.name = name;
    this.color = color; // e.g., 'red', 'blue', 'green'
  }
}

//Board Management with Advanced composition
class BoardManager {
  constructor() {
    if (BoardManager.instance) {
      return BoardManager.instance; // returning the existing instance
    }

    this.boards = [];
    BoardManager.instance = this; // storing the instance
  }

  static getInstance() {
    if (!BoardManager.instance) {
      BoardManager.instance = new BoardManager();
    }
    return BoardManager.instance;
  }

  //create new board
  createBoard(name) {
    const newBoard = new Board(name);
    this.boards.push(newBoard);
    console.log(`Board "${name}" created with ID: ${newBoard.id}`);
    return newBoard;
  }

  //delete board by id
  deleteBoard(boardId) {
    this.boards = this.boards.filter((board) => board.id !== boardId);
    console.log(`Board with ID: ${boardId} deleted.`);
  }

  //get all boards
  getAllBoards() {
    //console.log("All Boards:");
    this.boards.forEach((board) => {
      //console.log(board);
      console.log(`ID: ${board.id}, Name: ${board.name}`);
    });
    return this.boards;
  }
}

//Example Usage
// Example Usage
const manager = BoardManager.getInstance();
const boardA = manager.createBoard("Development");
const boardB = manager.createBoard("Marketing");

//add users
//development team
const adminA1 = new AdminUser(1, "Alice", "alice@example.com");
const memberA1 = new MemberUser(2, "Bob Dev", "bob@company.com");

//Marketing team
const adminB1 = new AdminUser(3, "John", "john@market.com");
const memberB1 = new MemberUser(4, "Jane Market", "jane@market.com");
const memberB2 = new MemberUser(5, "Mike Sales", "mike@sales.com");

//add members to boardA
boardA.addMember(adminA1);
boardA.addMember(memberA1);

//add members to boardB
boardB.addMember(adminB1);
boardB.addMember(memberB1);
boardB.addMember(memberB2);

//console.log(boardA.members);
//console.log(boardB.members);

//create lists to add board
const todoList = new TaskList("To Do");
const inProgressList = new TaskList("In Progress");
const doneList = new TaskList("Done");

//add created lists to boardA
boardA.addList(todoList);
boardA.addList(inProgressList);
boardA.addList(doneList);

//add created lists to boardB
boardB.addList(todoList);
boardB.addList(inProgressList);
boardB.addList(doneList);

//nodemanager.getAllBoards();

//creating Taskcard by Admin user and Member user
/*adminA1.createTaskCard(
  "front end fix",
  "change the styling of the submit button in the login page",
  "2 days from now",
  "Bob Dev"
);

memberA1.createTaskCard(
  "front end fix",
  "change the color of submit button",
  "2 days from now",
  "Bob Dev"
);

memberA1.createTaskCard(
  "front end fix",
  "change the size of submit button",
  "2 days from now",
  "Bob Dev"
);*/

//create and add Cards

const card1 = new TaskCard(
  "Design homepage",
  "Create mockups for new homepage",
  new Date("2025-11-15")
);

const card2 = new TaskCard(
  "design Aboutpage",
  "create mockups for Aboutpage",
  new Date("2025-12-15")
);

card1.assignedTo = memberA1;
card1.addLabel(new Label("Design", "#FF5733"));

// Add comments

card1.addComment(adminA1, "Please include mobile responsive design");
card1.addComment(memberA1, "Will do!");
card1.Priority = "high";

//card2
card2.assignedTo = memberB1;
card2.Priority = "low";
card2.addLabel(new Label("Design", "#FF5733"));
card2.addComment(adminA1, "Please include mobile responsive design");
card2.addComment(memberA1, "Will do!");

boardA.lists[0].addCard(card1);
boardB.lists[0].addCard(card2);

//move card between lists

boardA.moveCardBetweenLists(card1.id, "To Do", "In Progress");

console.log(boardB.getBoardStats());
console.log(boardA.searchCards("Aboutpage")); 