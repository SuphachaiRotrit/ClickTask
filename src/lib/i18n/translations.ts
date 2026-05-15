export type Locale = "en" | "th";

export const translations = {
  // Common
  "common.cancel": { en: "Cancel", th: "ยกเลิก" },
  "common.save": { en: "Save", th: "บันทึก" },
  "common.delete": { en: "Delete", th: "ลบ" },
  "common.edit": { en: "Edit", th: "แก้ไข" },
  "common.add": { en: "Add", th: "เพิ่ม" },
  "common.close": { en: "Close", th: "ปิด" },
  "common.search": { en: "Search anything...", th: "ค้นหา..." },
  "common.noData": { en: "No data", th: "ไม่มีข้อมูล" },
  "common.of": { en: "of", th: "จาก" },
  "common.items": { en: "items", th: "รายการ" },
  "common.name": { en: "Name", th: "ชื่อ" },
  "common.complete": { en: "complete", th: "เสร็จแล้ว" },
  "common.preview": { en: "Preview", th: "ตัวอย่าง" },
  "common.done": { en: "Done", th: "เสร็จสิ้น" },
  "common.remaining": { en: "remaining", th: "ที่เหลือ" },
  "common.clearAll": { en: "Clear all", th: "ล้างทั้งหมด" },

  // Sidebar
  "sidebar.dashboard": { en: "Dashboard", th: "แดชบอร์ด" },
  "sidebar.myTasks": { en: "My Tasks", th: "งานของฉัน" },
  "sidebar.team": { en: "Team", th: "ทีม" },
  "sidebar.settings": { en: "Settings", th: "ตั้งค่า" },
  "sidebar.expand": { en: "Expand", th: "ขยาย" },
  "sidebar.collapse": { en: "Collapse", th: "ย่อ" },

  // Navbar
  "navbar.dashboard": { en: "Dashboard", th: "แดชบอร์ด" },
  "navbar.notifications": { en: "Notifications", th: "การแจ้งเตือน" },
  "navbar.profile": { en: "Profile", th: "โปรไฟล์" },
  "navbar.settings": { en: "Settings", th: "ตั้งค่า" },
  "navbar.logout": { en: "Log out", th: "ออกจากระบบ" },

  // Dashboard
  "dashboard.title": { en: "Task Board", th: "บอร์ดงาน" },
  "dashboard.subtitle": {
    en: "Manage and track your project tasks",
    th: "จัดการและติดตามงานโปรเจกต์ของคุณ",
  },
  "dashboard.newTask": { en: "New Task", th: "สร้างงานใหม่" },
  "dashboard.searchPlaceholder": {
    en: "Search tasks by title, description, or tags...",
    th: "ค้นหาตามชื่อ, รายละเอียด, หรือแท็ก...",
  },
  "dashboard.allStatus": { en: "All Status", th: "ทุกสถานะ" },
  "dashboard.allPriority": { en: "All Priority", th: "ทุกลำดับ" },
  "dashboard.noTasks": { en: "No tasks", th: "ไม่มีงาน" },

  // Task Dialog
  "task.taskName": { en: "Task Name", th: "ชื่องาน" },
  "task.addDescription": { en: "Add description", th: "เพิ่มรายละเอียด" },
  "task.description": { en: "Description", th: "รายละเอียด" },
  "task.createTask": { en: "Create Task", th: "สร้างงาน" },
  "task.deleteTask": { en: "Delete Task", th: "ลบงาน" },
  "task.deleteTaskConfirm": {
    en: "Are you sure you want to delete this task? This action cannot be undone.",
    th: "คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
  },
  "task.subtasks": { en: "Subtasks", th: "งานย่อย" },
  "task.addSubtask": { en: "Add subtask...", th: "เพิ่มงานย่อย..." },
  "task.addImage": { en: "Add Image", th: "เพิ่มรูป" },
  "task.addLink": { en: "Add Link", th: "เพิ่มลิงก์" },
  "task.deleteImage": { en: "Delete Image", th: "ลบรูป" },
  "task.deleteImageConfirm": {
    en: "Are you sure you want to delete this image? This action cannot be undone.",
    th: "คุณแน่ใจหรือไม่ว่าต้องการลบรูปนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
  },
  "task.open": { en: "Open", th: "เปิดดู" },
  "task.taskCompleted": { en: "Task completed", th: "งานเสร็จสมบูรณ์" },
  "task.taskNotStarted": {
    en: "Task not started yet",
    th: "งานยังไม่ได้เริ่ม",
  },

  // Properties
  "prop.status": { en: "Status", th: "สถานะ" },
  "prop.priority": { en: "Priority", th: "ลำดับความสำคัญ" },
  "prop.assignees": { en: "Assignees", th: "ผู้รับผิดชอบ" },
  "prop.dates": { en: "Dates", th: "วันที่" },
  "prop.tags": { en: "Tags", th: "แท็ก" },
  "prop.dueDate": { en: "Due Date", th: "กำหนดส่ง" },
  "prop.progress": { en: "Progress", th: "ความคืบหน้า" },
  "prop.created": { en: "Created", th: "สร้างเมื่อ" },
  "prop.overdue": { en: "Overdue", th: "เกินกำหนด" },
  "prop.noDueDate": { en: "No due date", th: "ไม่มีกำหนดส่ง" },
  "prop.unassigned": { en: "Unassigned", th: "ยังไม่กำหนดผู้รับผิดชอบ" },
  "prop.addTags": { en: "Add tags", th: "เพิ่มแท็ก" },
  "prop.tagPlaceholder": { en: "Tag name...", th: "ชื่อแท็ก..." },
  "prop.people": { en: "People", th: "สมาชิก" },
  "prop.me": { en: "Me", th: "ฉัน" },

  // Priority
  "priority.urgent": { en: "Urgent", th: "เร่งด่วน" },
  "priority.high": { en: "High", th: "สูง" },
  "priority.medium": { en: "Medium", th: "ปานกลาง" },
  "priority.low": { en: "Low", th: "ต่ำ" },

  // Date shortcuts
  "date.today": { en: "Today", th: "วันนี้" },
  "date.tomorrow": { en: "Tomorrow", th: "พรุ่งนี้" },
  "date.nextWeek": { en: "Next week", th: "สัปดาห์หน้า" },
  "date.twoWeeks": { en: "2 weeks", th: "2 สัปดาห์" },
  "date.clear": { en: "Clear", th: "ล้าง" },

  // My Tasks
  "myTasks.title": { en: "My Tasks", th: "งานของฉัน" },
  "myTasks.subtitle": {
    en: "Tasks assigned to you",
    th: "งานที่ได้รับมอบหมายให้คุณ",
  },
  "myTasks.total": { en: "total", th: "ทั้งหมด" },
  "myTasks.noTasks": {
    en: "No tasks assigned",
    th: "ไม่มีงานที่ได้รับมอบหมาย",
  },
  "myTasks.noTasksDesc": {
    en: "Tasks assigned to you will appear here. Create a task and assign it to yourself to get started.",
    th: "งานที่ได้รับมอบหมายให้คุณจะปรากฏที่นี่ สร้างงานและกำหนดให้ตัวเองเพื่อเริ่มต้น",
  },

  // Settings
  "settings.title": { en: "Settings", th: "ตั้งค่า" },
  "settings.subtitle": {
    en: "Configure your workflow statuses and preferences",
    th: "กำหนดค่าสถานะและการตั้งค่าของคุณ",
  },
  "settings.statusManagement": { en: "Status Management", th: "จัดการสถานะ" },
  "settings.statusDesc": {
    en: 'Drag to reorder. Toggle to mark as a "done" state.',
    th: 'ลากเพื่อจัดเรียง เปิดใช้เพื่อเป็นสถานะ "เสร็จสิ้น"',
  },
  "settings.addStatus": { en: "Add Status", th: "เพิ่มสถานะ" },
  "settings.statusName": { en: "Status name", th: "ชื่อสถานะ" },
  "settings.color": { en: "Color", th: "สี" },
  "settings.markAsDone": {
    en: "Mark as Done status",
    th: "ตั้งเป็นสถานะเสร็จสิ้น",
  },
  "settings.deleteStatus": { en: "Delete Status", th: "ลบสถานะ" },
  "settings.deleteStatusConfirm": {
    en: "This will permanently delete this status. Tasks using this status will need to be reassigned. This action cannot be undone.",
    th: "การกระทำนี้จะลบสถานะนี้อย่างถาวร งานที่ใช้สถานะนี้จะต้องถูกกำหนดใหม่ การกระทำนี้ไม่สามารถย้อนกลับได้",
  },
  "settings.addStatusButton": { en: "Add New Status", th: "เพิ่มสถานะใหม่" },
  "settings.unmarkAsDone": {
    en: "Unmark as Done status",
    th: "ยกเลิกสถานะเสร็จสิ้น",
  },
  "settings.markAsDoneTooltip": {
    en: "Mark as Done status",
    th: "กำหนดเป็นสถานะเสร็จสิ้น",
  },
  "settings.statusNamePlaceholder": {
    en: "Enter status name...",
    th: "ระบุชื่อสถานะ...",
  },
  "settings.colorRequired": { en: "Color is required", th: "กรุณาเลือกสี" },
  "settings.colorInvalid": {
    en: "Please enter a valid hex color",
    th: "กรุณาระบุรหัสสีที่ถูกต้อง",
  },
  "settings.colorUsed": {
    en: "This color is already used",
    th: "สีนี้ถูกใช้งานแล้ว",
  },
  "settings.statusExists": {
    en: "This color is already used or status name already exists",
    th: "สีหรือชื่อสถานะนี้ถูกใช้งานไปแล้ว",
  },

  // Team
  "team.title": { en: "Team", th: "ทีม" },
  "team.subtitle": {
    en: "Your team members and their roles",
    th: "สมาชิกทีมและบทบาท",
  },
  "team.members": { en: "Members", th: "สมาชิก" },

  // Theme
  "theme.light": { en: "Light", th: "สว่าง" },
  "theme.dark": { en: "Dark", th: "มืด" },
  "theme.system": { en: "System", th: "ระบบ" },

  // Language
  "lang.en": { en: "English", th: "English" },
  "lang.th": { en: "ไทย", th: "ไทย" },

  // Filter bar
  "filter.clear": { en: "Clear", th: "ล้าง" },
  "filter.showing": { en: "Showing", th: "แสดง" },
  "filter.tasks": { en: "tasks", th: "งาน" },
  "filter.status": { en: "Status", th: "สถานะ" },
  "filter.priority": { en: "Priority", th: "ลำดับ" },
  "filter.statuses": { en: "Statuses", th: "สถานะ" },
  "filter.closed": { en: "Closed", th: "ปิดแล้ว" },
  "filter.search": { en: "Search...", th: "ค้นหา..." },

  // Task card
  "card.attachment": { en: "Attachment", th: "ไฟล์แนบ" },

  // New task dialog extras
  "task.addDescPlaceholder": {
    en: "Add description...",
    th: "เพิ่มรายละเอียด...",
  },
  "task.taskNameRequired": {
    en: "Task name is required",
    th: "กรุณาระบุชื่องาน",
  },
  "task.labelOptional": { en: "Label (optional)", th: "ชื่อ (ไม่บังคับ)" },

  // TaskDetailDialog
  "task.subtasksComplete": { en: "subtasks completed", th: "งานย่อยที่เสร็จ" },

  // Status item
  "settings.statusColorDesc": {
    en: "Manage task status columns displayed on the board. Each status must have a unique color.",
    th: "จัดการคอลัมน์สถานะงานที่แสดงบนบอร์ด สถานะแต่ละอันต้องมีสีที่ไม่ซ้ำกัน",
  },

  // Navbar search
  "search.placeholder": {
    en: "Search tasks, status, priority...",
    th: "ค้นหางาน, สถานะ, ลำดับ...",
  },
  "search.noResults": { en: "No results found", th: "ไม่พบผลลัพธ์" },
  "search.results": { en: "results", th: "ผลลัพธ์" },

  // Mobile
  "mobile.menu": { en: "Menu", th: "เมนู" },
  "mobile.closeMenu": { en: "Close menu", th: "ปิดเมนู" },

  // Team page extras
  "team.comingSoon": { en: "Coming soon", th: "เร็วๆ นี้" },
  "team.comingSoonDesc": {
    en: "Team management features are being developed.",
    th: "ฟีเจอร์การจัดการทีมกำลังพัฒนา",
  },
} as const;

export type TranslationKey = keyof typeof translations;
