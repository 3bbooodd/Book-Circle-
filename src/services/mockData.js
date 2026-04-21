// ✅ IMPORTS (لازم فوق خالص)
import atomic from "../assets/atomic-habits.png";
import crime from "../assets/crime.png";
import hundrad from "../assets/hundrad.png";
import shadow from "../assets/shadow.png";
import dune from "../assets/dune.png";
import nagib from "../assets/nagib.png";
import alchemist from "../assets/alchemist.png";
import brief from "../assets/brief.png";




// ─── BOOKS ─────────────────────────────────────────
export const BOOKS = [
  {
    id: 1,
    title: "The Shadow of the Wind",
    owner: "Layla Hassan",
    genre: "Mystery",
    isbn: "978-0143034902",
    language: "English",
    pubDate: "2001",
    price: 15,
    status: "Available",
    likedBy: [],
    comments: [],
    likes:1,
    image:shadow
  },
  {
    id: 2,
    title: "Naguib Mahfouz: The Cairo Trilogy",
    owner: "Omar Farouk",
    genre: "Literary Fiction",
    isbn: "978-1400075577",
    language: "Arabic",
    pubDate: "1956",
    price: 10,
    status: "Borrowed",
    likedBy: [],
    comments: [],
    likes:50,
    image: nagib
   
    
  },
  {
    id: 3,
    title: "Dune",
    owner: "Rami Elwan",
    genre: "Sci-Fi",
    isbn: "978-0441013593",
    language: "English",
    pubDate: "1965",
    price: 20,
    status: "Available",
    comments: [],
    likes:10,
    likedBy: [],
     image: dune
  },
  {
  id: 4,
  title: "Crime",
  owner: "Sara Khaled",
  genre: "Classic",
  image: crime, // 🔥 ضيف دي
  isbn: "978-0143058144",
  language: "Russian",
  pubDate: "1866",
  price: 8,
  status: "Available",
 likedBy: [],
 likes:39,
  comments: [],
},
  {
    id: 5,
    title: "One Hundred Years of Solitude",
    owner: "Nour Ibrahim",
    genre: "Magic Realism",
    isbn: "978-0060883287",
    language: "Spanish",
    pubDate: "1967",
    price: 18,
    status: "Borrowed",
    likedBy: [],
    likes:34,
    comments: [],
    image:hundrad
  
  },
  {
    id: 6,
    title: "The Alchemist",
    owner: "Layla Hassan",
    genre: "Philosophy",
    isbn: "978-0062315007",
    language: "Portuguese",
    pubDate: "1988",
    price: 12,
    status: "Available",
    likedBy: [],
    likes:26,
    comments: [],
    image: alchemist
  },
  {
    id: 7,
    title: "Sapiens: A Brief History",
    owner: "Karim Samir",
    genre: "Non-Fiction",
    isbn: "978-0062316097",
    language: "English",
    pubDate: "2011",
    price: 22,
    status: "Available",
   likedBy: [],
    comments: [],
    likes:18,
    image:brief
  },
  {
    id: 8,
    title: "Atomic Habits",
    owner: "Dina Mostafa",
    genre: "Self-Help",
    image: atomic, // 🔥 الصورة هنا
    isbn: "978-0735211292",
    language: "English",
    pubDate: "2018",
    price: 15,
    status: "Available",
    likedBy: [],
    likes:200,
    comments: [],
   
  },
];

// ─── USERS ─────────────────────────────────────────
export const USERS = [
  {
    id: 1,
    name: "Layla Hassan",
    email: "layla@example.com",
    role: "Book Owner",
    status: "Active",
    joined: "Jan 2025",
    books: 4,
  },
  {
    id: 2,
    name: "Omar Farouk",
    email: "omar@example.com",
    role: "Book Owner",
    status: "Pending",
    joined: "Mar 2025",
    books: 2,
  },
  {
    id: 3,
    name: "Rami Elwan",
    email: "rami@example.com",
    role: "Reader",
    status: "Active",
    joined: "Feb 2025",
    books: 0,
  },
  {
    id: 4,
    name: "Sara Khaled",
    email: "sara@example.com",
    role: "Book Owner",
    status: "Active",
    joined: "Apr 2025",
    books: 3,
  },
];

// ─── BORROW REQUESTS ─────────────────────────────────
export const BORROW_REQUESTS = [
  {
    id: 1,
    book: "The Shadow of the Wind",
    requester: "Rami Elwan",
    date: "Apr 12, 2025",
    status: "Pending",
  },
  {
    id: 2,
    book: "Dune",
    requester: "Nour Ibrahim",
    date: "Apr 10, 2025",
    status: "Accepted",
  },
  {
    id: 3,
    book: "The Alchemist",
    requester: "Karim Samir",
    date: "Apr 8, 2025",
    status: "Rejected",
  },
];

// ─── NOTIFICATIONS ─────────────────────────────────
export const NOTIFICATIONS = [
  {
    id: 1,
    icon: "📬",
    msg: 'Rami Elwan requested to borrow "The Shadow of the Wind"',
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    icon: "💬",
    msg: 'Sara commented on your book post "Dune"',
    time: "5 hours ago",
    unread: true,
  },
  {
    id: 3,
    icon: "✅",
    msg: 'Your borrow request for "The Alchemist" was accepted',
    time: "1 day ago",
    unread: false,
  },
  {
    id: 4,
    icon: "👤",
    msg: "New Book Owner registration pending approval",
    time: "2 days ago",
    unread: false,
  },
];