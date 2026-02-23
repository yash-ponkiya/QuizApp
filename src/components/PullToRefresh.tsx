import React from "react";
import { RefreshControl } from "react-native";

type Props = {
  refreshing: boolean;
  onRefresh: () => void;
};

export default function PullToRefresh({ refreshing, onRefresh }: Props) {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={["#6C63FF"]}
      tintColor="#6C63FF"
    />
  );
}