import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context"
import { StackParamsList } from "../navigators/StackNavigator";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { usePreferences } from "../context/ThemeProvider";
import { Text } from "react-native-paper";


const TodoPage = () => {
  
  const route = useRoute<RouteProp<StackParamsList,"TodoPage">>()
  
  const { theme } = usePreferences();
  
  const todo = route.params.todo
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
              contentContainerStyle={{
                padding: 16,
                gap: 16,
              }}
              showsVerticalScrollIndicator={false}
            >
              <Text
                variant="headlineMedium"
                style={{
                  color: theme.colors.onBackground,
                  fontWeight: "600",
                  marginBottom: 8,
                }}
              >
                Editar Tarefa
              </Text>
      
              <View style={{ width: "100%" }}>
                <FormEditTodo todo={todo} />
              </View>
            </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardContent: {
    paddingTop: 0,
  },
});

export default TodoPage;