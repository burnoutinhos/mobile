import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { MergedTheme } from "../../../theme/types";
import { PageableResponse } from "../../../model/types";
import { ITodo } from "../../../model/todo/todo";

 export const TodoHeader = ({pagedTodos, theme} : {pagedTodos?: PageableResponse<ITodo>, theme: MergedTheme}) => (
   <View style={styles.headerInfo}>
     <Text
       variant="bodyMedium"
       style={{ color: theme.colors.onSurfaceVariant }}
     >
       Total de tarefas: {pagedTodos?.totalElements || 0}
     </Text>
   </View>
 );

 const styles = StyleSheet.create({
   headerInfo: {
     paddingHorizontal: 16,
     paddingBottom: 8,
   },
 });
