JS Project Management System (Trello Clone)

This is a comprehensive JavaScript-based model for a project management system, structured around core object-oriented programming (OOP) principles. It includes entities for Task Cards, Task Lists, Boards, Users (with roles), and Activity Logging.

🏗️ Architectural Overview

The system is built using the following OOP concepts:

| Concept                                                                                                                                          | ClassesInvolved                                    | Description                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | -------------------------------------------- |
| **Encapsulation**                                                                                                                                | `TaskCard`, `Board`, `ActivityLog`, `BoardManager` | Uses private fields (`#id`, `#comments`,     |
| `#activities`) to protect internal data and expose only controlled access through public getters and methods (e.g., `get id()`, `addComment()`). |
| **Inheritance**                                                                                                                                  | `AdminUser`, `MemberUser`, `GuestUser`             | These classes extend the base `User` class,  |
| inheriting shared properties and implementing specific permissions by overriding `getPermissions()` (also showing **Abstraction**).              |
| **Composition**                                                                                                                                  | `TaskList`, `Board`                                | A `Board` is composed of multiple `TaskList` |
| objects, and each `TaskList` is composed of multiple `TaskCard` objects—modeling real-world relationships.                                       |
| **Singleton Pattern**                                                                                                                            | `BoardManager`                                     | Ensures the application has only \*\*one     |
| instance\*\* of `BoardManager`, providing a global access point for managing all boards.                                                         |

💻 Core Classes and Features

1. TaskCard

The fundamental unit of work. Features include:

    Encapsulation: Private fields for #id, #createdAt, and #comments.

    Unique ID: TaskCard.generateId() uses a static method to ensure unique IDs for every card.

    Priority: Uses a setter (set Priority()) to validate that the priority level is one of "low", "medium", or "high".

    Comments: addComment(user, text) allows users to add timestamped comments to the card.

    Time Tracking: isOverdue() checks if the current date has passed the card's dueDate.

2. TaskList

Groups and manages TaskCard objects.

    Composition: Manages an array of TaskCard instances (this.cards).

    Movement: moveCard(cardId, targetList) removes a card from the current list and adds it to the specified targetList.

    Filtering: Provides utility methods like getCardsByPriority(priority) and getOverdueCards().

    Getter: get cardCount() returns the total number of cards in the list.

3. Board

The container for all lists, cards, and members.

    Advanced Composition: Manages TaskLists and User objects (members).

    Member Management: addMember(user) and removeMember(userId).

    Cross-List Operation: moveCardBetweenLists(...) handles moving a card using list names instead of objects, making it easier to use.

    Search: searchCards(keyword) iterates through all lists and returns cards matching the keyword in their title or description.

    Stats: getBoardStats() returns calculated metrics like total lists, total cards, count of overdue cards, and counts by priority.

👤 User & Permissions System

The system uses Inheritance to define user roles, which govern what actions they are permitted to take. The base User class enforces a contract via the abstract getPermissions() method.

📢 Activity Tracking & Board Management

4. ActivityLog

Implements a basic Observer Pattern by acting as a central repository for application events.

    Tracking: logActivity(user, action, details) records a comprehensive event log.

    Retrieval: Provides methods to get recent activities or filter activities by user.

    Export: exportLogSummary() provides a neatly formatted string of all recorded activities.

5. BoardManager

Implements the Singleton Pattern to ensure centralized management of all project boards.

    Instantiation: BoardManager.getInstance() is the required way to access the manager, ensuring only one exists.

    Board CRUD: Provides methods for createBoard(name), deleteBoard(boardId), and getAllBoards().

🚀 Example Usage (Setup)

The included example demonstrates the setup process:

    Instantiation: Creating a single BoardManager instance.

    Board Creation: Creating two boards ("Development" and "Marketing").

    User Creation: Defining users with different roles (AdminUser, MemberUser).

    Board Membership: Assigning users to the appropriate boards.

    List Setup: Creating TaskList instances ("To Do", "In Progress", "Done") and adding them to the boards.

    Card Operations: Creating TaskCard instances, setting priority, assigning members, and moving a card between lists on Board A.

    Stats Retrieval: Calling boardB.getBoardStats() and boardA.searchCards(...) to retrieve data.

To Run This Code:

    Save the code in a file named trello_clone.js.

    Run it using Node.js:
