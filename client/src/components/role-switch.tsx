import { Button } from "./ui/button";
import { useAuth } from "../contexts/auth-context";

export const RoleSwitch = () => {
  const { user, updateUser } = useAuth();

  const toggleRole = () => {
    if (!user) return;

    const newRole = user.userType === "student" ? "teacher" : "student";
    updateUser({ ...user, userType: newRole });
  };

  if (!user || user.userType === "admin") return null;

  return (
    <Button onClick={toggleRole} variant="outline" className="ml-4">
      Switch to {user.userType === "student" ? "Teacher" : "Student"} Mode
    </Button>
  );
};
