import AsyncStorage from "@react-native-async-storage/async-storage";

export const getCurrentUser = async () => {
  const data = await AsyncStorage.getItem("currentUser");
  return data ? JSON.parse(data) : null;
};

const getUserKey = async () => {
  const user = await getCurrentUser();
  return user?.email || null;
};

export const getUserData = async (key: string) => {
  const userKey = await getUserKey();
  if (!userKey) return null;

  const value = await AsyncStorage.getItem(`${key}_${userKey}`);
  return value ? JSON.parse(value) : null;
};

export const setUserData = async (key: string, data: any) => {
  const userKey = await getUserKey();
  if (!userKey) return;

  await AsyncStorage.setItem(`${key}_${userKey}`, JSON.stringify(data));
};

export const addUserItem = async (key: string, item: any) => {
  const list = (await getUserData(key)) || [];
  list.push(item);
  await setUserData(key, list);
};