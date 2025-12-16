import { Button } from "./ui/button";
import { useAuth } from "../contexts/auth-context";

export const RoleSwitch = () => {
  const { user, switchToTeacher } = useAuth();

  const toggleRole = async () => {
    if (!user) return;

    try {
      await switchToTeacher();
    } catch (error) {
      console.error("Failed to switch role:", error);
    }
  };

  if (!user || user.userType === "admin") return null;

  return (
    <Button onClick={toggleRole} variant="outline" className="ml-4">
      Switch to {user.userType === "student" ? "Teacher" : "Student"} Mode
    </Button>
  );
};
