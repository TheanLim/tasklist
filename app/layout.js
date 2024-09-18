import { Inter } from "next/font/google";
import "./globals.css";
import TaskListApp from "@/components/TaskListApp";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Task List App",
  description: "A better way to focus on tasks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TaskListApp children={children} />
      </body>
    </html>
  );
}
