import { ReactNode } from "react";
import { View, Text } from "react-native";
import { useUserRole } from "../firebase/hooks/useUserRole";

type AdminOnlyProps = {
    children: ReactNode;
};

export default function AdminOnly({ children }: AdminOnlyProps) {
  const { isAdmin, loading } = useUserRole();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}