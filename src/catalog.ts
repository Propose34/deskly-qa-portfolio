export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  color: string;
  art: string;
  note: string;
};
export const products: Product[] = [
  {
    id: "lamp",
    name: "Arc desk lamp",
    category: "Lighting",
    price: 1200,
    stock: 3,
    color: "#e4e8da",
    art: "lamp",
    note: "A little light. A lot of focus.",
  },
  {
    id: "keyboard",
    name: "Pebble keyboard",
    category: "Tech",
    price: 2400,
    stock: 4,
    color: "#e9e3f1",
    art: "keyboard",
    note: "Quiet keys for your loudest ideas.",
  },
  {
    id: "tray",
    name: "Everyday catchall",
    category: "Accessories",
    price: 800,
    stock: 5,
    color: "#f0e5d6",
    art: "tray",
    note: "Everything in its happy place.",
  },
  {
    id: "headphones",
    name: "Cloud headphones",
    category: "Tech",
    price: 3200,
    stock: 2,
    color: "#e2e9f0",
    art: "headphones",
    note: "Find your own little quiet.",
  },
  {
    id: "notebook",
    name: "Sunday notebook",
    category: "Stationery",
    price: 400,
    stock: 8,
    color: "#eee4db",
    art: "notebook",
    note: "Big plans start on a blank page.",
  },
  {
    id: "plant",
    name: "Little green friend",
    category: "Accessories",
    price: 600,
    stock: 0,
    color: "#dde9df",
    art: "plant",
    note: "A fresh perspective for your desk.",
  },
];
